import api from './api'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY)

export default {
  /** Create a PaymentIntent and return client_secret */
  createIntent: (orderId) => api.post('/payments/create-intent', { order_id: orderId }),

  /** Get payment status for an order */
  getStatus: (orderId) => api.get(`/payments/${orderId}/status`),

  /** Confirm card payment using Stripe.js */
  async confirmPayment(clientSecret, cardElement, billingDetails) {
    const stripe = await stripePromise
    return stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails,
      }
    })
  },

  getStripe: () => stripePromise,
}
