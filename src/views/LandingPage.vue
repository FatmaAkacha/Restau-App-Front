<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">

    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-orange-100 rounded-full opacity-50" />
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-red-100 rounded-full opacity-40" />
    </div>

    <div class="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

      <!-- Logo -->
      <div class="w-36 h-36 rounded-3xl bg-gradient-to-br from-orange-400 to-red-500
                  flex items-center justify-center shadow-2xl mb-8">
        <span class="text-7xl">🍽️</span>
      </div>

      <!-- Nom du restaurant -->
      <h1 class="text-4xl font-extrabold text-brand-dark tracking-tight mb-2">
        Good Naan
      </h1>
      <p class="text-gray-500 text-base mb-2">
        Sandwichs · Tacos · Burgers · Pizzas
      </p>

      <!-- Note -->
      <div class="flex items-center gap-1.5 text-sm text-gray-500 mb-10">
        <span class="text-yellow-400 text-base">⭐</span>
        <span class="font-semibold text-brand-dark">4.2</span>
        <span>(270+ avis)</span>
        <span class="mx-1">·</span>
        <span class="text-brand-green font-semibold">● Ouvert</span>
      </div>

      <!-- Bouton principal -->
      <router-link to="/menu" class="w-full">
        <button class="w-full bg-brand-dark text-white text-lg font-bold py-4 rounded-2xl
                       hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-200">
          Voir le menu
        </button>
      </router-link>

      <!-- Infos livraison -->
      <div class="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
        <span>🚚 Livraison 25 min</span>
        <span>·</span>
        <span>📦 Min. 10€</span>
      </div>

      <!-- Lien admin discret -->
      <router-link to="/admin"
                   class="mt-12 text-xs text-gray-300 hover:text-gray-400 transition-colors">
        Espace admin
      </router-link>
    </div>
  </div>
</template>
