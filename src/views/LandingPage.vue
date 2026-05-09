<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden bg-white">

    <div class="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto px-4 pt-10 pb-8">

      <!-- LOGO circulaire -->
<div class="relative mb-5">
  <div class="w-40 h-40 rounded-full flex items-center justify-center relative overflow-hidden"
       style="border: 3px solid #E8192C; background:#fff; box-shadow: 0 0 20px rgba(232,25,44,0.2)">

    <img 
      src="/images/menu/logo.png" 
      alt="Logo Good Naan"
      class="w-full h-full object-cover rounded-full"
    />

  </div>
</div>

      <!-- TAGLINE -->
      <p class="font-black text-center mb-4 tracking-wide"
         style="font-size:0.9rem; color:#1A1A1A">
        CHEESE NAAN · TORTILLA · TACOS · BOWLS · PIZZA
      </p>

      <!-- LIVRAISON -->
      <div class="mb-4 text-left w-full pl-1">
        <div class="flex items-baseline gap-2">
          <span class="font-black italic"
                style="font-size:1.3rem; color:#E8192C;">
            LIVRAISON
          </span>
          <span class="font-black italic"
                style="font-size:1.1rem; color:#1A1A1A;">
            à domicile
          </span>
        </div>

        <p class="text-xs font-semibold tracking-widest uppercase mt-0.5"
           style="color:#999; letter-spacing:2px; font-size:0.6rem">
          UNIQUEMENT SUR LE SITE
        </p>
      </div>

      <!-- Food emojis -->
      <div class="flex justify-center gap-3 mb-5 text-4xl">
        <span>🍕</span>
        <span>🌮</span>
        <span>🥙</span>
        <span>🍟</span>
        <span>🧀</span>
      </div>

      <!-- CTA -->
      <router-link to="/menu" class="w-full mb-4">
        <button class="w-full font-black text-white text-lg py-4 rounded-2xl
                       active:scale-95 transition-all duration-200"
                style="background:linear-gradient(135deg,#E8192C,#A50E1C);
                       box-shadow:0 4px 15px rgba(232,25,44,0.3)">
          VOIR LE MENU →
        </button>
      </router-link>

      <!-- Info chips -->
      <div class="flex items-center justify-center gap-2 mb-5 flex-wrap">
        <span class="text-xs font-semibold rounded-full px-3 py-1.5"
              style="color:#1A1A1A; background:#F3F4F6;">
          🚚 25 min
        </span>
        <span class="text-xs font-semibold rounded-full px-3 py-1.5"
              style="color:#1A1A1A; background:#F3F4F6;">
          📦 Min. 10€
        </span>
        <span class="text-xs font-semibold rounded-full px-3 py-1.5"
              style="color:#1A1A1A; background:#F3F4F6;">
          💳 CB acceptée
        </span>
      </div>

      <!-- Rating -->
      <div class="flex items-center justify-center gap-3 mb-5">
        <div class="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-gray-100">
          <span class="text-yellow-500 text-sm">⭐</span>
          <span class="font-bold text-sm text-gray-900">4.2</span>
          <span class="text-xs text-gray-500">(270+)</span>
        </div>

        <div class="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-gray-100">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span class="font-semibold text-sm text-green-600">Ouvert</span>
        </div>
      </div>

      <!-- Adresse -->
      <div class="text-center mb-4">
        <p class="text-xs text-gray-500">
          📍 22 Rue de la Défense Passive, 14000 Caen
        </p>
        <p class="text-xs text-gray-400">
          C.C Calvaire St Pierre
        </p>
      </div>

    </div>
  </div>
</template>