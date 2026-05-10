<template>
  <div class="min-h-screen flex items-center justify-center px-4"
       style="background:linear-gradient(135deg,#1A1A1A 0%,#2D0A0E 100%)">

    <div class="w-full max-w-sm">

      <!-- Logo / Brand -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg"
             style="background:linear-gradient(135deg,#E8192C,#A50E1C)">🍽️</div>
        <h1 class="text-2xl font-extrabold text-white">GOODNAAN</h1>
        <p class="text-sm mt-1" style="color:#AAA">Espace administration</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl p-8 shadow-2xl" style="background:#fff">
        <h2 class="text-lg font-bold mb-6 text-center" style="color:#1A1A1A">Connexion</h2>

        <form @submit.prevent="submit" class="space-y-4">

          <!-- Login field -->
          <div>
            <label class="block text-xs font-semibold mb-1.5" style="color:#555">
              Email ou nom d'utilisateur
            </label>
            <input
              v-model="form.login"
              type="text"
              placeholder="admin@goodnaan.fr"
              autocomplete="username"
              class="w-full rounded-xl px-4 py-3 text-sm transition-all outline-none"
              style="border:1.5px solid #E5E5E5; color:#1A1A1A"
              :style="focusLogin ? 'border-color:#E8192C' : ''"
              @focus="focusLogin = true"
              @blur="focusLogin = false"
            />
          </div>

          <!-- Password field -->
          <div>
            <label class="block text-xs font-semibold mb-1.5" style="color:#555">
              Mot de passe
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full rounded-xl px-4 py-3 text-sm transition-all outline-none pr-10"
                style="border:1.5px solid #E5E5E5; color:#1A1A1A"
                :style="focusPwd ? 'border-color:#E8192C' : ''"
                @focus="focusPwd = true"
                @blur="focusPwd = false"
              />
              <button type="button"
                      @click="showPwd = !showPwd"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                      style="color:#AAA">
                {{ showPwd ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error"
             class="text-xs rounded-xl px-3 py-2.5 text-center font-medium"
             style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
            {{ error }}
          </p>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all mt-2"
            :style="loading
              ? 'background:#ccc; cursor:not-allowed'
              : 'background:linear-gradient(135deg,#E8192C,#A50E1C); box-shadow:0 4px 15px rgba(232,25,44,0.35)'">
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connexion…
            </span>
            <span v-else>Se connecter →</span>
          </button>

        </form>
      </div>

      <p class="text-center text-xs mt-6" style="color:#666">
        Accès réservé au personnel autorisé
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth   = useAuthStore()
const router = useRouter()

const form     = ref({ login: '', password: '' })
const loading  = ref(false)
const error    = ref('')
const showPwd  = ref(false)
const focusLogin = ref(false)
const focusPwd   = ref(false)

async function submit() {
  error.value = ''
  if (!form.value.login || !form.value.password) {
    error.value = 'Veuillez remplir tous les champs.'
    return
  }
  loading.value = true
  try {
    await auth.login(form.value.login, form.value.password)
    router.push('/admin')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur de connexion.'
  } finally {
    loading.value = false
  }
}
</script>
