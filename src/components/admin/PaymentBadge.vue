<template>
  <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', colors[status] || colors.default]">
    {{ labels[status] || status }}
  </span>
</template>

<script setup>
defineProps({ status: String })

const colors = {
  paid:     'bg-green-100 text-green-700',
  unpaid:   'bg-yellow-100 text-yellow-700',
  pending:  'bg-yellow-100 text-yellow-700',
  failed:   'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
  default:  'bg-gray-100 text-gray-500',
}
const labels = {
  paid:     '✅ Payé',
  unpaid:   '💵 Espèces',
  pending:  '⏳ En attente',
  failed:   '❌ Échoué',
  refunded: '↩ Remboursé',
}
</script>
