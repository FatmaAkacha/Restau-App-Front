import api from './api'

export default {
  // ── Orders ──────────────────────────────────────────────────────────
  getStats:           ()           => api.get('/admin/stats'),
  getOrders:          (status)     => api.get('/admin/orders', { params: status ? { status } : {} }),
  acceptOrder:        (id, prep)   => api.patch(`/admin/orders/${id}/accept`, { prep_time: prep }),
  rejectOrder:        (id, reason) => api.patch(`/admin/orders/${id}/reject`, { reason }),
  updateOrderStatus:  (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  getRestaurantStatus:()           => api.get('/admin/restaurant/status'),
  toggleRestaurant:   ()           => api.patch('/admin/restaurant/toggle'),

  // ── Categories ──────────────────────────────────────────────────────
  getCategories:      (restaurantId) => api.get('/admin/categories', { params: { restaurant_id: restaurantId } }),
  createCategory:     (data)         => api.post('/admin/categories', data),
  updateCategory:     (id, data)     => api.put(`/admin/categories/${id}`, data),
  deleteCategory:     (id)           => api.delete(`/admin/categories/${id}`),

  // ── Menu Items ──────────────────────────────────────────────────────
  getMenuItems:       (restaurantId) => api.get('/admin/menu-items', { params: { restaurant_id: restaurantId } }),
  createMenuItem:     (data)         => api.post('/admin/menu-items', data),
  updateMenuItem:     (id, data)     => api.put(`/admin/menu-items/${id}`, data),
  deleteMenuItem:     (id)           => api.delete(`/admin/menu-items/${id}`),
  toggleStock:        (id)           => api.patch(`/admin/menu-items/${id}/toggle-stock`),
}
