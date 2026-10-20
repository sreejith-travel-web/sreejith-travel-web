<!-- ~/app/components/YoutubeBackgroundPlayer.vue -->

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  videoId: string
  posterDesktop: string
  posterMobile: string
  loadPlayer: boolean // True when this is the active slide
}>()

const iframeRef = ref<HTMLIFrameElement | null>(null)
const isPlaying = ref(false)
const hasBeenActivated = ref(false)

let player: any = null
let fallbackTimer: ReturnType<typeof setTimeout> | null = null

// 1. LAZY LOADING FOR CORE WEB VITALS
// The iframe stays completely empty, downloading nothing, until the slide is active.
const iframeSrc = computed(() => {
  if (!hasBeenActivated.value) return ''
  return `https://www.youtube.com/embed/${props.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${props.videoId}&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`
})

const bindYouTubeAPI = () => {
  // SSR Guard: Ensure window exists and iframe is rendered
  if (!import.meta.client || !(window as any).YT || !(window as any).YT.Player || !iframeRef.value) return

  player = new (window as any).YT.Player(iframeRef.value, {
    events: {
      onStateChange: (event: any) => {
        if (event.data === (window as any).YT.PlayerState.PLAYING) {
          // Video is playing! Dissolve poster instantly and clear the backup failsafe
          isPlaying.value = true
          if (fallbackTimer) clearTimeout(fallbackTimer)
        }
      }
    }
  })
}

const initAPI = () => {
  // SSR GUARD: Prevents the 500 Server Error
  if (!import.meta.client) return

  if ((window as any).YT && (window as any).YT.Player) {
    bindYouTubeAPI()
    return
  }

  if (!(window as any).__YT_CALLBACKS) {
    (window as any).__YT_CALLBACKS = []
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)

    ;(window as any).onYouTubeIframeAPIReady = () => {
      (window as any).__YT_CALLBACKS.forEach((cb: () => void) => cb())
      ;(window as any).__YT_CALLBACKS = []
    }
  }
  ;(window as any).__YT_CALLBACKS.push(bindYouTubeAPI)
}

const onIframeLoad = () => {
  if (!iframeSrc.value) return // Ignore empty iframe loads

  // Failsafe: Only triggers if the API gets blocked by adblockers or severe network lag.
  if (!isPlaying.value) {
    fallbackTimer = setTimeout(() => {
      isPlaying.value = true
    }, 0)
  }
}

watch(() => props.loadPlayer, (isActive) => {
  if (!import.meta.client) return // Strict SSR Guard

  if (isActive) {
    hasBeenActivated.value = true // Inject the src into the iframe natively
    
    if (!player) {
      // 50ms delay gives Vue time to inject the src before binding the API
      setTimeout(() => initAPI(), 50)
    } else if (typeof player.playVideo === 'function') {
      // SLIDE SWITCH RESUME: Play from exactly where it paused
      player.playVideo()
    }
  } else {
    // PAUSE ON SLIDE LEAVE
    if (player && typeof player.pauseVideo === 'function') {
      player.pauseVideo()
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (fallbackTimer) clearTimeout(fallbackTimer)
  if (player && typeof player.destroy === 'function') {
    player.destroy()
  }
})
</script>

<template>
  <div class="absolute inset-0 w-full h-svh min-h-[160px] overflow-hidden pointer-events-none" aria-hidden="true">
    
    <!-- Native Iframe approach (No JS DOM-injection race conditions) -->
    <iframe
      ref="iframeRef"
      :src="iframeSrc"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150dvh] min-w-[177.77dvh] min-h-[56.25vw] opacity-80"
      frameborder="0"
      allow="autoplay; encrypted-media"
      tabindex="-1"
      @load="onIframeLoad"
    ></iframe>

    <!-- Buffer Image & Cinematic Overlay -->
    <div
      :class="[
        'absolute inset-0 transition-opacity duration-1000 ease-in-out z-10 bg-journey-deep',
        isPlaying ? 'opacity-0' : 'opacity-100'
      ]"
    >
      <picture class="block w-full h-full">
        <source media="(min-width: 768px)" :srcset="posterDesktop" type="image/webp" />
        <source media="(max-width: 767px)" :srcset="posterMobile" type="image/webp" />
        <img
          :src="posterDesktop"
          alt=""
          fetchpriority="high"
          class="w-full h-full object-cover object-center"
        />
      </picture>
      
      <!-- The requested poster tint -->
      <div class="absolute inset-0 bg-linear-to-b from-journey-deep/40 via-journey-deep/60 to-journey-deep/80" />
    </div>

  </div>
</template>