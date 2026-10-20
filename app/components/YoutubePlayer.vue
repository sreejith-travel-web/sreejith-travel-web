<!-- ~/app/components/YoutubePlayer.vue -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  videoId: string
  posterDesktop: string
  posterMobile: string
}>()

const isPlaying = ref(false)
const playerContainer = ref<HTMLDivElement | null>(null)
const playerDiv = ref<HTMLDivElement | null>(null)
let player: any = null
let observer: IntersectionObserver | null = null

const loadYouTubeAPI = () => {
  if ((window as any).YT && (window as any).YT.Player) {
    createPlayer()
    return
  }

  if (!(window as any).__YT_CALLBACKS) {
    (window as any).__YT_CALLBACKS = []

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    
    // Resolve TS warning: Safely inject & fallback to header/body append to secure CWV load metrics
    const firstScriptTag = document.getElementsByTagName('script')[0]
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    } else {
      document.head.appendChild(tag)
    }

    ;(window as any).onYouTubeIframeAPIReady = () => {
      (window as any).__YT_CALLBACKS.forEach((cb: () => void) => cb())
      ;(window as any).__YT_CALLBACKS = []
    }
  }

  ;(window as any).__YT_CALLBACKS.push(createPlayer)
}

const createPlayer = () => {
  if (!playerDiv.value) return

  player = new (window as any).YT.Player(playerDiv.value, {
    host: 'https://www.youtube-nocookie.com',
    height: '100%',
    width: '100%',
    videoId: props.videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 1,
      loop: 1,
      playlist: props.videoId,
      playsinline: 1,
      rel: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      showinfo: 0,
      autohide: 1,
      modestbranding: 1
    },
    events: {
      onReady: (event: any) => {
        event.target.mute()
        event.target.playVideo()
      },
      onStateChange: (event: any) => {
        if (event.data === (window as any).YT.PlayerState.PLAYING) {
          isPlaying.value = true
        }
        if (event.data === (window as any).YT.PlayerState.ENDED) {
          event.target.seekTo(0)
          event.target.playVideo()
        }
      }
    }
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadYouTubeAPI()
          observer?.disconnect()
        }
      })
    },
    { rootMargin: '300px' }
  )

  if (playerContainer.value) {
    observer.observe(playerContainer.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
  if (player && typeof player.destroy === 'function') {
    player.destroy()
  }
})
</script>

<template>
  <div ref="playerContainer" class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
    <!-- Clip YouTube Player in ultra-scale to suppress initial start button and seek branding UI -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120dvh] min-w-[177.77dvh] min-h-[56.25vw] will-change-transform">
      <div ref="playerDiv" class="w-full h-full pointer-events-none" />
    </div>

    <!-- Smooth Gated Buffer Image -->
    <div
      :class="[
        'absolute inset-0 transition-opacity duration-1000 bg-bg-dark will-change-opacity z-10',
        isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
      ]"
    >
      <picture>
        <source media="(min-width: 768px)" :srcset="posterDesktop" type="image/webp" />
        <source media="(max-width: 767px)" :srcset="posterMobile" type="image/webp" />
        <img
          :src="posterDesktop"
          alt="Initial transition video backdrop"
          class="w-full h-full object-cover object-center"
        />
      </picture>
    </div>

    <!-- Active interactive blocker -->
    <div class="absolute inset-0 z-20 bg-transparent" />
  </div>
</template>