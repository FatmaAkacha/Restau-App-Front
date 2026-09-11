import api from './api'

export default {
  /** Get all restaurants */
  getAll: () => api.get('/restaurants'),

  /** Get one restaurant with full menu grouped by category */
  getMenu: (id) => api.get(`/restaurants/${id}/menu`),

  /** Get restaurant info only */
  getOne: (id) => api.get(`/restaurants/${id}`),

  /** Submit a review */
  submitReview: (reviewData) => api.post('/reviews', reviewData),

  /** Get approved reviews for a restaurant */
  getReviews: (restaurantId) => api.get(`/restaurants/${restaurantId}/reviews`),

  /** Calculate promotional pizza pricing */
  calculatePromoPrice: (data) => api.post('/calculate-promo-price', data),

  /** Get available pizzas for promotion */
  getAvailablePizzas: () => api.get('/promotions/pizzas'),

  /** Calculate delivery fee */
  calculateDeliveryFee: (data) => api.post('/calculate-delivery-fee', data),

  /** Validate scheduled time */
  validateScheduledTime: (data) => api.post('/validate-scheduled-time', data),

  /** Get payment methods */
  getPaymentMethods: () => api.get('/payment-methods'),
}
