import api from './api'

export default {
  /** Place a new order */
  create: (payload) => api.post('/orders', payload),

  /** Get order by id */
  get: (id) => api.get(`/orders/${id}`),

  /** Update order status */
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
}
