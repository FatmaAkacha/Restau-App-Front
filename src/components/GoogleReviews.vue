<template>
  <section class="py-2">

    <!-- Title -->
    <div class="flex items-center gap-4 mb-8">
      <div class="flex-1 h-px bg-gray-300" />
      <h2 class="text-2xl font-black tracking-tight" style="color:#1A1A1A">
        AVIS <span style="color:#E8192C">CLIENTS</span>
      </h2>
      <div class="flex-1 h-px bg-gray-300" />
    </div>

    <!-- Global score -->
    <div class="flex flex-col items-center mb-8">
      <!-- Google logo -->
      <div class="flex items-center gap-2 mb-3">
        <svg viewBox="0 0 24 24" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span class="text-sm font-semibold" style="color:#555">Avis Google</span>
      </div>

      <div class="text-6xl font-black mb-2" style="color:#1A1A1A">
        {{ rating }}
      </div>

      <!-- Stars -->
      <div class="flex gap-1 mb-2">
        <span v-for="i in 5" :key="i" class="text-2xl" :style="i <= Math.round(rating ?? 0) ? 'color:#FBBC05' : 'color:#E5E5E5'">★</span>
      </div>
      <p class="text-sm" style="color:#888">
        Basé sur
        <span v-if="loading" class="inline-block w-10 h-3 rounded bg-gray-200 animate-pulse align-middle" />
        <span v-else>{{ reviewCount }}+</span>
        avis
        <span v-if="source === 'google'" class="ml-1 text-xs px-1.5 py-0.5 rounded-full font-medium"
              style="background:#E8F5E9; color:#2E7D32">● live</span>
      </p>

      <!-- CTA -->
      <button
        @click="openModal"
        type="button"
        class="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80"
        style="background: white; color:#E8192C; border: 1.5px solid #FFCDD0; cursor:pointer;"
      >
        ✍️ Laisser un avis
      </button>
    </div>

  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useGoogleRating } from '@/composables/useGoogleRating'

const emit = defineEmits(['open-review-modal'])

defineProps({
  restaurantId: {
    type: Number,
    required: true
  }
})

const { rating, reviewCount, source, loading } = useGoogleRating()

const openModal = () => {
  console.log('Opening review modal from GoogleReviews component')
  emit('open-review-modal')
}
</script>
