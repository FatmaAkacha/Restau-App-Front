import { defineStore } from 'pinia'
import { ref } from 'vue'
import restaurantService from '@/services/restaurantService'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurant = ref(null)
  const loading    = ref(false)
  const error      = ref(null)

  async function fetchMenu(id = 1) {
    loading.value = true
    error.value   = null
    try {
      const { data } = await restaurantService.getMenu(id)
      restaurant.value = data
    } catch (e) {
      error.value = 'Failed to load menu.'
    } finally {
      loading.value = false
    }
  }

  return { restaurant, loading, error, fetchMenu }
})
