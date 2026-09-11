<template>
  <div v-if="hasVisibleLinks" class="flex gap-4 items-center">
    <!-- TikTok Link -->
    <a
      v-if="socialLinks?.tiktok && socialLinks.tiktok.trim()"
      :href="socialLinks.tiktok"
      target="_blank"
      rel="noopener noreferrer"
      class="transition-transform hover:scale-110 flex items-center justify-center w-8 h-8"
      title="Follow on TikTok"
      aria-label="Follow on TikTok"
    >
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style="color:#000">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.67a2.4 2.4 0 0 1-2.4 2.4 2.4 2.4 0 0 1-2.4-2.4 2.4 2.4 0 0 1 2.4-2.4c.37 0 .74.1 1.1.29V9.4a5.5 5.5 0 0 0-1.1-.1C9.41 9.3 7.6 11.12 7.6 13.34c0 2.22 1.81 4.04 4.04 4.04 2.22 0 4.04-1.82 4.04-4.04V10.9a4.9 4.9 0 0 0 3.91 1.9v-3.6a4.6 4.6 0 0 1-.45-.05z"/>
      </svg>
    </a>

    <!-- Instagram Link -->
    <a
      v-if="socialLinks?.instagram && socialLinks.instagram.trim()"
      :href="socialLinks.instagram"
      target="_blank"
      rel="noopener noreferrer"
      class="transition-transform hover:scale-110 flex items-center justify-center w-8 h-8"
      title="Follow on Instagram"
      aria-label="Follow on Instagram"
    >
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style="color:#E1306C">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0m3.81 9.13v6.68c0 .62-.5 1.13-1.13 1.13H9.32c-.62 0-1.13-.5-1.13-1.13V9.13h2.26V8c0-.62.5-1.12 1.12-1.12h1.56c.62 0 1.12.5 1.12 1.12v1.13h2.26M12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
      </svg>
    </a>

    <!-- Facebook Link -->
    <a
      v-if="socialLinks?.facebook && socialLinks.facebook.trim()"
      :href="socialLinks.facebook"
      target="_blank"
      rel="noopener noreferrer"
      class="transition-transform hover:scale-110 flex items-center justify-center w-8 h-8"
      title="Follow on Facebook"
      aria-label="Follow on Facebook"
    >
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style="color:#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    </a>
  </div>
</template>

<script setup>
/**
 * RestaurantSocialLinks Component
 * 
 * Displays clickable social media links for the restaurant (TikTok, Instagram, Facebook).
 * Conditionally renders based on configured links - unconfigured platforms are not displayed.
 * 
 * @component
 * @example
 * <RestaurantSocialLinks :socialLinks="restaurant.social_media_links" />
 * 
 * @prop {Object} socialLinks - Object containing social media URLs
 * @prop {string} socialLinks.tiktok - TikTok profile URL (optional)
 * @prop {string} socialLinks.instagram - Instagram profile URL (optional)
 * @prop {string} socialLinks.facebook - Facebook profile URL (optional)
 */

import { computed } from 'vue'

const props = defineProps({
  socialLinks: {
    type: Object,
    default: () => ({})
  }
})

/**
 * Computed property to determine if any social media links are configured
 * @returns {boolean} true if at least one platform has a non-empty URL
 */
const hasVisibleLinks = computed(() => {
  if (!props.socialLinks) return false
  return !!(
    (props.socialLinks.tiktok && props.socialLinks.tiktok.trim()) ||
    (props.socialLinks.instagram && props.socialLinks.instagram.trim()) ||
    (props.socialLinks.facebook && props.socialLinks.facebook.trim())
  )
})
</script>

<style scoped>
a {
  color: #555;
}

a:hover {
  color: #1A1A1A;
}
</style>
