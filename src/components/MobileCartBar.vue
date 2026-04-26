<template>
  <div v-if="cart.itemCount > 0"
       class="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-brand-border shadow-xl">
    <router-link to="/checkout">
      <button class="btn-primary w-full flex items-center justify-between px-5">
        <span class="bg-white/20 text-white text-sm font-bold w-6 h-6 rounded flex items-center justify-center">
          {{ cart.itemCount }}
        </span>
        <span>Voir le panier</span>
        <span>€{{ (cart.subtotal + 2.50).toFixed(2) }}</span>
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
</script>
