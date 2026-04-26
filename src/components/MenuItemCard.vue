<template>
  <div class="card flex gap-3 p-3 cursor-pointer group transition-all duration-200
              hover:shadow-md hover:border-red-200"
       @click="$emit('add')">

    <!-- Text -->
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-sm leading-snug" style="color:#1A1A1A">{{ item.name }}</h3>
      <p class="text-xs mt-1 line-clamp-2" style="color:#888">{{ item.description }}</p>

      <div class="flex items-center gap-2 mt-3 flex-wrap">
        <span class="font-bold text-sm" style="color:#E8192C">€{{ item.price.toFixed(2) }}</span>
        <span v-if="item.calories"
              class="text-xs rounded-full px-2 py-0.5 border"
              style="color:#888; border-color:#E5E5E5">
          {{ item.calories }} cal
        </span>
        <span v-if="item.is_popular"
              class="text-xs font-semibold px-2 py-0.5 rounded-full"
              style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
          🔥 Populaire
        </span>
      </div>
    </div>

    <!-- Image + add button -->
    <div class="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden"
         style="background:#F7F7F7">
      <img v-if="item.image"
           :src="`/storage/${item.image}`"
           :alt="item.name"
           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div v-else class="w-full h-full flex items-center justify-center text-3xl">🍽️</div>

      <!-- + button -->
      <button
        class="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full text-white
               flex items-center justify-center text-base font-bold
               opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
               transition-all duration-200"
        style="background:#E8192C; box-shadow:0 2px 8px rgba(232,25,44,0.4)"
        @click.stop="$emit('add')"
      >+</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object })
defineEmits(['add'])
</script>
