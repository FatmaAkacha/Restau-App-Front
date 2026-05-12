import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Real-time open/closed status for Good Naan Caen.
 *
 * Schedule (Europe/Paris):
 *   Mon–Fri : 11:30–14:30  and  18:00–23:30
 *   Sat–Sun : 18:00–23:30  only
 */

// Returns true if the current Paris time falls within the restaurant's hours.
function checkIsOpen() {
  // Use Intl to get the current time in Europe/Paris regardless of the user's locale
  const now = new Date()
  const parts = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: 'numeric', minute: 'numeric',
    weekday: 'short',
    hour12: false,
  }).formatToParts(now)

  const get = (type) => parts.find(p => p.type === type)?.value

  // weekday short in fr-FR: 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'
  const weekday = get('weekday')   // e.g. 'lun.'
  const hour    = parseInt(get('hour'),   10)
  const minute  = parseInt(get('minute'), 10)
  const time    = hour * 60 + minute  // minutes since midnight

  const isWeekend = weekday === 'sam.' || weekday === 'dim.'

  // Evening slot: 18:00–23:30 every day
  const eveningOpen  = 18 * 60       // 1080
  const eveningClose = 23 * 60 + 30  // 1410

  if (time >= eveningOpen && time < eveningClose) return true

  // Lunch slot: 11:30–14:30 Mon–Fri only
  if (!isWeekend) {
    const lunchOpen  = 11 * 60 + 30  // 690
    const lunchClose = 14 * 60 + 30  // 870
    if (time >= lunchOpen && time < lunchClose) return true
  }

  return false
}

export function useOpenStatus() {
  const isOpen      = ref(checkIsOpen())
  const nextChange  = ref('')   // human-readable "Ouvre à 18:00" / "Ferme à 14:30"

  function computeNextChange() {
    const now = new Date()
    const parts = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: 'numeric', minute: 'numeric',
      weekday: 'short',
      hour12: false,
    }).formatToParts(now)

    const get = (type) => parts.find(p => p.type === type)?.value
    const weekday = get('weekday')
    const hour    = parseInt(get('hour'),   10)
    const minute  = parseInt(get('minute'), 10)
    const time    = hour * 60 + minute

    const isWeekend = weekday === 'sam.' || weekday === 'dim.'

    if (isOpen.value) {
      // Currently open — find when it closes
      if (!isWeekend && time >= 11 * 60 + 30 && time < 14 * 60 + 30) {
        nextChange.value = 'Ferme à 14:30'
      } else {
        nextChange.value = 'Ferme à 23:30'
      }
    } else {
      // Currently closed — find when it opens next
      if (!isWeekend && time < 11 * 60 + 30) {
        nextChange.value = 'Ouvre à 11:30'
      } else if (time < 18 * 60) {
        nextChange.value = 'Ouvre à 18:00'
      } else {
        // After 23:30 — opens tomorrow
        const tomorrowWeekend = weekday === 'ven.' || weekday === 'sam.'
        nextChange.value = tomorrowWeekend ? 'Ouvre demain à 18:00' : 'Ouvre demain à 11:30'
      }
    }
  }

  let timer
  onMounted(() => {
    computeNextChange()
    // Re-check every 30 seconds
    timer = setInterval(() => {
      isOpen.value = checkIsOpen()
      computeNextChange()
    }, 30_000)
  })
  onUnmounted(() => clearInterval(timer))

  return { isOpen, nextChange }
}
