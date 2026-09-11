import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import fc from 'fast-check'
import RestaurantSocialLinks from '../RestaurantSocialLinks.vue'

/**
 * Property-Based Tests for RestaurantSocialLinks Component
 * 
 * **Validates: Requirements 1.4**
 * 
 * Property 1: Unconfigured Social Media Platforms Are Hidden
 * For any social media configuration object, if a platform URL is null or empty,
 * that platform's link SHALL not be rendered in the component.
 */

describe('RestaurantSocialLinks - Property-Based Tests', () => {
  it('Property 1: Unconfigured platforms are not rendered', () => {
    // Generate social media configs with varying combinations of null/empty/valid URLs
    fc.assert(
      fc.property(
        fc.record({
          tiktok: fc.oneof(
            fc.constant(null),
            fc.constant(''),
            fc.constant('   '),
            fc.webUrl()
          ),
          instagram: fc.oneof(
            fc.constant(null),
            fc.constant(''),
            fc.constant('   '),
            fc.webUrl()
          ),
          facebook: fc.oneof(
            fc.constant(null),
            fc.constant(''),
            fc.constant('   '),
            fc.webUrl()
          )
        }),
        (socialLinks) => {
          const wrapper = mount(RestaurantSocialLinks, {
            props: { socialLinks }
          })

          // Count visible links
          const visibleLinks = wrapper.findAll('a')

          // Count expected visible platforms
          const expectedCount = [
            socialLinks.tiktok,
            socialLinks.instagram,
            socialLinks.facebook
          ].filter(url => url && typeof url === 'string' && url.trim()).length

          // Verify: only configured (non-null/non-empty) platforms are rendered
          expect(visibleLinks).toHaveLength(expectedCount)

          // Verify: if no platforms configured, no links rendered at all
          if (expectedCount === 0) {
            expect(wrapper.find('a').exists()).toBe(false)
          }
        }
      )
    )
  })

  it('Property 1: All rendered links have correct security attributes', () => {
    fc.assert(
      fc.property(
        fc.record({
          tiktok: fc.oneof(fc.constant(null), fc.webUrl()),
          instagram: fc.oneof(fc.constant(null), fc.webUrl()),
          facebook: fc.oneof(fc.constant(null), fc.webUrl())
        }),
        (socialLinks) => {
          const wrapper = mount(RestaurantSocialLinks, {
            props: { socialLinks }
          })

          const links = wrapper.findAll('a')
          // All links must open in new window with security attributes
          links.forEach(link => {
            expect(link.attributes('target')).toBe('_blank')
            expect(link.attributes('rel')).toBe('noopener noreferrer')
          })
        }
      )
    )
  })

  it('Property 1: Component remains stable with edge cases', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant({}),
          fc.record({
            tiktok: fc.oneof(fc.constant(null), fc.constant(''), fc.webUrl()),
            instagram: fc.oneof(fc.constant(null), fc.constant(''), fc.webUrl()),
            facebook: fc.oneof(fc.constant(null), fc.constant(''), fc.webUrl())
          })
        ),
        (socialLinks) => {
          // Component should not throw regardless of input
          const wrapper = mount(RestaurantSocialLinks, {
            props: { socialLinks }
          })
          expect(wrapper.exists()).toBe(true)
        }
      )
    )
  })
})
