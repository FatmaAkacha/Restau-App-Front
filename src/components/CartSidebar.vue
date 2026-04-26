<template>
  <div class="card p-4 bg-brand-card">

    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-base font-bold text-white">Votre commande</h2>
      <span v-if="cart.itemCount > 0"
            class="bg-brand-red text-white text-xs font-bold w-5 h-5 rounded-full
                   flex items-center justify-center">
        {{ cart.itemCount }}
      </span>
    </div>

    <!-- Panier vide -->
    <div v-if="cart.items.length === 0" class="text-center py-8">
      <div class="text-4xl mb-3 opacity-30">🛒</div>
      <p class="text-brand-muted text-sm">Ajoutez des articles pour commencer</p>
    </div>

    <!-- Articles -->
    <div v-else>
      <div v-for="item in cart.items" :key="item.id"
           class="flex items-center gap-3 py-3 border-b border-brand-border last:border-0">
        <!-- Qty controls -->
        <div class="flex items-center gap-1.5">
          <button @click="cart.removeItem(item.id)"
                  class="w-6 h-6 rounded-full border border-brand-border text-white
                         flex items-center justify-center text-sm font-bold
                         hover:border-brand-red hover:text-brand-red transition-colors">
            −
          </button>
          <span class="w-5 text-center font-bold text-sm text-white">{{ item.quantity }}</span>
          <button @click="cart.addItem(item)"
                  class="w-6 h-6 rounded-full bg-brand-red text-white
                         flex items-center justify-center text-sm font-bold
                         hover:bg-brand-redDark transition-colors">
            +
          </button>
        </div>
        <span class="flex-1 text-sm text-gray-300 truncate">{{ item.name }}</span>
        <span class="text-sm font-bold text-white">€{{ (item.price * item.quantity).toFixed(2) }}</span>
      </div>

      <!-- Totaux -->
      <div class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between text-brand-muted">
          <span>Sous-total</span>
          <span class="text-gray-300">€{{ cart.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-brand-muted">
          <span>Frais de livraison</span>
          <span class="text-gray-300">€2.50</span>
        </div>
        <div class="flex justify-between font-bold text-base pt-3 border-t border-brand-border">
          <span class="text-white">Total</span>
          <span class="text-brand-red">€{{ (cart.subtotal + 2.50).toFixed(2) }}</span>
        </div>
      </div>

      <router-link to="/checkout">
        <button class="btn-primary w-full mt-4">
          Passer la commande →
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
</script>
