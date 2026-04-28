<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden"
       style="background: linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)">

    <!-- Animated stars background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div v-for="i in 30" :key="i"
           class="absolute rounded-full"
           :style="`
             width:${2 + (i % 3)}px; height:${2 + (i % 3)}px;
             background:rgba(255,255,255,${0.2 + (i % 5) * 0.1});
             top:${(i * 37) % 100}%;
             left:${(i * 53) % 100}%;
             animation: twinkle ${2 + (i % 3)}s ease-in-out infinite;
             animation-delay:${(i * 0.3) % 3}s;
           `" />
    </div>

    <!-- Red glow accent -->
    <div class="absolute bottom-1/3 right-0 w-64 h-64 opacity-15 pointer-events-none"
         style="background:radial-gradient(circle, #E8192C 0%, transparent 70%)" />
    <div class="absolute top-1/4 left-0 w-48 h-48 opacity-10 pointer-events-none"
         style="background:radial-gradient(circle, #E8192C 0%, transparent 70%)" />

    <div class="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto px-4 pt-10 pb-8">

      <!-- LOGO circulaire -->
      <div class="relative mb-5">
        <div class="w-40 h-40 rounded-full flex items-center justify-center relative"
             style="border: 3px solid #E8192C; background:#fff; box-shadow: 0 0 30px rgba(232,25,44,0.4)">
          <div class="absolute inset-2 rounded-full"
               style="border: 1.5px dashed rgba(232,25,44,0.4)" />
          <div class="text-center px-3">
            <div class="flex justify-center mb-1">
              <span style="color:#E8192C; font-size:0.65rem; letter-spacing:2px">★ ★ ★ ★ ★</span>
            </div>
            <div class="flex justify-center gap-0.5 text-sm mb-1">
              <span>🍕</span><span>🌮</span><span>🥙</span>
            </div>
            <div class="font-black leading-none" style="font-size:1.4rem; color:#1A1A1A; letter-spacing:-1px">GOOD</div>
            <div class="font-black leading-none" style="font-size:1.4rem; color:#1A1A1A; letter-spacing:-1px">NAAN</div>
            <div class="mt-1 mx-auto rounded-sm" style="height:5px; width:50px; background:linear-gradient(90deg,#E8192C,#A50E1C)" />
          </div>
        </div>
      </div>

      <!-- CHEESE NAAN - TORTILLA - TACOS - BOWLS - PIZZA -->
      <p class="font-black text-white text-center mb-4 tracking-wide"
         style="font-size:0.9rem; text-shadow:0 0 15px rgba(232,25,44,0.6)">
        CHEESE NAAN · TORTILLA · TACOS · BOWLS · PIZZA
      </p>

      <!-- LIVRAISON à domicile — taille réduite -->
      <div class="mb-4 text-left w-full pl-1">
        <div class="flex items-baseline gap-2">
          <span class="font-black italic" style="font-size:1.3rem; color:#E8192C; text-shadow:1px 1px 0 #000">
            LIVRAISON
          </span>
          <span class="font-black italic" style="font-size:1.1rem; color:#fff; text-shadow:1px 1px 0 #000">
            à domicile
          </span>
        </div>
        <p class="text-xs font-semibold tracking-widest uppercase mt-0.5"
           style="color:rgba(255,255,255,0.45); letter-spacing:2px; font-size:0.6rem">
          UNIQUEMENT SUR LE SITE
        </p>
      </div>

      <!-- Food emojis row -->
      <div class="flex justify-center gap-3 mb-5 text-4xl">
        <span class="drop-shadow-lg">🍕</span>
        <span class="drop-shadow-lg">🌮</span>
        <span class="drop-shadow-lg">🥙</span>
        <span class="drop-shadow-lg">🍟</span>
        <span class="drop-shadow-lg">🧀</span>
      </div>

      <!-- CTA Button -->
      <router-link to="/menu" class="w-full mb-4">
        <button class="w-full font-black text-white text-lg py-4 rounded-2xl
                       active:scale-95 transition-all duration-200"
                style="background:linear-gradient(135deg,#E8192C,#A50E1C);
                       box-shadow:0 4px 25px rgba(232,25,44,0.5)">
          VOIR LE MENU →
        </button>
      </router-link>

      <!-- Info chips -->
      <div class="flex items-center justify-center gap-2 mb-5 flex-wrap">
        <span class="text-xs font-semibold rounded-full px-3 py-1.5"
              style="color:#fff; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2)">
          🚚 25 min
        </span>
        <span class="text-xs font-semibold rounded-full px-3 py-1.5"
              style="color:#fff; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2)">
          📦 Min. 10€
        </span>
        <span class="text-xs font-semibold rounded-full px-3 py-1.5"
              style="color:#fff; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2)">
          💳 CB acceptée
        </span>
      </div>

      <!-- Rating -->
      <div class="flex items-center justify-center gap-3 mb-5">
        <div class="flex items-center gap-1.5 rounded-full px-3 py-1.5"
             style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2)">
          <span class="text-yellow-400 text-sm">⭐</span>
          <span class="font-bold text-sm text-white">4.2</span>
          <span class="text-xs" style="color:rgba(255,255,255,0.5)">(270+)</span>
        </div>
        <div class="flex items-center gap-1.5 rounded-full px-3 py-1.5"
             style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2)">
          <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span class="font-semibold text-sm text-green-400">Ouvert</span>
        </div>
      </div>

      <!-- Adresse -->
      <div class="text-center mb-4">
        <p class="text-xs" style="color:rgba(255,255,255,0.5)">
          📍 22 Rue de la Défense Passive, 14000 Caen
        </p>
        <p class="text-xs" style="color:rgba(255,255,255,0.35)">C.C Calvaire St Pierre</p>
      </div>

      <!-- GOODNAAN14.FR -->
      <div class="w-full text-center pt-4" style="border-top:1px solid rgba(255,255,255,0.1)">
        <p class="font-black tracking-widest"
           style="font-size:1.2rem; color:#fff; letter-spacing:2px; text-shadow:0 0 20px rgba(232,25,44,0.5)">
          GOODNAAN14.FR
        </p>
      </div>

      <router-link to="/admin" class="mt-6 text-xs" style="color:rgba(255,255,255,0.15)">
        Espace admin
      </router-link>
    </div>
  </div>
</template>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.5); }
}
</style>
