import api from './api'

export default {
  // Get all users
  getUsers: () => api.get('/admin/users'),

  // Get single user
  getUser: (id) => api.get(`/admin/users/${id}`),

  // Create user
  createUser: (data) => api.post('/admin/users', data),

  // Update user
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),

  // Delete user
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}
