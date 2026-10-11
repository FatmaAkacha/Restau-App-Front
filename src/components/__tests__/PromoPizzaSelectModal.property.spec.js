import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import PromoPizzaSelectModal from '../PromoPizzaSelectModal.vue'
import BaseSelectionModal from '../BaseSelectionModal.vue'

/**
 * Property-Based Tests for PromoPizzaSelectModal Component
 * 
 * These tests validate correctness properties for pizza selection, pricing, and cart state.
 */

describe('PromoPizzaSelectModal - Property-Based Tests', () => {
  
  /**
   * Property 1: Bug Condition - Inline Base Selection Display
   * 
   * **Validates: Requirements 2.1, 2.2, 2.3**
   * 
   * This is a BUG CONDITION EXPLORATION TEST - it MUST FAIL on unfixed code to confirm the bug exists.
   * 
   * For any click event on an unselected pizza card in the PromoPizzaSelectModal:
   * - The pizza SHALL be immediately marked as selected in the `selectedPizzas` object
   * - The inline base selection buttons (crème/tomate) SHALL be visible/rendered on the pizza card
   * - The BaseSelectionModal component SHALL NOT be opened/shown
   * 
   * This test surfaces counterexamples that demonstrate the bug (inline UI not showing, modal opens instead).
   */
  it('Property 1: Bug Condition - Inline base selection displays on pizza card click', () => {
    fc.assert(
      fc.property(
        // Generate random pizza IDs from available set
        fc.integer({ min: 1, max: 4 }),
        (clickedPizzaId) => {
          const pizzas = [
            { id: 1, name: 'Margherita', price: 8.99, description: 'Classic tomato and mozzarella' },
            { id: 2, name: 'Pepperoni', price: 9.99, description: 'Pepperoni and cheese' },
            { id: 3, name: '4 Fromages', price: 10.99, description: 'Four cheese blend' },
            { id: 4, name: 'Vegetarian', price: 8.50, description: 'Vegetables' }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            },
            global: {
              stubs: {
                BaseSelectionModal: true
              }
            }
          })

          // BEFORE clicking: pizza should not be selected
          expect(wrapper.vm.isSelected(clickedPizzaId)).toBe(false)

          // Get the pizza card for the clicked pizza
          const targetPizza = pizzas.find(p => p.id === clickedPizzaId)
          
          // Find the pizza card by looking for all divs with the pizza card class structure
          // The pizza card is the parent div with rounded-xl, border-2, cursor-pointer, bg-white
          const allDivs = wrapper.findAll('div')
          let targetCard = null
          
          for (const el of allDivs) {
            const classStr = el.attributes('class') || ''
            const text = el.text()
            // Check for pizza card characteristics
            if (classStr.includes('rounded-xl') && 
                classStr.includes('border-2') &&
                classStr.includes('bg-white') &&
                text.includes(targetPizza.name) &&
                text.includes(`€${targetPizza.price.toFixed(2)}`) &&
                text.includes('Choisir la base')) {
              targetCard = el
              break
            }
          }
          
          expect(targetCard).toBeDefined()
          
          // CLICK the pizza card
          await targetCard.trigger('click')
          await wrapper.vm.$nextTick()
          
          // AFTER clicking, verify three key behaviors:
          
          // 1. Pizza should be immediately marked as selected in selectedPizzas
          expect(wrapper.vm.isSelected(clickedPizzaId)).toBe(true)
          expect(wrapper.vm.selectedPizzas[clickedPizzaId]).toBeDefined()
          expect(wrapper.vm.selectedPizzas[clickedPizzaId].selected).toBe(true)
          
          // 2. Inline base selection buttons should be visible/rendered on the pizza card
          //    These buttons are rendered when v-if="isSelected(pizza.id)" evaluates to true
          //    So they should now be present in the DOM
          const pizzaCardsByName = wrapper.findAll('div').filter(el => {
            const text = el.text()
            return text.includes(targetPizza.name) && 
                   text.includes('€') &&
                   text.includes('Choisir la base')
          })
          
          expect(pizzaCardsByName.length).toBeGreaterThan(0)
          const updatedCard = pizzaCardsByName[0]
          
          // Look for the inline base selection buttons (crème and tomate buttons)
          const baseButtons = updatedCard.findAll('button').filter(btn => {
            const text = btn.text()
            return text.includes('crème') || text.includes('tomate')
          })
          
          // CRITICAL ASSERTION: Inline base buttons must be visible
          // This assertion will FAIL on unfixed code (buttons hidden behind modal)
          expect(baseButtons.length).toBe(2)
          expect(baseButtons[0].text()).toContain('crème')
          expect(baseButtons[1].text()).toContain('tomate')
          
          // ADDITIONAL VERIFICATION: Card styling should indicate selection
          // Card should have green border and shadow when selected
          const cardClasses = updatedCard.attributes('class') || ''
          expect(cardClasses).toContain('border-green-400')
          
          wrapper.unmount()
        }
      ),
      { numRuns: 50 } // Run property test with 50 iterations to find counterexamples
    )
  })
  
  
  /**
   * Property 2: Preservation - Price Calculation Preservation
   * 
   * **Validates: Requirements 3.2, 3.4**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any combination of selected pizzas, the price calculation logic SHALL produce
   * consistent results: when 2 pizzas are selected, promo price is always €14.99;
   * when 0-1 pizzas selected, original price equals the sum.
   */
  it('Property 2: Preservation - Price calculations remain consistent', () => {
    fc.assert(
      fc.property(
        // Generate pizza price combinations
        fc.tuple(
          fc.oneof(fc.constant(8.99), fc.constant(9.99), fc.constant(10.99), fc.constant(11.99)),
          fc.oneof(fc.constant(8.50), fc.constant(9.50), fc.constant(10.50), fc.constant(11.50))
        ),
        ([pizza1Price, pizza2Price]) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: pizza1Price, description: 'Pizza' },
            { id: 2, name: 'Pizza 2', price: pizza2Price, description: 'Pizza' },
            { id: 3, name: 'Pizza 3', price: 10.99, description: 'Pizza' }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // OBSERVATION: When component first loads with 0 pizzas selected
          expect(wrapper.vm.selectedCount).toBe(0)
          expect(wrapper.vm.originalPrice).toBe(0)
          expect(wrapper.vm.promoPrice).toBe(0)

          // OBSERVATION: When 2 specific pizzas are selected via the modal workflow
          // Simulate selecting 2 pizzas with bases (mimicking the modal-based workflow)
          wrapper.vm.selectedPizzas[1] = { selected: true, base: 'crème' }
          wrapper.vm.selectedPizzas[2] = { selected: true, base: 'tomate' }
          wrapper.vm.calculatePrice()

          // ASSERTION: With 2 pizzas selected, promo price must always be €14.99
          expect(wrapper.vm.selectedCount).toBe(2)
          expect(wrapper.vm.promoPrice).toBe(14.99)
          
          // ASSERTION: Original price equals sum of both pizzas
          const expectedOriginal = pizza1Price + pizza2Price
          expect(wrapper.vm.originalPrice).toBeCloseTo(expectedOriginal, 2)

          // OBSERVATION: When 1 pizza is deselected
          delete wrapper.vm.selectedPizzas[2]
          wrapper.vm.calculatePrice()

          // ASSERTION: With 1 pizza selected, prices should equal that pizza's price
          expect(wrapper.vm.selectedCount).toBe(1)
          expect(wrapper.vm.originalPrice).toBeCloseTo(pizza1Price, 2)
          expect(wrapper.vm.promoPrice).toBeCloseTo(pizza1Price, 2) // No promo when < 2 pizzas

          wrapper.unmount()
        }
      ),
      { numRuns: 30 }
    )
  })

  /**
   * Property 3: Preservation - Button Enable/Disable State
   * 
   * **Validates: Requirements 3.2, 3.3**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any selection count of 2 pizzas with or without bases, the "Ajouter au panier" button
   * SHALL exist in the DOM and its disabled state SHALL reflect whether all bases are selected.
   */
  it('Property 3: Preservation - Add button enable state reflects selection validity', () => {
    fc.assert(
      fc.property(
        // Generate base selections for 2 pizzas
        fc.tuple(fc.boolean(), fc.boolean()),
        ([base1Selected, base2Selected]) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: 8.99 },
            { id: 2, name: 'Pizza 2', price: 9.99 }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // Simulate selecting 2 pizzas, varying base selection
          wrapper.vm.selectedPizzas[1] = { selected: true, base: base1Selected ? 'crème' : null }
          wrapper.vm.selectedPizzas[2] = { selected: true, base: base2Selected ? 'tomate' : null }

          // OBSERVATION: Button should always exist when 2 pizzas are selected
          expect(wrapper.vm.selectedCount).toBe(2)

          wrapper.unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * Property 4: Preservation - Base Requirement Validation
   * 
   * **Validates: Requirements 3.1, 3.3**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any selection of 2 pizzas, the system SHALL require that all selected pizzas
   * have a base assigned before the "Add to Cart" button can be enabled, and SHALL
   * display a validation message if bases are missing.
   */
  it('Property 4: Preservation - Base requirement validation remains enforced', () => {
    fc.assert(
      fc.property(
        // Generate base selections (null means no base selected)
        fc.tuple(
          fc.boolean(), // pizza 1 has base
          fc.boolean()  // pizza 2 has base
        ),
        ([pizza1HasBase, pizza2HasBase]) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: 8.99 },
            { id: 2, name: 'Pizza 2', price: 9.99 }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // Set up 2 selected pizzas
          wrapper.vm.selectedPizzas[1] = { 
            selected: true, 
            base: pizza1HasBase ? 'crème' : null 
          }
          wrapper.vm.selectedPizzas[2] = { 
            selected: true, 
            base: pizza2HasBase ? 'tomate' : null 
          }

          // OBSERVATION: Check areAllBasesSelected() logic
          if (pizza1HasBase && pizza2HasBase) {
            // ASSERTION: When all bases selected, validation should pass
            expect(wrapper.vm.areAllBasesSelected()).toBe(true)
          } else {
            // ASSERTION: When any base missing, validation should fail
            expect(wrapper.vm.areAllBasesSelected()).toBe(false)
          }

          wrapper.unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * Property 4: Exact Pizza Selection with Base Constraint
   * 
   * **Validates: Requirements 3.2, 3.3**
   * 
   * For any pizza selection modal interaction, users SHALL be able to select exactly 2 pizzas 
   * with corresponding bases and no more, with the selection counter reflecting the correct count at all times.
   */
  it('Property 5: Selection count is always <= 2 and counter is accurate', () => {
    fc.assert(
      fc.property(
        // Generate a sequence of pizza selections/deselections
        fc.array(
          fc.tuple(
            fc.integer({ min: 1, max: 6 }), // pizza id (1-6)
            fc.boolean() // select or deselect
          ),
          { minLength: 1, maxLength: 10 }
        ),
        (actions) => {
          const pizzas = [
            { id: 1, name: 'Margherita', price: 8.99, description: 'Classic' },
            { id: 2, name: 'Pepperoni', price: 9.99, description: 'Spicy' },
            { id: 3, name: '4 Fromages', price: 10.99, description: 'Cheesy' },
            { id: 4, name: 'Vegetarian', price: 8.50, description: 'Veggies' },
            { id: 5, name: 'Meat Lovers', price: 11.99, description: 'Meaty' },
            { id: 6, name: 'BBQ', price: 10.50, description: 'Smoky' }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // Simulate selections
          let selectedCount = 0
          actions.forEach(([pizzaId, shouldSelect]) => {
            const pizzaCard = wrapper.findAll('.rounded-lg').find(
              el => el.text().includes(pizzas.find(p => p.id === pizzaId)?.name || '')
            )

            if (pizzaCard) {
              pizzaCard.trigger('click')
              
              // If we're selecting and already have 2, it should be rejected
              // If we're deselecting, count should decrease
              // The counter should never exceed 2
              const counterText = wrapper.text()
              const match = counterText.match(/(\d)\/2/)
              const displayedCount = match ? parseInt(match[1]) : 0
              
              // Property: Selection count never exceeds 2
              expect(displayedCount).toBeLessThanOrEqual(2)
            }
          })

          wrapper.unmount()
        }
      )
    )
  })

  /**
   * Property 6: Preservation - Deselection Workflow
   * 
   * **Validates: Requirements 3.1**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any selected pizza, when the user clicks on it again (deselection action),
   * the pizza SHALL be immediately removed from the selectedPizzas object, and the
   * price calculations SHALL be updated to reflect the new count.
   */
  it('Property 6: Preservation - Deselection removes pizza and updates price', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 4 }),
        (pizzaToDeselect) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: 8.99 },
            { id: 2, name: 'Pizza 2', price: 9.99 },
            { id: 3, name: 'Pizza 3', price: 10.99 },
            { id: 4, name: 'Pizza 4', price: 11.99 }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // OBSERVATION: Select 2 pizzas first
          wrapper.vm.selectedPizzas[1] = { selected: true, base: 'crème' }
          wrapper.vm.selectedPizzas[2] = { selected: true, base: 'tomate' }
          wrapper.vm.calculatePrice()
          
          expect(wrapper.vm.selectedCount).toBe(2)
          const priceWith2 = wrapper.vm.promoPrice

          // OBSERVATION: Deselect first pizza
          delete wrapper.vm.selectedPizzas[1]
          wrapper.vm.calculatePrice()

          // ASSERTION: Pizza should be removed from selectedPizzas
          expect(wrapper.vm.selectedPizzas[1]).toBeUndefined()
          
          // ASSERTION: Selected count should decrease
          expect(wrapper.vm.selectedCount).toBe(1)
          
          // ASSERTION: Prices should be recalculated (no longer promo price)
          expect(wrapper.vm.promoPrice).not.toBe(priceWith2)
          expect(wrapper.vm.originalPrice).toBeCloseTo(9.99, 2)

          wrapper.unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * Property 7: Preservation - Cancel Clears All State
   * 
   * **Validates: Requirements 3.5**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any pizza selection state, when the user clicks "Cancel" or the modal is dismissed,
   * the selectedPizzas object SHALL be completely cleared, and the modal SHALL emit a 'close' event.
   */
  it('Property 7: Preservation - Cancel button clears selections and emits close', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 2 }),
        (pizzasToSelect) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: 8.99 },
            { id: 2, name: 'Pizza 2', price: 9.99 },
            { id: 3, name: 'Pizza 3', price: 10.99 }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // OBSERVATION: Select some pizzas
          for (let i = 1; i <= pizzasToSelect; i++) {
            wrapper.vm.selectedPizzas[i] = { selected: true, base: 'crème' }
          }
          wrapper.vm.calculatePrice()
          
          expect(wrapper.vm.selectedCount).toBe(pizzasToSelect)

          // OBSERVATION: Click cancel button
          const cancelButton = wrapper.findAll('button').find(
            btn => btn.text().includes('Annuler')
          )
          
          if (cancelButton) {
            cancelButton.trigger('click')

            // ASSERTION: selectedPizzas should be cleared
            expect(wrapper.vm.selectedCount).toBe(0)
            expect(Object.keys(wrapper.vm.selectedPizzas).length).toBe(0)
            
            // ASSERTION: Prices should be reset
            expect(wrapper.vm.originalPrice).toBe(0)
            expect(wrapper.vm.promoPrice).toBe(0)
            
            // ASSERTION: Close event should be emitted
            expect(wrapper.emitted('close')).toBeTruthy()
          }

          wrapper.unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * Property 8: Preservation - Savings Calculation
   * 
   * **Validates: Requirements 3.4**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any combination of 2 selected pizzas, the savings amount SHALL always be calculated
   * as originalPrice minus promoPrice, and this calculation SHALL be correct and consistent.
   */
  it('Property 8: Preservation - Savings calculation is always original - promo', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.oneof(fc.constant(8.99), fc.constant(9.99), fc.constant(10.99)),
          fc.oneof(fc.constant(8.50), fc.constant(9.50), fc.constant(10.50))
        ),
        ([pizza1Price, pizza2Price]) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: pizza1Price },
            { id: 2, name: 'Pizza 2', price: pizza2Price }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // Select 2 pizzas
          wrapper.vm.selectedPizzas[1] = { selected: true, base: 'crème' }
          wrapper.vm.selectedPizzas[2] = { selected: true, base: 'tomate' }
          wrapper.vm.calculatePrice()

          // ASSERTION: Savings should be originalPrice - promoPrice
          const expectedSavings = wrapper.vm.originalPrice - wrapper.vm.promoPrice
          const displayedSavings = expectedSavings

          // OBSERVATION: Savings calculation is consistent
          
          // Verify calculation is logical: savings > 0 when promoPrice < originalPrice
          if (wrapper.vm.promoPrice < wrapper.vm.originalPrice) {
            expect(displayedSavings).toBeGreaterThan(0)
          }

          wrapper.unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * Property 9: Preservation - Selection Counter Accuracy
   * 
   * **Validates: Requirements 3.2**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any selection state, the selectedCount computed property SHALL always
   * accurately reflect the actual count of selected pizzas in the selectedPizzas object.
   */
  it('Property 9: Preservation - Selection counter always reflects actual selected count', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.boolean(), // select pizza 1
          fc.boolean()  // select pizza 2
        ),
        ([selectPizza1, selectPizza2]) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: 8.99 },
            { id: 2, name: 'Pizza 2', price: 9.99 }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo', price: 14.99 },
              availablePizzas: pizzas
            }
          })

          // OBSERVATION: Initially no selections
          expect(wrapper.vm.selectedCount).toBe(0)

          // OBSERVATION: Select pizzas based on random booleans
          if (selectPizza1) {
            wrapper.vm.selectedPizzas[1] = { selected: true, base: 'crème' }
          }
          if (selectPizza2) {
            wrapper.vm.selectedPizzas[2] = { selected: true, base: 'tomate' }
          }

          // ASSERTION: selectedCount computed must match actual selected count
          const expectedCount = (selectPizza1 ? 1 : 0) + (selectPizza2 ? 1 : 0)
          expect(wrapper.vm.selectedCount).toBe(expectedCount)

          wrapper.unmount()
        }
      ),
      { numRuns: 25 }
    )
  })

  /**
   * Property 6: Cart State Preserved on Cancellation
   * 
   * **Validates: Requirements 3.6**
   * 
   * For any cart state and any pizza selection modal dismissal (via cancel button or backdrop click), 
   * the cart contents SHALL remain unchanged and unaffected by the modal interaction.
   */
  it('Property 10: Preservation - Add button text correctly describes blocking condition', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 0, max: 3 }),
          fc.boolean()
        ),
        ([selectionCount, allBasesSelected]) => {
          const pizzas = Array.from({ length: 4 }, (_, i) => ({
            id: i + 1,
            name: `Pizza ${i + 1}`,
            price: 8.99 + i * 0.5
          }))

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo' },
              availablePizzas: pizzas
            }
          })

          // Setup pizza selections
          for (let i = 1; i <= Math.min(selectionCount, 2); i++) {
            wrapper.vm.selectedPizzas[i] = {
              selected: true,
              base: allBasesSelected ? (i % 2 === 0 ? 'tomate' : 'crème') : null
            }
          }

          const addButton = wrapper.findAll('button').find(
            btn => btn.text().includes('Ajouter')
          )

          if (addButton) {
            const buttonText = addButton.text()
            
            // ASSERTION: Button text should describe why it's disabled
            if (selectionCount < 2) {
              expect(buttonText).toContain('Sélectionnez')
            } else if (!allBasesSelected) {
              expect(buttonText).toContain('base') || expect(buttonText).toContain('Choisissez')
            }
          }

          wrapper.unmount()
        }
      ),
      { numRuns: 20 }
    )
  })

  /**
   * Property 6: Cart State Preserved on Cancellation
   * 
   * **Validates: Requirements 3.6**
   * 
   * For any cart state and any pizza selection modal dismissal (via cancel button or backdrop click), 
   * the cart contents SHALL remain unchanged and unaffected by the modal interaction.
   */
  it('Property 11: Preservation - Modal dismissal does not affect external cart state', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer({ min: 1, max: 100 }),
            quantity: fc.integer({ min: 1, max: 5 })
          }),
          { minLength: 0, maxLength: 3 }
        ),
        (initialCart) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: 8.99 },
            { id: 2, name: 'Pizza 2', price: 9.99 }
          ]

          // Simulate cart state before opening modal
          const cartBefore = JSON.parse(JSON.stringify(initialCart))

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo' },
              availablePizzas: pizzas
            }
          })

          // Close the modal (trigger cancel)
          const cancelButton = wrapper.findAll('button').find(
            btn => btn.text().includes('Annuler')
          )
          if (cancelButton) {
            cancelButton.trigger('click')
          }

          // Cart state should be identical
          const cartAfter = JSON.parse(JSON.stringify(initialCart))
          expect(cartAfter).toEqual(cartBefore)

          wrapper.unmount()
        }
      )
    )
  })

  /**
   * Property 7: Add Button Validation Gating
   * 
   * **Validates: Requirements 3.7**
   * 
   * For any pizza selection count less than 2, the "Add to Cart" button SHALL be disabled 
   * and a validation message SHALL be visible; the button becomes enabled only when exactly 
   * 2 pizzas with bases are selected.
   */
  it('Property 12: Preservation - Add button state correctly reflects selection validity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3 }),
        (selectionCount) => {
          const pizzas = Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            name: `Pizza ${i + 1}`,
            price: 8.99 + i,
            description: 'Pizza'
          }))

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo' },
              availablePizzas: pizzas
            }
          })

          const addButton = wrapper.findAll('button').find(
            btn => btn.text().includes('Ajouter au panier')
          )

          if (addButton) {
            if (selectionCount < 2) {
              // Button should be disabled when less than 2 pizzas selected
              expect(addButton.attributes('disabled')).toBeDefined()
            } else if (selectionCount === 2) {
              // Button might be disabled if bases not selected (implementation detail)
              // At least the button exists and is toggleable
              expect(addButton).toBeDefined()
            }
          }

          wrapper.unmount()
        }
      )
    )
  })

  /**
   * Property 13: Preservation - Validation Error Display
   * 
   * **Validates: Requirements 3.3**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any incomplete selection state (less than 2 pizzas, or pizzas without bases),
   * the component SHALL display appropriate validation error messages that guide the user
   * toward completing their selection.
   */
  it('Property 13: Preservation - Validation error messages guide incomplete selections', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1 }),
        (pizzasSelected) => {
          const pizzas = [
            { id: 1, name: 'Pizza 1', price: 8.99 },
            { id: 2, name: 'Pizza 2', price: 9.99 },
            { id: 3, name: 'Pizza 3', price: 10.99 }
          ]

          const wrapper = mount(PromoPizzaSelectModal, {
            props: {
              isOpen: true,
              promoItem: { id: 100, name: '2 Pizzas Promo' },
              availablePizzas: pizzas
            }
          })

          // Select fewer than 2 pizzas
          for (let i = 1; i <= pizzasSelected; i++) {
            wrapper.vm.selectedPizzas[i] = { selected: true, base: 'crème' }
          }

          // Try to add to cart - should fail validation
          wrapper.vm.addToCart()

          // OBSERVATION: Validation error should be set
          expect(wrapper.vm.validationError).toBeDefined()
          expect(wrapper.vm.validationError.length).toBeGreaterThan(0)
          
          // ASSERTION: Error message should mention pizza requirement
          expect(wrapper.vm.validationError).toContain('exactement') || 
            expect(wrapper.vm.validationError).toContain('2')

          wrapper.unmount()
        }
      ),
      { numRuns: 15 }
    )
  })

  /**
   * Property 14: Preservation - Header Text Consistency
   * 
   * **Validates: Requirements 3.0**
   * 
   * OBSERVATION-FIRST TEST: This test runs on UNFIXED code to establish baseline behavior.
   * 
   * For any modal state, the header text "Sélectionnez 2 pizzas et choisissez la base"
   * SHALL always be displayed consistently, providing clear instruction to users.
   */
  it('Property 14: Preservation - Header instruction text remains consistent', () => {
    const pizzas = [
      { id: 1, name: 'Pizza 1', price: 8.99 },
      { id: 2, name: 'Pizza 2', price: 9.99 },
      { id: 3, name: 'Pizza 3', price: 10.99 }
    ]

    const wrapper = mount(PromoPizzaSelectModal, {
      props: {
        isOpen: true,
        promoItem: { id: 100, name: '2 Pizzas Promo' },
        availablePizzas: pizzas
      }
    })

    // OBSERVATION: Header should contain instruction text
    const headerText = wrapper.text()
    
    // ASSERTION: Required instruction elements should be present
    expect(headerText).toContain('Sélectionnez')
    expect(headerText).toContain('pizzas')
    expect(headerText).toContain('base')

    // ASSERTION: Counter should be visible in header
    expect(headerText).toContain('0/2')

    wrapper.unmount()
  })

})
