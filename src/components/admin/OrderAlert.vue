<template>
  <div class="relative rounded-2xl border-2 transition-all"
       :style="isNew
         ? 'border-color:#E8192C; box-shadow:0 4px 20px rgba(232,25,44,0.15)'
         : 'border-color:#E5E5E5'">

    <!-- NOUVEAU badge -->
    <div v-if="isNew"
         class="absolute -top-2.5 -right-2.5 text-white text-xs font-bold
                px-2 py-0.5 rounded-full shadow"
         style="background:#E8192C">
      NOUVEAU
    </div>

    <div class="bg-white rounded-2xl p-5 space-y-4">

      <!-- En-tête -->
      <div class="flex items-start justify-between">
        <div>
          <p class="font-bold text-base" style="color:#1A1A1A">{{ order.customer_name }}</p>
          <p class="text-xs mt-0.5" style="color:#888">📞 {{ order.customer_phone }}</p>
        </div>
        <div class="text-right">
          <p class="font-bold text-lg" style="color:#E8192C">€{{ Number(order.total).toFixed(2) }}</p>
          <p class="text-xs" style="color:#888">N° {{ String(order.id).padStart(3, '0') }}</p>
        </div>
      </div>

      <!-- Badges -->
      <div class="flex flex-wrap gap-2">
        <span class="text-xs font-medium px-2.5 py-1 rounded-full"
              :style="order.type === 'delivery'
                ? 'background:#EFF6FF; color:#2563EB'
                : 'background:#FAF5FF; color:#7C3AED'">
          {{ order.type === 'delivery' ? '🚚 Livraison' : '🏃 À emporter' }}
        </span>
        <span class="text-xs font-medium px-2.5 py-1 rounded-full"
              :style="order.payment_status === 'paid'
                ? 'background:#F0FFF4; color:#16a34a'
                : 'background:#FFFBEB; color:#D97706'">
          {{ order.payment_status === 'paid' ? '✅ Payé' : '💵 Espèces à la livraison' }}
        </span>
      </div>

      <!-- Adresse -->
      <div v-if="order.type === 'delivery'" class="text-sm flex gap-2" style="color:#555">
        <span class="flex-shrink-0">📍</span>
        <span>{{ order.delivery_address }}</span>
      </div>

      <!-- Articles -->
      <div class="rounded-xl p-3 space-y-1" style="background:#F7F7F7">
        <div v-for="item in order.items" :key="item.id"
             class="flex justify-between text-sm">
          <span style="color:#555">{{ item.quantity }}× {{ item.name }}</span>
          <span class="font-semibold" style="color:#1A1A1A">€{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <!-- Notes -->
      <p v-if="order.notes" class="text-xs italic" style="color:#888">📝 {{ order.notes }}</p>

      <!-- Temps de préparation -->
      <div class="space-y-3 pt-1">
        <div>
          <label class="text-xs font-medium block mb-1.5" style="color:#888">Temps de préparation</label>
          <div class="flex gap-1.5">
            <button v-for="t in [10,15,20,25,30,45]" :key="t"
                    @click="prepTime = t"
                    class="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    :style="prepTime === t
                      ? 'background:#E8192C; color:#fff; border-color:#E8192C'
                      : 'background:#fff; color:#555; border-color:#E5E5E5'">
              {{ t }}min
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button @click="$emit('accept', prepTime)"
                  class="flex-1 text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                  style="background:#16a34a"
                  onmouseover="this.style.background='#15803d'"
                  onmouseout="this.style.background='#16a34a'">
            ✓ Accepter
          </button>
          <button @click="showReject = !showReject"
                  class="flex-1 font-semibold py-2.5 rounded-xl text-sm border transition-all"
                  style="background:#FFF0F1; color:#E8192C; border-color:#FFCDD0">
            ✕ Refuser
          </button>
        </div>

        <!-- Motif refus -->
        <div v-if="showReject" class="space-y-2">
          <input v-model="rejectReason" type="text" placeholder="Motif (optionnel)"
                 class="w-full rounded-xl px-3 py-2 text-sm border focus:outline-none"
                 style="border-color:#E5E5E5; color:#1A1A1A"
                 onfocus="this.style.borderColor='#E8192C'"
                 onblur="this.style.borderColor='#E5E5E5'" />
          <button @click="$emit('reject', rejectReason)"
                  class="w-full text-white font-semibold py-2 rounded-xl text-sm transition-all"
                  style="background:#E8192C">
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
