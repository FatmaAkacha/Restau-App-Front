<template>
  <div :class="['card p-5 flex items-center gap-4', bgMap[color]]">
    <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0', iconBg[color]]">
      {{ icon }}
    </div>
    <div>
      <p class="text-xs text-gray-500 font-medium">{{ label }}</p>
      <p class="text-2xl font-bold mt-0.5">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ icon: String, label: String, value: [String, Number], color: String })

const bgMap  = { yellow: '', blue: '', green: '', purple: '' }
const iconBg = {
  yellow: 'bg-yellow-100',
  blue:   'bg-blue-100',
  green:  'bg-green-100',
  purple: 'bg-purple-100',
}
</script>
