import api from './api'

export default {
  /** Get all restaurants */
  getAll: () => api.get('/restaurants'),

  /** Get one restaurant with full menu grouped by category */
  getMenu: (id) => api.get(`/restaurants/${id}/menu`),

  /** Get restaurant info only */
  getOne: (id) => api.get(`/restaurants/${id}`),
}
