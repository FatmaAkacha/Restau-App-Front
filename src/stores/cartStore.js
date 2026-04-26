import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items       = ref([])
  const restaurantId = ref(null)

  const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))

  const subtotal  = computed(() =>
    items.value.reduce((s, i) => s + i.price * i.quantity, 0)
  )

  function addItem(menuItem) {
    if (restaurantId.value && restaurantId.value !== menuItem.restaurant_id) {
      // Different restaurant — clear cart first
      items.value = []
    }
    restaurantId.value = menuItem.restaurant_id

    const existing = items.value.find(i => i.id === menuItem.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...menuItem, quantity: 1 })
    }
  }

  function removeItem(id) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx === -1) return
    if (items.value[idx].quantity > 1) {
      items.value[idx].quantity--
    } else {
      items.value.splice(idx, 1)
    }
  }

  function clearCart() {
    items.value = []
    restaurantId.value = null
  }

  return { items, restaurantId, itemCount, subtotal, addItem, removeItem, clearCart }
}, { persist: true })
