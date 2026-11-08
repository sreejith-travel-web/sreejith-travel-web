// ~~/server/utils/itinerariesData.ts
import fs from 'node:fs'
import path from 'node:path'

export type ItineraryType = 'signature' | 'collaborated' | 'essential'
export type ItineraryCategoryId = 'nature' | 'culture' | 'stays' | 'offbeat' | 'wellness' | 'bespoke'

export interface FeaturedHighlight {
  icon: 'boat' | 'village' | 'temple' | 'wellness'
  label: string
}

export interface CollaboratorInfo {
  name: string
  role: string
  avatar: string
}

export interface ItineraryMeta {
  id: string
  slug: string
  type: ItineraryType
  featured: boolean
  featuredHome?: boolean
  title: string
  region: string
  days: number
  categories: ItineraryCategoryId[]
  tags: [string, string, string]
  intro: string
  image: string
  alt: string
  collaborator?: CollaboratorInfo
  featuredDescription?: string
  highlights?: [FeaturedHighlight, FeaturedHighlight, FeaturedHighlight, FeaturedHighlight]
}

export interface ItinerarySeoConfig {
  pageTitle?: string
  pageDesc?: string
  ogImage?: string
  ogImageAlt?: string
  breadcrumbName?: string
  publishDate?: string
}

export interface ItineraryHeaderSpec {
  breadcrumbs: Array<{ label: string; to?: string }>
  coverImage: string
  coverAlt: string
  eyebrow: string
  title: string
  intro: string
  journeyDetails: Array<{ label: string; value: string }>
}

export interface ItinerarySidebarSpec {
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
  phone?: string
  whatsapp?: string
  email?: string
  shareTitle?: string
  shareText?: string
}

export interface ItinerarySummaryBlockSpec {
  sectionId?: string
  eyebrow?: string
  title?: string
  paragraphs?: string[]
  image?: string
  imageAlt?: string
  imageAspectRatio?: string
  caption?: string
  highlightsTitle?: string
  highlights?: string[]
}

export interface ItineraryProgressionItemSpec {
  id: string
  headerTitle: string
  bodySubtitle?: string
  paragraphs?: string[]
  listTitle?: string
  listItems?: string[]
  imageOrientation?: 'portrait' | 'landscape' | 'square'
  imageLayout?: 'side-by-side' | 'block'
  images?: Array<{ src: string; alt: string; caption?: string }>
}

export interface ItineraryProgressionBlockSpec {
  sectionId?: string
  introTitle?: string
  introParagraphs?: string[]
  title: string
  items: ItineraryProgressionItemSpec[]
}

export interface ItineraryChecklistBlockSpec {
  sectionId?: string
  title: string
  items: string[]
  image?: string
  imageAlt?: string
  imageAspectRatio?: string
}

export interface ItineraryNumberedListBlockSpec {
  sectionId?: string
  title: string
  items: string[]
}

export interface ItineraryQuoteBlockSpec {
  sectionId?: string
  quote: string
  author?: string
}

export interface ItineraryTipNoteBlockSpec {
  sectionId?: string
  title: string
  text: string
}

export interface ItineraryDesignerProfileBlockSpec {
  sectionId?: string
  eyebrow: string
  name: string
  bio: string
  avatar: string
  avatarAlt?: string
}

export interface ItineraryCustomerQueryItemSpec {
  id: string
  question: string
  paragraphs?: string[]
  listTitle?: string
  listItems?: string[]
}

export interface ItineraryCustomerQueryBlockSpec {
  sectionId?: string
  eyebrow?: string
  title: string
  items: ItineraryCustomerQueryItemSpec[]
}

export interface ItineraryMasonryImageSpec {
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  captionMob?: boolean
  captionPc?: boolean
}

export interface ItineraryMasonryBlockSpec {
  sectionId?: string
  eyebrow?: string
  title?: string
  images: Array<string | ItineraryMasonryImageSpec>
  caption?: string
  captions?: string[]
  captionMob?: boolean
  captionPc?: boolean
}

export interface ItinerarySliderBlockSpec {
  sectionId?: string
  eyebrow?: string
  title?: string
  images: Array<string | ItineraryMasonryImageSpec>
  width?: number
  height?: number
  autoplay?: boolean
  interval?: number
  caption?: string
  captions?: string[]
  captionMob?: boolean
  captionPc?: boolean
}

export interface ItineraryYoutubeBlockSpec {
  sectionId?: string
  eyebrow?: string
  title?: string
  video: {
    videoId: string
    thumbnail: string
    alt: string
    width?: number
    height?: number
  }
  caption?: string
}

export type ItineraryContentBlock =
  | { type: 'summary'; data: ItinerarySummaryBlockSpec }
  | { type: 'itinerary'; data: ItineraryProgressionBlockSpec }
  | { type: 'checklist'; data: ItineraryChecklistBlockSpec }
  | { type: 'numbered-list'; data: ItineraryNumberedListBlockSpec }
  | { type: 'quote'; data: ItineraryQuoteBlockSpec }
  | { type: 'tip-note'; data: ItineraryTipNoteBlockSpec }
  | { type: 'designer-profile'; data: ItineraryDesignerProfileBlockSpec }
  | { type: 'customer-query'; data: ItineraryCustomerQueryBlockSpec }
  | { type: 'masonry'; data: ItineraryMasonryBlockSpec }
  | { type: 'slider'; data: ItinerarySliderBlockSpec }
  | { type: 'youtube'; data: ItineraryYoutubeBlockSpec }

export interface ItinerarySectionGroup {
  id: 'overview' | 'itinerary' | 'details' | 'essence' | 'essentials' | string
  label: string
  blocks: ItineraryContentBlock[]
}

export interface ItineraryFullRecord {
  meta: ItineraryMeta
  relatedSlugs: [string, string, string]
  seo: ItinerarySeoConfig
  header: ItineraryHeaderSpec
  sidebar: ItinerarySidebarSpec
  sections: ItinerarySectionGroup[]
}

/** Payload returned by /api/itineraries/[slug] with pre-resolved related cards */
export interface ItinerarySinglePayload extends ItineraryFullRecord {
  relatedItems: ItineraryMeta[]
}

const DATA_DIR = path.resolve(process.cwd(), 'server/data/itineraries')

const TIER_RANK: Record<ItineraryType, number> = {
  signature: 1,
  collaborated: 2,
  essential: 3
}

const extractIdNumber = (id: string): number => {
  const num = Number.parseInt(id.replace(/[^0-9]/g, ''), 10)
  return Number.isNaN(num) ? 999 : num
}

function loadItinerariesFromDisk(): ItineraryFullRecord[] {
  if (!fs.existsSync(DATA_DIR)) return []

  const files: string[] = fs
    .readdirSync(DATA_DIR)
    .filter((file: string) => file.endsWith('.json'))
  const records: ItineraryFullRecord[] = []

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')
      const parsed = JSON.parse(raw) as ItineraryFullRecord
      if (parsed?.meta?.slug) {
        records.push(parsed)
      }
        } catch (err) {
      console.error(`[itinerariesData] Failed to parse ${file}:`, err)
    }
  }

  // Sort by Tier (signature -> collaborated -> essential) then numeric ID (sig-1 -> sig-15)
  return records.sort((a, b) => {
    const tierDiff = (TIER_RANK[a.meta.type] || 99) - (TIER_RANK[b.meta.type] || 99)
    if (tierDiff !== 0) return tierDiff
    return extractIdNumber(a.meta.id) - extractIdNumber(b.meta.id)
  })
}

export const ITINERARIES_DATABASE: ItineraryFullRecord[] = loadItinerariesFromDisk()