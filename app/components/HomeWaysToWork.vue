<!-- ~/app/components/HomeWaysToWork.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import CtaButton from '~/components/CtaButton.vue'

export type WaysBentoIconName = 'users' | 'building' | 'chat' | 'book'
export type WaysPartnerIconName = 'globe' | 'stay' | 'academic' | 'corporate' | 'trust'
export type WaysSculptedTheme =
  | 'trade-brass'
  | 'corporate-slate'
  | 'speaking-laterite'
  | 'academic-moss'
  | 'partner-amber'
  | 'partner-rosewood'
  | 'partner-olive'
  | 'partner-indigo'
  | 'partner-verdigris'

export interface WaysBentoCardItem {
  icon: WaysBentoIconName | (string & {})
  theme?: WaysSculptedTheme | (string & {})
  title: string
  description: string
}

export interface WaysPartnerItem {
  icon?: WaysPartnerIconName | (string & {})
  theme?: WaysSculptedTheme | (string & {})
  label: string
}

export interface HomeWaysToWorkConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  bentoCards?: WaysBentoCardItem[]
  partnersHeading?: string
  partners?: WaysPartnerItem[]
  icons?: string[]
  bottomCta: {
    label: string
    to: string
  }
}

const props = defineProps<{
  data: HomeWaysToWorkConfig
}>()

const DEFAULT_BENTO_CARDS: WaysBentoCardItem[] = [
  {
    icon: 'users',
    theme: 'trade-brass',
    title: 'B2B Travel Trade Partnerships',
    description:
      'Collaborate on tailor-made itineraries, special interest tours, and unique regional stays crafted seamlessly for your clients.'
  },
  {
    icon: 'building',
    theme: 'corporate-slate',
    title: 'Corporate & Leadership Journeys',
    description:
      'Design impactful offsites, executive retreats, and team experiences deeply rooted in local place, craft, and culture.'
  },
  {
    icon: 'chat',
    theme: 'speaking-laterite',
    title: 'Consulting & Keynote Speaking',
    description:
      'Share ground insights through destination advisory, keynote talks, and panel discussions on regenerative tourism.'
  },
  {
    icon: 'book',
    theme: 'academic-moss',
    title: 'Academic & Research Programs',
    description:
      'Partner on faculty-led study tours, field documentation, and research initiatives that support living heritage.'
  }
]

const DEFAULT_PARTNERS: WaysPartnerItem[] = [
  { icon: 'globe', theme: 'partner-amber', label: 'Travel Advisors & Tour Operators' },
  { icon: 'stay', theme: 'partner-rosewood', label: 'Boutique & Heritage Stays' },
  { icon: 'academic', theme: 'partner-olive', label: 'Universities & Study Programs' },
  { icon: 'corporate', theme: 'partner-indigo', label: 'Purpose-Led Brands & Teams' },
  { icon: 'trust', theme: 'partner-verdigris', label: 'NGOs, CSR & Heritage Trusts' }
]

const BENTO_THEME_SEQUENCE: WaysSculptedTheme[] = [
  'trade-brass',
  'corporate-slate',
  'speaking-laterite',
  'academic-moss'
]

const PARTNER_THEME_SEQUENCE: WaysSculptedTheme[] = [
  'partner-amber',
  'partner-rosewood',
  'partner-olive',
  'partner-indigo',
  'partner-verdigris'
]

const PARTNER_ICON_SEQUENCE: WaysPartnerIconName[] = [
  'globe',
  'stay',
  'academic',
  'corporate',
  'trust'
]

const themeClassMap: Record<WaysSculptedTheme, string> = {
  'trade-brass': 'theme-trade-brass',
  'corporate-slate': 'theme-corporate-slate',
  'speaking-laterite': 'theme-speaking-laterite',
  'academic-moss': 'theme-academic-moss',
  'partner-amber': 'theme-partner-amber',
  'partner-rosewood': 'theme-partner-rosewood',
  'partner-olive': 'theme-partner-olive',
  'partner-indigo': 'theme-partner-indigo',
  'partner-verdigris': 'theme-partner-verdigris'
}

const legacyAliasMap: Record<string, WaysSculptedTheme> = {
  cream: 'trade-brass',
  sky: 'corporate-slate',
  peach: 'speaking-laterite',
  sage: 'academic-moss',
  copper: 'partner-verdigris'
}

const resolvedBentoCards = computed<WaysBentoCardItem[]>(() =>
  props.data.bentoCards?.length ? props.data.bentoCards : DEFAULT_BENTO_CARDS
)

const resolvedPartners = computed<WaysPartnerItem[]>(() => {
  if (props.data.partners?.length) return props.data.partners
  if (props.data.icons?.length) {
    return props.data.icons.map((label, idx) => ({
      icon: PARTNER_ICON_SEQUENCE[idx % PARTNER_ICON_SEQUENCE.length],
      theme: PARTNER_THEME_SEQUENCE[idx % PARTNER_THEME_SEQUENCE.length],
      label
    }))
  }
  return DEFAULT_PARTNERS
})

const resolveBentoThemeClass = (card: WaysBentoCardItem, index: number): string => {
  const key = card.theme?.trim().toLowerCase()
  if (key && key in themeClassMap) return themeClassMap[key as WaysSculptedTheme]
  if (key && key in legacyAliasMap) return themeClassMap[legacyAliasMap[key]!]
  return themeClassMap[BENTO_THEME_SEQUENCE[index % BENTO_THEME_SEQUENCE.length]!]
}

const resolvePartnerThemeClass = (item: WaysPartnerItem, index: number): string => {
  const key = item.theme?.trim().toLowerCase()
  if (key && key in themeClassMap) return themeClassMap[key as WaysSculptedTheme]
  if (key && key in legacyAliasMap) return themeClassMap[legacyAliasMap[key]!]
  return themeClassMap[PARTNER_THEME_SEQUENCE[index % PARTNER_THEME_SEQUENCE.length]!]
}

const resolvePartnerIcon = (item: WaysPartnerItem, index: number): WaysPartnerIconName => {
  if (item.icon && item.icon in partnerIconPaths) {
    return item.icon as WaysPartnerIconName
  }
  return PARTNER_ICON_SEQUENCE[index % PARTNER_ICON_SEQUENCE.length]!
}

const partnerIconPaths: Record<WaysPartnerIconName, string> = {
  globe:
    'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
  stay:
    'M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z',
  academic:
    'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
  corporate:
    'm21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25',
  trust:
    'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z'
}
</script>

<template>
  <section
    data-theme="light"
    class="section-wrapper overflow-x-clip bg-bg-light text-primary-light"
  >
    <div class="relative z-10 w-full max-w-7xl flex flex-col items-center">
      <!-- 1. SECTION HEADER -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-8 md:mb-12">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="90"
          class="section-title-wrapper drop-shadow-none!"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <p
          v-motion-fade-up
          :delay="170"
          class="text-secondary-light max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. TOP TIER: 4 SCULPTED BENTO CARDS (HOW WE COLLABORATE) -->
      <div class="ways-bento-grid max-w-5xl">
        <article
          v-for="(card, index) in resolvedBentoCards"
          :key="card.title"
          v-motion-atelier-card
          :delay="120 + index * 80"
          :class="[
            'group partner-card-base',
            resolveBentoThemeClass(card, index)
          ]"
        >
          <!-- Thematic Corner Line-Art Watermark -->
          <svg
            v-if="card.icon === 'users'"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            stroke-width="1.15"
            aria-hidden="true"
            class="partner-card-watermark"
          >
            <circle cx="60" cy="60" r="46" />
            <circle cx="60" cy="60" r="32" stroke-dasharray="3 4" />
            <path d="M60 8v104M8 60h104" />
            <polygon points="60,24 67,53 96,60 67,67 60,96 53,67 24,60 53,53" />
          </svg>

          <svg
            v-else-if="card.icon === 'building'"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            stroke-width="1.15"
            aria-hidden="true"
            class="partner-card-watermark"
          >
            <path d="M18 104V54a42 42 0 0 1 84 0v50" />
            <path d="M34 104V60a26 26 0 0 1 52 0v44" />
            <path d="M50 104V68a10 10 0 0 1 20 0v36" />
            <line x1="10" y1="104" x2="110" y2="104" />
          </svg>

          <svg
            v-else-if="card.icon === 'chat'"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            stroke-width="1.15"
            aria-hidden="true"
            class="partner-card-watermark"
          >
            <circle cx="28" cy="92" r="22" />
            <path d="M28 52a40 40 0 0 1 40 40" />
            <path d="M28 32a60 60 0 0 1 60 60" />
            <path d="M28 12a80 80 0 0 1 80 80" stroke-dasharray="4 4" />
          </svg>

          <svg
            v-else
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            stroke-width="1.15"
            aria-hidden="true"
            class="partner-card-watermark"
          >
            <path d="M16 32c18 0 34 6 44 16v52c-10-10-26-16-44-16V32z" />
            <path d="M104 32c-18 0-34 6-44 16v52c10-10 26-16 44-16V32z" />
            <circle cx="60" cy="24" r="8" />
          </svg>

          <!-- Tinted Mineral Icon Medallion -->
          <div class="partner-card-icon-badge">
            <svg
              v-if="card.icon === 'users'"
              class="w-5.5 h-5.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>

            <svg
              v-else-if="card.icon === 'building'"
              class="w-5.5 h-5.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
            </svg>

            <svg
              v-else-if="card.icon === 'chat'"
              class="w-5.5 h-5.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>

            <svg
              v-else
              class="w-5.5 h-5.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>

          <h3 class="relative z-10 card-title drop-shadow-none! text-journey-deep">
            {{ card.title }}
          </h3>

          <p class="relative z-10 section-subparagraph text-journey-deep/85 mt-1.5 max-w-[48ch]">
            {{ card.description }}
          </p>
        </article>
      </div>

      <!-- 3. EDITORIAL HAIRLINE BRIDGE -->
      <div v-motion-micro-up :delay="140" class="ways-bridge-row">
        <div aria-hidden="true" class="w-10 sm:w-16 h-px bg-dark-gold/45" />
        <span class="card-eyebrow text-journey-deep/85 font-semibold mb-0!">
          {{ data.partnersHeading || 'WHO WE PARTNER WITH' }}
        </span>
        <div aria-hidden="true" class="w-10 sm:w-16 h-px bg-dark-gold/45" />
      </div>

      <!-- 4. BOTTOM TIER: 5 SISTER-TONE ECOSYSTEM CARDS -->
      <div class="ways-partner-flex mb-10 md:mb-12">
        <div
          v-for="(partner, index) in resolvedPartners"
          :key="partner.label"
          v-motion-pill-bloom
          :delay="160 + index * 60"
          :class="[
            'group ways-partner-card',
            resolvePartnerThemeClass(partner, index)
          ]"
        >
          <div class="ways-partner-icon-badge">
            <svg
              class="w-5 h-5 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="partnerIconPaths[resolvePartnerIcon(partner, index)]"
              />
            </svg>
          </div>

          <span class="section-subparagraph font-medium text-journey-deep leading-snug">
            {{ partner.label }}
          </span>
        </div>
      </div>

      <!-- 5. BOTTOM CENTERED CTA -->
      <div v-motion-fade-up :delay="120" class="flex justify-center w-full">
        <CtaButton
          :to="data.bottomCta.to"
          :label="data.bottomCta.label"
          variant="light"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* --- Top 4 Bento Themes --- */
.theme-trade-brass {
  --card-start: #f5edd9;
  --card-end: #e4cfa3;
  --card-glow: rgba(168, 122, 42, 0.28);
  --card-border: rgba(145, 102, 30, 0.34);
  --card-border-hover: rgba(145, 102, 30, 0.62);
  --card-shadow: rgba(112, 76, 18, 0.24);
  --badge-bg: linear-gradient(135deg, #fdf8ec 0%, #ead8af 100%);
  --badge-border: rgba(145, 102, 30, 0.34);
  --card-accent: #7f5410;
}

.theme-corporate-slate {
  --card-start: #e5ecf4;
  --card-end: #c4d5e6;
  --card-glow: rgba(40, 82, 124, 0.24);
  --card-border: rgba(38, 78, 118, 0.32);
  --card-border-hover: rgba(38, 78, 118, 0.6);
  --card-shadow: rgba(20, 50, 82, 0.24);
  --badge-bg: linear-gradient(135deg, #f6f9fc 0%, #d4e2ef 100%);
  --badge-border: rgba(38, 78, 118, 0.32);
  --card-accent: #1e4b75;
}

.theme-speaking-laterite {
  --card-start: #f4e8e1;
  --card-end: #e2c5b6;
  --card-glow: rgba(164, 88, 56, 0.25);
  --card-border: rgba(146, 74, 44, 0.32);
  --card-border-hover: rgba(146, 74, 44, 0.6);
  --card-shadow: rgba(112, 52, 28, 0.22);
  --badge-bg: linear-gradient(135deg, #fcf6f2 0%, #ebd2c5 100%);
  --badge-border: rgba(146, 74, 44, 0.32);
  --card-accent: #853d20;
}

.theme-academic-moss {
  --card-start: #e6eee8;
  --card-end: #c6d7cb;
  --card-glow: rgba(54, 98, 72, 0.24);
  --card-border: rgba(48, 88, 64, 0.32);
  --card-border-hover: rgba(48, 88, 64, 0.6);
  --card-shadow: rgba(28, 60, 42, 0.22);
  --badge-bg: linear-gradient(135deg, #f5faf6 0%, #d3e2d7 100%);
  --badge-border: rgba(48, 88, 64, 0.32);
  --card-accent: #27543a;
}

/* --- Bottom 5 Ecosystem Partner Themes --- */
.theme-partner-amber {
  --card-start: #f6eedc;
  --card-end: #e7d4ad;
  --card-glow: rgba(176, 128, 44, 0.24);
  --card-border: rgba(152, 108, 32, 0.3);
  --card-border-hover: rgba(152, 108, 32, 0.56);
  --card-shadow: rgba(115, 78, 20, 0.2);
  --badge-bg: linear-gradient(135deg, #fef9ee 0%, #eddcb7 100%);
  --badge-border: rgba(152, 108, 32, 0.3);
  --card-accent: #855912;
}

.theme-partner-rosewood {
  --card-start: #f2e6e1;
  --card-end: #dfc3b8;
  --card-glow: rgba(152, 82, 62, 0.24);
  --card-border: rgba(136, 68, 50, 0.3);
  --card-border-hover: rgba(136, 68, 50, 0.56);
  --card-shadow: rgba(104, 48, 34, 0.2);
  --badge-bg: linear-gradient(135deg, #fbf5f2 0%, #e8d0c7 100%);
  --badge-border: rgba(136, 68, 50, 0.3);
  --card-accent: #7a3826;
}

.theme-partner-olive {
  --card-start: #eaefe4;
  --card-end: #cdd8c0;
  --card-glow: rgba(84, 106, 54, 0.24);
  --card-border: rgba(74, 94, 46, 0.3);
  --card-border-hover: rgba(74, 94, 46, 0.56);
  --card-shadow: rgba(52, 68, 30, 0.2);
  --badge-bg: linear-gradient(135deg, #f7faf3 0%, #d9e3cd 100%);
  --badge-border: rgba(74, 94, 46, 0.3);
  --card-accent: #3f5722;
}

.theme-partner-indigo {
  --card-start: #e7ebf4;
  --card-end: #c8d1e5;
  --card-glow: rgba(58, 76, 128, 0.24);
  --card-border: rgba(52, 68, 114, 0.3);
  --card-border-hover: rgba(52, 68, 114, 0.56);
  --card-shadow: rgba(32, 44, 82, 0.2);
  --badge-bg: linear-gradient(135deg, #f6f8fc 0%, #d6deee 100%);
  --badge-border: rgba(52, 68, 114, 0.3);
  --card-accent: #2d3f75;
}

.theme-partner-verdigris {
  --card-start: #e3efed;
  --card-end: #c0d8d4;
  --card-glow: rgba(42, 106, 100, 0.24);
  --card-border: rgba(36, 94, 88, 0.3);
  --card-border-hover: rgba(36, 94, 88, 0.56);
  --card-shadow: rgba(22, 66, 62, 0.2);
  --badge-bg: linear-gradient(135deg, #f4fbfa 0%, #cee2df 100%);
  --badge-border: rgba(36, 94, 88, 0.3);
  --card-accent: #1d5751;
}

/* --- Bento Grid & Sculpted Cards --- */
.ways-bento-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;
  margin-inline: auto;
  align-items: stretch;
}

@media (max-width: 639.98px) {
  .ways-bento-grid {
    max-width: 32rem;
  }
}

@media (min-width: 640px) {
  .ways-bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .ways-bento-grid {
    gap: 1.5rem;
  }
}

.partner-card-base {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  border: 1px solid var(--card-border);
  background-image:
    radial-gradient(120% 95% at 0% 0%, rgba(255, 255, 255, 0.72) 0%, transparent 58%),
    radial-gradient(95% 90% at 100% 100%, var(--card-glow) 0%, transparent 72%),
    linear-gradient(135deg, var(--card-start) 0%, var(--card-end) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    inset 0 -1px 0 rgba(20, 38, 56, 0.05),
    0 10px 24px -16px var(--card-shadow);
  transition:
    translate 500ms var(--ease-editorial),
    scale 500ms var(--ease-editorial),
    border-color 500ms var(--ease-editorial),
    box-shadow 500ms var(--ease-editorial);
}

@media (min-width: 640px) {
  .partner-card-base {
    padding: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .partner-card-base {
    padding: 2rem;
  }
}

.partner-card-base:hover {
  translate: 0 -0.25rem;
}

.partner-card-base:active {
  scale: 0.99;
}

.partner-card-base:hover,
.partner-card-base:active {
  border-color: var(--card-border-hover);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 16px 30px -16px var(--card-shadow);
}

/* --- Hairline Bridge & 5-Card Ecosystem Flex Stage --- */
.ways-bridge-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  margin-top: 2.25rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .ways-bridge-row {
    gap: 1rem;
    margin-top: 2.75rem;
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 768px) {
  .ways-bridge-row {
    margin-top: 3rem;
  }
}

.ways-partner-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  align-items: stretch;
}

@media (min-width: 640px) {
  .ways-partner-flex {
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .ways-partner-flex {
    gap: 1.25rem;
  }
}

@media (min-width: 1280px) {
  .ways-partner-flex {
    gap: 1rem;
  }
}

@media (min-width: 1536px) {
  .ways-partner-flex {
    gap: 1.25rem;
  }
}

.ways-partner-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 28rem;
  border-radius: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--card-border);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  gap: 0.75rem;
  cursor: default;
  background-image:
    radial-gradient(115% 100% at 0% 0%, rgba(255, 255, 255, 0.68) 0%, transparent 55%),
    radial-gradient(95% 95% at 100% 100%, var(--card-glow) 0%, transparent 75%),
    linear-gradient(135deg, var(--card-start) 0%, var(--card-end) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 8px 20px -15px var(--card-shadow);
  transition:
    translate 400ms var(--ease-editorial),
    scale 400ms var(--ease-editorial),
    border-color 400ms var(--ease-editorial),
    box-shadow 400ms var(--ease-editorial);
}

@media (min-width: 481px) {
  .ways-partner-card {
    max-width: none;
    width: calc((100% - 0.75rem - 0.5px) / 2);
  }
}

@media (min-width: 640px) {
  .ways-partner-card {
    width: calc((100% - 1rem - 0.5px) / 2);
    padding: 1rem 1.125rem;
    gap: 0.875rem;
  }
}

@media (min-width: 768px) {
  .ways-partner-card {
    width: calc((100% - 2rem - 0.5px) / 3);
  }
}

@media (min-width: 1024px) {
  .ways-partner-card {
    width: calc((100% - 2.5rem - 0.5px) / 3);
  }
}

@media (min-width: 1280px) {
  .ways-partner-card {
    width: calc((100% - 4rem - 0.5px) / 5);
    padding: 0.875rem;
    gap: 0.625rem;
  }
}

@media (min-width: 1536px) {
  .ways-partner-card {
    width: calc((100% - 5rem - 0.5px) / 5);
    padding: 1rem 1.125rem;
    gap: 0.875rem;
  }
}

.ways-partner-card:hover {
  translate: 0 -0.125rem;
}

.ways-partner-card:active {
  scale: 0.99;
}

.ways-partner-card:hover,
.ways-partner-card:active {
  border-color: var(--card-border-hover);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.88),
    0 12px 24px -14px var(--card-shadow);
}

/* --- Tinted Mineral Icon Medallions & Corner Watermark --- */
.partner-card-icon-badge {
  position: relative;
  z-index: 10;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--badge-border);
  background: var(--badge-bg);
  color: var(--card-accent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 2px 6px -2px var(--card-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: scale 500ms var(--ease-editorial);
}

@media (min-width: 640px) {
  .partner-card-icon-badge {
    margin-bottom: 1.25rem;
  }
}

.group:hover .partner-card-icon-badge {
  scale: 1.06;
}

.group:active .partner-card-icon-badge {
  scale: 0.96;
}

.ways-partner-icon-badge {
  position: relative;
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--badge-border);
  background: var(--badge-bg);
  color: var(--card-accent);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 2px 6px -2px var(--card-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: scale 400ms var(--ease-editorial);
}

@media (min-width: 1280px) {
  .ways-partner-icon-badge {
    width: 2.25rem;
    height: 2.25rem;
  }
}

@media (min-width: 1536px) {
  .ways-partner-icon-badge {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.group:hover .ways-partner-icon-badge {
  scale: 1.06;
}

.group:active .ways-partner-icon-badge {
  scale: 0.96;
}

.partner-card-watermark {
  pointer-events: none;
  user-select: none;
  position: absolute;
  bottom: -1rem;
  right: -1rem;
  width: 8rem;
  height: 8rem;
  opacity: 0.22;
  color: var(--card-accent);
  transition:
    opacity 500ms var(--ease-editorial),
    scale 500ms var(--ease-editorial),
    rotate 500ms var(--ease-editorial);
}

@media (min-width: 640px) {
  .partner-card-watermark {
    width: 9rem;
    height: 9rem;
  }
}

.group:hover .partner-card-watermark {
  opacity: 0.34;
  scale: 1.05;
  rotate: -2deg;
}

.group:active .partner-card-watermark {
  opacity: 0.34;
}
</style>