import { createRouter, createWebHistory } from 'vue-router'
import LandingPage     from '@/views/LandingPage.vue'
import RestaurantPage  from '@/views/RestaurantPage.vue'
import CheckoutPage    from '@/views/CheckoutPage.vue'
import OrderSuccess    from '@/views/OrderSuccess.vue'
import AdminDashboard  from '@/views/AdminDashboard.vue'
import AdminProducts   from '@/views/AdminProducts.vue'
import AdminLogin      from '@/views/AdminLogin.vue'

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

    // Admin dashboard — orders only
    {
      path: '/admin',
      component: AdminDashboard,
      meta: { requiresAuth: true },
    },

    // Admin products management
    {
      path: '/admin/produits',
      component: AdminProducts,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior: () => ({ top: 0 })
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')

  if (to.meta.requiresAuth && !token) {
    // Not logged in → redirect to login
    return next('/admin/login')
  }

  if (to.meta.guestOnly && token) {
    // Already logged in → redirect to dashboard
    return next('/admin')
  }

  next()
})

export default router
