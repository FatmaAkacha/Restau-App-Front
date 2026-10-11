<template>
  <PromoPizzaModal
    :is-open="isOpen"
    :promo-item="promoItem"
    :available-pizzas="availablePizzas"
    offer-type="takeaway"
    @close="$emit('close')"
    @add="$emit('add', $event)"
  />
</template>

<script setup>
import PromoPizzaModal from './PromoPizzaSelectModal.vue'

defineProps({
  isOpen: { type: Boolean, required: true },
  promoItem: { type: Object, default: () => ({}) },
  availablePizzas: { type: Array, default: () => [] }
})
defineEmits(['close', 'add'])
</script>