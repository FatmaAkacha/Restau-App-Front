<template>
  <div class="card flex gap-3 p-3 cursor-pointer group
              hover:border-brand-red/50 hover:shadow-red-sm transition-all duration-200"
       @click="$emit('add')">

    <!-- Text -->
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-sm text-white leading-snug">{{ item.name }}</h3>
      <p class="text-brand-muted text-xs mt-1 line-clamp-2">{{ item.description }}</p>

      <div class="flex items-center gap-2 mt-3 flex-wrap">
        <span class="font-bold text-brand-red text-sm">€{{ item.price.toFixed(2) }}</span>
        <span v-if="item.calories"
              class="text-xs text-brand-muted border border-brand-border rounded-full px-2 py-0.5">
          {{ item.calories }} cal
        </span>
        <span v-if="item.is_popular"
              class="text-xs bg-brand-red/15 text-brand-red font-semibold px-2 py-0.5 rounded-full border border-brand-red/30">
          🔥 Populaire
        </span>
      </div>
    </div>

    <!-- Image + add button -->
    <div class="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-brand-dark">
      <img v-if="item.image"
           :src="`/storage/${item.image}`"
           :alt="item.name"
           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div v-else
           class="w-full h-full flex items-center justify-center text-3xl bg-brand-dark">
        🍽️
      </div>

      <!-- + button -->
      <button
        class="absolute bottom-1.5 right-1.5 w-7 h-7 bg-brand-red text-white rounded-full
               flex items-center justify-center text-base font-bold shadow-red-sm
               opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
               transition-all duration-200"
        @click.stop="$emit('add')"
      >+</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object })
defineEmits(['add'])
</script>
