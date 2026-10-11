<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <!-- Header -->
      <div class="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-gradient-to-r from-red-50 to-white px-6 py-5">
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
          <p class="mt-1 text-sm text-gray-600">{{ description }}</p>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-2xl font-bold text-red-500">{{ selectedCount }}/{{ requiredPizzas }}</span>
          <span class="text-xs text-gray-500">Pizzas</span>
        </div>
      </div>

      <!-- Grille des pizzas -->
      <div class="bg-gray-50 px-6 py-6">
        <div v-if="eligiblePizzas.length === 0" class="py-12 text-center">
          <p class="text-lg text-gray-500">Aucune pizza disponible</p>
        </div>
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div v-for="pizza in eligiblePizzas" :key="pizza.id"
               class="cursor-pointer rounded-xl border-2 bg-white transition-all hover:shadow-lg"
               :class="isSelected(pizza.id) ? 'border-green-400 shadow-md ring-2 ring-green-200' : 'border-gray-200 hover:border-red-300'"
               @click="togglePizzaSelection(pizza)">
            <div class="relative h-40 overflow-hidden rounded-t-xl bg-gray-200">
              <img :src="getImageUrl(pizza.image)" :alt="pizza.name"
                   class="h-full w-full object-cover transition-transform hover:scale-105"
                   @error="onImageError" />
              <div v-if="isSelected(pizza.id)" class="absolute inset-0 flex items-center justify-center bg-green-500/10">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-4xl font-bold text-white shadow-lg">✓</div>
              </div>
              <div v-if="isFreePizza(pizza.id)"
                   class="absolute left-2 top-2 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">🎁 Gratuite</div>
            </div>

            <div class="p-4">
              <div class="mb-2 flex items-start justify-between gap-2">
                <div class="flex-1">
                  <p class="text-sm font-bold text-gray-900">{{ pizza.name }}</p>
                  <p class="mt-1 text-xs text-gray-600">{{ pizza.description || '' }}</p>
                </div>
                <span class="whitespace-nowrap text-sm font-bold text-red-500">{{ formatPrice(pizza.price) }}</span>
              </div>
              <div class="mt-4 border-t border-gray-200 pt-4">
                <p class="mb-3 text-xs font-bold uppercase tracking-wide text-gray-700">Choisir la base :</p>
                <div class="flex gap-2">
                  <button v-for="base in ['crème', 'tomate']" :key="base" type="button"
                          :disabled="!isSelected(pizza.id)"
                          @click.stop="selectBase(pizza.id, base)"
                          class="flex-1 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                          :class="getSelectedBase(pizza.id) === base ? 'border-red-500 bg-red-50 text-red-700 shadow-md' : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'">
                    {{ base === 'crème' ? '🫕' : '🍅' }} {{ base }}
                  </button>
                </div>
                <div v-if="getSelectedBase(pizza.id)" class="mt-2">
                  <span class="inline-block rounded-full border border-green-200 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                    ✓ Base {{ getSelectedBase(pizza.id) }} sélectionnée
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé + prix -->
      <div v-if="selectedCount > 0" class="border-t bg-gray-50 px-6 py-5">
        <div class="rounded-lg border-2 border-blue-200 bg-white p-4">
          <p class="mb-3 text-sm font-bold text-gray-900">📋 Résumé de votre commande :</p>
          <div class="space-y-2">
            <div v-for="(pizza, idx) in sortedSummary" :key="pizza.id" class="flex items-center gap-3 text-sm">
              <span class="font-semibold text-gray-700">Pizza {{ idx + 1 }} :</span>
              <span class="text-gray-600">{{ pizza.name }}</span>
              <span v-if="pizza.base" class="ml-auto rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                {{ pizza.base === 'crème' ? '🫕' : '🍅' }} {{ pizza.base }}
              </span>
              <span v-else class="ml-auto rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">⚠️ Base requise</span>
              <span v-if="requiredPizzas === 3 && idx === 2" class="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">🎁 Offerte</span>
              <span v-if="requiredPizzas === 2 && idx === 1" class="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">-50 %</span>
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <template v-if="requiredPizzas === 2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700">Pizza la plus chère (plein tarif) :</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(highestPrice) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700">Autre pizza (50 %) :</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(halfPrice) }}</span>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700">Pizza la plus chère :</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(highestPrice) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700">Deuxième pizza :</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(secondHighestPrice) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700">Pizza la moins chère :</span>
              <span class="font-bold text-green-600">🎁 Gratuite</span>
            </div>
          </template>
          <div class="flex items-center justify-between border-t pt-2 text-lg font-bold">
            <span class="text-gray-900">Total :</span>
            <span class="text-red-500">{{ formatPrice(promoPrice) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm font-semibold text-green-600">
            <span>💰 Économies :</span>
            <span>{{ formatPrice(savings) }}</span>
          </div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-if="validationError" class="px-6 pt-4">
        <div class="flex items-start gap-3 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <span class="mt-0.5 text-xl">⚠️</span><div>{{ validationError }}</div>
        </div>
      </div>

      <!-- Boutons -->
      <div class="sticky bottom-0 flex gap-3 rounded-b-2xl border-t bg-white px-6 py-4">
        <button type="button" @click="close"
                class="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50">Annuler</button>
        <button type="button" @click="addToCart"
                :disabled="selectedCount !== requiredPizzas || !areAllBasesSelected || loading"
                class="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50">
          <span v-if="loading">⏳ Ajout...</span>
          <span v-else-if="selectedCount !== requiredPizzas">Sélectionnez {{ requiredPizzas }} pizzas</span>
          <span v-else-if="!areAllBasesSelected">Choisissez les bases</span>
          <span v-else>✓ Ajouter au panier</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  promoItem: { type: Object, default: () => ({}) },
  // Liste DÉJÀ filtrée sur la catégorie Pizza par le parent
  availablePizzas: { type: Array, default: () => [] },
  offerType: { type: String, default: 'takeaway' } // 'takeaway' | 'delivery'
})
const emit = defineEmits(['close', 'add'])

const loading = ref(false)
const validationError = ref('')
const selectedPizzas = reactive({})

const requiredPizzas = computed(() => (props.offerType === 'delivery' ? 3 : 2))
const title = computed(() =>
  props.promoItem?.name || (requiredPizzas.value === 3 ? 'Offre Livraison' : 'Offre À emporter')
)
const description = computed(() =>
  requiredPizzas.value === 3
    ? '2 Pizzas + 3ème Offerte • Sélectionnez exactement 3 pizzas'
    : '2 pizzas : la plus chère à plein tarif, la deuxième à moitié prix'
)

// Le parent a déjà filtré les pizzas : on garde seulement les disponibles
const eligiblePizzas = computed(() =>
  (props.availablePizzas || [])
    .filter(i => i.is_available !== false && i.is_available !== 0)
    .map(i => ({ ...i, price: Number(i.price) || 0 }))
)

const selectedCount = computed(() => Object.keys(selectedPizzas).length)

const selectedPizzasSummary = computed(() =>
  Object.entries(selectedPizzas).map(([id, sel]) => {
    const item = eligiblePizzas.value.find(p => String(p.id) === String(id))
    return { id, name: item?.name || 'Pizza', price: item?.price || 0, base: sel.base || null }
  })
)

// Trié du plus cher au moins cher
const sortedSummary = computed(() =>
  [...selectedPizzasSummary.value].sort((a, b) => b.price - a.price)
)

const highestPrice = computed(() => sortedSummary.value[0]?.price || 0)
const secondHighestPrice = computed(() => sortedSummary.value[1]?.price || 0)
const halfPrice = computed(() => secondHighestPrice.value / 2)
const originalPrice = computed(() => sortedSummary.value.reduce((sum, p) => sum + p.price, 0))

// 2 pizzas : la plus chère + moitié de l'autre
// 3 pizzas : les 2 plus chères, la moins chère est gratuite
const promoPrice = computed(() =>
  requiredPizzas.value === 2
    ? highestPrice.value + halfPrice.value
    : highestPrice.value + secondHighestPrice.value
)
const savings = computed(() => Math.max(0, originalPrice.value - promoPrice.value))

const areAllBasesSelected = computed(
  () => selectedCount.value === requiredPizzas.value && selectedPizzasSummary.value.every(p => Boolean(p.base))
)

const isSelected = id => Boolean(selectedPizzas[String(id)])
const getSelectedBase = id => selectedPizzas[String(id)]?.base || null
const isFreePizza = id => {
  if (requiredPizzas.value !== 3 || selectedCount.value !== 3) return false
  return String(sortedSummary.value[2]?.id) === String(id)
}
const formatPrice = value => `€${(Number(value) || 0).toFixed(2)}`

function getImageUrl(path) {
  if (!path) return '/images/menu/pizza.png'
  if (/^(https?:|blob:)/i.test(path)) return path
  const apiUrl = import.meta.env.VITE_API_URL || 'https://goodnaan.com/api'
  const baseUrl = apiUrl.replace(/\/api\/?$/, '')
  if (path.startsWith('/storage/')) return `${baseUrl}${path}`
  if (path.startsWith('storage/')) return `${baseUrl}/${path}`
  return `/images/menu/${path}`
}
function onImageError(event) {
  event.target.onerror = null
  event.target.src = '/images/menu/pizza.png'
}

function togglePizzaSelection(pizza) {
  const id = String(pizza.id)
  if (selectedPizzas[id]) {
    delete selectedPizzas[id]
  } else {
    if (selectedCount.value >= requiredPizzas.value) {
      validationError.value = `Vous pouvez sélectionner maximum ${requiredPizzas.value} pizzas`
      return
    }
    selectedPizzas[id] = { base: null }
  }
  validationError.value = ''
}
function selectBase(id, base) {
  const key = String(id)
  if (!selectedPizzas[key]) return
  selectedPizzas[key].base = base
}

async function addToCart() {
  validationError.value = ''
  if (selectedCount.value !== requiredPizzas.value) {
    validationError.value = `Vous devez sélectionner exactement ${requiredPizzas.value} pizzas`
    return
  }
  if (!areAllBasesSelected.value) {
    validationError.value = 'Sélectionnez une base pour chaque pizza'
    return
  }
  loading.value = true
  try {
    const selected = selectedPizzasSummary.value
    const pizzaIds = selected.map(p => Number(p.id))
    const bases = selected.map(p => p.base)
    const summary = selected.map((p, i) => `Pizza ${i + 1}: ${p.name} (${p.base})`).join(' • ')
    emit('add', {
      ...props.promoItem,
      name: title.value,
      price: Number(promoPrice.value.toFixed(2)),
      cartKey: `promo_${props.offerType}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      quantity: 1,
      pizzaIds,
      bases,
      summary,
      originalPrice: Number(originalPrice.value.toFixed(2)),
      savings: Number(savings.value.toFixed(2)),
      isPromo: true
    })
    close()
  } catch (error) {
    validationError.value = error?.response?.data?.message || 'Erreur lors du calcul du prix'
  } finally {
    loading.value = false
  }
}

function reset() {
  Object.keys(selectedPizzas).forEach(id => delete selectedPizzas[id])
  validationError.value = ''
}
function close() {
  reset()
  emit('close')
}
watch(() => props.isOpen, open => { if (!open) reset() })
</script>