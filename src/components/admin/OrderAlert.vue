<template>
  <div :class="['relative rounded-2xl border-2 transition-all',
                isNew ? 'border-red-400 shadow-lg shadow-red-100 animate-pulse-once' : 'border-brand-border']">

    <div v-if="isNew"
         class="absolute -top-2.5 -right-2.5 bg-red-500 text-white text-xs font-bold
                px-2 py-0.5 rounded-full shadow">
      NOUVEAU
    </div>

    <div class="bg-white rounded-2xl p-5 space-y-4">

      <!-- En-tête -->
      <div class="flex items-start justify-between">
        <div>
          <p class="font-bold text-base">{{ order.customer_name }}</p>
          <p class="text-xs text-gray-400 mt-0.5">📞 {{ order.customer_phone }}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-lg">€{{ Number(order.total).toFixed(2) }}</p>
          <p class="text-xs text-gray-400">#{{ order.id }}</p>
        </div>
      </div>

      <!-- Badges -->
      <div class="flex flex-wrap gap-2">
        <span :class="['chip', order.type === 'delivery' ? 'chip-blue' : 'chip-purple']">
          {{ order.type === 'delivery' ? '🚚 Livraison' : '🏃 À emporter' }}
        </span>
        <span :class="['chip', order.payment_status === 'paid' ? 'chip-green' : 'chip-yellow']">
          {{ order.payment_status === 'paid' ? '✅ Payé' : '💵 Espèces à la livraison' }}
        </span>
      </div>

      <!-- Adresse -->
      <div v-if="order.type === 'delivery'" class="text-sm text-gray-600 flex gap-2">
        <span class="flex-shrink-0">📍</span>
        <span>{{ order.delivery_address }}</span>
      </div>

      <!-- Articles -->
      <div class="bg-brand-gray rounded-xl p-3 space-y-1">
        <div v-for="item in order.items" :key="item.id"
             class="flex justify-between text-sm">
          <span>{{ item.quantity }}× {{ item.name }}</span>
          <span class="font-medium">€{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <!-- Notes -->
      <p v-if="order.notes" class="text-xs text-gray-500 italic">📝 {{ order.notes }}</p>

      <!-- Temps de préparation + actions -->
      <div class="space-y-3 pt-1">
        <div>
          <label class="text-xs font-medium text-gray-500 block mb-1">Temps de préparation</label>
          <div class="flex gap-2">
            <button v-for="t in [10,15,20,25,30,45]" :key="t"
                    @click="prepTime = t"
                    :class="['flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                             prepTime === t
                               ? 'bg-brand-dark text-white border-brand-dark'
                               : 'border-brand-border text-gray-600 hover:bg-brand-gray']">
              {{ t }}min
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="$emit('accept', prepTime)"
                  class="flex-1 bg-brand-green text-white font-semibold py-2.5 rounded-xl
                         hover:bg-green-600 transition-colors text-sm">
            ✓ Accepter
          </button>
          <button @click="showReject = !showReject"
                  class="flex-1 bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl
                         hover:bg-red-100 transition-colors text-sm border border-red-200">
            ✕ Refuser
          </button>
        </div>

        <div v-if="showReject" class="space-y-2">
          <input v-model="rejectReason" type="text" placeholder="Motif (optionnel)"
                 class="w-full border border-brand-border rounded-xl px-3 py-2 text-sm
                        focus:outline-none focus:border-red-400" />
          <button @click="$emit('reject', rejectReason)"
                  class="w-full bg-red-500 text-white font-semibold py-2 rounded-xl
                         hover:bg-red-600 transition-colors text-sm">
            Confirmer le refus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ order: Object, isNew: Boolean })
defineEmits(['accept', 'reject'])
const prepTime     = ref(20)
const showReject   = ref(false)
const rejectReason = ref('')
</script>

<style scoped>
.chip        { @apply text-xs font-medium px-2.5 py-1 rounded-full; }
.chip-blue   { @apply bg-blue-100 text-blue-700; }
.chip-purple { @apply bg-purple-100 text-purple-700; }
.chip-green  { @apply bg-green-100 text-green-700; }
.chip-yellow { @apply bg-yellow-100 text-yellow-700; }
@keyframes pulse-once {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
}
.animate-pulse-once { animation: pulse-once 1.5s ease-in-out 3; }
</style>
