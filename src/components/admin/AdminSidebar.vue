<template>
  <div>
    <!-- Mobile menu button -->
    <button
      @click="mobileMenuOpen = !mobileMenuOpen"
      class="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg"
      style="background:linear-gradient(135deg,#E8192C,#A50E1C); color:white"
    >
      {{ mobileMenuOpen ? '✕' : '☰' }}
    </button>

    <!-- Sidebar overlay (mobile) -->
    <div
      v-if="mobileMenuOpen"
      @click="mobileMenuOpen = false"
      class="fixed inset-0 z-30 md:hidden"
      style="background:rgba(0,0,0,0.5)"
    />

    <!-- Sidebar -->
    <div
      class="fixed left-0 top-0 h-screen w-64 flex flex-col z-30 transition-transform duration-300"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      style="background:#1A1A1A; border-right:1px solid #333"
    >

      <!-- Logo / Brand -->
      <div class="px-6 py-6 flex items-center gap-3 border-b" style="border-color:#333">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style="background:linear-gradient(135deg,#E8192C,#A50E1C)"
        >
          🍽️
        </div>
        <div>
          <h1 class="font-bold text-sm leading-none text-white">GOODNAAN</h1>
          <div class="flex items-center gap-2 mt-1">
            <p class="text-xs" style="color:#888">{{ auth.user?.username || 'Admin' }}</p>
            <span v-if="auth.user?.role === 'admin'" class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#E8192C; color:#fff">👑 Admin</span>
            <span v-else-if="auth.user?.role === 'staff'" class="text-xs font-semibold px-2 py-0.5 rounded-full" style="background:#2563EB; color:#fff">👤 Staff</span>
          </div>
        </div>
      </div>

      <!-- Status Section -->
      <div class="px-6 py-4 border-b" style="border-color:#333">
        <div class="mb-3">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="w-2.5 h-2.5 rounded-full"
              :style="isOpen ? 'background:#16a34a' : 'background:#E8192C'"
            />
            <span class="text-sm font-semibold text-white">
              {{ isOpen ? 'En ligne' : 'Hors ligne' }}
            </span>
          </div>
          <p class="text-xs" style="color:#888">{{ statusText }}</p>
        </div>

        <div v-if="todaySchedule" class="text-xs" style="color:#AAA">
          <p class="mb-1">{{ todaySchedule.label }}:</p>
          <p class="font-medium text-white whitespace-pre-line">
            {{ todaySchedule.hours }}
          </p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-2 overflow-y-auto">

        <!-- Commandes (visible to all) -->
        <router-link
          :to="auth.user?.role === 'staff' ? '/commandes' : '/admin'"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
          :class="isCommandesActive() ? 'text-white' : 'text-gray-400 hover:text-white'"
          :style="isCommandesActive() ? 'background:linear-gradient(135deg,#E8192C,#A50E1C)' : ''"
        >
          <span class="text-lg">📋</span>
          <span>Commandes</span>
        </router-link>

        <!-- Produits (admin only) -->
        <router-link
          v-if="auth.user?.role === 'admin'"
          to="/admin/produits"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
          :class="isActive('/admin/produits') ? 'text-white' : 'text-gray-400 hover:text-white'"
          :style="isActive('/admin/produits') ? 'background:linear-gradient(135deg,#E8192C,#A50E1C)' : ''"
        >
          <span class="text-lg">🍽️</span>
          <span>Produits</span>
        </router-link>

        <!-- Utilisateurs (admin only) -->
        <router-link
          v-if="auth.user?.role === 'admin'"
          to="/admin/utilisateurs"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
          :class="isActive('/admin/utilisateurs') ? 'text-white' : 'text-gray-400 hover:text-white'"
          :style="isActive('/admin/utilisateurs') ? 'background:linear-gradient(135deg,#E8192C,#A50E1C)' : ''"
        >
          <span class="text-lg">👥</span>
          <span>Utilisateurs</span>
        </router-link>

        <!-- Ingrédients (admin only) -->
        <router-link
          v-if="auth.user?.role === 'admin'"
          to="/admin/ingredients"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
          :class="isActive('/admin/ingredients') ? 'text-white' : 'text-gray-400 hover:text-white'"
          :style="isActive('/admin/ingredients') ? 'background:linear-gradient(135deg,#E8192C,#A50E1C)' : ''"
        >
          <span class="text-lg">🥩</span>
          <span>Ingrédients</span>
        </router-link>

      </nav>

      <!-- Footer -->
      <div class="px-3 py-4 border-t space-y-2" style="border-color:#333">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-gray-400 hover:text-white hover:bg-red-900/20"
          title="Se déconnecter"
        >
          <span class="text-lg">🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const mobileMenuOpen = ref(false)

// Opening hours schedule
const LUNCH = '11:30 – 14:30'
const EVENING = '18:00 – 23:30'
const BOTH = `${LUNCH} / ${EVENING}`

const SCHEDULE = [
  { label: 'Lun', jsDay: 1, hours: BOTH },
  { label: 'Mar', jsDay: 2, hours: BOTH },
  { label: 'Mer', jsDay: 3, hours: BOTH },
  { label: 'Jeu', jsDay: 4, hours: BOTH },
  { label: 'Ven', jsDay: 5, hours: BOTH },
  { label: 'Sam', jsDay: 6, hours: EVENING },
  { label: 'Dim', jsDay: 0, hours: EVENING },
]

const isOpen = computed(() => {
  const now = new Date()
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0')
  
  const schedule = todaySchedule.value
  if (!schedule) return false

  const hours = schedule.hours.split(' / ')
  
  for (const timeRange of hours) {
    const [start, end] = timeRange.split(' – ')
    if (currentTime >= start && currentTime < end) {
      return true
    }
  }
  
  return false
})

const todaySchedule = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  return SCHEDULE.find(day => day.jsDay === dayOfWeek)
})

const statusText = computed(() => {
  const now = new Date()
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0')
  
  const schedule = todaySchedule.value
  if (!schedule) return 'Horaires non disponibles'

  const hours = schedule.hours.split(' / ')
  let isCurrentlyOpen = false

  for (const timeRange of hours) {
    const [start, end] = timeRange.split(' – ')
    if (currentTime >= start && currentTime < end) {
      isCurrentlyOpen = true
      break
    }
  }

  if (isCurrentlyOpen) {
    const hours_arr = schedule.hours.split(' / ')
    for (const timeRange of hours_arr) {
      const [start, end] = timeRange.split(' – ')
      if (currentTime >= start && currentTime < end) {
        return `Ouvert · Ferme à ${end}`
      }
    }
  } else {
    const hours_arr = schedule.hours.split(' / ')
    for (const timeRange of hours_arr) {
      const [start, end] = timeRange.split(' – ')
      if (currentTime < start) {
        return `Fermé · Ouvre à ${start}`
      }
    }
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowDay = tomorrow.getDay()
    const tomorrowSchedule = SCHEDULE.find(day => day.jsDay === tomorrowDay)
    if (tomorrowSchedule) {
      const firstTime = tomorrowSchedule.hours.split(' / ')[0].split(' – ')[0]
      return `Fermé · Ouvre demain à ${firstTime}`
    }
  }

  return 'Horaires non disponibles'
})

function isActive(path) {
  return route.path === path
}

function isCommandesActive() {
  return route.path === '/admin' || route.path === '/commandes'
}

function scrollToCategories() {
  if (route.path === '/admin/produits') {
    const element = document.querySelector('[data-section="categories"]')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/admin/login')
}
</script>
