<template>
  <div class="card p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-base font-bold" style="color:#1A1A1A">Votre commande</h2>
      <span v-if="cart.itemCount > 0"
            class="text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
            style="background:#E8192C">
        {{ cart.itemCount }}
      </span>
    </div>

    <!-- Panier vide -->
    <div v-if="cart.items.length === 0" class="text-center py-8">
      <div class="text-4xl mb-3 opacity-20">🛒</div>
      <p class="text-sm" style="color:#888">Ajoutez des articles pour commencer</p>
    </div>

    <div v-else>
      <div v-for="item in cart.items" :key="item.cartKey || item.id"
           class="flex items-center gap-3 py-3"
           style="border-bottom:1px solid #F0F0F0">
        <div class="flex items-center gap-1.5">
          <button @click="cart.removeItem(item.cartKey || item.id)"
                  class="w-6 h-6 rounded-full border flex items-center justify-center text-sm font-bold
                         transition-colors hover:border-red-500 hover:text-red-500"
                  style="border-color:#E5E5E5; color:#888">−</button>
          <span class="w-5 text-center font-bold text-sm" style="color:#1A1A1A">{{ item.quantity }}</span>
          <button @click="cart.addItem(item)"
                  class="w-6 h-6 rounded-full text-white flex items-center justify-center text-sm font-bold"
                  style="background:#E8192C">+</button>
        </div>
        <span class="flex-1 text-sm truncate" style="color:#1A1A1A">
            {{ item.name }}
            <span v-if="item.summary" class="block text-xs font-normal mt-0.5 truncate" style="color:#888">
              {{ item.summary }}
            </span>
          </span>
        <span class="text-sm font-bold" style="color:#1A1A1A">€{{ (Number(item.price) * item.quantity).toFixed(2) }}</span>
      </div>

      <!-- Totaux -->
      <div class="mt-4 space-y-2 text-sm">
        <div class="flex justify-between" style="color:#888">
          <span>Sous-total</span><span>€{{ cart.subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold text-base pt-3"
             style="border-top:1px solid #E5E5E5; color:#1A1A1A">
          <span>Total</span>
          <span style="color:#E8192C">€{{ (cart.subtotal).toFixed(2) }}</span>
        </div>
      </div>

      <router-link to="/checkout">
        <button class="btn-primary w-full mt-4">Passer la commande →</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore()
</script>
