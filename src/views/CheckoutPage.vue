<template>
  <div class="min-h-screen bg-brand-gray">
    <!-- En-tête -->
    <header class="bg-white border-b border-brand-border px-4 py-4 flex items-center gap-4">
      <router-link to="/menu" class="text-gray-500 hover:text-brand-dark transition-colors">
        ← Retour
      </router-link>
      <h1 class="text-lg font-bold">Passer la commande</h1>
    </header>

    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">

      <!-- Panier vide -->
      <div v-if="cart.items.length === 0" class="text-center py-20 text-gray-400">
        <div class="text-5xl mb-3">🛒</div>
        <p>Votre panier est vide.</p>
        <router-link to="/menu" class="btn-primary inline-block mt-4">Voir le menu</router-link>
      </div>

      <template v-else>
        <!-- Informations de livraison -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4">Informations de livraison</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Nom complet *</label>
              <input v-model="form.customer_name" type="text" placeholder="Jean Dupont"
                     class="input" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Téléphone *</label>
              <input v-model="form.customer_phone" type="tel" placeholder="+33 6 00 00 00 00"
                     class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input v-model="form.customer_email" type="email" placeholder="vous@exemple.com"
                     class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Adresse de livraison *</label>
              <input v-model="form.delivery_address" type="text" placeholder="12 Rue de la Paix, Caen"
                     class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Notes de commande</label>
              <textarea v-model="form.notes" rows="2" placeholder="Allergies, demandes spéciales…"
                        class="input resize-none" />
            </div>
          </div>

          <!-- Livraison / À emporter -->
          <div class="flex gap-3 mt-4">
            <button v-for="t in ['delivery','pickup']" :key="t"
                    @click="form.type = t"
                    :class="['flex-1 py-2 rounded-xl border text-sm font-medium transition-colors',
                             form.type === t
                               ? 'border-brand-dark bg-brand-dark text-white'
                               : 'border-brand-border text-gray-600 hover:bg-brand-gray']">
              {{ t === 'delivery' ? '🚚 Livraison' : '🏃 À emporter' }}
            </button>
          </div>
        </div>

        <!-- Récapitulatif de commande -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4">Récapitulatif</h2>
          <div v-for="item in cart.items" :key="item.id"
               class="flex justify-between text-sm py-2 border-b border-brand-border last:border-0">
            <span>{{ item.quantity }}× {{ item.name }}</span>
            <span class="font-medium">€{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="mt-3 space-y-1 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Sous-total</span><span>€{{ cart.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Frais de livraison</span>
              <span>{{ form.type === 'pickup' ? 'Gratuit' : '€2.50' }}</span>
            </div>
            <div class="flex justify-between font-bold text-brand-dark text-base pt-2 border-t border-brand-border">
              <span>Total</span>
              <span>€{{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Paiement -->
        <div class="card p-5">
          <h2 class="font-bold text-base mb-4">Paiement</h2>

          <div class="flex gap-3 mb-5">
            <button v-for="m in ['card','cash']" :key="m"
                    @click="paymentMethod = m"
                    :class="['flex-1 py-2 rounded-xl border text-sm font-medium transition-colors',
                             paymentMethod === m
                               ? 'border-brand-dark bg-brand-dark text-white'
                               : 'border-brand-border text-gray-600 hover:bg-brand-gray']">
              {{ m === 'card' ? '💳 Payer par carte' : '💵 Espèces à la livraison' }}
            </button>
          </div>

          <div v-if="paymentMethod === 'card'">
            <div id="card-element" class="input py-3 bg-white" />
            <p v-if="stripeError" class="text-red-500 text-xs mt-2">{{ stripeError }}</p>
          </div>

          <p v-else class="text-sm text-gray-500 bg-brand-gray rounded-xl p-3">
            Payez en espèces à la réception de votre commande. 🏠
          </p>
        </div>

        <!-- Erreur -->
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <!-- Bouton commander -->
        <button @click="placeOrder" :disabled="loading" class="btn-primary w-full py-4 text-base">
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement en cours…
          </span>
          <span v-else>Commander · €{{ total.toFixed(2) }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore }  from '@/stores/cartStore'
import orderService      from '@/services/orderService'
import paymentService    from '@/services/paymentService'

const cart   = useCartStore()
const router = useRouter()

const form = ref({
  customer_name:    '',
  customer_phone:   '',
  customer_email:   '',
  delivery_address: '',
  notes:            '',
  type:             'delivery',
})

const paymentMethod = ref('card')
const loading       = ref(false)
const error         = ref('')
const stripeError   = ref('')

let stripe      = null
let cardElement = null

const deliveryFee = computed(() => form.value.type === 'pickup' ? 0 : 2.50)
const total       = computed(() => cart.subtotal + deliveryFee.value)

onMounted(async () => {
  stripe = await paymentService.getStripe()
  if (!stripe) return
  const elements = stripe.elements()
  cardElement = elements.create('card', {
    style: { base: { fontSize: '15px', color: '#1A1A1A', '::placeholder': { color: '#9CA3AF' } } }
  })
  cardElement.mount('#card-element')
  cardElement.on('change', e => { stripeError.value = e.error?.message || '' })
})

onUnmounted(() => cardElement?.destroy())

async function placeOrder() {
  error.value = ''
  if (!form.value.customer_name || !form.value.customer_phone || !form.value.delivery_address) {
    error.value = 'Veuillez remplir tous les champs obligatoires.'
    return
  }
  loading.value = true
  try {
    const { data: order } = await orderService.create({
      restaurant_id: cart.restaurantId,
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

<style scoped>
.input {
  @apply w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm
         focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-colors;
}
</style>
