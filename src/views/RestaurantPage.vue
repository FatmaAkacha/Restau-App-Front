<template>
  <div class="min-h-screen bg-white">

    <!-- Loading -->
    <div v-if="store.loading" class="flex items-center justify-center h-screen">
      <div class="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="flex items-center justify-center h-screen text-red-500">
      {{ store.error }}
    </div>

    <template v-else-if="store.restaurant">
      <!-- Hero / Cover -->
      <RestaurantHero :restaurant="store.restaurant" />

      <!-- Sticky category nav + content -->
      <div class="max-w-6xl mx-auto px-4 pb-32 lg:flex lg:gap-8 lg:items-start">

        <!-- Left: menu -->
        <div class="flex-1 min-w-0">
          <CategoryNav :categories="store.restaurant.categories" />

          <div v-for="cat in store.restaurant.categories" :key="cat.id"
               :id="`cat-${cat.id}`" class="mb-10">
            <h2 class="text-xl font-bold mb-4">{{ cat.name }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MenuItemCard
                v-for="item in cat.menu_items"
                :key="item.id"
                :item="item"
                @add="cartStore.addItem(item)"
              />
            </div>
          </div>
        </div>

        <!-- Right: sticky cart -->
        <div class="hidden lg:block w-80 flex-shrink-0 sticky top-6">
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
