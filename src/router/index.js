import { createRouter, createWebHistory } from 'vue-router'
import LandingPage     from '@/views/LandingPage.vue'
import RestaurantPage  from '@/views/RestaurantPage.vue'
import CheckoutPage    from '@/views/CheckoutPage.vue'
import OrderSuccess    from '@/views/OrderSuccess.vue'
import AdminDashboard  from '@/views/AdminDashboard.vue'
import StaffDashboard  from '@/views/StaffDashboard.vue'
import AdminProducts   from '@/views/AdminProducts.vue'
import AdminUsers      from '@/views/AdminUsers.vue'
import AdminLogin      from '@/views/AdminLogin.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',          component: LandingPage    },
    { path: '/menu',      component: RestaurantPage },
    { path: '/checkout',  component: CheckoutPage   },
    { path: '/order/:id', component: OrderSuccess   },

    // Admin login — redirect to dashboard if already authenticated
    {
      path: '/admin/login',
      component: AdminLogin,
      meta: { guestOnly: true },
    },

    // Admin dashboard — orders only (accessible to admin and staff)
    {
      path: '/admin',
      component: () => {
        const auth = useAuthStore()
        return auth.user?.role === 'admin' ? AdminDashboard : StaffDashboard
      },
      meta: { requiresAuth: true },
    },

    // Staff dashboard — alternative route for staff
    {
      path: '/commandes',
      component: StaffDashboard,
      meta: { requiresAuth: true },
    },

    // Admin products management (admin only)
    {
      path: '/admin/produits',
      component: AdminProducts,
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    // Admin users management (admin only)
    {
      path: '/admin/utilisateurs',
      component: AdminUsers,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
  scrollBehavior: () => ({ top: 0 })
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !token) {
    // Not logged in → redirect to login
    return next('/admin/login')
  }

  if (to.meta.guestOnly && token) {
    // Already logged in → redirect to appropriate dashboard
    const redirectPath = auth.user?.role === 'staff' ? '/commandes' : '/admin'
    return next(redirectPath)
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && auth.user?.role !== 'admin') {
    // Staff user trying to access admin-only page → redirect to staff dashboard
    return next('/commandes')
  }

  next()
})

export default router
