<!-- ~/app/components/journal/JournalRichText.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { navigateTo } from '#imports'

const props = withDefaults(
  defineProps<{
    content?: string
    tag?: 'p' | 'span' | 'div'
  }>(),
  {
    content: '',
    tag: 'span'
  }
)

const sanitizedHtml = computed(() => {
  if (!props.content) return ''
  return props.content
    .replace(/<(script|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/<a\b([^>]*target=['"]_blank['"][^>]*)>/gi, (match, attrs) => {
      if (/\brel\s*=/i.test(attrs)) return match
      return `<a${attrs} rel="noopener noreferrer">`
    })
    .replace(/<span\b([^>]*\bdata-scroll-to\s*=\s*['"][^'"]+['"][^>]*)>/gi, (match, attrs) => {
      let extra = ''
      if (!/\brole\s*=/i.test(attrs)) extra += ' role="button"'
      if (!/\btabindex\s*=/i.test(attrs)) extra += ' tabindex="0"'
      return `<span${attrs}${extra}>`
    })
})

const resolveElement = (target: EventTarget | null): Element | null => {
  if (!target) return null
  if (target instanceof Element) return target
  if (target instanceof Node) return target.parentElement
  return null
}

const scrollSmoothlyToSection = (rawId: string, triggerEl?: Element | null): boolean => {
  if (!import.meta.client) return false
  const sectionId = rawId.trim().replace(/^#/, '')
  if (!sectionId) return false

  // Let JournalSingleView handle scrolling + sidebar activeId sync if listening
  if (triggerEl) {
    const customEvt = new CustomEvent('journal-scroll-to', {
      detail: { id: sectionId },
      bubbles: true,
      cancelable: true
    })
    triggerEl.dispatchEvent(customEvt)
    if (customEvt.defaultPrevented) return true
  }

  const sectionEl = document.getElementById(sectionId)
  if (!sectionEl) {
    if (import.meta.dev) {
      console.warn(`[JournalRichText] Target #${sectionId} not found in DOM.`)
    }
    return false
  }

  const offset = window.innerWidth < 1024 ? 145 : 115
  const y = sectionEl.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  return true
}

const handleContentClick = (e: MouseEvent) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return
  }

  const targetEl = resolveElement(e.target)
  if (!targetEl) return

  // 1. Zero-URL-Hash section scroll via data-scroll-to="section-id"
  const scrollTrigger = targetEl.closest('[data-scroll-to]')
  if (scrollTrigger) {
    const targetId = scrollTrigger.getAttribute('data-scroll-to')
    if (targetId) {
      e.preventDefault()
      scrollSmoothlyToSection(targetId, scrollTrigger)
      return
    }
  }

  // 2. Standard <a> handling
  const anchor = targetEl.closest('a')
  if (!anchor) return

  const href = anchor.getAttribute('href')?.trim()
  const linkTarget = anchor.getAttribute('target')
  if (!href || linkTarget === '_blank' || anchor.hasAttribute('download')) return

  if (href.startsWith('#') && href.length > 1) {
    e.preventDefault()
    scrollSmoothlyToSection(href.slice(1), anchor)
    return
  }

  if (href.startsWith('/') && !href.startsWith('//')) {
    e.preventDefault()
    navigateTo(href)
  }
}

const handleContentKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Enter' && e.key !== ' ') return
  const targetEl = resolveElement(e.target)
  const scrollTrigger = targetEl?.closest('[data-scroll-to]')
  if (!scrollTrigger) return

  const targetId = scrollTrigger.getAttribute('data-scroll-to')
  if (targetId) {
    e.preventDefault()
    scrollSmoothlyToSection(targetId, scrollTrigger)
  }
}
</script>

<template>
  <component
    :is="tag"
    class="journal-rich-text"
    v-html="sanitizedHtml"
    @click="handleContentClick"
    @keydown="handleContentKeydown"
  />
</template>