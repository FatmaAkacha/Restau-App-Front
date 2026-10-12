<template>
  <div class="min-h-screen" style="background:#F7F7F7">

    <!-- Header -->
    <header class="border-b px-4 py-4 flex items-center gap-4 sticky top-0 z-20"
            style="background:#fff; border-color:#E5E5E5">
      <router-link to="/menu" class="text-sm transition-colors hover:text-red-600" style="color:#888">
        ← Retour
      </router-link>
      <h1 class="text-base font-bold" style="color:#1A1A1A">Passer la commande</h1>
    </header>

    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">

      <!-- Panier vide -->
      <div v-if="cart.items.length === 0" class="text-center py-20" style="color:#888">
        <div class="text-5xl mb-3 opacity-30">🛒</div>
        <p class="mb-4">Votre panier est vide.</p>
        <router-link to="/menu">
          <button class="btn-primary">Voir le menu</button>
        </router-link>
      </div>

      <template v-else>

        <!-- Mode de réception (en premier) -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4" style="color:#1A1A1A">🛍️ Mode de réception</h2>
          <div class="flex gap-3">
            <button
              @click="selectDelivery"
              :disabled="belowMinOrder"
              class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed"
              :style="form.type === 'delivery'
                ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                : belowMinOrder
                  ? 'border-color:#D5D5D5; background:#F0F0F0; color:#8A8A8A; border-style:dashed'
                  : 'border-color:#E5E5E5; background:#fff; color:#888'">
              🚚 Livraison
              <span v-if="belowMinOrder" class="block text-xs font-normal mt-0.5" style="color:#8A8A8A">
                Dès €{{ MIN_ORDER }}
              </span>
            </button>

            <button
              @click="form.type = 'pickup'"
              class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all"
              :style="form.type === 'pickup'
                ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                : 'border-color:#E5E5E5; background:#fff; color:#888'">
              🏃 À emporter
            </button>
          </div>

          <p v-if="belowMinOrder" class="text-xs mt-3" style="color:#888">
            La livraison est disponible à partir de €{{ MIN_ORDER }} d'achat.
            <router-link to="/menu" class="font-semibold" style="color:#E8192C">Ajouter des articles →</router-link>
          </p>
        </div>

        <!-- Coordonnées / Informations de livraison -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4" style="color:#1A1A1A">
            📍 {{ form.type === 'delivery' ? 'Informations de livraison' : 'Coordonnées' }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#888">Nom complet *</label>
              <input v-model="form.customer_name" type="text" placeholder="Jean Dupont" class="input" />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#888">Téléphone *</label>
              <input v-model="form.customer_phone" type="tel" placeholder="+33 6 00 00 00 00" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium mb-1.5" style="color:#888">Email</label>
              <input v-model="form.customer_email" type="email" placeholder="vous@exemple.com" class="input" />
            </div>
            <div v-if="form.type === 'delivery'" class="sm:col-span-2">
              <label class="block text-xs font-medium mb-1.5" style="color:#888">Adresse de livraison *</label>
              <input v-model="form.delivery_address" type="text" placeholder="12 Rue de la Paix, Caen" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium mb-1.5" style="color:#888">
                Notes / Allergies
                <span v-if="itemNotesSummary" class="font-normal" style="color:#AAA"> — pré-rempli, modifiable</span>
              </label>
              <textarea v-model="form.notes" rows="3"
                        placeholder="Ex : sans oignons, allergie aux noix…"
                        class="input resize-none"
                        @input="userEditedNotes = true" />
            </div>
          </div>
        </div>

        <!-- Heure de retrait / livraison -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4" style="color:#1A1A1A">
            🕒 {{ form.type === 'delivery' ? 'Heure de livraison' : 'Heure de retrait' }}
          </h2>
          <div class="flex gap-3">
            <button
              @click="timing = 'asap'"
              class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all"
              :style="timing === 'asap'
                ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                : 'border-color:#E5E5E5; background:#fff; color:#888'">
              ⚡ Dès que possible
            </button>
            <button
              @click="chooseScheduled"
              :disabled="timeSlots.length === 0"
              class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed"
              :style="timeSlots.length === 0
                ? 'border-color:#E5E5E5; background:#F9F9F9; color:#CCC'
                : timing === 'scheduled'
                  ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                  : 'border-color:#E5E5E5; background:#fff; color:#888'">
              📅 Programmer
            </button>
          </div>

          <p v-if="timing === 'asap'" class="text-xs mt-3" style="color:#888">
            Environ {{ leadMinutes }} min après la validation de la commande.
          </p>
          <div v-else class="mt-3">
            <label class="block text-xs font-medium mb-1.5" style="color:#888">
              {{ form.type === 'delivery' ? 'Heure de livraison souhaitée' : 'Heure de retrait souhaitée' }} (aujourd'hui)
            </label>
            <select v-model="scheduledFor" class="input">
              <option v-for="slot in timeSlots" :key="slot.value" :value="slot.value">{{ slot.label }}</option>
            </select>
          </div>
          <p v-if="timeSlots.length === 0" class="text-xs mt-3" style="color:#E8192C">
            Plus de créneaux disponibles aujourd'hui.
          </p>
        </div>

        <!-- Récapitulatif -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4" style="color:#1A1A1A">🧾 Récapitulatif</h2>
          <div v-for="item in cart.items" :key="item.cartKey || item.id"
               class="py-3"
               style="border-bottom:1px solid #F0F0F0">
            <div class="flex justify-between text-sm">
              <div class="flex items-start gap-2 flex-1 min-w-0">
                <span class="flex-shrink-0 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5"
                      style="background:#E8192C">{{ item.quantity }}</span>
                <div class="min-w-0">
                  <p class="font-medium truncate" style="color:#1A1A1A">{{ item.name }}</p>
                  <p v-if="item.summary" class="text-xs mt-0.5" style="color:#E8192C">{{ item.summary }}</p>
                  <p v-if="item.notes" class="text-xs mt-0.5 italic" style="color:#AAA">📝 {{ item.notes }}</p>
                </div>
              </div>
              <span class="font-semibold flex-shrink-0 ml-3" style="color:#1A1A1A">
                €{{ (item.price * item.quantity).toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between" style="color:#888">
              <span>Sous-total</span>
              <span>€{{ cart.subtotal.toFixed(2) }}</span>
            </div>

            <!-- Frais de livraison -->
            <div v-if="form.type === 'delivery' && !belowMinOrder" class="mt-4">
              <p v-if="calculatingDeliveryFee" class="text-xs" style="color:#888">Calcul des frais de livraison…</p>
              <p v-else-if="deliveryPricingError" class="text-xs" style="color:#E8192C">{{ deliveryPricingError }}</p>
              <p v-else-if="deliveryDistance === null" class="text-xs" style="color:#888">
                Saisissez votre adresse pour calculer les frais de livraison.
              </p>
              <DeliveryPricingDisplay
                v-else
                :distance="deliveryDistance"
                :deliveryFee="deliveryFee"
                :baseFee="DELIVERY_BASE_FEE"
                :perKmRate="DELIVERY_PER_KM"
                :deliverable="!tooFar"
              />
            </div>

            <div class="flex justify-between font-bold text-base pt-3"
                 style="border-top:1px solid #E5E5E5; color:#1A1A1A">
              <span>Total</span>
              <span style="color:#E8192C">€{{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Paiement -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4" style="color:#1A1A1A">💳 Paiement</h2>

          <div class="space-y-2">
            <label v-for="opt in paymentOptions" :key="opt.value"
                   class="flex items-center p-3 rounded-lg border cursor-pointer transition-all"
                   :style="form.payment_method === opt.value
                     ? 'border-color:#E8192C; background:#FFF0F1'
                     : 'border-color:#E5E5E5; background:#fff'">
              <input type="radio" v-model="form.payment_method" :value="opt.value" class="mr-3">
              <div>
                <p class="font-semibold text-sm"
                   :style="form.payment_method === opt.value ? 'color:#E8192C' : 'color:#1A1A1A'">
                  {{ opt.label }}
                </p>
                <p class="text-xs mt-0.5" style="color:#888">{{ opt.hint }}</p>
              </div>
            </label>
          </div>

          <!-- Formulaire Stripe : uniquement pour le paiement en ligne -->
          <div v-if="form.payment_method === 'online'"
               class="mt-4 rounded-xl border p-4 space-y-4"
               style="background:#FAFAFA; border-color:#E5E5E5">

            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold" style="color:#1A1A1A">💳 Détails de la carte</p>
              <div class="flex gap-1.5">
                <span v-for="b in ['VISA', 'Mastercard', 'CB']" :key="b"
                      class="px-2 py-0.5 rounded border font-bold tracking-wide"
                      style="background:#fff; border-color:#E5E5E5; color:#666; font-size:10px">{{ b }}</span>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:#888">Numéro de carte</label>
              <div class="stripe-field" :class="{ 'is-focused': fieldFocus.number, 'is-invalid': fieldError.number }">
                <div id="card-number" />
              </div>
              <p v-if="fieldError.number" class="text-xs mt-1.5" style="color:#E8192C">{{ fieldError.number }}</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#888">Date d'expiration</label>
                <div class="stripe-field" :class="{ 'is-focused': fieldFocus.expiry, 'is-invalid': fieldError.expiry }">
                  <div id="card-expiry" />
                </div>
                <p v-if="fieldError.expiry" class="text-xs mt-1.5" style="color:#E8192C">{{ fieldError.expiry }}</p>
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5" style="color:#888">Code de sécurité (CVC)</label>
                <div class="stripe-field" :class="{ 'is-focused': fieldFocus.cvc, 'is-invalid': fieldError.cvc }">
                  <div id="card-cvc" />
                </div>
                <p v-if="fieldError.cvc" class="text-xs mt-1.5" style="color:#E8192C">{{ fieldError.cvc }}</p>
              </div>
            </div>

            <p v-if="stripeError" class="text-xs rounded-lg p-2" style="color:#E8192C; background:#FFF0F1">{{ stripeError }}</p>

            <p class="text-xs" style="color:#999">
              🔒 Paiement sécurisé par Stripe. Vos données bancaires ne sont jamais stockées sur notre site.
            </p>
          </div>
        </div>

        <!-- Bouton commander -->
        <button @click="placeOrder" :disabled="loading" class="btn-primary w-full py-4 text-base">
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement en cours…
          </span>
          <span v-else>Commander · €{{ total.toFixed(2) }} →</span>
        </button>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useRestaurantStore } from '@/stores/restaurantStore'

import orderService from '@/services/orderService'
import paymentService from '@/services/paymentService'
import DeliveryPricingDisplay from '@/components/DeliveryPricingDisplay.vue'

const cart = useCartStore()
const restStore = useRestaurantStore()
const router = useRouter()

/* ─────────────────────────────
   RÉGLAGES (à modifier ici)
───────────────────────────── */
const MIN_ORDER = 20            // minimum pour la livraison (€)

// Barème livraison : base + km × tarif/km  (mettre DELIVERY_PER_KM = 0 pour un tarif fixe à 1,99 €)
const DELIVERY_BASE_FEE = 1.99
const DELIVERY_PER_KM = 0.30
const MAX_DELIVERY_KM = 10      // au-delà : livraison refusée

// Horaires pour les commandes programmées
const OPENING = { open: 11, close: 23 }   // premier et dernier créneau (heures)
const SLOT_STEP_MIN = 15                  // un créneau tous les 15 min
const LEAD_MINUTES = { pickup: 20, delivery: 45 } // délai minimum de préparation

/* ─────────────────────────────
   ÉTAT
───────────────────────────── */
const form = ref({
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  delivery_address: '',
  notes: '',
  type: 'delivery',
  payment_method: 'card_delivery',
})

const loading = ref(false)
const error = ref('')
const stripeError = ref('')

let stripe = null
let cardElement = null     // champ numéro (sert aussi à confirmer le paiement)
let expiryElement = null
let cvcElement = null

const fieldFocus = reactive({ number: false, expiry: false, cvc: false })
const fieldError = reactive({ number: '', expiry: '', cvc: '' })
const fieldComplete = reactive({ number: false, expiry: false, cvc: false })
const cardReady = computed(() => fieldComplete.number && fieldComplete.expiry && fieldComplete.cvc)

/* ─────────────────────────────
   PAIEMENT
───────────────────────────── */
const paymentOptions = computed(() => [
  {
    value: 'online',
    label: 'Carte bancaire en ligne',
    hint: 'Paiement sécurisé maintenant',
    show: true,
  },
  {
    value: 'card_in_store',
    label: 'Carte bleue au comptoir',
    hint: 'Payer au retrait de la commande avec une carte',
    show: form.value.type === 'pickup',
  },
  {
    value: 'card_delivery',
    label: 'Carte bleue à la livraison',
    hint: 'Payer au livreur avec une carte',
    show: form.value.type === 'delivery',
  },
].filter(o => o.show))

// Quand on change de mode, on choisit le paiement sur place correspondant
watch(() => form.value.type, (type) => {
  if (form.value.payment_method !== 'online') {
    form.value.payment_method = type === 'pickup' ? 'card_in_store' : 'card_delivery'
  }
})

/* ─────────────────────────────
   HEURE DE RETRAIT / LIVRAISON
───────────────────────────── */
const timing = ref('asap')          // 'asap' | 'scheduled'
const scheduledFor = ref('')
const nowTick = ref(Date.now())
let nowTimer = null

const leadMinutes = computed(() => LEAD_MINUTES[form.value.type] ?? 30)

const timeSlots = computed(() => {
  const earliest = nowTick.value + leadMinutes.value * 60000
  const start = new Date(nowTick.value); start.setHours(OPENING.open, 0, 0, 0)
  const end = new Date(nowTick.value);   end.setHours(OPENING.close, 0, 0, 0)

  const slots = []
  for (let t = start.getTime(); t <= end.getTime(); t += SLOT_STEP_MIN * 60000) {
    if (t >= earliest) {
      slots.push({
        value: new Date(t).toISOString(),
        label: new Date(t).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      })
    }
  }
  return slots
})

function chooseScheduled() {
  if (timeSlots.value.length === 0) return
  timing.value = 'scheduled'
  if (!scheduledFor.value) scheduledFor.value = timeSlots.value[0].value
}

// Si le créneau choisi n'est plus valide (temps écoulé, changement de mode), on le corrige
watch(timeSlots, (slots) => {
  if (timing.value !== 'scheduled') return
  if (slots.length === 0) {
    timing.value = 'asap'
    scheduledFor.value = ''
  } else if (!slots.some(s => s.value === scheduledFor.value)) {
    scheduledFor.value = slots[0].value
  }
})

/* ─────────────────────────────
   FRAIS DE LIVRAISON
───────────────────────────── */
const deliveryDistance = ref(null)
const deliveryPricingError = ref('')
const calculatingDeliveryFee = ref(false)

let feeTimer = null
let feeRequestId = 0

// Géocodage réel via OpenStreetMap (Nominatim) — limité à la France
async function geocodeAddress(address) {
  const url = 'https://nominatim.openstreetmap.org/search'
    + `?format=jsonv2&limit=1&countrycodes=fr&accept-language=fr&q=${encodeURIComponent(address)}`
  const res = await fetch(url)
  if (!res.ok) return null
  const [hit] = await res.json()
  return hit ? { lat: parseFloat(hit.lat), lng: parseFloat(hit.lon) } : null
}

async function calculateDeliveryFee() {
  const address = form.value.delivery_address.trim()

  if (form.value.type !== 'delivery' || address.length < 5) {
    deliveryDistance.value = null
    deliveryPricingError.value = ''
    calculatingDeliveryFee.value = false
    return
  }

  const requestId = ++feeRequestId
  calculatingDeliveryFee.value = true
  deliveryPricingError.value = ''

  try {
    const coordinates = await geocodeAddress(address)
    if (requestId !== feeRequestId) return

    if (!coordinates) {
      deliveryDistance.value = null
      deliveryPricingError.value = 'Adresse introuvable. Vérifiez le numéro, la rue et la ville.'
      return
    }

    const restaurantId = restStore.restaurant?.id || cart.restaurantId
    const response = await orderService.calculateDeliveryFee({
      restaurant_id: restaurantId,
      customer_latitude: coordinates.lat,
      customer_longitude: coordinates.lng,
    })
    if (requestId !== feeRequestId) return

    deliveryDistance.value = Number(response.data.distance_km)
  } catch (err) {
    if (requestId !== feeRequestId) return
    deliveryDistance.value = null
    deliveryPricingError.value = 'Impossible de calculer les frais de livraison.'
  } finally {
    if (requestId === feeRequestId) calculatingDeliveryFee.value = false
  }
}

// On attend que le client finisse de taper avant de calculer
watch(() => form.value.delivery_address, () => {
  clearTimeout(feeTimer)
  feeTimer = setTimeout(calculateDeliveryFee, 800)
})

watch(() => form.value.type, () => {
  clearTimeout(feeTimer)
  calculateDeliveryFee()
})

const belowMinOrder = computed(() => cart.subtotal < MIN_ORDER)
const missingForDelivery = computed(() => Math.max(0, MIN_ORDER - cart.subtotal))

const tooFar = computed(() =>
  deliveryDistance.value !== null && deliveryDistance.value > MAX_DELIVERY_KM
)

const deliveryFee = computed(() => {
  if (form.value.type !== 'delivery') return 0
  if (belowMinOrder.value) return 0
  if (deliveryDistance.value === null) return 0
  return Math.round((DELIVERY_BASE_FEE + deliveryDistance.value * DELIVERY_PER_KM) * 100) / 100
})

const total = computed(() => cart.subtotal + deliveryFee.value)

function selectDelivery() {
  if (!belowMinOrder.value) form.value.type = 'delivery'
}

// immediate : si le panier est déjà sous le minimum à l'ouverture, on passe en "À emporter"
watch(() => cart.subtotal, (val) => {
  if (val < MIN_ORDER && form.value.type === 'delivery') form.value.type = 'pickup'
}, { immediate: true })

/* ─────────────────────────────
   NOTES
───────────────────────────── */
const itemNotesSummary = computed(() =>
  cart.items
    .filter(i => i.notes && i.notes.trim())
    .map(i => `• ${i.name} : ${i.notes.trim()}`)
    .join('\n')
)

const checkoutNotes = computed(() => cart.checkoutNotes || '')

const mergedNotes = computed(() => {
  const notes = []
  if (checkoutNotes.value.trim()) {
    notes.push('📝 Notes générales :')
    notes.push(checkoutNotes.value.trim())
  }
  if (itemNotesSummary.value.trim()) {
    notes.push('')
    notes.push('🍔 Notes produits :')
    notes.push(itemNotesSummary.value.trim())
  }
  return notes.join('\n')
})

const userEditedNotes = ref(false)

const _stopAutoFill = watchEffect(() => {
  if (!userEditedNotes.value) form.value.notes = mergedNotes.value
})

/* ─────────────────────────────
   STRIPE (paiement en ligne uniquement)
───────────────────────────── */
const STRIPE_STYLE = {
  base: {
    fontSize: '16px',
    color: '#1A1A1A',
    fontFamily: 'inherit',
    '::placeholder': { color: '#AAAAAA' },
  },
  invalid: { color: '#E8192C' },
}

function destroyCard() {
  cardElement?.destroy()
  expiryElement?.destroy()
  cvcElement?.destroy()
  cardElement = expiryElement = cvcElement = null
  for (const k of ['number', 'expiry', 'cvc']) {
    fieldFocus[k] = false
    fieldError[k] = ''
    fieldComplete[k] = false
  }
}

async function mountCard() {
  await nextTick()
  if (!document.getElementById('card-number')) return
  stripeError.value = ''

  try {
    stripe = stripe || await paymentService.getStripe()
    if (!stripe) {
      stripeError.value = 'Paiement en ligne indisponible (clé Stripe manquante).'
      return
    }
    if (!document.getElementById('card-number')) return // le client a changé de mode entre-temps

    destroyCard()
    const elements = stripe.elements({ locale: 'fr' })

    const setup = (key, type, selector, options) => {
      const el = elements.create(type, { style: STRIPE_STYLE, ...options })
      el.mount(selector)
      el.on('focus', () => { fieldFocus[key] = true })
      el.on('blur', () => { fieldFocus[key] = false })
      el.on('change', e => {
        fieldError[key] = e.error?.message || ''
        fieldComplete[key] = e.complete
      })
      return el
    }

    cardElement   = setup('number', 'cardNumber', '#card-number', { placeholder: '1234 1234 1234 1234', showIcon: true })
    expiryElement = setup('expiry', 'cardExpiry', '#card-expiry', { placeholder: 'MM / AA' })
    cvcElement    = setup('cvc',    'cardCvc',    '#card-cvc',    { placeholder: '123' })
  } catch (e) {
    console.error('Erreur Stripe :', e)
    stripeError.value = `Impossible de charger le formulaire de carte : ${e.message || e}`
  }
}
watch(() => form.value.payment_method, async (method) => {
  if (method === 'online') {
    await mountCard()
  } else {
    destroyCard()
    stripeError.value = ''
  }
})

onMounted(async () => {
  nowTimer = setInterval(() => { nowTick.value = Date.now() }, 60000)

  // Préchargement de Stripe sans bloquer le reste
  paymentService.getStripe().then(s => { stripe = s }).catch(() => {})

  if (!restStore.restaurant) await restStore.fetchMenu()
})

onUnmounted(() => {
  clearInterval(nowTimer)
  clearTimeout(feeTimer)
  destroyCard()
  _stopAutoFill()
})

/* ─────────────────────────────
   PASSER LA COMMANDE
───────────────────────────── */
async function placeOrder() {
  error.value = ''
  const isDelivery = form.value.type === 'delivery'
  const isOnline = form.value.payment_method === 'online'

  if (!form.value.customer_name || !form.value.customer_phone || (isDelivery && !form.value.delivery_address)) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }

  if (isDelivery) {
    if (calculatingDeliveryFee.value) {
      error.value = 'Calcul des frais de livraison en cours, patientez un instant.'
      return
    }
    if (deliveryDistance.value === null) {
      error.value = deliveryPricingError.value || 'Vérifiez votre adresse de livraison.'
      return
    }
    if (tooFar.value) {
      error.value = `Livraison impossible : votre adresse est à plus de ${MAX_DELIVERY_KM} km.`
      return
    }
  }

  if (timing.value === 'scheduled' && !scheduledFor.value) {
    error.value = 'Choisissez une heure.'
    return
  }

  if (isOnline) {
    if (!cardElement) {
      error.value = 'Le paiement en ligne est indisponible. Choisissez un autre mode de paiement.'
      return
    }
    if (!cardReady.value) {
      error.value = 'Complétez les informations de la carte.'
      return
    }
  }

  loading.value = true

  try {
    const restaurantId = restStore.restaurant?.id || cart.restaurantId

    const payload = {
      restaurant_id: restaurantId,
      ...form.value,
      notes: mergedNotes.value || form.value.notes,

      delivery_distance: isDelivery ? deliveryDistance.value : null,
      delivery_fee: isDelivery ? deliveryFee.value : 0,

      // null = dès que possible
      // Strip milliseconds and timezone from ISO string for backend: 2026-10-12T17:00:00
      scheduled_time: timing.value === 'scheduled' 
        ? new Date(scheduledFor.value).toISOString().slice(0, 19)
        : null,

      items: cart.items.map(i => ({
        menu_item_id: i.id,
        quantity: i.quantity,
        unit_price: i.price,
        notes: i.notes?.trim() || null,
        customization: i.selections || null,
        customization_summary: i.summary || null,
      })),
    }

    const { data: order } = await orderService.create(payload)

    if (isOnline) {
      const { data: intent } = await paymentService.createIntent(order.id)
      const { error: stripeErr } = await paymentService.confirmPayment(
        intent.client_secret,
        cardElement,
        { name: form.value.customer_name, email: form.value.customer_email }
      )
      if (stripeErr) {
        error.value = stripeErr.message
        loading.value = false
        return
      }
    }

    cart.clearCart()
    router.push(`/order/${order.id}`)
  } catch (e) {
    error.value = e.response?.data?.message || 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.stripe-field {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0 14px;
  background: #fff;
  border: 1.5px solid #E5E5E5;
  border-radius: 12px;
  transition: border-color .15s, box-shadow .15s;
}
.stripe-field > div {
  flex: 1;
  min-width: 0;
}
.stripe-field.is-focused {
  border-color: #E8192C;
  box-shadow: 0 0 0 3px rgba(232, 25, 44, .12);
}
.stripe-field.is-invalid {
  border-color: #E8192C;
  background: #FFF8F8;
}
</style>