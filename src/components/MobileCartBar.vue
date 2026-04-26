<template>
  <div v-if="cart.itemCount > 0"
       class="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4
              bg-brand-black/95 backdrop-blur border-t border-brand-border">
    <router-link to="/checkout">
      <button class="btn-primary w-full flex items-center justify-between px-5 py-3.5">
        <span class="bg-white/20 text-white text-xs font-bold w-6 h-6 rounded-full
                     flex items-center justify-center">
          {{ cart.itemCount }}
        </span>
        <span class="font-bold">Voir le panier</span>
        <span class="font-bold">€{{ (cart.subtotal + 2.50).toFixed(2) }}</span>
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
</script>
