<template>
  <div class="space-y-6">

    <!-- ── TOP BAR ── -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="font-bold text-lg" style="color:#1A1A1A">🛒 Gestion des produits</h2>
      <div class="flex gap-2">
        <button @click="openAddCategory()"
                class="px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
                style="border-color:#E8192C; color:#E8192C; background:#FFF0F1">
          + Catégorie
        </button>
        <button @click="openAddItem()"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style="background:#E8192C">
          + Produit
        </button>
      </div>
    </div>

    <!-- ── LOADING ── -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 rounded-full animate-spin"
           style="border-color:#E8192C; border-top-color:transparent" />
    </div>

    <!-- ── CATEGORIES + ITEMS ── -->
    <div v-else class="space-y-3">
      <div v-for="cat in categories" :key="cat.id" class="card overflow-hidden">

        <!-- Category row -->
        <div class="flex items-center justify-between px-5 py-3"
             style="background:#FAFAFA; border-bottom:1px solid #F0F0F0">
          <button class="flex items-center gap-3 flex-1 text-left" @click="toggleCat(cat.id)">
            <span class="font-bold text-sm" style="color:#1A1A1A">{{ cat.name }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" style="background:#F0F0F0; color:#888">
              {{ cat.menu_items?.length || 0 }} articles
            </span>
            <span class="text-xs ml-auto" style="color:#AAA">{{ openCats.includes(cat.id) ? '▲' : '▼' }}</span>
          </button>
          <!-- Category actions -->
          <div class="flex items-center gap-2 ml-4">
            <button @click.stop="openEditCategory(cat)"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style="background:#F0F7FF; color:#2563EB">✏️</button>
            <button @click.stop="confirmDeleteCategory(cat)"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style="background:#FFF0F1; color:#E8192C">🗑️</button>
          </div>
        </div>

        <!-- Items table -->
        <div v-if="openCats.includes(cat.id)">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead style="background:#F7F7F7">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Produit</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Prix</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">Stock</th>
                  <th class="px-4 py-2 text-left text-xs font-semibold uppercase" style="color:#888">🔥</th>
                  <th class="px-4 py-2 text-right text-xs font-semibold uppercase" style="color:#888">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cat.menu_items" :key="item.id"
                    class="transition-colors hover:bg-red-50"
                    style="border-top:1px solid #F0F0F0">
                  <!-- Name + image -->
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                           style="background:#F0F0F0">
                        <img v-if="item.image"
                             :src="`/images/menu/${item.image}`"
                             :alt="item.name"
                             class="w-full h-full object-cover"
                             @error="e => e.target.style.display='none'" />
                      </div>
                      <span class="font-medium" style="color:#1A1A1A">{{ item.name }}</span>
                    </div>
                  </td>
                  <!-- Price -->
                  <td class="px-4 py-3 font-semibold" style="color:#E8192C">
                    €{{ Number(item.price).toFixed(2) }}
                  </td>
                  <!-- Stock toggle -->
                  <td class="px-4 py-3">
                    <button @click="toggleStock(item)"
                            class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                            :style="item.is_available
                              ? 'background:#F0FFF4; color:#16a34a; border:1px solid #BBF7D0'
                              : 'background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0'">
                      <span class="w-1.5 h-1.5 rounded-full"
                            :style="item.is_available ? 'background:#16a34a' : 'background:#E8192C'" />
                      {{ item.is_available ? 'En stock' : 'Rupture' }}
                    </button>
                  </td>
                  <!-- Popular -->
                  <td class="px-4 py-3">
                    <span v-if="item.is_popular" class="text-xs px-2 py-0.5 rounded-full"
                          style="background:#FFF0F1; color:#E8192C">🔥</span>
                    <span v-else class="text-xs" style="color:#CCC">—</span>
                  </td>
                  <!-- Actions -->
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="openEditItem(item)"
                              class="px-3 py-1 rounded-lg text-xs font-semibold"
                              style="background:#F0F7FF; color:#2563EB">✏️ Modifier</button>
                      <button @click="confirmDeleteItem(item)"
                              class="px-3 py-1 rounded-lg text-xs font-semibold"
                              style="background:#FFF0F1; color:#E8192C">🗑️</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!cat.menu_items?.length">
                  <td colspan="5" class="px-4 py-6 text-center text-xs" style="color:#AAA">
                    Aucun produit — <button @click="openAddItem(cat.id)" style="color:#E8192C">+ Ajouter</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-4 py-2" style="border-top:1px solid #F0F0F0">
            <button @click="openAddItem(cat.id)" class="text-xs font-semibold" style="color:#E8192C">
              + Ajouter un produit dans {{ cat.name }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="!categories.length" class="text-center py-12 text-sm" style="color:#AAA">
        Aucune catégorie. Commencez par en créer une.
      </div>
    </div>

    <!-- ══════════════════════════════════════════
         MODAL — PRODUIT (add / edit)
    ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showItemForm"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(0,0,0,0.5)"
             @click.self="showItemForm = false">
          <div class="w-full max-w-lg rounded-2xl overflow-y-auto max-h-[90vh]" style="background:#fff">

            <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #F0F0F0">
              <h3 class="font-bold text-base" style="color:#1A1A1A">
                {{ editingItem ? '✏️ Modifier le produit' : '+ Nouveau produit' }}
              </h3>
              <button @click="showItemForm = false"
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      style="background:#F0F0F0; color:#555">✕</button>
            </div>

            <div class="px-6 py-5 space-y-4">
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Catégorie *</label>
                <select v-model="itemForm.category_id" class="input">
                  <option value="">— Choisir —</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Nom *</label>
                <input v-model="itemForm.name" type="text" placeholder="Ex : Cheese Naan Kefta" class="input" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Description</label>
                <textarea v-model="itemForm.description" rows="2" class="input resize-none"
                          placeholder="Description courte…" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold mb-1.5" style="color:#555">Prix (€) *</label>
                  <input v-model="itemForm.price" type="number" step="0.01" min="0" class="input" />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1.5" style="color:#555">Image (fichier)</label>
                  <input v-model="itemForm.image" type="text" placeholder="ex: burger.png" class="input" />
                </div>
              </div>
              <div class="flex gap-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="itemForm.is_available" type="checkbox" class="w-4 h-4 accent-red-600" />
                  <span class="text-sm font-medium" style="color:#555">En stock</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input v-model="itemForm.is_popular" type="checkbox" class="w-4 h-4 accent-red-600" />
                  <span class="text-sm font-medium" style="color:#555">🔥 Populaire</span>
                </label>
              </div>
              <p v-if="itemFormError" class="text-xs rounded-xl px-3 py-2 text-center"
                 style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                {{ itemFormError }}
              </p>
            </div>

            <div class="px-6 pb-6 flex gap-3">
              <button @click="showItemForm = false"
                      class="flex-1 py-3 rounded-xl border text-sm font-semibold"
                      style="border-color:#E5E5E5; color:#555">Annuler</button>
              <button @click="saveItem" :disabled="savingItem"
                      class="flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                      style="background:#E8192C">
                <span v-if="savingItem" class="flex items-center justify-center gap-2">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement…
                </span>
                <span v-else>{{ editingItem ? 'Enregistrer' : 'Ajouter' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════
         MODAL — CATÉGORIE (add / edit)
    ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCatForm"
             class="fixed inset-0 z-50 flex items-center justify-center p-4"
             style="background:rgba(0,0,0,0.5)"
             @click.self="showCatForm = false">
          <div class="w-full max-w-sm rounded-2xl" style="background:#fff">

            <div class="flex items-center justify-between px-6 py-4" style="border-bottom:1px solid #F0F0F0">
              <h3 class="font-bold text-base" style="color:#1A1A1A">
                {{ editingCat ? '✏️ Modifier la catégorie' : '+ Nouvelle catégorie' }}
              </h3>
              <button @click="showCatForm = false"
                      class="w-8 h-8 rounded-full flex items-center justify-center"
                      style="background:#F0F0F0; color:#555">✕</button>
            </div>

            <div class="px-6 py-5 space-y-4">
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Nom *</label>
                <input v-model="catForm.name" type="text" placeholder="Ex : Pizzas 🍕" class="input" />
              </div>
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Ordre d'affichage</label>
                <input v-model="catForm.sort_order" type="number" min="1" class="input" />
              </div>
              <p v-if="catFormError" class="text-xs rounded-xl px-3 py-2 text-center"
                 style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                {{ catFormError }}
              </p>
            </div>

            <div class="px-6 pb-6 flex gap-3">
              <button @click="showCatForm = false"
                      class="flex-1 py-3 rounded-xl border text-sm font-semibold"
                      style="border-color:#E5E5E5; color:#555">Annuler</button>
              <button @click="saveCategory" :disabled="savingCat"
                      class="flex-1 py-3 rounded-xl text-white text-sm font-semibold"
                      style="background:#E8192C">
                <span v-if="savingCat" class="flex items-center justify-center gap-2">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement…
                </span>
                <span v-else>{{ editingCat ? 'Enregistrer' : 'Créer' }}</span>
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
              Supprimer {{ deleteTarget.type === 'category' ? 'la catégorie' : 'ce produit' }} ?
            </h3>
            <p class="text-sm mb-5" style="color:#888">
              « {{ deleteTarget.name }} » sera définitivement supprimé{{ deleteTarget.type === 'category' ? 'e' : '' }}.
              <span v-if="deleteTarget.type === 'category'" class="block mt-1 text-xs" style="color:#E8192C">
                ⚠ Tous les produits de cette catégorie seront aussi supprimés.
              </span>
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
import { ref, onMounted } from 'vue'
import adminService from '@/services/adminService'
import { useRestaurantStore } from '@/stores/restaurantStore'

const restStore  = useRestaurantStore()
const categories = ref([])
const loading    = ref(true)
const openCats   = ref([])

// ── Item form ─────────────────────────────────────────────────────────
const showItemForm  = ref(false)
const editingItem   = ref(null)
const savingItem    = ref(false)
const itemFormError = ref('')
const itemForm      = ref(emptyItemForm())

function emptyItemForm(categoryId = '') {
  return { category_id: categoryId, name: '', description: '', price: '', image: '', is_available: true, is_popular: false }
}

// ── Category form ─────────────────────────────────────────────────────
const showCatForm  = ref(false)
const editingCat   = ref(null)
const savingCat    = ref(false)
const catFormError = ref('')
const catForm      = ref({ name: '', sort_order: '' })

// ── Delete ────────────────────────────────────────────────────────────
const deleteTarget = ref(null)   // { type: 'item'|'category', id, name, category_id? }

// ── Load ──────────────────────────────────────────────────────────────
async function load() {
  loading.value = true

  try {
    const restaurantId = restStore.restaurant?.id || 1

    // ── FETCH API ─────────────────────────────
    const [catsRes, itemsRes] = await Promise.all([
      adminService.getCategories(restaurantId),
      adminService.getMenuItems(restaurantId),
    ])

    // ── FIX API STRUCTURE ─────────────────────
    const cats = catsRes.data.data || catsRes.data || []
    const allItems = itemsRes.data.data || itemsRes.data || []

    console.log('CATEGORIES =>', cats)
    console.log('ITEMS =>', allItems)

    // ── BUILD CATEGORIES WITH ITEMS ───────────
    categories.value = cats.map(cat => ({
      ...cat,

      menu_items: allItems
        .filter(item => item.category_id === cat.id)
        .sort((a, b) => Number(b.is_popular) - Number(a.is_popular)),
    }))

    // ── OPEN ALL CATEGORIES ───────────────────
    openCats.value = categories.value.map(cat => cat.id)

  } catch (error) {
    console.error('Erreur chargement menu :', error)
  } finally {
    loading.value = false
  }
}

onMounted(load)

function toggleCat(id) {
  const idx = openCats.value.indexOf(id)
  if (idx === -1) openCats.value.push(id)
  else openCats.value.splice(idx, 1)
}

// ── Stock ─────────────────────────────────────────────────────────────
async function toggleStock(item) {
  try {
    const { data } = await adminService.toggleStock(item.id)
    item.is_available = data.is_available
    restStore.restaurant = null   // invalidate menu cache
  } catch {
    alert('Erreur lors de la mise à jour du stock.')
  }
}

// ── Item CRUD ─────────────────────────────────────────────────────────
function openAddItem(categoryId = '') {
  editingItem.value = null
  itemForm.value = emptyItemForm(categoryId)
  itemFormError.value = ''
  showItemForm.value = true
}

function openEditItem(item) {
  editingItem.value = item
  itemForm.value = {
    category_id:  item.category_id,
    name:         item.name,
    description:  item.description || '',
    price:        item.price,
    image:        item.image || '',
    is_available: item.is_available,
    is_popular:   item.is_popular,
  }
  itemFormError.value = ''
  showItemForm.value = true
}

async function saveItem() {
  itemFormError.value = ''
  if (!itemForm.value.name || !itemForm.value.price || !itemForm.value.category_id) {
    itemFormError.value = 'Nom, prix et catégorie sont obligatoires.'
    return
  }
  savingItem.value = true
  try {
    const payload = {
      ...itemForm.value,
      restaurant_id: restStore.restaurant?.id || 1,
      price:         Number(itemForm.value.price),
      image:         itemForm.value.image || null,
    }
    if (editingItem.value) {
      const { data } = await adminService.updateMenuItem(editingItem.value.id, payload)
      const cat = categories.value.find(c => c.id === data.category_id)
      if (cat) {
        const idx = cat.menu_items.findIndex(i => i.id === data.id)
        if (idx !== -1) cat.menu_items[idx] = data
        else cat.menu_items.push(data)
      }
    } else {
      await adminService.createMenuItem(payload)
      await load()
    }
    showItemForm.value = false
    restStore.restaurant = null
  } catch (e) {
    itemFormError.value = e.response?.data?.message || 'Erreur lors de l\'enregistrement.'
  } finally {
    savingItem.value = false
  }
}

function confirmDeleteItem(item) {
  deleteTarget.value = { type: 'item', id: item.id, name: item.name, category_id: item.category_id }
}

// ── Category CRUD ─────────────────────────────────────────────────────
function openAddCategory() {
  editingCat.value = null
  catForm.value = { name: '', sort_order: categories.value.length + 1 }
  catFormError.value = ''
  showCatForm.value = true
}

function openEditCategory(cat) {
  editingCat.value = cat
  catForm.value = { name: cat.name, sort_order: cat.sort_order }
  catFormError.value = ''
  showCatForm.value = true
}

async function saveCategory() {
  catFormError.value = ''
  if (!catForm.value.name) { catFormError.value = 'Le nom est obligatoire.'; return }
  savingCat.value = true
  try {
    const payload = {
      name:          catForm.value.name,
      sort_order:    Number(catForm.value.sort_order) || 0,
      restaurant_id: restStore.restaurant?.id || 1,
    }
    if (editingCat.value) {
      const { data } = await adminService.updateCategory(editingCat.value.id, payload)
      const idx = categories.value.findIndex(c => c.id === data.id)
      if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...data }
    } else {
      await adminService.createCategory(payload)
      await load()
    }
    showCatForm.value = false
    restStore.restaurant = null
  } catch (e) {
    catFormError.value = e.response?.data?.message || 'Erreur lors de l\'enregistrement.'
  } finally {
    savingCat.value = false
  }
}

function confirmDeleteCategory(cat) {
  deleteTarget.value = { type: 'category', id: cat.id, name: cat.name }
}

// ── Execute delete (item or category) ────────────────────────────────
async function executeDelete() {
  if (!deleteTarget.value) return
  try {
    if (deleteTarget.value.type === 'item') {
      await adminService.deleteMenuItem(deleteTarget.value.id)
      const cat = categories.value.find(c => c.id === deleteTarget.value.category_id)
      if (cat) cat.menu_items = cat.menu_items.filter(i => i.id !== deleteTarget.value.id)
    } else {
      await adminService.deleteCategory(deleteTarget.value.id)
      categories.value = categories.value.filter(c => c.id !== deleteTarget.value.id)
    }
    deleteTarget.value = null
    restStore.restaurant = null
  } catch (e) {
    alert(e.response?.data?.message || 'Erreur lors de la suppression.')
    deleteTarget.value = null
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
</style>
