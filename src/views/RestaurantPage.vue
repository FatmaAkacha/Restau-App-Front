<template>
  <div class="min-h-screen" style="background:#F7F7F7">

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center h-screen">
      <div class="w-10 h-10 border-4 rounded-full animate-spin"
           style="border-color:#E8192C; border-top-color:transparent" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error"
         class="flex items-center justify-center h-screen text-sm font-medium"
         style="color:#E8192C">
      {{ store.error }}
    </div>

    <template v-else-if="store.restaurant">
      <RestaurantHero :restaurant="store.restaurant" />

      <div class="max-w-6xl mx-auto px-4 pb-32 lg:flex lg:gap-8 lg:items-start">

        <!-- Left: menu list -->
        <div class="flex-1 min-w-0">

          <!-- Sticky scrollable category nav -->
          <CategoryNav :categories="store.restaurant.categories" />

          <!-- Category sections — each has scroll-margin-top so title
               is never hidden under the sticky nav (58px nav + 6px buffer) -->
          <div
            v-for="cat in store.restaurant.categories"
            :key="cat.id"
            :id="`cat-${cat.id}`"
            class="mb-12 pt-2"
            style="scroll-margin-top: 66px"
          >
            <!-- Category title -->
            <h2 class="text-lg font-extrabold mb-4 flex items-center gap-2"
                style="color:#1A1A1A">
              <span class="w-1 h-5 rounded-full inline-block"
                    style="background:#E8192C" />
              {{ cat.name }}
            </h2>

            <!-- Products grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MenuItemCard
                v-for="item in cat.menu_items"
                :key="item.id"
                :item="item"
                @add="cartStore.addItem(item)"
              />
            </div>
          </div>

        </div>

        <!-- Right: sticky cart (desktop only) -->
        <div class="hidden lg:block w-80 flex-shrink-0 sticky top-16">
          <CartSidebar />
        </div>
      </div>

      <!-- Mobile cart bar -->
      <MobileCartBar />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { useCartStore }       from '@/stores/cartStore'
import RestaurantHero  from '@/components/RestaurantHero.vue'
import CategoryNav     from '@/components/CategoryNav.vue'
import MenuItemCard    from '@/components/MenuItemCard.vue'
import CartSidebar     from '@/components/CartSidebar.vue'
import MobileCartBar   from '@/components/MobileCartBar.vue'

const store     = useRestaurantStore()
const cartStore = useCartStore()

onMounted(() => store.fetchMenu(1))
</script>
