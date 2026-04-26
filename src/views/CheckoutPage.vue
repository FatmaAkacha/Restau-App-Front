<template>
  <div class="min-h-screen" style="background:#F7F7F7">

    <header class="border-b px-4 py-4 flex items-center gap-4 sticky top-0 z-20"
            style="background:#fff; border-color:#E5E5E5">
      <router-link to="/menu" class="text-sm transition-colors hover:text-red-600" style="color:#888">
        ← Retour
      </router-link>
      <h1 class="text-base font-bold" style="color:#1A1A1A">Passer la commande</h1>
    </header>

    <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">

      <!-- Panier vide -->
      <div v-if="cart.items.length === 0" class="text-center py-20 text-brand-muted">
        <div class="text-5xl mb-3 opacity-30">🛒</div>
        <p class="mb-4">Votre panier est vide.</p>
        <router-link to="/menu">
          <button class="btn-primary">Voir le menu</button>
        </router-link>
      </div>

      <template v-else>

        <!-- Informations de livraison -->
        <div class="card p-5">
          <h2 class="section-title text-base">📍 Informations de livraison</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-brand-muted mb-1.5">Nom complet *</label>
              <input v-model="form.customer_name" type="text" placeholder="Jean Dupont" class="input" />
            </div>
            <div>
              <label class="block text-xs font-medium text-brand-muted mb-1.5">Téléphone *</label>
              <input v-model="form.customer_phone" type="tel" placeholder="+33 6 00 00 00 00" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-brand-muted mb-1.5">Email</label>
              <input v-model="form.customer_email" type="email" placeholder="vous@exemple.com" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-brand-muted mb-1.5">Adresse de livraison *</label>
              <input v-model="form.delivery_address" type="text" placeholder="12 Rue de la Paix, Caen" class="input" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-brand-muted mb-1.5">Notes</label>
              <textarea v-model="form.notes" rows="2" placeholder="Allergies, demandes spéciales…"
                        class="input resize-none" />
            </div>
          </div>

          <!-- Livraison / À emporter -->
          <div class="flex gap-3 mt-4">
            <button v-for="t in ['delivery','pickup']" :key="t"
                    @click="form.type = t"
                    class="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                    :style="form.type === t
                      ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                      : 'border-color:#E5E5E5; background:#fff; color:#888'">
              {{ t === 'delivery' ? '🚚 Livraison' : '🏃 À emporter' }}
            </button>
          </div>
        </div>

        <!-- Récapitulatif -->
        <div class="card p-5">
          <h2 class="section-title text-base">🧾 Récapitulatif</h2>
          <div v-for="item in cart.items" :key="item.id"
               class="flex justify-between text-sm py-2.5 border-b border-brand-border last:border-0">
            <span class="text-gray-300">{{ item.quantity }}× {{ item.name }}</span>
            <span class="font-semibold text-white">€{{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between text-brand-muted">
              <span>Sous-total</span><span class="text-gray-300">€{{ cart.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-brand-muted">
              <span>Frais de livraison</span>
              <span class="text-gray-300">{{ form.type === 'pickup' ? 'Gratuit' : '€2.50' }}</span>
            </div>
            <div class="flex justify-between font-bold text-base pt-3 border-t border-brand-border">
              <span class="text-white">Total</span>
              <span class="text-brand-red">€{{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Paiement -->
        <div class="card p-5">
          <h2 class="section-title text-base">💳 Paiement</h2>
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
        <p v-if="error" class="text-brand-red text-sm text-center bg-brand-red/10
                               border border-brand-red/30 rounded-xl p-3">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter }     from 'vue-router'
import { useCartStore }  from '@/stores/cartStore'
import orderService      from '@/services/orderService'
import paymentService    from '@/services/paymentService'

const cart   = useCartStore()
const router = useRouter()

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

onMounted(async () => {
  stripe = await paymentService.getStripe()
  if (!stripe) return
  const elements = stripe.elements()
  cardElement = elements.create('card', {
    style: {
      base: {
        fontSize: '15px', color: '#FFFFFF',
        '::placeholder': { color: '#6B6B6B' },
        iconColor: '#E8192C',
      },
      invalid: { color: '#E8192C' }
    }
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
      restaurant_id: cart.restaurantId, ...form.value,
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
