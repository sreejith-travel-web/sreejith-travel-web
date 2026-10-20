/* ~/app/composables/useHeaderTheme.ts */

import { ref, watch, onMounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useRoute } from 'vue-router'

export type HeaderTheme = 'light' | 'dark'

export function useHeaderTheme() {
  const backgroundTheme = useState<HeaderTheme>('header-bg-theme', () => 'light')
  const forceTransparent = useState<boolean>('header-force-transparent', () => false)
  const { y } = useWindowScroll()
  const route = useRoute()

  const detectSectionUnderHeader = () => {
    if (!import.meta.client) return

    // If scroll is near top and the parent component has forced transparency, exit early
    if (forceTransparent.value && y.value < 50) {
      return
    }

    const sampleY = 40 // Vertical midpoint of the header
    const themedSections = document.querySelectorAll<HTMLElement>('[data-theme]')

    for (const section of themedSections) {
      const rect = section.getBoundingClientRect()
      if (rect.top <= sampleY && rect.bottom >= sampleY) {
        const theme = section.dataset.theme as HeaderTheme
        if (theme === 'dark' || theme === 'light') {
          backgroundTheme.value = theme
          return
        }
      }
    }

    backgroundTheme.value = 'light'
  }

  onMounted(() => {
    detectSectionUnderHeader()
  })

  watch([y, forceTransparent], () => {
    detectSectionUnderHeader()
  })

  watch(() => route.fullPath, () => {
    if (import.meta.client) {
      requestAnimationFrame(detectSectionUnderHeader)
    }
  })

  return {
    backgroundTheme,
    forceTransparent,
    detectSectionUnderHeader
  }
}