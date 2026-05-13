<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="item"
           class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
           style="background:rgba(0,0,0,0.55); backdrop-filter:blur(2px)"
           @click.self="$emit('close')">

        <div class="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
             style="background:#fff">

          <!-- Header -->
          <div class="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3"
               style="background:#fff; border-bottom:1px solid #F0F0F0">
            <div class="flex items-center gap-3">
              <!-- Item image thumbnail -->
              <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                   style="background:#F7F7F7">
                <img v-if="previewImage"
                     :src="`/images/menu/${previewImage}`"
                     :alt="item.name"
                     class="w-full h-full object-cover"
                     @error="e => e.target.style.display='none'" />
                <div v-else class="w-full h-full flex items-center justify-center text-2xl">🥙</div>
              </div>
              <div>
                <h2 class="font-bold text-base leading-tight" style="color:#1A1A1A">{{ item.name }}</h2>
                <p class="text-sm font-bold mt-0.5" style="color:#E8192C">€{{ totalPrice.toFixed(2) }}</p>
              </div>
            </div>
            <button @click="$emit('close')"
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style="background:#F0F0F0; color:#555">✕</button>
          </div>

          <!-- Option groups -->
          <div class="px-5 py-4 space-y-6">
            <div v-for="group in item.customization_options" :key="group.group">

              <!-- Group title -->
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-bold text-sm" style="color:#1A1A1A">{{ group.label }}</h3>
                <div class="flex items-center gap-1.5">
                  <span v-if="group.required"
                        class="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style="background:#FFF0F1; color:#E8192C; border:1px solid #FFCDD0">
                    Obligatoire
                  </span>
                  <span v-if="group.max > 1"
                        class="text-xs px-2 py-0.5 rounded-full"
                        style="background:#F0F0F0; color:#888">
                    Max {{ group.max }}
                  </span>
                  <span v-if="group.price_each"
                        class="text-xs px-2 py-0.5 rounded-full"
                        style="background:#F0FFF4; color:#16a34a">
                    +€{{ group.price_each.toFixed(2) }} / choix
                  </span>
                </div>
              </div>

              <!-- Choices grid -->
              <div :class="group.group === 'viande'
                ? 'grid grid-cols-3 sm:grid-cols-4 gap-2'
                : 'flex flex-wrap gap-2'">

                <!-- Viande — image cards with emoji fallback -->
                <template v-if="group.group === 'viande'">
                  <button v-for="choice in group.choices" :key="choice.key"
                          @click="toggleChoice(group, choice)"
                          class="relative rounded-2xl border-2 p-2.5 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                          :style="isSelected(group, choice)
                            ? 'border-color:#E8192C; background:#FFF0F1'
                            : 'border-color:#E5E5E5; background:#FAFAFA'">

                    <!-- Image or colored emoji tile -->
                    <div class="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0"
                         :style="isSelected(group, choice)
                           ? 'background:linear-gradient(135deg,#FFF0F1,#FFD6D9)'
                           : 'background:linear-gradient(135deg,#F5F5F5,#EBEBEB)'">
                      <img v-if="choice.image"
                           :src="`/images/menu/${choice.image}`"
                           :alt="choice.label"
                           class="w-full h-full"
                           :class="choice.key === 'merguez'
                             ? 'object-contain p-1.5 scale-75'
                             : ['tenders','nuggets'].includes(choice.key)
                               ? 'object-contain p-2 scale-90'
                               : 'object-cover'"
                           @error="e => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex' }" />
                      <div class="w-full h-full absolute inset-0 items-center justify-center text-2xl"
                           :style="choice.image ? 'display:none' : 'display:flex'">
                        {{ viandEmoji(choice.key) }}
                      </div>
                    </div>

                    <!-- Label -->
                    <span class="text-xs font-semibold text-center leading-tight w-full"
                          :style="isSelected(group, choice) ? 'color:#E8192C' : 'color:#444'">
                      {{ choice.label }}
                    </span>

                    <!-- Selected checkmark -->
                    <div v-if="isSelected(group, choice)"
                         class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow"
                         style="background:#E8192C; position:absolute">✓</div>
                  </button>
                </template>

                <!-- Sauce / Extra — pill chips -->
                <template v-else>
                  <button v-for="choice in group.choices" :key="choice.key"
                          @click="toggleChoice(group, choice)"
                          class="px-3 py-2 rounded-full border text-sm font-semibold transition-all"
                          :style="isSelected(group, choice)
                            ? 'border-color:#E8192C; background:#FFF0F1; color:#E8192C'
                            : 'border-color:#E5E5E5; background:#fff; color:#555'">
                    {{ choice.label }}
                    <span v-if="group.price_each && isSelected(group, choice)"
                          class="ml-1 text-xs opacity-70">+€{{ group.price_each.toFixed(2) }}</span>
                  </button>
                </template>

              </div>

              <!-- Validation hint -->
              <p v-if="group.required && !hasSelection(group)"
                 class="text-xs mt-2" style="color:#E8192C">
                ⚠ Veuillez choisir {{ group.max > 1 ? `jusqu'à ${group.max} options` : 'une option' }}
              </p>
            </div>

            
          </div>

          <!-- Footer CTA -->
          <div class="sticky bottom-0 px-5 pb-6 pt-3"
               style="background:#fff; border-top:1px solid #F0F0F0">
            <button @click="confirm"
                    :disabled="!canConfirm"
                    class="w-full py-4 rounded-2xl text-white font-bold text-base transition-all"
                    :style="canConfirm
                      ? 'background:linear-gradient(135deg,#E8192C,#A50E1C); box-shadow:0 4px 15px rgba(232,25,44,0.3)'
                      : 'background:#E5E5E5; color:#AAA; cursor:not-allowed'">
              Ajouter au panier · €{{ totalPrice.toFixed(2) }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['close', 'add'])

// ── State ──────────────────────────────────────────────────────────────
const selections = ref({})
const notes = ref('')

// Reset when modal item changes
watch(() => props.item, () => {
  selections.value = {}
  notes.value = ''
})

// ── Emoji fallback ─────────────────────────────────────────────────────
function viandEmoji(key) {
  const map = {
    tandoori: '🍗',
    curry: '🍛',
    oriental: '🥙',
    kefta: '🥩',
    merguez: '🌭',
    steak: '🥩',
    escalope: '🍖',
    cordon: '🧀',
    tenders: '🍗',
    nuggets: '🍗',
    falafel: '🧆',
  }

  return map[key] || '🥩'
}

// ── Auto images for viande options ────────────────────────────────────
function viandeImage(choice) {
  const images = {
    cordon: 'codonbleu_option.jpg',
    escalope: 'escalope_option.png',
    nuggets: 'nuggets_option.png',
    tenders: 'tenders_option.png',
  }

  return choice.image || images[choice.key] || null
}

// ── Helpers ────────────────────────────────────────────────────────────
function isSelected(group, choice) {
  return (selections.value[group.group] || []).includes(choice.key)
}

function hasSelection(group) {
  return (selections.value[group.group] || []).length > 0
}

function toggleChoice(group, choice) {
  const current = selections.value[group.group] || []
  const idx = current.indexOf(choice.key)

  if (idx !== -1) {
    selections.value[group.group] = current.filter(k => k !== choice.key)
  } else {
    if (group.max === 1) {
      selections.value[group.group] = [choice.key]
    } else if (current.length < group.max) {
      selections.value[group.group] = [...current, choice.key]
    }
  }
}

// ── Preview image ──────────────────────────────────────────────────────
const previewImage = computed(() => {
  const viande = props.item?.customization_options?.find(
    g => g.group === 'viande'
  )

  if (viande) {
    const selectedKey = (selections.value['viande'] || [])[0]
    const choice = viande.choices.find(c => c.key === selectedKey)

    if (choice) {
      return viandeImage(choice)
    }
  }

  return props.item?.image || null
})

// ── Price ──────────────────────────────────────────────────────────────
const totalPrice = computed(() => {
  if (!props.item) return 0

  let price = props.item.price

  for (const group of props.item.customization_options || []) {
    if (group.price_each) {
      price +=
        (selections.value[group.group] || []).length *
        group.price_each
    }
  }

  return price
})

// ── Validation ─────────────────────────────────────────────────────────
const canConfirm = computed(() => {
  if (!props.item) return false

  for (const group of props.item.customization_options || []) {
    if (group.required && !hasSelection(group)) {
      return false
    }
  }

  return true
})

// ── Cart summary ───────────────────────────────────────────────────────
function buildSummary() {
  const parts = []

  for (const group of props.item.customization_options || []) {
    const keys = selections.value[group.group] || []

    if (!keys.length) continue

    const labels = keys.map(
      k => group.choices.find(c => c.key === k)?.label || k
    )

    parts.push(labels.join(', '))
  }

  if (notes.value.trim()) {
    parts.push(`📝 ${notes.value.trim()}`)
  }

  return parts.join(' · ')
}

// ── Confirm ────────────────────────────────────────────────────────────
function confirm() {
  if (!canConfirm.value) return

  emit('add', {
    ...props.item,
    price: totalPrice.value,
    cartKey: `${props.item.id}__${JSON.stringify(selections.value)}`,
    selections: { ...selections.value },
    notes: notes.value.trim(),
    summary: buildSummary(),
  })

  emit('close')
}
</script>
<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to       { opacity: 0; }
.modal-enter-active > div, .modal-leave-active > div { transition: transform 0.25s ease; }
.modal-enter-from > div, .modal-leave-to > div       { transform: translateY(40px); }
</style>
