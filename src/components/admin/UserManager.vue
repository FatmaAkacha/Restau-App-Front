<template>
  <div class="space-y-6">

    <!-- TOP BAR -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="font-bold text-lg" style="color:#1A1A1A">👥 Gestion des utilisateurs</h2>
      <button @click="openAddUser()"
              class="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style="background:#E8192C">
        + Nouvel utilisateur
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 rounded-full animate-spin"
           style="border-color:#E8192C; border-top-color:transparent" />
    </div>

    <!-- USERS TABLE -->
    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead style="background:#F7F7F7">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Nom d'utilisateur</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Email</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Rôle</th>
              <th class="px-5 py-3 text-left text-xs font-semibold uppercase" style="color:#888">Créé le</th>
              <th class="px-5 py-3 text-right text-xs font-semibold uppercase" style="color:#888">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id"
                class="transition-colors hover:bg-red-50"
                style="border-top:1px solid #F0F0F0">
              <td class="px-5 py-3 font-medium" style="color:#1A1A1A">{{ user.username }}</td>
              <td class="px-5 py-3 text-sm" style="color:#555">{{ user.email }}</td>
              <td class="px-5 py-3">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                      :style="user.role === 'admin'
                        ? 'background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0'
                        : 'background:#F0F7FF; color:#2563EB; border:1px solid #BFDBFE'">
                  {{ user.role === 'admin' ? '👑 Admin' : '👤 Staff' }}
                </span>
              </td>
              <td class="px-5 py-3 text-xs" style="color:#888">{{ formatDate(user.created_at) }}</td>
              <td class="px-5 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openEditUser(user)"
                          class="px-3 py-1 rounded-lg text-xs font-semibold"
                          style="background:#F0F7FF; color:#2563EB">✏️ Modifier</button>
                  <button @click="confirmDelete(user)"
                          class="px-3 py-1 rounded-lg text-xs font-semibold"
                          style="background:#FFF0F1; color:#E8192C">🗑️</button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="5" class="px-5 py-12 text-center text-xs" style="color:#AAA">
                Aucun utilisateur
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL: ADD/EDIT USER -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForm"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(0,0,0,0.5)"
             @click.self="showForm = false">
          <div class="w-full max-w-md rounded-2xl overflow-y-auto max-h-[90vh]" style="background:#fff">

            <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #F0F0F0">
              <h3 class="font-bold text-base" style="color:#1A1A1A">
                {{ editingUser ? '✏️ Modifier l\'utilisateur' : '+ Nouvel utilisateur' }}
              </h3>
              <button @click="showForm = false"
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      style="background:#F0F0F0; color:#555">✕</button>
            </div>

            <div class="px-6 py-5 space-y-4">
              <!-- Username -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Nom d'utilisateur *</label>
                <input v-model="form.username" type="text" placeholder="Ex: john_admin" class="input" />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Email *</label>
                <input v-model="form.email" type="email" placeholder="Ex: john@example.com" class="input" />
              </div>

              <!-- Password -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">
                  Mot de passe {{ editingUser ? '(laisser vide pour ne pas changer)' : '*' }}
                </label>
                <input v-model="form.password" type="password" placeholder="••••••••" class="input" />
              </div>

              <!-- Role -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Rôle *</label>
                <select v-model="form.role" class="input">
                  <option value="">— Choisir —</option>
                  <option value="admin">👑 Admin</option>
                  <option value="staff">👤 Staff</option>
                </select>
              </div>

              <!-- Error -->
              <p v-if="error" class="text-xs rounded-xl px-3 py-2 text-center"
                 style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                {{ error }}
              </p>
            </div>

            <div class="px-6 pb-6 flex gap-3">
              <button @click="showForm = false"
                      class="flex-1 py-3 rounded-xl border text-sm font-semibold"
                      style="border-color:#E5E5E5; color:#555">Annuler</button>
              <button @click="saveUser" :disabled="saving"
                      class="flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                      style="background:#E8192C">
                <span v-if="saving" class="flex items-center justify-center gap-2">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement…
                </span>
                <span v-else>{{ editingUser ? 'Enregistrer' : 'Créer' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL: CONFIRM DELETE -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(0,0,0,0.5)"
             @click.self="deleteTarget = null">
          <div class="w-full max-w-sm rounded-2xl p-6 text-center" style="background:#fff">
            <div class="text-4xl mb-3">🗑️</div>
            <h3 class="font-bold text-base mb-2" style="color:#1A1A1A">
              Supprimer cet utilisateur ?
            </h3>
            <p class="text-sm mb-5" style="color:#888">
              « {{ deleteTarget.username }} » sera définitivement supprimé.
            </p>
            <div class="flex gap-3">
              <button @click="deleteTarget = null"
                      class="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
                      style="border-color:#E5E5E5; color:#555">Annuler</button>
              <button @click="deleteUser"
                      class="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                      style="background:#E8192C">Supprimer</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from '@/services/userService'

const users = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingUser = ref(null)
const saving = ref(false)
const error = ref('')
const deleteTarget = ref(null)

const form = ref({
  username: '',
  email: '',
  password: '',
  role: '',
})

function emptyForm() {
  return {
    username: '',
    email: '',
    password: '',
    role: '',
  }
}

async function load() {
  loading.value = true
  try {
    const { data } = await userService.getUsers()
    users.value = data
  } catch (e) {
    console.error('Error loading users:', e)
  } finally {
    loading.value = false
  }
}

function openAddUser() {
  editingUser.value = null
  form.value = emptyForm()
  error.value = ''
  showForm.value = true
}

function openEditUser(user) {
  editingUser.value = user
  form.value = {
    username: user.username,
    email: user.email,
    password: '',
    role: user.role,
  }
  error.value = ''
  showForm.value = true
}

async function saveUser() {
  error.value = ''

  if (!form.value.username || !form.value.email || !form.value.role) {
    error.value = 'Nom d\'utilisateur, email et rôle sont obligatoires.'
    return
  }

  if (!editingUser.value && !form.value.password) {
    error.value = 'Le mot de passe est obligatoire pour un nouvel utilisateur.'
    return
  }

  saving.value = true

  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      role: form.value.role,
    }

    if (form.value.password) {
      payload.password = form.value.password
    }

    console.log('Saving user:', payload)

    if (editingUser.value) {
      await userService.updateUser(editingUser.value.id, payload)
    } else {
      await userService.createUser(payload)
    }

    console.log('User saved successfully')
    await load()
    showForm.value = false
  } catch (e) {
    console.error('Error saving user:', e)
    error.value = e.response?.data?.message || 
                  Object.values(e.response?.data?.errors || {}).flat().join(' | ') ||
                  'Erreur lors de l\'enregistrement.'
  } finally {
    saving.value = false
  }
}

function confirmDelete(user) {
  deleteTarget.value = user
}

async function deleteUser() {
  if (!deleteTarget.value) return

  try {
    await userService.deleteUser(deleteTarget.value.id)
    await load()
    deleteTarget.value = null
  } catch (e) {
    console.error(e)
    alert(e.response?.data?.message || 'Erreur lors de la suppression.')
    deleteTarget.value = null
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(load)
</script>
