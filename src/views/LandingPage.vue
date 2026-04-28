<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden"
       style="background:#111111">

    <!-- Texture dark background -->
    <div class="absolute inset-0 opacity-30"
         style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22%3E%3Crect width=%224%22 height=%224%22 fill=%22%23000%22/%3E%3Crect x=%220%22 y=%220%22 width=%222%22 height=%222%22 fill=%22%23181818%22/%3E%3Crect x=%222%22 y=%222%22 width=%222%22 height=%222%22 fill=%22%23181818%22/%3E%3C/svg%3E');" />

    <!-- Red glow top -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 opacity-20 pointer-events-none"
         style="background:radial-gradient(ellipse, #E8192C 0%, transparent 70%)" />

    <div class="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto px-4 pt-10 pb-8">

      <!-- LOGO circulaire -->
      <div class="relative mb-6">
        <!-- Outer ring -->
        <div class="w-44 h-44 rounded-full flex items-center justify-center relative"
             style="border: 3px solid #E8192C; background:#fff">
          <!-- Stars ring decoration -->
          <div class="absolute inset-1 rounded-full"
               style="border: 2px dashed rgba(232,25,44,0.3)" />
          <!-- Inner content -->
          <div class="text-center px-4">
            <div class="flex justify-center gap-1 mb-1">
              <span style="color:#E8192C; font-size:0.7rem">★ ★ ★ ★ ★</span>
            </div>
            <!-- Food icons row -->
            <div class="flex justify-center gap-1 text-base mb-1">
              <span>🍕</span><span>🌮</span><span>🥙</span>
            </div>
            <!-- GOOD NAAN text -->
            <div class="font-black leading-none" style="font-size:1.5rem; color:#1A1A1A; letter-spacing:-1px">
              GOOD
            </div>
            <div class="font-black leading-none" style="font-size:1.5rem; color:#1A1A1A; letter-spacing:-1px">
              NAAN
            </div>
            <!-- Red stripe decoration -->
            <div class="mt-1 mx-auto rounded-sm" style="height:6px; width:60px; background:linear-gradient(90deg,#E8192C,#A50E1C)" />
          </div>
        </div>
        <!-- Glow behind logo -->
        <div class="absolute inset-0 rounded-full blur-2xl opacity-20 -z-10"
             style="background:#E8192C" />
      </div>

      <!-- CHEESE NAAN - TORTILLA - TACOS - BOWLS - PIZZA -->
      <div class="w-full text-center mb-5">
        <p class="font-black text-white tracking-wide"
           style="font-size:1.05rem; text-shadow: 0 0 20px rgba(232,25,44,0.5)">
          CHEESE NAAN - TORTILLA - TACOS - BOWLS - PIZZA
        </p>
      </div>

      <!-- LIVRAISON à domicile -->
      <div class="mb-5 text-left w-full pl-2">
        <div class="leading-none">
          <span class="font-black italic"
                style="font-size:2rem; color:#E8192C; text-shadow:2px 2px 0 #000">
            LIVRAISON
          </span>
        </div>
        <div class="leading-none -mt-1">
          <span class="font-black italic"
                style="font-size:1.6rem; color:#fff; text-shadow:2px 2px 0 #000">
            à domicile
          </span>
        </div>
        <p class="text-xs font-semibold tracking-widest uppercase mt-1"
           style="color:#AAA; letter-spacing:3px">
          UNIQUEMENT SUR LE SITE
        </p>
      </div>

      <!-- Food image placeholder (decorative circles) -->
      <div class="w-full relative h-36 mb-6 flex items-center justify-center">
        <div class="absolute left-0 w-32 h-32 rounded-full opacity-80 overflow-hidden border-2"
             style="border-color:#E8192C; background:#222">
          <div class="w-full h-full flex items-center justify-center text-5xl">🍕</div>
        </div>
        <div class="absolute left-20 w-28 h-28 rounded-full opacity-80 overflow-hidden border-2"
             style="border-color:#E8192C; background:#222; z-index:2">
          <div class="w-full h-full flex items-center justify-center text-4xl">🌮</div>
        </div>
        <div class="absolute right-8 w-24 h-24 rounded-full opacity-80 overflow-hidden border-2"
             style="border-color:#E8192C; background:#222; z-index:1">
          <div class="w-full h-full flex items-center justify-center text-4xl">🥙</div>
        </div>
        <div class="absolute right-0 w-20 h-20 rounded-full opacity-80 overflow-hidden border-2"
             style="border-color:#E8192C; background:#222; z-index:3">
          <div class="w-full h-full flex items-center justify-center text-3xl">🍟</div>
        </div>
      </div>

      <!-- CTA Button -->
      <router-link to="/menu" class="w-full mb-5">
        <button class="w-full font-black text-white text-lg py-4 rounded-2xl
                       active:scale-95 transition-all duration-200"
                style="background:linear-gradient(135deg,#E8192C,#A50E1C);
                       box-shadow:0 4px 20px rgba(232,25,44,0.5)">
          VOIR LE MENU →
        </button>
      </router-link>

      <!-- Info chips -->
      <div class="flex items-center justify-center gap-2 mb-6 flex-wrap">
        <span class="text-xs font-semibold rounded-full px-3 py-1.5 border"
              style="color:#fff; background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.15)">
          🚚 25 min
        </span>
        <span class="text-xs font-semibold rounded-full px-3 py-1.5 border"
              style="color:#fff; background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.15)">
          📦 Min. 10€
        </span>
        <span class="text-xs font-semibold rounded-full px-3 py-1.5 border"
              style="color:#fff; background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.15)">
          💳 CB acceptée
        </span>
      </div>

      <!-- Adresse -->
      <div class="text-center mb-4">
        <p class="text-xs" style="color:#888">
          📍 22 Rue de la Défense Passive, 14000 Caen
        </p>
        <p class="text-xs" style="color:#666">C.C Calvaire St Pierre</p>
      </div>

      <!-- GOODNAAN14.FR -->
      <div class="w-full text-center pt-4" style="border-top:1px solid rgba(255,255,255,0.08)">
        <p class="font-black tracking-widest"
           style="font-size:1.3rem; color:#fff; letter-spacing:2px">
          GOODNAAN14.FR
        </p>
      </div>

      <!-- Admin link -->
      <router-link to="/admin" class="mt-6 text-xs" style="color:#333">
        Espace admin
      </router-link>
    </div>
  </div>
</template>
