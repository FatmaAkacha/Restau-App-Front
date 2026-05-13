<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8"
       style="background:#F7F7F7">
    <div class="card max-w-md w-full p-6 text-center">

      <!-- Loading -->
      <div v-if="loading" class="py-10">
        <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="mt-4 text-sm" style="color:#888">Chargement de votre commande…</p>
      </div>

      <!-- Order loaded -->
      <div v-else-if="order">

        <!-- Status icon -->
        <div class="relative w-20 h-20 mx-auto mb-5">
          <div class="absolute inset-0 rounded-full blur-xl opacity-30" :class="statusStyle.glow" />
          <div class="relative w-20 h-20 rounded-full flex items-center justify-center text-4xl"
               :class="statusStyle.bg">
            {{ statusStyle.icon }}
          </div>
        </div>

        <h1 class="text-2xl font-extrabold mb-1" style="color:#1A1A1A">{{ statusStyle.title }}</h1>
        <p class="text-sm mb-6" style="color:#888">{{ statusStyle.subtitle }}</p>

        <!-- Prep time banner -->
        <div v-if="order.prep_time && ['confirmed','preparing','ready','delivering'].includes(order.status)"
             class="rounded-2xl p-4 mb-5 text-left border"
             style="background:#FFF5F5; border-color:#FFCDD0">
          <p class="text-xs font-semibold uppercase tracking-wide mb-1" style="color:#E8192C">
            ⏱ Temps de préparation
          </p>
          <p class="text-3xl font-extrabold" style="color:#1A1A1A">
            {{ order.prep_time }}
            <span class="text-lg" style="color:#888">min</span>
          </p>
          <p class="text-xs mt-1" style="color:#888">Votre commande est en cours de préparation !</p>
        </div>

        <!-- Order details -->
        <div class="rounded-2xl p-4 text-left space-y-2.5 mb-5 border"
             style="background:#FAFAFA; border-color:#E5E5E5">
          <div class="flex justify-between text-sm">
            <span style="color:#888">Commande n°</span>
            <span class="font-bold" style="color:#1A1A1A">{{ formatOrderNumber(order.id) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span style="color:#888">Paiement</span>
            <span :class="order.payment_status === 'paid' ? 'text-green-600 font-semibold' : 'text-gray-600'">
              {{ order.payment_status === 'paid' ? '✅ Payé en ligne' : '💵 Espèces à la livraison' }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span style="color:#888">Type</span>
            <span style="color:#555">{{ order.type === 'delivery' ? 'Livraison' : 'À emporter' }}</span>
          </div>
          <div class="flex justify-between font-bold text-base pt-2.5 border-t" style="border-color:#E5E5E5">
            <span style="color:#1A1A1A">Total</span>
            <span style="color:#E8192C">€{{ Number(order.total).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Items -->
<!-- Items -->
<div class="text-left mb-5">

  <h3
    class="font-semibold text-sm mb-2"
    style="color:#1A1A1A"
  >
    Vos articles
  </h3>

  <div
    v-for="item in order.items"
    :key="item.id"
    class="py-3 border-b last:border-0"
    style="border-color:#F0F0F0"
  >

    <div class="flex justify-between gap-3">

      <div class="flex-1 min-w-0">

        <p
          class="text-sm font-medium"
          style="color:#1A1A1A"
        >
          {{ item.quantity }}× {{ item.name }}
        </p>

        <!-- CUSTOMIZATION -->
        <p
          v-if="item.customization_summary"
          class="text-xs mt-1"
          style="color:#E8192C"
        >
          {{ item.customization_summary }}
        </p>

        <!-- ITEM NOTES -->
        <div
          v-if="item.notes"
          class="mt-2 rounded-xl px-3 py-2 text-xs"
          style="background:#FAFAFA; color:#666; border:1px solid #EFEFEF"
        >
          📝 {{ item.notes }}
        </div>

      </div>

      <div
        class="text-sm font-bold flex-shrink-0"
        style="color:#1A1A1A"
      >
        €{{ (item.price * item.quantity).toFixed(2) }}
      </div>

    </div>

  </div>

</div>

        <!-- Order-level notes -->
        <div v-if="order.notes" class="text-left mb-5 rounded-2xl p-4 border"
             style="background:#FFF8F0; border-color:#FFD9A0">
          <p class="text-xs font-semibold mb-1" style="color:#92400E">📝 Notes / Allergies</p>
          <p class="text-sm whitespace-pre-line" style="color:#555">{{ order.notes }}</p>
        </div>

        <router-link to="/">
          <button class="btn-primary w-full">Commander à nouveau →</button>
        </router-link>
      </div>

      <!-- Not found -->
      <div v-else class="py-10" style="color:#888">
        <p>Commande introuvable.</p>
        <router-link to="/">
          <button class="btn-primary mt-4">Retour à l'accueil</button>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import orderService from '@/services/orderService'

const route   = useRoute()
const order   = ref(null)
const loading = ref(true)

// Format order number as 001, 002, etc.
function formatOrderNumber(id) {
  return String(id).padStart(3, '0')
}

const statusStyle = computed(() => {
  const s = order.value?.status
  const map = {
    pending:    { icon: '📋', title: 'Commande reçue !',               subtitle: 'En attente de confirmation…',                           bg: 'bg-yellow-100', glow: 'bg-yellow-400'  },
    confirmed:  { icon: '✅', title: 'Commande confirmée !',           subtitle: `Prête dans ${order.value?.prep_time || '?'} minutes.`,  bg: 'bg-blue-100',   glow: 'bg-blue-400'    },
    preparing:  { icon: '👨‍🍳', title: 'En cours de préparation !',     subtitle: 'La cuisine travaille sur votre commande.',              bg: 'bg-red-100',    glow: 'bg-red-400'     },
    ready:      { icon: '📦', title: 'Prête !',                        subtitle: 'Votre commande est prête.',                             bg: 'bg-purple-100', glow: 'bg-purple-400'  },
    delivering: { icon: '🚚', title: 'En route !',                     subtitle: 'Votre commande est en cours de livraison.',             bg: 'bg-indigo-100', glow: 'bg-indigo-400'  },
    delivered:  { icon: '🎉', title: 'Livrée !',                       subtitle: 'Bonne dégustation ! Bon appétit 🍽️',                    bg: 'bg-green-100',  glow: 'bg-green-400'   },
    cancelled:  { icon: '❌', title: 'Commande annulée',               subtitle: 'Votre commande a été annulée.',                         bg: 'bg-red-100',    glow: 'bg-red-400'     },
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
