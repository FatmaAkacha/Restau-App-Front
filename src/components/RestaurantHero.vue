<template>
  <div class="relative">
    <!-- Cover image -->
    <div class="h-48 md:h-64 bg-gradient-to-r from-orange-400 to-red-500 overflow-hidden">
      <img v-if="restaurant.cover_image"
           :src="restaurant.cover_image"
           class="w-full h-full object-cover opacity-80" />
    </div>

    <!-- Info bar -->
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-end gap-4 -mt-10 pb-4">
        <!-- Logo -->
        <div class="w-20 h-20 rounded-2xl bg-white shadow-md border border-brand-border
                    flex items-center justify-center overflow-hidden flex-shrink-0">
          <img v-if="restaurant.logo" :src="restaurant.logo" class="w-full h-full object-cover" />
          <span v-else class="text-3xl">🍽️</span>
        </div>

        <div class="pb-1">
          <h1 class="text-2xl font-bold">{{ restaurant.name }}</h1>
          <p class="text-gray-500 text-sm mt-0.5">{{ restaurant.description }}</p>
        </div>
      </div>

      <!-- Stats row -->
      <div class="flex flex-wrap gap-4 text-sm text-gray-600 pb-4 border-b border-brand-border">
        <span class="flex items-center gap-1">
          ⭐ <strong class="text-brand-dark">{{ restaurant.rating }}</strong>
          ({{ restaurant.rating_count }}+)
        </span>
        <span>🕐 {{ restaurant.delivery_time }} min</span>
        <span>🚚 {{ restaurant.delivery_fee === 0 ? 'Livraison gratuite' : `€${restaurant.delivery_fee} livraison` }}</span>
        <span>📦 Min. €{{ restaurant.min_order }}</span>
        <span :class="restaurant.is_open ? 'text-brand-green font-semibold' : 'text-red-500 font-semibold'">
          {{ restaurant.is_open ? '● Ouvert' : '● Fermé' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ restaurant: Object })
</script>
