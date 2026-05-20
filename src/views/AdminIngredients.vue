<template>
  <div class="min-h-screen font-sans flex flex-col md:flex-row" style="background:#F7F7F7">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main content -->
    <div class="flex-1 md:ml-64 flex flex-col">
      <!-- Header -->
      <header class="bg-white border-b px-4 md:px-6 py-4 sticky top-0 z-20 shadow-sm"
              style="border-color:#E5E5E5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="font-bold text-lg" style="color:#1A1A1A">Gestion des ingrédients</h1>
            <p class="text-xs mt-0.5" style="color:#888">Viandes, sauces, fromages, garnitures...</p>
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div class="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
          <IngredientManager />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IngredientManager from '@/components/admin/IngredientManager.vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
</script>
