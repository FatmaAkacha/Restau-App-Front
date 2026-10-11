<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 border-b px-6 py-5 bg-gradient-to-r from-red-50 to-white flex items-center justify-between rounded-t-2xl">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Offre Livraison</h2>
          <p class="text-sm text-gray-600 mt-1">2 Pizzas + 3ème Offerte • Sélectionnez 3 pizzas</p>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-bold text-red-500">{{ selectedCount }}/3</span>
          <span class="text-xs text-gray-500">Pizzas</span>
        </div>
      </div>

      <!-- Pizza Selection Grid -->
      <div class="px-6 py-6 bg-gray-50">
        <div v-if="eligiblePizzas.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-lg">Aucune pizza disponible</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="pizza in eligiblePizzas"
            :key="pizza.id"
            class="bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg"
            :class="getSelectedBase(pizza.id) 
              ? 'border-green-400 shadow-md ring-2 ring-green-200' 
              : 'border-gray-200 hover:border-red-300'"
            @click="togglePizzaSelection(pizza)"
          >
            <!-- Pizza Image -->
            <div class="h-40 bg-gray-200 overflow-hidden rounded-t-xl relative">
              <img
                :src="getImageUrl(pizza.image)"
                :alt="pizza.name"
                class="w-full h-full object-cover transition-transform hover:scale-105"
                @error="e => e.target.src = '/images/menu/pizza.png'"
              />
              <div v-if="getSelectedBase(pizza.id)" class="absolute inset-0 bg-green-500 bg-opacity-10 flex items-center justify-center">
                <div class="text-white text-4xl font-bold bg-green-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">✓</div>
              </div>
              <!-- "Gratuit" badge for 3rd pizza -->
              <div v-if="selectedCount === 3 && isPizzaThird(pizza.id)" class="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                🎁 Gratuit
              </div>
            </div>

            <!-- Pizza Info -->
            <div class="p-4">
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex-1">
                  <p class="font-bold text-sm text-gray-900">{{ pizza.name }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ pizza.description || '' }}</p>
                </div>
                <span class="font-bold text-red-500 text-sm whitespace-nowrap">€{{ pizza.price.toFixed(2) }}</span>
              </div>

              <!-- Base Selection (always visible) -->
              <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Choisir la base :</p>
                <div class="flex gap-2">
                  <button
                    v-for="base in ['crème', 'tomate']"
                    :key="base"
                    @click.stop="selectBase(pizza.id, base)"
                    type="button"
                    class="flex-1 px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all"
                    :class="getSelectedBase(pizza.id) === base
                      ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-red-300 bg-white'"
                  >
                    {{ base === 'crème' ? '🫕' : '🍅' }} {{ base }}
                  </button>
                </div>
                <div v-if="getSelectedBase(pizza.id)" class="mt-2">
                  <span class="inline-block text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-semibold border border-green-200">
                    ✓ Base {{ getSelectedBase(pizza.id) }} sélectionnée
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Calculation & Summary -->
      <div class="border-t px-6 py-5 bg-gray-50">
        <div class="space-y-4">
          <!-- Sauce Summary -->
          <div v-if="selectedCount > 0" class="bg-white p-4 rounded-lg border-2 border-blue-200">
            <p class="text-sm font-bold text-gray-900 mb-3">📋 Résumé de votre commande :</p>
            <div class="space-y-2">
              <div v-for="(pizza, idx) in getSelectedPizzasSummary()" :key="pizza.id" class="flex items-center gap-3 text-sm">
                <span class="font-semibold text-gray-700">Pizza {{ idx + 1 }} :</span>
                <span class="text-gray-600">{{ pizza.name }}</span>
                <span v-if="pizza.base" class="ml-auto bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {{ pizza.base === 'crème' ? '🫕' : '🍅' }} {{ pizza.base }}
                </span>
                <span v-else class="ml-auto bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
                  ⚠️ Base requise
                </span>
                <span v-if="idx === 2" class="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                  🎁 Offerte
                </span>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div v-if="selectedCount > 0" class="space-y-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-700">1ère Pizza :</span>
              <span class="font-semibold text-gray-900">€{{ (firstPizzaPrice).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-700">2ème Pizza :</span>
              <span class="font-semibold text-gray-900">€{{ (secondPizzaPrice).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-700">3ème Pizza :</span>
              <span class="font-semibold text-green-600 font-bold">🎁 Gratuit</span>
            </div>
            <div class="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span class="text-gray-900">Total :</span>
              <span class="text-red-500">€{{ (firstPizzaPrice + secondPizzaPrice).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Message -->
      <div v-if="validationError" class="px-6 pt-4">
        <div class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold flex items-start gap-3">
          <span class="text-xl mt-0.5">⚠️</span>
          <div>{{ validationError }}</div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="border-t px-6 py-4 flex gap-3 sticky bottom-0 bg-white rounded-b-2xl">
        <button
          type="button"
          @click="close"
          class="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-semibold"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="addToCart"
          :disabled="selectedCount !== 3 || !areAllBasesSelected() || loading"
          class="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <span v-if="loading">⏳ Ajout...</span>
          <span v-else-if="selectedCount !== 3">Sélectionnez 3 pizzas</span>
          <span v-else-if="!areAllBasesSelected()">Choisissez les bases</span>
          <span v-else>✓ Ajouter au panier</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

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
const validationError = ref('')

const selectedPizzas = reactive({})
const firstPizzaPrice = ref(0)
const secondPizzaPrice = ref(0)

const selectedCount = computed(() => {
  return Object.values(selectedPizzas).filter(p => p.selected).length
})

const selectedPizzasList = computed(() => {
  return Object.keys(selectedPizzas).filter(id => selectedPizzas[id].selected)
})

const isSelected = (pizzaId) => {
  return selectedPizzas[pizzaId]?.selected ?? false
}

const getSelectedBase = (pizzaId) => {
  return selectedPizzas[pizzaId]?.base || null
}

/**
 * Get ALL pizzas from the Pizza category directly from store
 * IGNORE the availablePizzas prop - fetch from actual menu data instead
 */
const eligiblePizzas = computed(() => {
  if (!props.availablePizzas || props.availablePizzas.length === 0) {
    return []
  }
  
  // Return all available items
  return props.availablePizzas.filter(item => item.is_available !== false)
})

function getImageUrl(path) {
  if (!path) return '/images/menu/pizza.png'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('blob:')) return path
  if (path.startsWith('storage/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://goodnaan.com/api'
    const baseUrl = apiUrl.replace('/api', '')
    return `${baseUrl}/${path}`
  }
  if (path.startsWith('/storage/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://goodnaan.com/api'
    const baseUrl = apiUrl.replace('/api', '')
    return `${baseUrl}${path}`
  }
  return `/images/menu/${path}`
}

const togglePizzaSelection = (pizza) => {
  if (isSelected(pizza.id)) {
    delete selectedPizzas[pizza.id]
    recalculatePrices()
  } else {
    if (selectedCount.value >= 3) {
      validationError.value = 'Vous pouvez sélectionner maximum 3 pizzas'
      return
    }
    validationError.value = ''
    selectedPizzas[pizza.id] = { selected: true, base: null }
    recalculatePrices()
  }
}

const selectBase = (pizzaId, base) => {
  if (!selectedPizzas[pizzaId]) {
    selectedPizzas[pizzaId] = { selected: true }
  }
  selectedPizzas[pizzaId].base = base
}

const recalculatePrices = () => {
  // Get selected pizzas data
  const selectedList = Object.entries(selectedPizzas)
    .filter(([_, pizza]) => pizza.selected)
    .map(([pizzaId, _]) => {
      const pizza = props.availablePizzas.find(p => p.id == pizzaId)
      return { price: pizza?.price || 0, id: pizzaId }
    })

  // For the delivery offer, we charge only 2 pizzas (the 3rd is free)
  // We take the 2 most expensive pizzas to maximize the value given
  const sortedByPrice = [...selectedList].sort((a, b) => b.price - a.price)

  if (selectedList.length >= 1) {
    firstPizzaPrice.value = sortedByPrice[0]?.price || 0
  } else {
    firstPizzaPrice.value = 0
  }

  if (selectedList.length >= 2) {
    secondPizzaPrice.value = sortedByPrice[1]?.price || 0
  } else {
    secondPizzaPrice.value = 0
  }

  // 3rd pizza is always free - not added to total
}

const getSelectedPizzasSummary = () => {
  return Object.entries(selectedPizzas)
    .filter(([_, pizza]) => pizza.selected)
    .map(([pizzaId, pizza]) => {
      const pizzaData = props.availablePizzas.find(p => p.id == pizzaId)
      return {
        id: pizzaId,
        name: pizzaData?.name || 'Pizza',
        base: pizza.base
      }
    })
}

const isPizzaThird = (pizzaId) => {
  const selectedList = getSelectedPizzasSummary()
  return selectedList.length === 3 && selectedList[2].id == pizzaId
}

const areAllBasesSelected = () => {
  const selected = Object.values(selectedPizzas).filter(p => p.selected)
  if (selected.length !== 3) return false
  return selected.every(p => p.base)
}

const addToCart = async () => {
  validationError.value = ''

  if (selectedCount.value !== 3) {
    validationError.value = 'Vous devez sélectionner exactement 3 pizzas'
    return
  }

  const pizzasWithoutBase = Object.entries(selectedPizzas)
    .filter(([_, pizza]) => pizza.selected && !pizza.base)
  
  if (pizzasWithoutBase.length > 0) {
    validationError.value = 'Sélectionnez une base pour chaque pizza'
    return
  }

  loading.value = true

  try {
    const pizzaIds = Object.entries(selectedPizzas)
      .filter(([_, pizza]) => pizza.selected)
      .map(([id, _]) => parseInt(id))

    const bases = Object.entries(selectedPizzas)
      .filter(([_, pizza]) => pizza.selected)
      .map(([_, pizza]) => pizza.base)

    const summary = getSelectedPizzasSummary()
      .map((p, idx) => `Pizza ${idx + 1}: ${p.name} (${p.base})`)
      .join(' • ')

    const totalPrice = firstPizzaPrice.value + secondPizzaPrice.value

    emit('add', {
      name: 'Offre Livraison - 2 Pizzas + 3ème Offerte',
      price: totalPrice,
      cartKey: `promo_delivery_${Date.now()}_${Math.random()}`,
      quantity: 1,
      pizzaIds: pizzaIds,
      bases: bases,
      summary: summary,
      isPromo: true
    })

    close()
  } catch (error) {
    validationError.value = error.response?.data?.message || 'Erreur lors du calcul du prix'
  } finally {
    loading.value = false
  }
}

const close = () => {
  Object.keys(selectedPizzas).forEach(key => delete selectedPizzas[key])
  firstPizzaPrice.value = 0
  secondPizzaPrice.value = 0
  validationError.value = ''
  emit('close')
}
</script>

