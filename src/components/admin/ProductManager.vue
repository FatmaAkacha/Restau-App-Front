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
                             :src="getImageUrl(item.image)"
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
              <!-- Catégorie -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Catégorie *</label>
                <select v-model="itemForm.category_id" class="input">
                  <option value="">— Choisir —</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <!-- Nom -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Nom *</label>
                <input v-model="itemForm.name" type="text" placeholder="Ex : Cheese Naan Kefta" class="input" />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Description</label>
                <textarea v-model="itemForm.description" rows="2" class="input resize-none"
                          placeholder="Description courte…" />
              </div>

              <!-- Prix -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Prix (€) *</label>
                <input v-model="itemForm.price" type="number" step="0.01" min="0" class="input" />
              </div>

              <!-- ── IMAGE UPLOAD ── -->
              <div>
                <label class="block text-xs font-semibold mb-1.5" style="color:#555">Image du produit</label>

                <!-- Zone drag & drop / clic -->
                <label
                  class="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden"
                  :style="imagePreview
                    ? 'border-color:#E8192C; background:#FFF8F8; min-height:140px'
                    : 'border-color:#E5E5E5; background:#FAFAFA; min-height:120px'"
                  @dragover.prevent="dragOver = true"
                  @dragleave.prevent="dragOver = false"
                  @drop.prevent="onDrop"
                  :class="{ 'ring-2 ring-red-300': dragOver }">

                  <!-- Aperçu de l'image -->
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    alt="Aperçu"
                    class="w-full object-cover rounded-xl"
                    style="max-height:180px" />

                  <!-- Placeholder (pas d'image) -->
                  <div v-else class="flex flex-col items-center gap-1.5 py-6 px-4 text-center">
                    <span class="text-3xl">🖼️</span>
                    <span class="text-xs font-semibold" style="color:#555">
                      Glisser une image ici ou <span style="color:#E8192C">parcourir</span>
                    </span>
                    <span class="text-xs" style="color:#BBB">PNG, JPG, WEBP — max 2 Mo</span>
                  </div>

                  <!-- Overlay hover si image déjà présente -->
                  <div v-if="imagePreview"
                       class="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl"
                       style="background:rgba(0,0,0,0.35)">
                    <span class="text-white text-xs font-semibold">🔄 Changer l'image</span>
                  </div>

                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    class="hidden"
                    @change="onFileChange" />
                </label>

                <!-- Bouton supprimer l'image -->
                <button
                  v-if="imagePreview"
                  @click.prevent="clearImage"
                  class="mt-2 flex items-center gap-1 text-xs font-semibold transition-colors"
                  style="color:#E8192C">
                  ✕ Supprimer l'image
                </button>

                <!-- Erreur taille fichier -->
                <p v-if="imageError" class="mt-1.5 text-xs" style="color:#E8192C">{{ imageError }}</p>
              </div>
              <!-- ── FIN IMAGE UPLOAD ── -->

              <!-- Checkboxes -->
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

const restStore = useRestaurantStore()

const categories = ref([])
const loading = ref(true)
const openCats = ref([])

// ── ITEM FORM ─────────────────────────────────────
const showItemForm = ref(false)
const editingItem = ref(null)
const savingItem = ref(false)
const itemFormError = ref('')

const itemForm = ref(emptyItemForm())

// ── IMAGE ─────────────────────────────────────────
const fileInputRef = ref(null)
const imageFile = ref(null)
const imagePreview = ref('')
const imageError = ref('')
const dragOver = ref(false)

const MAX_SIZE_MB = 2

function emptyItemForm(categoryId = '') {
  return {
    category_id: categoryId,
    name: '',
    description: '',
    price: '',
    is_available: true,
    is_popular: false,
  }
}

// ── CATEGORY FORM ─────────────────────────────────
const showCatForm = ref(false)
const editingCat = ref(null)
const savingCat = ref(false)
const catFormError = ref('')

const catForm = ref({
  name: '',
  sort_order: ''
})

// ── DELETE ────────────────────────────────────────
const deleteTarget = ref(null)

// ── HELPERS ───────────────────────────────────────
function getRestaurantId() {
  return (
    restStore.restaurant?.id ||
    restStore.menu?.restaurant_id ||
    localStorage.getItem('restaurant_id') ||
    1
  )
}

function getImageUrl(path) {
  if (!path) return ''

  if (
    path.startsWith('http') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  return `http://localhost:8000/storage/${path}`
}

// ── IMAGE HANDLERS ────────────────────────────────
function applyFile(file) {

  imageError.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
    imageError.value =
      'Fichier non supporté. Utilisez PNG, JPG ou WEBP.'
    return
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    imageError.value =
      `L'image dépasse ${MAX_SIZE_MB} Mo.`
    return
  }

  imageFile.value = file

  if (imagePreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }

  imagePreview.value = URL.createObjectURL(file)
}

function onFileChange(e) {
  applyFile(e.target.files[0])
}

function onDrop(e) {
  dragOver.value = false
  applyFile(e.dataTransfer.files[0])
}

function clearImage() {

  if (imagePreview.value?.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value)
  }

  imageFile.value = null
  imagePreview.value = ''
  imageError.value = ''

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// ── LOAD ──────────────────────────────────────────
async function load() {

  loading.value = true

  try {

    const restaurantId = getRestaurantId()

    console.log('Restaurant ID chargé :', restaurantId)

    const [catsRes, itemsRes] = await Promise.all([
      adminService.getCategories(restaurantId),
      adminService.getMenuItems(restaurantId),
    ])

    const cats =
      catsRes.data.data || catsRes.data || []

    const allItems =
      itemsRes.data.data || itemsRes.data || []

    categories.value = cats.map(cat => ({
      ...cat,

      menu_items: allItems
        .filter(
          item => item.category_id === cat.id
        )
        .sort(
          (a, b) =>
            Number(b.is_popular) -
            Number(a.is_popular)
        )
    }))

    openCats.value =
      categories.value.map(cat => cat.id)

  } catch (error) {

    console.error(
      'Erreur chargement menu :',
      error
    )

  } finally {

    loading.value = false
  }
}

onMounted(load)

// ── TOGGLE CATEGORY ───────────────────────────────
function toggleCat(id) {

  const idx = openCats.value.indexOf(id)

  if (idx === -1) {
    openCats.value.push(id)
  } else {
    openCats.value.splice(idx, 1)
  }
}

// ── STOCK ─────────────────────────────────────────
async function toggleStock(item) {

  try {

    const { data } =
      await adminService.toggleStock(item.id)

    item.is_available = data.is_available

  } catch (e) {

    console.error(e)

    alert(
      'Erreur lors de la mise à jour du stock.'
    )
  }
}

// ── OPEN ADD ITEM ─────────────────────────────────
function openAddItem(categoryId = '') {

  editingItem.value = null

  itemForm.value = emptyItemForm(categoryId)

  itemFormError.value = ''

  clearImage()

  showItemForm.value = true
}

// ── OPEN EDIT ITEM ────────────────────────────────
function openEditItem(item) {

  editingItem.value = item

  itemForm.value = {
    category_id: item.category_id,
    name: item.name,
    description: item.description || '',
    price: item.price,
    is_available: item.is_available,
    is_popular: item.is_popular,
  }

  itemFormError.value = ''

  imageFile.value = null
  imageError.value = ''

  imagePreview.value =
    item.image
      ? getImageUrl(item.image)
      : ''

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }

  showItemForm.value = true
}

// ── SAVE ITEM ─────────────────────────────────────
async function saveItem() {

  itemFormError.value = ''

  if (
    !itemForm.value.name ||
    !itemForm.value.price ||
    !itemForm.value.category_id
  ) {
    itemFormError.value =
      'Nom, prix et catégorie sont obligatoires.'
    return
  }

  const restaurantId = getRestaurantId()

  savingItem.value = true

  try {

    const payload = new FormData()

    payload.append('restaurant_id', restaurantId)
    payload.append('category_id', itemForm.value.category_id)
    payload.append('name', itemForm.value.name)
    payload.append('description', itemForm.value.description || '')
    payload.append('price', Number(itemForm.value.price))
    payload.append('is_available', itemForm.value.is_available ? 1 : 0)
    payload.append('is_popular', itemForm.value.is_popular ? 1 : 0)

    if (imageFile.value instanceof File) {
      payload.append('image', imageFile.value, imageFile.value.name)
    }

    if (editingItem.value) {
      payload.append('_method', 'PUT')
    }

    const response = editingItem.value
      ? await adminService.updateMenuItem(editingItem.value.id, payload)
      : await adminService.createMenuItem(payload)

    await load()

    showItemForm.value = false
    clearImage()

  } catch (e) {

    console.error(e)

    itemFormError.value =
      e.response?.data?.message ||
      Object.values(e.response?.data?.errors || {}).flat().join(' | ')
  }

  finally {
    savingItem.value = false
  }
}

// ── DELETE ITEM ───────────────────────────────────
function confirmDeleteItem(item) {

  deleteTarget.value = {
    type: 'item',
    id: item.id,
    name: item.name,
    category_id: item.category_id
  }
}

// ── CATEGORY CRUD ─────────────────────────────────
function openAddCategory() {

  editingCat.value = null

  catForm.value = {
    name: '',
    sort_order:
      categories.value.length + 1
  }

  catFormError.value = ''

  showCatForm.value = true
}

function openEditCategory(cat) {

  editingCat.value = cat

  catForm.value = {
    name: cat.name,
    sort_order: cat.sort_order
  }

  catFormError.value = ''

  showCatForm.value = true
}

async function saveCategory() {

  catFormError.value = ''

  if (!catForm.value.name) {
    catFormError.value =
      'Le nom est obligatoire.'
    return
  }

  savingCat.value = true

  try {

    const payload = {
      name: catForm.value.name,

      sort_order:
        Number(catForm.value.sort_order) || 0,

      restaurant_id:
        getRestaurantId(),
    }

    if (editingCat.value) {

      const response =
        await adminService.updateCategory(
          editingCat.value.id,
          payload
        )

      const data =
        response.data.data || response.data

      const idx =
        categories.value.findIndex(
          c => c.id === data.id
        )

      if (idx !== -1) {
        categories.value[idx] = {
          ...categories.value[idx],
          ...data
        }
      }

    } else {

      await adminService.createCategory(
        payload
      )

      await load()
    }

    showCatForm.value = false

  } catch (e) {

    console.error(e)

    catFormError.value =
      e.response?.data?.message ||
      'Erreur lors de l’enregistrement.'

  } finally {

    savingCat.value = false
  }
}

// ── DELETE CATEGORY ───────────────────────────────
function confirmDeleteCategory(cat) {

  deleteTarget.value = {
    type: 'category',
    id: cat.id,
    name: cat.name
  }
}

// ── EXECUTE DELETE ────────────────────────────────
async function executeDelete() {

  if (!deleteTarget.value) return

  try {

    if (
      deleteTarget.value.type === 'item'
    ) {

      await adminService.deleteMenuItem(
        deleteTarget.value.id
      )

      const cat =
        categories.value.find(
          c =>
            c.id ===
            deleteTarget.value.category_id
        )

      if (cat) {
        cat.menu_items =
          cat.menu_items.filter(
            i =>
              i.id !==
              deleteTarget.value.id
          )
      }

    } else {

      await adminService.deleteCategory(
        deleteTarget.value.id
      )

      categories.value =
        categories.value.filter(
          c =>
            c.id !==
            deleteTarget.value.id
        )
    }

    deleteTarget.value = null

  } catch (e) {

    console.error(e)

    alert(
      e.response?.data?.message ||
      'Erreur lors de la suppression.'
    )

    deleteTarget.value = null
  }
}
</script>