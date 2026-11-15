// ~/app/composables/useTravelSeo.ts
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead, useSeoMeta } from '#imports'
import type {
  ItinerarySectionGroup,
  ItineraryContentBlock,
  ItineraryProgressionItemSpec,
  ItineraryCustomerQueryItemSpec
} from '~~/server/utils/itinerariesData'

export type TravelSeoPageType =
  | 'home'
  | 'about'
  | 'itineraries-index'
  | 'itinerary'
  | 'network'
  | 'impact'
  | 'journal-index'
  | 'article'
  | 'plan'
  | 'contact'
  | 'faq'
  | 'legal'
  | 'webpage'

export interface TravelSeoOptions {
  pageTitle?: string
  pageDesc?: string
  canonicalPath: string
  /** Cover image or OG image (local path or full WordPress/CDN URL) */
  ogImage?: string
  ogImageAlt?: string
  ogImageWidth?: number
  ogImageHeight?: number
  /** Preloads the hero/cover image in <head> with fetchpriority="high" for faster LCP */
  preloadImage?: boolean | string
  pageType?: TravelSeoPageType
  /** Short label used in Google Sitelinks BreadcrumbList */
  breadcrumbName?: string
  /** Optional ISO or date string for articles/itineraries */
  publishDate?: string
  /** Optional starting price string (e.g. 'From USD 1,471') for TouristTrip schema */
  priceText?: string
  /** Optional itinerary sections to auto-extract TouristTrip steps, FAQPage, and conditional VideoObject */
  itinerarySections?: ItinerarySectionGroup[]
  /** Optional list of items for /itineraries or /journal index pages */
  collectionItems?: Array<{
    title: string
    intro: string
    url: string
    coverImage?: string
  }>
  enabled?: boolean
}

export const SITE_URL = 'https://sreejith.travel'
export const BRAND_NAME = 'Sree Jith Travel'
export const DEFAULT_OG_JPG = '/images/og/home.jpg'

// Canonical Fallback Titles & Descriptions per Page Archetype
export const PAGE_SEO_DEFAULTS: Record<
  TravelSeoPageType,
  { title: string; description: string; breadcrumb: string }
> = {
  home: {
    title: 'Sree Jith Travel | Bespoke Luxury Travel Experience Designer',
    description:
      'Designing luxury bespoke journeys bringing together meaningful experiences and authentic stories across Kerala and South India.',
    breadcrumb: 'Home'
  },
  about: {
    title: 'About Sreejith | Philosophy & Story-Led Travel',
    description:
      'Meet Sreejith and explore a philosophy of unhurried, relationship-led travel shaped around people, craft, and living landscapes across South India.',
    breadcrumb: 'About'
  },
  'itineraries-index': {
    title: 'Bespoke Itineraries | Private Journeys in Kerala & South India',
    description:
      'Explore privately tailored signature, collaborative, and thematic itineraries across Kerala and South India—each shaped around your pace and curiosity.',
    breadcrumb: 'Itineraries'
  },
  itinerary: {
    title: 'Bespoke Journey | Sree Jith Travel',
    description:
      'Explore this privately tailored slow-travel route across Kerala and South India, shaped around culture, stays, and local stories.',
    breadcrumb: 'Itinerary'
  },
  network: {
    title: 'Our Network | Cultural Custodians, Specialists & Travel Partners',
    description:
      'Meet the local custodians, master artisans, naturalists, regional route designers, and global travel partners co-creating journeys across South India.',
    breadcrumb: 'Our Network'
  },
  impact: {
    title: 'Impact & Responsible Travel | Communities, Craft & Conservation',
    description:
      'Discover how our journeys sustain local artisan guilds, heritage homesteads, ecological stewardship, and host communities across Kerala and South India.',
    breadcrumb: 'Impact'
  },
  'journal-index': {
    title: 'Journal | Field Notes, Living Heritage & Journey Stories',
    description:
      'Stories, insights, and field perspectives from our travels across communities, craft traditions, and living landscapes in Kerala and South India.',
    breadcrumb: 'Journal'
  },
  article: {
    title: 'Journal Story | Sree Jith Travel',
    description:
      'Field notes, cultural perspectives, and slow-travel dispatches from Kerala and South India.',
    breadcrumb: 'Story'
  },
  plan: {
    title: 'Plan Your Journey | Tailor-Made Private Travel Design',
    description:
      'Start shaping a private journey across Kerala and South India around your travel dates, preferred pace, stays, and cultural interests.',
    breadcrumb: 'Plan Your Journey'
  },
  contact: {
    title: 'Contact | Private Journey Enquiries & Partner Collaborations',
    description:
      'Get in touch with Sreejith for private journey consultations, custom South India route design, and travel partner collaborations.',
    breadcrumb: 'Contact'
  },
  faq: {
    title: 'Frequently Asked Questions | Bespoke South India Travel Guide',
    description:
      'Answers to common questions about bespoke route planning, ideal travel seasons, private accommodations, pricing, and partnering with Sree Jith Travel.',
    breadcrumb: 'FAQ'
  },
  legal: {
    title: 'Legal & Privacy | Sree Jith Travel',
    description:
      'Review our privacy practices, reservation terms, and bespoke travel booking guidelines.',
    breadcrumb: 'Legal'
  },
  webpage: {
    title: BRAND_NAME,
    description:
      'Designing luxury bespoke journeys bringing together meaningful experiences and authentic stories across Kerala and South India.',
    breadcrumb: 'Page'
  }
}

// Primary Navigation Sitelinks matching all 11 Core Routes
const SITELINK_NAV_ITEMS = [
  {
    name: 'Home',
    url: `${SITE_URL}/`,
    description: PAGE_SEO_DEFAULTS.home.description
  },
  {
    name: 'About',
    url: `${SITE_URL}/about`,
    description: PAGE_SEO_DEFAULTS.about.description
  },
  {
    name: 'Bespoke Itineraries',
    url: `${SITE_URL}/itineraries`,
    description: PAGE_SEO_DEFAULTS['itineraries-index'].description
  },
  {
    name: 'Our Network',
    url: `${SITE_URL}/network`,
    description: PAGE_SEO_DEFAULTS.network.description
  },
  {
    name: 'Impact & Responsible Travel',
    url: `${SITE_URL}/impact`,
    description: PAGE_SEO_DEFAULTS.impact.description
  },
  {
    name: 'Journal',
    url: `${SITE_URL}/journal`,
    description: PAGE_SEO_DEFAULTS['journal-index'].description
  },
  {
    name: 'Plan Your Journey',
    url: `${SITE_URL}/planyourjourney`,
    description: PAGE_SEO_DEFAULTS.plan.description
  },
  {
    name: 'Contact',
    url: `${SITE_URL}/contact`,
    description: PAGE_SEO_DEFAULTS.contact.description
  },
  {
    name: 'Frequently Asked Questions',
    url: `${SITE_URL}/faq`,
    description: PAGE_SEO_DEFAULTS.faq.description
  },
  {
    name: 'Privacy Policy',
    url: `${SITE_URL}/privacy`,
    description:
      'Learn how Sree Jith Travel protects and handles your personal data and private travel enquiry details.'
  },
  {
    name: 'Terms & Conditions',
    url: `${SITE_URL}/terms`,
    description:
      'Review our bespoke booking guidelines, reservation policies, and cancellation terms.'
  }
]

export const stripSeoHtml = (input?: string): string =>
  input ? input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : ''

export const toAbsoluteUrl = (pathOrUrl?: string): string => {
  const clean = pathOrUrl?.trim()
  if (!clean) return `${SITE_URL}/`
  if (clean.startsWith('//')) return `https:${clean}`
  if (/^https?:\/\//i.test(clean)) return clean
  return `${SITE_URL}${clean.startsWith('/') ? '' : '/'}${clean}`
}

/**
 * Resolves both Headless WordPress URLs (https://... or http://...)
 * and local /images/... paths into strict HTTPS absolute URLs for OG/Twitter/Schema.
 */
export const resolveSeoImageUrl = (
  rawImage?: string,
  fallback = DEFAULT_OG_JPG
): string => {
  const candidate = rawImage?.trim() || fallback
  if (!candidate) return `${SITE_URL}${DEFAULT_OG_JPG}`

  if (candidate.startsWith('//')) {
    return `https:${candidate}`
  }

  if (/^https?:\/\//i.test(candidate)) {
    if (/^http:\/\/(?!localhost|127\.0\.0\.1)/i.test(candidate)) {
      return candidate.replace(/^http:\/\//i, 'https://')
    }
    return candidate
  }

  return `${SITE_URL}${candidate.startsWith('/') ? '' : '/'}${candidate}`
}

export const inferOgImageMimeType = (
  imageUrl: string
): 'image/webp' | 'image/png' | 'image/avif' | 'image/jpeg' => {
  const cleanPath = imageUrl.split(/[?#]/)[0]?.toLowerCase() || ''
  if (cleanPath.endsWith('.webp')) return 'image/webp'
  if (cleanPath.endsWith('.png')) return 'image/png'
  if (cleanPath.endsWith('.avif')) return 'image/avif'
  return 'image/jpeg'
}

const toSafeIsoDate = (dateStr?: string): string | undefined => {
  if (!dateStr?.trim()) return undefined
  const parsed = new Date(dateStr)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

export function useTravelSeo(optionsInput: MaybeRefOrGetter<TravelSeoOptions>) {
  const opts = computed(() => toValue(optionsInput))

  const pageType = computed<TravelSeoPageType>(() => opts.value.pageType || 'webpage')
  const archetypeDefaults = computed(() => PAGE_SEO_DEFAULTS[pageType.value])

  const cleanPageTitle = computed(
    () => stripSeoHtml(opts.value.pageTitle) || archetypeDefaults.value.title
  )
  const cleanPageDesc = computed(
    () => stripSeoHtml(opts.value.pageDesc) || archetypeDefaults.value.description
  )

  const fullTitle = computed(() =>
    cleanPageTitle.value.includes(BRAND_NAME)
      ? cleanPageTitle.value
      : `${cleanPageTitle.value} | ${BRAND_NAME}`
  )

  const canonicalUrl = computed(() => toAbsoluteUrl(opts.value.canonicalPath))
  const ogImage = computed(() => resolveSeoImageUrl(opts.value.ogImage))
  const ogImageMime = computed(() => inferOgImageMimeType(ogImage.value))
  const ogImageAltText = computed(
    () => stripSeoHtml(opts.value.ogImageAlt) || cleanPageTitle.value
  )
  const ogWidth = computed(() => opts.value.ogImageWidth || 1200)
  const ogHeight = computed(() => opts.value.ogImageHeight || 630)

  const preloadHref = computed<string | null>(() => {
    const p = opts.value.preloadImage
    if (!p) return null
    if (typeof p === 'string') return p.trim() || null
    return opts.value.ogImage?.trim() || null
  })

  const jsonLdString = computed(() => {
    const type = pageType.value
    const title = cleanPageTitle.value
    const full = fullTitle.value
    const desc = cleanPageDesc.value
    const url = canonicalUrl.value
    const img = ogImage.value
    const crumbLabel =
      stripSeoHtml(opts.value.breadcrumbName) ||
      (type === 'itinerary' || type === 'article' ? title : archetypeDefaults.value.breadcrumb)
    const sections = opts.value.itinerarySections || []
    const items = opts.value.collectionItems || []

    // 1. Universal Master TravelAgency Entity
    const masterAgencyEntity = {
      '@type': 'TravelAgency',
      '@id': `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      alternateName: [
        'Sreejith Travel',
        'Sree Jith Travel Experience Designer',
        'Sreejith Travel Experience Designer',
        'sreejith.travel'
      ],
      description:
        'Bespoke luxury travel experience designer in Kerala, crafting unhurried cultural, heritage, and nature journeys across South India.',
      url: `${SITE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}/images/logo.png`,
        contentUrl: `${SITE_URL}/images/logo.png`,
        caption: BRAND_NAME
      },
      image: img,
      email: 'mokshastories@mokshastories.com',
      telephone: ['+919943360478'],
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '15/397, Sailapadmam, Kakkayur',
        addressLocality: 'Palakkad',
        addressRegion: 'Kerala',
        postalCode: '678512',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '10.6566728',
        longitude: '76.6299029'
      },
      hasMap: 'https://maps.google.com/?q=10.6566728,76.6299029',
      sameAs: [
        'https://www.instagram.com/sreejith_palliyil',
        'https://www.facebook.com/sreejith.palliyil'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+919943360478',
        email: 'mokshastories@mokshastories.com',
        contactType: 'customer service',
        availableLanguage: ['English', 'Malayalam', 'Hindi', 'Tamil']
      },
      founder: { '@id': `${SITE_URL}/#founder` }
    }

    // 2. Founder / Lead Route Architect Entity
    const founderEntity = {
      '@type': 'Person',
      '@id': `${SITE_URL}/#founder`,
      name: 'Sreejith Palliyil',
      alternateName: 'Sreejith Raghavan',
      jobTitle: 'Lead Route Architect & Travel Experience Designer',
      worksFor: { '@id': `${SITE_URL}/#organization` },
      sameAs: [
        'https://www.instagram.com/sreejith_palliyil',
        'https://www.facebook.com/sreejith.palliyil'
      ]
    }

    // 3. Root WebSite Entity
    const websiteEntity = {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: BRAND_NAME,
      alternateName: ['Sreejith Travel', 'sreejith.travel'],
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en'
    }

    // 4. Primary Navigation Sitelinks Entity
    const navigationEntity = {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#navigation`,
      name: `${BRAND_NAME} Main Navigation`,
      itemListElement: SITELINK_NAV_ITEMS.map((item, idx) => ({
        '@type': 'SiteNavigationElement',
        position: idx + 1,
        name: item.name,
        description: item.description,
        url: item.url
      }))
    }

    const graph: Record<string, any>[] = [
      masterAgencyEntity,
      founderEntity,
      websiteEntity,
      navigationEntity
    ]

    // 5. Page-Specific Schema Nodes
    if (type === 'home') {
      graph.push({
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: full,
        description: desc,
        primaryImageOfPage: img,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/#organization` }
      })
    } else if (type === 'about') {
      graph.push({
        '@type': 'AboutPage',
        '@id': `${url}#webpage`,
        name: full,
        description: desc,
        url,
        primaryImageOfPage: img,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#organization` }
      })
    } else if (type === 'contact') {
      graph.push({
        '@type': 'ContactPage',
        '@id': `${url}#webpage`,
        name: full,
        description: desc,
        url,
        primaryImageOfPage: img,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#organization` }
      })
    } else if (type === 'network' || type === 'impact' || type === 'plan' || type === 'faq') {
      graph.push({
        '@type': type === 'network' ? 'CollectionPage' : 'WebPage',
        '@id': `${url}#webpage`,
        name: full,
        description: desc,
        url,
        primaryImageOfPage: img,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        mainEntity: { '@id': `${SITE_URL}/#organization` }
      })
    } else if (type === 'itineraries-index') {
      graph.push({
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        name: full,
        description: desc,
        url,
        primaryImageOfPage: img,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: items.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'TouristTrip',
              name: stripSeoHtml(item.title),
              description: stripSeoHtml(item.intro),
              url: toAbsoluteUrl(item.url),
              image: item.coverImage ? resolveSeoImageUrl(item.coverImage) : img
            }
          }))
        }
      })
    } else if (type === 'itinerary') {
      const numericPrice = opts.value.priceText
        ? opts.value.priceText.replace(/[^0-9.]/g, '')
        : ''
      const publishedIso = toSafeIsoDate(opts.value.publishDate)

      const progressionItems: Array<{ headerTitle: string; paragraphs?: string[] }> = []
      const faqEntities: Array<{
        '@type': string
        name: string
        acceptedAnswer: { '@type': string; text: string }
      }> = []
      const videoEntities: Array<Record<string, any>> = []

      sections.forEach((sec: ItinerarySectionGroup) => {
        sec.blocks.forEach((block: ItineraryContentBlock) => {
          if (block.type === 'itinerary' && Array.isArray(block.data?.items)) {
            block.data.items.forEach((phase: ItineraryProgressionItemSpec) => {
              progressionItems.push({
                headerTitle: stripSeoHtml(phase.headerTitle),
                paragraphs: phase.paragraphs
              })
            })
          } else if (block.type === 'customer-query' && Array.isArray(block.data?.items)) {
            block.data.items.forEach((q: ItineraryCustomerQueryItemSpec) => {
              const answerParts = [
                ...(q.paragraphs || []),
                ...(q.listItems || [])
              ]
                .map(stripSeoHtml)
                .filter(Boolean)
              if (q.question && answerParts.length > 0) {
                faqEntities.push({
                  '@type': 'Question',
                  name: stripSeoHtml(q.question),
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: answerParts.join(' ')
                  }
                })
              }
            })
          } else if (block.type === 'youtube' && block.data?.video?.videoId) {
            const vid = block.data.video
            videoEntities.push({
              '@type': 'VideoObject',
              '@id': `${url}#video-${vid.videoId}`,
              name: stripSeoHtml(block.data.title) || title,
              description: stripSeoHtml(block.data.caption || vid.alt) || desc,
              thumbnailUrl: [resolveSeoImageUrl(vid.thumbnail, opts.value.ogImage)],
              uploadDate: publishedIso || '2026-01-15T08:00:00+05:30',
              contentUrl: `https://www.youtube.com/watch?v=${vid.videoId}`,
              embedUrl: `https://www.youtube.com/embed/${vid.videoId}`,
              publisher: { '@id': `${SITE_URL}/#organization` }
            })
          }
        })
      })

      graph.push({
        '@type': 'TouristTrip',
        '@id': `${url}#trip`,
        name: title,
        description: desc,
        image: img,
        url,
        touristType: ['Cultural Tourism', 'Luxury Slow Travel', 'Private Bespoke Travel'],
        provider: { '@id': `${SITE_URL}/#organization` },
        ...(numericPrice
          ? {
              offers: {
                '@type': 'Offer',
                priceCurrency: 'USD',
                price: numericPrice,
                availability: 'https://schema.org/InStock',
                url
              }
            }
          : {}),
        ...(progressionItems.length > 0
          ? {
              itinerary: {
                '@type': 'ItemList',
                numberOfItems: progressionItems.length,
                itemListElement: progressionItems.map((phase, idx) => ({
                  '@type': 'ListItem',
                  position: idx + 1,
                  item: {
                    '@type': 'TouristAttraction',
                    name: phase.headerTitle,
                    description: stripSeoHtml(phase.paragraphs?.[0]) || phase.headerTitle
                  }
                }))
              }
            }
          : {})
      })

      if (faqEntities.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          '@id': `${url}#faq`,
          mainEntity: faqEntities
        })
      }

      if (videoEntities.length > 0) {
        graph.push(...videoEntities)
      }
    } else if (type === 'journal-index') {
      graph.push({
        '@type': 'Blog',
        '@id': `${SITE_URL}/journal#blog`,
        name: full,
        description: desc,
        url,
        image: img,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        blogPost: items.map((post) => ({
          '@type': 'BlogPosting',
          headline: stripSeoHtml(post.title),
          description: stripSeoHtml(post.intro),
          url: toAbsoluteUrl(post.url),
          image: post.coverImage ? resolveSeoImageUrl(post.coverImage) : img
        }))
      })
    } else if (type === 'article') {
      const publishedIso = toSafeIsoDate(opts.value.publishDate)
      graph.push({
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        },
        headline: title,
        name: full,
        description: desc,
        image: img,
        url,
        ...(publishedIso ? { datePublished: publishedIso } : {}),
        author: { '@id': `${SITE_URL}/#founder` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/journal#blog` }
      })
    } else {
      graph.push({
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        name: full,
        description: desc,
        url,
        primaryImageOfPage: img,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` }
      })
    }

    // 6. BreadcrumbList on all non-home pages
    if (type !== 'home') {
      const breadcrumbItems: Record<string, any>[] = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`
        }
      ]

      if (type === 'itinerary') {
        breadcrumbItems.push(
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Itineraries',
            item: `${SITE_URL}/itineraries`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: crumbLabel,
            item: url
          }
        )
      } else if (type === 'article') {
        breadcrumbItems.push(
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Journal',
            item: `${SITE_URL}/journal`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: crumbLabel,
            item: url
          }
        )
      } else {
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: crumbLabel,
          item: url
        })
      }

      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: breadcrumbItems
      })
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph
    })
  })

  const isEnabled = computed(() => opts.value.enabled !== false)

  // 7. Reactive Canonical, OG Image MIME, Twitter URL, LCP Preload & JSON-LD @graph
  useHead(() => ({
    link: isEnabled.value
      ? [
          { rel: 'canonical', href: canonicalUrl.value },
          ...(preloadHref.value
            ? [
                {
                  key: 'lcp-cover-preload',
                  rel: 'preload' as const,
                  as: 'image' as const,
                  href: preloadHref.value,
                  fetchpriority: 'high' as const
                }
              ]
            : [])
        ]
      : [],
    meta: isEnabled.value
      ? [
          { property: 'og:image:type', content: ogImageMime.value },
          { name: 'twitter:url', content: canonicalUrl.value }
        ]
      : [],
    script: isEnabled.value
      ? [
          {
            key: 'travel-seo-jsonld',
            type: 'application/ld+json',
            innerHTML: jsonLdString.value
          }
        ]
      : []
  }))

  // 8. Reactive Search, Open Graph & X/Twitter Meta Tags
  useSeoMeta({
    title: () => (isEnabled.value ? fullTitle.value : undefined),
    description: () => (isEnabled.value ? cleanPageDesc.value : undefined),
    ogType: () =>
      isEnabled.value ? (pageType.value === 'article' ? 'article' : 'website') : undefined,
    ogSiteName: () => (isEnabled.value ? BRAND_NAME : undefined),
    ogLocale: () => (isEnabled.value ? 'en_US' : undefined),
    ogTitle: () => (isEnabled.value ? fullTitle.value : undefined),
    ogDescription: () => (isEnabled.value ? cleanPageDesc.value : undefined),
    ogUrl: () => (isEnabled.value ? canonicalUrl.value : undefined),
    ogImage: () => (isEnabled.value ? ogImage.value : undefined),
    ogImageAlt: () => (isEnabled.value ? ogImageAltText.value : undefined),
    ogImageWidth: () => (isEnabled.value ? ogWidth.value : undefined),
    ogImageHeight: () => (isEnabled.value ? ogHeight.value : undefined),
    twitterCard: () => (isEnabled.value ? 'summary_large_image' : undefined),
    twitterTitle: () => (isEnabled.value ? fullTitle.value : undefined),
    twitterDescription: () => (isEnabled.value ? cleanPageDesc.value : undefined),
    twitterImage: () => (isEnabled.value ? ogImage.value : undefined),
    twitterImageAlt: () => (isEnabled.value ? ogImageAltText.value : undefined)
  })
}