<template>
  <nav ref="navRef"
       class="sticky top-0 z-20 -mx-4 px-4"
       style="background:#fff; border-bottom:2px solid #E5E5E5;">
    <div ref="scrollRef"
         class="flex gap-2 overflow-x-auto py-3"
         style="scrollbar-width:none; -ms-overflow-style:none;">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :ref="el => { if (el) btnRefs[cat.id] = el }"
        @click="scrollTo(cat.id)"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold
               transition-all duration-200 border whitespace-nowrap"
        :style="active === cat.id
          ? 'background:#E8192C; color:#fff; border-color:#E8192C; box-shadow:0 2px 8px rgba(232,25,44,0.3)'
          : 'background:#fff; color:#888; border-color:#E5E5E5'"
      >
        {{ cat.name }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props   = defineProps({ categories: Array })
const active  = ref(props.categories?.[0]?.id)
const navRef  = ref(null)
const scrollRef = ref(null)
const btnRefs = ref({})

// Scroll offset = nav height (~52px) + a little buffer
const OFFSET = 58

// ── Click: scroll page to category ──────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(`cat-${id}`)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

// ── Auto-scroll the nav pill into view when active changes ──────────────────
watch(active, (id) => {
  nextTick(() => {
    const btn = btnRefs.value[id]
    if (btn && scrollRef.value) {
      // Scroll the nav bar horizontally so the active button is visible
      const navLeft   = scrollRef.value.getBoundingClientRect().left
      const btnLeft   = btn.getBoundingClientRect().left
      const btnWidth  = btn.offsetWidth
      const navWidth  = scrollRef.value.offsetWidth
      const scrollLeft = scrollRef.value.scrollLeft
      const target = scrollLeft + (btnLeft - navLeft) - navWidth / 2 + btnWidth / 2
      scrollRef.value.scrollTo({ left: target, behavior: 'smooth' })
    }
  })
})

// ── IntersectionObserver: detect which section is in view ───────────────────
let observer = null

function setupObserver() {
  if (observer) observer.disconnect()

  // We track ALL sections. When scrolling down, the topmost intersecting
  // section wins. For bottom sections (Desserts, Boissons) we use a
  // generous bottom margin so they trigger even if they don't fill the screen.
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.id.replace('cat-', ''))
          // Only update if this section is near the top
          if (entry.boundingClientRect.top <= OFFSET + 80) {
            active.value = id
          }
        }
      })
    },
    {
      rootMargin: `-${OFFSET}px 0px -20% 0px`,
      threshold: [0, 0.1, 0.5],
    }
  )

  props.categories.forEach(cat => {
    const el = document.getElementById(`cat-${cat.id}`)
    if (el) observer.observe(el)
  })
}

// ── Fallback scroll listener for last categories ────────────────────────────
function onScroll() {
  const scrollY   = window.scrollY + OFFSET + 10
  const pageBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 10

  // If at the very bottom of the page → activate last category
  if (pageBottom) {
    const last = props.categories[props.categories.length - 1]
    if (last && active.value !== last.id) active.value = last.id
    return
  }

  // Otherwise find the last category whose top is above the fold
  let current = props.categories[0]?.id
  for (const cat of props.categories) {
    const el = document.getElementById(`cat-${cat.id}`)
    if (!el) continue
    const top = el.getBoundingClientRect().top + window.scrollY
    if (top <= scrollY) current = cat.id
  }

  if (current !== active.value) active.value = current
}

onMounted(() => {
  nextTick(setupObserver)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', onScroll)
})
</script>
