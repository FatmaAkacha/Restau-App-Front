<template>
  <nav ref="navRef"
       class="sticky z-20 -mx-4 px-4"
       style="top:44px; background:#fff; border-bottom:2px solid #E5E5E5;">
    <div ref="scrollRef"
         class="flex gap-2 overflow-x-auto py-3"
         style="scrollbar-width:none; -ms-overflow-style:none;">
      <!-- Popular pill always first -->
      <button
        @click="scrollToPopular"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold
               transition-all duration-200 border whitespace-nowrap"
        :style="active === 'popular'
          ? 'background:#E8192C; color:#fff; border-color:#E8192C; box-shadow:0 2px 8px rgba(232,25,44,0.3)'
          : 'background:#fff; color:#888; border-color:#E5E5E5'"
      >
        🔥 Populaires
      </button>
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

      <!-- Static pills for bottom sections -->
      <button
        @click="scrollToSection('section-reviews')"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold
               transition-all duration-200 border whitespace-nowrap"
        :style="active === 'reviews'
          ? 'background:#E8192C; color:#fff; border-color:#E8192C; box-shadow:0 2px 8px rgba(232,25,44,0.3)'
          : 'background:#fff; color:#888; border-color:#E5E5E5'"
      >
        ⭐ Avis Google
      </button>
      <button
        @click="scrollToSection('section-location')"
        class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold
               transition-all duration-200 border whitespace-nowrap"
        :style="active === 'location'
          ? 'background:#E8192C; color:#fff; border-color:#E8192C; box-shadow:0 2px 8px rgba(232,25,44,0.3)'
          : 'background:#fff; color:#888; border-color:#E5E5E5'"
      >
        📍 Nous trouver
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props   = defineProps({ categories: Array })
const active  = ref('popular')
const navRef  = ref(null)
const scrollRef = ref(null)
const btnRefs = ref({})

// Scroll offset = search bar (44px) + category nav (52px) = 96px total
const OFFSET = 96

// ── Click: scroll page to category ──────────────────────────────────────────
function scrollToSection(id) {
  const key = id === 'section-reviews' ? 'reviews' : 'location'
  active.value = key
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

function scrollTo(id) {
  const el = document.getElementById(`cat-${id}`)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

function scrollToPopular() {
  active.value = 'popular'
  const el = document.getElementById('cat-popular')
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
          const rawId = entry.target.id
          let id
          if (rawId === 'section-reviews')  id = 'reviews'
          else if (rawId === 'section-location') id = 'location'
          else id = parseInt(rawId.replace('cat-', ''))

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

  // Also observe the static bottom sections
  const reviewsEl  = document.getElementById('section-reviews')
  const locationEl = document.getElementById('section-location')
  if (reviewsEl)  observer.observe(reviewsEl)
  if (locationEl) observer.observe(locationEl)
}

// ── Fallback scroll listener for last categories ────────────────────────────
function onScroll() {
  const scrollY    = window.scrollY + OFFSET + 10
  const pageBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 10

  if (pageBottom) {
  const locationEl = document.getElementById('section-location')
  const reviewsEl  = document.getElementById('section-reviews')

  if (locationEl) {
    const locationTop = locationEl.getBoundingClientRect().top + window.scrollY
    if (locationTop <= scrollY) {
      active.value = 'location'
      return
    }
  }

  if (reviewsEl) {
    const reviewsTop = reviewsEl.getBoundingClientRect().top + window.scrollY
    if (reviewsTop <= scrollY) {
      active.value = 'reviews'
      return
    }
  }

  const last = props.categories[props.categories.length - 1]
  if (last) active.value = last.id

  return
}

  // Check popular section first
  const popEl = document.getElementById('cat-popular')
  let current = 'popular'

  if (popEl) {
    const popTop = popEl.getBoundingClientRect().top + window.scrollY
    if (popTop > scrollY) {
      active.value = 'popular'
      return
    }
  }

  for (const cat of props.categories) {
    const el = document.getElementById(`cat-${cat.id}`)
    if (!el) continue
    const top = el.getBoundingClientRect().top + window.scrollY
    if (top <= scrollY) current = cat.id
  }

  // Check static sections after all categories
  const reviewsEl  = document.getElementById('section-reviews')
  const locationEl = document.getElementById('section-location')
  if (reviewsEl) {
    const top = reviewsEl.getBoundingClientRect().top + window.scrollY
    if (top <= scrollY) current = 'reviews'
  }
  if (locationEl) {
    const top = locationEl.getBoundingClientRect().top + window.scrollY
    if (top <= scrollY) current = 'location'
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
