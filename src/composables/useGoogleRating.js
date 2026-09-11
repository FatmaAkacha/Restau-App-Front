import { ref, onMounted } from 'vue'
import api from '@/services/api'

/**
 * Fetches the live Google rating + review count via our backend proxy.
 * Falls back to static values if the API key is not configured.
 */
export function useGoogleRating() {
  const rating      = ref(4.9)    // Default fallback value
  const reviewCount = ref(103)    // Default fallback value
  const source      = ref('static')
  const loading     = ref(true)

  onMounted(async () => {
    try {
      const { data } = await api.get('/places/rating')
      if (data.rating)             rating.value      = data.rating
      if (data.user_ratings_total) reviewCount.value = data.user_ratings_total
      source.value  = data.source ?? 'static'
    } catch (error) {
      // silently keep static fallback values
      console.debug('Failed to fetch Google rating, using fallback values')
    } finally {
      loading.value = false
    }
  })

  return { rating, reviewCount, source, loading }
}
