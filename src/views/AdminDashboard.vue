<template>
  <div class="min-h-screen font-sans flex flex-col md:flex-row" style="background:#F7F7F7">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main content -->
    <div class="flex-1 md:ml-64 flex flex-col">
      <!-- Header -->
      <header class="bg-white border-b px-4 md:px-6 py-4 sticky top-0 z-20 shadow-sm"
              style="border-color:#E5E5E5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-bold text-lg" style="color:#1A1A1A">Tableau de bord</h1>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div class="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <StatCard icon-img="/images/icons/enattente.png" label="En attente"      :value="store.stats.pending"           color="yellow" />
            <StatCard icon-img="/images/icons/encuisine.png" label="En cuisine"      :value="store.stats.preparing"         color="blue"   />
            <StatCard icon-img="/images/icons/livrees.png"   label="Livrées"         :value="store.stats.delivered"         color="green"  />
            <StatCard icon-img="/images/icons/total.png"     label="Total commandes" :value="store.stats.total_orders || 0" color="gray"   />
          </div>

          <!-- Revenue Card -->
          <div class="card p-4 md:p-6">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-5">
              <div>
                <h2 class="font-bold text-base md:text-lg" style="color:#1A1A1A">Chiffre d'affaires</h2>
                <p class="text-xs mt-0.5" style="color:#888">Uniquement les commandes payées</p>
              </div>
              <div class="text-right mt-3 md:mt-0">
                <p class="text-2xl md:text-3xl font-extrabold" style="color:#E8192C">
                  €{{ fmt(store.stats.revenue) }}
                </p>
                <p class="text-xs" style="color:#888">Total cumulé</p>
              </div>
            </div>

            <!-- Period breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-5">
              <div class="rounded-2xl p-3 md:p-4 text-center border" style="background:#FFF5F5; border-color:#FFCDD0">
                <p class="text-xs font-medium mb-1" style="color:#E8192C">Aujourd'hui</p>
                <p class="text-lg md:text-xl font-extrabold" style="color:#1A1A1A">€{{ fmt(store.stats.revenue_today) }}</p>
              </div>
              <div class="rounded-2xl p-3 md:p-4 text-center border" style="background:#F0F7FF; border-color:#BFDBFE">
                <p class="text-xs font-medium mb-1" style="color:#2563EB">Cette semaine</p>
                <p class="text-lg md:text-xl font-extrabold" style="color:#1A1A1A">€{{ fmt(store.stats.revenue_week) }}</p>
              </div>
              <div class="rounded-2xl p-3 md:p-4 text-center border" style="background:#F0FFF4; border-color:#BBF7D0">
                <p class="text-xs font-medium mb-1" style="color:#16a34a">Ce mois</p>
                <p class="text-lg md:text-xl font-extrabold" style="color:#1A1A1A">€{{ fmt(store.stats.revenue_month) }}</p>
              </div>
            </div>

            <!-- Payment breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
              <div class="rounded-2xl p-3 md:p-4 border flex flex-col sm:flex-row items-start sm:items-center gap-3" style="background:#fff; border-color:#E5E5E5">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                     style="background:#FFF0F1">💳</div>
                <div class="flex-1">
                  <p class="text-xs" style="color:#888">Paiements carte</p>
                  <p class="font-bold text-sm md:text-base" style="color:#1A1A1A">€{{ fmt(store.stats.card_revenue) }}</p>
                  <p class="text-xs" style="color:#888">{{ store.stats.paid_count || 0 }} commandes</p>
                </div>
              </div>

              <div class="rounded-2xl p-3 md:p-4 border flex flex-col sm:flex-row items-start sm:items-center gap-3" style="background:#fff; border-color:#E5E5E5">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                     style="background:#FFFBEB">💵</div>
                <div class="flex-1">
                  <p class="text-xs" style="color:#888">Espèces livrées</p>
                  <p class="font-bold text-sm md:text-base" style="color:#1A1A1A">€{{ fmt(store.stats.cash_revenue) }}</p>
                  <p class="text-xs" style="color:#888">{{ store.stats.cash_count || 0 }} commandes</p>
                </div>
              </div>

              <div class="rounded-2xl p-3 md:p-4 border flex flex-col sm:flex-row items-start sm:items-center gap-3" style="background:#fff; border-color:#E5E5E5">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                     style="background:#F5F0FF">🧾</div>
                <div class="flex-1">
                  <p class="text-xs" style="color:#888">Panier moyen</p>
                  <p class="font-bold text-sm md:text-base" style="color:#1A1A1A">€{{ fmt(store.stats.avg_order) }}</p>
                  <p class="text-xs" style="color:#888">par commande</p>
                </div>
              </div>
            </div>
          </div>

          <!-- New Orders -->
          <div v-if="store.pendingOrders.length > 0">
            <h2 class="text-sm md:text-base font-bold mb-2 md:mb-3 flex items-center gap-2" style="color:#1A1A1A">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              Nouvelles commandes ({{ store.pendingOrders.length }})
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              <OrderAlert
                v-for="order in store.pendingOrders" :key="order.id"
                :order="order"
                :is-new="store.newOrderIds.includes(order.id)"
                @accept="(prep) => store.accept(order.id, prep)"
                @reject="(reason) => store.reject(order.id, reason)"
              />
            </div>
          </div>

          <!-- Active Orders -->
          <div v-if="store.activeOrders.length > 0">
            <h2 class="text-sm md:text-base font-bold mb-2 md:mb-3" style="color:#1A1A1A">
              Commandes en cours ({{ store.activeOrders.length }})
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
              <ActiveOrderCard
                v-for="order in store.activeOrders" :key="order.id"
                :order="order"
                @status="(s) => store.setStatus(order.id, s)"
              />
            </div>
          </div>

          <!-- All Orders Table -->
          <div class="card overflow-hidden">
            <div class="px-3 md:px-5 py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                 style="border-bottom:1px solid #E5E5E5">
              <h2 class="font-bold text-sm md:text-base" style="color:#1A1A1A">Toutes les commandes</h2>
              <select v-model="filter"
                      class="text-xs md:text-sm rounded-lg px-3 py-1.5 focus:outline-none border w-full sm:w-auto"
                      style="border-color:#E5E5E5; color:#555">
                <option value="">Tous les statuts</option>
                <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs md:text-sm">
                <thead style="background:#F7F7F7">
                  <tr>
                    <th class="px-3 md:px-5 py-2 md:py-3 text-left text-xs font-semibold uppercase" style="color:#888">Client</th>
                    <th class="px-3 md:px-5 py-2 md:py-3 text-left text-xs font-semibold uppercase" style="color:#888">Type</th>
                    <th class="px-3 md:px-5 py-2 md:py-3 text-left text-xs font-semibold uppercase" style="color:#888">Total</th>
                    <th class="px-3 md:px-5 py-2 md:py-3 text-left text-xs font-semibold uppercase" style="color:#888">Paiement</th>
                    <th class="px-3 md:px-5 py-2 md:py-3 text-left text-xs font-semibold uppercase" style="color:#888">Statut</th>
                    <th class="px-3 md:px-5 py-2 md:py-3 text-left text-xs font-semibold uppercase" style="color:#888">Horaire</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in filteredOrders" :key="order.id"
                      class="transition-colors hover:bg-red-50"
                      style="border-top:1px solid #F0F0F0">
                    <td class="px-3 md:px-5 py-2 md:py-3">
                      <div class="font-medium text-xs md:text-sm" style="color:#1A1A1A">{{ order.customer_name }}</div>
                      <div class="text-xs" style="color:#888">{{ order.customer_phone }}</div>
                    </td>
                    <td class="px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm" style="color:#555">
                      {{ order.type === 'delivery' ? 'Livraison' : 'À emporter' }}
                    </td>
                    <td class="px-3 md:px-5 py-2 md:py-3 font-bold text-xs md:text-sm" style="color:#E8192C">
                      €{{ Number(order.total).toFixed(2) }}
                    </td>
                    <td class="px-3 md:px-5 py-2 md:py-3"><PaymentBadge :status="order.payment_status" /></td>
                    <td class="px-3 md:px-5 py-2 md:py-3"><StatusBadge :status="order.status" /></td>
                    <td class="px-3 md:px-5 py-2 md:py-3 text-xs" style="color:#AAA">
                      <div v-if="order.scheduled_time" class="font-medium" style="color:#1A1A1A">
                        🕒 {{ formatScheduledTime(order.scheduled_time) }}
                      </div>
                      <div v-else style="color:#AAA">
                        {{ timeAgo(order.created_at) }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredOrders.length === 0">
                    <td colspan="6" class="px-3 md:px-5 py-8 md:py-12 text-center text-xs md:text-sm" style="color:#AAA">
                      Aucune commande trouvée
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer total -->
            <div v-if="filteredOrders.length > 0"
                 class="px-3 md:px-5 py-2 md:py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs md:text-sm font-semibold gap-2"
                 style="border-top:1px solid #E5E5E5; background:#FFF5F5">
              <span style="color:#888">
                {{ filteredOrders.length }} commande{{ filteredOrders.length > 1 ? 's' : '' }}
              </span>
              <span style="color:#E8192C">
                Total : €{{ filteredTotal }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAdminStore }  from '@/stores/adminStore'
import StatCard           from '@/components/admin/StatCard.vue'
import OrderAlert         from '@/components/admin/OrderAlert.vue'
import ActiveOrderCard    from '@/components/admin/ActiveOrderCard.vue'
import StatusBadge        from '@/components/StatusBadge.vue'
import PaymentBadge       from '@/components/admin/PaymentBadge.vue'
import AdminSidebar       from '@/components/admin/AdminSidebar.vue'

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

function fmt(v) {
  return Number(v || 0).toFixed(2)
}

const filteredOrders = computed(() =>
  filter.value ? store.orders.filter(o => o.status === filter.value) : store.orders
)

const filteredTotal = computed(() =>
  filteredOrders.value
    .reduce((sum, o) => sum + Number(o.total || 0), 0)
    .toFixed(2)
)

const totalRevenueMixed = computed(() =>
  Number(store.stats.card_revenue || 0) + Number(store.stats.cash_revenue || 0)
)

const cardPct = computed(() =>
  totalRevenueMixed.value > 0
    ? Math.round((Number(store.stats.card_revenue || 0) / totalRevenueMixed.value) * 100)
    : 0
)

const cashPct = computed(() => 100 - cardPct.value)

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return `il y a ${diff}s`
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`
  return `il y a ${Math.floor(diff / 3600)}h`
}

function formatScheduledTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

let interval
onMounted(() => { store.fetchAll(); interval = setInterval(store.fetchAll, 8000) })
onUnmounted(() => clearInterval(interval))
</script>
