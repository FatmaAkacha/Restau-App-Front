<template>
  <div class="min-h-screen bg-brand-gray flex items-center justify-center px-4">
    <div class="card max-w-md w-full p-8 text-center">

      <div v-if="loading" class="py-10">
        <div class="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="text-gray-500 mt-4 text-sm">Chargement de votre commande…</p>
      </div>

      <template v-else-if="order">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
             :class="statusStyle.bg">
          <span class="text-3xl">{{ statusStyle.icon }}</span>
        </div>

        <h1 class="text-2xl font-bold mb-1">{{ statusStyle.title }}</h1>
        <p class="text-gray-500 text-sm mb-6">{{ statusStyle.subtitle }}</p>

        <!-- Bannière temps de préparation -->
        <div v-if="order.prep_time && ['confirmed','preparing','ready','delivering'].includes(order.status)"
             class="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5 text-left">
          <p class="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
            ⏱ Temps de préparation
          </p>
          <p class="text-2xl font-bold text-orange-600">{{ order.prep_time }} minutes</p>
          <p class="text-xs text-orange-400 mt-1">Votre commande est en cours de préparation !</p>
        </div>

        <!-- Suivi de statut -->
        <div class="flex items-center justify-between mb-6 px-2">
          <div v-for="step in steps" :key="step.key" class="flex flex-col items-center flex-1">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 transition-all',
                          stepDone(step.key) ? 'bg-brand-green text-white' : 'bg-gray-200 text-gray-400']">
              {{ step.icon }}
            </div>
            <span class="text-xs text-gray-400 text-center leading-tight">{{ step.label }}</span>
          </div>
        </div>

        <!-- Détails commande -->
        <div class="bg-brand-gray rounded-2xl p-4 text-left space-y-2 mb-5">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Commande n°</span>
            <span class="font-semibold">{{ order.id }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Paiement</span>
            <span :class="order.payment_status === 'paid' ? 'text-brand-green font-semibold' : 'text-gray-600'">
              {{ order.payment_status === 'paid' ? '✅ Payé en ligne' : '💵 Espèces à la livraison' }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Type</span>
            <span>{{ order.type === 'delivery' ? '🚚 Livraison' : '🏃 À emporter' }}</span>
          </div>
          <div class="flex justify-between text-sm font-bold border-t border-brand-border pt-2">
            <span>Total</span>
            <span>€{{ Number(order.total).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Articles -->
        <div class="text-left mb-5">
          <h3 class="font-semibold text-sm mb-2">Vos articles</h3>
          <div v-for="item in order.items" :key="item.id"
               class="flex justify-between text-sm py-1.5 border-b border-brand-border last:border-0">
            <span>{{ item.quantity }}× {{ item.name }}</span>
            <span class="font-medium">€{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <p class="text-xs text-gray-400 mb-4">
          🔄 Cette page se rafraîchit automatiquement toutes les 15 secondes
        </p>

        <router-link to="/">
          <button class="btn-primary w-full">Commander à nouveau</button>
        </router-link>
      </template>

      <div v-else class="py-10 text-gray-400">
        <p>Commande introuvable.</p>
        <router-link to="/" class="btn-primary inline-block mt-4">Retour à l'accueil</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute }   from 'vue-router'
import orderService   from '@/services/orderService'

const route   = useRoute()
const order   = ref(null)
const loading = ref(true)

const steps = [
  { key: 'pending',    icon: '📋', label: 'Reçue'      },
  { key: 'confirmed',  icon: '✅', label: 'Confirmée'  },
  { key: 'preparing',  icon: '👨‍🍳', label: 'En cuisine' },
  { key: 'delivering', icon: '🚚', label: 'En route'   },
  { key: 'delivered',  icon: '🏠', label: 'Livrée'     },
]

const statusOrder = ['pending','confirmed','preparing','ready','delivering','delivered']

function stepDone(key) {
  if (!order.value) return false
  return statusOrder.indexOf(order.value.status) >= statusOrder.indexOf(key)
}

const statusStyle = computed(() => {
  const s = order.value?.status
  const map = {
    pending:    { icon: '📋', title: 'Commande reçue !',       subtitle: 'En attente de confirmation du restaurant…', bg: 'bg-yellow-100' },
    confirmed:  { icon: '✅', title: 'Commande confirmée !',   subtitle: `Prête dans ${order.value?.prep_time || '?'} minutes.`,          bg: 'bg-blue-100'   },
    preparing:  { icon: '👨‍🍳', title: 'En cours de préparation !', subtitle: 'La cuisine travaille sur votre commande.',                  bg: 'bg-orange-100' },
    ready:      { icon: '📦', title: 'Prête !',                subtitle: 'Votre commande est prête pour la livraison.',                    bg: 'bg-purple-100' },
    delivering: { icon: '🚚', title: 'En route !',             subtitle: 'Votre commande est en cours de livraison.',                      bg: 'bg-indigo-100' },
    delivered:  { icon: '🎉', title: 'Livrée !',               subtitle: 'Bonne dégustation ! Bon appétit 🍽️',                            bg: 'bg-green-100'  },
    cancelled:  { icon: '❌', title: 'Commande annulée',       subtitle: 'Votre commande a été annulée.',                                  bg: 'bg-red-100'    },
  }
  return map[s] || map.pending
})

async function fetchOrder() {
  try {
    const { data } = await orderService.get(route.params.id)
    order.value = data
  } finally {
    loading.value = false
  }
}

let interval
onMounted(() => { fetchOrder(); interval = setInterval(fetchOrder, 15000) })
onUnmounted(() => clearInterval(interval))
</script>
