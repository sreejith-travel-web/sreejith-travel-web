// ~~/server/utils/journalData.ts
import fs from 'node:fs'
import path from 'node:path'

export type JournalCategoryType = 'insights' | 'stories'

export type JournalSubcategoryId =
  // Insights Subcategories (5)
  | 'field-notes'
  | 'living-heritage'
  | 'responsible-travel'
  | 'research-perspectives'
  | 'ideas-collaborations'
  // Stories Subcategories (5)
  | 'people-communities'
  | 'journey-stories'
  | 'travel-experiences'
  | 'traveller-stories'
  | 'case-studies'

export type JournalLegacyCategoryId =
  | 'nature'
  | 'culture'
  | 'stays'
  | 'offbeat'
  | 'wellness'
  | 'bespoke'

export interface JournalSubcategoryConfig {
  id: JournalSubcategoryId
  category: JournalCategoryType
  label: string
  description: string
  defaultContentTypeLabel: string
  legacyCategory: JournalLegacyCategoryId
}

export const JOURNAL_SUBCATEGORIES: JournalSubcategoryConfig[] = [
  // ==========================================
  // INSIGHTS (5 Subcategories)
  // ==========================================
  {
    id: 'field-notes',
    category: 'insights',
    label: 'Field Notes',
    description: 'Travel observations · Village life · Reflections · Discoveries',
    defaultContentTypeLabel: 'INSIGHT',
    legacyCategory: 'offbeat'
  },
  {
    id: 'living-heritage',
    category: 'insights',
    label: 'Living Heritage',
    description: 'Folk arts · Architecture · Rituals · Crafts · Folklore',
    defaultContentTypeLabel: 'INSIGHT',
    legacyCategory: 'culture'
  },
  {
    id: 'responsible-travel',
    category: 'insights',
    label: 'Responsible Travel',
    description: 'Regenerative travel · Sustainability · Community tourism · Tourism impact',
    defaultContentTypeLabel: 'INSIGHT',
    legacyCategory: 'nature'
  },
  {
    id: 'research-perspectives',
    category: 'insights',
    label: 'Research & Perspectives',
    description: 'Research · Documentation · Cultural insights · Essays · Opinions',
    defaultContentTypeLabel: 'ESSAY',
    legacyCategory: 'culture'
  },
  {
    id: 'ideas-collaborations',
    category: 'insights',
    label: 'Ideas & Collaborations',
    description: 'Collaborations · Workshops · Consulting · Projects · New initiatives',
    defaultContentTypeLabel: 'PERSPECTIVE',
    legacyCategory: 'bespoke'
  },

  // ==========================================
  // STORIES (5 Subcategories)
  // ==========================================
  {
    id: 'people-communities',
    category: 'stories',
    label: 'People & Communities',
    description: 'Artisans · Artists · Communities · Cultural practitioners · Local knowledge',
    defaultContentTypeLabel: 'STORY',
    legacyCategory: 'culture'
  },
  {
    id: 'journey-stories',
    category: 'stories',
    label: 'Journey Stories',
    description: 'Journeys · Destinations · Encounters · Discoveries · Moments',
    defaultContentTypeLabel: 'STORY',
    legacyCategory: 'offbeat'
  },
  {
    id: 'travel-experiences',
    category: 'stories',
    label: 'Travel Experiences',
    description: 'Culture · Nature · Food · Heritage · Wildlife · Festivals',
    defaultContentTypeLabel: 'EXPERIENCE',
    legacyCategory: 'nature'
  },
  {
    id: 'traveller-stories',
    category: 'stories',
    label: 'Traveller Stories',
    description: 'Reflections · Testimonials · Memories · Guest experiences',
    defaultContentTypeLabel: 'REFLECTION',
    legacyCategory: 'stays'
  },
  {
    id: 'case-studies',
    category: 'stories',
    label: 'Case Studies',
    description: 'Journey planning · Itinerary design · Experiences · Outcomes · Feedback',
    defaultContentTypeLabel: 'CASE STUDY',
    legacyCategory: 'bespoke'
  }
]

export interface JournalMeta {
  id: string
  slug: string
  category: JournalCategoryType
  type: JournalCategoryType
  subcategory: JournalSubcategoryId
  subcategoryLabel: string
  contentTypeLabel: string
  categoryLabel: string
  featured: boolean
  title: string
  excerpt: string
  headerQuote: string
  author: string
  readTime: string
  publishDate: string
  tags: [string, string, string]
  categories: JournalLegacyCategoryId[]
  topics: string[]
  image: string
  alt: string
}

export interface JournalParagraphEntry {
  text: string
  level?: 1 | 2 | 3
}

export interface JournalListEntry {
  title?: string
  text: string
}

export interface JournalListConfig {
  type?: 'unordered' | 'ordered' | 'divided'
  level?: 1 | 2 | 3
  items: Array<string | JournalListEntry>
}

export interface JournalCalloutListConfig {
  title?: string
  level?: 2 | 3
  items: Array<string | JournalListEntry>
}

export interface JournalYoutubeVideoConfig {
  videoId: string
  thumbnail: string
  alt: string
  width?: number
  height?: number
}

export interface JournalMediaImageEntry {
  src: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

export type JournalBannerType =
  | 'plan'
  | 'itineraries'
  | 'partner'
  | 'impact'
  | 'about'
  | 'contact'

export interface JournalContentBlock {
  type:
    | 'text'
    | 'heading'
    | 'paragraph'
    | 'quote'
    | 'image-split'
    | 'highlights'
    | 'callout'
    | 'callout-note'
    | 'horizontal-slider'
    | 'slider'
    | 'masonry'
    | 'youtube'
    | 'impact-stats'
    | 'author-profile'
    | 'cta-banner'
    | string
  id?: string
  bannerType?: JournalBannerType
  ctaLabel?: string
  to?: string
  variant?: 'boxed' | 'border'
  theme?: 'light' | 'cream' | 'blue' | 'mixed'
  eyebrow?: string
  eyebrowLevel?: 1 | 2
  title?: string
  titleLevel?: 1 | 2 | 3
  subtitle?: string
  text?: string
  paragraph?: string
  paragraphLevel?: 1 | 2 | 3
  paragraphs?: Array<string | JournalParagraphEntry>
  list?: JournalListConfig
  listType?: 'unordered' | 'ordered'
  unorderedList?: JournalCalloutListConfig
  orderedList?: JournalCalloutListConfig
  quoteAuthor?: string
  quoteRole?: string
  image?: string
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  items?: string[]
  stats?: Array<{ value: string; label: string; description?: string } | JournalListEntry>
  images?: Array<
    | string
    | JournalMediaImageEntry
    | {
        src: string
        alt?: string
        width?: number
        height?: number
        caption?: string
      }
  >
  videoId?: string
  caption?: string
  captions?: string[]
  captionMob?: boolean
  captionPc?: boolean
  width?: number
  height?: number
  autoplay?: boolean
  interval?: number
  sliderHeight?: number
  innerRounding?: boolean
  maxCols?: 1 | 2 | 3 | 4 | undefined
  video?: JournalYoutubeVideoConfig
  thumbnail?: string
  imageCols?: 4 | 5 | 6 | 7
  aspectRatio?: '1:1' | '4:3' | '3:4' | '2:3' | '3:2' | '16:10' | '16:9' | string
  mobileOrder?: 'image-first' | 'text-first'
  verticalAlign?: 'top' | 'center'
  sectionId?: string
  data?: Omit<Partial<JournalContentBlock>, 'type' | 'data'>
}

export type JournalBlock = JournalContentBlock

export interface JournalFullRecord {
  meta: JournalMeta
  blocks: JournalContentBlock[]
}

export interface JournalSinglePayload {
  record: JournalFullRecord
  related: JournalMeta[]
}

function loadJournalsFromDisk(): JournalFullRecord[] {
  const dataDir = path.resolve(process.cwd(), 'server/data/journal')

  if (!fs.existsSync(dataDir)) {
    return []
  }

  try {
    const files = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith('.json') && !file.startsWith('_'))

    const diskRecords: JournalFullRecord[] = []

    for (const file of files) {
      const fullPath = path.join(dataDir, file)
      const raw = fs.readFileSync(fullPath, 'utf-8')
      const parsed = JSON.parse(raw) as JournalFullRecord
      if (parsed?.meta?.slug) {
        diskRecords.push(parsed)
      }
    }

    return diskRecords.sort(
      (a, b) =>
        new Date(b.meta.publishDate).getTime() - new Date(a.meta.publishDate).getTime()
    )
  } catch (err) {
    console.error('[journalData] Failed reading server/data/journal:', err)
    return []
  }
}

export const JOURNAL_DATABASE: JournalFullRecord[] = loadJournalsFromDisk()

/** Always reads fresh JSON in dev mode so edits appear immediately */
export function getJournalDatabase(): JournalFullRecord[] {
  if (import.meta.dev) {
    return loadJournalsFromDisk()
  }
  return JOURNAL_DATABASE
}