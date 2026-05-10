<template>
  <section class="py-10">
    
    <!-- Title -->
    <div class="flex items-center gap-4 mb-8">
      <div class="flex-1 h-px bg-gray-300"></div>

      <h2 class="text-2xl font-black tracking-tight"
          style="color:#1A1A1A">
        NOUS <span style="color:#E8192C">TROUVER</span>
      </h2>

      <div class="flex-1 h-px bg-gray-300"></div>
    </div>

    <!-- Info cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

      <!-- Adresse -->
      <div class="rounded-2xl p-5 shadow-sm border bg-white"
           style="border-color:#EFEFEF">
        <div class="text-3xl mb-3">📍</div>

        <h3 class="font-bold text-lg mb-2"
            style="color:#1A1A1A">
          Adresse
        </h3>

        <p class="text-sm leading-6"
           style="color:#666">
          {{ address }}
        </p>
      </div>

      <!-- Téléphone -->
      <div class="rounded-2xl p-5 shadow-sm border bg-white"
           style="border-color:#EFEFEF">
        <div class="text-3xl mb-3">📞</div>

        <h3 class="font-bold text-lg mb-2"
            style="color:#1A1A1A">
          Téléphone
        </h3>

        <p class="text-sm leading-6"
           style="color:#666">
          {{ phone }}
        </p>
      </div>

      <!-- Horaires -->
      <div class="rounded-2xl p-5 shadow-sm border bg-white"
           style="border-color:#EFEFEF">
        <div class="text-3xl mb-3">🕐</div>

        <h3 class="font-bold text-lg mb-2"
            style="color:#1A1A1A">
          Horaires
        </h3>

        <p class="text-sm leading-6 whitespace-pre-line"
           style="color:#666">
          {{ hours }}
        </p>
      </div>

    </div>

    <!-- Google Maps -->
    <div class="overflow-hidden rounded-3xl shadow-md border"
         style="border-color:#E5E5E5">

      <iframe
        :src="mapUrl"
        width="100%"
        height="350"
        style="border:0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>

    </div>
  </section>
</template>

<script setup>
defineProps({
  address: String,
  phone: String,
  hours: String,
  mapUrl: String
})
</script>