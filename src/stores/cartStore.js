import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items        = ref([])
  const restaurantId = ref(null)

  const itemCount = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
const subtotal = computed(() => {
  return items.value.reduce((s, i) => {
    // For promo items, use the price directly
    if (i.promoItem) {
      return s + (Number(i.price || 0) * Number(i.quantity || 1))
    }

    // For regular items with extras
    const extrasTotal = (i.extras || []).reduce(
      (sum, e) => sum + Number(e.price || 0),
      0
    )

    const itemTotal =
      (Number(i.price) + extrasTotal) * Number(i.quantity)

    return s + itemTotal
  }, 0)
})
function getItemTotal(item) {
  // For promo items, use price directly
  if (item.promoItem) {
    return Number(item.price || 0) * Number(item.quantity || 1)
  }

  // For regular items with extras
  const extrasTotal = (item.extras || []).reduce(
    (sum, e) => sum + Number(e.price || 0),
    0
  )

  return (Number(item.price) + extrasTotal) * Number(item.quantity)
}

  function addItem(menuItem) {
    // If adding from a different restaurant, clear cart first
    if (restaurantId.value && restaurantId.value !== menuItem.restaurant_id) {
      items.value = []
    }
    restaurantId.value = menuItem.restaurant_id

    // Promo items have special handling - they're unique based on selected pizzas+bases
    // Generate a unique key for promo items based on pizza IDs and bases
    let key
    if (menuItem.promoItem) {
      const baseStr = (menuItem.bases || []).join('|')
      const pizzaStr = (menuItem.pizzaIds || []).join('|')
      key = `promo_${pizzaStr}_${baseStr}`
    } else {
      key = menuItem.cartKey || String(menuItem.id)
    }

    const existing = items.value.find(i => {
      if (i.promoItem && menuItem.promoItem) {
        const iBaseStr = (i.bases || []).join('|')
        const iPizzaStr = (i.pizzaIds || []).join('|')
        const mBaseStr = (menuItem.bases || []).join('|')
        const mPizzaStr = (menuItem.pizzaIds || []).join('|')
        return iPizzaStr === mPizzaStr && iBaseStr === mBaseStr
      }
      return (i.cartKey || String(i.id)) === key
    })

    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...menuItem, quantity: 1 })
    }
  }

  function removeItem(id) {
    let idx = -1
    
    // Handle promo items (id is the unique promo key)
    if (String(id).startsWith('promo_')) {
      idx = items.value.findIndex(i => {
        if (i.promoItem) {
          const baseStr = (i.bases || []).join('|')
          const pizzaStr = (i.pizzaIds || []).join('|')
          return `promo_${pizzaStr}_${baseStr}` === id
        }
        return false
      })
    } else {
      idx = items.value.findIndex(i => (i.cartKey || String(i.id)) === String(id))
    }

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
