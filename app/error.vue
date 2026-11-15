<!-- ~/app/error.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { NuxtError } from '#app'
import { clearError, useHead } from '#imports'

defineProps<{
  error?: Partial<NuxtError>
}>()

const isTabHidden = ref(false)

const onVisibilityChange = () => {
  isTabHidden.value = document.hidden
}

const handleNavigate = (targetPath: string) => {
  clearError({ redirect: targetPath })
}

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

useHead({
  title: '404 — Page Not Found | Sree Jith Travel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'theme-color', content: '#03192E' }
  ]
})
</script>

<template>
  <main
    data-theme="dark"
    aria-labelledby="error-404-heading"
    :class="[
      'error-stage relative isolate w-full min-w-60 min-h-[max(600px,100dvh)] overflow-hidden grid grid-cols-1 grid-rows-1 select-none text-white',
      { 'is-paused': isTabHidden }
    ]"
  >
    <!-- 1. Full-Screen Atmospheric Twilight Sky-to-Lagoon Backdrop -->
    <div aria-hidden="true" class="error-sky-backdrop pointer-events-none absolute inset-0 -z-20" />

    <!-- 2. Unified Full-Screen Scenic Canvas + Floating Lagoon Copy & Dual CTAs -->
    <div class="relative z-10 w-full h-full flex flex-col items-center justify-center pt-3 sm:pt-5 pb-14 sm:pb-20 px-3 2xs:px-5 sm:px-8">
      <!-- ============================================================
           FULL-BLEED VECTOR HORIZON (overflow-visible spans 100vw × 100dvh,
           while the 520×462 core viewBox scales cleanly from 240px to 4K)
           ============================================================ -->
      <div class="relative w-full max-w-176 lg:max-w-3xl flex items-end justify-center pointer-events-none">
        <svg
          viewBox="240 14 520 456"
          width="520"
          height="456"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
          class="w-full h-auto max-h-[max(255px,46dvh)] sm:max-h-[max(290px,49dvh)] lg:max-h-[max(310px,51dvh)] overflow-visible block"
        >
          <defs>
            <!-- Sun & Halo Gradients -->
            <radialGradient id="sunHaloGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#F9C851" stop-opacity="0.48" />
              <stop offset="44%" stop-color="#F29E2E" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#F29E2E" stop-opacity="0" />
            </radialGradient>

            <linearGradient id="sunDiscGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFF5B8" />
              <stop offset="52%" stop-color="#F8B830" />
              <stop offset="100%" stop-color="#E27C1D" />
            </linearGradient>

            <!-- 404 Monumental Champagne-Gold Gradient -->
            <linearGradient id="numeral404Grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFF9EB" />
              <stop offset="50%" stop-color="#F7CC7F" />
              <stop offset="100%" stop-color="#DC9130" />
            </linearGradient>

            <!-- Cloud Gradients -->
            <linearGradient id="cloudLitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#A8D5E2" stop-opacity="0.46" />
              <stop offset="65%" stop-color="#3E7C94" stop-opacity="0.24" />
              <stop offset="100%" stop-color="#0E3F57" stop-opacity="0" />
            </linearGradient>

            <!-- Western Ghats Layered Ridge Gradients -->
            <linearGradient id="ridgeFarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1E657E" />
              <stop offset="100%" stop-color="#0C3950" />
            </linearGradient>

            <linearGradient id="ridgeSunlitGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stop-color="#31839A" />
              <stop offset="48%" stop-color="#16566E" />
              <stop offset="100%" stop-color="#092E44" />
            </linearGradient>

            <linearGradient id="ridgeMidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#17546C" />
              <stop offset="100%" stop-color="#07273B" />
            </linearGradient>

            <linearGradient id="ridgeForeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0E3B52" />
              <stop offset="100%" stop-color="#051F33" />
            </linearGradient>

            <!-- Valley Mist Ribbon Gradient -->
            <linearGradient id="valleyMistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#B9E3EE" stop-opacity="0.34" />
              <stop offset="58%" stop-color="#76B8CB" stop-opacity="0.14" />
              <stop offset="100%" stop-color="#0A344B" stop-opacity="0" />
            </linearGradient>

            <!-- Full-Depth Backwater Lagoon Filling Seamlessly Behind Copy & Buttons -->
            <linearGradient id="lagoonDeepFullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#145870" />
              <stop offset="12%" stop-color="#0B3B53" />
              <stop offset="34%" stop-color="#06253A" />
              <stop offset="68%" stop-color="#04192B" />
              <stop offset="100%" stop-color="#02101D" />
            </linearGradient>

            <!-- Kettuvallam Bamboo Canopy Gradient -->
            <linearGradient id="boatCanopyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#F1BC5E" />
              <stop offset="55%" stop-color="#C8872E" />
              <stop offset="100%" stop-color="#7E4E14" />
            </linearGradient>
          </defs>

          <!-- LAYER 1: Wide Starry Twilight Canopy (Spans Ultrawide + Tall Mobile Top Sky) -->
          <g class="anim-stars-a" fill="#FFF6DC">
            <circle cx="-480" cy="-35" r="1.4" opacity="0.45" />
            <circle cx="-160" cy="36" r="1.3" opacity="0.48" />
            <circle cx="110" cy="-28" r="1.3" opacity="0.42" />
            <circle cx="272" cy="34" r="1.4" opacity="0.55" />
            <circle cx="385" cy="-22" r="1.2" opacity="0.44" />
            <circle cx="595" cy="24" r="1.3" opacity="0.5" />
            <circle cx="732" cy="-18" r="1.4" opacity="0.46" />
            <circle cx="890" cy="44" r="1.5" opacity="0.45" />
            <circle cx="1220" cy="-12" r="1.3" opacity="0.42" />
          </g>
          <g class="anim-stars-b" fill="#FDE6A6">
            <circle cx="-310" cy="58" r="1.2" opacity="0.38" />
            <circle cx="45" cy="54" r="1.5" opacity="0.5" />
            <circle cx="328" cy="68" r="1.2" opacity="0.45" />
            <circle cx="486" cy="20" r="1.2" opacity="0.42" />
            <circle cx="658" cy="-34" r="1.3" opacity="0.46" />
            <circle cx="748" cy="96" r="1.2" opacity="0.44" />
            <circle cx="1065" cy="64" r="1.4" opacity="0.38" />
          </g>

          <!-- LAYER 2: Radiant Sun Halo & Breathing Sun (Centered in the '0' of 404) -->
          <g class="anim-sun-breathe" style="transform-origin: 500px 244px">
            <circle cx="500" cy="238" r="245" fill="url(#sunHaloGrad)" />
            <circle cx="500" cy="248" r="46" fill="url(#sunDiscGrad)" />
          </g>

          <!-- LAYER 3: Drifting High Clouds (Framed for Mobile + Extended for Ultrawide) -->
          <g class="anim-cloud-left">
            <path
              d="M -380 142 H -210 C -210 126 -232 116 -250 120 C -262 102 -294 100 -310 116 C -332 112 -358 124 -380 142 Z"
              fill="url(#cloudLitGrad)"
            />
            <path
              d="M 224 134 H 374 C 370 118 352 110 336 114 C 324 96 296 94 282 110 C 264 106 242 116 224 134 Z"
              fill="url(#cloudLitGrad)"
            />
          </g>

          <g class="anim-cloud-right">
            <path
              d="M 652 178 H 806 C 802 162 784 154 768 158 C 756 140 728 140 714 154 C 696 150 670 160 652 178 Z"
              fill="url(#cloudLitGrad)"
            />
            <path
              d="M 1060 132 H 1245 C 1240 114 1218 106 1198 110 C 1182 92 1150 92 1132 108 C 1108 105 1080 115 1060 132 Z"
              fill="url(#cloudLitGrad)"
            />
          </g>

          <!-- LAYER 4: Far Horizon Mountain Silhouette (Spans -2400..3400 for 21:9 Ultrawides) -->
          <path
            d="M -2400 344 L -2080 248 L -1760 298 L -1440 240 L -1160 294 L -910 236 L -670 290 L -430 232 L -210 286 L 10 224 L 195 280 L 348 226 L 500 276 L 652 222 L 818 282 L 1015 226 L 1240 288 L 1490 232 L 1760 294 L 2060 238 L 2380 296 L 2740 240 L 3100 294 L 3400 344 Z"
            fill="url(#ridgeFarGrad)"
            opacity="0.74"
          />

          <!-- LAYER 5: Monumental '404' (Josefin Sans / font-uppercase, Masked at Base by Ridges) -->
          <text
            x="500"
            y="292"
            text-anchor="middle"
            fill="url(#numeral404Grad)"
            class="error-svg-404"
          >
            404
          </text>

          <!-- Reinforce Sun Disc Inside '0' Counter Above Text Fill -->
          <circle cx="500" cy="252" r="41" fill="url(#sunDiscGrad)" />

          <!-- LAYER 6: Golden Loop-de-Loop Flight Trajectory + Gliding Aircraft -->
          <g>
            <path
              d="M 382 224 C 408 130, 472 96, 548 104 C 608 110, 666 118, 670 90 C 673 66, 636 64, 632 88 C 629 112, 674 102, 712 72"
              fill="none"
              stroke="#F7C55F"
              stroke-width="1.6"
              stroke-dasharray="5 6"
              stroke-linecap="round"
              opacity="0.35"
            />
            <path
              d="M 382 224 C 408 130, 472 96, 548 104 C 608 110, 666 118, 670 90 C 673 66, 636 64, 632 88 C 629 112, 674 102, 712 72"
              fill="none"
              stroke="#FFE08C"
              stroke-width="2"
              stroke-dasharray="5 6"
              stroke-linecap="round"
              class="anim-flight-trail"
            />
            <g class="anim-plane" style="transform-origin: 730px 58px">
              <g transform="translate(730, 58) rotate(-17) scale(0.9)">
                <path d="M -32 2 L -15 1" stroke="#FFE39E" stroke-width="1.8" stroke-linecap="round" opacity="0.82" />
                <path d="M -2 -2 L -11 -13 L -5 -13 L 6 -2 Z" fill="#E6A336" />
                <path
                  d="M -20 2 C -12 -2, 8 -3, 22 -1 C 26 -0.5, 28 1, 24 2.8 C 12 4.5, -8 4.5, -20 2 Z"
                  fill="#FFF9EE"
                />
                <path d="M -19 1.5 L -26 -8 L -20 -8 L -13 1 Z" fill="#F2B243" />
                <path d="M 3 1.5 L -9 13 L -2 13 L 11 1.5 Z" fill="#F5BA4B" />
              </g>
            </g>
          </g>

          <!-- LAYER 7: Soft Valley Mist Clouds Overlapping Base of 404 -->
          <g class="anim-mist-a">
            <path
              d="M 272 288 C 292 270, 322 268, 342 279 C 360 264, 392 266, 408 282 C 424 275, 444 278, 456 290 Z"
              fill="url(#valleyMistGrad)"
            />
            <path
              d="M 542 286 C 562 270, 592 270, 610 280 C 628 267, 658 270, 674 286 Z"
              fill="url(#valleyMistGrad)"
            />
          </g>

          <!-- LAYER 8: Sunlit Central & Midground Western Ghats Ridges (Masking 404 Base) -->
          <path
            d="M -2400 388 L -2060 288 L -1740 338 L -1420 268 L -1140 330 L -880 264 L -630 326 L -390 260 L -165 320 L 42 252 L 210 310 L 352 262 L 448 294 L 542 234 L 648 298 L 764 252 L 915 314 L 1110 256 L 1335 322 L 1590 262 L 1870 326 L 2160 268 L 2480 328 L 2840 270 L 3400 388 Z"
            fill="url(#ridgeSunlitGrad)"
          />

          <g class="anim-mist-b">
            <ellipse cx="140" cy="322" rx="220" ry="22" fill="url(#valleyMistGrad)" />
            <ellipse cx="515" cy="306" rx="230" ry="25" fill="url(#valleyMistGrad)" />
            <ellipse cx="885" cy="326" rx="220" ry="21" fill="url(#valleyMistGrad)" />
          </g>

          <path
            d="M -2400 392 L -2020 316 L -1690 354 L -1380 300 L -1090 350 L -820 296 L -560 348 L -310 294 L -95 344 L 92 290 L 242 338 L 368 296 L 482 344 L 604 296 L 722 342 L 868 290 L 1035 346 L 1245 300 L 1485 352 L 1760 304 L 2060 354 L 2420 306 L 2820 356 L 3400 392 Z"
            fill="url(#ridgeMidGrad)"
          />

          <path
            d="M -2400 394 L -1960 342 L -1620 374 L -1290 336 L -980 372 L -690 334 L -410 370 L -160 336 L 45 368 L 212 342 L 352 374 L 502 350 L 638 376 L 786 340 L 955 372 L 1165 338 L 1405 374 L 1690 340 L 2010 376 L 2390 342 L 2810 376 L 3400 394 Z"
            fill="url(#ridgeForeGrad)"
          />

          <!-- LAYER 9: Seamless Full-Viewport Lagoon Expanse (Extends Behind Text, Buttons & Hills) -->
          <rect x="-2600" y="384" width="6200" height="1400" fill="url(#lagoonDeepFullGrad)" />

          <line
            x1="-2600"
            y1="385"
            x2="3600"
            y2="385"
            stroke="#5BA8BF"
            stroke-opacity="0.24"
            stroke-width="1"
          />

          <!-- Subtle Ambient Lower-Lagoon Water Currents Behind Copy & Buttons -->
          <g class="anim-mist-a" fill="none" stroke-linecap="round">
            <path
              d="M -1400 492 Q -700 478, 0 492 T 1400 492 T 2800 492"
              stroke="#68B7CE"
              stroke-width="1"
              opacity="0.11"
            />
            <path
              d="M -1400 572 Q -650 588, 80 572 T 1520 572 T 2800 572"
              stroke="#F3BE52"
              stroke-width="0.9"
              opacity="0.08"
            />
            <path
              d="M -1400 658 Q -600 644, 140 658 T 1600 658 T 2800 658"
              stroke="#68B7CE"
              stroke-width="1"
              opacity="0.09"
            />
          </g>

          <!-- Left Cove Dark Headland -->
          <path
            d="M -2400 368 Q -480 352, 60 372 Q 195 380, 318 406 Q 210 415, -2400 416 Z"
            fill="#041B2D"
          />

          <!-- LAYER 10: Map Pin + Dotted Water Route + Gliding Kerala Kettuvallam Houseboat -->
          <path
            d="M 278 408 C 352 444, 492 448, 598 428"
            fill="none"
            stroke="#F3B844"
            stroke-width="1.6"
            stroke-dasharray="3.5 6.5"
            stroke-linecap="round"
            opacity="0.64"
            class="anim-water-route"
          />

          <ellipse
            cx="276"
            cy="408"
            rx="15"
            ry="3"
            fill="none"
            stroke="#F5BE4F"
            stroke-width="1"
            opacity="0.46"
            class="anim-pin-ripple"
          />
          <g class="anim-map-pin" style="transform-origin: 276px 396px">
            <path
              d="M 276 404 C 276 404, 265.5 391.5, 265.5 384 A 10.5 10.5 0 1 1 286.5 384 C 286.5 391.5, 276 404, 276 404 Z"
              fill="#F5B335"
            />
            <circle cx="276" cy="384" r="4" fill="#062338" />
          </g>

          <!-- Right Lagoon: Gliding Kerala Kettuvallam Houseboat + Water Reflections -->
          <g class="anim-houseboat" style="transform-origin: 668px 425px">
            <g class="anim-water-ripples" stroke-linecap="round">
              <line x1="590" y1="436" x2="746" y2="436" stroke="#F6C45C" stroke-width="1.35" opacity="0.55" />
              <line x1="606" y1="441" x2="732" y2="441" stroke="#7CC4D8" stroke-width="1.15" opacity="0.38" />
              <line x1="618" y1="446" x2="718" y2="446" stroke="#F6C45C" stroke-width="1.05" opacity="0.36" />
              <line x1="634" y1="451" x2="702" y2="451" stroke="#7CC4D8" stroke-width="0.95" opacity="0.24" />
            </g>

            <path
              d="M 618 421 Q 668 396, 718 421 Z"
              fill="url(#boatCanopyGrad)"
            />
            <rect x="623" y="416" width="90" height="8.5" rx="2" fill="#8C5819" />
            <g class="anim-lantern-glow" fill="#FFE699">
              <rect x="635" y="418" width="8" height="4.5" rx="1" />
              <rect x="650" y="418" width="10" height="4.5" rx="1" />
              <rect x="666" y="418" width="10" height="4.5" rx="1" />
              <rect x="682" y="418" width="8" height="4.5" rx="1" />
              <rect x="695" y="418" width="7" height="4.5" rx="1" />
            </g>
            <path
              d="M 615 417 Q 668 397, 721 417"
              fill="none"
              stroke="#FAD07A"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line x1="644" y1="406" x2="644" y2="423" stroke="#5A370D" stroke-width="1" opacity="0.55" />
            <line x1="668" y1="403" x2="668" y2="423" stroke="#5A370D" stroke-width="1" opacity="0.55" />
            <line x1="692" y1="406" x2="692" y2="423" stroke="#5A370D" stroke-width="1" opacity="0.55" />

            <path
              d="M 594 418.5 Q 607 424, 621 424 L 715 424 Q 729 424, 742 417 Q 735 432, 713 433 L 623 433 Q 601 432, 594 418.5 Z"
              fill="#071C2C"
              stroke="#D89B3C"
              stroke-width="0.9"
            />
            <path
              d="M 607 427 Q 668 431, 729 426.5"
              fill="none"
              stroke="#F3BA4A"
              stroke-width="1"
              opacity="0.7"
            />
          </g>
        </svg>
      </div>

      <!-- ============================================================
           FLOATING LAGOON EDITORIAL COPY & DUAL RESPONSIVE PILL CTAS
           ============================================================ -->
      <div class="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center text-center mt-2 sm:mt-3">
        <span id="error-404-heading" class="sr-only">Error 404 — Page Not Found</span>

        <!-- Not all who wander are lost. (font-primary / Lato) -->
        <p class="font-primary text-[clamp(1.5rem,6.4vw,2.75rem)] font-normal tracking-[-0.01em] text-[#F8FAFC] leading-[1.15] text-balance drop-shadow-[0_2px_12px_rgba(2,16,29,0.55)]">
          Not all who wander are lost.
        </p>

        <!-- But this page might be. (Cormorant Garamond Italic) -->
        <p class="error-quote-subline text-[clamp(1.22rem,4.9vw,2.05rem)] text-[#E6EEF2] leading-[1.22] mt-1 sm:mt-1.5 drop-shadow-[0_2px_10px_rgba(2,16,29,0.5)]">
          But this page might be.
        </p>

        <!-- Short Golden Divider -->
        <span
          aria-hidden="true"
          class="w-11 2xs:w-12 sm:w-14 h-0.5 rounded-full bg-[#E89D24] my-3.5 2xs:my-4 sm:my-5 shadow-[0_0_12px_rgba(232,157,36,0.45)]"
        />

        <!-- Dual Pill Buttons (font-uppercase / Josefin Sans — Responsive down to 240px) -->
        <div class="w-full max-w-72 2xs:max-w-xs sm:max-w-none flex flex-col sm:flex-row items-center justify-center gap-2.5 2xs:gap-3 sm:gap-4 mt-0.5">
          <!-- 1. Want to Wander? -> /itineraries -->
          <a
            href="/itineraries"
            class="group w-full sm:w-auto sm:min-w-54 inline-flex items-center justify-center gap-2 2xs:gap-2.5 rounded-full px-4 2xs:px-6 sm:px-7 py-3 2xs:py-3.5 bg-linear-to-b from-[#F8BC3B] to-[#DE8914] hover:from-[#FCC74F] hover:to-[#E8941C] active:scale-[0.98] text-journey-deep shadow-[0_10px_28px_-6px_rgba(242,158,35,0.48)] transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF3C4]"
            @click.prevent="handleNavigate('/itineraries')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="w-5 h-5 2xs:w-6 2xs:h-6 shrink-0 transition-transform duration-500 group-hover:rotate-75 group-active:rotate-75"
            >
              <circle cx="12" cy="12" r="9.5" />
              <polygon
                points="15.8 8.2 13.4 13.4 8.2 15.8 10.6 10.6 15.8 8.2"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            <span class="font-uppercase text-[10.5px] 2xs:text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-[0.12em] 2xs:tracking-[0.16em] leading-none pt-0.5 whitespace-nowrap">
              Want to Wander?
            </span>
          </a>

          <!-- 2. Take Me Home -> / -->
          <a
            href="/"
            class="group perspective-1000 transform-preserve-3d w-full sm:w-auto sm:min-w-54 inline-flex items-center justify-center gap-2 2xs:gap-2.5 rounded-full px-4 2xs:px-6 sm:px-7 py-3 2xs:py-3.5 border border-[#F3C878]/65 bg-[#072840]/65 hover:bg-[#0D3958]/85 hover:border-[#FAD894] active:scale-[0.98] text-[#F8FAFC] backdrop-blur-xs transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F3C878]"
            @click.prevent="handleNavigate('/')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="w-5 h-5 2xs:w-6 2xs:h-6 shrink-0 duration-500 transition-transform group-hover:rotate-x-45 group-active:rotate-x-45"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5.5 9.5V20h13V9.5" />
              <path d="M9.5 20v-5.5h5V20" />
            </svg>
            <span class="font-uppercase text-[10.5px] 2xs:text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-[0.12em] 2xs:tracking-[0.16em] leading-none pt-0.5 whitespace-nowrap">
              Take Me Home
            </span>
          </a>
        </div>
      </div>
    </div>

    <!-- 3. Bottom Rolling Hills & Flowing Golden Topographic Contour Waves -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        class="w-full h-14 sm:h-20 lg:h-24 block"
      >
        <path
          d="M0 68 C 240 16, 480 108, 760 76 C 1040 44, 1240 8, 1440 46 L 1440 120 L 0 120 Z"
          fill="#021221"
          opacity="0.92"
        />
        <path
          d="M0 84 C 290 42, 590 118, 920 82 C 1160 56, 1310 34, 1440 62 L 1440 120 L 0 120 Z"
          fill="#010B15"
        />
        <g fill="none" class="anim-contour-waves">
          <path
            d="M -60 66 C 220 12, 490 112, 790 74 C 1070 38, 1260 6, 1500 48"
            stroke="#E5A235"
            stroke-width="1.5"
            opacity="0.78"
          />
          <path
            d="M -60 79 C 250 30, 520 118, 825 82 C 1095 50, 1280 22, 1500 60"
            stroke="#D4922A"
            stroke-width="1"
            opacity="0.42"
          />
          <path
            d="M -60 92 C 280 50, 560 122, 865 92 C 1120 66, 1300 40, 1500 74"
            stroke="#C78520"
            stroke-width="0.8"
            opacity="0.25"
          />
        </g>
      </svg>
    </div>
  </main>
</template>

<style scoped>
.error-stage {
  --tempo-sun: 7.5s;
  --tempo-cloud-slow: 26s;
  --tempo-cloud-med: 21s;
  --tempo-plane: 7.2s;
  --tempo-trail: 2.8s;
  --tempo-mist-a: 22s;
  --tempo-mist-b: 30s;
  --tempo-boat: 9s;
  --tempo-pin: 4s;
  --tempo-contour: 12s;
  background-color: #02101d;
}

.error-sky-backdrop {
  background-image:
    radial-gradient(64% 44% at 50% 34%, rgba(45, 138, 162, 0.44) 0%, rgba(16, 76, 102, 0.2) 54%, transparent 100%),
    linear-gradient(180deg, #031729 0%, #072d47 26%, #0f4c67 44%, #09354c 58%, #052034 76%, #02101d 100%);
}

.error-svg-404 {
  font-family: var(--font-uppercase), 'Josefin Sans', sans-serif;
  font-size: 204px;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.error-quote-subline {
  font-family: var(--font-quote, 'Cormorant Garamond'), 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 600;
}

/* =========================================================
   GPU-ONLY CONSTANT AMBIENT CHOREOGRAPHY
   ========================================================= */
.anim-sun-breathe {
  will-change: transform, opacity;
  animation: sunBreathe var(--tempo-sun) ease-in-out infinite;
}

.anim-stars-a {
  animation: starTwinkle 4.8s ease-in-out infinite;
}

.anim-stars-b {
  animation: starTwinkle 6.2s ease-in-out 1.8s infinite;
}

.anim-cloud-left {
  will-change: transform;
  animation: cloudGlideLeft var(--tempo-cloud-slow) ease-in-out infinite;
}

.anim-cloud-right {
  will-change: transform;
  animation: cloudGlideRight var(--tempo-cloud-med) ease-in-out infinite;
}

.anim-flight-trail {
  animation: dashFlow var(--tempo-trail) linear infinite;
}

.anim-plane {
  will-change: transform;
  animation: planeCruise var(--tempo-plane) ease-in-out infinite;
}

.anim-mist-a {
  will-change: transform;
  animation: mistDriftA var(--tempo-mist-a) ease-in-out infinite;
}

.anim-mist-b {
  will-change: transform;
  animation: mistDriftB var(--tempo-mist-b) ease-in-out infinite;
}

.anim-water-route {
  animation: waterDashFlow 3.4s linear infinite;
}

.anim-map-pin {
  will-change: transform;
  animation: pinFloat var(--tempo-pin) ease-in-out infinite;
}

.anim-pin-ripple {
  transform-origin: 276px 408px;
  animation: pinRipple 4s ease-out infinite;
}

.anim-houseboat {
  will-change: transform;
  animation: boatGlide var(--tempo-boat) ease-in-out infinite;
}

.anim-water-ripples {
  animation: waterShimmer 4.5s ease-in-out infinite;
}

.anim-lantern-glow {
  animation: lanternPulse 3.8s ease-in-out infinite;
}

.anim-contour-waves {
  will-change: transform;
  animation: contourSway var(--tempo-contour) ease-in-out infinite;
}

.is-paused *,
.is-paused *::before,
.is-paused *::after {
  animation-play-state: paused !important;
}

@keyframes sunBreathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.96;
  }
  50% {
    transform: scale(1.045);
    opacity: 1;
  }
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.95;
  }
}

@keyframes cloudGlideLeft {
  0%, 100% {
    transform: translate3d(-14px, 0, 0);
  }
  50% {
    transform: translate3d(16px, -3px, 0);
  }
}

@keyframes cloudGlideRight {
  0%, 100% {
    transform: translate3d(14px, 0, 0);
  }
  50% {
    transform: translate3d(-14px, 3px, 0);
  }
}

@keyframes dashFlow {
  from {
    stroke-dashoffset: 22;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes planeCruise {
  0%, 100% {
    transform: translate3d(-4px, 3px, 0) rotate(-1.2deg);
  }
  50% {
    transform: translate3d(6px, -4px, 0) rotate(1.5deg);
  }
}

@keyframes mistDriftA {
  0%, 100% {
    transform: translate3d(-14px, 0, 0);
  }
  50% {
    transform: translate3d(14px, 0, 0);
  }
}

@keyframes mistDriftB {
  0%, 100% {
    transform: translate3d(20px, 0, 0);
  }
  50% {
    transform: translate3d(-20px, 0, 0);
  }
}

@keyframes waterDashFlow {
  from {
    stroke-dashoffset: 20;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pinFloat {
  0%, 100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -5px, 0);
  }
}

@keyframes pinRipple {
  0% {
    transform: scale(0.75);
    opacity: 0.65;
  }
  100% {
    transform: scale(1.45);
    opacity: 0;
  }
}

@keyframes boatGlide {
  0%, 100% {
    transform: translate3d(-8px, 0, 0) rotate(-0.45deg);
  }
  50% {
    transform: translate3d(8px, -2.5px, 0) rotate(0.45deg);
  }
}

@keyframes waterShimmer {
  0%, 100% {
    transform: translate3d(-3px, 0, 0);
    opacity: 0.82;
  }
  50% {
    transform: translate3d(3px, 0, 0);
    opacity: 1;
  }
}

@keyframes lanternPulse {
  0%, 100% {
    opacity: 0.82;
  }
  50% {
    opacity: 1;
  }
}

@keyframes contourSway {
  0%, 100% {
    transform: translate3d(-12px, 0, 0);
  }
  50% {
    transform: translate3d(12px, 0, 0);
  }
}
</style>