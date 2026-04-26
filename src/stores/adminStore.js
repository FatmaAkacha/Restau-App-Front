import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import adminService from '@/services/adminService'

export const useAdminStore = defineStore('admin', () => {
  const orders      = ref([])
  const stats       = ref({ pending: 0, preparing: 0, delivered: 0, revenue: 0 })
  const isOpen      = ref(true)
  const loading     = ref(false)
  // new orders that haven't been seen yet — triggers alert
  const newOrderIds = ref(new Set())

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
      // detect truly new pending orders
      const incoming = ordersRes.data.filter(o => o.status === 'pending')
      incoming.forEach(o => {
        if (!orders.value.find(existing => existing.id === o.id)) {
          newOrderIds.value.add(o.id)
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
    newOrderIds.value.delete(orderId)
    await adminService.getStats().then(r => stats.value = r.data)
  }

  async function reject(orderId, reason) {
    const { data } = await adminService.rejectOrder(orderId, reason)
    _replace(data)
    newOrderIds.value.delete(orderId)
  }

  async function setStatus(orderId, status) {
    const { data } = await adminService.updateOrderStatus(orderId, status)
    _replace(data)
  }

  async function toggleOpen() {
    const { data } = await adminService.toggleRestaurant()
    isOpen.value = data.is_open
  }

  function dismissNew(id) {
    newOrderIds.value.delete(id)
  }

  function _replace(updated) {
    const idx = orders.value.findIndex(o => o.id === updated.id)
    if (idx !== -1) orders.value[idx] = updated
  }

  return {
    orders, stats, isOpen, loading, newOrderIds,
    pendingOrders, activeOrders,
    fetchAll, accept, reject, setStatus, toggleOpen, dismissNew
  }
})
