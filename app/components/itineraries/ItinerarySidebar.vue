<!-- ~/app/components/itineraries/ItinerarySidebar.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface ItinerarySidebarData {
  budgetLabel?: string
  price: string
  priceUnit?: string
  ctaTitle?: string
  ctaSubtitle?: string
  planLabel?: string
  planTo?: string
  enquireLabel?: string
  enquireTo?: string
  partnerEyebrow?: string
  consultLabel?: string
  consultTo?: string
  phone: string
  whatsapp: string
  email: string
  shareTitle?: string
  shareText?: string
}

const props = withDefaults(
  defineProps<{
    data: ItinerarySidebarData
  }>(),
  {
    data: () => ({
      budgetLabel: 'ESTIMATED BUDGET',
      price: 'From USD 1,471',
      priceUnit: 'per person',
      ctaTitle: 'Want this trip, but shaped around you?',
      ctaSubtitle: 'Every route is a starting point—talk to us to adjust the pace, stays, or detours.',
      planLabel: 'Plan Your Journey',
      planTo: '/planYourJourney',
      enquireLabel: 'Enquire',
      enquireTo: '/contact',
      partnerEyebrow: 'FOR TRAVEL PARTNERS',
      consultLabel: 'Consult With Me',
      consultTo: '/planYourJourney',
      phone: '+919943360478',
      whatsapp: '919943360478',
      email: 'sreejith@sreejithtravel.com',
      shareTitle: 'Stories Along the Malabar Coast',
      shareText: 'Explore this bespoke journey along the Malabar Coast.'
    })
  }
)

const isMobilePopupOpen = ref(false)
const canDirectCall = ref(false)
const canNativeShare = ref(false)

const phoneCopied = ref(false)
const shareCopied = ref(false)

let phoneTimer: ReturnType<typeof setTimeout> | null = null
let shareTimer: ReturnType<typeof setTimeout> | null = null

const sanitizedTelHref = computed(() => `tel:${props.data.phone.replace(/\s+/g, '')}`)

const whatsappHref = computed(() => {
  const cleanNum = props.data.whatsapp.replace(/[^\d]/g, '')
  const msg = encodeURIComponent(
    `Hi Sreejith, I would love to enquire about "${props.data.shareTitle || 'this itinerary'}".`
  )
  return `https://wa.me/${cleanNum}?text=${msg}`
})

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`Enquiry: ${props.data.shareTitle || 'Bespoke Itinerary'}`)
  return `mailto:${props.data.email}?subject=${subject}`
})

// --- Smart Call Handler (Direct dial on mobile handset, Copy + Tick Tooltip on desktop) ---
const handleCallAction = async () => {
  if (!import.meta.client) return

  if (canDirectCall.value) {
    window.location.href = sanitizedTelHref.value
    return
  }

  try {
    await navigator.clipboard.writeText(props.data.phone)
    phoneCopied.value = true
    if (phoneTimer) clearTimeout(phoneTimer)
    phoneTimer = setTimeout(() => {
      phoneCopied.value = false
    }, 2200)
  } catch {
    window.location.href = sanitizedTelHref.value
  }
}

// --- Smart Share Handler (Native OS share sheet on mobile, Copy + Tick Tooltip on desktop) ---
const handleShareAction = async () => {
  if (!import.meta.client) return
  const shareUrl = window.location.href

  if (canNativeShare.value && navigator.share) {
    try {
      await navigator.share({
        title: props.data.shareTitle || document.title,
        text: props.data.shareText || '',
        url: shareUrl
      })
      return
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
    }
  }

  try {
    await navigator.clipboard.writeText(shareUrl)
    shareCopied.value = true
    if (shareTimer) clearTimeout(shareTimer)
    shareTimer = setTimeout(() => {
      shareCopied.value = false
    }, 2200)
  } catch {
    // Ignored if clipboard permission denied
  }
}

const lockPageScroll = () => {
  if (!import.meta.client) return
  document.documentElement.classList.add('lenis-stopped', 'overflow-hidden')
  document.body.classList.add('overflow-hidden', 'touch-none')
}

const unlockPageScroll = () => {
  if (!import.meta.client) return
  document.documentElement.classList.remove('lenis-stopped', 'overflow-hidden')
  document.body.classList.remove('overflow-hidden', 'touch-none')
}

const openMobilePopup = () => {
  isMobilePopupOpen.value = true
  lockPageScroll()
}

const closeMobilePopup = () => {
  isMobilePopupOpen.value = false
  unlockPageScroll()
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMobilePopupOpen.value) {
    closeMobilePopup()
  }
}

onMounted(() => {
  const isMobileHandset =
    /Android|iPhone|iPod/i.test(navigator.userAgent) &&
    window.matchMedia('(pointer: coarse)').matches

  canDirectCall.value = isMobileHandset
  canNativeShare.value = isMobileHandset && typeof navigator.share === 'function'

  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  unlockPageScroll()
  if (phoneTimer) clearTimeout(phoneTimer)
  if (shareTimer) clearTimeout(shareTimer)
})
</script>

<template>
  <div class="w-full select-none">
    
    <!-- =========================================================
         1. DESKTOP STICKY SIDEBAR CARD (lg: >= 1024px)
         ========================================================= -->
    <aside
      aria-label="Journey budget and booking options"
      class="hidden lg:flex flex-col w-full rounded-2xl bg-soft-cream/15 border border-dark-gold/30 p-6 xl:p-7 mt-4 shadow-xs"
    >
      <!-- Top Row: Budget Readout + Circular Outline Share Icon -->
      <div class="flex items-start justify-between gap-4 pb-5 border-b border-dark-gold/25">
        <div class="flex flex-col">
          <span class="card-eyebrow font-medium text-journey-deep/60 pt-0.5 mb-1.5">
            {{ data.budgetLabel || 'ESTIMATED BUDGET' }}
          </span>
          <!-- ONLY Price uses font-medium -->
          <span class="section-smaller-subtitle font-medium text-journey-deep mb-1">
            {{ data.price }}
          </span>
          <span class="section-subparagraph font-normal text-secondary-light/80">
            {{ data.priceUnit || 'per person' }}
          </span>
        </div>

        <!-- Share Circular Outline Button (With Light Desktop Copy Tooltip) -->
        <div class="relative shrink-0">
          <button
            id="desktop-sidebar-share-btn"
            name="desktop-sidebar-share"
            type="button"
            aria-label="Share this itinerary"
            @click="handleShareAction"
            class="w-10 h-10 rounded-full border border-intention-blue/40 text-intention-blue hover:bg-intention-blue hover:text-surface-light hover:border-intention-blue flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          >
            <svg
              v-if="shareCopied"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-5 h-5"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <!-- Custom Share SVG -->
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              class="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <!-- Light Surface Tooltip (font-primary, regular weight, single line) -->
          <span
            v-if="shareCopied"
            role="status"
            class="absolute -top-10 right-0 px-3 py-1.5 rounded-lg bg-surface-light text-ink-dark border border-journey-deep/15 shadow-xs section-subparagraph text-xs font-normal leading-none whitespace-nowrap pointer-events-none z-20"
          >
            Link copied
          </span>
        </div>
      </div>

      <!-- Middle Section: Customisation Prompt + Primary CTA + Enquire & 3 Contact Circles -->
      <div class="py-5 border-b border-dark-gold/25 flex flex-col">
        <h2 class="card-title font-medium! text-journey-deep mb-1.5">
          {{ data.ctaTitle || 'Want this trip, but shaped around you?' }}
        </h2>
        <p
          v-if="data.ctaSubtitle"
          class="section-subparagraph font-normal text-secondary-light/85 mb-5"
        >
          {{ data.ctaSubtitle }}
        </p>

        <!-- Primary Button: Plan Your Journey (font-uppercase, font-medium) -->
        <NuxtLink
          id="desktop-plan-journey-link"
          :to="data.planTo || '/planYourJourney'"
          class="w-full py-3.5 px-5 rounded-xl bg-intention-blue/90 hover:bg-intention-blue text-surface-light card-eyebrow mb-3 text-center font-medium tracking-[0.18em] leading-none pt-4 pb-3.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
        >
          {{ data.planLabel || 'Plan Your Journey' }}
        </NuxtLink>

        <!-- Secondary Row: Enquire (Left) + Call, Mail, WhatsApp Circular Outline Icons (Right) -->
        <div class="xl:flex items-center justify-between gap-2.5 mt-2" >
          <NuxtLink
            id="desktop-enquire-link"
            :to="data.enquireTo || '/contact'"
            class="flex-1 h-10 px-4 rounded-xl border border-journey-deep/35 hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light text-journey-deep card-eyebrow font-medium tracking-[0.16em] flex items-center justify-center leading-none pt-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          >
            {{ data.enquireLabel || 'Enquire' }}
          </NuxtLink>

          <div class="flex justify-center items-center pt-4 xl:pt-0 gap-2 shrink-0">
            <!-- 1. Call Circular Button -->
            <div class="relative">
              <button
                id="desktop-call-btn"
                name="desktop-call"
                type="button"
                :aria-label="canDirectCall ? 'Call Sreejith' : 'Copy phone number'"
                @click="handleCallAction"
                class="w-10 h-10 rounded-full border border-intention-blue/40 text-intention-blue hover:bg-intention-blue hover:text-surface-light hover:border-intention-blue flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
              >
                <svg
                  v-if="phoneCopied"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <!-- Custom Call SVG -->
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  class="w-5 h-5"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.3545 22.2323C15.3344 21.7262 11.1989 20.2993 7.44976 16.5502C3.70065 12.8011 2.2738 8.66559 1.76767 6.6455C1.47681 5.48459 2.00058 4.36434 2.88869 3.72997L5.21694 2.06693C6.57922 1.09388 8.47432 1.42407 9.42724 2.80051L10.893 4.91776C11.5152 5.8165 11.3006 7.0483 10.4111 7.68365L9.24234 8.51849C9.41923 9.1951 9.96939 10.5846 11.6924 12.3076C13.4154 14.0306 14.8049 14.5807 15.4815 14.7576L16.3163 13.5888C16.9517 12.6994 18.1835 12.4847 19.0822 13.1069L21.1995 14.5727C22.5759 15.5257 22.9061 17.4207 21.933 18.783L20.27 21.1113C19.6356 21.9994 18.5154 22.5232 17.3545 22.2323ZM8.86397 15.136C12.2734 18.5454 16.0358 19.8401 17.8405 20.2923C18.1043 20.3583 18.4232 20.2558 18.6425 19.9488L20.3056 17.6205C20.6299 17.1665 20.5199 16.5348 20.061 16.2171L17.9438 14.7513L17.0479 16.0056C16.6818 16.5182 16.0047 16.9202 15.2163 16.7501C14.2323 16.5378 12.4133 15.8569 10.2782 13.7218C8.1431 11.5867 7.46219 9.7677 7.24987 8.7837C7.07977 7.9953 7.48181 7.31821 7.99439 6.95208L9.24864 6.05618L7.78285 3.93893C7.46521 3.48011 6.83351 3.37005 6.37942 3.6944L4.05117 5.35744C3.74413 5.57675 3.64162 5.89565 3.70771 6.15943C4.15989 7.96418 5.45459 11.7266 8.86397 15.136Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <!-- Light Surface Tooltip (font-primary, regular weight, single line) -->
              <span
                v-if="phoneCopied"
                role="status"
                class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface-light text-ink-dark border border-journey-deep/15 shadow-xs section-subparagraph text-xs! font-normal leading-none! whitespace-nowrap pointer-events-none z-20"
              >
                Number copied
              </span>
            </div>

            <!-- 2. Mail Circular Button (Dark Peach) -->
            <a
              id="desktop-mail-link"
              :href="mailtoHref"
              aria-label="Send an email to Sreejith"
              class="w-10 h-10 rounded-full border border-dark-peach/45 text-dark-peach hover:bg-dark-peach hover:text-surface-light hover:border-dark-peach flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-peach"
            >
              <!-- Custom Mail SVG -->
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  d="M21 8L17.4392 9.97822C15.454 11.0811 14.4614 11.6326 13.4102 11.8488C12.4798 12.0401 11.5202 12.0401 10.5898 11.8488C9.53864 11.6326 8.54603 11.0811 6.5608 9.97822L3 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>

            <!-- 3. WhatsApp Circular Button (WhatsApp Green, Circular SVG without rounded rect) -->
            <a
              id="desktop-whatsapp-link"
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              class="w-10 h-10 rounded-full border border-whatsapp/50 text-whatsapp hover:bg-whatsapp hover:text-surface-light hover:border-whatsapp flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp"
            >
              <svg
                aria-hidden="true"
                viewBox="100 100 312 312"
                fill="none"
                class="w-5 h-5"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="28"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M123 393l14-65a138 138 0 1150 47z"
                />
                <path
                  fill="currentColor"
                  d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Section: For Travel Partners -->
      <div class="pt-5 flex flex-col">
        <span class="card-eyebrow font-medium text-journey-deep/65 pt-0.5 mb-2.5!">
          {{ data.partnerEyebrow || 'FOR TRAVEL PARTNERS' }}
        </span>
        <NuxtLink
          id="desktop-consult-partner-link"
          :to="data.consultTo || '/planYourJourney'"
          class="w-full py-3 px-4 rounded-xl border border-journey-deep/35 hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light text-journey-deep card-eyebrow mb-0! font-medium tracking-[0.16em]! text-center leading-none pt-3.5 pb-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
        >
          {{ data.consultLabel || 'Consult With Me' }}
        </NuxtLink>
      </div>
    </aside>

    <!-- =========================================================
         2. MOBILE FIXED BOTTOM BAR (< 1024px)
         Left: Price | Right: Share, WhatsApp, Three Dots (•••)
         ========================================================= -->
    <div
      role="region"
      aria-label="Quick journey actions"
      class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-light/95 backdrop-blur-md border-t border-journey-deep/10 px-4 sm:px-6 py-2.5 shadow-sm"
    >
      <div class="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <!-- Left: Price Readout (ONLY price has font-semibold) -->
        <div class="flex flex-col min-w-0">
          <span class="section-paragraph font-semibold! text-journey-deep/90 leading-tight! truncate">
            {{ data.price }}
          </span>
          <span class="card-paragraph font-normal text-secondary-light/80 leading-tight">
            {{ data.priceUnit || 'per person' }}
          </span>
        </div>

        <!-- Right: 3 Same-Sized Circular Outline Buttons (Share, WhatsApp, Three Dots) -->
        <div class="flex items-center gap-2.5 shrink-0">
          <!-- 1. Share -->
          <div class="relative">
            <button
              id="mobile-bar-share-btn"
              name="mobile-bar-share"
              type="button"
              aria-label="Share this itinerary"
              @click="handleShareAction"
              class="w-10 h-10 rounded-full border border-intention-blue/40 text-intention-blue active:bg-intention-blue active:text-surface-light flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none"
            >
              <svg
                v-if="shareCopied"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                class="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <span
              v-if="shareCopied"
              role="status"
              class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface-light text-ink-dark border border-journey-deep/15 shadow-xs section-subparagraph text-xs! font-normal leading-none! whitespace-nowrap pointer-events-none z-20"
            >
              Link copied
            </span>
          </div>

          <!-- 2. WhatsApp (Circular SVG in WhatsApp Green) -->
          <a
            id="mobile-bar-whatsapp-link"
            :href="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enquire on WhatsApp"
            class="w-10 h-10 rounded-full border border-whatsapp/55 text-whatsapp active:bg-whatsapp active:text-surface-light flex items-center justify-center transition-colors duration-200 focus:outline-none"
          >
            <svg
              aria-hidden="true"
              viewBox="100 100 312 312"
              fill="none"
              class="w-5 h-5"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="28"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M123 393l14-65a138 138 0 1150 47z"
              />
              <path
                fill="currentColor"
                d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"
              />
            </svg>
          </a>

          <!-- 3. Three Dots (•••) Circular Outline (Custom SVG, softened journey-deep on mobile) -->
          <button
            id="mobile-bar-more-options-btn"
            name="mobile-bar-more-options"
            type="button"
            aria-label="Open journey booking options"
            :aria-expanded="isMobilePopupOpen"
            aria-controls="mobile-itinerary-options-sheet"
            @click="openMobilePopup"
            class="w-10 h-10 rounded-full border border-journey-deep/35 text-journey-deep/85 active:bg-intention-blue active:text-surface-light flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <svg
              viewBox="0 0 32 32"
              fill="currentColor"
              class="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M28.106 19.944h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.788-0.275-3.2-1.762-3.319-3.506-0.137-1.95 0.975-3.6 2.787-4.137 0.238-0.069 0.488-0.119 0.731-0.181h0.85c0.056 0.019 0.106 0.050 0.169 0.056 1.65 0.269 2.906 1.456 3.262 3.081 0.025 0.125 0.063 0.25 0.094 0.375v0.85c-0.019 0.056-0.050 0.113-0.056 0.169-0.262 1.625-1.419 2.863-3.025 3.238-0.156 0.038-0.3 0.081-0.444 0.119zM4.081 12.056l0.85 0c0.069 0.019 0.131 0.050 0.2 0.056 1.8 0.281 3.206 1.775 3.319 3.537 0.125 1.944-1 3.588-2.819 4.119-0.231 0.069-0.469 0.119-0.7 0.175h-0.85c-0.056-0.019-0.106-0.050-0.162-0.063-1.625-0.3-2.688-1.244-3.194-2.819-0.069-0.206-0.106-0.425-0.162-0.637v-0.85c0.019-0.056 0.050-0.113 0.056-0.169 0.269-1.631 1.419-2.863 3.025-3.238 0.15-0.037 0.294-0.075 0.437-0.113zM15.669 12.056h0.85c0.069 0.019 0.131 0.050 0.2 0.063 1.794 0.281 3.238 1.831 3.313 3.581 0.087 1.969-1.1 3.637-2.931 4.106-0.194 0.050-0.387 0.094-0.581 0.137h-0.85c-0.069-0.019-0.131-0.050-0.2-0.063-1.794-0.275-3.238-1.831-3.319-3.581-0.094-1.969 1.1-3.637 2.931-4.106 0.2-0.050 0.394-0.094 0.588-0.137z" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- =========================================================
         3. MOBILE POPUP BOTTOM SHEET (< 1024px)
         ========================================================= -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out [&>.popup-sheet]:transition-transform [&>.popup-sheet]:duration-300 [&>.popup-sheet]:ease-(--ease-editorial)"
      enter-from-class="opacity-0 [&>.popup-sheet]:translate-y-full"
      enter-to-class="opacity-100 [&>.popup-sheet]:translate-y-0"
      leave-active-class="transition-opacity duration-200 ease-in [&>.popup-sheet]:transition-transform [&>.popup-sheet]:duration-200 [&>.popup-sheet]:ease-in"
      leave-from-class="opacity-100 [&>.popup-sheet]:translate-y-0"
      leave-to-class="opacity-0 [&>.popup-sheet]:translate-y-full"
    >
      <div
        v-if="isMobilePopupOpen"
        id="mobile-itinerary-options-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Journey options"
        data-lenis-prevent
        @wheel.prevent
        @touchmove.prevent
        class="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-journey-deep/35 backdrop-blur-xs overscroll-none touch-none"
        @click.self="closeMobilePopup"
      >
        <div class="popup-sheet w-full max-w-lg mx-auto rounded-t-3xl bg-bg-light border-t border-dark-gold/30 p-6 sm:p-7 shadow-xl will-change-transform">
          
          <!-- Top Header Row: Budget Readout + Share Icon + Close X -->
          <div class="flex items-start justify-between gap-4 pb-5 border-b border-dark-gold/25">
            <div class="flex flex-col">
              <span class="card-eyebrow font-medium text-journey-deep/60 pt-0.5 mb-1.5!">
                {{ data.budgetLabel || 'ESTIMATED BUDGET' }}
              </span>
              <!-- ONLY Price uses font-semibold -->
              <span class="section-smaller-subtitle font-semibold! text-journey-deep/90 mb-1">
                {{ data.price }}
              </span>
              <span class="section-subparagraph font-normal text-secondary-light/80">
                {{ data.priceUnit || 'per person' }}
              </span>
            </div>

            <div class="flex items-center gap-2.5 shrink-0">
              <!-- Share Icon Button -->
              <div class="relative">
                <button
                  id="mobile-popup-share-btn"
                  name="mobile-popup-share"
                  type="button"
                  aria-label="Share this itinerary"
                  @click="handleShareAction"
                  class="w-10 h-10 rounded-full border border-intention-blue/40 text-intention-blue active:bg-intention-blue active:text-surface-light flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <svg
                    v-if="shareCopied"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="w-5 h-5"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <svg
                    v-else
                    viewBox="0 0 24 24"
                    fill="none"
                    class="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>

                <span
                  v-if="shareCopied"
                  role="status"
                  class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface-light text-ink-dark border border-journey-deep/15 shadow-xs section-subparagraph text-xs! font-normal leading-none! whitespace-nowrap pointer-events-none z-20"
                >
                  Link copied
                </span>
              </div>

              <!-- Close Popup X Button -->
              <button
                id="mobile-popup-close-btn"
                name="mobile-popup-close"
                type="button"
                aria-label="Close journey options"
                @click="closeMobilePopup"
                class="w-10 h-10 rounded-full border border-journey-deep/30 text-journey-deep/85 active:bg-intention-blue active:text-surface-light flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Middle CTA Block -->
          <div class="py-5 border-b border-dark-gold/25 flex flex-col">
            <h2 class="card-title font-medium! text-journey-deep/90 mb-1.5!">
              {{ data.ctaTitle || 'Want this trip, but shaped around you?' }}
            </h2>
            <p
              v-if="data.ctaSubtitle"
              class="section-subparagraph font-normal text-secondary-light/85 mb-5"
            >
              {{ data.ctaSubtitle }}
            </p>

            <!-- Plan Your Journey (softened bg-intention-blue/90 on mobile, font-uppercase, font-medium) -->
            <NuxtLink
              id="mobile-popup-plan-link"
              :to="data.planTo || '/planYourJourney'"
              @click="closeMobilePopup"
              class="w-full py-3.5 px-5 rounded-xl bg-intention-blue/90 hover:bg-intention-blue active:bg-intention-blue text-surface-light card-eyebrow mb-3! text-center font-medium tracking-[0.18em]! leading-none pt-4 pb-3.5 transition-colors duration-200"
            >
              {{ data.planLabel || 'Plan Your Journey' }}
            </NuxtLink>

            <!-- Enquire (Left) + Call, Mail, WhatsApp Circular Icons (Right) -->
            <div class="flex items-center justify-between gap-2.5">
              <NuxtLink
                id="mobile-popup-enquire-link"
                :to="data.enquireTo || '/contact'"
                @click="closeMobilePopup"
                class="flex-1 h-10 px-4 rounded-xl border border-journey-deep/30 active:bg-intention-blue active:text-surface-light text-journey-deep/85 card-eyebrow mb-0! font-medium tracking-[0.16em]! flex items-center justify-center leading-none pt-0.5 transition-colors duration-200"
              >
                {{ data.enquireLabel || 'Enquire' }}
              </NuxtLink>

              <div class="flex items-center gap-2 shrink-0">
                <!-- Call Button -->
                <div class="relative">
                  <button
                    id="mobile-popup-call-btn"
                    name="mobile-popup-call"
                    type="button"
                    :aria-label="canDirectCall ? 'Call Sreejith' : 'Copy phone number'"
                    @click="handleCallAction"
                    class="w-10 h-10 rounded-full border border-intention-blue/40 text-intention-blue hover:bg-intention-blue hover:text-surface-light active:bg-intention-blue active:text-surface-light flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  >
                    <svg
                      v-if="phoneCopied"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      class="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.3545 22.2323C15.3344 21.7262 11.1989 20.2993 7.44976 16.5502C3.70065 12.8011 2.2738 8.66559 1.76767 6.6455C1.47681 5.48459 2.00058 4.36434 2.88869 3.72997L5.21694 2.06693C6.57922 1.09388 8.47432 1.42407 9.42724 2.80051L10.893 4.91776C11.5152 5.8165 11.3006 7.0483 10.4111 7.68365L9.24234 8.51849C9.41923 9.1951 9.96939 10.5846 11.6924 12.3076C13.4154 14.0306 14.8049 14.5807 15.4815 14.7576L16.3163 13.5888C16.9517 12.6994 18.1835 12.4847 19.0822 13.1069L21.1995 14.5727C22.5759 15.5257 22.9061 17.4207 21.933 18.783L20.27 21.1113C19.6356 21.9994 18.5154 22.5232 17.3545 22.2323ZM8.86397 15.136C12.2734 18.5454 16.0358 19.8401 17.8405 20.2923C18.1043 20.3583 18.4232 20.2558 18.6425 19.9488L20.3056 17.6205C20.6299 17.1665 20.5199 16.5348 20.061 16.2171L17.9438 14.7513L17.0479 16.0056C16.6818 16.5182 16.0047 16.9202 15.2163 16.7501C14.2323 16.5378 12.4133 15.8569 10.2782 13.7218C8.1431 11.5867 7.46219 9.7677 7.24987 8.7837C7.07977 7.9953 7.48181 7.31821 7.99439 6.95208L9.24864 6.05618L7.78285 3.93893C7.46521 3.48011 6.83351 3.37005 6.37942 3.6944L4.05117 5.35744C3.74413 5.57675 3.64162 5.89565 3.70771 6.15943C4.15989 7.96418 5.45459 11.7266 8.86397 15.136Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  <span
                    v-if="phoneCopied"
                    role="status"
                    class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface-light text-ink-dark border border-journey-deep/15 shadow-xs section-subparagraph text-xs! font-normal leading-none! whitespace-nowrap pointer-events-none z-20"
                  >
                    Number copied
                  </span>
                </div>

                <!-- Mail Button (Dark Peach) -->
                <a
                  id="mobile-popup-mail-link"
                  :href="mailtoHref"
                  aria-label="Send an email to Sreejith"
                  class="w-10 h-10 rounded-full border border-dark-peach/45 text-dark-peach hover:bg-dark-peach hover:text-surface-light active:bg-dark-peach active:text-surface-light flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    class="w-5 h-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 8L17.4392 9.97822C15.454 11.0811 14.4614 11.6326 13.4102 11.8488C12.4798 12.0401 11.5202 12.0401 10.5898 11.8488C9.53864 11.6326 8.54603 11.0811 6.5608 9.97822L3 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>

                <!-- WhatsApp Button (WhatsApp Green, Circular SVG) -->
                <a
                  id="mobile-popup-whatsapp-link"
                  :href="whatsappHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  class="w-10 h-10 rounded-full border border-whatsapp/55 text-whatsapp hover:bg-whatsapp hover:text-surface-light active:bg-whatsapp active:text-surface-light flex items-center justify-center transition-colors duration-200"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="100 100 312 312"
                    fill="none"
                    class="w-5 h-5"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-width="28"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M123 393l14-65a138 138 0 1150 47z"
                    />
                    <path
                      fill="currentColor"
                      d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Bottom Partner Block -->
          <div class="pt-5 flex flex-col">
            <span class="card-eyebrow font-medium text-journey-deep/65 pt-0.5 mb-2.5!">
              {{ data.partnerEyebrow || 'FOR TRAVEL PARTNERS' }}
            </span>
            <NuxtLink
              id="mobile-popup-consult-link"
              :to="data.consultTo || '/planYourJourney'"
              @click="closeMobilePopup"
              class="w-full py-3 px-4 rounded-xl border border-journey-deep/30 hover:bg-intention-blue active:bg-intention-blue active:text-surface-light text-journey-deep/85 card-eyebrow mb-0! font-medium tracking-[0.16em]! text-center leading-none pt-3.5 pb-3 transition-colors duration-200"
            >
              {{ data.consultLabel || 'Consult With Me' }}
            </NuxtLink>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>