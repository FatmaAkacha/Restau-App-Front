import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DeliveryPricingDisplay from '@/components/DeliveryPricingDisplay.vue'

describe('Feature 7: Delivery Pricing - Unit Tests', () => {
  describe('DeliveryPricingDisplay component', () => {
    /**
     * Task 7.9: Write unit tests for DeliveryPricingDisplay component
     */

    it('7.9.1 - displays distance correctly', () => {
      const wrapper = mount(DeliveryPricingDisplay, {
        props: {
          distance: 2.5,
          deliveryFee: 2.74,
          baseFee: 1.99,
          perKmRate: 0.30,
          deliverable: true
        }
      })

      expect(wrapper.text()).toContain('2.50 km')
    })

    it('7.9.2 - displays fee breakdown', () => {
      const wrapper = mount(DeliveryPricingDisplay, {
        props: {
          distance: 2.5,
          deliveryFee: 2.74,
          baseFee: 1.99,
          perKmRate: 0.30,
          deliverable: true
        }
      })

      expect(wrapper.text()).toContain('Frais de base')
      expect(wrapper.text()).toContain('€1.99')
      expect(wrapper.text()).toContain('Charge au km')
    })

    it('7.9.3 - displays total delivery fee prominently', () => {
      const wrapper = mount(DeliveryPricingDisplay, {
        props: {
          distance: 2.5,
          deliveryFee: 2.74,
          baseFee: 1.99,
          perKmRate: 0.30,
          deliverable: true
        }
      })

      expect(wrapper.text()).toContain('Total livraison')
      expect(wrapper.text()).toContain('€2.74')
    })

    it('7.9.4 - shows loading state when distance is null', () => {
      const wrapper = mount(DeliveryPricingDisplay, {
        props: {
          distance: null,
          deliveryFee: null,
          baseFee: 1.99,
          perKmRate: 0.30,
          deliverable: true
        }
      })

      expect(wrapper.text()).toContain('Calcul des frais de livraison')
    })

    it('7.9.5 - shows warning when not deliverable', () => {
      const wrapper = mount(DeliveryPricingDisplay, {
        props: {
          distance: 25,
          deliveryFee: null,
          baseFee: 1.99,
          perKmRate: 0.30,
          deliverable: false
        }
      })

      expect(wrapper.text()).toContain('Cette adresse est trop éloignée')
      expect(wrapper.text()).toContain('Livraison non disponible')
    })

    it('7.9.6 - correctly calculates per-km charge', () => {
      const wrapper = mount(DeliveryPricingDisplay, {
        props: {
          distance: 5.0,
          deliveryFee: 3.49,
          baseFee: 1.99,
          perKmRate: 0.30,
          deliverable: true
        }
      })

      // 5.0 km × €0.30/km = €1.50
      expect(wrapper.text()).toContain('€1.50')
    })

    it('7.9.7 - responsive layout renders correctly', () => {
      const wrapper = mount(DeliveryPricingDisplay, {
        props: {
          distance: 2.5,
          deliveryFee: 2.74,
          baseFee: 1.99,
          perKmRate: 0.30,
          deliverable: true
        }
      })

      expect(wrapper.find('.space-y-3').exists()).toBe(true)
    })
  })
})
