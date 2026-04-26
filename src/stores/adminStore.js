import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import adminService from '@/services/adminService'

export const useAdminStore = defineStore('admin', () => {
  const orders      = ref([])
  const stats       = ref({
    pending: 0, preparing: 0, delivered: 0, cancelled: 0, total_orders: 0,
    revenue: 0, revenue_today: 0, revenue_week: 0, revenue_month: 0,
    paid_count: 0, cash_count: 0, card_revenue: 0, cash_revenue: 0, avg_order: 0,
  })
  const isOpen      = ref(true)
  const loading     = ref(false)
  // Use array instead of Set for Vue reactivity
  const newOrderIds = ref([])

  const pendingOrders = computed(() =>
    orders.value.filter(o => o.status === 'pending')
  )
  const activeOrders = computed(() =>
    orders.value.filter(o => ['confirmed','preparing','ready','delivering'].includes(o.status))
  )

  async function fetchAll() {
    loading.value = true
    try {
      const [ordersRes, statsRes, statusRes] = await Promise.all([
        adminService.getOrders(),
        adminService.getStats(),
        adminService.getRestaurantStatus(),
      ])

      // Detect new pending orders not yet in the list
      const incoming = ordersRes.data.filter(o => o.status === 'pending')
      incoming.forEach(o => {
        const alreadyKnown = orders.value.find(existing => existing.id === o.id)
        const alreadyNew   = newOrderIds.value.includes(o.id)
        if (!alreadyKnown && !alreadyNew) {
          newOrderIds.value.push(o.id)
        }
      })

      orders.value = ordersRes.data
      stats.value  = statsRes.data
      isOpen.value = statusRes.data.is_open
    } finally {
      loading.value = false
    }
  }

  async function accept(orderId, prepTime) {
    const { data } = await adminService.acceptOrder(orderId, prepTime)
    _replace(data)
    newOrderIds.value = newOrderIds.value.filter(id => id !== orderId)
    const statsRes = await adminService.getStats()
    stats.value = statsRes.data
  }

  async function reject(orderId, reason) {
    const { data } = await adminService.rejectOrder(orderId, reason)
    _replace(data)
    newOrderIds.value = newOrderIds.value.filter(id => id !== orderId)
  }

  async function setStatus(orderId, status) {
    const { data } = await adminService.updateOrderStatus(orderId, status)
    _replace(data)
    // Refresh stats after status change
    const statsRes = await adminService.getStats()
    stats.value = statsRes.data
  }

  async function toggleOpen() {
    const { data } = await adminService.toggleRestaurant()
    isOpen.value = data.is_open
  }

  function _replace(updated) {
    const idx = orders.value.findIndex(o => o.id === updated.id)
    if (idx !== -1) orders.value[idx] = updated
  }

  return {
    orders, stats, isOpen, loading, newOrderIds,
    pendingOrders, activeOrders,
    fetchAll, accept, reject, setStatus, toggleOpen,
  }
})
