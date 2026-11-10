<!-- ~/app/components/journal/JournalSidebar.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface JournalTocItem {
  id: string
  text: string
}

const props = withDefaults(
  defineProps<{
    toc: JournalTocItem[]
    activeId: string
    title: string
    excerpt?: string
    mode?: 'desktop' | 'mobile'
  }>(),
  {
    excerpt: '',
    mode: 'desktop'
  }
)

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const isCopied = ref(false)
const isMobileOpen = ref(false)
const mobileBarRef = ref<HTMLElement | null>(null)
let copyTimeoutId: ReturnType<typeof setTimeout> | null = null

const activeIndex = computed(() => {
  if (!props.toc.length) return 0
  const idx = props.toc.findIndex((item) => item.id === props.activeId)
  return idx > -1 ? idx : 0
})

const formattedProgress = computed(() => {
  if (!props.toc.length) return '00 / 00'
  const current = String(activeIndex.value + 1).padStart(2, '0')
  const total = String(props.toc.length).padStart(2, '0')
  return `${current} / ${total}`
})

const getCurrentUrl = (): string => {
  if (!import.meta.client) return ''
  return window.location.href
}

const handleCopyLink = async () => {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(getCurrentUrl())
    isCopied.value = true
    if (copyTimeoutId) clearTimeout(copyTimeoutId)
    copyTimeoutId = setTimeout(() => {
      isCopied.value = false
    }, 1500)
  } catch (err) {
    console.error('[JournalSidebar] Failed to copy link:', err)
  }
}

const handleWhatsAppShare = () => {
  if (!import.meta.client) return
  const url = getCurrentUrl()
  const message = `${props.title} — ${url}`
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(waUrl, '_blank', 'noopener,noreferrer')
}

const handleNativeShare = async () => {
  if (!import.meta.client) return
  const url = getCurrentUrl()
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.title,
        text: props.excerpt || props.title,
        url
      })
      return
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
    }
  }
  await handleCopyLink()
}

const handleSelectSection = (id: string) => {
  isMobileOpen.value = false
  emit('select', id)
}

const handleOutsideClick = (e: MouseEvent) => {
  if (!isMobileOpen.value || !mobileBarRef.value) return
  const target = e.target as Node | null
  if (target && !mobileBarRef.value.contains(target)) {
    isMobileOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMobileOpen.value) {
    isMobileOpen.value = false
  }
}

onMounted(() => {
  if (props.mode === 'mobile') {
    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (copyTimeoutId) clearTimeout(copyTimeoutId)
  if (props.mode === 'mobile') {
    document.removeEventListener('pointerdown', handleOutsideClick)
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <!-- ==========================================
       MODE A: MOBILE & TABLET STICKY BAR + DROPDOWN (< 1024px)
       ========================================== -->
  <div
    v-motion-fade-up
    :delay="400"
    v-if="mode === 'mobile'"
    ref="mobileBarRef"
    class="sticky top-16 sm:top-18 md:top-20 z-30 w-full mb-8 lg:hidden"
  >
    <div class="relative w-full">
      <!-- Sticky Control Bar -->
      <div class="w-full rounded-2xl bg-surface-light/95 backdrop-blur-md border border-journey-deep/15 shadow-xs px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        <!-- Left Toggle Button: IN THIS STORY -->
        <button
          type="button"
          :aria-expanded="isMobileOpen"
          aria-label="Toggle table of contents"
          @click="isMobileOpen = !isMobileOpen"
          class="inline-flex items-center gap-2.5 py-1 text-left cursor-pointer group"
        >
          <svg
            class="w-4 h-4 text-journey-deep/80 group-hover:text-action-blue transition-colors shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>

          <span class="card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.14em]">
            IN THIS STORY
          </span>

          <svg
            class="w-3.5 h-3.5 text-journey-deep/65 transition-transform duration-300 shrink-0"
            :class="isMobileOpen ? 'rotate-180 text-action-blue' : ''"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <!-- Right 3 Rounded Share Buttons (Icon-Only) -->
        <div class="flex items-center gap-2 pl-3 border-l border-journey-deep/12">
          <!-- 1. Copy Link (Swaps to Tick on Click) -->
          <button
            type="button"
            :aria-label="isCopied ? 'Link copied' : 'Copy story link'"
            @click="handleCopyLink"
            class="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            :class="
              isCopied
                ? 'bg-action-blue/12 border-action-blue text-action-blue'
                : 'bg-bg-light/75 border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue'
            "
          >
            <svg
              v-if="isCopied"
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>

          <!-- 2. WhatsApp Share -->
          <button
            type="button"
            aria-label="Share on WhatsApp"
            @click="handleWhatsAppShare"
            class="w-9 h-9 rounded-full bg-whatsapp/12 border border-whatsapp/35 text-[#128C7E] hover:bg-whatsapp/22 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
          </button>

          <!-- 3. Native Share -->
          <button
            type="button"
            aria-label="Share story"
            @click="handleNativeShare"
            class="w-9 h-9 rounded-full bg-bg-light/75 border border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Expandable Mobile Contents Popover -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isMobileOpen && toc.length > 0"
          class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 rounded-2xl bg-surface-light border border-journey-deep/15 shadow-lg p-5 flex flex-col gap-3.5"
        >
          <div class="flex items-center justify-between">
            <span class="card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.15em]">
              IN THIS STORY
            </span>
            <span class="card-tag font-semibold text-journey-deep/65 tabular-nums">
              {{ formattedProgress }}
            </span>
          </div>

          <nav
            aria-label="Mobile table of contents"
            class="relative flex flex-col border-l border-journey-deep/15 ml-1"
          >
            <button
              v-for="item in toc"
              :key="`mob-toc-${item.id}`"
              type="button"
              @click="handleSelectSection(item.id)"
              class="relative flex items-center gap-2.5 pl-3.5 pr-3 py-2 text-left rounded-r-xl transition-all duration-200 cursor-pointer"
              :class="
                item.id === activeId
                  ? 'bg-soft-blue/30 text-journey-deep font-semibold'
                  : 'text-secondary-light hover:text-journey-deep hover:bg-journey-deep/3'
              "
            >
              <!-- Left Gold Active Bar -->
              <span
                v-if="item.id === activeId"
                class="absolute -left-px top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-dark-gold"
                aria-hidden="true"
              />
              <!-- Gold Dot on Active Item -->
              <span
                v-if="item.id === activeId"
                class="w-1.5 h-1.5 rounded-full bg-dark-gold shrink-0"
                aria-hidden="true"
              />
              <span class="section-subparagraph leading-snug">
                {{ item.text }}
              </span>
            </button>
          </nav>
        </div>
      </Transition>
    </div>
  </div>

  <!-- ==========================================
       MODE B: DESKTOP STICKY SIDEBAR CARD (lg+)
       ========================================== -->
  <div
    v-motion-fade-up
    v-else
    class="w-full rounded-2xl bg-surface-light border border-journey-deep/12 shadow-2xs p-6 flex flex-col gap-6"
  >
    <!-- 1. SHARE THIS STORY (3 Rounded Icon-Only Buttons) -->
    <div class="flex flex-col gap-3.5 pb-6 border-b border-journey-deep/12">
      <span class="card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.16em]">
        SHARE THIS STORY
      </span>

      <div class="flex items-center gap-3">
        <!-- 1. Copy Link Button (Swaps to Tick on Click) -->
        <button
          type="button"
          :aria-label="isCopied ? 'Link copied' : 'Copy story link'"
          @click="handleCopyLink"
          class="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
          :class="
            isCopied
              ? 'bg-action-blue/12 border-action-blue text-action-blue shadow-2xs'
              : 'bg-bg-light/70 border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue'
          "
        >
          <svg
            v-if="isCopied"
            class="w-4.5 h-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else
            class="w-4.5 h-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>

        <!-- 2. WhatsApp Button -->
        <button
          type="button"
          aria-label="Share on WhatsApp"
          @click="handleWhatsAppShare"
          class="w-11 h-11 rounded-full bg-whatsapp/12 border border-whatsapp/35 text-[#128C7E] hover:bg-whatsapp/22 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </button>

        <!-- 3. Native Share Button -->
        <button
          type="button"
          aria-label="Share story"
          @click="handleNativeShare"
          class="w-11 h-11 rounded-full bg-bg-light/70 border border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
        >
          <svg
            class="w-4.5 h-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 2. IN THIS STORY (Scroll-Spy TOC) -->
    <div v-if="toc.length > 0" class="flex flex-col gap-3.5">
      <span class="card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.16em]">
        IN THIS STORY
      </span>

      <nav
        aria-label="Table of contents"
        class="relative flex flex-col border-l border-journey-deep/15 ml-1"
      >
        <button
          v-for="item in toc"
          :key="`desk-toc-${item.id}`"
          type="button"
          @click="handleSelectSection(item.id)"
          class="relative flex items-center gap-2.5 pl-3.5 pr-3 py-2 text-left rounded-r-xl transition-all duration-200 cursor-pointer"
          :class="
            item.id === activeId
              ? 'bg-soft-blue/30 text-journey-deep font-semibold'
              : 'text-secondary-light hover:text-journey-deep hover:bg-journey-deep/3'
          "
        >
          <!-- Left Gold Active Bar -->
          <span
            v-if="item.id === activeId"
            class="absolute -left-px top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-dark-gold"
            aria-hidden="true"
          />
          <!-- Gold Dot on Active Item -->
          <span
            v-if="item.id === activeId"
            class="w-1.5 h-1.5 rounded-full bg-dark-gold shrink-0"
            aria-hidden="true"
          />
          <span class="section-subparagraph leading-snug">
            {{ item.text }}
          </span>
        </button>
      </nav>
    </div>

    <!-- 3. BOTTOM PROGRESS COUNTER (e.g. 03 / 08) -->
    <div
      v-if="toc.length > 0"
      class="pt-4 border-t border-journey-deep/12 flex items-center justify-between"
    >
      <span class="section-subparagraph font-medium text-journey-deep/80 tabular-nums tracking-wider">
        {{ formattedProgress }}
      </span>
    </div>
  </div>
</template>