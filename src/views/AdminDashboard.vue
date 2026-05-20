<template>
  <div class="min-h-screen font-sans" style="background:#F7F7F7">

    <!-- Header -->
    <header class="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm"
            style="border-color:#E5E5E5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
             style="background:linear-gradient(135deg,#E8192C,#A50E1C)">🍽️</div>
        <div>
          <h1 class="font-bold text-base leading-none" style="color:#1A1A1A">Tableau de bord</h1>
          <p class="text-xs mt-0.5" style="color:#888">GOODNAAN Restaurant</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Live indicator -->
        <div class="flex items-center gap-1.5 text-xs" style="color:#888">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          En direct
        </div>
        <!-- Online/Offline toggle -->
        <button @click="store.toggleOpen()"
                class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                :style="store.isOpen
                  ? 'background:#16a34a; color:#fff'
                  : 'background:#E5E5E5; color:#555'">
          <span class="w-2 h-2 rounded-full"
                :style="store.isOpen ? 'background:#fff' : 'background:#888'" />
          {{ store.isOpen ? 'En ligne' : 'Hors ligne' }}
        </button>
        <!-- Products link -->
        <router-link to="/admin/produits"
                     class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                     style="background:#FFF0F1; color:#E8192C">
          🛒 Produits
        </router-link>
        <!-- Logout -->
        <button @click="handleLogout"
                class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all"
                style="background:#F5F5F5; color:#555"
                title="Se déconnecter">
          🚪 Déconnexion
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <!-- ── STATS ── -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon-img="/images/icons/enattente.png" label="En attente"      :value="store.stats.pending"           color="yellow" />
        <StatCard icon-img="/images/icons/encuisine.png" label="En cuisine"      :value="store.stats.preparing"         color="blue"   />
        <StatCard icon-img="/images/icons/livrees.png"   label="Livrées"         :value="store.stats.delivered"         color="green"  />
        <StatCard icon-img="/images/icons/total.png"     label="Total commandes" :value="store.stats.total_orders || 0" color="gray"   />
      </div>

      <!-- ── CHIFFRE D'AFFAIRES ── -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h2 class="font-bold text-lg" style="color:#1A1A1A">Chiffre d'affaires</h2>
            <p class="text-xs mt-0.5" style="color:#888">Uniquement les commandes payées</p>
          </div>
          <!-- Total global badge -->
          <div class="text-right">
            <p class="text-3xl font-extrabold" style="color:#E8192C">
              €{{ fmt(store.stats.revenue) }}
            </p>
            <p class="text-xs" style="color:#888">Total cumulé</p>
          </div>
        </div>

        <!-- Période breakdown -->
        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="rounded-2xl p-4 text-center border" style="background:#FFF5F5; border-color:#FFCDD0">
            <p class="text-xs font-medium mb-1" style="color:#E8192C">Aujourd'hui</p>
            <p class="text-xl font-extrabold" style="color:#1A1A1A">€{{ fmt(store.stats.revenue_today) }}</p>
          </div>
          <div class="rounded-2xl p-4 text-center border" style="background:#F0F7FF; border-color:#BFDBFE">
            <p class="text-xs font-medium mb-1" style="color:#2563EB">Cette semaine</p>
            <p class="text-xl font-extrabold" style="color:#1A1A1A">€{{ fmt(store.stats.revenue_week) }}</p>
          </div>
          <div class="rounded-2xl p-4 text-center border" style="background:#F0FFF4; border-color:#BBF7D0">
            <p class="text-xs font-medium mb-1" style="color:#16a34a">Ce mois</p>
            <p class="text-xl font-extrabold" style="color:#1A1A1A">€{{ fmt(store.stats.revenue_month) }}</p>
          </div>
        </div>

        <!-- Paiement breakdown + panier moyen -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <!-- Carte bancaire -->
          <div class="rounded-2xl p-4 border flex items-center gap-3" style="background:#fff; border-color:#E5E5E5">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                 style="background:#FFF0F1">💳</div>
            <div>
              <p class="text-xs" style="color:#888">Paiements carte</p>
              <p class="font-bold text-base" style="color:#1A1A1A">€{{ fmt(store.stats.card_revenue) }}</p>
              <p class="text-xs" style="color:#888">{{ store.stats.paid_count || 0 }} commandes</p>
            </div>
          </div>

          <!-- Espèces -->
          <div class="rounded-2xl p-4 border flex items-center gap-3" style="background:#fff; border-color:#E5E5E5">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                 style="background:#FFFBEB">💵</div>
            <div>
              <p class="text-xs" style="color:#888">Espèces livrées</p>
              <p class="font-bold text-base" style="color:#1A1A1A">€{{ fmt(store.stats.cash_revenue) }}</p>
              <p class="text-xs" style="color:#888">{{ store.stats.cash_count || 0 }} commandes</p>
            </div>
          </div>

          <!-- Panier moyen -->
          <div class="rounded-2xl p-4 border flex items-center gap-3" style="background:#fff; border-color:#E5E5E5">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                 style="background:#F5F0FF">🧾</div>
            <div>
              <p class="text-xs" style="color:#888">Panier moyen</p>
              <p class="font-bold text-base" style="color:#1A1A1A">€{{ fmt(store.stats.avg_order) }}</p>
              <p class="text-xs" style="color:#888">par commande</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── NOUVELLES COMMANDES ── -->
      <div v-if="store.pendingOrders.length > 0">
        <h2 class="text-base font-bold mb-3 flex items-center gap-2" style="color:#1A1A1A">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
          Nouvelles commandes ({{ store.pendingOrders.length }})
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <OrderAlert
            v-for="order in store.pendingOrders" :key="order.id"
            :order="order"
            :is-new="store.newOrderIds.includes(order.id)"
            @accept="(prep) => store.accept(order.id, prep)"
            @reject="(reason) => store.reject(order.id, reason)"
          />
        </div>
      </div>

      <!-- ── COMMANDES EN COURS ── -->
      <div v-if="store.activeOrders.length > 0">
        <h2 class="text-base font-bold mb-3" style="color:#1A1A1A">
          Commandes en cours ({{ store.activeOrders.length }})
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ActiveOrderCard
            v-for="order in store.activeOrders" :key="order.id"
            :order="order"
            @status="(s) => store.setStatus(order.id, s)"
          />
        </div>
      </div>

      <!-- ── TABLEAU TOUTES LES COMMANDES ── -->
      <div class="card overflow-hidden">
        <div class="px-5 py-4 flex items-center justify-between"
             style="border-bottom:1px solid #E5E5E5">
          <h2 class="font-bold" style="color:#1A1A1A">Toutes les commandes</h2>
          <select v-model="filter"
                  class="text-sm rounded-lg px-3 py-1.5 focus:outline-none border"
                  style="border-color:#E5E5E5; color:#555">
            <option value="">Tous les statuts</option>
            <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead style="background:#F7F7F7">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Client</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Type</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Total</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Paiement</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Statut</th>
                <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Heure</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id"
                  class="transition-colors hover:bg-red-50"
                  style="border-top:1px solid #F0F0F0">
                <td class="px-5 py-3">
                  <div class="font-medium" style="color:#1A1A1A">{{ order.customer_name }}</div>
                  <div class="text-xs" style="color:#888">{{ order.customer_phone }}</div>
                </td>
                <td class="px-5 py-3 text-sm" style="color:#555">
                  {{ order.type === 'delivery' ? 'Livraison' : 'À emporter' }}
                </td>
                <td class="px-5 py-3 font-bold" style="color:#E8192C">
                  €{{ Number(order.total).toFixed(2) }}
                </td>
                <td class="px-5 py-3"><PaymentBadge :status="order.payment_status" /></td>
                <td class="px-5 py-3"><StatusBadge :status="order.status" /></td>
                <td class="px-5 py-3 text-xs" style="color:#AAA">{{ timeAgo(order.created_at) }}</td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="6" class="px-5 py-12 text-center" style="color:#AAA">
                  Aucune commande trouvée
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer total -->
        <div v-if="filteredOrders.length > 0"
             class="px-5 py-3 flex justify-between items-center text-sm font-semibold"
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter }      from 'vue-router'
import { useAdminStore }  from '@/stores/adminStore'
import { useAuthStore }   from '@/stores/authStore'
import StatCard           from '@/components/admin/StatCard.vue'
import OrderAlert         from '@/components/admin/OrderAlert.vue'
import ActiveOrderCard    from '@/components/admin/ActiveOrderCard.vue'
import StatusBadge        from '@/components/StatusBadge.vue'
import PaymentBadge       from '@/components/admin/PaymentBadge.vue'

const store  = useAdminStore()
const auth   = useAuthStore()
const router = useRouter()
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

// Format number to 2 decimals
function fmt(v) {
  return Number(v || 0).toFixed(2)
}

const filteredOrders = computed(() =>
  filter.value ? store.orders.filter(o => o.status === filter.value) : store.orders
)

// Sum of filtered orders total
const filteredTotal = computed(() =>
  filteredOrders.value
    .reduce((sum, o) => sum + Number(o.total || 0), 0)
    .toFixed(2)
)

// Card vs cash percentage for progress bar
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

let interval
onMounted(() => { store.fetchAll(); interval = setInterval(store.fetchAll, 8000) })
onUnmounted(() => clearInterval(interval))

async function handleLogout() {
  clearInterval(interval)
  await auth.logout()
  router.push('/admin/login')
}
</script>
