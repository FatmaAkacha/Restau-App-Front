<template>
  <div class="space-y-6">

    <!-- ── TOP BAR ── -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="font-bold text-lg" style="color:#1A1A1A">Gestion des ingrédients</h2>
      <button @click="openAddIngredient()"
              class="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style="background:#E8192C">
        + Ingrédient
      </button>
    </div>

    <!-- ── LOADING ── -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 rounded-full animate-spin"
           style="border-color:#E8192C; border-top-color:transparent" />
    </div>

    <!-- ── INGREDIENTS BY CATEGORY ── -->
    <div v-else class="space-y-4">
      <div v-for="category in groupedIngredients" :key="category.name" class="card overflow-hidden">

        <!-- Category header -->
        <div class="flex items-center justify-between px-5 py-3"
             style="background:#FAFAFA; border-bottom:1px solid #F0F0F0">
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ getCategoryEmoji(category.name) }}</span>
            <span class="font-bold text-sm" style="color:#1A1A1A">{{ getCategoryLabel(category.name) }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" style="background:#F0F0F0; color:#888">
              {{ category.items.length }} articles
            </span>
          </div>
          <button @click="toggleCategory(category.name)"
                  class="text-xs ml-auto" style="color:#AAA">
            {{ openCategories.includes(category.name) ? '▲' : '▼' }}
          </button>
        </div>

        <!-- Items table -->
        <div v-if="openCategories.includes(category.name)">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead style="background:#F7F7F7">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Nom</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Quantité</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Unité</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Min</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Statut</th>
                  <th class="px-4 py-2 text-right text-xs font-semibold uppercase" style="color:#888">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in category.items" :key="item.id"
                    class="transition-colors hover:bg-red-50"
                    style="border-top:1px solid #F0F0F0">
                  <td class="px-4 py-3 font-medium" style="color:#1A1A1A">{{ item.name }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <input
                        type="number"
                        :value="item.quantity"
                        @change="e => updateQuantity(item, parseFloat(e.target.value))"
                        class="w-20 px-2 py-1 rounded-lg border text-sm"
                        style="border-color:#E5E5E5"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3 text-xs" style="color:#888">{{ item.unit }}</td>
                  <td class="px-4 py-3 text-xs" style="color:#888">{{ item.min_quantity }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="text-xs px-2 py-0.5 rounded-full font-semibold"
                      :style="item.is_available
                        ? 'background:#F0FFF4; color:#16a34a'
                        : 'background:#FFF0F1; color:#E8192C'">
                      {{ item.is_available ? '✓ Disponible' : '✗ Indisponible' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openEditIngredient(item)"
                              class="px-3 py-1 rounded-lg text-xs font-semibold"
                              style="background:#F0F7FF; color:#2563EB">✏️</button>
                      <button @click="confirmDeleteIngredient(item)"
                              class="px-3 py-1 rounded-lg text-xs font-semibold"
                              style="background:#FFF0F1; color:#E8192C">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-if="!ingredients.length" class="text-center py-12 text-sm" style="color:#AAA">
        Aucun ingrédient. Commencez par en créer un.
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         MODAL — INGRÉDIENT (add / edit)
    ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showForm"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(0,0,0,0.5)"
             @click.self="showForm = false">
          <div class="w-full max-w-sm rounded-2xl" style="background:#fff">

            <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #F0F0F0">
              <h3 class="font-bold text-base" style="color:#1A1A1A">
                {{ editingIngredient ? '✏️ Modifier l\'ingrédient' : '+ Nouvel ingrédient' }}
              </h3>
              <button @click="showForm = false"
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      style="background:#F0F0F0; color:#555">✕</button>
            </div>

            <div class="px-6 py-5 space-y-4">
              <!-- Nom -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Nom *</label>
                <input v-model="form.name" type="text" placeholder="Ex : Cheddar, Kefta, Sauce BBQ" class="input" />
              </div>

              <!-- Catégorie -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Catégorie *</label>
                <select v-model="form.category" class="input">
                  <option value="">— Choisir une catégorie —</option>
                  <option v-for="cat in PREDEFINED_CATEGORIES" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <!-- Quantité -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Quantité *</label>
                <input v-model="form.quantity" type="number" step="0.01" min="0" class="input" />
              </div>

              <!-- Unité -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Unité *</label>
                <select v-model="form.unit" class="input">
                  <option value="g">Grammes (g)</option>
                  <option value="ml">Millilitres (ml)</option>
                  <option value="pièce">Pièce</option>
                  <option value="l">Litres (l)</option>
                  <option value="kg">Kilogrammes (kg)</option>
                </select>
              </div>

              <!-- Quantité minimale -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Quantité minimale (alerte)</label>
                <input v-model="form.min_quantity" type="number" step="0.01" min="0" class="input" />
              </div>

              <!-- Disponibilité -->
              <div>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="form.is_available" type="checkbox" class="w-4 h-4 accent-red-600" />
                  <span class="text-sm font-medium" style="color:#555">Disponible</span>
                </label>
              </div>

              <p v-if="formError" class="text-xs rounded-xl px-3 py-2 text-center"
                 style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                {{ formError }}
              </p>
            </div>

            <div class="px-6 pb-6 flex gap-3">
              <button @click="showForm = false"
                      class="flex-1 py-3 rounded-xl border text-sm font-semibold"
                      style="border-color:#E5E5E5; color:#555">Annuler</button>
              <button @click="saveIngredient" :disabled="saving"
                      class="flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                      style="background:#E8192C">
                <span v-if="saving" class="flex items-center justify-center gap-2">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement…
                </span>
                <span v-else>{{ editingIngredient ? 'Enregistrer' : 'Créer' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════
         CONFIRM DELETE
    ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="deleteTarget"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(0,0,0,0.5)"
             @click.self="deleteTarget = null">
          <div class="w-full max-w-sm rounded-2xl p-6 text-center" style="background:#fff">
            <div class="text-4xl mb-3">🗑️</div>
            <h3 class="font-bold text-base mb-2" style="color:#1A1A1A">
              Supprimer cet ingrédient ?
            </h3>
            <p class="text-sm mb-5" style="color:#888">
              « {{ deleteTarget.name }} » sera définitivement supprimé.
            </p>
            <div class="flex gap-3">
              <button @click="deleteTarget = null"
                      class="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
                      style="border-color:#E5E5E5; color:#555">Annuler</button>
              <button @click="executeDelete"
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
import { ref, computed, onMounted } from 'vue'
import adminService from '@/services/adminService'
import { useRestaurantStore } from '@/stores/restaurantStore'

const restStore = useRestaurantStore()

const ingredients = ref([])
const loading = ref(true)
const openCategories = ref([])
const availableCategories = ref([])

const showForm = ref(false)
const editingIngredient = ref(null)
const saving = ref(false)
const formError = ref('')

const form = ref(emptyForm())
const deleteTarget = ref(null)

const PREDEFINED_CATEGORIES = [
  { value: 'viande', label: '🥩 Viande' },
  { value: 'fromage', label: '🧀 Fromage' },
  { value: 'sauce', label: '🍯 Sauce' },
  { value: 'garniture', label: '🥔 Garniture' },
  { value: 'boisson', label: '🥤 Boisson' },
  { value: 'autre', label: '📦 Autre' },
]

function emptyForm() {
  return {
    name: '',
    category: '',
    quantity: 0,
    unit: 'g',
    min_quantity: 0,
    is_available: true,
  }
}

function getRestaurantId() {
  return (
    restStore.restaurant?.id ||
    restStore.menu?.restaurant_id ||
    localStorage.getItem('restaurant_id') ||
    1
  )
}

function getCategoryEmoji(categoryName) {
  const cat = PREDEFINED_CATEGORIES.find(c => c.value === categoryName)
  return cat ? cat.label.split(' ')[0] : '📦'
}

function getCategoryLabel(categoryName) {
  const cat = PREDEFINED_CATEGORIES.find(c => c.value === categoryName)
  return cat ? cat.label.split(' ').slice(1).join(' ') : categoryName
}

const groupedIngredients = computed(() => {
  const grouped = {}
  ingredients.value.forEach(ing => {
    if (!grouped[ing.category]) {
      grouped[ing.category] = { name: ing.category, items: [] }
    }
    grouped[ing.category].items.push(ing)
  })
  return Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name))
})

async function load() {
  loading.value = true
  try {
    const restaurantId = getRestaurantId()
    const res = await adminService.getIngredients(restaurantId)
    ingredients.value = res.data || []
    openCategories.value = groupedIngredients.value.slice(0, 3).map(g => g.name)
  } catch (error) {
    console.error('Erreur chargement ingrédients :', error)
  } finally {
    loading.value = false
  }
}

function toggleCategory(name) {
  const idx = openCategories.value.indexOf(name)
  if (idx === -1) {
    openCategories.value.push(name)
  } else {
    openCategories.value.splice(idx, 1)
  }
}

async function updateQuantity(item, newQuantity) {
  try {
    await adminService.updateIngredientQuantity(item.id, newQuantity)
    item.quantity = newQuantity
  } catch (e) {
    console.error(e)
    alert('Erreur lors de la mise à jour de la quantité.')
  }
}

function openAddIngredient() {
  editingIngredient.value = null
  form.value = emptyForm()
  formError.value = ''
  showForm.value = true
}

function openEditIngredient(item) {
  editingIngredient.value = item
  form.value = { ...item }
  formError.value = ''
  showForm.value = true
}

async function saveIngredient() {
  formError.value = ''

  if (!form.value.name || !form.value.category || !form.value.unit) {
    formError.value = 'Nom, catégorie et unité sont obligatoires.'
    return
  }

  const restaurantId = getRestaurantId()
  saving.value = true

  try {
    const payload = {
      restaurant_id: restaurantId,
      name: form.value.name,
      category: form.value.category,
      quantity: Number(form.value.quantity),
      unit: form.value.unit,
      min_quantity: Number(form.value.min_quantity),
      is_available: form.value.is_available ? 1 : 0,
    }

    if (editingIngredient.value) {
      await adminService.updateIngredient(editingIngredient.value.id, payload)
    } else {
      await adminService.createIngredient(payload)
    }

    await load()
    showForm.value = false
  } catch (e) {
    console.error(e)
    formError.value = e.response?.data?.message || 'Erreur lors de l\'enregistrement.'
  } finally {
    saving.value = false
  }
}

function confirmDeleteIngredient(item) {
  deleteTarget.value = item
}

async function executeDelete() {
  if (!deleteTarget.value) return

  try {
    await adminService.deleteIngredient(deleteTarget.value.id)
    ingredients.value = ingredients.value.filter(i => i.id !== deleteTarget.value.id)
    deleteTarget.value = null
  } catch (e) {
    console.error(e)
    alert(e.response?.data?.message || 'Erreur lors de la suppression.')
    deleteTarget.value = null
  }
}

onMounted(load)
</script>

<style scoped>
.input {
  @apply w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-all;
  border-color: #E5E5E5;
  color: #1A1A1A;
}

.input:focus {
  border-color: #E8192C;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
