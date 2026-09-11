<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 border-b px-6 py-4 bg-white flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold">{{ promoItem?.name || '2 Pizzas Promo' }}</h2>
          <p class="text-sm text-gray-500 mt-1">Sélectionnez 2 pizzas et choisissez la base</p>
        </div>
        <span class="text-xl font-bold text-red-500">{{ selectedCount }}/2</span>
      </div>

      <!-- Pizza Selection Grid -->
      <div class="px-6 py-6">
        <div v-if="availablePizzas.length === 0" class="text-center py-8">
          <p class="text-gray-500">Aucune pizza disponible</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="pizza in availablePizzas"
            :key="pizza.id"
            @click="togglePizzaSelection(pizza)"
            class="rounded-lg border-2 cursor-pointer transition-all hover:border-red-500"
            :class="isSelected(pizza.id) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'"
          >
            <!-- Pizza Image -->
            <div class="h-32 bg-gray-200 overflow-hidden rounded-t-md">
              <img
                :src="pizza.image || '/images/menu/pizza.png'"
                :alt="pizza.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Pizza Info -->
            <div class="p-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <p class="font-semibold text-sm">{{ pizza.name }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ pizza.description || '' }}</p>
                </div>
                <div v-if="isSelected(pizza.id)" class="text-red-500 font-bold">✓</div>
              </div>

              <!-- Base Selection (shown if pizza is selected) -->
              <div v-if="isSelected(pizza.id)" class="mt-3 pt-3 border-t">
                <p class="text-xs font-semibold text-gray-700 mb-2">Base :</p>
                <div class="flex gap-2">
                  <button
                    v-for="base in ['crème', 'tomate']"
                    :key="base"
                    @click.stop="selectBase(pizza.id, base)"
                    type="button"
                    class="flex-1 px-2 py-1 text-xs rounded border transition-colors"
                    :class="getSelectedBase(pizza.id) === base
                      ? 'border-red-500 bg-red-50 text-red-700 font-semibold'
                      : 'border-gray-300 hover:border-red-300'"
                  >
                    {{ base }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Price -->
            <div class="px-3 pb-3">
              <p class="text-sm font-semibold">€{{ pizza.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Calculation -->
      <div v-if="selectedCount > 0" class="border-t px-6 py-4 bg-gray-50">
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span>Prix original :</span>
            <span>€{{ originalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm font-semibold text-red-500">
            <span>Prix promo :</span>
            <span>€{{ promoPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm text-green-600">
            <span>Économies :</span>
            <span>€{{ (originalPrice - promoPrice).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Validation Message -->
      <div v-if="validationError" class="px-6 pt-4">
        <div class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {{ validationError }}
        </div>
      </div>

      <!-- Buttons -->
      <div class="border-t px-6 py-4 flex gap-3 sticky bottom-0 bg-white">
        <button
          type="button"
          @click="close"
          class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="addToCart"
          :disabled="selectedCount !== 2 || loading"
          class="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <span v-if="loading">Ajout...</span>
          <span v-else>Ajouter au panier</span>
        </button>
      </div>

      <!-- Base Selection Modal -->
      <BaseSelectionModal
        :isOpen="showBaseModal"
        :pizzaName="currentPizzaName"
        @select="onBaseSelected"
        @cancel="showBaseModal = false"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * PromoPizzaSelectModal Component
 * 
 * Modal for selecting 2 pizzas and choosing bases for the 2-pizza promotion.
 * Allows customers to:
 * - Select exactly 2 pizzas
 * - Choose base (crème/tomate) for each pizza
 * - See real-time promo pricing
 * - Add to cart when complete
 * 
 * @component
 * @example
 * <PromoPizzaSelectModal
 *   :isOpen="showPromoModal"
 *   :promoItem="twoPizzasPromo"
 *   :availablePizzas="pizzaList"
 *   @close="showPromoModal = false"
 *   @add="addPromoToCart"
 * />
 */

import { ref, computed, reactive } from 'vue'
import BaseSelectionModal from './BaseSelectionModal.vue'
import restaurantService from '@/services/restaurantService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  promoItem: {
    type: Object,
    default: () => ({})
  },
  availablePizzas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'add'])

const loading = ref(false)
const showBaseModal = ref(false)
const validationError = ref('')
const currentPizzaName = ref('')
const currentPizzaId = ref(null)

// Selected pizzas state: { pizzaId: { selected: true, base: 'crème'/'tomate' } }
const selectedPizzas = reactive({})

// Original and promo prices
const originalPrice = ref(0)
const promoPrice = ref(0)

/**
 * Count of selected pizzas
 */
const selectedCount = computed(() => {
  return Object.values(selectedPizzas).filter(p => p.selected).length
})

/**
 * Check if pizza is selected
 */
const isSelected = (pizzaId) => {
  return selectedPizzas[pizzaId]?.selected ?? false
}

/**
 * Get selected base for pizza
 */
const getSelectedBase = (pizzaId) => {
  return selectedPizzas[pizzaId]?.base || null
}

/**
 * Toggle pizza selection
 */
const togglePizzaSelection = (pizza) => {
  if (isSelected(pizza.id)) {
    // Deselect
    delete selectedPizzas[pizza.id]
  } else {
    // Check if we already have 2 pizzas selected
    if (selectedCount.value >= 2) {
      validationError.value = 'Vous pouvez sélectionner maximum 2 pizzas'
      return
    }
    validationError.value = ''
    
    // Show base selection modal
    currentPizzaId.value = pizza.id
    currentPizzaName.value = pizza.name
    showBaseModal.value = true
  }

  // Recalculate price
  calculatePrice()
}

/**
 * Select base for pizza (from BaseSelectionModal)
 */
const onBaseSelected = (base) => {
  if (currentPizzaId.value) {
    if (!selectedPizzas[currentPizzaId.value]) {
      selectedPizzas[currentPizzaId.value] = {}
    }
    selectedPizzas[currentPizzaId.value].selected = true
    selectedPizzas[currentPizzaId.value].base = base
  }
  showBaseModal.value = false
  calculatePrice()
}

/**
 * Select base directly from pizza card
 */
const selectBase = (pizzaId, base) => {
  if (!selectedPizzas[pizzaId]) {
    selectedPizzas[pizzaId] = { selected: true }
  }
  selectedPizzas[pizzaId].base = base
  calculatePrice()
}

/**
 * Calculate original and promo price
 */
const calculatePrice = () => {
  const selectedPizzasList = Object.entries(selectedPizzas)
    .filter(([_, pizza]) => pizza.selected)
    .map(([pizzaId, _]) => pizzaId)

  if (selectedPizzasList.length === 0) {
    originalPrice.value = 0
    promoPrice.value = 0
    return
  }

  // Calculate original price from selected pizzas
  let total = 0
  selectedPizzasList.forEach(pizzaId => {
    const pizza = props.availablePizzas.find(p => p.id == pizzaId)
    if (pizza) total += pizza.price
  })

  originalPrice.value = total

  // For 2 pizzas, promo price is typically fixed at €14.99
  if (selectedCount.value === 2) {
    promoPrice.value = 14.99
  } else {
    promoPrice.value = total
  }
}

/**
 * Add promotion to cart
 */
const addToCart = async () => {
  // Validation
  validationError.value = ''

  if (selectedCount.value !== 2) {
    validationError.value = 'Vous devez sélectionner exactement 2 pizzas'
    return
  }

  // Check all pizzas have bases selected
  const pizzasWithoutBase = Object.entries(selectedPizzas)
    .filter(([_, pizza]) => pizza.selected && !pizza.base)
  
  if (pizzasWithoutBase.length > 0) {
    validationError.value = 'Sélectionnez une base pour chaque pizza'
    return
  }

  loading.value = true

  try {
    // Get pizza IDs and bases
    const pizzaIds = Object.entries(selectedPizzas)
      .filter(([_, pizza]) => pizza.selected)
      .map(([id, _]) => parseInt(id))

    const bases = Object.entries(selectedPizzas)
      .filter(([_, pizza]) => pizza.selected)
      .map(([_, pizza]) => pizza.base)

    // Call API to validate and get price
    const response = await restaurantService.calculatePromoPrice({
      pizza_ids: pizzaIds,
      bases: bases
    })

    // Emit event with promo data
    emit('add', {
      promoItem: props.promoItem,
      pizzaIds: pizzaIds,
      bases: bases,
      price: response.data.promo_price,
      originalPrice: response.data.original_price,
      savings: response.data.savings
    })

    close()
  } catch (error) {
    validationError.value = error.response?.data?.message || 'Erreur lors du calcul du prix'
  } finally {
    loading.value = false
  }
}

/**
 * Close modal
 */
const close = () => {
  Object.keys(selectedPizzas).forEach(key => delete selectedPizzas[key])
  originalPrice.value = 0
  promoPrice.value = 0
  validationError.value = ''
  emit('close')
}
</script>
