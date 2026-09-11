import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RestaurantSocialLinks from '../RestaurantSocialLinks.vue'

describe('RestaurantSocialLinks', () => {
  it('renders when social_media_links provided', () => {
    const socialLinks = {
      tiktok: 'https://tiktok.com/@goodnaan',
      instagram: 'https://instagram.com/goodnaan',
      facebook: 'https://facebook.com/goodnaan'
    }
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks }
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('hides when social_media_links is null', () => {
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks: null }
    })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('hides when social_media_links is empty object', () => {
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks: {} }
    })
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('only displays configured platforms', () => {
    const socialLinks = {
      instagram: 'https://instagram.com/goodnaan'
    }
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks }
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0].attributes('href')).toBe('https://instagram.com/goodnaan')
  })

  it('displays all three platforms when all configured', () => {
    const socialLinks = {
      tiktok: 'https://tiktok.com/@goodnaan',
      instagram: 'https://instagram.com/goodnaan',
      facebook: 'https://facebook.com/goodnaan'
    }
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks }
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(3)
  })

  it('opens links in new window with security attributes', () => {
    const socialLinks = {
      tiktok: 'https://tiktok.com/@goodnaan'
    }
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks }
    })
    const link = wrapper.find('a')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('hides platforms with empty string URLs', () => {
    const socialLinks = {
      tiktok: '',
      instagram: 'https://instagram.com/goodnaan',
      facebook: ''
    }
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks }
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0].attributes('href')).toBe('https://instagram.com/goodnaan')
  })

  it('hides platforms with whitespace-only URLs', () => {
    const socialLinks = {
      tiktok: '   ',
      instagram: 'https://instagram.com/goodnaan'
    }
    const wrapper = mount(RestaurantSocialLinks, {
      props: { socialLinks }
    })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(1)
  })
})
