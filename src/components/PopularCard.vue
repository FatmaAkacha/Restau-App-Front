<template>
  <div>
    <div class="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200
                hover:shadow-md active:scale-95"
         style="background:#fff; border:1px solid #E5E5E5"
         @click="handleClick">

      <!-- Image area -->
      <div class="h-28 relative overflow-hidden"
           style="background:linear-gradient(135deg,#FFF0F1,#FFE4E6)">
        <img v-if="item.image"
             :src="`/images/menu/${item.image}`"
             :alt="item.name"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             @error="e => e.target.style.display='none'" />
        <div class="w-full h-full flex items-center justify-center text-5xl absolute inset-0"
             :class="item.image ? 'z-[-1]' : ''">
          {{ emoji }}
        </div>
        <!-- Popular badge -->
        <div class="absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full"
             style="background:#E8192C">
          🔥 Populaire
        </div>
        <!-- À composer badge -->
        <div v-if="item.customization_options?.length"
             class="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
             style="background:#2563EB; color:#fff">
          ✏️ À composer
        </div>
        <!-- + button -->
        <button
          class="absolute bottom-2 right-2 w-8 h-8 rounded-full text-white font-bold text-lg
                 flex items-center justify-center shadow transition-all duration-200
                 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
          style="background:#E8192C"
          @click.stop="handleClick">
          +
        </button>
      </div>

      <!-- Info -->
      <div class="p-3">
        <h3 class="font-bold text-sm leading-snug" style="color:#1A1A1A">{{ item.name }}</h3>
        <p class="text-xs mt-0.5 line-clamp-1" style="color:#888">{{ item.description }}</p>
        <div class="flex items-center justify-between mt-2">
          <span class="font-extrabold text-sm" style="color:#E8192C">
            €{{ item.price.toFixed(2) }}
          </span>
          <span v-if="item.category?.name || item.category_name"
                class="text-xs rounded-full px-2 py-0.5"
                style="background:#F7F7F7; color:#888">
            {{ item.category?.name || item.category_name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Customization modal -->
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

const emoji = computed(() => {
  const name = (props.item.category?.name || props.item.category_name || '').toLowerCase()
  if (name.includes('pizza'))    return '🍕'
  if (name.includes('tacos') || name.includes('sandwich') || name.includes('composer')) return '🌮'
  if (name.includes('gratin'))   return '🧀'
  if (name.includes('tex'))      return '🍟'
  if (name.includes('dessert'))  return '🍰'
  if (name.includes('boisson'))  return '🥤'
  if (name.includes('enfant'))   return '🍗'
  return '🍽️'
})
</script>
