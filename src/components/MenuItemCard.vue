<template>
  <div>
    <!-- Card -->
    <div class="card flex gap-3 p-3 cursor-pointer group transition-all duration-200
                hover:shadow-md hover:border-red-200"
         @click="handleClick">

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
          <span v-if="item.customization_options?.length"
                class="text-xs px-2 py-0.5 rounded-full"
                style="background:#F0F7FF; color:#2563EB; border:1px solid #BFDBFE">
            ✏️ À composer
          </span>
        </div>
      </div>

      <!-- Image + add button -->
      <div class="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden"
           style="background:#F7F7F7">
        <img v-if="item.image"
             :src="getImageUrl(item.image)"
             :alt="item.name"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             @error="e => e.target.style.display='none'" />
        <div class="w-full h-full flex items-center justify-center text-3xl absolute inset-0"
             :class="item.image ? 'z-[-1]' : ''">
          {{ emoji }}
        </div>
        <button
          class="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full text-white
                 flex items-center justify-center text-base font-bold
                 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
                 transition-all duration-200"
          style="background:#E8192C; box-shadow:0 2px 8px rgba(232,25,44,0.4)"
          @click.stop="handleClick">+</button>
      </div>
    </div>

    <!-- Customization modal (Teleport to body, so no layout impact) -->
    <CustomizeModal
      :item="modalItem"
      @close="modalItem = null"
      @add="onCustomized"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CustomizeModal from '@/components/CustomizeModal.vue'

const props = defineProps({ item: Object })
const emit  = defineEmits(['add'])

const modalItem = ref(null)

function handleClick() {
  if (props.item?.customization_options?.length) {
    modalItem.value = props.item
  } else {
    emit('add', props.item)
  }
}

function onCustomized(customizedItem) {
  emit('add', customizedItem)
}

function getImageUrl(path) {
  if (!path) return ''

  // URL externe complète (déjà complète)
  if (
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path
  }

  // preview locale blob
  if (path.startsWith('blob:')) {
    return path
  }

  // image venant du storage Laravel
  if (path.startsWith('storage/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    const baseUrl = apiUrl.replace('/api', '')
    return `${baseUrl}/${path}`
  }

  // image déjà avec /storage
  if (path.startsWith('/storage/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    const baseUrl = apiUrl.replace('/api', '')
    return `${baseUrl}${path}`
  }

  // image locale frontend (fichiers dans public/images/menu)
  return `/images/menu/${path}`
}

const emoji = computed(() => {
  const n = (props.item?.name || '').toLowerCase()
  const c = (props.item?.category?.name || '').toLowerCase()
  if (n.includes('pizza') || c.includes('pizza'))                         return '🍕'
  if (n.includes('tacos') || c.includes('tacos'))                         return '🌮'
  if (n.includes('tortilla'))                                             return '🌯'
  if (n.includes('naan') || n.includes('bowl') || c.includes('sandwich')) return '🥙'
  if (n.includes('gratin') || c.includes('gratin'))                       return '🧀'
  if (n.includes('burger'))                                               return '🍔'
  if (n.includes('panini'))                                               return '🥖'
  if (n.includes('frites') || n.includes('nugget') || n.includes('tender') || c.includes('tex')) return '🍟'
  if (n.includes('tiramisu') || n.includes('tarte') || c.includes('dessert')) return '🍰'
  if (n.includes('coca') || n.includes('canette') || n.includes('boisson') || c.includes('boisson')) return '🥤'
  if (n.includes('enfant'))                                               return '🍗'
  return '🍽️'
})
</script>
