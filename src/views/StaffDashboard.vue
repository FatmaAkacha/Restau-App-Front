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
                    <th class="px-3 md:px-5 py-2 md:py-3 text-left text-xs font-semibold uppercase" style="color:#888">Heure</th>
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
                    <td class="px-3 md:px-5 py-2 md:py-3 text-xs" style="color:#AAA">{{ timeAgo(order.created_at) }}</td>
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

const filteredOrders = computed(() =>
  filter.value ? store.orders.filter(o => o.status === filter.value) : store.orders
)

const filteredTotal = computed(() =>
  filteredOrders.value
    .reduce((sum, o) => sum + Number(o.total || 0), 0)
    .toFixed(2)
)

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)   return `il y a ${diff}s`
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}min`
  return `il y a ${Math.floor(diff / 3600)}h`
}

let interval
onMounted(() => { store.fetchAll(); interval = setInterval(store.fetchAll, 8000) })
onUnmounted(() => clearInterval(interval))
</script>
