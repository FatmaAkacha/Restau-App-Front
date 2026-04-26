<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
       style="background:#F7F7F7">

    <!-- Background decoration -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
           style="background:#E8192C; filter:blur(80px)" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-8"
           style="background:#E8192C; filter:blur(80px)" />
    </div>

    <div class="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

      <!-- Logo -->
      <div class="relative mb-8">
        <div class="absolute inset-0 rounded-3xl blur-2xl opacity-30"
             style="background:#E8192C; transform:scale(1.1)" />
        <div class="relative w-32 h-32 rounded-3xl flex items-center justify-center shadow-xl"
             style="background:linear-gradient(135deg,#E8192C,#A50E1C)">
          <span class="text-6xl">🍽️</span>
        </div>
      </div>

      <!-- Name -->
      <h1 class="text-5xl font-extrabold tracking-tight mb-1" style="color:#1A1A1A">
        Good <span style="color:#E8192C">Naan</span>
      </h1>
      <p class="text-sm mb-3 tracking-widest uppercase" style="color:#888">
        Restaurant · Caen
      </p>

      <!-- Divider -->
      <div class="flex items-center gap-3 mb-4 w-full">
        <div class="flex-1 h-px" style="background:#E5E5E5" />
        <span style="color:#E8192C">🔥</span>
        <div class="flex-1 h-px" style="background:#E5E5E5" />
      </div>

      <p class="text-sm mb-6" style="color:#555">
        Sandwichs · Tacos · Burgers · Pizzas · Bowls
      </p>

      <!-- Badges -->
      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="flex items-center gap-1.5 rounded-full px-3 py-1.5 border"
             style="background:#fff; border-color:#E5E5E5">
          <span class="text-yellow-400 text-sm">⭐</span>
          <span class="font-bold text-sm" style="color:#1A1A1A">4.2</span>
          <span class="text-xs" style="color:#888">(270+)</span>
        </div>
        <div class="flex items-center gap-1.5 rounded-full px-3 py-1.5 border"
             style="background:#fff; border-color:#E5E5E5">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span class="font-semibold text-sm text-green-600">Ouvert</span>
        </div>
      </div>

      <!-- CTA -->
      <router-link to="/menu" class="w-full">
        <button class="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3">
          <span>Voir le menu</span>
          <span>→</span>
        </button>
      </router-link>

      <!-- Info chips -->
      <div class="flex items-center justify-center gap-3 mt-5">
        <span class="text-xs rounded-full px-3 py-1.5 border"
              style="color:#555; background:#fff; border-color:#E5E5E5">
          🚚 25 min
        </span>
        <span class="text-xs rounded-full px-3 py-1.5 border"
              style="color:#555; background:#fff; border-color:#E5E5E5">
          📦 Min. 10€
        </span>
        <span class="text-xs rounded-full px-3 py-1.5 border"
              style="color:#555; background:#fff; border-color:#E5E5E5">
          💳 CB acceptée
        </span>
      </div>

      <router-link to="/admin" class="mt-14 text-xs" style="color:#CCC">
        Espace admin
      </router-link>
    </div>
  </div>
</template>
