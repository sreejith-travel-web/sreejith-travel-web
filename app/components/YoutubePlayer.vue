<!-- ~/app/components/YoutubePlayer.vue -->
<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

export interface YoutubeVideoConfig {
  videoId: string
  thumbnail: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

const props = defineProps<{
  data?: YoutubeVideoConfig
  block?: YoutubeVideoConfig
  videoId?: string
  thumbnail?: string
  alt?: string
  caption?: string
}>()

// Normalized config so the player works via `data`, `block` (CMS/blog), or flat props
const config = computed<YoutubeVideoConfig>(() => {
  const source = props.data || props.block
  return {
    videoId: source?.videoId || props.videoId || '',
    thumbnail: source?.thumbnail || props.thumbnail || '/images/home/travel-video.webp',
    alt: source?.alt || source?.caption || props.alt || props.caption || 'Thoughtful travel video experience',
    caption: source?.caption || props.caption || '',
    width: source?.width || 800,
    height: source?.height || 450
  }
})

const videoWrapperRef = ref<HTMLElement | null>(null)
const playerEl = ref<HTMLElement | null>(null)
const progressBarRef = ref<HTMLElement | null>(null)

const isActive = ref(false)
const isReady = ref(false)
const isPlaying = ref(false)
const isMuted = ref(false)
const showControls = ref(true)
const isFullscreen = ref(false)
const isPseudoFullscreen = ref(false)
const isScrubbing = ref(false)
const isPreconnected = ref(false)
const isCaptionsActive = ref(false)

const currentTime = ref(0)
const duration = ref(0)

let player: any = null
let progressTimer: ReturnType<typeof setInterval> | null = null
let hideControlsTimer: ReturnType<typeof setTimeout> | null = null
let viewportObserver: IntersectionObserver | null = null

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
})

const formatTime = (sec: number) => {
  if (!sec || Number.isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

// Warm up YouTube origins on hover/touch before click for near-0ms iframe boot
const warmUpConnections = () => {
  if (isPreconnected.value || typeof document === 'undefined') return
  isPreconnected.value = true

  const origins = ['https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://i.ytimg.com']
  origins.forEach((href) => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

const revealControls = () => {
  showControls.value = true
  if (hideControlsTimer) clearTimeout(hideControlsTimer)
  if (isPlaying.value) {
    hideControlsTimer = setTimeout(() => {
      if (!isScrubbing.value) showControls.value = false
    }, 3000)
  }
}

const handleSurfaceTap = () => {
  const isTouch = window.matchMedia('(pointer: coarse)').matches
  if (isTouch && !showControls.value) {
    revealControls()
    return
  }
  togglePlay()
  revealControls()
}

const loadYouTubeAPI = () => {
  const win = window as any
  if (win.YT && win.YT.Player) {
    initPlayer()
    return
  }

  if (!win.__YT_CALLBACKS) {
    win.__YT_CALLBACKS = []

    const prevReady = win.onYouTubeIframeAPIReady
    win.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === 'function') prevReady()
      win.__YT_CALLBACKS.forEach((cb: () => void) => cb())
      win.__YT_CALLBACKS = []
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    document.head.appendChild(tag)
  }

  win.__YT_CALLBACKS.push(initPlayer)
}

const activateVideo = async () => {
  if (isActive.value) return
  warmUpConnections()
  isActive.value = true
  await nextTick()
  loadYouTubeAPI()
}

const initPlayer = () => {
  if (!playerEl.value) return
  const win = window as any

  player = new win.YT.Player(playerEl.value, {
    host: 'https://www.youtube-nocookie.com',
    width: '100%',
    height: '100%',
    videoId: config.value.videoId,
    playerVars: {
      autoplay: 1,
      mute: 0, // Immediate sound on user click
      controls: 0,
      rel: 0,
      playsinline: 1,
      modestbranding: 1,
      iv_load_policy: 3,
      fs: 0,
    },
    events: {
      onReady: (e: any) => {
        isReady.value = true
        duration.value = e.target.getDuration() || 0
        try {
          e.target.unMute()
          e.target.setVolume(100)
          isMuted.value = false
          e.target.playVideo()
        } catch {
          // Fallback if strict mobile browser blocks unmuted autoplay
          e.target.mute()
          isMuted.value = true
          e.target.playVideo()
        }
        revealControls()
      },
      onStateChange: (e: any) => {
        if (e.data === win.YT.PlayerState.PLAYING) {
          isPlaying.value = true
          duration.value = player.getDuration() || duration.value
          isMuted.value = typeof player.isMuted === 'function' ? player.isMuted() : isMuted.value
          startProgressLoop()
          revealControls()
        } else {
          isPlaying.value = false
          stopProgressLoop()
          showControls.value = true
        }
      },
    },
  })
}

const startProgressLoop = () => {
  stopProgressLoop()
  progressTimer = setInterval(() => {
    if (player && !isScrubbing.value && typeof player.getCurrentTime === 'function') {
      currentTime.value = player.getCurrentTime() || 0
      if (!duration.value && typeof player.getDuration === 'function') {
        duration.value = player.getDuration() || 0
      }
    }
  }, 200)
}

const stopProgressLoop = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

const togglePlay = () => {
  if (!player || !isReady.value) return
  if (isPlaying.value) {
    player.pauseVideo()
  } else {
    player.playVideo()
  }
}

const seekRelative = (deltaSeconds: number) => {
  if (!player || !isReady.value) return
  const target = Math.max(0, Math.min(duration.value, currentTime.value + deltaSeconds))
  currentTime.value = target
  player.seekTo(target, true)
  revealControls()
}

const toggleMute = () => {
  if (!player || !isReady.value) return
  if (isMuted.value) {
    player.unMute()
    player.setVolume(100)
    isMuted.value = false
  } else {
    player.mute()
    isMuted.value = true
  }
  revealControls()
}

// --- TOUCH & MOUSE SCRUBBING ---
const seekFromClientX = (clientX: number, commit = false) => {
  if (!progressBarRef.value || !duration.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const targetTime = ratio * duration.value
  currentTime.value = targetTime
  if (commit && player && isReady.value) {
    player.seekTo(targetTime, true)
  }
}

const startScrub = (e: MouseEvent) => {
  isScrubbing.value = true
  seekFromClientX(e.clientX, true)

  const onMouseMove = (moveEvent: MouseEvent) => {
    seekFromClientX(moveEvent.clientX, false)
  }
  const onMouseUp = (upEvent: MouseEvent) => {
    seekFromClientX(upEvent.clientX, true)
    isScrubbing.value = false
    revealControls()
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const startTouchScrub = (e: TouchEvent) => {
  if (!e.touches.length) return
  isScrubbing.value = true
  seekFromClientX(e.touches[0]!.clientX, false)
}

const moveTouchScrub = (e: TouchEvent) => {
  if (!e.touches.length) return
  seekFromClientX(e.touches[0]!.clientX, false)
}

const endTouchScrub = (e: TouchEvent) => {
  if (e.changedTouches && e.changedTouches.length) {
    seekFromClientX(e.changedTouches[0]!.clientX, true)
  } else if (player && isReady.value) {
    player.seekTo(currentTime.value, true)
  }
  isScrubbing.value = false
  revealControls()
}

// --- UNIVERSAL FULLSCREEN (Desktop, Android, iPad + iOS Safari Fallback) ---
const toggleFullscreen = async () => {
  const el = videoWrapperRef.value as any
  if (!el) return

  const doc = document as any
  const fsElement = doc.fullscreenElement || doc.webkitFullscreenElement

  if (fsElement || isPseudoFullscreen.value) {
    if (doc.exitFullscreen) {
      await doc.exitFullscreen()
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen()
    }
    isPseudoFullscreen.value = false
    return
  }

  if (el.requestFullscreen) {
    try {
      await el.requestFullscreen()
    } catch {
      isPseudoFullscreen.value = true
    }
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen()
  } else {
    isPseudoFullscreen.value = true
  }
  revealControls()
}

const handleFullscreenChange = () => {
  const doc = document as any
  isFullscreen.value = !!(doc.fullscreenElement || doc.webkitFullscreenElement)
}

// Keyboard accessibility when player is focused
const handleKeydown = (e: KeyboardEvent) => {
  if (!isActive.value) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activateVideo()
    }
    return
  }

  if (e.key === ' ' || e.key === 'k') {
    e.preventDefault()
    togglePlay()
    revealControls()
  } else if (e.key === 'm' || e.key === 'M') {
    e.preventDefault()
    toggleMute()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    seekRelative(10)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    seekRelative(-10)
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault()
    toggleFullscreen()
  } else if (e.key === 'Escape' && isPseudoFullscreen.value) {
    isPseudoFullscreen.value = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

  // Auto-pause when video scrolls completely out of viewport
  if ('IntersectionObserver' in window && videoWrapperRef.value) {
    viewportObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && !entry.isIntersecting && isPlaying.value && !isFullscreen.value && !isPseudoFullscreen.value) {
          player?.pauseVideo?.()
        }
      },
      { threshold: 0.1 }
    )
    viewportObserver.observe(videoWrapperRef.value)
  }
})

onBeforeUnmount(() => {
  stopProgressLoop()
  if (hideControlsTimer) clearTimeout(hideControlsTimer)
  viewportObserver?.disconnect()
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  if (player && typeof player.destroy === 'function') {
    player.destroy()
  }
})
</script>

<template>
  <div
    ref="videoWrapperRef"
    tabindex="0"
    role="region"
    :aria-label="config.alt"
    :data-lenis-prevent="isPseudoFullscreen ? '' : undefined"
    class="w-full aspect-video relative overflow-hidden bg-journey-deep shadow-lg select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-intention-blue"
    :class="[
      isPseudoFullscreen
        ? 'fixed inset-0 z-9999 rounded-none aspect-auto! w-screen h-screen'
        : 'rounded-xl sm:rounded-2xl',
      !isActive ? 'group cursor-pointer' : ''
    ]"
    @pointerenter="warmUpConnections"
    @touchstart.passive="warmUpConnections"
    @click="!isActive && activateVideo()"
    @keydown="handleKeydown"
    @mousemove="isActive && revealControls()"
    @mouseleave="isActive && isPlaying && (showControls = false)"
  >
    <!-- 1. THUMBNAIL FACADE STATE (0 YouTube JS loaded until clicked) -->
    <template v-if="!isActive">
      <img
        :src="config.thumbnail"
        :alt="config.alt"
        :width="config.width"
        :height="config.height"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105"
      />

      <!-- Subtle Editorial Vignette -->
      <div class="absolute inset-0 bg-journey-deep/15 group-hover:bg-journey-deep/25 transition-colors duration-500" />

      <!-- Pulsing Play Button (Intention Blue Circle + Crisp White Icon) -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="relative flex items-center justify-center">
          <!-- Outer Animated Pulse Ring -->
          <span
            class="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-light/35 animate-ping"
            style="animation-duration: 2.4s;"
          />
          <!-- Frosted Halo Cushion -->
          <span
            class="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-light/15 backdrop-blur-[2px] border border-surface-light/30 transition-transform duration-500 ease-editorial group-hover:scale-110 animate-pulse"
            style="animation-duration: 2.4s;"
          />
          <!-- Core Intention Blue Circle -->
          <div
            class="relative z-10 w-12 h-12 sm:w-15 sm:h-15 rounded-full bg-intention-blue text-surface-light flex items-center justify-center shadow-xl transition-transform duration-500 ease-editorial group-hover:scale-105 group-active:scale-95"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Optional Caption -->
      <div
        v-if="config.caption"
        class="absolute bottom-4 sm:bottom-6 inset-x-0 text-center text-surface-light font-uppercase text-[10px] sm:text-xs tracking-[0.22em] uppercase drop-shadow-md px-6 pointer-events-none"
      >
        {{ config.caption }}
      </div>
    </template>

    <!-- 2. ACTIVE PLAYER STATE -->
    <template v-else>
      <!-- YouTube Mount Container -->
      <div class="absolute inset-0 w-full h-full pointer-events-none">
        <div ref="playerEl" class="w-full h-full" />
      </div>

      <!-- Loading Spinner while YouTube initializes -->
      <div
        v-if="!isReady"
        class="absolute inset-0 flex items-center justify-center bg-journey-deep/75 z-10 pointer-events-none"
      >
        <div class="w-10 h-10 border-2 border-warm-gold border-t-transparent rounded-full animate-spin" />
      </div>

      <!-- Interactive Surface -->
      <div
        class="absolute inset-0 z-10 cursor-pointer"
        @click.stop="handleSurfaceTap"
      />

      <!-- Fallback Unmute Pill (Only appears if a strict mobile browser blocked immediate sound) -->
      <button
        v-if="isReady && isMuted"
        type="button"
        class="absolute top-4 right-4 z-20 flex items-center gap-2 bg-journey-deep/85 hover:bg-intention-blue text-surface-light font-uppercase text-[10px] sm:text-xs tracking-[0.18em] uppercase px-3.5 py-2 rounded-full border border-surface-light/20 backdrop-blur-md shadow-lg transition-colors duration-300 cursor-pointer"
        @click.stop="toggleMute"
      >
        <svg class="w-4 h-4 text-warm-gold" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
        <span class="pt-0.5">Tap for Sound</span>
      </button>

      <!-- Custom Bottom Control Bar -->
      <div
        class="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-journey-deep/95 via-journey-deep/65 to-transparent pt-10 pb-3.5 px-4 sm:px-6 transition-opacity duration-300"
        :class="showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
        @click.stop
      >
        <!-- Scrub Progress Bar -->
        <div
          ref="progressBarRef"
          class="group/bar relative w-full h-5 flex items-center cursor-pointer touch-none mb-1.5"
          @mousedown="startScrub"
          @touchstart.passive="startTouchScrub"
          @touchmove.prevent="moveTouchScrub"
          @touchend="endTouchScrub"
        >
          <div class="w-full h-1 group-hover/bar:h-1.5 bg-surface-light/25 rounded-full overflow-hidden transition-all">
            <div
              class="h-full bg-warm-gold rounded-full"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
          <div
            class="absolute w-3.5 h-3.5 bg-warm-gold border-2 border-surface-light rounded-full shadow-md -translate-x-1/2 transform scale-100 sm:scale-0 group-hover/bar:scale-100 transition-transform"
            :style="{ left: `${progressPercent}%` }"
          />
        </div>

        <!-- Controls Row -->
        <div class="flex items-center justify-between text-surface-light">
          
          <!-- LEFT GROUP (Playback, Volume, CC, Time) -->
          <div class="flex items-center gap-2.5 sm:gap-4">
            <!-- Play / Pause -->
            <button
              type="button"
              class="p-1.5 hover:text-warm-gold transition-colors cursor-pointer"
              :aria-label="isPlaying ? 'Pause video' : 'Play video'"
              @click="togglePlay"
            >
              <svg v-if="!isPlaying" class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>

            <!-- Seek Backward (-10s) -->
            <button
              type="button"
              class="p-1.5 hover:text-warm-gold transition-colors flex items-center gap-0.5 font-uppercase text-[10px] sm:text-xs tracking-wider cursor-pointer"
              aria-label="Rewind 10 seconds"
              @click="seekRelative(-10)"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span class="pt-0.5">10s</span>
            </button>

            <!-- Seek Forward (+10s) -->
            <button
              type="button"
              class="p-1.5 hover:text-warm-gold transition-colors flex items-center gap-0.5 font-uppercase text-[10px] sm:text-xs tracking-wider cursor-pointer"
              aria-label="Forward 10 seconds"
              @click="seekRelative(10)"
            >
              <span class="pt-0.5">10s</span>
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
              </svg>
            </button>

            <!-- Mute / Unmute -->
            <button
              type="button"
              class="p-1.5 hover:text-warm-gold transition-colors cursor-pointer"
              :aria-label="isMuted ? 'Unmute video' : 'Mute video'"
              @click="toggleMute"
            >
              <svg v-if="isMuted" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </button>

            <!-- Time Display -->
            <span class="font-primary text-[11px] sm:text-xs text-surface-light/85 tracking-wide tabular-nums ml-1">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </span>
          </div>

          <!-- RIGHT GROUP (YouTube Link & Fullscreen) -->
          <div class="flex items-center gap-1 sm:gap-2">
            
            <!-- Custom Watch on YouTube Link -->
            <a
              :href="`https://www.youtube.com/watch?v=${config.videoId}`"
              target="_blank"
              rel="noopener noreferrer"
              class="p-1.5 hover:text-warm-gold transition-colors cursor-pointer flex items-center"
              aria-label="Watch on YouTube"
              title="Watch on YouTube"
            >
              <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.582 6.186a2.6 2.6 0 00-1.83-1.83C18.138 4 12 4 12 4s-6.138 0-7.752.356a2.6 2.6 0 00-1.83 1.83C2 7.8 2 12 2 12s0 4.2.418 5.814a2.6 2.6 0 001.83 1.83C5.862 20 12 20 12 20s6.138 0 7.752-.356a2.6 2.6 0 001.83-1.83C22 16.2 22 12 22 12s0-4.2-.418-5.814zM10 15.464V8.536L15.818 12 10 15.464z" />
              </svg>
            </a>

            <!-- Fullscreen Toggle -->
            <button
              type="button"
              class="p-1.5 hover:text-warm-gold transition-colors cursor-pointer"
              aria-label="Toggle Fullscreen"
              @click="toggleFullscreen"
            >
              <svg v-if="!isFullscreen && !isPseudoFullscreen" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>