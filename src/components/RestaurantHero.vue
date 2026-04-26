<template>
  <div class="relative">
    <!-- Cover -->
    <div class="h-52 md:h-72 overflow-hidden relative">
      <div class="absolute inset-0 bg-red-gradient opacity-80" />
      <img v-if="restaurant.cover_image"
           :src="restaurant.cover_image"
           class="w-full h-full object-cover mix-blend-overlay" />
      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-24
                  bg-gradient-to-t from-brand-black to-transparent" />
    </div>

    <!-- Info bar -->
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-end gap-4 -mt-12 pb-4 relative z-10">
        <!-- Logo -->
        <div class="w-20 h-20 rounded-2xl bg-red-gradient shadow-red-glow
                    flex items-center justify-center flex-shrink-0 border-2 border-brand-red/50">
          <img v-if="restaurant.logo" :src="restaurant.logo" class="w-full h-full object-cover rounded-2xl" />
          <span v-else class="text-3xl">🍽️</span>
        </div>
        <div class="pb-1">
          <h1 class="text-2xl font-extrabold text-white">{{ restaurant.name }}</h1>
          <p class="text-brand-muted text-sm mt-0.5">{{ restaurant.description }}</p>
        </div>
      </div>

      <!-- Stats row -->
      <div class="flex flex-wrap gap-4 text-sm pb-4 border-b border-brand-border">
        <span class="flex items-center gap-1.5 text-gray-300">
          ⭐ <strong class="text-white">{{ restaurant.rating }}</strong>
          <span class="text-brand-muted">({{ restaurant.rating_count }}+)</span>
        </span>
        <span class="text-gray-300">🕐 {{ restaurant.delivery_time }} min</span>
        <span class="text-gray-300">
          🚚 {{ restaurant.delivery_fee === 0 ? 'Livraison gratuite' : `€${restaurant.delivery_fee} livraison` }}
        </span>
        <span class="text-gray-300">📦 Min. €{{ restaurant.min_order }}</span>
        <span :class="restaurant.is_open
          ? 'text-green-400 font-semibold'
          : 'text-brand-red font-semibold'">
          <span class="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                :class="restaurant.is_open ? 'bg-green-400 animate-pulse' : 'bg-brand-red'" />
          {{ restaurant.is_open ? 'Ouvert' : 'Fermé' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ restaurant: Object })
</script>
