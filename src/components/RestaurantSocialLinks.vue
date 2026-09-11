<template>
  <div v-if="hasVisibleLinks" class="flex gap-6 items-center justify-start">
    <!-- TikTok Link -->
    <a
      v-if="socialLinks?.tiktok && socialLinks.tiktok.trim()"
      :href="socialLinks.tiktok"
      target="_blank"
      rel="noopener noreferrer"
      class="group transition-all duration-300 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 hover:bg-black hover:scale-125 shadow-md"
      title="Follow on TikTok"
      aria-label="Follow on TikTok"
    >
      <img src="/images/icons/logo_tiktok.png" alt="TikTok" class="w-10 h-10 group-hover:brightness-0 group-hover:invert transition-all" />
    </a>

    <!-- Instagram Link -->
    <a
      v-if="socialLinks?.instagram && socialLinks.instagram.trim()"
      :href="socialLinks.instagram"
      target="_blank"
      rel="noopener noreferrer"
      class="group transition-all duration-300 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 hover:scale-125 shadow-md"
      title="Follow on Instagram"
      aria-label="Follow on Instagram"
    >
      <img src="/images/icons/logo_insta.png" alt="Instagram" class="w-10 h-10 group-hover:brightness-0 group-hover:invert transition-all" />
    </a>

    <!-- Facebook Link -->
    <a
      v-if="socialLinks?.facebook && socialLinks.facebook.trim()"
      :href="socialLinks.facebook"
      target="_blank"
      rel="noopener noreferrer"
      class="group transition-all duration-300 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 hover:bg-blue-600 hover:scale-125 shadow-md"
      title="Follow on Facebook"
      aria-label="Follow on Facebook"
    >
      <img src="/images/icons/logo_facebook.png" alt="Facebook" class="w-10 h-10 group-hover:brightness-0 group-hover:invert transition-all" />
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

a:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}
</style>
