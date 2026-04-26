<template>
  <div class="card flex gap-3 p-3 cursor-pointer hover:shadow-md transition-shadow group"
       @click="$emit('add')">
    <!-- Text -->
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-sm leading-snug">{{ item.name }}</h3>
      <p class="text-gray-500 text-xs mt-1 line-clamp-2">{{ item.description }}</p>

      <div class="flex items-center gap-3 mt-2">
        <span class="font-bold text-sm">€{{ item.price.toFixed(2) }}</span>
        <span v-if="item.calories" class="text-xs text-gray-400">{{ item.calories }} cal</span>
        <span v-if="item.is_popular"
              class="text-xs bg-orange-100 text-orange-600 font-medium px-2 py-0.5 rounded-full">
          Populaire
        </span>
      </div>
    </div>

    <!-- Image + add button -->
    <div class="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-brand-gray">
      <img v-if="item.image"
           :src="`/storage/${item.image}`"
           :alt="item.name"
           class="w-full h-full object-cover" />
      <div v-else class="w-full h-full flex items-center justify-center text-3xl">🍽️</div>

      <!-- + button -->
      <button
        class="absolute bottom-1 right-1 w-7 h-7 bg-brand-dark text-white rounded-full
               flex items-center justify-center text-lg font-bold shadow
               opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="$emit('add')"
      >+</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object })
defineEmits(['add'])
</script>
