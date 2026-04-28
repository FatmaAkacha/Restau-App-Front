<template>
  <div class="min-h-screen" style="background:#F7F7F7">

    <div v-if="store.loading" class="flex items-center justify-center h-screen">
      <div class="w-10 h-10 border-4 rounded-full animate-spin"
           style="border-color:#E8192C; border-top-color:transparent" />
    </div>

    <div v-else-if="store.error"
         class="flex items-center justify-center h-screen text-sm font-medium"
         style="color:#E8192C">
      {{ store.error }}
    </div>

    <template v-else-if="store.restaurant">
      <RestaurantHero :restaurant="store.restaurant" />

      <div class="max-w-6xl mx-auto px-4 pb-32 lg:flex lg:gap-8 lg:items-start">
        <div class="flex-1 min-w-0">

          <!-- ── SEARCH BAR ── -->
          <div class="sticky top-0 z-30 -mx-4 px-4 py-2"
               style="background:#F7F7F7; border-bottom:1px solid #E5E5E5">
            <div class="relative">
              <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                   style="color:#AAA" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
              <input
                v-model="search"
                type="text"
                placeholder="Rechercher…"
                class="w-full rounded-xl pl-8 pr-8 py-2 text-xs transition-all"
                style="background:#fff; border:1.5px solid #E5E5E5; color:#1A1A1A; outline:none"
                @focus="e => e.target.style.borderColor='#E8192C'"
                @blur="e => e.target.style.borderColor='#E5E5E5'"
              />
              <button v-if="search"
                      @click="search = ''"
                      class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full
                             flex items-center justify-center text-xs font-bold"
                      style="background:#E5E5E5; color:#555">
                ✕
              </button>
            </div>
            <!-- Result count -->
            <div v-if="search.trim()" class="mt-1.5 flex items-center gap-2">
              <span class="text-xs font-semibold rounded-full px-2.5 py-0.5"
                    style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                {{ searchResults.length }} résultat{{ searchResults.length !== 1 ? 's' : '' }}
              </span>
              <button @click="search = ''" class="text-xs" style="color:#AAA">Effacer</button>
            </div>
          </div>

          <!-- ── SEARCH RESULTS ── -->
          <div v-if="search.trim()" class="mt-4">
            <div v-if="searchResults.length === 0" class="text-center py-16">
              <div class="text-5xl mb-3 opacity-30">🔍</div>
              <p class="text-sm font-medium" style="color:#888">
                Aucun résultat pour "{{ search }}"
              </p>
              <p class="text-xs mt-1" style="color:#AAA">
                Essayez un autre nom de produit ou de catégorie
              </p>
            </div>

            <!-- Group results by category -->
            <div v-else>
              <div v-for="group in groupedResults" :key="group.catName" class="mb-8">
                <h3 class="text-sm font-bold mb-3 flex items-center gap-2" style="color:#888">
                  <span class="w-1 h-4 rounded-full inline-block" style="background:#E8192C" />
                  {{ group.catName }}
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MenuItemCard
                    v-for="item in group.items"
                    :key="item.id"
                    :item="item"
                    @add="cartStore.addItem(item)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- ── NORMAL MENU ── -->
          <template v-else>
            <CategoryNav :categories="store.restaurant.categories" />

            <!-- Populaires -->
            <div v-if="popularItems.length > 0"
                 id="cat-popular" class="mb-12 pt-2" style="scroll-margin-top:66px">
              <h2 class="text-lg font-extrabold mb-4 flex items-center gap-2" style="color:#1A1A1A">
                <span class="w-1 h-5 rounded-full inline-block" style="background:#E8192C" />
                🔥 Les plus populaires
              </h2>
              <div class="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible"
                   style="scrollbar-width:none">
                <div v-for="item in popularItems" :key="`pop-${item.id}`"
                     class="flex-shrink-0 w-56 sm:w-auto">
                  <PopularCard :item="item" @add="cartStore.addItem(item)" />
                </div>
              </div>
            </div>

            <!-- All categories -->
            <div v-for="cat in store.restaurant.categories" :key="cat.id"
                 :id="`cat-${cat.id}`" class="mb-12 pt-2" style="scroll-margin-top:66px">
              <h2 class="text-lg font-extrabold mb-4 flex items-center gap-2" style="color:#1A1A1A">
                <span class="w-1 h-5 rounded-full inline-block" style="background:#E8192C" />
                {{ cat.name }}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MenuItemCard
                  v-for="item in cat.menu_items" :key="item.id"
                  :item="item" @add="cartStore.addItem(item)"
                />
              </div>
            </div>
          </template>

        </div>

        <div class="hidden lg:block w-80 flex-shrink-0 sticky top-16">
          <CartSidebar />
        </div>
      </div>

      <MobileCartBar />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { useCartStore }       from '@/stores/cartStore'
import RestaurantHero  from '@/components/RestaurantHero.vue'
import CategoryNav     from '@/components/CategoryNav.vue'
import MenuItemCard    from '@/components/MenuItemCard.vue'
import PopularCard     from '@/components/PopularCard.vue'
import CartSidebar     from '@/components/CartSidebar.vue'
import MobileCartBar   from '@/components/MobileCartBar.vue'

const store     = useRestaurantStore()
const cartStore = useCartStore()
const search    = ref('')

// Max 6 popular items
const popularItems = computed(() =>
  (store.restaurant?.popular_items || []).slice(0, 6)
)

// Search by product name, description AND category name
const searchResults = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return []
  const results = []
  for (const cat of store.restaurant?.categories || []) {
    const catMatch = cat.name.toLowerCase().includes(q)
    for (const item of cat.menu_items || []) {
      if (
        catMatch ||
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      ) {
        results.push({ ...item, category_name: cat.name })
      }
    }
  }
  return results
})

// Group search results by category for better readability
const groupedResults = computed(() => {
  const groups = {}
  for (const item of searchResults.value) {
    const key = item.category_name
    if (!groups[key]) groups[key] = { catName: key, items: [] }
    groups[key].items.push(item)
  }
  return Object.values(groups)
})

onMounted(() => store.fetchMenu())
</script>
