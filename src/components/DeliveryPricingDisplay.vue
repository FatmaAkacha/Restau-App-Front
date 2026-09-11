<template>
  <div v-if="distance !== null && distance !== undefined" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div class="space-y-3">
      <!-- Distance -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Distance
        </span>
        <span class="font-semibold text-gray-900">{{ distance.toFixed(2) }} km</span>
      </div>

      <!-- Base Fee -->
      <div class="flex items-center justify-between text-sm pt-2 border-t border-gray-300">
        <span class="text-gray-600">Frais de base</span>
        <span class="text-gray-900">€{{ baseFee.toFixed(2) }}</span>
      </div>

      <!-- Distance Charge -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600">Charge au km ({{ distance.toFixed(2) }} × €{{ perKmRate.toFixed(2) }})</span>
        <span class="text-gray-900">€{{ (distance * perKmRate).toFixed(2) }}</span>
      </div>

      <!-- Total Delivery Fee -->
      <div class="flex items-center justify-between text-base font-bold pt-2 border-t border-gray-300">
        <span class="text-gray-900">Total livraison</span>
        <span class="text-red-500">€{{ totalDeliveryFee.toFixed(2) }}</span>
      </div>

      <!-- Warning if not deliverable -->
      <div v-if="!deliverable" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs mt-2">
        ⚠️ Cette adresse est trop éloignée. Livraison non disponible.
      </div>

      <!-- Info -->
      <div class="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
        Tarifs transparents pour une livraison équitable.
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <div class="flex items-center gap-3">
      <div class="w-4 h-4 rounded-full bg-gray-300 animate-pulse" />
      <p class="text-sm text-gray-600">Calcul des frais de livraison...</p>
    </div>
  </div>
</template>

<script setup>
/**
 * DeliveryPricingDisplay Component
 * 
 * Shows transparent breakdown of delivery fee calculation.
 * Displays distance, base fee, per-km charge, and total.
 * 
 * @component
 * @example
 * <DeliveryPricingDisplay
 *   :distance="2.5"
 *   :deliveryFee="2.74"
 *   :baseFee="1.99"
 *   :perKmRate="0.30"
 *   :deliverable="true"
 * />
 */

import { computed } from 'vue'

const props = defineProps({
  distance: {
    type: Number,
    default: null
  },
  deliveryFee: {
    type: Number,
    default: null
  },
  baseFee: {
    type: Number,
    default: 1.99
  },
  perKmRate: {
    type: Number,
    default: 0.30
  },
  deliverable: {
    type: Boolean,
    default: true
  }
})

/**
 * Total delivery fee (calculated from base + distance charge)
 */
const totalDeliveryFee = computed(() => {
  if (props.distance === null) return 0
  return props.baseFee + (props.distance * props.perKmRate)
})
</script>
