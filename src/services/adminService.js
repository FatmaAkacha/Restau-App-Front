import api from './api'

export default {
  getStats:           ()           => api.get('/admin/stats'),
  getOrders:          (status)     => api.get('/admin/orders', { params: status ? { status } : {} }),
  acceptOrder:        (id, prep)   => api.patch(`/admin/orders/${id}/accept`, { prep_time: prep }),
  rejectOrder:        (id, reason) => api.patch(`/admin/orders/${id}/reject`, { reason }),
  updateOrderStatus:  (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  getRestaurantStatus:()           => api.get('/admin/restaurant/status'),
  toggleRestaurant:   ()           => api.patch('/admin/restaurant/toggle'),
}
