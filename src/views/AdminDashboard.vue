<template>
  <div class="min-h-screen bg-gray-50 font-sans">

    <!-- Barre supérieure -->
    <header class="bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🍽️</span>
        <div>
          <h1 class="font-bold text-lg leading-none">Tableau de bord</h1>
          <p class="text-xs text-gray-400 mt-0.5">Good Naan Restaurant</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 text-xs text-gray-400">
          <span class="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          En direct
        </div>
        <button @click="store.toggleOpen()"
                :class="['flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all',
                         store.isOpen
                           ? 'bg-brand-green text-white hover:bg-green-600'
                           : 'bg-gray-200 text-gray-600 hover:bg-gray-300']">
          <span :class="['w-2 h-2 rounded-full', store.isOpen ? 'bg-white' : 'bg-gray-400']" />
          {{ store.isOpen ? 'En ligne' : 'Hors ligne' }}
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <!-- Statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🔔" label="En attente"  :value="store.stats.pending"   color="yellow" />
        <StatCard icon="👨‍🍳" label="En cuisine"  :value="store.stats.preparing" color="blue"   />
        <StatCard icon="✅" label="Livrées"     :value="store.stats.delivered" color="green"  />
        <StatCard icon="💶" label="Chiffre d'affaires" :value="`€${Number(store.stats.revenue).toFixed(2)}`" color="purple" />
      </div>

      <!-- NOUVELLES COMMANDES -->
      <div v-if="store.pendingOrders.length > 0">
        <h2 class="text-base font-bold mb-3 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
          Nouvelles commandes ({{ store.pendingOrders.length }})
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <OrderAlert
            v-for="order in store.pendingOrders"
            :key="order.id"
            :order="order"
            :is-new="store.newOrderIds.has(order.id)"
            @accept="(prep) => store.accept(order.id, prep)"
            @reject="(reason) => store.reject(order.id, reason)"
          />
        </div>
      </div>

      <!-- COMMANDES EN COURS -->
      <div v-if="store.activeOrders.length > 0">
        <h2 class="text-base font-bold mb-3">Commandes en cours ({{ store.activeOrders.length }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ActiveOrderCard
            v-for="order in store.activeOrders"
            :key="order.id"
            :order="order"
            @status="(s) => store.setStatus(order.id, s)"
          />
        </div>
      </div>

      <!-- TABLEAU TOUTES LES COMMANDES -->
      <div class="card overflow-hidden">
        <div class="px-5 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 class="font-bold">Toutes les commandes</h2>
          <select v-model="filter"
                  class="text-sm border border-brand-border rounded-lg px-3 py-1.5 focus:outline-none">
            <option value="">Tous les statuts</option>
            <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-brand-gray text-gray-500 text-xs uppercase">
              <tr>
                <th class="px-5 py-3 text-left">#</th>
                <th class="px-5 py-3 text-left">Client</th>
                <th class="px-5 py-3 text-left">Type</th>
                <th class="px-5 py-3 text-left">Total</th>
                <th class="px-5 py-3 text-left">Paiement</th>
                <th class="px-5 py-3 text-left">Statut</th>
                <th class="px-5 py-3 text-left">Heure</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id"
                  class="border-t border-brand-border hover:bg-brand-gray/50 transition-colors">
                <td class="px-5 py-3 font-mono text-gray-400">#{{ order.id }}</td>
                <td class="px-5 py-3">
                  <div class="font-medium">{{ order.customer_name }}</div>
                  <div class="text-xs text-gray-400">{{ order.customer_phone }}</div>
                </td>
                <td class="px-5 py-3">
                  {{ order.type === 'delivery' ? '🚚 Livraison' : '🏃 À emporter' }}
                </td>
                <td class="px-5 py-3 font-semibold">€{{ Number(order.total).toFixed(2) }}</td>
                <td class="px-5 py-3"><PaymentBadge :status="order.payment_status" /></td>
                <td class="px-5 py-3"><StatusBadge :status="order.status" /></td>
                <td class="px-5 py-3 text-gray-400 text-xs">{{ timeAgo(order.created_at) }}</td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="7" class="px-5 py-10 text-center text-gray-400">Aucune commande trouvée</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAdminStore }   from '@/stores/adminStore'
import StatCard            from '@/components/admin/StatCard.vue'
import OrderAlert          from '@/components/admin/OrderAlert.vue'
import ActiveOrderCard     from '@/components/admin/ActiveOrderCard.vue'
import StatusBadge         from '@/components/StatusBadge.vue'
import PaymentBadge        from '@/components/admin/PaymentBadge.vue'

const store  = useAdminStore()
const filter = ref('')

const statuses = [
  { value: 'pending',    label: 'En attente'   },
  { value: 'confirmed',  label: 'Confirmée'    },
  { value: 'preparing',  label: 'En cuisine'   },
  { value: 'ready',      label: 'Prête'        },
  { value: 'delivering', label: 'En livraison' },
  { value: 'delivered',  label: 'Livrée'       },
  { value: 'cancelled',  label: 'Annulée'      },
]

const filteredOrders = computed(() =>
  filter.value ? store.orders.filter(o => o.status === filter.value) : store.orders
)

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return `il y a ${diff}s`
  if (diff < 3600) return `il y a ${Math.floor(diff/60)}min`
  return `il y a ${Math.floor(diff/3600)}h`
}

let interval
onMounted(() => { store.fetchAll(); interval = setInterval(store.fetchAll, 8000) })
onUnmounted(() => clearInterval(interval))
</script>
