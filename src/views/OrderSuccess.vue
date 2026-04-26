<template>
  <div class="min-h-screen bg-brand-black flex items-center justify-center px-4 py-8">
    <div class="card max-w-md w-full p-6 text-center">

      <!-- Loading -->
      <div v-if="loading" class="py-10">
        <div class="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="text-brand-muted mt-4 text-sm">Chargement de votre commande…</p>
      </div>

      <template v-else-if="order">

        <!-- Status icon -->
        <div class="relative w-20 h-20 mx-auto mb-5">
          <div class="absolute inset-0 rounded-full blur-xl opacity-40"
               :class="statusStyle.glow" />
          <div class="relative w-20 h-20 rounded-full flex items-center justify-center text-4xl"
               :class="statusStyle.bg">
            {{ statusStyle.icon }}
          </div>
        </div>

        <h1 class="text-2xl font-extrabold text-white mb-1">{{ statusStyle.title }}</h1>
        <p class="text-brand-muted text-sm mb-6">{{ statusStyle.subtitle }}</p>

        <!-- Prep time banner -->
        <div v-if="order.prep_time && ['confirmed','preparing','ready','delivering'].includes(order.status)"
             class="bg-brand-red/10 border border-brand-red/30 rounded-2xl p-4 mb-5 text-left">
          <p class="text-xs font-semibold text-brand-red uppercase tracking-wide mb-1">
            ⏱ Temps de préparation
          </p>
          <p class="text-3xl font-extrabold text-white">{{ order.prep_time }} <span class="text-lg text-brand-muted">min</span></p>
          <p class="text-xs text-brand-muted mt-1">Votre commande est en cours de préparation !</p>
        </div>

        <!-- Step tracker -->
        <div class="flex items-center mb-6">
          <template v-for="(step, i) in steps" :key="step.key">
            <div class="flex flex-col items-center flex-1">
              <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-sm mb-1 transition-all border-2',
                            stepDone(step.key)
                              ? 'bg-brand-red border-brand-red text-white shadow-red-sm'
                              : 'bg-brand-dark border-brand-border text-brand-muted']">
                {{ step.icon }}
              </div>
              <span class="text-xs text-brand-muted text-center leading-tight">{{ step.label }}</span>
            </div>
            <!-- Connector -->
            <div v-if="i < steps.length - 1"
                 :class="['flex-1 h-0.5 mb-5 transition-all',
                          stepDone(steps[i+1].key) ? 'bg-brand-red' : 'bg-brand-border']" />
          </template>
        </div>

        <!-- Order details -->
        <div class="bg-brand-dark rounded-2xl p-4 text-left space-y-2.5 mb-5 border border-brand-border">
          <div class="flex justify-between text-sm">
            <span class="text-brand-muted">Commande n°</span>
            <span class="font-bold text-white">#{{ order.id }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-brand-muted">Paiement</span>
            <span :class="order.payment_status === 'paid' ? 'text-green-400 font-semibold' : 'text-gray-300'">
              {{ order.payment_status === 'paid' ? '✅ Payé en ligne' : '💵 Espèces à la livraison' }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-brand-muted">Type</span>
            <span class="text-gray-300">{{ order.type === 'delivery' ? '🚚 Livraison' : '🏃 À emporter' }}</span>
          </div>
          <div class="flex justify-between font-bold text-base pt-2.5 border-t border-brand-border">
            <span class="text-white">Total</span>
            <span class="text-brand-red">€{{ Number(order.total).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Items -->
        <div class="text-left mb-5">
          <h3 class="font-semibold text-sm text-white mb-2">Vos articles</h3>
          <div v-for="item in order.items" :key="item.id"
               class="flex justify-between text-sm py-2 border-b border-brand-border last:border-0">
            <span class="text-gray-400">{{ item.quantity }}× {{ item.name }}</span>
            <span class="font-medium text-white">€{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <p class="text-xs text-brand-muted mb-5">
          🔄 Actualisation automatique toutes les 15 secondes
        </p>

        <router-link to="/">
          <button class="btn-primary w-full">Commander à nouveau →</button>
        </router-link>
      </template>

      <div v-else class="py-10 text-brand-muted">
        <p>Commande introuvable.</p>
        <router-link to="/"><button class="btn-primary mt-4">Retour à l'accueil</button></router-link>
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
    pending:    { icon: '📋', title: 'Commande reçue !',            subtitle: 'En attente de confirmation…',                              bg: 'bg-yellow-500/20', glow: 'bg-yellow-500'  },
    confirmed:  { icon: '✅', title: 'Commande confirmée !',        subtitle: `Prête dans ${order.value?.prep_time || '?'} minutes.`,     bg: 'bg-blue-500/20',   glow: 'bg-blue-500'    },
    preparing:  { icon: '👨‍🍳', title: 'En cours de préparation !',  subtitle: 'La cuisine travaille sur votre commande.',                 bg: 'bg-brand-red/20',  glow: 'bg-brand-red'   },
    ready:      { icon: '📦', title: 'Prête !',                     subtitle: 'Votre commande est prête.',                                bg: 'bg-purple-500/20', glow: 'bg-purple-500'  },
    delivering: { icon: '🚚', title: 'En route !',                  subtitle: 'Votre commande est en cours de livraison.',                bg: 'bg-indigo-500/20', glow: 'bg-indigo-500'  },
    delivered:  { icon: '🎉', title: 'Livrée !',                    subtitle: 'Bonne dégustation ! Bon appétit 🍽️',                       bg: 'bg-green-500/20',  glow: 'bg-green-500'   },
    cancelled:  { icon: '❌', title: 'Commande annulée',            subtitle: 'Votre commande a été annulée.',                            bg: 'bg-brand-red/20',  glow: 'bg-brand-red'   },
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
