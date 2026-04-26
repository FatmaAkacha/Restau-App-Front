<template>
  <div class="relative">
    <!-- Cover -->
    <div class="h-48 md:h-64 overflow-hidden relative"
         style="background:linear-gradient(135deg,#E8192C 0%,#A50E1C 100%)">
      <img v-if="restaurant.cover_image"
           :src="restaurant.cover_image"
           class="w-full h-full object-cover opacity-30 mix-blend-multiply" />
      <!-- Pattern overlay -->
      <div class="absolute inset-0 opacity-10"
           style="background-image:radial-gradient(circle, #fff 1px, transparent 1px);
                  background-size:24px 24px;" />
      <!-- Bottom fade to white -->
      <div class="absolute bottom-0 left-0 right-0 h-16"
           style="background:linear-gradient(to bottom, transparent, #F7F7F7)" />
    </div>

    <!-- Info bar -->
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-end gap-4 -mt-10 pb-4 relative z-10">
        <!-- Logo -->
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0
                    border-4 border-white shadow-lg"
             style="background:linear-gradient(135deg,#E8192C,#A50E1C)">
          <img v-if="restaurant.logo" :src="restaurant.logo"
               class="w-full h-full object-cover rounded-xl" />
          <span v-else class="text-3xl">🍽️</span>
        </div>
        <div class="pb-1">
          <h1 class="text-2xl font-extrabold" style="color:#1A1A1A">{{ restaurant.name }}</h1>
          <p class="text-sm mt-0.5" style="color:#888">{{ restaurant.description }}</p>
        </div>
      </div>

      <!-- Stats row -->
      <div class="flex flex-wrap gap-4 text-sm pb-4"
           style="border-bottom:1px solid #E5E5E5">
        <span class="flex items-center gap-1" style="color:#555">
          ⭐ <strong style="color:#1A1A1A">{{ restaurant.rating }}</strong>
          <span style="color:#888">({{ restaurant.rating_count }}+)</span>
        </span>
        <span style="color:#555">🕐 {{ restaurant.delivery_time }} min</span>
        <span style="color:#555">
          🚚 {{ restaurant.delivery_fee === 0 ? 'Livraison gratuite' : `€${restaurant.delivery_fee} livraison` }}
        </span>
        <span style="color:#555">📦 Min. €{{ restaurant.min_order }}</span>
        <span class="font-semibold flex items-center gap-1"
              :style="restaurant.is_open ? 'color:#16a34a' : 'color:#E8192C'">
          <span class="w-2 h-2 rounded-full inline-block"
                :style="restaurant.is_open
                  ? 'background:#16a34a; animation:pulse 2s infinite'
                  : 'background:#E8192C'" />
          {{ restaurant.is_open ? 'Ouvert' : 'Fermé' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ restaurant: Object })
</script>
