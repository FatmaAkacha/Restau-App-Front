import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items        = ref([])
  const restaurantId = ref(null)

  const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const subtotal  = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))

  function addItem(menuItem) {
    // If adding from a different restaurant, clear cart first
    if (restaurantId.value && restaurantId.value !== menuItem.restaurant_id) {
      items.value = []
    }
    restaurantId.value = menuItem.restaurant_id

    // Items with customization use cartKey to distinguish different option combos
    const key      = menuItem.cartKey || String(menuItem.id)
    const existing = items.value.find(i => (i.cartKey || String(i.id)) === key)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...menuItem, quantity: 1 })
    }
  }

  function removeItem(id) {
    const idx = items.value.findIndex(i => (i.cartKey || String(i.id)) === String(id))
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

  // Called by CheckoutPage to ensure restaurant_id is always fresh
  function setRestaurantId(id) {
    restaurantId.value = id
  }

  return { items, restaurantId, itemCount, subtotal, addItem, removeItem, clearCart, setRestaurantId }
}, { persist: true })
