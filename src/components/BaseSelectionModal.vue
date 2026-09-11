<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-lg max-w-sm w-full">
      <!-- Header -->
      <div class="border-b px-6 py-4">
        <h2 class="text-lg font-bold">Sélectionnez la base</h2>
        <p class="text-sm text-gray-500 mt-1">{{ pizzaName }}</p>
      </div>

      <!-- Options -->
      <div class="px-6 py-6 space-y-3">
        <!-- Crème Option -->
        <button
          @click="selectBase('crème')"
          type="button"
          class="w-full p-4 rounded-lg border-2 transition-all text-left hover:border-red-500 hover:bg-red-50"
          :class="selectedBase === 'crème' ? 'border-red-500 bg-red-50' : 'border-gray-300'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-900">Sauce Crème</p>
              <p class="text-sm text-gray-600 mt-1">Crème fraîche et fromage</p>
            </div>
            <div v-if="selectedBase === 'crème'" class="text-xl text-red-500">✓</div>
          </div>
        </button>

        <!-- Tomate Option -->
        <button
          @click="selectBase('tomate')"
          type="button"
          class="w-full p-4 rounded-lg border-2 transition-all text-left hover:border-red-500 hover:bg-red-50"
          :class="selectedBase === 'tomate' ? 'border-red-500 bg-red-50' : 'border-gray-300'"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-900">Sauce Tomate</p>
              <p class="text-sm text-gray-600 mt-1">Sauce tomate traditionnelle</p>
            </div>
            <div v-if="selectedBase === 'tomate'" class="text-xl text-red-500">✓</div>
          </div>
        </button>
      </div>

      <!-- Buttons -->
      <div class="border-t px-6 py-4 flex gap-3">
        <button
          type="button"
          @click="close"
          class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="confirm"
          :disabled="!selectedBase"
          class="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * BaseSelectionModal Component
 * 
 * Modal for selecting pizza base (crème or tomate sauce).
 * Used within pizza promotion selection flow.
 * 
 * @component
 * @example
 * <BaseSelectionModal
 *   :isOpen="showBaseModal"
 *   :pizzaName="'Pizza Margherita'"
 *   @select="onBaseSelected"
 *   @cancel="showBaseModal = false"
 * />
 */

import { ref } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  pizzaName: {
    type: String,
    default: 'Pizza'
  }
})

const emit = defineEmits(['select', 'cancel'])

const selectedBase = ref(null)

/**
 * Select a base option
 */
const selectBase = (base) => {
  selectedBase.value = base
}

/**
 * Confirm selection and emit event
 */
const confirm = () => {
  if (selectedBase.value) {
    emit('select', selectedBase.value)
    close()
  }
}

/**
 * Close modal without selection
 */
const close = () => {
  selectedBase.value = null
  emit('cancel')
}
</script>
