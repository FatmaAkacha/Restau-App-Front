<template>
  <div class="relative">
    <!-- Cover simple white/gray -->
    <div class="h-40 md:h-48 overflow-hidden relative"
         style="background:#FAFAFA">
      <!-- Subtle pattern -->
      <div class="absolute inset-0 opacity-5"
           style="background-image:radial-gradient(circle, #1A1A1A 1px, transparent 1px);
                  background-size:20px 20px" />
      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-16"
           style="background:linear-gradient(to bottom, transparent, #F7F7F7)" />
    </div>

    <!-- Info bar -->
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-end gap-4 -mt-10 pb-4 relative z-10">
        <!-- Logo circulaire -->
        <div class="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 
                    border-4 border-white shadow-lg overflow-hidden"
            style="background:#fff">

          <img 
            src="/images/menu/logo.png" 
            alt="Logo"
            class="w-full h-full object-cover rounded-full"
          />

        </div>
        <div class="pb-1">
          <h1 class="font-black text-2xl" style="color:#1A1A1A; letter-spacing:-1px">
            GOOD<span style="color:#E8192C">NAAN</span>
          </h1>
          <p class="text-xs mt-0.5" style="color:#888">
            Cheese Naan · Tortilla · Tacos · Bowls · Pizza
          </p>
          <p class="text-xs mt-0.5" style="color:#AAA">
            📍 22 Rue de la Défense Passive, 14000 Caen
          </p>
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
