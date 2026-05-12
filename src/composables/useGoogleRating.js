import { ref, onMounted } from 'vue'
import api from '@/services/api'

/**
 * Fetches the live Google rating + review count via our backend proxy.
 * Falls back to static values if the API key is not configured.
 */
export function useGoogleRating() {
  const rating      = ref(null)   // null until loaded — components should show skeleton
  const reviewCount = ref(null)
  const source      = ref('static')
  const loading     = ref(true)

  onMounted(async () => {
    try {
      const { data } = await api.get('/places/rating')
      if (data.rating)             rating.value      = data.rating
      if (data.user_ratings_total) reviewCount.value = data.user_ratings_total
      source.value  = data.source ?? 'static'
    } catch {
      // silently keep static fallback
    } finally {
      loading.value = false
    }
  })

  return { rating, reviewCount, source, loading }
}
