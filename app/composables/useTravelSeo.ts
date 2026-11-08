// ~/app/composables/useTravelSeo.ts
import { useHead, useSeoMeta } from '#imports'
import type {
  ItinerarySectionGroup,
  ItineraryContentBlock,
  ItineraryProgressionItemSpec,
  ItineraryCustomerQueryItemSpec
} from '~~/server/utils/itinerariesData'

export interface TravelSeoOptions {
  pageTitle: string
  pageDesc: string
  canonicalPath: string
  /** 1200x630 .jpg OG image path or full URL */
  ogImage?: string
  ogImageAlt?: string
  /**
   * Schema archetype for the page:
   * 'home' | 'about' | 'itineraries-index' | 'itinerary' | 'partner' | 'impact' | 'journal-index' | 'article' | 'plan' | 'contact' | 'faq' | 'legal' | 'webpage'
   */
  pageType?:
    | 'home'
    | 'about'
    | 'itineraries-index'
    | 'itinerary'
    | 'partner'
    | 'impact'
    | 'journal-index'
    | 'article'
    | 'plan'
    | 'contact'
    | 'faq'
    | 'legal'
    | 'webpage'
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
}

export const SITE_URL = 'https://sreejithtravel.com'
export const BRAND_NAME = 'Sree Jith Travel'
export const DEFAULT_OG_JPG = '/images/favicons/sreejith-og-image.jpg'

// Primary Navigation Sitelinks for Google Search
// Complete Navigation Sitelinks matching the 11 Menu Pages
const SITELINK_NAV_ITEMS = [
  {
    name: 'Home',
    url: `${SITE_URL}/`,
    description:
      'Bespoke luxury travel experience designer in Kerala, crafting slow, culturally rooted journeys.'
  },
  {
    name: 'About',
    url: `${SITE_URL}/about`,
    description:
      'Meet Sreejith and learn about our philosophy of unhurried, story-driven travel across South India.'
  },
  {
    name: 'Signature Itineraries',
    url: `${SITE_URL}/itineraries`,
    description:
      'Explore 28 privately tailored cultural, wildlife, and slow-travel blueprints across Kerala and South India.'
  },
  {
    name: 'Partner With Us',
    url: `${SITE_URL}/partner`,
    description:
      'Collaborate with Sree Jith Travel as an international travel partner, boutique agency, or regional specialist.'
  },
  {
    name: 'Sustainability & Impact',
    url: `${SITE_URL}/impact`,
    description:
      'Discover how our journeys support local artisan guilds, heritage conservation, and indigenous communities.'
  },
  {
    name: 'Travel Journal',
    url: `${SITE_URL}/journal`,
    description:
      'Field dispatches, cultural essays, and visual stories from the Malabar Coast and Western Ghats.'
  },
  {
    name: 'Plan Your Journey',
    url: `${SITE_URL}/planYourJourney`,
    description:
      'Shape a private itinerary around your preferred dates, travel pace, and cultural interests.'
  },
  {
    name: 'Contact',
    url: `${SITE_URL}/contact`,
    description:
      'Get in touch for private journey consultations, partner enquiries, and bespoke route planning.'
  },
  {
    name: 'Frequently Asked Questions',
    url: `${SITE_URL}/faq`,
    description:
      'Answers to common questions about bespoke route planning, seasons, inclusions, and reservations.'
  },
  {
    name: 'Privacy Policy',
    url: `${SITE_URL}/privacy`,
    description:
      'Read how Sree Jith Travel protects and handles your personal data and enquiry details.'
  },
  {
    name: 'Terms & Conditions',
    url: `${SITE_URL}/terms`,
    description:
      'Review our booking terms, reservation policies, and cancellation guidelines.'
  }
]

const toAbsoluteUrl = (pathOrUrl: string) => {
  if (!pathOrUrl) return `${SITE_URL}/`
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

export function useTravelSeo(options: TravelSeoOptions) {
  const {
    pageTitle,
    pageDesc,
    canonicalPath,
    ogImage: rawOgImage = DEFAULT_OG_JPG,
    ogImageAlt,
    pageType = 'webpage',
    breadcrumbName,
    publishDate,
    priceText,
    itinerarySections = [],
    collectionItems = []
  } = options

  const canonicalUrl = toAbsoluteUrl(canonicalPath)
  const ogImage = toAbsoluteUrl(rawOgImage)
  const fullTitle = pageTitle.includes(BRAND_NAME)
    ? pageTitle
    : `${pageTitle} | ${BRAND_NAME}`

  // 1. Universal Master TravelAgency Entity (Single Source of Truth)
  const masterAgencyEntity = {
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    alternateName: [
      'Sreejith Travel',
      'Sree Jith Travel Experience Designer',
      'Sreejith Travel Experience Designer',
      'sreejithtravel.com'
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
    image: ogImage,
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

  // 2. Founder / Lead Route Architect Entity (E-E-A-T Authority)
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

  // 3. Root WebSite Entity (Instructs Google Search to display "Sree Jith Travel")
  const websiteEntity = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: BRAND_NAME,
    alternateName: ['Sreejith Travel', 'sreejithtravel.com'],
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
  if (pageType === 'home') {
    graph.push({
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: fullTitle,
      description: pageDesc,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      mainEntity: { '@id': `${SITE_URL}/#organization` }
    })
  } else if (pageType === 'about') {
    graph.push({
      '@type': 'AboutPage',
      '@id': `${canonicalUrl}#webpage`,
      name: fullTitle,
      description: pageDesc,
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${SITE_URL}/#organization` }
    })
  } else if (pageType === 'contact') {
    graph.push({
      '@type': 'ContactPage',
      '@id': `${canonicalUrl}#webpage`,
      name: fullTitle,
      description: pageDesc,
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: { '@id': `${SITE_URL}/#organization` }
    })
  } else if (pageType === 'itineraries-index') {
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collection`,
      name: fullTitle,
      description: pageDesc,
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: collectionItems.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'TouristTrip',
            name: item.title,
            description: item.intro,
            url: toAbsoluteUrl(item.url),
            image: item.coverImage ? toAbsoluteUrl(item.coverImage) : ogImage
          }
        }))
      }
    })
  } else if (pageType === 'itinerary') {
    // Extract numeric price if present (e.g. "From USD 1,471" -> "1471")
    const numericPrice = priceText ? priceText.replace(/[^0-9.]/g, '') : ''

    // Auto-extract Route Progression Steps from 'itinerary' block if present
    const progressionItems: Array<{ headerTitle: string; paragraphs?: string[] }> = []
    const faqEntities: Array<{ '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }> = []
    const videoEntities: Array<Record<string, any>> = []

    itinerarySections.forEach((sec: ItinerarySectionGroup) => {
      sec.blocks.forEach((block: ItineraryContentBlock) => {
        if (block.type === 'itinerary' && Array.isArray(block.data?.items)) {
          block.data.items.forEach((phase: ItineraryProgressionItemSpec) => {
            progressionItems.push({
              headerTitle: phase.headerTitle,
              paragraphs: phase.paragraphs
            })
          })
        } else if (block.type === 'customer-query' && Array.isArray(block.data?.items)) {
          block.data.items.forEach((q: ItineraryCustomerQueryItemSpec) => {
            const answerParts = [
              ...(q.paragraphs || []),
              ...(q.listItems || [])
            ].filter(Boolean)
            if (q.question && answerParts.length > 0) {
              faqEntities.push({
                '@type': 'Question',
                name: q.question,
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
            '@id': `${canonicalUrl}#video-${vid.videoId}`,
            name: block.data.title || pageTitle,
            description: block.data.caption || vid.alt || pageDesc,
            thumbnailUrl: [toAbsoluteUrl(vid.thumbnail)],
            uploadDate: publishDate
              ? new Date(publishDate).toISOString()
              : '2026-01-15T08:00:00+05:30',
            contentUrl: `https://www.youtube.com/watch?v=${vid.videoId}`,
            embedUrl: `https://www.youtube.com/embed/${vid.videoId}`,
            publisher: { '@id': `${SITE_URL}/#organization` }
          })
        }
      })
    })

    // Primary TouristTrip Node
    graph.push({
      '@type': 'TouristTrip',
      '@id': `${canonicalUrl}#trip`,
      name: pageTitle,
      description: pageDesc,
      image: ogImage,
      url: canonicalUrl,
      touristType: ['Cultural Tourism', 'Luxury Slow Travel', 'Private Bespoke Travel'],
      provider: { '@id': `${SITE_URL}/#organization` },
      ...(numericPrice
        ? {
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: numericPrice,
              availability: 'https://schema.org/InStock',
              url: canonicalUrl
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
                  description: phase.paragraphs?.[0] || phase.headerTitle
                }
              }))
            }
          }
        : {})
    })

    // Conditional FAQPage Node (Only added when customer-query items exist)
    if (faqEntities.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: faqEntities
      })
    }

    // Conditional VideoObject Node(s) (Only added when youtube block exists)
    if (videoEntities.length > 0) {
      graph.push(...videoEntities)
    }
  } else if (pageType === 'journal-index') {
    graph.push({
      '@type': 'Blog',
      '@id': `${SITE_URL}/journal#blog`,
      name: fullTitle,
      description: pageDesc,
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      blogPost: collectionItems.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.intro,
        url: toAbsoluteUrl(post.url),
        image: post.coverImage ? toAbsoluteUrl(post.coverImage) : ogImage
      }))
    })
  } else if (pageType === 'article') {
    const publishedIso = publishDate ? new Date(publishDate).toISOString() : undefined
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      headline: pageTitle,
      name: fullTitle,
      description: pageDesc,
      image: ogImage,
      url: canonicalUrl,
      ...(publishedIso ? { datePublished: publishedIso } : {}),
      author: { '@id': `${SITE_URL}/#founder` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      isPartOf: { '@id': `${SITE_URL}/journal#blog` }
    })
  } else {
    graph.push({
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: fullTitle,
      description: pageDesc,
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` }
    })
  }

  // 6. BreadcrumbList on all non-home pages (Critical for Google Sitelinks hierarchy)
  if (pageType !== 'home') {
    const breadcrumbItems: Record<string, any>[] = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${SITE_URL}/`
      }
    ]

    if (pageType === 'itinerary') {
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
          name: breadcrumbName || pageTitle,
          item: canonicalUrl
        }
      )
    } else if (pageType === 'article') {
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
          name: breadcrumbName || pageTitle,
          item: canonicalUrl
        }
      )
    } else {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbName || pageTitle,
        item: canonicalUrl
      })
    }

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumb`,
      itemListElement: breadcrumbItems
    })
  }

  // 7. Inject Canonical Link & JSON-LD @graph via useHead
  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph
        })
      }
    ]
  })

  // 8. Inject Search & Social Meta Tags via useSeoMeta (1200x630 JPG standard)
  useSeoMeta({
    title: fullTitle,
    description: pageDesc,
    ogType: pageType === 'article' ? 'article' : 'website',
    ogSiteName: BRAND_NAME,
    ogLocale: 'en_US',
    ogTitle: fullTitle,
    ogDescription: pageDesc,
    ogUrl: canonicalUrl,
    ogImage: ogImage,
    ogImageAlt: ogImageAlt || pageTitle,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/jpeg',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: pageDesc,
    twitterImage: ogImage,
    twitterImageAlt: ogImageAlt || pageTitle
  })
}