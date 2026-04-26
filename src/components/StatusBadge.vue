<template>
  <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full', colors[status] || colors.default]">
    {{ labels[status] || status }}
  </span>
</template>

<script setup>
defineProps({ status: String })

const colors = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  preparing:  'bg-orange-100 text-orange-700',
  ready:      'bg-purple-100 text-purple-700',
  delivering: 'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
  default:    'bg-gray-100 text-gray-600',
}

const labels = {
  pending:    'En attente',
  confirmed:  'Confirmée',
  preparing:  'En cuisine',
  ready:      'Prête',
  delivering: 'En livraison',
  delivered:  'Livrée',
  cancelled:  'Annulée',
}
</script>
