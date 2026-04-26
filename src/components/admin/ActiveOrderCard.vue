<template>
  <div class="card p-4 space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold" style="color:#1A1A1A">{{ order.customer_name }}</p>
        <p class="text-xs mt-0.5" style="color:#888">
          {{ order.type === 'delivery' ? '🚚 ' + order.delivery_address : '🏃 À emporter' }}
        </p>
      </div>
      <StatusBadge :status="order.status" />
    </div>

    <!-- Articles -->
    <div class="text-xs space-y-0.5" style="color:#555">
      <div v-for="item in order.items" :key="item.id">
        {{ item.quantity }}× {{ item.name }}
      </div>
    </div>

    <!-- Temps de préparation -->
    <div v-if="order.prep_time" class="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
         style="background:#FFF8F0; color:#D97706">
      <span>⏱</span>
      <span class="font-semibold">{{ order.prep_time }} min de préparation</span>
    </div>

    <!-- Boutons pipeline -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="next in nextStatuses" :key="next.value"
              @click="$emit('status', next.value)"
              class="flex-1 text-xs font-semibold py-2 rounded-xl border transition-all"
              style="border-color:#E5E5E5; color:#555"
              onmouseover="this.style.background='#E8192C'; this.style.color='#fff'; this.style.borderColor='#E8192C'"
              onmouseout="this.style.background=''; this.style.color='#555'; this.style.borderColor='#E5E5E5'">
        {{ next.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps({ order: Object })
defineEmits(['status'])

const pipeline = {
  confirmed:  [{ value: 'preparing',  label: '👨‍🍳 Commencer la préparation' }],
  preparing:  [{ value: 'ready',      label: '✅ Marquer comme prête'        }],
  ready:      [{ value: 'delivering', label: '🚚 En livraison' }, { value: 'delivered', label: '🏠 Récupérée' }],
  delivering: [{ value: 'delivered',  label: '✅ Livrée'                     }],
}

const nextStatuses = computed(() => pipeline[props.order.status] || [])
</script>
