<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-semibold text-gray-900 mb-3">
        Quand voulez-vous recevoir votre commande ?
      </label>

      <div class="space-y-2">
        <!-- ASAP Option -->
        <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors"
               :class="modelValue === 'asap' ? 'border-red-500 bg-red-50' : ''">
          <input
            type="radio"
            :value="'asap'"
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            class="w-4 h-4 text-red-500"
          />
          <div class="ml-3 flex-1">
            <p class="font-medium text-gray-900">Dès que possible</p>
            <p class="text-xs text-gray-600 mt-0.5">Livraison/Retrait le plus rapide</p>
          </div>
          <span v-if="modelValue === 'asap'" class="text-red-500 font-bold">✓</span>
        </label>

        <!-- Time Slots -->
        <div class="space-y-2">
          <p class="text-xs font-semibold text-gray-600 px-3">Créneaux disponibles</p>
          
          <label
            v-for="slot in availableSlots"
            :key="slot"
            class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors"
            :class="modelValue === slot ? 'border-red-500 bg-red-50' : ''"
          >
            <input
              type="radio"
              :value="slot"
              :model-value="modelValue"
              @update:model-value="$emit('update:modelValue', $event)"
              class="w-4 h-4 text-red-500"
            />
            <div class="ml-3 flex-1">
              <p class="font-medium text-gray-900">{{ formatTime(slot) }}</p>
            </div>
            <span v-if="modelValue === slot" class="text-red-500 font-bold">✓</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Info -->
    <div class="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-800">
      <p>Les créneaux sont générés en fonction des horaires d'ouverture du restaurant.</p>
    </div>
  </div>
</template>

<script setup>
/**
 * SchedulingOptions Component
 * 
 * Allows customers to select delivery/pickup time.
 * Shows "ASAP" option and predefined time slots.
 * 
 * @component
 * @example
 * <SchedulingOptions
 *   :modelValue="selectedTime"
 *   :availableSlots="timeSlots"
 *   @update:modelValue="selectedTime = $event"
 * />
 */

import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'asap'
  },
  availableSlots: {
    type: Array,
    default: () => [
      '15:00',
      '17:00',
      '19:00',
      '21:00'
    ]
  },
  orderType: {
    type: String,
    default: 'delivery'
  }
})

const emit = defineEmits(['update:modelValue'])

/**
 * Format time string for display
 */
const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  return `${hours}h${minutes}`
}
</script>

<style scoped>
input[type="radio"] {
  accent-color: #E8192C;
}
</style>
