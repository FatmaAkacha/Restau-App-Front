<template>
  <div class="card p-4">
    <h2 class="text-lg font-bold mb-4">Votre commande</h2>

    <!-- Panier vide -->
    <div v-if="cart.items.length === 0" class="text-center py-8 text-gray-400">
      <div class="text-4xl mb-2">🛒</div>
      <p class="text-sm">Ajoutez des articles pour commencer</p>
    </div>

    <!-- Articles -->
    <div v-else>
      <div v-for="item in cart.items" :key="item.id"
           class="flex items-center gap-3 py-3 border-b border-brand-border last:border-0">
        <div class="flex items-center gap-2">
          <button @click="cart.removeItem(item.id)"
                  class="w-7 h-7 rounded-full border border-brand-border flex items-center
                         justify-center text-lg font-bold hover:bg-brand-gray transition-colors">
            −
          </button>
          <span class="w-4 text-center font-semibold text-sm">{{ item.quantity }}</span>
          <button @click="cart.addItem(item)"
                  class="w-7 h-7 rounded-full bg-brand-dark text-white flex items-center
                         justify-center text-lg font-bold hover:bg-gray-800 transition-colors">
            +
          </button>
        </div>
        <span class="flex-1 text-sm font-medium">{{ item.name }}</span>
        <span class="text-sm font-semibold">€{{ (item.price * item.quantity).toFixed(2) }}</span>
      </div>

      <!-- Totaux -->
      <div class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between text-gray-600">
          <span>Sous-total</span>
          <span>€{{ cart.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Frais de livraison</span>
          <span>€2.50</span>
        </div>
        <div class="flex justify-between font-bold text-base pt-2 border-t border-brand-border">
          <span>Total</span>
          <span>€{{ (cart.subtotal + 2.50).toFixed(2) }}</span>
        </div>
      </div>

      <router-link to="/checkout">
        <button class="btn-primary w-full mt-4 text-center">
          Passer la commande
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
</script>
