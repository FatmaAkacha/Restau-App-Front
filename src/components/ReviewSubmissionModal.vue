<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full">
      <!-- Header -->
      <div class="border-b px-6 py-4">
        <h2 class="text-lg font-bold">Laisser un avis</h2>
        <p class="text-sm text-gray-500 mt-1">Partagez votre expérience</p>
      </div>

      <!-- Form -->
      <div class="px-6 py-4">
        <form @submit.prevent="submitReview" class="space-y-4">
          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Votre nom
            </label>
            <input
              v-model="form.name"
              type="text"
              maxlength="100"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              :disabled="loading"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Votre email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              :disabled="loading"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <!-- Rating Field (Star Selector) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Évaluation
            </label>
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="form.rating = star"
                :disabled="loading"
                class="text-2xl transition-transform hover:scale-125 cursor-pointer"
                :class="star <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                ★
              </button>
            </div>
            <p v-if="errors.rating" class="text-red-500 text-xs mt-1">{{ errors.rating }}</p>
          </div>

          <!-- Review Text (Optional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Votre avis
              <span class="text-xs text-gray-500">(optionnel - {{ form.text.length }}/500)</span>
            </label>
            <textarea
              v-model="form.text"
              maxlength="500"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              :disabled="loading"
              placeholder="Décrivez votre expérience (optionnel)..."
            />
            <p v-if="errors.text" class="text-red-500 text-xs mt-1">{{ errors.text }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="apiError" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {{ apiError }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
            {{ successMessage }}
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="close"
              :disabled="loading"
              class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <span v-if="loading" class="inline-block">Envoi...</span>
              <span v-else>Envoyer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ReviewSubmissionModal Component
 * 
 * Modal interface for customers to submit reviews about the restaurant.
 * Includes form validation, client-side checks, and error handling.
 * 
 * @component
 * @example
 * <ReviewSubmissionModal
 *   :isOpen="showReviewModal"
 *   :restaurantId="1"
 *   @close="showReviewModal = false"
 *   @submitted="onReviewSubmitted"
 * />
 */

import { ref, computed, reactive } from 'vue'
import restaurantService from '@/services/restaurantService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  restaurantId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'submitted'])

const loading = ref(false)
const apiError = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  rating: 0,
  text: ''
})

const errors = reactive({
  name: '',
  email: '',
  rating: '',
  text: ''
})

/**
 * Check if form is valid
 */
const isFormValid = computed(() => {
  return form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.rating >= 1
})

/**
 * Validate form fields
 */
const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.rating = ''
  errors.text = ''

  if (form.name.trim().length === 0) {
    errors.name = 'Le nom est requis'
  } else if (form.name.trim().length > 100) {
    errors.name = 'Le nom ne peut pas dépasser 100 caractères'
  }

  if (form.email.trim().length === 0) {
    errors.email = 'L\'email est requis'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Veuillez entrer un email valide'
  }

  if (form.rating < 1 || form.rating > 5) {
    errors.rating = 'Veuillez sélectionner une évaluation'
  }

  // Text is optional - only validate if user provided text
  if (form.text.trim().length > 0 && form.text.trim().length < 10) {
    errors.text = 'L\'avis doit contenir au moins 10 caractères'
  } else if (form.text.trim().length > 500) {
    errors.text = 'L\'avis ne peut pas dépasser 500 caractères'
  }

  return Object.values(errors).every(e => e === '')
}

/**
 * Check if email is valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Submit review to backend
 */
const submitReview = async () => {
  apiError.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const response = await restaurantService.submitReview({
      restaurant_id: props.restaurantId,
      name: form.name.trim(),
      email: form.email.trim(),
      rating: form.rating,
      text: form.text.trim() // Can be empty string
    })

    successMessage.value = 'Votre avis a été envoyé avec succès!'
    
    // Reset form after short delay
    setTimeout(() => {
      resetForm()
      emit('submitted', response)
      close()
    }, 1500)
  } catch (error) {
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors || {}
      Object.keys(validationErrors).forEach(key => {
        if (key in errors) {
          errors[key] = validationErrors[key][0]
        }
      })
    } else {
      apiError.value = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis. Veuillez réessayer.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * Reset form to initial state
 */
const resetForm = () => {
  form.name = ''
  form.email = ''
  form.rating = 0
  form.text = ''
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

/**
 * Close modal
 */
const close = () => {
  resetForm()
  apiError.value = ''
  successMessage.value = ''
  emit('close')
}
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
}

input:disabled,
textarea:disabled {
  background-color: #f3f4f6;
}
</style>
