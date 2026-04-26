<template>
  <div class="card p-4 space-y-3">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold">{{ order.customer_name }}</p>
        <p class="text-xs text-gray-400">
          {{ order.type === 'delivery' ? '🚚 ' + order.delivery_address : '🏃 À emporter' }}
        </p>
      </div>
      <StatusBadge :status="order.status" />
    </div>

    <div class="text-xs text-gray-500 space-y-0.5">
      <div v-for="item in order.items" :key="item.id">
        {{ item.quantity }}× {{ item.name }}
      </div>
    </div>

    <div v-if="order.prep_time" class="flex items-center gap-2 text-sm">
      <span class="text-orange-500">⏱</span>
      <span class="font-medium">{{ order.prep_time }} min de préparation</span>
    </div>

    <div class="flex gap-2 flex-wrap">
      <button v-for="next in nextStatuses" :key="next.value"
              @click="$emit('status', next.value)"
              class="flex-1 text-xs font-semibold py-2 rounded-xl border border-brand-border
                     hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors">
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
