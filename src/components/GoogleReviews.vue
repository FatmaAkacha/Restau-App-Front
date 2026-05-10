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

      <div class="text-6xl font-black mb-2" style="color:#1A1A1A">4.2</div>

      <!-- Stars -->
      <div class="flex gap-1 mb-2">
        <span v-for="i in 5" :key="i" class="text-2xl">
          {{ i <= 4 ? '★' : '☆' }}
        </span>
      </div>
      <p class="text-sm" style="color:#888">Basé sur 270+ avis</p>

      <!-- CTA -->
      <a href="https://g.page/r/goodnaan/review"
         target="_blank" rel="noopener noreferrer"
         class="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
         style="background:#FFF0F1; color:#E8192C; border:1.5px solid #FFCDD0">
        ✍️ Laisser un avis
      </a>
    </div>

    <!-- Review cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="review in reviews" :key="review.id"
           class="rounded-2xl p-5 bg-white shadow-sm border flex flex-col gap-3"
           style="border-color:#EFEFEF">

        <!-- Header -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
               :style="`background:${review.color}`">
            {{ review.initials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm truncate" style="color:#1A1A1A">{{ review.name }}</p>
            <p class="text-xs" style="color:#AAA">{{ review.date }}</p>
          </div>
          <!-- Google icon small -->
          <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>

        <!-- Stars -->
        <div class="flex gap-0.5">
          <span v-for="i in 5" :key="i" class="text-base"
                :style="i <= review.rating ? 'color:#FBBC05' : 'color:#E5E5E5'">★</span>
        </div>

        <!-- Text -->
        <p class="text-sm leading-relaxed flex-1" style="color:#555">
          {{ review.text }}
        </p>

      </div>
    </div>

  </section>
</template>

<script setup>
const reviews = [
  {
    id: 1,
    name: 'Karim B.',
    initials: 'KB',
    color: '#4285F4',
    date: 'Il y a 2 semaines',
    rating: 5,
    text: 'Excellent ! Le cheese naan 2 viandes est une tuerie. Livraison rapide, encore chaud à l\'arrivée. Je recommande vivement !',
  },
  {
    id: 2,
    name: 'Sophie M.',
    initials: 'SM',
    color: '#34A853',
    date: 'Il y a 1 mois',
    rating: 5,
    text: 'La pizza Chicken Tandoori est incroyable, une vraie découverte. Le service est au top et les portions sont généreuses.',
  },
  {
    id: 3,
    name: 'Thomas L.',
    initials: 'TL',
    color: '#E8192C',
    date: 'Il y a 3 semaines',
    rating: 4,
    text: 'Très bon rapport qualité/prix. Le tacos 2 viandes est copieux et savoureux. Petit bémol sur le temps d\'attente mais ça vaut le coup.',
  },
  {
    id: 4,
    name: 'Amina D.',
    initials: 'AD',
    color: '#FBBC05',
    date: 'Il y a 2 mois',
    rating: 5,
    text: 'Le tiramisu maison au Nutella est divin ! On commande régulièrement en famille, jamais déçus. Bravo à toute l\'équipe.',
  },
  {
    id: 5,
    name: 'Lucas R.',
    initials: 'LR',
    color: '#9C27B0',
    date: 'Il y a 1 semaine',
    rating: 5,
    text: 'Meilleur cheese naan de Caen sans hésitation. Le gratiné mozzarella est parfait. Livraison ponctuelle et emballage soigné.',
  },
  {
    id: 6,
    name: 'Nadia F.',
    initials: 'NF',
    color: '#FF5722',
    date: 'Il y a 3 mois',
    rating: 4,
    text: 'Bonne adresse pour manger sur le pouce ou se faire livrer. Les frites sont croustillantes et les sauces maison sont délicieuses.',
  },
]
</script>
