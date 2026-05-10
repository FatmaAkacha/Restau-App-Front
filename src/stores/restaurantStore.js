import { defineStore } from 'pinia'
import { ref } from 'vue'
import restaurantService from '@/services/restaurantService'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurant = ref(null)
  const loading    = ref(false)
  const error      = ref(null)

  async function fetchMenu() {
    // Return early if already loaded — avoids redundant calls (e.g. CheckoutPage)
    if (restaurant.value) return

    loading.value = true
    error.value   = null
    try {
      // Try the direct menu endpoint first (single round-trip).
      // Falls back to list → menu if the direct call fails.
      let data
      try {
        ;({ data } = await restaurantService.getMenu(1))
      } catch {
        const list = await restaurantService.getAll()
        const first = list.data?.[0]
        if (!first) throw new Error('No restaurant found')
        ;({ data } = await restaurantService.getMenu(first.id))
      }
      restaurant.value = data
    } catch (e) {
      error.value = 'Impossible de charger le menu.'
    } finally {
      loading.value = false
    }
  }

  return { restaurant, loading, error, fetchMenu }
})
