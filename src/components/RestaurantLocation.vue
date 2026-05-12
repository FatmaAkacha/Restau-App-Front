<template>
  <section class="py-10">
    
    <!-- Title -->
    <div class="flex items-center gap-4 mb-8">
      <div class="flex-1 h-px bg-gray-300"></div>

      <h2 class="text-2xl font-black tracking-tight"
          style="color:#1A1A1A">
        NOUS <span style="color:#E8192C">TROUVER</span>
      </h2>

      <div class="flex-1 h-px bg-gray-300"></div>
    </div>

    <!-- Info cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

      <!-- Adresse -->
      <div class="rounded-2xl p-5 shadow-sm border bg-white"
           style="border-color:#EFEFEF">
        <div class="text-3xl mb-3">📍</div>

        <h3 class="font-bold text-lg mb-2"
            style="color:#1A1A1A">
          Adresse
        </h3>

        <p class="text-sm leading-6"
           style="color:#666">
          {{ address }}
        </p>
      </div>

      <!-- Téléphone -->
      <div class="rounded-2xl p-5 shadow-sm border bg-white"
           style="border-color:#EFEFEF">
        <div class="text-3xl mb-3">📞</div>

        <h3 class="font-bold text-lg mb-2"
            style="color:#1A1A1A">
          Téléphone
        </h3>

        <p class="text-sm leading-6"
           style="color:#666">
          {{ phone }}
        </p>
      </div>

      <!-- Horaires -->
      <div class="rounded-2xl p-5 shadow-sm border bg-white"
           style="border-color:#EFEFEF">
        <div class="text-3xl mb-3">🕐</div>

        <h3 class="font-bold text-lg mb-3" style="color:#1A1A1A">Horaires</h3>

        <ul class="space-y-1.5">
          <li v-for="day in schedule" :key="day.label"
              class="flex items-start justify-between gap-2 text-sm rounded-lg px-2 py-1.5 -mx-2 transition-colors"
              :style="day.isToday ? 'background:#FFF0F1' : ''">
            <span class="font-semibold w-8 flex-shrink-0"
                  :style="day.isToday ? 'color:#E8192C' : 'color:#1A1A1A'">
              {{ day.label }}
            </span>
            <span class="text-right leading-snug"
                  :style="day.isToday ? 'color:#E8192C; font-weight:600' : 'color:#666'">
              {{ day.hours }}
            </span>
          </li>
        </ul>
      </div>

    </div>

    <!-- Google Maps -->
    <div class="overflow-hidden rounded-3xl shadow-md border"
         style="border-color:#E5E5E5">

      <iframe
        :src="mapUrl"
        width="100%"
        height="350"
        style="border:0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  address: String,
  phone:   String,
  mapUrl:  String,
})

// Mon–Fri: lunch + evening. Sat–Sun: evening only.
const LUNCH   = '11:30 – 14:30'
const EVENING = '18:00 – 23:30'
const BOTH    = `${LUNCH}\n${EVENING}`

const DAYS = [
  { label: 'Lun', jsDay: 1, hours: BOTH    },
  { label: 'Mar', jsDay: 2, hours: BOTH    },
  { label: 'Mer', jsDay: 3, hours: BOTH    },
  { label: 'Jeu', jsDay: 4, hours: BOTH    },
  { label: 'Ven', jsDay: 5, hours: BOTH    },
  { label: 'Sam', jsDay: 6, hours: EVENING },
  { label: 'Dim', jsDay: 0, hours: EVENING },
]

const schedule = computed(() => {
  // Get today's weekday in Paris timezone
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
  }).formatToParts(new Date())
  const parisWeekday = parts.find(p => p.type === 'weekday')?.value // e.g. 'lun.'

  const shortMap = { 'lun.': 1, 'mar.': 2, 'mer.': 3, 'jeu.': 4, 'ven.': 5, 'sam.': 6, 'dim.': 0 }
  const todayJs = shortMap[parisWeekday] ?? new Date().getDay()

  return DAYS.map(d => ({ ...d, isToday: d.jsDay === todayJs }))
})
</script>