<template>
  <div class="min-h-screen font-sans" style="background:#F7F7F7">

    <!-- Header -->
    <header class="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm"
            style="border-color:#E5E5E5">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
             style="background:linear-gradient(135deg,#E8192C,#A50E1C)">🍽️</div>
        <div>
          <h1 class="font-bold text-base leading-none" style="color:#1A1A1A">Gestion des produits</h1>
          <p class="text-xs mt-0.5" style="color:#888">GOODNAAN Restaurant</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Live indicator -->
        <div class="flex items-center gap-1.5 text-xs" style="color:#888">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          En direct
        </div>
        <!-- Back to orders -->
        <router-link to="/admin"
                     class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                     style="background:#F0F7FF; color:#2563EB">
          ← Commandes
        </router-link>
        <!-- Logout -->
        <button @click="handleLogout"
                class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all"
                style="background:#F5F5F5; color:#555"
                title="Se déconnecter">
          🚪 Déconnexion
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-6">
      <ProductManager />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ProductManager from '@/components/admin/ProductManager.vue'

const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  await auth.logout()
  router.push('/admin/login')
}
</script>
