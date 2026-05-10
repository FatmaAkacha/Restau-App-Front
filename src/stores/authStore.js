import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('admin_token') || null)
  const user  = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  function _persist(t, u) {
    token.value = t
    user.value  = u
    if (t) {
      localStorage.setItem('admin_token', t)
      localStorage.setItem('admin_user', JSON.stringify(u))
    } else {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }
  }

  async function login(login, password) {
    const { data } = await api.post('/auth/login', { login, password })
    _persist(data.token, data.user)
    return data
  }

  async function logout() {
    try { await api.post('/auth/logout') } catch { /* ignore */ }
    _persist(null, null)
  }

  // Verify stored token is still valid on app boot
  async function verify() {
    if (!token.value) return false
    try {
      const { data } = await api.get('/auth/me')
      user.value = data
      return true
    } catch {
      _persist(null, null)
      return false
    }
  }

  return { token, user, isAuthenticated, login, logout, verify }
})
