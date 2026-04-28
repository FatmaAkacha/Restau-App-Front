<template>
  <div class="card p-4 space-y-3">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold" style="color:#1A1A1A">{{ order.customer_name }}</p>
        <p class="text-xs mt-0.5" style="color:#888">
          {{ order.type === 'delivery' ? '🚚 ' + order.delivery_address : '🏃 À emporter' }}
        </p>
      </div>
      <StatusBadge :status="order.status" />
    </div>

    <!-- Articles -->
    <div class="text-xs space-y-0.5" style="color:#555">
      <div v-for="item in order.items" :key="item.id">
        {{ item.quantity }}× {{ item.name }}
      </div>
    </div>

    <!-- ── COUNTDOWN TIMER (shown when preparing) ── -->
    <div v-if="order.status === 'preparing' && order.prep_time"
         class="rounded-xl p-3 text-center"
         :style="timerStyle">

      <p class="text-xs font-semibold uppercase tracking-wide mb-1" :style="timerLabelStyle">
        ⏱ Temps restant
      </p>

      <!-- Big countdown display -->
      <div class="text-3xl font-black tabular-nums" :style="timerValueStyle">
        {{ displayTime }}
      </div>

      <!-- Progress bar -->
      <div class="mt-2 h-2 rounded-full overflow-hidden" style="background:rgba(0,0,0,0.1)">
        <div class="h-full rounded-full transition-all duration-1000"
             :style="`width:${progressPct}%; background:${progressColor}`" />
      </div>

      <p class="text-xs mt-1.5" :style="timerLabelStyle">
        sur {{ order.prep_time }} min de préparation
      </p>
    </div>

    <!-- Static prep time (when not yet preparing) -->
    <div v-else-if="order.prep_time && order.status !== 'preparing'"
         class="flex items-center gap-2 text-sm rounded-lg px-3 py-2"
         style="background:#FFF8F0; color:#D97706">
      <span>⏱</span>
      <span class="font-semibold">{{ order.prep_time }} min de préparation</span>
    </div>

    <!-- Pipeline buttons -->
    <div class="flex gap-2 flex-wrap">
      <button v-for="next in nextStatuses" :key="next.value"
              @click="$emit('status', next.value)"
              class="flex-1 text-xs font-semibold py-2 rounded-xl border transition-all"
              style="border-color:#E5E5E5; color:#555"
              onmouseover="this.style.background='#E8192C'; this.style.color='#fff'; this.style.borderColor='#E8192C'"
              onmouseout="this.style.background=''; this.style.color='#555'; this.style.borderColor='#E5E5E5'">
        {{ next.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'

const props = defineProps({ order: Object })
defineEmits(['status'])

const pipeline = {
  confirmed:  [{ value: 'preparing',  label: '👨‍🍳 Commencer la préparation' }],
  preparing:  [{ value: 'ready',      label: '✅ Marquer comme prête'        }],
  ready:      [{ value: 'delivering', label: '🚚 En livraison' }, { value: 'delivered', label: '🏠 Récupérée' }],
  delivering: [{ value: 'delivered',  label: '✅ Livrée'                     }],
}

const nextStatuses = computed(() => pipeline[props.order.status] || [])

// ── Countdown logic ──────────────────────────────────────────────────────────
const now = ref(Date.now())
let ticker = null

onMounted(() => {
  ticker = setInterval(() => { now.value = Date.now() }, 1000)
})
onUnmounted(() => clearInterval(ticker))

const totalSeconds = computed(() => (props.order.prep_time || 0) * 60)

const elapsedSeconds = computed(() => {
  // Use preparing_started_at if available, fallback to updated_at
  const startStr = props.order.preparing_started_at || props.order.updated_at
  if (!startStr) return 0
  const start = new Date(startStr).getTime()
  return Math.floor((now.value - start) / 1000)
})

const remainingSeconds = computed(() =>
  Math.max(0, totalSeconds.value - elapsedSeconds.value)
)

const progressPct = computed(() => {
  if (!totalSeconds.value) return 0
  return Math.min(100, (elapsedSeconds.value / totalSeconds.value) * 100)
})

// Format mm:ss
const displayTime = computed(() => {
  const s = remainingSeconds.value
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
})

// Color changes as time runs out
const progressColor = computed(() => {
  const pct = progressPct.value
  if (pct < 50) return '#16a34a'   // green — plenty of time
  if (pct < 80) return '#D97706'   // orange — getting close
  return '#E8192C'                  // red — almost done / overdue
})

const timerStyle = computed(() => {
  const pct = progressPct.value
  if (pct < 50) return 'background:#F0FFF4; border:1px solid #BBF7D0'
  if (pct < 80) return 'background:#FFFBEB; border:1px solid #FDE68A'
  return 'background:#FFF0F1; border:1px solid #FFCDD0'
})

const timerLabelStyle = computed(() => {
  const pct = progressPct.value
  if (pct < 50) return 'color:#16a34a'
  if (pct < 80) return 'color:#D97706'
  return 'color:#E8192C'
})

const timerValueStyle = computed(() => {
  const pct = progressPct.value
  if (pct < 50) return 'color:#15803d'
  if (pct < 80) return 'color:#B45309'
  return 'color:#E8192C'
})
</script>
