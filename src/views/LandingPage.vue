<template>
  <div class="min-h-screen bg-brand-black flex flex-col items-center justify-center px-4 relative overflow-hidden">

    <!-- Ambient glow background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-2xl" />
      <div class="absolute top-0 right-0 w-48 h-48 bg-brand-red/5 rounded-full blur-2xl" />
    </div>

    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 opacity-[0.03]"
         style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px);
                background-size: 40px 40px;" />

    <div class="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

      <!-- Logo container with glow -->
      <div class="relative mb-8">
        <div class="absolute inset-0 bg-brand-red/30 rounded-3xl blur-2xl scale-110" />
        <div class="relative w-32 h-32 rounded-3xl bg-red-gradient
                    flex items-center justify-center shadow-red-glow">
          <span class="text-6xl">🍽️</span>
        </div>
      </div>

      <!-- Restaurant name -->
      <h1 class="text-5xl font-extrabold text-white tracking-tight mb-1">
        Good <span class="text-brand-red">Naan</span>
      </h1>
      <p class="text-brand-muted text-sm mb-3 tracking-widest uppercase">
        Restaurant · Caen
      </p>

      <!-- Divider -->
      <div class="flex items-center gap-3 mb-4 w-full">
        <div class="flex-1 h-px bg-brand-border" />
        <span class="text-brand-muted text-xs">🔥</span>
        <div class="flex-1 h-px bg-brand-border" />
      </div>

      <!-- Categories -->
      <p class="text-gray-400 text-sm mb-6">
        Sandwichs · Tacos · Burgers · Pizzas · Bowls
      </p>

      <!-- Rating + status -->
      <div class="flex items-center justify-center gap-4 mb-8">
        <div class="flex items-center gap-1.5 bg-brand-card border border-brand-border
                    rounded-full px-3 py-1.5">
          <span class="text-yellow-400 text-sm">⭐</span>
          <span class="text-white font-bold text-sm">4.2</span>
          <span class="text-brand-muted text-xs">(270+)</span>
        </div>
        <div class="flex items-center gap-1.5 bg-brand-card border border-brand-border
                    rounded-full px-3 py-1.5">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span class="text-green-400 font-semibold text-sm">Ouvert</span>
        </div>
      </div>

      <!-- CTA Button -->
      <router-link to="/menu" class="w-full">
        <button class="w-full bg-red-gradient text-white text-lg font-bold py-4 rounded-2xl
                       hover:shadow-red-glow active:scale-95 transition-all duration-300
                       flex items-center justify-center gap-3">
          <span>Voir le menu</span>
          <span class="text-xl">→</span>
        </button>
      </router-link>

      <!-- Delivery info chips -->
      <div class="flex items-center justify-center gap-3 mt-5">
        <span class="flex items-center gap-1.5 text-xs text-brand-muted bg-brand-card
                     border border-brand-border rounded-full px-3 py-1.5">
          🚚 <span>25 min</span>
        </span>
        <span class="flex items-center gap-1.5 text-xs text-brand-muted bg-brand-card
                     border border-brand-border rounded-full px-3 py-1.5">
          📦 <span>Min. 10€</span>
        </span>
        <span class="flex items-center gap-1.5 text-xs text-brand-muted bg-brand-card
                     border border-brand-border rounded-full px-3 py-1.5">
          💳 <span>CB acceptée</span>
        </span>
      </div>

      <!-- Admin link -->
      <router-link to="/admin"
                   class="mt-14 text-xs text-brand-border hover:text-brand-muted transition-colors">
        Espace admin
      </router-link>
    </div>
  </div>
</template>
