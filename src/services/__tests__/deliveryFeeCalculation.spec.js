import { describe, it, expect } from 'vitest'

/**
 * Task 7.10: Unit tests for delivery fee calculation logic
 * 
 * Tests the core formula: base_fee + distance_km × per_km_rate
 */

function calculateDeliveryFee(distance, baseFee = 1.99, perKmRate = 0.30) {
  if (distance < 0) throw new Error('Distance cannot be negative')
  if (baseFee < 0) throw new Error('Base fee cannot be negative')
  if (perKmRate < 0) throw new Error('Rate cannot be negative')
  
  const total = baseFee + (distance * perKmRate)
  return Math.round(total * 100) / 100 // Round to 2 decimals
}

describe('Feature 7: Delivery Pricing - Calculation Logic', () => {
  describe('Delivery fee calculation formula', () => {
    /**
     * 7.10.1 - Test formula calculation: base_fee + distance × rate
     */
    it('7.10.1 - calculates fee correctly with standard rates', () => {
      const baseFee = 1.99
      const perKmRate = 0.30
      
      // Test various distances
      expect(calculateDeliveryFee(0, baseFee, perKmRate)).toBe(1.99)
      expect(calculateDeliveryFee(1, baseFee, perKmRate)).toBe(2.29)
      expect(calculateDeliveryFee(2, baseFee, perKmRate)).toBe(2.59)
      expect(calculateDeliveryFee(5, baseFee, perKmRate)).toBe(3.49)
      expect(calculateDeliveryFee(10, baseFee, perKmRate)).toBe(4.99)
    })

    /**
     * 7.10.2 - Test edge case: 0 km distance
     */
    it('7.10.2 - handles 0 km distance (returns base fee)', () => {
      const fee = calculateDeliveryFee(0)
      expect(fee).toBe(1.99)
    })

    /**
     * 7.10.3 - Test edge case: very large distances
     */
    it('7.10.3 - handles very large distances', () => {
      const fee = calculateDeliveryFee(100)
      expect(fee).toBe(1.99 + (100 * 0.30))
      expect(fee).toBe(31.99)
    })

    /**
     * 7.10.4 - Test decimal precision
     */
    it('7.10.4 - maintains proper decimal precision', () => {
      const fee = calculateDeliveryFee(2.5)
      // 1.99 + (2.5 × 0.30) = 1.99 + 0.75 = 2.74
      expect(fee).toBe(2.74)
    })

    /**
     * 7.10.5 - Test with custom configuration values
     */
    it('7.10.5 - applies custom configuration values correctly', () => {
      const customBaseFee = 2.50
      const customRate = 0.50
      
      const fee = calculateDeliveryFee(3, customBaseFee, customRate)
      // 2.50 + (3 × 0.50) = 2.50 + 1.50 = 4.00
      expect(fee).toBe(4.00)
    })

    /**
     * 7.10.6 - Test invalid distance handling
     */
    it('7.10.6 - rejects negative distance', () => {
      expect(() => calculateDeliveryFee(-1)).toThrow('Distance cannot be negative')
    })

    /**
     * 7.10.7 - Test invalid base fee handling
     */
    it('7.10.7 - rejects negative base fee', () => {
      expect(() => calculateDeliveryFee(5, -1.99)).toThrow('Base fee cannot be negative')
    })

    /**
     * 7.10.8 - Test invalid rate handling
     */
    it('7.10.8 - rejects negative rate', () => {
      expect(() => calculateDeliveryFee(5, 1.99, -0.30)).toThrow('Rate cannot be negative')
    })

    /**
     * 7.10.9 - Test rounding to 2 decimals
     */
    it('7.10.9 - rounds results to 2 decimal places', () => {
      const fee = calculateDeliveryFee(3.33, 1.99, 0.33)
      // 1.99 + (3.33 × 0.33) = 1.99 + 1.0989 = 3.0889, rounded to 3.09
      expect(fee).toBe(3.09)
    })
  })
})
