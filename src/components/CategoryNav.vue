<template>
  <nav class="sticky top-0 z-20 -mx-4 px-4 mb-6"
       style="background:#fff; border-bottom:1px solid #E5E5E5;">
    <div class="flex gap-2 overflow-x-auto py-3" style="scrollbar-width:none">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="scrollTo(cat.id)"
        :style="active === cat.id
          ? 'background:#E8192C; color:#fff; border-color:#E8192C;'
          : 'background:#fff; color:#888; border-color:#E5E5E5;'"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium
               transition-all duration-200 border hover:border-red-500 hover:text-red-600"
      >
        {{ cat.name }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props  = defineProps({ categories: Array })
const active = ref(props.categories?.[0]?.id)

// NAV_HEIGHT must match the sticky nav (~52px) + a little buffer
const NAV_HEIGHT = 64

function scrollTo(id) {
  const el = document.getElementById(`cat-${id}`)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT
  window.scrollTo({ top, behavior: 'smooth' })
}

function onScroll() {
  for (const cat of [...props.categories].reverse()) {
    const el = document.getElementById(`cat-${cat.id}`)
    if (el && el.getBoundingClientRect().top <= NAV_HEIGHT + 10) {
      active.value = cat.id
      break
    }
  }
}

onMounted(()  => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
