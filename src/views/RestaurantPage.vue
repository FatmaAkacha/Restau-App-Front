<template>
  <div class="min-h-screen" style="background:#F7F7F7">

    <div v-if="store.loading" class="max-w-6xl mx-auto px-4 pt-4 pb-32 lg:flex lg:gap-8">
      <!-- Main skeleton -->
      <div class="flex-1 min-w-0 animate-pulse">
        <div class="flex items-center gap-4 py-4 mb-2" style="border-bottom:1px solid #E5E5E5">
          <div class="w-20 h-20 rounded-full bg-gray-200 flex-shrink-0" />
          <div class="space-y-2">
            <div class="h-6 w-40 rounded-lg bg-gray-200" />
            <div class="h-3 w-56 rounded bg-gray-100" />
          </div>
        </div>

        <div class="h-9 rounded-xl bg-gray-100 my-4" />

        <div class="flex gap-2 mb-6">
          <div v-for="i in 5" :key="i" class="h-8 w-20 rounded-full bg-gray-100" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="i in 8"
            :key="i"
            class="rounded-2xl bg-white border p-3 flex gap-3"
            style="border-color:#F0F0F0"
          >
            <div class="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0" />
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 w-3/4 rounded bg-gray-100" />
              <div class="h-3 w-full rounded bg-gray-50" />
              <div class="h-3 w-1/2 rounded bg-gray-50" />
            </div>
          </div>
        </div>
      </div>

      <!-- Cart skeleton -->
      <div class="hidden lg:block w-80 flex-shrink-0">
        <div
          class="rounded-2xl bg-white border p-4 animate-pulse"
          style="border-color:#F0F0F0"
        >
          <div class="h-5 w-32 rounded bg-gray-100 mb-4" />
          <div class="h-24 rounded-xl bg-gray-50" />
        </div>
      </div>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="store.error"
      class="flex items-center justify-center h-screen text-sm font-medium"
      style="color:#E8192C"
    >
      {{ store.error }}
    </div>

    <!-- CONTENT -->
    <template v-else-if="store.restaurant">

      <RestaurantHero :restaurant="store.restaurant" />

      <div class="max-w-6xl mx-auto lg:flex lg:gap-8 lg:items-start">

        <!-- LEFT -->
        <div class="flex-1 min-w-0">

          <!-- SEARCH -->
          <div
            class="sticky top-0 z-30 -mx-4 px-4 py-2"
            style="background:#F7F7F7; border-bottom:1px solid #E5E5E5"
          >
            <div class="relative">

              <svg
                class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                style="color:#AAA"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>

              <input
                v-model="search"
                type="text"
                placeholder="Rechercher"
                class="w-full rounded-xl pl-8 pr-8 py-2 text-xs transition-all"
                style="background:#fff; border:1.5px solid #E5E5E5; color:#1A1A1A; outline:none"
                @focus="e => e.target.style.borderColor='#E8192C'"
                @blur="e => e.target.style.borderColor='#E5E5E5'"
              />

              <button
                v-if="search"
                @click="search = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                style="background:#E5E5E5; color:#555"
              >
                ✕
              </button>
            </div>

            <!-- RESULT COUNT -->
            <div v-if="search.trim()" class="mt-1.5 flex items-center gap-2">
              <span
                class="text-xs font-semibold rounded-full px-2.5 py-0.5"
                style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0"
              >
                {{ searchResults.length }}
                résultat{{ searchResults.length !== 1 ? 's' : '' }}
              </span>

              <button
                @click="search = ''"
                class="text-xs"
                style="color:#AAA"
              >
                Effacer
              </button>
            </div>
          </div>

          <!-- SEARCH RESULTS -->
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

            <!-- GROUPED RESULTS -->
            <div v-else>

              <div
                v-for="group in groupedResults"
                :key="group.catName"
                class="mb-8"
              >
                <h3
                  class="text-sm font-bold mb-3 flex items-center gap-2"
                  style="color:#888"
                >
                  <span
                    class="w-1 h-4 rounded-full inline-block"
                    style="background:#E8192C"
                  />
                  {{ group.catName }}
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MenuItemCard
                    v-for="item in group.items"
                    :key="item.id"
                    :item="item"
                    @add="cartStore.addItem($event)"
                  />
                </div>

              </div>

            </div>
          </div>

          <!-- NORMAL MENU -->
          <template v-else>

            <CategoryNav :categories="store.restaurant.categories" />

            <!-- POPULAR -->
            <div
              v-if="popularItems.length > 0"
              id="cat-popular"
              class="mb-12 pt-2"
              style="scroll-margin-top:66px"
            >
              <h2
                class="text-lg font-extrabold mb-4 flex items-center gap-2"
                style="color:#1A1A1A"
              >
                <span
                  class="w-1 h-5 rounded-full inline-block"
                  style="background:#E8192C"
                />
                🔥 Les plus populaires
              </h2>

              <div
                class="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible"
                style="scrollbar-width:none"
              >
                <div
                  v-for="item in popularItems"
                  :key="`pop-${item.id}`"
                  class="flex-shrink-0 w-56 sm:w-auto"
                >
                  <PopularCard
                    :item="item"
                    @add="cartStore.addItem($event)"
                  />
                </div>
              </div>
            </div>

            <!-- CATEGORIES -->
            <div
              v-for="cat in store.restaurant.categories"
              :key="cat.id"
              :id="`cat-${cat.id}`"
              class="mb-12 pt-2"
              style="scroll-margin-top:66px"
            >
              <h2
                class="text-lg font-extrabold mb-4 flex items-center gap-2"
                style="color:#1A1A1A"
              >
                <span
                  class="w-1 h-5 rounded-full inline-block"
                  style="background:#E8192C"
                />
                {{ cat.name }}
              </h2>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MenuItemCard
                  v-for="item in cat.menu_items"
                  :key="item.id"
                  :item="item"
                  @add="cartStore.addItem($event)"
                />
              </div>
            </div>

            <!-- GOOGLE REVIEWS -->
            <div id="section-reviews" class="relative py-6 mb-2" style="scroll-margin-top:96px">
              <div class="absolute inset-0 flex items-center">
                <div
                  class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                />
              </div>

              <div class="relative flex justify-center">
                <div
                  class="px-5 py-2 rounded-full text-xs font-bold tracking-widest shadow-sm"
                  style="background:#fff; color:#E8192C; border:1px solid #F1F1F1"
                >
                  GOOGLE REVIEWS
                </div>
              </div>
            </div>

            <div class="relative mb-16">

              <div
                class="absolute inset-0 rounded-[40px] opacity-40 blur-3xl pointer-events-none"
                style="background:linear-gradient(135deg,#FFF0F1,#FFFFFF)"
              />

              <div
                class="relative bg-white/70 backdrop-blur-sm rounded-[32px] p-5 md:p-8 border shadow-sm"
                style="border-color:#EFEFEF"
              >
                <GoogleReviews :restaurantId="store.restaurant?.id || 1" />
              </div>
            </div>

            <!-- LOCATION -->
            <div style="scroll-margin-top:96px">
            <RestaurantLocation
              address="22 Rue de la Défense Passive, 14000 Caen"
              phone="+33 2 59 16 04 30"
              mapUrl="https://www.google.com/maps?q=22+Rue+de+la+Défense+Passive,+14000+Caen&output=embed"
            />
            </div>
      <!-- RÉSEAUX SOCIAUX -->
      <div
        v-if="store.restaurant?.social_media_links"
        class="flex flex-col items-center">
        <div class="flex items-center gap-3 mb-5">
          <span class="w-8 h-px bg-gray-300"></span>
          <span
            class="text-sm font-bold uppercase tracking-widest"
            style="color:#1A1A1A">Nous suivre</span>
          <span class="w-8 h-px bg-gray-300"></span>
        </div>

        <RestaurantSocialLinks
          :socialLinks="store.restaurant.social_media_links"
        />
      </div>


          </template>
        </div>

        <!-- RIGHT SIDEBAR -->
        <div class="hidden lg:block w-80 flex-shrink-0 sticky top-16">
          <CartSidebar />
        </div>

      </div>

      <!-- MOBILE CART -->
      <MobileCartBar />

    </template>


  <!-- FOOTER -->
  <Footer />
  </div>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import { useRestaurantStore } from '@/stores/restaurantStore'
import { useCartStore } from '@/stores/cartStore'

import RestaurantHero from '@/components/RestaurantHero.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import MenuItemCard from '@/components/MenuItemCard.vue'
import PopularCard from '@/components/PopularCard.vue'
import CartSidebar from '@/components/CartSidebar.vue'
import MobileCartBar from '@/components/MobileCartBar.vue'
import RestaurantLocation from '@/components/RestaurantLocation.vue'
import GoogleReviews from '@/components/GoogleReviews.vue'
import Footer from '@/components/Footer.vue'
import RestaurantSocialLinks from '@/components/RestaurantSocialLinks.vue'

const store = useRestaurantStore()
const cartStore = useCartStore()

const search = ref('')

/* ─────────────────────────────
   CHECKOUT NOTES
───────────────────────────── */

const checkoutNotes = ref('')
const editingNotes = ref(false)

onMounted(() => {
  store.fetchMenu()

  checkoutNotes.value =
    cartStore.checkoutNotes ||
    localStorage.getItem('checkout_notes') ||
    ''
})

function toggleNotesEdit() {
  editingNotes.value = !editingNotes.value
}

function saveCheckoutNotes() {
  cartStore.checkoutNotes = checkoutNotes.value
  localStorage.setItem('checkout_notes', checkoutNotes.value)
  editingNotes.value = false
}

watch(checkoutNotes, (val) => {
  cartStore.checkoutNotes = val
  localStorage.setItem('checkout_notes', val)
})

/* ─────────────────────────────
   MENU LOGIC
───────────────────────────── */

const popularItems = computed(() =>
  (store.restaurant?.popular_items || []).slice(0, 6)
)

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
        results.push({
          ...item,
          category_name: cat.name,
        })
      }
    }
  }

  return results
})

const groupedResults = computed(() => {
  const groups = {}

  for (const item of searchResults.value) {
    const key = item.category_name

    if (!groups[key]) {
      groups[key] = {
        catName: key,
        items: [],
      }
    }

    groups[key].items.push(item)
  }

  return Object.values(groups)
})
</script>