<template>
  <div class="card p-3 md:p-5 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4">
    <div class="w-10 md:w-12 h-10 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
         :style="{ background: iconBg[color] || '#F5F5F5' }">
      <!-- Use image if provided, fallback to emoji -->
      <img v-if="iconImg"
           :src="iconImg"
           :alt="label"
           class="w-6 md:w-8 h-6 md:h-8 object-contain" />
      <span v-else class="text-xl md:text-2xl">{{ icon }}</span>
    </div>
    <div class="text-center md:text-left">
      <p class="text-xs font-medium" style="color:#888">{{ label }}</p>
      <p class="text-xl md:text-2xl font-extrabold mt-0.5" style="color:#1A1A1A">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon:    String,
  iconImg: String,
  label:   String,
  value:   [String, Number],
  color:   String,
})

const iconBg = {
  yellow: '#FFFBEB',
  blue:   '#EFF6FF',
  green:  '#F0FFF4',
  purple: '#FAF5FF',
  red:    '#FFF0F1',
  gray:   '#F5F5F5',
}
</script>
