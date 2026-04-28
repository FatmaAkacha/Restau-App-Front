import { defineStore } from 'pinia'
import { ref } from 'vue'
import restaurantService from '@/services/restaurantService'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurant = ref(null)
  const loading    = ref(false)
  const error      = ref(null)

  async function fetchMenu() {
    loading.value = true
    error.value   = null
    try {
      // Fetch the list first to get the real ID (avoids hardcoded ID issues)
      const list = await restaurantService.getAll()
      const first = list.data?.[0]
      if (!first) throw new Error('No restaurant found')

      const { data } = await restaurantService.getMenu(first.id)
      restaurant.value = data
    } catch (e) {
      error.value = 'Impossible de charger le menu.'
    } finally {
      loading.value = false
    }
  }

  return { restaurant, loading, error, fetchMenu }
})
