<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen"
           class="fixed inset-0 z-50 flex items-center justify-center p-4"
           style="background:rgba(0,0,0,0.5)"
           @click.self="close">
        <div class="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]" style="background:#fff">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #F0F0F0">
            <h3 class="font-bold text-base" style="color:#1A1A1A">
              📦 Importer des produits en masse
            </h3>
            <button @click="close"
                    class="w-8 h-8 rounded-full flex items-center justify-center"
                    style="background:#F0F0F0; color:#555">✕</button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4">

            <!-- Tabs -->
            <div class="flex gap-2 border-b" style="border-color:#E5E5E5">
              <button @click="activeTab = 'format'"
                      class="px-4 py-2 text-sm font-semibold border-b-2 transition-all"
                      :style="activeTab === 'format'
                        ? 'border-color:#E8192C; color:#E8192C'
                        : 'border-color:transparent; color:#888'">
                📋 Format
              </button>
              <button @click="activeTab = 'paste'"
                      class="px-4 py-2 text-sm font-semibold border-b-2 transition-all"
                      :style="activeTab === 'paste'
                        ? 'border-color:#E8192C; color:#E8192C'
                        : 'border-color:transparent; color:#888'">
                📝 Coller les données
              </button>
              <button @click="activeTab = 'preview'"
                      class="px-4 py-2 text-sm font-semibold border-b-2 transition-all"
                      :style="activeTab === 'preview'
                        ? 'border-color:#E8192C; color:#E8192C'
                        : 'border-color:transparent; color:#888'">
                ✅ Aperçu ({{ parsedItems.length }})
              </button>
            </div>

            <!-- TAB 1: FORMAT GUIDE -->
            <div v-if="activeTab === 'format'" class="space-y-4">
              <div class="p-4 rounded-xl" style="background:#F0F7FF; border:1px solid #BFDBFE">
                <p class="text-sm font-semibold mb-3" style="color:#1E40AF">📌 Format CSV (recommandé)</p>
                <p class="text-xs mb-3" style="color:#555">Collez vos données avec les colonnes suivantes :</p>
                <div class="bg-white rounded-lg p-3 font-mono text-xs overflow-x-auto mb-3" style="border:1px solid #E5E5E5">
                  <div>categorie,nom,description,prix,populaire,en_stock</div>
                  <div style="color:#888">Pizzas,Margherita,Tomate et mozzarella,12.99,oui,oui</div>
                  <div style="color:#888">Pizzas,Quattro Formaggi,4 fromages,14.99,non,oui</div>
                  <div style="color:#888">Boissons,Coca Cola,Canette 33cl,2.50,non,oui</div>
                </div>
                <p class="text-xs" style="color:#555">
                  <strong>Colonnes :</strong><br>
                  • <strong>categorie</strong> : Nom de la catégorie (créée si n'existe pas)<br>
                  • <strong>nom</strong> : Nom du produit *<br>
                  • <strong>description</strong> : Description courte<br>
                  • <strong>prix</strong> : Prix en euros *<br>
                  • <strong>populaire</strong> : "oui" ou "non"<br>
                  • <strong>en_stock</strong> : "oui" ou "non"
                </p>
              </div>

              <div class="p-4 rounded-xl" style="background:#FFF0F1; border:1px solid #FFCDD0">
                <p class="text-sm font-semibold mb-2" style="color:#C2185B">💡 Conseils</p>
                <ul class="text-xs space-y-1" style="color:#555">
                  <li>✓ Utilisez des guillemets si vos données contiennent des virgules</li>
                  <li>✓ La première ligne doit être l'en-tête (categorie,nom,description...)</li>
                  <li>✓ Les colonnes marquées * sont obligatoires</li>
                  <li>✓ Les images peuvent être ajoutées après l'import</li>
                </ul>
              </div>
            </div>

            <!-- TAB 2: PASTE DATA -->
            <div v-if="activeTab === 'paste'" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold mb-2" style="color:#555">Collez vos données CSV ici :</label>
                <textarea v-model="rawData"
                          rows="10"
                          class="w-full p-3 rounded-xl border text-xs font-mono"
                          style="border-color:#E5E5E5; color:#1A1A1A"
                          placeholder="categorie,nom,description,prix,populaire,en_stock&#10;Pizzas,Margherita,Tomate et mozzarella,12.99,oui,oui&#10;Pizzas,Quattro Formaggi,4 fromages,14.99,non,oui" />
              </div>

              <button @click="parseData"
                      class="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
                      style="background:#E8192C">
                🔍 Analyser les données
              </button>

              <p v-if="parseError" class="text-xs rounded-xl px-3 py-2"
                 style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                ⚠️ {{ parseError }}
              </p>
            </div>

            <!-- TAB 3: PREVIEW -->
            <div v-if="activeTab === 'preview'" class="space-y-3">
              <div v-if="parsedItems.length === 0" class="text-center py-8" style="color:#AAA">
                <p class="text-sm">Aucun produit à importer. Collez vos données d'abord.</p>
              </div>

              <div v-else class="space-y-2">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-sm font-semibold" style="color:#1A1A1A">
                    {{ parsedItems.length }} produit{{ parsedItems.length > 1 ? 's' : '' }} à importer
                  </p>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input v-model="selectAll" type="checkbox" class="w-4 h-4 accent-red-600" />
                    <span class="text-xs font-semibold" style="color:#555">Tous sélectionner</span>
                  </label>
                </div>

                <div class="max-h-64 overflow-y-auto space-y-2 border rounded-xl p-3" style="border-color:#E5E5E5">
                  <div v-for="(item, idx) in parsedItems" :key="idx"
                       class="flex items-start gap-3 p-3 rounded-lg transition-all"
                       :style="item.selected
                         ? 'background:#FFF0F1; border:1px solid #FFCDD0'
                         : 'background:#F7F7F7; border:1px solid #E5E5E5'">

                    <input v-model="item.selected" type="checkbox" class="w-4 h-4 accent-red-600 mt-0.5 flex-shrink-0" />

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p class="text-sm font-semibold" style="color:#1A1A1A">{{ item.nom }}</p>
                          <p class="text-xs" style="color:#888">{{ item.categorie }}</p>
                        </div>
                        <p class="text-sm font-bold flex-shrink-0" style="color:#E8192C">€{{ item.prix }}</p>
                      </div>
                      <p v-if="item.description" class="text-xs mb-2" style="color:#555">{{ item.description }}</p>
                      <div class="flex gap-2 flex-wrap">
                        <span v-if="item.populaire === 'oui'" class="text-xs px-2 py-0.5 rounded-full"
                              style="background:#FFF0F1; color:#E8192C">🔥 Populaire</span>
                        <span v-if="item.en_stock === 'oui'" class="text-xs px-2 py-0.5 rounded-full"
                              style="background:#F0FFF4; color:#16a34a">✓ En stock</span>
                        <span v-else class="text-xs px-2 py-0.5 rounded-full"
                              style="background:#FFF0F1; color:#E8192C">✕ Rupture</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p v-if="validationErrors.length > 0" class="text-xs rounded-xl px-3 py-2"
                   style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                  <strong>⚠️ Erreurs de validation :</strong><br>
                  <span v-for="(err, i) in validationErrors" :key="i" class="block">• {{ err }}</span>
                </p>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 flex gap-3 border-t" style="border-color:#E5E5E5">
            <button @click="close"
                    class="flex-1 py-3 rounded-xl border text-sm font-semibold"
                    style="border-color:#E5E5E5; color:#555">Annuler</button>
            <button @click="importItems"
                    :disabled="selectedCount === 0 || importing || validationErrors.length > 0"
                    class="flex-1 py-3 rounded-xl text-white text-sm font-semibold transition-all"
                    :style="selectedCount === 0 || importing || validationErrors.length > 0
                      ? 'background:#CCC; cursor:not-allowed'
                      : 'background:#E8192C'">
              <span v-if="importing" class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Import en cours…
              </span>
              <span v-else>✅ Importer {{ selectedCount }} produit{{ selectedCount > 1 ? 's' : '' }}</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import adminService from '@/services/adminService'
import { useRestaurantStore } from '@/stores/restaurantStore'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close', 'imported'])

const restStore = useRestaurantStore()

const activeTab = ref('format')
const rawData = ref('')
const parseError = ref('')
const parsedItems = ref([])
const validationErrors = ref([])
const importing = ref(false)
const selectAll = ref(false)

const selectedCount = computed(() => parsedItems.value.filter(i => i.selected).length)

watch(selectAll, (val) => {
  parsedItems.value.forEach(item => {
    item.selected = val
  })
})

function getRestaurantId() {
  return (
    restStore.restaurant?.id ||
    restStore.menu?.restaurant_id ||
    localStorage.getItem('restaurant_id') ||
    1
  )
}

function parseData() {
  parseError.value = ''
  validationErrors.value = []
  parsedItems.value = []

  if (!rawData.value.trim()) {
    parseError.value = 'Veuillez coller des données.'
    return
  }

  const lines = rawData.value.trim().split('\n')
  if (lines.length < 2) {
    parseError.value = 'Au moins 2 lignes requises (en-tête + 1 produit).'
    return
  }

  // Parse header
  const header = lines[0].split(',').map(h => h.trim().toLowerCase())
  const requiredCols = ['nom', 'prix']
  const missingCols = requiredCols.filter(col => !header.includes(col))

  if (missingCols.length > 0) {
    parseError.value = `Colonnes manquantes : ${missingCols.join(', ')}`
    return
  }

  // Parse rows
  const items = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Simple CSV parsing (handles quoted values)
    const values = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    // Map to object
    const item = {}
    header.forEach((col, idx) => {
      item[col] = values[idx] || ''
    })

    item.selected = true
    items.push(item)
  }

  // Validate items
  items.forEach((item, idx) => {
    if (!item.nom) {
      validationErrors.value.push(`Ligne ${idx + 2} : nom manquant`)
    }
    if (!item.prix || isNaN(parseFloat(item.prix))) {
      validationErrors.value.push(`Ligne ${idx + 2} : prix invalide`)
    }
  })

  parsedItems.value = items
  activeTab.value = 'preview'
}

async function importItems() {
  const selectedItems = parsedItems.value.filter(i => i.selected)

  if (selectedItems.length === 0) {
    parseError.value = 'Sélectionnez au moins un produit.'
    return
  }

  importing.value = true

  try {
    const restaurantId = getRestaurantId()
    let createdCount = 0

    // Group by category
    const byCategory = {}
    selectedItems.forEach(item => {
      const cat = item.categorie || 'Autres'
      if (!byCategory[cat]) byCategory[cat] = []
      byCategory[cat].push(item)
    })

    // Create categories and items
    for (const [catName, items] of Object.entries(byCategory)) {
      // Create or get category
      let categoryId
      try {
        const catRes = await adminService.createCategory({
          name: catName,
          sort_order: 0,
          restaurant_id: restaurantId,
        })
        categoryId = catRes.data.data?.id || catRes.data.id
      } catch (e) {
        // Category might already exist, try to fetch it
        const catsRes = await adminService.getCategories(restaurantId)
        const existingCat = catsRes.data.data?.find(c => c.name === catName) || catsRes.data?.find(c => c.name === catName)
        if (existingCat) {
          categoryId = existingCat.id
        } else {
          throw e
        }
      }

      // Create items
      for (const item of items) {
        const payload = new FormData()
        payload.append('restaurant_id', restaurantId)
        payload.append('category_id', categoryId)
        payload.append('name', item.nom)
        payload.append('description', item.description || '')
        payload.append('price', parseFloat(item.prix))
        payload.append('is_available', item.en_stock === 'oui' ? 1 : 0)
        payload.append('is_popular', item.populaire === 'oui' ? 1 : 0)

        await adminService.createMenuItem(payload)
        createdCount++
      }
    }

    // Success
    emit('imported', { count: createdCount })
    close()

  } catch (e) {
    console.error(e)
    parseError.value = e.response?.data?.message || 'Erreur lors de l\'import.'
  } finally {
    importing.value = false
  }
}

function close() {
  emit('close')
  // Reset
  activeTab.value = 'format'
  rawData.value = ''
  parseError.value = ''
  parsedItems.value = []
  validationErrors.value = []
  selectAll.value = false
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
