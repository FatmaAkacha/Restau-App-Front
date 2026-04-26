<template>
  <nav class="sticky top-0 z-20 -mx-4 px-4 mb-6"
       style="background:#fff; border-bottom:1px solid #E5E5E5;">
    <div class="flex gap-2 overflow-x-auto py-3" style="scrollbar-width:none; -ms-overflow-style:none">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="scrollTo(cat.id)"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
        :style="active === cat.id
          ? 'background:#E8192C; color:#fff; border-color:#E8192C;'
          : 'background:#fff; color:#888; border-color:#E5E5E5;'"
      >
        {{ cat.name }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props  = defineProps({ categories: Array })
const active = ref(props.categories?.[0]?.id)

// Height of the sticky nav bar in px — must match the nav height
const OFFSET = 60

function scrollTo(id) {
  const el = document.getElementById(`cat-${id}`)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - OFFSET
  window.scrollTo({ top: y, behavior: 'smooth' })
}

// Use IntersectionObserver so even bottom categories (Desserts, Boissons)
// get highlighted correctly when they enter the viewport
let observer = null

function setupObserver() {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      // Find the topmost visible section
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible.length > 0) {
        const id = parseInt(visible[0].target.id.replace('cat-', ''))
        active.value = id
      }
    },
    {
      // rootMargin: top offset accounts for sticky nav, bottom negative
      // so sections are detected as soon as they enter below the nav
      rootMargin: `-${OFFSET}px 0px -60% 0px`,
      threshold: 0,
    }
  )

  props.categories.forEach(cat => {
    const el = document.getElementById(`cat-${cat.id}`)
    if (el) observer.observe(el)
  })
}

onMounted(() => nextTick(setupObserver))
onUnmounted(() => observer?.disconnect())
</script>
