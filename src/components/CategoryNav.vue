<template>
  <nav class="sticky top-0 z-20 bg-white border-b border-brand-border -mx-4 px-4 mb-6">
    <div class="flex gap-1 overflow-x-auto scrollbar-hide py-3">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="scrollTo(cat.id)"
        :class="[
          'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
          active === cat.id
            ? 'bg-brand-dark text-white'
            : 'text-gray-600 hover:bg-brand-gray'
        ]"
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

function scrollTo(id) {
  document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
  for (const cat of [...props.categories].reverse()) {
    const el = document.getElementById(`cat-${cat.id}`)
    if (el && el.getBoundingClientRect().top <= 120) {
      active.value = cat.id
      break
    }
  }
}

onMounted(()  => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
