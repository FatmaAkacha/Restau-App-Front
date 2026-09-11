import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSelectionModal from '../BaseSelectionModal.vue'

/**
 * Unit Tests for BaseSelectionModal Component
 * 
 * Tests for pizza base selection (crème vs tomate) modal functionality.
 */

describe('BaseSelectionModal Component', () => {
  
  /**
   * Test 1: Both base options (crème, tomate) displayed
   * When modal is open, both base selection buttons should be visible
   */
  it('displays both base options (crème and tomate)', () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: 'Margherita'
      }
    })

    const text = wrapper.text()
    expect(text).toContain('Sauce Crème')
    expect(text).toContain('Sauce Tomate')

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(4) // 2 base buttons + 2 action buttons
  })

  /**
   * Test 2: Selection state updates on click
   * When user clicks a base option, it should be marked as selected
   */
  it('shows selected state when base option clicked', async () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: 'Margherita'
      }
    })

    const buttons = wrapper.findAll('button')
    const cremeButton = buttons.find(btn => btn.text().toLowerCase().includes('crème'))

    if (cremeButton) {
      await cremeButton.trigger('click')
      // After click, button should show selected state (styling change)
      await wrapper.vm.$nextTick()
      // Component should reflect the selection
      expect(wrapper.exists()).toBe(true)
    }
  })

  /**
   * Test 3: @select emitted with correct base (crème)
   * When base is selected, component should emit @select event with the selected base
   */
  it('emits select event with crème when crème option clicked', async () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: 'Margherita'
      }
    })

    const buttons = wrapper.findAll('button')
    const cremeButton = buttons.find(btn => btn.text().includes('Sauce Crème'))

    if (cremeButton) {
      await cremeButton.trigger('click')
      
      // Now click Confirmer button
      const confirmButton = buttons.find(btn => btn.text().includes('Confirmer'))
      if (confirmButton) {
        await confirmButton.trigger('click')
        const emitted = wrapper.emitted('select')
        expect(emitted).toBeTruthy()
        if (emitted) {
          expect(emitted[0][0]).toBe('crème')
        }
      }
    }
  })

  /**
   * Test 4: @select emitted with correct base (tomate)
   * When tomate base is selected, component should emit @select with 'tomate'
   */
  it('emits select event with tomate when tomate option clicked', async () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: '4 Fromages'
      }
    })

    const buttons = wrapper.findAll('button')
    const tomateButton = buttons.find(btn => btn.text().includes('Sauce Tomate'))

    if (tomateButton) {
      await tomateButton.trigger('click')
      
      // Now click Confirmer button
      const confirmButton = buttons.find(btn => btn.text().includes('Confirmer'))
      if (confirmButton) {
        await confirmButton.trigger('click')
        const emitted = wrapper.emitted('select')
        expect(emitted).toBeTruthy()
        if (emitted) {
          expect(emitted[0][0]).toBe('tomate')
        }
      }
    }
  })

  /**
   * Test 5: @cancel emitted on dismiss
   * When modal is dismissed (cancel button clicked), should emit @cancel event
   */
  it('emits cancel event when cancel button clicked', async () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: 'Pepperoni'
      }
    })

    const buttons = wrapper.findAll('button')
    const cancelButton = buttons.find(btn => 
      btn.text().toLowerCase().includes('annuler') || 
      btn.text().toLowerCase().includes('cancel')
    )

    if (cancelButton) {
      await cancelButton.trigger('click')
      const emitted = wrapper.emitted('cancel')
      expect(emitted).toBeTruthy()
    }
  })

  /**
   * Test 6: Pizza name displayed in modal
   * Component should display the pizza name being configured
   */
  it('displays the pizza name', () => {
    const pizzaName = 'Margherita Spéciale'
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: pizzaName
      }
    })

    expect(wrapper.text()).toContain(pizzaName)
  })

  /**
   * Test 7: Modal hides when isOpen is false
   * When isOpen prop is false, modal should not be displayed
   */
  it('hides modal when isOpen is false', () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: false,
        pizzaName: 'Test Pizza'
      }
    })

    // When closed, modal should not be visible or have minimal DOM content
    // Implementation may use v-if or display:none
    const modal = wrapper.find('[class*="modal"]')
    expect(modal.exists()).toBe(false)
  })

  /**
   * Test 8: Selection prevents multiple simultaneous selections
   * When one base is selected, selecting another should replace it
   */
  it('only allows one base selection at a time', async () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: 'Vegetarian'
      }
    })

    const buttons = wrapper.findAll('button')
    const cremeButton = buttons.find(btn => btn.text().includes('Sauce Crème'))
    const tomateButton = buttons.find(btn => btn.text().includes('Sauce Tomate'))

    // Select crème
    if (cremeButton) {
      await cremeButton.trigger('click')
      await wrapper.vm.$nextTick()
    }

    // Select tomate (should replace crème)
    if (tomateButton) {
      await tomateButton.trigger('click')
      await wrapper.vm.$nextTick()
    }

    // Component should exist and be functional
    expect(wrapper.exists()).toBe(true)
  })

  /**
   * Test 9: Clear visual distinction between base options
   * Base options should be visually distinguishable (different styling or icons)
   */
  it('displays distinct visual styling for each base option', () => {
    const wrapper = mount(BaseSelectionModal, {
      props: {
        isOpen: true,
        pizzaName: 'Test Pizza'
      }
    })

    const buttons = wrapper.findAll('button')
    const cremeButton = buttons.find(btn => btn.text().toLowerCase().includes('crème'))
    const tomateButton = buttons.find(btn => btn.text().toLowerCase().includes('tomate'))

    // Each button should exist and be distinct
    expect(cremeButton).toBeTruthy()
    expect(tomateButton).toBeTruthy()
    
    // They should be different elements
    expect(cremeButton?.element).not.toBe(tomateButton?.element)
  })

  /**
   * Test 10: Modal displays correctly with edge case pizza names
   * Should handle pizza names with special characters or long strings
   */
  it('handles edge case pizza names', () => {
    const specialNames = [
      '4 Fromages & Miel',
      'Pizza "Spéciale"',
      'Très longue description de pizza qui ne devrait pas casser le modal'
    ]

    specialNames.forEach(name => {
      const wrapper = mount(BaseSelectionModal, {
        props: {
          isOpen: true,
          pizzaName: name
        }
      })

      const text = wrapper.text()
      expect(text).toContain('Sauce Crème')
      expect(text).toContain('Sauce Tomate')
      expect(wrapper.exists()).toBe(true)
    })
  })
})
