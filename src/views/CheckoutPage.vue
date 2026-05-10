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

        <!-- Informations de livraison -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4" style="color:#1A1A1A">📍 Informations de livraison</h2>
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
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium mb-1.5" style="color:#888">Adresse de livraison *</label>
              <input v-model="form.delivery_address" type="text" placeholder="12 Rue de la Paix, Caen" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium mb-1.5" style="color:#888">Notes</label>
              <textarea v-model="form.notes" rows="2" placeholder="Allergies, demandes spéciales…"
                        class="input resize-none" />
            </div>
          </div>

          <!-- Livraison / À emporter -->
          <div class="flex gap-3 mt-4">
            <!-- Livraison — disabled below MIN_ORDER -->
            <button
              @click="selectDelivery"
              class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all relative"
              :class="belowMinOrder ? 'cursor-not-allowed' : ''"
              :style="form.type === 'delivery'
                ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                : belowMinOrder
                  ? 'border-color:#E5E5E5; background:#F9F9F9; color:#CCC'
                  : 'border-color:#E5E5E5; background:#fff; color:#888'">
              🚚 Livraison
              <span v-if="belowMinOrder"
                    class="block text-xs font-normal mt-0.5"
                    style="color:#CCC">
                Min. €{{ MIN_ORDER }}
              </span>
            </button>

            <!-- À emporter — always available -->
            <button
              @click="form.type = 'pickup'"
              class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all"
              :style="form.type === 'pickup'
                ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                : 'border-color:#E5E5E5; background:#fff; color:#888'">
              🏃 À emporter
            </button>
          </div>
        </div>

        <!-- Récapitulatif -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4" style="color:#1A1A1A">🧾 Récapitulatif</h2>
          <div v-for="item in cart.items" :key="item.id"
               class="flex justify-between text-sm py-2.5"
               style="border-bottom:1px solid #F0F0F0">
            <span style="color:#555">{{ item.quantity }}× {{ item.name }}</span>
            <span class="font-semibold" style="color:#1A1A1A">€{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between" style="color:#888">
              <span>Sous-total</span>
              <span>€{{ cart.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between" style="color:#888">
              <span>Frais de livraison</span>
              <span>{{ form.type === 'pickup' ? 'Gratuit' : '€2.50' }}</span>
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
          <div class="flex gap-3 mb-5">
            <button v-for="m in ['card','cash']" :key="m"
                    @click="paymentMethod = m"
                    class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                    :style="paymentMethod === m
                      ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                      : 'border-color:#E5E5E5; background:#fff; color:#888'">
              {{ m === 'card' ? '💳 Payer par carte' : '💵 Espèces à la livraison' }}
            </button>
          </div>

          <div v-if="paymentMethod === 'card'">
            <div id="card-element" class="rounded-xl px-4 py-3.5 border"
                 style="background:#fff; border-color:#E5E5E5" />
            <p v-if="stripeError" class="text-xs mt-2" style="color:#E8192C">{{ stripeError }}</p>
          </div>
          <div v-else class="rounded-xl p-4 text-sm border"
               style="background:#FFF8F8; border-color:#FFCDD0; color:#888">
            💵 Payez en espèces à la réception de votre commande.
          </div>
        </div>

        <!-- Erreur -->
        <p v-if="error" class="text-sm text-center rounded-xl p-3"
           style="color:#E8192C; background:#FFF0F1; border:1px solid #FFCDD0">
          {{ error }}
        </p>

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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter }         from 'vue-router'
import { useCartStore }      from '@/stores/cartStore'
import { useRestaurantStore } from '@/stores/restaurantStore'
import orderService          from '@/services/orderService'
import paymentService        from '@/services/paymentService'

const cart       = useCartStore()
const restStore  = useRestaurantStore()
const router     = useRouter()

const form = ref({
  customer_name: '', customer_phone: '', customer_email: '',
  delivery_address: '', notes: '', type: 'delivery',
})
const paymentMethod = ref('card')
const loading       = ref(false)
const error         = ref('')
const stripeError   = ref('')

let stripe = null, cardElement = null

const deliveryFee = computed(() => form.value.type === 'pickup' ? 0 : 2.50)
const total       = computed(() => cart.subtotal + deliveryFee.value)
const MIN_ORDER   = 20

// True when subtotal is below the delivery minimum
const belowMinOrder = computed(() => cart.subtotal < MIN_ORDER)

// Clicking "Livraison" when below minimum does nothing
function selectDelivery() {
  if (!belowMinOrder.value) form.value.type = 'delivery'
}

// Auto-switch to pickup if items are removed and subtotal drops below minimum
watch(() => cart.subtotal, (val) => {
  if (val < MIN_ORDER && form.value.type === 'delivery') {
    form.value.type = 'pickup'
  }
})

async function mountCard() {
  if (!stripe) return
  // Destroy existing element before remounting
  if (cardElement) { cardElement.destroy(); cardElement = null }
  await nextTick()
  const el = document.getElementById('card-element')
  if (!el) return
  const elements = stripe.elements()
  cardElement = elements.create('card', {
    style: {
      base: { fontSize: '15px', color: '#1A1A1A', '::placeholder': { color: '#AAAAAA' }, iconColor: '#E8192C' },
      invalid: { color: '#E8192C' }
    }
  })
  cardElement.mount('#card-element')
  cardElement.on('change', e => { stripeError.value = e.error?.message || '' })
}

// Remount Stripe card element whenever switching back to 'card'
watch(paymentMethod, async (val) => {
  if (val === 'card') await mountCard()
})

onMounted(async () => {
  if (!restStore.restaurant) await restStore.fetchMenu()
  stripe = await paymentService.getStripe()
  if (stripe) await mountCard()
})
onUnmounted(() => cardElement?.destroy())

async function placeOrder() {
  error.value = ''
  if (!form.value.customer_name || !form.value.customer_phone || !form.value.delivery_address) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }
  if (form.value.type === 'delivery' && cart.subtotal < MIN_ORDER) {
    error.value = `Commande minimum de €${MIN_ORDER} pour la livraison.`
    return
  }

  // Always use the fresh restaurant ID from the store, not the stale cart one
  const restaurantId = restStore.restaurant?.id || cart.restaurantId
  if (!restaurantId) {
    error.value = 'Restaurant introuvable. Veuillez recharger la page.'
    return
  }

  loading.value = true
  try {
    const { data: order } = await orderService.create({
      restaurant_id: restaurantId,
      ...form.value,
      items: cart.items.map(i => ({ menu_item_id: i.id, quantity: i.quantity }))
    })
    if (paymentMethod.value === 'card') {
      const { data: intent } = await paymentService.createIntent(order.id)
      const { error: stripeErr } = await paymentService.confirmPayment(
        intent.client_secret, cardElement,
        { name: form.value.customer_name, email: form.value.customer_email }
      )
      if (stripeErr) { error.value = stripeErr.message; loading.value = false; return }
    }
    cart.clearCart()
    router.push(`/order/${order.id}`)
  } catch (e) {
    error.value = e.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>