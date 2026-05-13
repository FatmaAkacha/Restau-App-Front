<template>
  <div v-if="cart.itemCount > 0"
       class="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4"
       style="background:#fff; border-top:1px solid #E5E5E5; box-shadow:0 -4px 20px rgba(0,0,0,0.08)">
    <router-link to="/checkout">
      <button class="btn-primary w-full flex items-center justify-between px-5 py-3.5">
        <span class="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
              style="background:rgba(255,255,255,0.25)">
          {{ cart.itemCount }}
        </span>
        <span class="font-bold">Voir le panier</span>
        <span class="font-bold">€{{ cart.subtotal.toFixed(2) }}</span>
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
</script>
