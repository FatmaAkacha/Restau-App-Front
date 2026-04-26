import { createRouter, createWebHistory } from 'vue-router'
import LandingPage     from '@/views/LandingPage.vue'
import RestaurantPage  from '@/views/RestaurantPage.vue'
import CheckoutPage    from '@/views/CheckoutPage.vue'
import OrderSuccess    from '@/views/OrderSuccess.vue'
import AdminDashboard  from '@/views/AdminDashboard.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',         component: LandingPage    },
    { path: '/menu',     component: RestaurantPage },
    { path: '/checkout', component: CheckoutPage   },
    { path: '/order/:id',component: OrderSuccess   },
    { path: '/admin',    component: AdminDashboard  },
  ],
  scrollBehavior: () => ({ top: 0 })
})
