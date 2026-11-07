// ~~/server/utils/itinerariesData.ts

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

// =========================================================
// UNIFIED SINGLE ITINERARY PAGE INTERFACES
// =========================================================
export interface ItinerarySeoConfig {
  pageTitle?: string
  pageDesc?: string
  /** 1200x630 .jpg social sharing image */
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

const FALLBACK_IMG = '/images/fallbacks/culture.webp'

// Helper for any itinerary in ITINERARIES_DATABASE not yet expanded into full blocks
export const buildDefaultItineraryParts = (
  meta: ItineraryMeta
): Omit<ItineraryFullRecord, 'meta'> => ({
  relatedSlugs: [
    'stories-along-the-malabar-coast',
    'into-the-western-ghats-expedition',
    'periyar-spice-hills-and-lake-trails'
  ],
  seo: {
    pageTitle: `${meta.title} — ${meta.days}-Day ${meta.region} Itinerary`,
    pageDesc: meta.intro,
    ogImage: '/images/favicons/sreejith-og-image.jpg',
    ogImageAlt: meta.alt,
    breadcrumbName: meta.title,
    publishDate: '2026-02-01'
  },
  header: {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Itineraries', to: '/itineraries' },
      { label: meta.title }
    ],
    coverImage: meta.image || FALLBACK_IMG,
    coverAlt: meta.alt,
    eyebrow:
      meta.type === 'signature'
        ? 'Signature Itinerary'
        : meta.type === 'collaborated'
          ? 'Collaborated Route'
          : 'Essential Blueprint',
    title: meta.title,
    intro: meta.intro,
    journeyDetails: [
      { label: 'Duration', value: `${meta.days} days` },
      { label: 'Pace', value: 'Unhurried' },
      { label: 'Region', value: meta.region },
      { label: 'Group', value: '1–4 guests' },
      { label: 'Focus', value: 'Living culture' },
      { label: 'Style', value: 'Private bespoke' }
    ]
  },
  sidebar: {
    price: 'From USD 1,450',
    shareTitle: meta.title,
    shareText: meta.intro
  },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      blocks: [
        {
          type: 'summary',
          data: {
            eyebrow: 'THE JOURNEY AT A GLANCE',
            title: `The Rhythm of ${meta.title}`,
            paragraphs: [
              meta.intro,
              'Designed around unhurried mornings, scholar-led walks, and intimate community encounters that reveal the living character of the land.'
            ],
            image: '/images/itineraries/dummy1.webp',
            imageAlt: meta.alt,
            imageAspectRatio: '4 / 5',
            caption: `${meta.region} • Private Bespoke Route`,
            highlightsTitle: 'Highlights of the Journey',
            highlights: [
              'Handpicked heritage sanctuaries and intimate eco-lodges.',
              'Privately guided walks with regional historians and naturalists.',
              'Flexible daily pacing tailored around your interests.'
            ]
          }
        }
      ]
    },
    {
      id: 'itinerary',
      label: 'Itinerary',
      blocks: [
        {
          type: 'itinerary',
          data: {
            introTitle: 'The Pace & Flow',
            introParagraphs: [
              'Every stage of this blueprint is paced to minimize transit fatigue and maximize meaningful time on the ground.'
            ],
            title: 'Detailed Progression',
            items: [
              {
                id: 'phase-01',
                headerTitle: 'Phase 01: Arrival & First Encounters',
                bodySubtitle: `DAYS 1–2 | ${meta.region.toUpperCase()}`,
                paragraphs: [
                  'Settle into a family-stewarded heritage sanctuary followed by an unhurried evening walk through quiet village lanes and sacred groves.'
                ],
                imageOrientation: 'portrait',
                images: [{ src: '/images/home/journey-mob.webp', alt: meta.alt }]
              }
            ]
          }
        }
      ]
    },
    {
      id: 'details',
      label: 'Details',
      blocks: [
        {
          type: 'checklist',
          data: {
            title: 'Our Sanctuary & Lodging Standards',
            items: [
              'Restored heritage homes and intimate nature lodges.',
              'Dedicated private chauffeur and regional host support.'
            ],
            image: '/images/journal/journal1.webp',
            imageAlt: 'Heritage courtyard sanctuary',
            imageAspectRatio: '1 / 1'
          }
        }
      ]
    },
    {
      id: 'essence',
      label: 'Essence',
      blocks: [
        {
          type: 'quote',
          data: {
            quote:
              'True travel begins when we slow down enough to listen to the people who call a landscape home.',
            author: "THE DESIGNER'S NOTEBOOK"
          }
        },
        {
          type: 'designer-profile',
          data: {
            eyebrow: 'LEAD ROUTE ARCHITECT • KERALA, INDIA',
            name: meta.collaborator?.name || 'Sreejith Raghavan',
            bio: 'Crafting unhurried journeys across South India that connect travellers with living traditions, conservationists, and regional storytellers.',
            avatar: '/images/testimonials/avatar.webp',
            avatarAlt: meta.collaborator?.name || 'Sreejith Raghavan'
          }
        }
      ]
    },
    {
      id: 'essentials',
      label: 'Essentials',
      blocks: [
        {
          type: 'customer-query',
          data: {
            eyebrow: 'GOOD TO KNOW',
            title: 'Frequently Asked Questions',
            items: [
              {
                id: 'faq-01',
                question: 'Can this route be tailored to our preferred travel dates?',
                paragraphs: [
                  'Yes—every itinerary is privately customized around your dates, pace, and accommodation preferences.'
                ]
              }
            ]
          }
        }
      ]
    }
  ]
})

export const ITINERARIES_DATABASE: ItineraryFullRecord[] = [
  
  // ==========================================
  // TIER 1: SIGNATURE ITINERARIES
  // ==========================================

  {
    "meta": {
      "id": "sig-1",
      "slug": "stories-along-the-malabar-coast",
      "type": "signature",
      "featured": true,
      "title": "Stories Along The Malabar Coast",
      "region": "Kerala",
      "days": 12,
      "categories": [
        "culture",
        "nature",
        "stays"
      ],
      "tags": [
        "#MALABAR",
        "#HERITAGE",
        "#BACKWATERS"
      ],
      "intro": "Follow the old trading ports of the Malabar Coast, where boatbuilders, spice merchants and fishing families share their stories.",
      "image": "/images/home/solo-landscape.webp",
      "alt": "Wooden canoe gliding through palm-lined Malabar backwaters at golden hour",
      "featuredDescription": "Drift through tranquil backwaters, stay in heritage homes, and experience a way of life where nature, tradition, and warm hospitality flow together.",
      "highlights": [
        {
          "icon": "boat",
          "label": "Houseboat on serene backwaters"
        },
        {
          "icon": "village",
          "label": "Village life experiences"
        },
        {
          "icon": "temple",
          "label": "Heritage stays & local cuisine"
        },
        {
          "icon": "wellness",
          "label": "Ayurveda & wellness"
        }
      ]
    },
    "relatedSlugs": [
      "backwaters-spice-hills-and-sacred-groves",
      "wayanad-forests-and-nila-riverlands",
      "theyyam-coast-to-tulunadu"
    ],
    "seo": {
      "pageTitle": "Stories Along the Malabar Coast | 12-Day Kerala Journey",
      "pageDesc": "Follow Kerala’s Malabar Coast through Fort Kochi, Vembanad, Periyar, Munnar, Palakkad, Beypore, and Calicut on a private 12-day journey.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Wooden canoe gliding through palm-lined Malabar backwaters beneath warm evening light",
      "breadcrumbName": "Stories Along The Malabar Coast",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Stories Along The Malabar Coast"
        }
      ],
      "coverImage": "/images/home/solo-landscape.webp",
      "coverAlt": "Wooden canoe gliding through palm-lined Malabar backwaters beneath warm evening light",
      "eyebrow": "Signature Itinerary",
      "title": "Stories Along The Malabar Coast",
      "intro": "Follow the old trading ports of the Malabar Coast, where boatbuilders, spice merchants and fishing families share their stories.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "12 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Living culture"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 1,471",
      "priceUnit": "per person",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Stories Along The Malabar Coast",
      "shareText": "Follow the old trading ports of the Malabar Coast, where boatbuilders, spice merchants and fishing families share their stories."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Traverse Kerala from its historic spice harbour to quiet backwaters, forested highlands, handloom villages, and the old timber quays of North Malabar. The route is designed for travellers who want history and landscape to unfold together rather than as isolated sightseeing stops.",
                "From Fort Kochi and Vembanad Lake, the journey rises through Periyar and Munnar before crossing the Palakkad Gap toward the Nila riverlands and Calicut. Heritage stays, local specialists, and long pauses for conversation keep the experience intimate and unhurried."
              ],
              "image": "/images/itineraries/dummy1.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Kerala",
              "imageAspectRatio": "4 / 5",
              "caption": "Cochin → Alleppey → Periyar → Munnar → Palakkad → Calicut",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Private heritage walks through Fort Kochi and Mattancherry trading quarters.",
                "An overnight backwater journey through quieter village canals of Vembanad.",
                "Spice-estate and highland nature experiences around Periyar and Munnar.",
                "Craft, food, and maritime encounters across Palakkad, Beypore, and Calicut."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes from the Journey",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Kerala",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Kerala, selected to complement the route’s slower editorial rhythm."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 12-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: The Maritime Beginning",
                  "bodySubtitle": "DAYS 1–3 | FORT KOCHI & MATTANCHERRY",
                  "paragraphs": [
                    "Settle into Fort Kochi and explore spice warehouses, synagogue lanes, waterfront trade stories, and layered colonial architecture with a regional historian."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Scholar-led walk through Mattancherry and Jew Town.",
                    "Sunset harbour cruise aboard a restored wooden launch."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Travel scene from The Maritime Beginning during the Stories Along The Malabar Coast journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Labyrinths of Vembanad",
                  "bodySubtitle": "DAYS 4–5 | VEMBANAD & KUTTANAD",
                  "paragraphs": [
                    "Move slowly through palm-shaded canals and low-lying rice country, with time for canoe rides, coir work, village kitchens, and an overnight stay beside the water."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/journey-pc.webp",
                      "alt": "Landscape and local detail from Labyrinths of Vembanad on the Stories Along The Malabar Coast route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: The Cardamom Ascent",
                  "bodySubtitle": "DAYS 6–7 | PERIYAR",
                  "paragraphs": [
                    "Climb into the spice belt for plantation walks, forest-edge experiences, and meals shaped by cardamom, pepper, clove, and seasonal produce."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Naturalist-led forest buffer walk.",
                    "Private spice garden and plantation lunch."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact1.webp",
                      "alt": "Regional landscape encountered around The Cardamom Ascent during the Stories Along The Malabar Coast journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Cloud Forests & Tea Ridges",
                  "bodySubtitle": "DAYS 8–9 | MUNNAR",
                  "paragraphs": [
                    "Continue into the high ranges for tea landscapes, shola-grassland ecology, and slower mornings in a secluded hillside stay."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Cultural travel detail representing Cloud Forests & Tea Ridges during the Stories Along The Malabar Coast journey"
                    },
                    {
                      "src": "/images/itineraries/dummy4.webp",
                      "alt": "Second editorial scene from Cloud Forests & Tea Ridges along the Stories Along The Malabar Coast journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Riverlands to Timber Quays",
                  "bodySubtitle": "DAYS 10–11 | PALAKKAD, BEYPORE & CALICUT",
                  "paragraphs": [
                    "Descend through the Palakkad Gap and follow craft and food traditions north toward Beypore shipyards and Calicut’s historic trading coast."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Handloom and artisan encounters in the Nila riverlands.",
                    "Visit traditional Uru boatbuilding yards at Beypore."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy1.webp",
                      "alt": "Travel scene from Riverlands to Timber Quays during the Stories Along The Malabar Coast journey"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 12 | CALICUT OR COCHIN",
                  "paragraphs": [
                    "Enjoy a final unhurried breakfast before a private transfer to the airport, with routing adapted to your onward flight."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Heritage homes, plantation retreats, and intimate nature stays selected for regional character.",
                "Private vehicle with a dedicated chauffeur throughout the road journey.",
                "Specialist guides arranged for heritage, ecology, craft, and food encounters.",
                "Flexible mornings and two-night stays wherever the route benefits from slower pacing."
              ],
              "image": "/images/impact/impact1.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Kerala",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Breathable cotton or linen for humid coastal days.",
                "A light layer for cooler highland mornings in Munnar and Periyar.",
                "Comfortable closed shoes for plantation and forest-edge walks.",
                "Modest clothing for sacred sites and community visits.",
                "A compact rain layer outside the driest winter months."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE GALLERY",
              "title": "Stays & Landscapes Along the Route",
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Private heritage walks through Fort Kochi and Mattancherry trading quarters on the Stories Along The Malabar Coast journey",
                  "caption": "Private heritage walks through Fort Kochi and Mattancherry trading quarters."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "An overnight backwater journey through quieter village canals of Vembanad on the Stories Along The Malabar Coast journey",
                  "caption": "An overnight backwater journey through quieter village canals of Vembanad."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Spice-estate and highland nature experiences around Periyar and Munnar on the Stories Along The Malabar Coast journey",
                  "caption": "Spice-estate and highland nature experiences around Periyar and Munnar."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Craft, food, and maritime encounters across Palakkad, Beypore, and Calicut on the Stories Along The Malabar Coast journey",
                  "caption": "Craft, food, and maritime encounters across Palakkad, Beypore, and Calicut."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Private heritage walks through Fort Kochi and Mattancherry trading quarters on the Stories Along The Malabar Coast journey",
                  "caption": "Private heritage walks through Fort Kochi and Mattancherry trading quarters."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The Malabar Coast reveals itself slowly, in harbour stories, boat wakes, spice gardens, and conversations that continue long after the road turns inland.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments That Define the Journey",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Private heritage walks through Fort Kochi and Mattancherry trading quarters on the Stories Along The Malabar Coast journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Private heritage walks through Fort Kochi and Mattancherry trading quarters."
                },
                {
                  "src": "/images/itineraries/dummy2.webp",
                  "alt": "An overnight backwater journey through quieter village canals of Vembanad on the Stories Along The Malabar Coast journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "An overnight backwater journey through quieter village canals of Vembanad."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Spice-estate and highland nature experiences around Periyar and Munnar on the Stories Along The Malabar Coast journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Spice-estate and highland nature experiences around Periyar and Munnar."
                },
                {
                  "src": "/images/itineraries/dummy4.webp",
                  "alt": "Craft, food, and maritime encounters across Palakkad, Beypore, and Calicut on the Stories Along The Malabar Coast journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Craft, food, and maritime encounters across Palakkad, Beypore, and Calicut."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Private heritage walks through Fort Kochi and Mattancherry trading quarters on the Stories Along The Malabar Coast journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Private heritage walks through Fort Kochi and Mattancherry trading quarters."
                },
                {
                  "src": "/images/itineraries/dummy6.webp",
                  "alt": "An overnight backwater journey through quieter village canals of Vembanad on the Stories Along The Malabar Coast journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "An overnight backwater journey through quieter village canals of Vembanad."
                }
              ]
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "SEASONAL CLIMATE NOTE",
              "text": "October to March offers the easiest balance of coastal weather and cool highland mornings. The monsoon brings dramatic green landscapes and quieter stays, but outdoor plans need more flexibility."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "The Rhythm You Carry Home",
              "paragraphs": [
                "The journey is less about collecting landmarks than understanding how water, trade, forest, food, and craft have shaped Kerala across centuries.",
                "What remains is a sequence of human-scale memories: a boatman’s story, tea shared on a verandah, the smell of timber at Beypore, and the changing light across the Ghats."
              ],
              "image": "/images/journal/journal5.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Kerala at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Kerala."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Kerala through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the ideal season for this route?",
                  "paragraphs": [
                    "October through March is the most comfortable period for combining the coast, backwaters, and high ranges."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "How active is the journey?",
                  "paragraphs": [
                    "Most days are easy to moderate, with optional forest and plantation walks adapted to your comfort."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can we spend longer in the backwaters or hills?",
                  "paragraphs": [
                    "Yes. The route is designed to stretch naturally around the places that matter most to you."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-2",
      "slug": "backwaters-spice-hills-and-sacred-groves",
      "type": "signature",
      "featured": true,
      "title": "Backwaters, Spice Hills & Sacred Groves",
      "region": "Kerala",
      "days": 10,
      "categories": [
        "nature",
        "wellness",
        "stays"
      ],
      "tags": [
        "#VEMBANAD",
        "#SPICEHILLS",
        "#SACREDGROVES"
      ],
      "intro": "Move from the still waters of Vembanad into spice gardens, forest edges, and sacred groves shaped by Kerala’s monsoon landscape.",
      "image": "/images/impact/impact2.webp",
      "alt": "Quiet Kerala waterway winding past coconut palms and forested hills after rain",
      "featuredDescription": "A slower Kerala journey centred on water, forest, restorative stays, and intimate encounters with people who care for these living landscapes.",
      "highlights": [
        {
          "icon": "boat",
          "label": "Private backwater canoeing"
        },
        {
          "icon": "village",
          "label": "Spice garden encounters"
        },
        {
          "icon": "wellness",
          "label": "Optional Ayurveda & rest"
        },
        {
          "icon": "village",
          "label": "Highland nature stays"
        }
      ]
    },
    "relatedSlugs": [
      "stories-along-the-malabar-coast",
      "across-the-palakkad-gap",
      "wayanad-forests-and-nila-riverlands"
    ],
    "seo": {
      "pageTitle": "Backwaters, Spice Hills & Sacred Groves | 10-Day Kerala Journey",
      "pageDesc": "Move from Vembanad’s quiet waterways into spice gardens, forest edges, wellness stays, and the green highlands of central Kerala.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Quiet Kerala waterway winding past coconut palms and forested hills after rain",
      "breadcrumbName": "Backwaters, Spice Hills & Sacred Groves",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Backwaters, Spice Hills & Sacred Groves"
        }
      ],
      "coverImage": "/images/home/journey-pc1.webp",
      "coverAlt": "Quiet Kerala waterway winding past coconut palms and forested hills after rain",
      "eyebrow": "Signature Itinerary",
      "title": "Backwaters, Spice Hills & Sacred Groves",
      "intro": "Move from the still waters of Vembanad into spice gardens, forest edges, and sacred groves shaped by Kerala’s monsoon landscape.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Nature & restoration"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Backwaters, Spice Hills & Sacred Groves",
      "shareText": "Move from the still waters of Vembanad into spice gardens, forest edges, and sacred groves shaped by Kerala’s monsoon landscape."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Begin beside Vembanad Lake, where canals, paddy fields, birdlife, and village rhythms make water the first storyteller. Then climb gradually into the Cardamom Hills, trading humidity for spice-scented forests and cooler plantation air.",
                "The route favours smaller properties, canoe-scale exploration, guided ecology, and spacious afternoons. Wellness can be woven in without turning the journey into a retreat programme, allowing nature and rest to remain the central rhythm."
              ],
              "image": "/images/home/forest-portrait.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Kerala",
              "imageAspectRatio": "4 / 5",
              "caption": "Kochi → Kumarakom → Alappuzha → Periyar → Vagamon → Kochi"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "First Impressions",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/home/journey-pc.webp",
                  "alt": "Private canoe exploration of narrow Kumarakom and Kuttanad waterways on the Backwaters, Spice Hills & Sacred Groves journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Private canoe exploration of narrow Kumarakom and Kuttanad waterways."
                },
                {
                  "src": "/images/home/journey-mob1.webp",
                  "alt": "Forest-edge walks and spice-garden interpretation near Periyar on the Backwaters, Spice Hills & Sacred Groves journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Forest-edge walks and spice-garden interpretation near Periyar."
                },
                {
                  "src": "/images/home/solo-landscape.webp",
                  "alt": "Restorative stays with room for Ayurveda and quiet mornings on the Backwaters, Spice Hills & Sacred Groves journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Restorative stays with room for Ayurveda and quiet mornings."
                },
                {
                  "src": "/images/itineraries/dummy1.webp",
                  "alt": "A final highland pause among Vagamon’s grasslands and plantation country on the Backwaters, Spice Hills & Sacred Groves journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "A final highland pause among Vagamon’s grasslands and plantation country."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Water as the First Story",
                  "bodySubtitle": "DAYS 1–2 | KOCHI & KUMARAKOM",
                  "paragraphs": [
                    "Arrive in Kochi and transfer to a lake-edge sanctuary near Kumarakom. Ease into the journey with birdlife, village lanes, and a sunset on Vembanad."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/journey-mob.webp",
                      "alt": "Travel scene from Water as the First Story during the Backwaters, Spice Hills & Sacred Groves journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Below Sea Level",
                  "bodySubtitle": "DAYS 3–4 | KUTTANAD & ALAPPUZHA",
                  "paragraphs": [
                    "Explore Kuttanad’s watery agriculture by small boat and spend the night close to the canals rather than rushing through them."
                  ],
                  "listItems": [
                    "Canoe through narrow village waterways.",
                    "Meet coir workers and local food producers."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/journey-pc1.webp",
                      "alt": "Landscape and local detail from Below Sea Level on the Backwaters, Spice Hills & Sacred Groves route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Spice Forests",
                  "bodySubtitle": "DAYS 5–7 | PERIYAR HIGHLANDS",
                  "paragraphs": [
                    "Climb into cardamom country for naturalist-led walks, plantation kitchens, and flexible time around the forest edge."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact2.webp",
                      "alt": "Regional landscape encountered around Spice Forests during the Backwaters, Spice Hills & Sacred Groves journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Grassland Quiet",
                  "bodySubtitle": "DAYS 8–9 | VAGAMON",
                  "paragraphs": [
                    "Cross to Vagamon for misty ridges, tea and pine landscapes, and a slower final stay with optional wellness treatments."
                  ],
                  "listItems": [
                    "Short ridge walks timed for cooler light.",
                    "Unstructured afternoons for rest and reading."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy1.webp",
                      "alt": "Cultural travel detail representing Grassland Quiet during the Backwaters, Spice Hills & Sacred Groves journey"
                    },
                    {
                      "src": "/images/itineraries/dummy5.webp",
                      "alt": "Second editorial scene from Grassland Quiet along the Backwaters, Spice Hills & Sacred Groves journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Return to the Coast",
                  "bodySubtitle": "DAY 10 | KOCHI",
                  "paragraphs": [
                    "Drive back to Kochi with a relaxed lunch stop before your onward transfer."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Lake-edge heritage stays and small eco-retreats with strong landscape relationships.",
                "Private transfers designed to avoid unnecessary backtracking.",
                "Naturalist and plantation hosts used where interpretation adds real value.",
                "Wellness sessions arranged as optional additions rather than fixed daily programming."
              ],
              "image": "/images/impact/impact2.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Kerala",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light, quick-drying clothing for the backwater belt.",
                "A breathable rain shell during shoulder and monsoon seasons.",
                "Walking shoes with reliable grip for plantation paths.",
                "A light sweater for highland evenings.",
                "Swimwear and comfortable resort clothing for restorative stays."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Kerala changes character with altitude, but the journey remains connected by water, shade, rain, and the generosity of people who live close to the land.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "MONSOON & WELLNESS NOTE",
              "text": "June to September can be deeply atmospheric for this route, especially for wellness-focused travellers. Expect heavy rain at times, slower road travel, and flexible outdoor scheduling."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "A Landscape That Slows You Down",
              "paragraphs": [
                "This is Kerala without the urge to cover everything. Water, forest, spice, and rest are allowed to occupy the time they deserve.",
                "The result is a journey that feels restorative without becoming passive, with enough structure to understand the landscape and enough space to simply inhabit it."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Kerala through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is this route suitable during the monsoon?",
                  "paragraphs": [
                    "Yes, especially for travellers comfortable with rain and flexible outdoor plans. The landscapes are at their most intensely green."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Can Ayurveda be made a larger part of the journey?",
                  "paragraphs": [
                    "Yes. We can add consultations and treatments while keeping the route balanced with nature and cultural experiences."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How much time is spent on boats?",
                  "paragraphs": [
                    "Boat experiences are spread across the first half of the route and use smaller craft wherever possible for quieter waterways."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-3",
      "slug": "travancore-to-cape-comorin",
      "type": "signature",
      "featured": true,
      "title": "From Travancore to Cape Comorin",
      "region": "Kerala & Tamil Nadu",
      "days": 9,
      "categories": [
        "culture",
        "offbeat",
        "bespoke"
      ],
      "tags": [
        "#TRAVANCORE",
        "#KANYAKUMARI",
        "#PALACECRAFT"
      ],
      "intro": "Trace the southern edge of old Travancore from Thiruvananthapuram through timber palaces, temple towns, coastal villages, and Cape Comorin.",
      "image": "/images/journal/journal2.webp",
      "alt": "Temple roofs and tropical hills across the old Travancore landscape near Kanyakumari",
      "featuredDescription": "A borderland journey where Kerala and Tamil traditions overlap through architecture, ritual, food, music, and the dramatic meeting of seas at India’s southern tip.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Travancore palace heritage"
        },
        {
          "icon": "temple",
          "label": "Sacred borderland towns"
        },
        {
          "icon": "village",
          "label": "Nanjil Nadu foodways"
        },
        {
          "icon": "boat",
          "label": "Cape Comorin coast"
        }
      ]
    },
    "relatedSlugs": [
      "chettinad-courtyards-and-chola-country",
      "coromandel-temples-and-french-quarters",
      "across-the-palakkad-gap"
    ],
    "seo": {
      "pageTitle": "Travancore to Cape Comorin | 9-Day Kerala & Tamil Nadu Journey",
      "pageDesc": "Trace old Travancore from Thiruvananthapuram to Padmanabhapuram, Nagercoil, and Kanyakumari through architecture, food, and coastal culture.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Temple roofs and tropical hills across the old Travancore landscape near Kanyakumari",
      "breadcrumbName": "From Travancore to Cape Comorin",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "From Travancore to Cape Comorin"
        }
      ],
      "coverImage": "/images/impact/impact3.webp",
      "coverAlt": "Temple roofs and tropical hills across the old Travancore landscape near Kanyakumari",
      "eyebrow": "Signature Itinerary",
      "title": "From Travancore to Cape Comorin",
      "intro": "Trace the southern edge of old Travancore from Thiruvananthapuram through timber palaces, temple towns, coastal villages, and Cape Comorin.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Kerala & Tamil Nadu"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Borderland heritage"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "From Travancore to Cape Comorin",
      "shareText": "Trace the southern edge of old Travancore from Thiruvananthapuram through timber palaces, temple towns, coastal villages, and Cape Comorin."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This journey follows a cultural landscape older than today’s state boundary. Thiruvananthapuram’s royal and temple traditions lead south toward Padmanabhapuram Palace, whose timber architecture remains deeply tied to Kerala even though it now stands in Tamil Nadu.",
                "Further south, Nagercoil and Kanyakumari reveal another shift in language, cuisine, sacred geography, and coastal life. The experience is designed around these transitions, with enough time to understand why the border feels porous rather than abrupt."
              ],
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Private architectural interpretation at Padmanabhapuram Palace and surrounding heritage sites.",
                "Temple, palace, and craft traditions across the historic Travancore cultural zone.",
                "Coastal village and food experiences around Nagercoil and Kanyakumari.",
                "Sunrise and evening light at India’s southern cape without rushing the visit."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes from the Journey",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Kerala & Tamil Nadu",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Kerala & Tamil Nadu, selected to complement the route’s slower editorial rhythm."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Royal Travancore",
                  "bodySubtitle": "DAYS 1–2 | THIRUVANANTHAPURAM",
                  "paragraphs": [
                    "Begin with the city’s palace precincts, temple architecture, museums, and neighbourhood food traditions, using a historian to set the Travancore context."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/journey-mob1.webp",
                      "alt": "Travel scene from Royal Travancore during the From Travancore to Cape Comorin journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Toward the Border",
                  "bodySubtitle": "DAY 3 | NEYYATTINKARA & SOUTHERN VILLAGES",
                  "paragraphs": [
                    "Travel through smaller settlements south of the capital for local market, craft, and culinary encounters before continuing toward the old royal corridor."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/solo-landscape.webp",
                      "alt": "Landscape and local detail from Toward the Border on the From Travancore to Cape Comorin route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Timber, Courtyards & Kingship",
                  "bodySubtitle": "DAYS 4–5 | PADMANABHAPURAM",
                  "paragraphs": [
                    "Spend unhurried time with the palace complex and nearby sacred architecture, focusing on timber construction, climate-responsive design, murals, and court culture."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Private architecture-focused walkthrough.",
                    "Traditional lunch drawing from both Kerala and Tamil kitchens."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact3.webp",
                      "alt": "Regional landscape encountered around Timber, Courtyards & Kingship during the From Travancore to Cape Comorin journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: The Cultural Seam",
                  "bodySubtitle": "DAYS 6–7 | NAGERCOIL",
                  "paragraphs": [
                    "Explore the Nanjil Nadu landscape, where rice fields, churches, temples, markets, and regional cuisine show the long overlap of Kerala and Tamil influences."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy2.webp",
                      "alt": "Cultural travel detail representing The Cultural Seam during the From Travancore to Cape Comorin journey"
                    },
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Second editorial scene from The Cultural Seam along the From Travancore to Cape Comorin journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Three Seas, One Horizon",
                  "bodySubtitle": "DAY 8 | KANYAKUMARI",
                  "paragraphs": [
                    "Reach Cape Comorin for coastal walks, local fishing culture, and a deliberately slow evening and sunrise sequence at the southern tip."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Travel scene from Three Seas, One Horizon during the From Travancore to Cape Comorin journey"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Onward Journey",
                  "bodySubtitle": "DAY 9 | THIRUVANANTHAPURAM OR MADURAI CONNECTION",
                  "paragraphs": [
                    "Transfer onward according to your flight or rail plan, with optional extension north into Tamil Nadu."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Heritage hotels and intimate stays chosen for architectural or regional relevance.",
                "Private road travel with short daily driving wherever possible.",
                "Specialist interpretation for Travancore history, timber architecture, and sacred traditions.",
                "Meals selected to show the gradual shift from Kerala to Nanjil Nadu foodways."
              ],
              "image": "/images/impact/impact3.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Kerala & Tamil Nadu",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light cotton clothing for warm coastal conditions.",
                "Modest attire for temple and sacred-site visits.",
                "Easy slip-on footwear for places requiring shoes to be removed.",
                "Sun protection for exposed coastal walks at Kanyakumari.",
                "A lightweight shawl or layer for air-conditioned museums and vehicles."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE GALLERY",
              "title": "Stays & Landscapes Along the Route",
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Private architectural interpretation at Padmanabhapuram Palace and surrounding heritage sites on the From Travancore to Cape Comorin journey",
                  "caption": "Private architectural interpretation at Padmanabhapuram Palace and surrounding heritage sites."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Regional landscape and cultural detail encountered along the From Travancore to Cape Comorin journey",
                  "caption": "Temple, palace, and craft traditions across the historic Travancore cultural zone."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Coastal village and food experiences around Nagercoil and Kanyakumari on the From Travancore to Cape Comorin journey",
                  "caption": "Coastal village and food experiences around Nagercoil and Kanyakumari."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Regional landscape and cultural detail encountered along the From Travancore to Cape Comorin journey",
                  "caption": "Sunrise and evening light at India’s southern cape without rushing the visit."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Private architectural interpretation at Padmanabhapuram Palace and surrounding heritage sites on the From Travancore to Cape Comorin journey",
                  "caption": "Private architectural interpretation at Padmanabhapuram Palace and surrounding heritage sites."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Borders may change on maps, but architecture, recipes, ritual, and memory often continue across them without asking permission.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "CULTURAL ETIQUETTE NOTE",
              "text": "Temple access and photography rules vary by site. Clothing should cover shoulders and knees, and some inner sanctums may be restricted to practising Hindus. Your guide will brief you discreetly in advance."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Where Two Souths Meet",
              "paragraphs": [
                "The strength of this route lies in noticing continuity rather than difference. A roof profile, a spice mix, a courtly story, or a devotional song can carry Travancore across the modern border.",
                "By the time you reach Kanyakumari, the journey feels less like crossing states and more like following one cultural landscape to the sea."
              ],
              "image": "/images/itineraries/dummy4.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Kerala & Tamil Nadu at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Kerala & Tamil Nadu."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Kerala & Tamil Nadu through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Does the route involve many temple visits?",
                  "paragraphs": [
                    "Sacred architecture is important, but the journey balances temples with palaces, food, coastal life, and everyday culture."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Can Kanyakumari sunrise be avoided if we prefer a slower morning?",
                  "paragraphs": [
                    "Absolutely. The cape is meaningful at different times of day, and sunrise is optional."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can this journey continue deeper into Tamil Nadu?",
                  "paragraphs": [
                    "Yes. Madurai or Chettinad can be added naturally as an extension."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-4",
      "slug": "across-the-palakkad-gap",
      "type": "signature",
      "featured": false,
      "title": "Across the Palakkad Gap",
      "region": "Kerala & Tamil Nadu",
      "days": 9,
      "categories": [
        "nature",
        "culture",
        "offbeat"
      ],
      "tags": [
        "#PALAKKADGAP",
        "#ANAMALAI",
        "#KONGUNADU"
      ],
      "intro": "Cross the great natural passage through the Western Ghats, linking Kerala’s Nila riverlands with Pollachi, the Anamalai hills, and Tamil plantation country.",
      "image": "/images/impact/impact4.webp",
      "alt": "Western Ghats opening toward Palakkad plains and the green Anamalai foothills",
      "featuredDescription": "A landscape-led route through one of South India’s most important ecological and cultural corridors, moving from river plain to coconut belt and rainforest escarpment.",
      "highlights": [
        {
          "icon": "village",
          "label": "Nila riverland crafts"
        },
        {
          "icon": "village",
          "label": "Pollachi farm country"
        },
        {
          "icon": "wellness",
          "label": "Valparai slow stays"
        },
        {
          "icon": "village",
          "label": "Anamalai landscape walks"
        }
      ]
    },
    "relatedSlugs": [
      "backwaters-spice-hills-and-sacred-groves",
      "nilgiri-rails-to-mysore-palaces",
      "chettinad-courtyards-and-chola-country"
    ],
    "seo": {
      "pageTitle": "Across the Palakkad Gap | 9-Day Kerala & Tamil Nadu Journey",
      "pageDesc": "Cross the Palakkad Gap from Kerala’s Nila riverlands to Pollachi, Anamalai, and Valparai through farms, forests, and cultural borderlands.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Western Ghats opening toward Palakkad plains and the green Anamalai foothills",
      "breadcrumbName": "Across the Palakkad Gap",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Across the Palakkad Gap"
        }
      ],
      "coverImage": "/images/home/forest-landscape.webp",
      "coverAlt": "Western Ghats opening toward Palakkad plains and the green Anamalai foothills",
      "eyebrow": "Signature Itinerary",
      "title": "Across the Palakkad Gap",
      "intro": "Cross the great natural passage through the Western Ghats, linking Kerala’s Nila riverlands with Pollachi, the Anamalai hills, and Tamil plantation country.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Kerala & Tamil Nadu"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Landscape transitions"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Across the Palakkad Gap",
      "shareText": "Cross the great natural passage through the Western Ghats, linking Kerala’s Nila riverlands with Pollachi, the Anamalai hills, and Tamil plantation country."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The Palakkad Gap is more than a break in the Western Ghats. For centuries it has been a corridor for people, trade, winds, language, music, and food between Kerala and the Tamil plains. This journey makes that passage itself the subject.",
                "Begin with the Nila riverlands and Palakkad’s agrarian landscape, cross toward Pollachi’s coconut belt, then climb through the Anamalai hills to Valparai’s tea estates and rainforest fragments. The route rewards travellers who enjoy understanding why landscapes shape culture."
              ],
              "image": "/images/itineraries/dummy5.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Kerala & Tamil Nadu",
              "imageAspectRatio": "4 / 5",
              "caption": "Palakkad → Nila Riverlands → Pollachi → Anamalai → Valparai → Coimbatore",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Nila riverland craft and village encounters around Palakkad.",
                "The visual transition from Kerala paddy plains to Pollachi coconut country.",
                "Slow ascent through the Anamalai hills toward Valparai.",
                "Naturalist-led exploration of plantation and rainforest-edge ecosystems."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: At the Mouth of the Gap",
                  "bodySubtitle": "DAYS 1–2 | PALAKKAD",
                  "paragraphs": [
                    "Settle into Palakkad and explore fort, market, paddy landscapes, and the broader geography of the Gap with a local historian or naturalist."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Travel scene from At the Mouth of the Gap during the Across the Palakkad Gap journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: River, Craft & Memory",
                  "bodySubtitle": "DAY 3 | NILA RIVERLANDS",
                  "paragraphs": [
                    "Follow the Bharathapuzha landscape through villages associated with handloom, performance, and craft traditions before returning to the foothills."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/travel-video.webp",
                      "alt": "Landscape and local detail from River, Craft & Memory on the Across the Palakkad Gap route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Coconut Country",
                  "bodySubtitle": "DAYS 4–5 | POLLACHI",
                  "paragraphs": [
                    "Cross into Tamil Nadu and slow down among coconut farms, market towns, and the agricultural landscape around Pollachi."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Farm visit focused on water, crops, and local food.",
                    "Evening walk through quieter village roads."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact4.webp",
                      "alt": "Regional landscape encountered around Coconut Country during the Across the Palakkad Gap journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Climbing the Elephant Hills",
                  "bodySubtitle": "DAYS 6–8 | ANAMALAI & VALPARAI",
                  "paragraphs": [
                    "Ascend the Anamalai range into tea country, with naturalist-led forest-edge walks and time to understand the relationship between plantations and wildlife corridors."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Cultural travel detail representing Climbing the Elephant Hills during the Across the Palakkad Gap journey"
                    },
                    {
                      "src": "/images/itineraries/dummy7.webp",
                      "alt": "Second editorial scene from Climbing the Elephant Hills along the Across the Palakkad Gap journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Descent & Departure",
                  "bodySubtitle": "DAY 9 | COIMBATORE",
                  "paragraphs": [
                    "Descend toward Coimbatore for your onward flight or rail connection, stopping for a final Kongu-region meal."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Rural stays, plantation bungalows, and small hotels selected to match each landscape.",
                "Private vehicle suited to mountain roads and flexible wildlife-aware pacing.",
                "Local naturalists and cultural interpreters used on both sides of the state border.",
                "No unnecessary backtracking, with arrival in Kerala and departure from Coimbatore recommended."
              ],
              "image": "/images/impact/impact4.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Kerala & Tamil Nadu",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Breathable clothing for Palakkad and Pollachi’s warmer plains.",
                "A light jacket for Valparai evenings and early mornings.",
                "Closed walking shoes with grip for damp plantation paths.",
                "Binoculars for bird and wildlife observation in the Anamalai hills.",
                "Rain protection outside the driest winter period."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Landscape & Context",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Kerala & Tamil Nadu",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Kerala & Tamil Nadu, selected to complement the route’s slower editorial rhythm."
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "A mountain pass can become a cultural biography when you follow what moves through it: wind, grain, language, music, people, and memory.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments That Define the Journey",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Nila riverland craft and village encounters around Palakkad on the Across the Palakkad Gap journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Nila riverland craft and village encounters around Palakkad."
                },
                {
                  "src": "/images/itineraries/dummy5.webp",
                  "alt": "The visual transition from Kerala paddy plains to Pollachi coconut country on the Across the Palakkad Gap journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "The visual transition from Kerala paddy plains to Pollachi coconut country."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Slow ascent through the Anamalai hills toward Valparai on the Across the Palakkad Gap journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Slow ascent through the Anamalai hills toward Valparai."
                },
                {
                  "src": "/images/itineraries/dummy7.webp",
                  "alt": "Naturalist-led exploration of plantation and rainforest-edge ecosystems on the Across the Palakkad Gap journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Naturalist-led exploration of plantation and rainforest-edge ecosystems."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Nila riverland craft and village encounters around Palakkad on the Across the Palakkad Gap journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Nila riverland craft and village encounters around Palakkad."
                },
                {
                  "src": "/images/itineraries/dummy9.webp",
                  "alt": "The visual transition from Kerala paddy plains to Pollachi coconut country on the Across the Palakkad Gap journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "The visual transition from Kerala paddy plains to Pollachi coconut country."
                }
              ]
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "WILDLIFE & ROAD NOTE",
              "text": "The Anamalai and Valparai sector overlaps active wildlife landscapes. Driving is kept unhurried, night movement is minimized, and animal sightings are treated as chance encounters rather than promises."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "A Passage Through the Ghats",
              "paragraphs": [
                "The journey turns geography into a story. What begins as a broad opening in the mountains gradually reveals itself as a corridor that has shaped two neighbouring regions for generations.",
                "By the final descent, Kerala and Tamil Nadu feel connected by more than a road. They are linked by climate, crops, migration, trade, and the long memory of the Ghats."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Kerala & Tamil Nadu through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is Valparai suitable for travellers who do not trek?",
                  "paragraphs": [
                    "Yes. Most experiences can be designed around short walks, viewpoints, estate drives, and naturalist interpretation."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Which direction works best for this route?",
                  "paragraphs": [
                    "Palakkad to Coimbatore is usually the cleanest flow, but the route can be reversed around flight schedules."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Are wildlife sightings guaranteed?",
                  "paragraphs": [
                    "No. The focus is on habitat and ecology, with wildlife treated respectfully as an unpredictable bonus."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-5",
      "slug": "theyyam-coast-to-tulunadu",
      "type": "signature",
      "featured": true,
      "title": "Theyyam Coast to Tulunadu",
      "region": "Kerala & Karnataka",
      "days": 10,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#THEYYAM",
        "#BEKAL",
        "#TULUNADU"
      ],
      "intro": "Follow North Malabar into coastal Karnataka through Theyyam country, laterite forts, backwaters, temple towns, and the shared cultural world of Tulunadu.",
      "image": "/images/journal/journal3.webp",
      "alt": "Laterite coast and coconut groves along the cultural border of Kerala and Karnataka",
      "featuredDescription": "A rare border-coast journey linking ritual performance, sea-facing forts, boat life, cuisine, and the living traditions of Kerala and coastal Karnataka.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Theyyam shrine traditions"
        },
        {
          "icon": "boat",
          "label": "Kasaragod coast & backwaters"
        },
        {
          "icon": "village",
          "label": "Tulu kitchens & markets"
        },
        {
          "icon": "temple",
          "label": "Udupi & Yakshagana"
        }
      ]
    },
    "relatedSlugs": [
      "stories-along-the-malabar-coast",
      "wayanad-forests-and-nila-riverlands",
      "nilgiri-rails-to-mysore-palaces"
    ],
    "seo": {
      "pageTitle": "Theyyam Coast to Tulunadu | 10-Day Kerala & Karnataka Journey",
      "pageDesc": "Follow North Malabar into coastal Karnataka through Theyyam country, Bekal, Mangaluru, Udupi, temple traditions, food, and coastal culture.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Laterite coast and coconut groves along the cultural border of Kerala and Karnataka",
      "breadcrumbName": "Theyyam Coast to Tulunadu",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Theyyam Coast to Tulunadu"
        }
      ],
      "coverImage": "/images/impact/impact5.webp",
      "coverAlt": "Laterite coast and coconut groves along the cultural border of Kerala and Karnataka",
      "eyebrow": "Signature Itinerary",
      "title": "Theyyam Coast to Tulunadu",
      "intro": "Follow North Malabar into coastal Karnataka through Theyyam country, laterite forts, backwaters, temple towns, and the shared cultural world of Tulunadu.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Kerala & Karnataka"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Ritual & coast"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Theyyam Coast to Tulunadu",
      "shareText": "Follow North Malabar into coastal Karnataka through Theyyam country, laterite forts, backwaters, temple towns, and the shared cultural world of Tulunadu."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "North Malabar and coastal Karnataka share a world of laterite, coconut, monsoon, temple traditions, spirit worship, seafood, and performance. This route follows that cultural continuum rather than treating the state line as a hard break.",
                "Begin around Kannur when ritual calendars permit Theyyam encounters, continue through Kasaragod and Bekal, then cross into Mangaluru and Udupi. The journey is especially rewarding for travellers interested in living ritual, food, performance, and coastal identity."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "First Impressions",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Context-led Theyyam experience in North Malabar when seasonal calendars align on the Theyyam Coast to Tulunadu journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Context-led Theyyam experience in North Malabar when seasonal calendars align."
                },
                {
                  "src": "/images/itineraries/dummy2.webp",
                  "alt": "Bekal and Kasaragod’s forts, backwaters, and layered coastal communities on the Theyyam Coast to Tulunadu journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Bekal and Kasaragod’s forts, backwaters, and layered coastal communities."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Mangalorean and Tulu food traditions explored through homes and local kitchens on the Theyyam Coast to Tulunadu journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Mangalorean and Tulu food traditions explored through homes and local kitchens."
                },
                {
                  "src": "/images/itineraries/dummy4.webp",
                  "alt": "Yakshagana, temple culture, and coastal landscapes around Udupi and beyond on the Theyyam Coast to Tulunadu journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Yakshagana, temple culture, and coastal landscapes around Udupi and beyond."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Ritual North Malabar",
                  "bodySubtitle": "DAYS 1–3 | KANNUR",
                  "paragraphs": [
                    "Settle into Kannur and explore local shrines, weaving traditions, coastal food, and Theyyam with careful attention to season, community protocol, and ritual context."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy1.webp",
                      "alt": "Travel scene from Ritual North Malabar during the Theyyam Coast to Tulunadu journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Fort, Backwater & Borderland",
                  "bodySubtitle": "DAYS 4–5 | KASARAGOD & BEKAL",
                  "paragraphs": [
                    "Travel north through Valiyaparamba-side landscapes, laterite villages, and Bekal’s sea-facing fort while tracing the cultural transition toward Tulunadu."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact1.webp",
                      "alt": "Landscape and local detail from Fort, Backwater & Borderland on the Theyyam Coast to Tulunadu route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Tulu Coast",
                  "bodySubtitle": "DAYS 6–7 | MANGALURU",
                  "paragraphs": [
                    "Cross into Karnataka for markets, historic neighbourhoods, temple traditions, and a food programme spanning coastal vegetarian and seafood kitchens."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Private culinary walk with a local host.",
                    "Visit craft or tile-making traditions where access is available."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact5.webp",
                      "alt": "Regional landscape encountered around Tulu Coast during the Theyyam Coast to Tulunadu journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Faith, Performance & Shore",
                  "bodySubtitle": "DAYS 8–9 | UDUPI & COAST",
                  "paragraphs": [
                    "Explore Udupi’s sacred centre and the coast beyond, with optional Yakshagana depending on the performance calendar."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy4.webp",
                      "alt": "Cultural travel detail representing Faith, Performance & Shore during the Theyyam Coast to Tulunadu journey"
                    },
                    {
                      "src": "/images/itineraries/dummy8.webp",
                      "alt": "Second editorial scene from Faith, Performance & Shore along the Theyyam Coast to Tulunadu journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Departure",
                  "bodySubtitle": "DAY 10 | MANGALURU",
                  "paragraphs": [
                    "Return to Mangaluru for your onward flight after a relaxed coastal breakfast."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Heritage homes and coastal boutique stays with strong local character.",
                "Ritual visits scheduled only when appropriate and with local guidance.",
                "Private road transport along a compact coastal corridor.",
                "Food experiences designed around both vegetarian temple cuisine and regional coastal traditions."
              ],
              "image": "/images/impact/impact5.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Kerala & Karnataka",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light cotton clothing suited to humid coastal weather.",
                "Modest attire for shrine and temple visits.",
                "Sandals plus comfortable walking shoes for forts and village paths.",
                "A light rain layer during monsoon and shoulder seasons.",
                "Earplugs for travellers sensitive to loud ritual drums or late-night performances."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Along this coast, performance is not staged simply for visitors. It belongs to communities, calendars, gods, memory, and place.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "The Journey in Motion",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Kerala & Karnataka",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Kerala & Karnataka, selected to complement the route’s slower editorial rhythm."
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "RITUAL CALENDAR NOTE",
              "text": "Theyyam and Yakshagana are seasonal and community-rooted traditions. We never guarantee a performance on an arbitrary date; the route is shaped around authentic calendars when possible."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "A Coast Without a Hard Border",
              "paragraphs": [
                "The route makes sense when you stop asking where Kerala ends and Karnataka begins. Food, ritual, language, and landscape overlap in ways that are richer than a state boundary suggests.",
                "What you carry home is not one performance or fort, but an understanding of a coastal cultural zone that remains intensely alive."
              ],
              "image": "/images/itineraries/dummy6.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Kerala & Karnataka at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Kerala & Karnataka."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Kerala & Karnataka through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Can Theyyam be guaranteed on our dates?",
                  "paragraphs": [
                    "No. Authentic Theyyam follows local ritual calendars, so we build around confirmed community events rather than staging substitutes."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Is this route suitable for vegetarians?",
                  "paragraphs": [
                    "Very much so. Coastal Karnataka and Udupi offer especially strong vegetarian food traditions."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can we add beach time?",
                  "paragraphs": [
                    "Yes. We can add a quieter coastal stay without weakening the cultural flow of the route."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-6",
      "slug": "wayanad-forests-and-nila-riverlands",
      "type": "signature",
      "featured": false,
      "title": "Wayanad Forests & Nila Riverlands",
      "region": "Kerala",
      "days": 9,
      "categories": [
        "nature",
        "culture",
        "offbeat"
      ],
      "tags": [
        "#WAYANAD",
        "#NILAMBUR",
        "#NILA"
      ],
      "intro": "Connect Wayanad’s forested plateau with Nilambur’s teak country and the Nila riverlands through ecology, craft, food, and slower rural stays.",
      "image": "/images/impact/impact6.webp",
      "alt": "Mist rising through forested Wayanad slopes above Kerala’s northern river valleys",
      "featuredDescription": "A northern Kerala route that moves from forest and plantation landscapes into riverine craft country, avoiding the usual rush between headline attractions.",
      "highlights": [
        {
          "icon": "village",
          "label": "Wayanad farm encounters"
        },
        {
          "icon": "village",
          "label": "Nilambur teak country"
        },
        {
          "icon": "village",
          "label": "Nila cultural traditions"
        },
        {
          "icon": "wellness",
          "label": "Forest-edge slow stays"
        }
      ]
    },
    "relatedSlugs": [
      "stories-along-the-malabar-coast",
      "theyyam-coast-to-tulunadu",
      "backwaters-spice-hills-and-sacred-groves"
    ],
    "seo": {
      "pageTitle": "Wayanad Forests & Nila Riverlands | 9-Day Kerala Journey",
      "pageDesc": "Connect Wayanad’s forest plateau with Nilambur and the Nila riverlands through ecology, farms, craft, food, and slower rural stays.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Mist rising through forested Wayanad slopes above Kerala’s northern river valleys",
      "breadcrumbName": "Wayanad Forests & Nila Riverlands",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Wayanad Forests & Nila Riverlands"
        }
      ],
      "coverImage": "/images/home/forest-landscape.webp",
      "coverAlt": "Mist rising through forested Wayanad slopes above Kerala’s northern river valleys",
      "eyebrow": "Signature Itinerary",
      "title": "Wayanad Forests & Nila Riverlands",
      "intro": "Connect Wayanad’s forested plateau with Nilambur’s teak country and the Nila riverlands through ecology, craft, food, and slower rural stays.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Forest & river culture"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Wayanad Forests & Nila Riverlands",
      "shareText": "Connect Wayanad’s forested plateau with Nilambur’s teak country and the Nila riverlands through ecology, craft, food, and slower rural stays."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This route begins on the Malabar coast but quickly climbs into Wayanad’s plateau, where forest edges, farms, and indigenous histories require slower, locally guided exploration. From there it descends toward Nilambur’s teak country and the cultural landscape of the Nila.",
                "Rather than chasing a long list of sights, the journey is built around three connected landscapes: upland forest, foothill timber country, and river plain. Each is given enough time for walking, conversation, food, and small-scale cultural encounters."
              ],
              "image": "/images/home/journey-mob1.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Kerala",
              "imageAspectRatio": "4 / 5",
              "caption": "Calicut → Wayanad → Nilambur → Nila Riverlands → Palakkad"
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE GALLERY",
              "title": "A Visual Prelude",
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Naturalist-led forest and farm experiences across Wayanad’s plateau on the Wayanad Forests & Nila Riverlands journey",
                  "caption": "Naturalist-led forest and farm experiences across Wayanad’s plateau."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Teak, timber, and river landscapes around Nilambur on the Wayanad Forests & Nila Riverlands journey",
                  "caption": "Teak, timber, and river landscapes around Nilambur."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Handloom, performance, and village traditions across the Nila corridor on the Wayanad Forests & Nila Riverlands journey",
                  "caption": "Handloom, performance, and village traditions across the Nila corridor."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "A final Palakkad stay linking the riverlands to the Western Ghats on the Wayanad Forests & Nila Riverlands journey",
                  "caption": "A final Palakkad stay linking the riverlands to the Western Ghats."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Naturalist-led forest and farm experiences across Wayanad’s plateau on the Wayanad Forests & Nila Riverlands journey",
                  "caption": "Naturalist-led forest and farm experiences across Wayanad’s plateau."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Malabar Gateway",
                  "bodySubtitle": "DAY 1 | CALICUT",
                  "paragraphs": [
                    "Arrive in Calicut for a compact introduction to Malabar food and trade history before the climb inland."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy2.webp",
                      "alt": "Travel scene from Malabar Gateway during the Wayanad Forests & Nila Riverlands journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Forest Plateau",
                  "bodySubtitle": "DAYS 2–4 | WAYANAD",
                  "paragraphs": [
                    "Spend three nights in Wayanad with nature walks, farm visits, and context around local communities and the plateau’s layered history."
                  ],
                  "listItems": [
                    "Private naturalist walk in a suitable forest-edge landscape.",
                    "Farm-to-table meal focused on pepper, coffee, and seasonal produce."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact2.webp",
                      "alt": "Landscape and local detail from Forest Plateau on the Wayanad Forests & Nila Riverlands route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Teak & Foothills",
                  "bodySubtitle": "DAYS 5–6 | NILAMBUR",
                  "paragraphs": [
                    "Descend toward Nilambur for riverside landscapes, timber history, and quiet village routes at the base of the Ghats."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact6.webp",
                      "alt": "Regional landscape encountered around Teak & Foothills during the Wayanad Forests & Nila Riverlands journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: River of Culture",
                  "bodySubtitle": "DAYS 7–8 | NILA RIVERLANDS",
                  "paragraphs": [
                    "Move into the Bharathapuzha cultural belt for handloom, performance heritage, pottery, and intimate home-based encounters."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy5.webp",
                      "alt": "Cultural travel detail representing River of Culture during the Wayanad Forests & Nila Riverlands journey"
                    },
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Second editorial scene from River of Culture along the Wayanad Forests & Nila Riverlands journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Gap & Departure",
                  "bodySubtitle": "DAY 9 | PALAKKAD",
                  "paragraphs": [
                    "Conclude in Palakkad with a final meal and onward transfer to Coimbatore or Kochi depending on your schedule."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Forest-edge lodges and rural stays selected for quiet settings and responsible access.",
                "Private transfers timed to avoid rushed same-day sightseeing after long drives.",
                "Naturalists and craft specialists brought in for focused interpretation.",
                "Community visits arranged only through appropriate local partners."
              ],
              "image": "/images/impact/impact6.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Kerala",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light layers for variable plateau temperatures.",
                "Closed shoes suitable for forest-edge and farm walking.",
                "Rain protection for Wayanad outside the driest months.",
                "Modest casual clothing for village and home visits.",
                "A small daypack and reusable bottle for walking days."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Northern Kerala is at its best when the road leaves the coast, climbs through forest, and returns to the plains carrying stories with it.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments That Define the Journey",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Naturalist-led forest and farm experiences across Wayanad’s plateau on the Wayanad Forests & Nila Riverlands journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Naturalist-led forest and farm experiences across Wayanad’s plateau."
                },
                {
                  "src": "/images/itineraries/dummy7.webp",
                  "alt": "Teak, timber, and river landscapes around Nilambur on the Wayanad Forests & Nila Riverlands journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Teak, timber, and river landscapes around Nilambur."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Handloom, performance, and village traditions across the Nila corridor on the Wayanad Forests & Nila Riverlands journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Handloom, performance, and village traditions across the Nila corridor."
                },
                {
                  "src": "/images/itineraries/dummy9.webp",
                  "alt": "A final Palakkad stay linking the riverlands to the Western Ghats on the Wayanad Forests & Nila Riverlands journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "A final Palakkad stay linking the riverlands to the Western Ghats."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Naturalist-led forest and farm experiences across Wayanad’s plateau on the Wayanad Forests & Nila Riverlands journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Naturalist-led forest and farm experiences across Wayanad’s plateau."
                },
                {
                  "src": "/images/itineraries/dummy11.webp",
                  "alt": "Teak, timber, and river landscapes around Nilambur on the Wayanad Forests & Nila Riverlands journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Teak, timber, and river landscapes around Nilambur."
                }
              ]
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "FOREST ACCESS NOTE",
              "text": "Protected-area access, trail permissions, and community visits can change with weather and local regulations. The route uses flexible alternatives rather than forcing a fixed wildlife schedule."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "From Canopy to River Plain",
              "paragraphs": [
                "Wayanad, Nilambur, and the Nila are rarely experienced as one connected journey, yet the transition between them is precisely what gives this route its character.",
                "The memories are quieter: wet earth after rain, pepper vines on a farm, a loom in motion, teak shadows, and the wide river opening toward Palakkad."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Kerala through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is this a wildlife safari itinerary?",
                  "paragraphs": [
                    "No. Nature is central, but the emphasis is on landscape, ecology, farms, and guided walking rather than vehicle safaris."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Can we add more time in Wayanad?",
                  "paragraphs": [
                    "Yes. Wayanad is the easiest section to extend for additional nature, wellness, or farm-based experiences."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Which airport works best?",
                  "paragraphs": [
                    "Calicut is ideal for arrival; departure can be planned through Coimbatore, Calicut, or Kochi depending on the final route."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-7",
      "slug": "stone-canyon-and-temple-roads-of-rayalaseema",
      "type": "signature",
      "featured": false,
      "title": "Stone, Canyon & Temple Roads of Rayalaseema",
      "region": "Andhra Pradesh",
      "days": 9,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#RAYALASEEMA",
        "#GANDIKOTA",
        "#LEPAKSHI"
      ],
      "intro": "Journey through Rayalaseema’s granite plains and sandstone gorges, linking Lepakshi, Gandikota, Belum, Tadipatri, and the sacred south of Andhra Pradesh.",
      "image": "/images/home/journey-pc.webp",
      "alt": "Warm stone escarpments and temple country beneath the wide skies of Rayalaseema",
      "featuredDescription": "A deeply architectural road journey through dramatic geology, Vijayanagara-era art, cave landscapes, and temple towns across southern Andhra Pradesh.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Lepakshi Vijayanagara art"
        },
        {
          "icon": "village",
          "label": "Gandikota canyon country"
        },
        {
          "icon": "temple",
          "label": "Tadipatri temple sculpture"
        },
        {
          "icon": "wellness",
          "label": "Slow road pacing"
        }
      ]
    },
    "relatedSlugs": [
      "sandstone-kingdoms-of-the-deccan",
      "eastern-ghats-coffee-and-coast",
      "chettinad-courtyards-and-chola-country"
    ],
    "seo": {
      "pageTitle": "Rayalaseema Stone, Canyon & Temple Roads | 9-Day Andhra Journey",
      "pageDesc": "Journey through Rayalaseema from Lepakshi to Gandikota, Belum, Tadipatri, and Tirupati through temple art, caves, canyon, and stone landscapes.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Warm stone escarpments and temple country beneath the wide skies of Rayalaseema",
      "breadcrumbName": "Stone, Canyon & Temple Roads of Rayalaseema",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Stone, Canyon & Temple Roads of Rayalaseema"
        }
      ],
      "coverImage": "/images/impact/impact1.webp",
      "coverAlt": "Warm stone escarpments and temple country beneath the wide skies of Rayalaseema",
      "eyebrow": "Signature Itinerary",
      "title": "Stone, Canyon & Temple Roads of Rayalaseema",
      "intro": "Journey through Rayalaseema’s granite plains and sandstone gorges, linking Lepakshi, Gandikota, Belum, Tadipatri, and the sacred south of Andhra Pradesh.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Andhra Pradesh"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Stone & sacred landscape"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Stone, Canyon & Temple Roads of Rayalaseema",
      "shareText": "Journey through Rayalaseema’s granite plains and sandstone gorges, linking Lepakshi, Gandikota, Belum, Tadipatri, and the sacred south of Andhra Pradesh."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Rayalaseema rewards travellers who enjoy heat, stone, distance, and detail. Begin at Lepakshi’s Vijayanagara-era temple complex, continue through the Penna landscape to Gandikota’s dramatic gorge, then connect Belum’s cave system and the sculptural temple traditions of Tadipatri.",
                "The route is intentionally road-based and spacious. Early starts protect the best light and cooler hours, while longer midday pauses keep temple and canyon visits comfortable. Tirupati provides a final sacred counterpoint before departure."
              ],
              "image": "/images/itineraries/dummy7.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Andhra Pradesh",
              "imageAspectRatio": "4 / 5",
              "caption": "Bengaluru → Lepakshi → Gandikota → Belum → Tadipatri → Tirupati",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Vijayanagara painting, sculpture, and architecture at Lepakshi.",
                "Sunrise and evening light over Gandikota’s Penna gorge.",
                "A guided visit through the limestone formations of Belum Caves.",
                "Temple sculpture and sacred architecture across Tadipatri and Tirupati."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Painted Ceilings & Granite",
                  "bodySubtitle": "DAYS 1–2 | LEPAKSHI",
                  "paragraphs": [
                    "Travel from Bengaluru into Andhra Pradesh and spend time with Lepakshi’s temple architecture, painted ceilings, sculptural details, and surrounding granite landscape."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Travel scene from Painted Ceilings & Granite during the Stone, Canyon & Temple Roads of Rayalaseema journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: The Penna Gorge",
                  "bodySubtitle": "DAYS 3–4 | GANDIKOTA",
                  "paragraphs": [
                    "Continue east to Gandikota for fort walls, canyon viewpoints, village life, and the changing colour of the gorge at dawn and dusk."
                  ],
                  "listItems": [
                    "Sunrise walk before the day warms.",
                    "Fort and temple interpretation with a regional guide."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact3.webp",
                      "alt": "Landscape and local detail from The Penna Gorge on the Stone, Canyon & Temple Roads of Rayalaseema route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Beneath the Limestone",
                  "bodySubtitle": "DAY 5 | BELUM",
                  "paragraphs": [
                    "Travel to Belum Caves for a slower geological experience before continuing to a comfortable overnight base."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal1.webp",
                      "alt": "Regional landscape encountered around Beneath the Limestone during the Stone, Canyon & Temple Roads of Rayalaseema journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Stone Craft & Temple Roads",
                  "bodySubtitle": "DAYS 6–7 | TADIPATRI & RAYALASEEMA COUNTRYSIDE",
                  "paragraphs": [
                    "Explore the sculptural vocabulary of regional temples and the dry agricultural landscape around them, with long lunch pauses during hotter hours."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Cultural travel detail representing Stone Craft & Temple Roads during the Stone, Canyon & Temple Roads of Rayalaseema journey"
                    },
                    {
                      "src": "/images/itineraries/dummy10.webp",
                      "alt": "Second editorial scene from Stone Craft & Temple Roads along the Stone, Canyon & Temple Roads of Rayalaseema journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Sacred South Andhra",
                  "bodySubtitle": "DAY 8 | TIRUPATI REGION",
                  "paragraphs": [
                    "Reach the Tirupati region for temple-town context, food, and a final evening shaped around your interest in pilgrimage or architecture."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy7.webp",
                      "alt": "Travel scene from Sacred South Andhra during the Stone, Canyon & Temple Roads of Rayalaseema journey"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure",
                  "bodySubtitle": "DAY 9 | TIRUPATI OR CHENNAI CONNECTION",
                  "paragraphs": [
                    "Transfer to the most convenient airport or rail connection after breakfast."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Characterful hotels and heritage-style stays chosen for comfort in a road-intensive region.",
                "Private air-conditioned vehicle with early departures on exposed sightseeing days.",
                "Regional historians or architecture guides arranged at the most significant sites.",
                "Flexible sacred-site planning around access rules, festival crowds, and personal interest."
              ],
              "image": "/images/journal/journal1.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Andhra Pradesh",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light breathable clothing for warm, dry daytime conditions.",
                "A hat, sunscreen, and refillable bottle for exposed fort and canyon walks.",
                "Comfortable shoes with grip for stone steps and cave surfaces.",
                "Modest temple clothing that covers shoulders and knees.",
                "A light scarf for dust and strong afternoon sun."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Landscape & Context",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Andhra Pradesh",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Andhra Pradesh, selected to complement the route’s slower editorial rhythm."
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "In Rayalaseema, distance is part of the story. Stone, heat, devotion, and empire become legible only when you give the road enough time.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "HEAT & WALKING NOTE",
              "text": "October to February is generally the most comfortable window. Exposed stone sites can become very hot later in the day, so major walks are scheduled early with generous midday breaks."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "A Journey Written in Stone",
              "paragraphs": [
                "The power of Rayalaseema lies in scale: giant boulders, deep gorges, painted temple ceilings, carved pillars, and long horizons between settlements.",
                "By slowing the road down, the region stops feeling sparse and begins to read as a connected landscape of geology, devotion, and dynastic memory."
              ],
              "image": "/images/itineraries/dummy7.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Andhra Pradesh at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Andhra Pradesh."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Andhra Pradesh through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is this itinerary physically demanding?",
                  "paragraphs": [
                    "It includes uneven stone, cave surfaces, and exposed walks, but daily distances can be shortened and adapted."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Why begin from Bengaluru?",
                  "paragraphs": [
                    "Lepakshi is naturally approached from Bengaluru, creating a cleaner road flow into southern Andhra Pradesh."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can Tirupati be omitted?",
                  "paragraphs": [
                    "Yes. The final days can instead focus on additional Rayalaseema heritage or a relaxed departure routing."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-8",
      "slug": "eastern-ghats-coffee-and-coast",
      "type": "signature",
      "featured": false,
      "title": "Eastern Ghats, Coffee & Coast",
      "region": "Andhra Pradesh",
      "days": 8,
      "categories": [
        "nature",
        "culture",
        "stays"
      ],
      "tags": [
        "#ARAKU",
        "#BORRACAVES",
        "#VIZAG"
      ],
      "intro": "Rise from Visakhapatnam’s coast into Araku’s coffee-growing Eastern Ghats, with caves, hill communities, Buddhist heritage, and forested valleys along the way.",
      "image": "/images/home/travel-video.webp",
      "alt": "Green Eastern Ghats valleys descending toward the blue coastline near Visakhapatnam",
      "featuredDescription": "A compact Andhra journey that connects sea, ancient monastic landscapes, limestone caves, coffee country, and the cultural life of the Eastern Ghats.",
      "highlights": [
        {
          "icon": "village",
          "label": "Araku coffee farms"
        },
        {
          "icon": "wellness",
          "label": "Eastern Ghats valley stays"
        },
        {
          "icon": "temple",
          "label": "Buddhist hill heritage"
        },
        {
          "icon": "village",
          "label": "Locally hosted encounters"
        }
      ]
    },
    "relatedSlugs": [
      "stone-canyon-and-temple-roads-of-rayalaseema",
      "brahmaputra-tea-and-living-islands",
      "backwaters-spice-hills-and-sacred-groves"
    ],
    "seo": {
      "pageTitle": "Eastern Ghats, Coffee & Coast | 8-Day Andhra Journey",
      "pageDesc": "Rise from Visakhapatnam into Araku’s Eastern Ghats for Borra Caves, coffee farms, hill communities, Buddhist heritage, and forested valleys.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Green Eastern Ghats valleys descending toward the blue coastline near Visakhapatnam",
      "breadcrumbName": "Eastern Ghats, Coffee & Coast",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Eastern Ghats, Coffee & Coast"
        }
      ],
      "coverImage": "/images/home/journey-pc1.webp",
      "coverAlt": "Green Eastern Ghats valleys descending toward the blue coastline near Visakhapatnam",
      "eyebrow": "Signature Itinerary",
      "title": "Eastern Ghats, Coffee & Coast",
      "intro": "Rise from Visakhapatnam’s coast into Araku’s coffee-growing Eastern Ghats, with caves, hill communities, Buddhist heritage, and forested valleys along the way.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "8 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Andhra Pradesh"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Coast to highlands"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Eastern Ghats, Coffee & Coast",
      "shareText": "Rise from Visakhapatnam’s coast into Araku’s coffee-growing Eastern Ghats, with caves, hill communities, Buddhist heritage, and forested valleys along the way."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Visakhapatnam offers an unusually direct transition from coastline to mountains. Begin with the city’s bays and Buddhist hill sites, then follow the rail-and-road corridor into the Eastern Ghats, where Borra’s limestone caves open beneath the Ananthagiri range.",
                "Araku is given several nights rather than treated as a day trip. Coffee farms, local food, valley walks, and carefully hosted cultural encounters create a fuller understanding of the plateau before the journey returns to the coast."
              ],
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Coastal and Buddhist heritage around Visakhapatnam and Thotlakonda.",
                "Guided exploration of Borra Caves in the Ananthagiri hills.",
                "Coffee, farm, and food experiences across the Araku Valley.",
                "Slow valley walks and locally hosted cultural encounters in the Eastern Ghats."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "First Impressions",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Coastal and Buddhist heritage around Visakhapatnam and Thotlakonda on the Eastern Ghats, Coffee & Coast journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Coastal and Buddhist heritage around Visakhapatnam and Thotlakonda."
                },
                {
                  "src": "/images/itineraries/dummy5.webp",
                  "alt": "Guided exploration of Borra Caves in the Ananthagiri hills on the Eastern Ghats, Coffee & Coast journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Guided exploration of Borra Caves in the Ananthagiri hills."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Coffee, farm, and food experiences across the Araku Valley on the Eastern Ghats, Coffee & Coast journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Coffee, farm, and food experiences across the Araku Valley."
                },
                {
                  "src": "/images/itineraries/dummy7.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Eastern Ghats, Coffee & Coast journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Slow valley walks and locally hosted cultural encounters in the Eastern Ghats."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 8-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Bay & Buddhist Hills",
                  "bodySubtitle": "DAYS 1–2 | VISAKHAPATNAM",
                  "paragraphs": [
                    "Settle by the coast and explore Visakhapatnam’s bay landscapes, local food, and hilltop Buddhist heritage before turning inland."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy4.webp",
                      "alt": "Travel scene from Bay & Buddhist Hills during the Eastern Ghats, Coffee & Coast journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Into the Caves",
                  "bodySubtitle": "DAY 3 | BORRA & ANANTHAGIRI",
                  "paragraphs": [
                    "Travel into the Eastern Ghats, stopping for a guided visit at Borra Caves and viewpoints across the Ananthagiri hills."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact4.webp",
                      "alt": "Landscape and local detail from Into the Caves on the Eastern Ghats, Coffee & Coast route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Coffee & Valley Life",
                  "bodySubtitle": "DAYS 4–6 | ARAKU VALLEY",
                  "paragraphs": [
                    "Spend three nights in Araku with coffee-focused experiences, gentle walks, market visits, and context around the valley’s indigenous communities."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Coffee farm visit with processing and tasting.",
                    "Locally hosted meal focused on regional ingredients."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Regional landscape encountered around Coffee & Valley Life during the Eastern Ghats, Coffee & Coast journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: A Slower Highland Day",
                  "bodySubtitle": "DAY 7 | EASTERN GHATS",
                  "paragraphs": [
                    "Use the final mountain day for a flexible nature walk, craft visit, or additional farm time rather than another long transfer."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy7.webp",
                      "alt": "Cultural travel detail representing A Slower Highland Day during the Eastern Ghats, Coffee & Coast journey"
                    },
                    {
                      "src": "/images/itineraries/dummy11.webp",
                      "alt": "Second editorial scene from A Slower Highland Day along the Eastern Ghats, Coffee & Coast journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Return to the Sea",
                  "bodySubtitle": "DAY 8 | VISAKHAPATNAM",
                  "paragraphs": [
                    "Descend to Visakhapatnam for your onward flight, with a final coastal meal if timing allows."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "City and hill stays selected to make the coast-to-mountain contrast feel deliberate.",
                "Private vehicle used in the hills, with rail segments considered when schedules suit the route.",
                "Coffee and cultural visits arranged through locally appropriate hosts.",
                "Cave and hill walking paced conservatively around humidity, heat, and terrain."
              ],
              "image": "/images/journal/journal2.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Andhra Pradesh",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light clothing for the coast and warmer valley afternoons.",
                "A light layer for cooler mornings in Araku.",
                "Closed shoes with grip for cave and hill paths.",
                "Rain protection during the southwest and retreating monsoon periods.",
                "A small daypack for farm and valley walks."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE GALLERY",
              "title": "Stays & Landscapes Along the Route",
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Coastal and Buddhist heritage around Visakhapatnam and Thotlakonda on the Eastern Ghats, Coffee & Coast journey",
                  "caption": "Coastal and Buddhist heritage around Visakhapatnam and Thotlakonda."
                },
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Guided exploration of Borra Caves in the Ananthagiri hills on the Eastern Ghats, Coffee & Coast journey",
                  "caption": "Guided exploration of Borra Caves in the Ananthagiri hills."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Coffee, farm, and food experiences across the Araku Valley on the Eastern Ghats, Coffee & Coast journey",
                  "caption": "Coffee, farm, and food experiences across the Araku Valley."
                },
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Eastern Ghats, Coffee & Coast journey",
                  "caption": "Slow valley walks and locally hosted cultural encounters in the Eastern Ghats."
                },
                {
                  "src": "/images/journal/journal5.webp",
                  "alt": "Coastal and Buddhist heritage around Visakhapatnam and Thotlakonda on the Eastern Ghats, Coffee & Coast journey",
                  "caption": "Coastal and Buddhist heritage around Visakhapatnam and Thotlakonda."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The surprise of this route is how quickly the sea disappears behind you and how completely the Eastern Ghats change the rhythm of the journey.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "CAVE & HILL ACCESS NOTE",
              "text": "Borra involves steps, damp surfaces, and variable crowd levels. Early visits are preferred, while hill experiences are adjusted around weather and local access conditions."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "From Salt Air to Coffee Shade",
              "paragraphs": [
                "Few Indian city breaks transform so quickly into a mountain journey. The coast, caves, coffee farms, and valley communities form a compact but varied sequence.",
                "Returning to Visakhapatnam after several nights in Araku makes the sea feel newly vivid, as if the route has changed not only altitude but attention."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Andhra Pradesh through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Can we take the train between Visakhapatnam and Araku?",
                  "paragraphs": [
                    "Yes, when timings and seat availability fit the itinerary. Road travel remains useful for flexible stops."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Is Borra suitable for everyone?",
                  "paragraphs": [
                    "The caves involve steps and damp surfaces. We can shorten the visit or provide alternatives for limited mobility."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How are community visits handled?",
                  "paragraphs": [
                    "They are arranged only through appropriate local hosts and are never treated as staged photo opportunities."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-9",
      "slug": "chettinad-courtyards-and-chola-country",
      "type": "signature",
      "featured": true,
      "title": "Chettinad Courtyards & Chola Country",
      "region": "Tamil Nadu",
      "days": 10,
      "categories": [
        "culture",
        "stays",
        "bespoke"
      ],
      "tags": [
        "#CHETTINAD",
        "#CHOLA",
        "#TAMILHERITAGE"
      ],
      "intro": "Travel from Madurai into Chettinad’s merchant mansions and onward to the Chola heartland of Thanjavur and Kumbakonam through architecture, craft, music, and food.",
      "image": "/images/journal/journal1.webp",
      "alt": "Sunlit Tamil courtyard with carved pillars and deep shade across Chettinad country",
      "featuredDescription": "A richly layered Tamil journey through temple cities, extraordinary courtyard houses, bronze and weaving traditions, and kitchens shaped by regional memory.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Madurai temple city"
        },
        {
          "icon": "village",
          "label": "Chettinad mansion kitchens"
        },
        {
          "icon": "temple",
          "label": "Chola architecture"
        },
        {
          "icon": "village",
          "label": "Bronze & weaving craft"
        }
      ]
    },
    "relatedSlugs": [
      "travancore-to-cape-comorin",
      "coromandel-temples-and-french-quarters",
      "sandstone-kingdoms-of-the-deccan"
    ],
    "seo": {
      "pageTitle": "Chettinad Courtyards & Chola Country | 10-Day Tamil Nadu Journey",
      "pageDesc": "Travel from Madurai through Chettinad to Thanjavur and Kumbakonam for merchant mansions, Chola temples, craft, music, and regional food.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Sunlit Tamil courtyard with carved pillars and deep shade across Chettinad country",
      "breadcrumbName": "Chettinad Courtyards & Chola Country",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Chettinad Courtyards & Chola Country"
        }
      ],
      "coverImage": "/images/home/solo-landscape.webp",
      "coverAlt": "Sunlit Tamil courtyard with carved pillars and deep shade across Chettinad country",
      "eyebrow": "Signature Itinerary",
      "title": "Chettinad Courtyards & Chola Country",
      "intro": "Travel from Madurai into Chettinad’s merchant mansions and onward to the Chola heartland of Thanjavur and Kumbakonam through architecture, craft, music, and food.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Tamil Nadu"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Architecture & craft"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Chettinad Courtyards & Chola Country",
      "shareText": "Travel from Madurai into Chettinad’s merchant mansions and onward to the Chola heartland of Thanjavur and Kumbakonam through architecture, craft, music, and food."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This is a journey through built space. Madurai begins with temple urbanism and markets, Chettinad slows the pace inside vast merchant houses and tile-lined courtyards, and the Chola country shifts attention toward monumental temples, bronze traditions, music, and river-fed agriculture.",
                "Food is treated as architecture’s companion: market breakfasts, Chettinad kitchens, temple-town tiffin, and home-style meals create a second route through the region. Several two-night stays protect the experience from becoming a temple checklist."
              ],
              "image": "/images/itineraries/dummy9.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Tamil Nadu",
              "imageAspectRatio": "4 / 5",
              "caption": "Madurai → Karaikudi → Kanadukathan → Thanjavur → Kumbakonam",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Private early-morning exploration of Madurai’s temple and market quarters.",
                "Extended time inside Chettinad mansions with architecture and culinary context.",
                "Thanjavur’s Chola heritage, painting traditions, and performing arts connections.",
                "Kumbakonam-area craft villages, bronze work, weaving, and temple landscapes."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Temple City Rhythms",
                  "bodySubtitle": "DAYS 1–2 | MADURAI",
                  "paragraphs": [
                    "Begin in Madurai with early market walks, temple-city morphology, flower and food traditions, and an evening tuned to the city’s devotional rhythm."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy5.webp",
                      "alt": "Travel scene from Temple City Rhythms during the Chettinad Courtyards & Chola Country journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Courtyards of Commerce",
                  "bodySubtitle": "DAYS 3–5 | CHETTINAD",
                  "paragraphs": [
                    "Base near Karaikudi for merchant mansions, tile and wood details, village streets, antique trade, and a serious exploration of Chettinad cooking."
                  ],
                  "listItems": [
                    "Architecture walk through mansion districts.",
                    "Private cooking session focused on regional spice techniques."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact5.webp",
                      "alt": "Landscape and local detail from Courtyards of Commerce on the Chettinad Courtyards & Chola Country route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Chola Scale",
                  "bodySubtitle": "DAYS 6–7 | THANJAVUR",
                  "paragraphs": [
                    "Continue to Thanjavur for monumental temple architecture, palace collections, painting traditions, and music-linked cultural context."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal3.webp",
                      "alt": "Regional landscape encountered around Chola Scale during the Chettinad Courtyards & Chola Country journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Bronze, Loom & Sacred Towns",
                  "bodySubtitle": "DAYS 8–9 | KUMBAKONAM & CRAFT VILLAGES",
                  "paragraphs": [
                    "Explore temple towns and artisan clusters around Kumbakonam, prioritising a few meaningful sites over exhaustive monument-hopping."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy8.webp",
                      "alt": "Cultural travel detail representing Bronze, Loom & Sacred Towns during the Chettinad Courtyards & Chola Country journey"
                    },
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Second editorial scene from Bronze, Loom & Sacred Towns along the Chettinad Courtyards & Chola Country journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Departure",
                  "bodySubtitle": "DAY 10 | TRICHY OR CHENNAI CONNECTION",
                  "paragraphs": [
                    "Transfer to the most practical airport or rail connection, with an optional final temple-town breakfast."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Heritage mansions and intimate hotels with strong architectural identity.",
                "Private vehicle with city walks scheduled early to avoid heat and crowds.",
                "Architecture, craft, and food specialists used selectively rather than one generic guide throughout.",
                "Temple visits balanced with homes, workshops, markets, and time inside living neighbourhoods."
              ],
              "image": "/images/journal/journal3.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Tamil Nadu",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Modest, breathable clothing for temples and warm afternoons.",
                "Easy footwear that can be removed frequently at sacred sites.",
                "A light shawl for early mornings and air-conditioned interiors.",
                "Sun protection for palace courtyards and exposed temple complexes.",
                "Extra luggage space if you plan to purchase textiles, tiles, or craft objects."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Tamil architecture teaches scale in two directions: the monumental temple tower and the intimate courtyard where a household once moved through its day.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "The Journey in Motion",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Tamil Nadu",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Tamil Nadu, selected to complement the route’s slower editorial rhythm."
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments That Define the Journey",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Private early-morning exploration of Madurai’s temple and market quarters on the Chettinad Courtyards & Chola Country journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Private early-morning exploration of Madurai’s temple and market quarters."
                },
                {
                  "src": "/images/itineraries/dummy10.webp",
                  "alt": "Extended time inside Chettinad mansions with architecture and culinary context on the Chettinad Courtyards & Chola Country journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Extended time inside Chettinad mansions with architecture and culinary context."
                },
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Thanjavur’s Chola heritage, painting traditions, and performing arts connections on the Chettinad Courtyards & Chola Country journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Thanjavur’s Chola heritage, painting traditions, and performing arts connections."
                },
                {
                  "src": "/images/itineraries/dummy12.webp",
                  "alt": "Kumbakonam-area craft villages, bronze work, weaving, and temple landscapes on the Chettinad Courtyards & Chola Country journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Kumbakonam-area craft villages, bronze work, weaving, and temple landscapes."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Private early-morning exploration of Madurai’s temple and market quarters on the Chettinad Courtyards & Chola Country journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Private early-morning exploration of Madurai’s temple and market quarters."
                },
                {
                  "src": "/images/itineraries/dummy14.webp",
                  "alt": "Extended time inside Chettinad mansions with architecture and culinary context on the Chettinad Courtyards & Chola Country journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Extended time inside Chettinad mansions with architecture and culinary context."
                }
              ]
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "TEMPLE & HEAT NOTE",
              "text": "Major temple visits are planned for early morning or late afternoon whenever possible. Midday is better used for craft studios, lunches, rest, and shaded heritage interiors."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "The House, the Temple, the Street",
              "paragraphs": [
                "Chettinad and Chola country become more meaningful when experienced as living systems rather than isolated monuments. Houses, streets, kitchens, workshops, and temples all participate in the same cultural landscape.",
                "The journey ends with an eye trained for detail: a bronze surface, a kolam at a threshold, the depth of a courtyard, and the geometry of a gopuram against evening light."
              ],
              "image": "/images/itineraries/dummy9.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Tamil Nadu at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Tamil Nadu."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Tamil Nadu through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is the itinerary heavily temple-focused?",
                  "paragraphs": [
                    "Temples are important, but roughly half the experience is architecture, food, craft, markets, and heritage homes."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Can the route include a cooking-focused day?",
                  "paragraphs": [
                    "Yes. Chettinad is particularly suitable for a deeper private culinary programme."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Are heritage mansions comfortable for luxury travellers?",
                  "paragraphs": [
                    "We select restored properties carefully, balancing architectural character with modern comfort and service."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-10",
      "slug": "nilgiri-rails-to-mysore-palaces",
      "type": "signature",
      "featured": false,
      "title": "Nilgiri Rails to Mysore Palaces",
      "region": "Tamil Nadu & Karnataka",
      "days": 9,
      "categories": [
        "nature",
        "culture",
        "stays"
      ],
      "tags": [
        "#NILGIRIS",
        "#MYSURU",
        "#HILLRAIL"
      ],
      "intro": "Link the Nilgiri plateau with Mysuru through hill rail, tea country, forest landscapes, royal architecture, and the cultural transition from Tamil Nadu into Karnataka.",
      "image": "/images/home/journey-pc1.webp",
      "alt": "Blue Nilgiri hills descending toward the forests and royal plains of Mysuru",
      "featuredDescription": "A classic South Indian mountain-to-palace route redesigned around slower stays, landscape interpretation, and meaningful rail, forest, and heritage experiences.",
      "highlights": [
        {
          "icon": "village",
          "label": "Nilgiri tea landscapes"
        },
        {
          "icon": "wellness",
          "label": "Hill bungalow stays"
        },
        {
          "icon": "village",
          "label": "Forest corridor journey"
        },
        {
          "icon": "temple",
          "label": "Mysuru royal heritage"
        }
      ]
    },
    "relatedSlugs": [
      "across-the-palakkad-gap",
      "sandstone-kingdoms-of-the-deccan",
      "theyyam-coast-to-tulunadu"
    ],
    "seo": {
      "pageTitle": "Nilgiri Rails to Mysore Palaces | 9-Day South India Journey",
      "pageDesc": "Link the Nilgiris with Mysuru through hill rail, tea country, forest corridors, palace heritage, markets, craft, and the Kaveri landscape.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Blue Nilgiri hills descending toward the forests and royal plains of Mysuru",
      "breadcrumbName": "Nilgiri Rails to Mysore Palaces",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Nilgiri Rails to Mysore Palaces"
        }
      ],
      "coverImage": "/images/journal/journal2.webp",
      "coverAlt": "Blue Nilgiri hills descending toward the forests and royal plains of Mysuru",
      "eyebrow": "Signature Itinerary",
      "title": "Nilgiri Rails to Mysore Palaces",
      "intro": "Link the Nilgiri plateau with Mysuru through hill rail, tea country, forest landscapes, royal architecture, and the cultural transition from Tamil Nadu into Karnataka.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Tamil Nadu & Karnataka"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Hills to royal plains"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Nilgiri Rails to Mysore Palaces",
      "shareText": "Link the Nilgiri plateau with Mysuru through hill rail, tea country, forest landscapes, royal architecture, and the cultural transition from Tamil Nadu into Karnataka."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The Nilgiris and Mysuru sit close on the map but feel dramatically different. Begin among tea slopes, shola fragments, old hill-station architecture, and the mountain railway before descending through forest corridors toward Karnataka’s royal plain.",
                "Mysuru then changes the scale again through palace architecture, markets, craft, food, and the Kaveri river landscape around Srirangapatna. The journey is designed so the forest crossing becomes a transition rather than simply a transfer."
              ],
              "image": "/images/itineraries/dummy10.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Tamil Nadu & Karnataka",
              "imageAspectRatio": "4 / 5",
              "caption": "Coimbatore → Coonoor → Ooty → Bandipur → Mysuru → Srirangapatna"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Tea Slopes & Hill Rail",
                  "bodySubtitle": "DAYS 1–3 | COONOOR",
                  "paragraphs": [
                    "Arrive via Coimbatore and settle in Coonoor for tea landscapes, garden walks, heritage architecture, and a mountain railway segment if schedules align."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Travel scene from Tea Slopes & Hill Rail during the Nilgiri Rails to Mysore Palaces journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: High Plateau",
                  "bodySubtitle": "DAY 4 | OOTY",
                  "paragraphs": [
                    "Continue across the Nilgiri plateau for botanical history, local food, and a slower look at the hill station beyond its busiest viewpoints."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact6.webp",
                      "alt": "Landscape and local detail from High Plateau on the Nilgiri Rails to Mysore Palaces route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Forest Descent",
                  "bodySubtitle": "DAY 5 | BANDIPUR CORRIDOR",
                  "paragraphs": [
                    "Descend toward Karnataka through the forest corridor in daylight, with a nature-focused stop or overnight near the edge of the reserve."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal4.webp",
                      "alt": "Regional landscape encountered around Forest Descent during the Nilgiri Rails to Mysore Palaces journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Royal Plain",
                  "bodySubtitle": "DAYS 6–8 | MYSURU & SRIRANGAPATNA",
                  "paragraphs": [
                    "Explore Mysuru’s palace, market, food, and craft traditions, then spend time along the Kaveri at Srirangapatna with historical interpretation."
                  ],
                  "listItems": [
                    "Early market and food walk in Mysuru.",
                    "Private history-focused visit to Srirangapatna."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Cultural travel detail representing Royal Plain during the Nilgiri Rails to Mysore Palaces journey"
                    },
                    {
                      "src": "/images/itineraries/dummy13.webp",
                      "alt": "Second editorial scene from Royal Plain along the Nilgiri Rails to Mysore Palaces journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Onward Connection",
                  "bodySubtitle": "DAY 9 | BENGALURU",
                  "paragraphs": [
                    "Transfer to Bengaluru for your onward flight, with a relaxed meal break on the way."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Hill bungalows and elegant city stays chosen for setting and character.",
                "Rail segments booked only when they genuinely improve the route.",
                "Forest-sector driving restricted to sensible daylight hours.",
                "Specialist guides used separately for Nilgiri ecology and Mysuru history."
              ],
              "image": "/images/journal/journal4.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Tamil Nadu & Karnataka",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Layered clothing for cool Nilgiri mornings and warmer Mysuru afternoons.",
                "Comfortable walking shoes for estates, gardens, and palace precincts.",
                "A compact rain layer for unpredictable hill weather.",
                "Binoculars for forest and birdlife observation.",
                "Modest attire for sacred sites around Mysuru and Srirangapatna."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE GALLERY",
              "title": "Stays & Landscapes Along the Route",
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Nilgiri Rails to Mysore Palaces journey",
                  "caption": "A carefully timed Nilgiri Mountain Railway segment when seats are available."
                },
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Tea, garden, and shola landscape experiences around Coonoor and Ooty on the Nilgiri Rails to Mysore Palaces journey",
                  "caption": "Tea, garden, and shola landscape experiences around Coonoor and Ooty."
                },
                {
                  "src": "/images/journal/journal5.webp",
                  "alt": "A daylight forest corridor journey through the Bandipur region on the Nilgiri Rails to Mysore Palaces journey",
                  "caption": "A daylight forest corridor journey through the Bandipur region."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Mysuru palace, market, craft, and Srirangapatna heritage with specialist context on the Nilgiri Rails to Mysore Palaces journey",
                  "caption": "Mysuru palace, market, craft, and Srirangapatna heritage with specialist context."
                },
                {
                  "src": "/images/home/forest-landscape.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Nilgiri Rails to Mysore Palaces journey",
                  "caption": "A carefully timed Nilgiri Mountain Railway segment when seats are available."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The beauty of this route is the descent: tea gives way to forest, forest opens into royal plain, and one cultural world quietly becomes another.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "RAIL & FOREST NOTE",
              "text": "Nilgiri Mountain Railway seats are subject to schedule and availability. Forest transit is kept to legal daylight windows, and wildlife sightings are never guaranteed."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "From Blue Hills to Royal Gold",
              "paragraphs": [
                "The route works because the landscapes do the storytelling. The Nilgiris provide altitude and cool light; the forest corridor provides transition; Mysuru brings ceremony, craft, and urban grace.",
                "Instead of treating Ooty and Mysuru as separate destinations, the journey reveals the ecological and historical continuity between them."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Tamil Nadu & Karnataka through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is the Nilgiri Mountain Railway guaranteed?",
                  "paragraphs": [
                    "No. We plan around availability and can substitute a scenic road segment without weakening the journey."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Will we do a wildlife safari?",
                  "paragraphs": [
                    "A safari can be added, but the core route does not depend on sightings or a fixed game-drive programme."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can Mysuru be extended?",
                  "paragraphs": [
                    "Yes. Extra nights work well for craft, yoga, food, or a slower palace-and-market programme."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-11",
      "slug": "sandstone-kingdoms-of-the-deccan",
      "type": "signature",
      "featured": true,
      "title": "Sandstone Kingdoms of the Deccan",
      "region": "Karnataka",
      "days": 9,
      "categories": [
        "culture",
        "offbeat",
        "bespoke"
      ],
      "tags": [
        "#HAMPI",
        "#BADAMI",
        "#CHALUKYA"
      ],
      "intro": "Read the Deccan through stone, moving from Hampi’s Vijayanagara landscape to Badami, Pattadakal, and Aihole across northern Karnataka.",
      "image": "/images/impact/impact3.webp",
      "alt": "Sandstone temples and boulder fields glowing in late light across northern Karnataka",
      "featuredDescription": "A serious heritage journey for travellers who want time with architecture, archaeology, landscape, and the dynasties that transformed the Deccan.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Hampi sacred & royal zones"
        },
        {
          "icon": "temple",
          "label": "Aihole architecture"
        },
        {
          "icon": "temple",
          "label": "Pattadakal temple group"
        },
        {
          "icon": "village",
          "label": "Badami cave landscape"
        }
      ]
    },
    "relatedSlugs": [
      "stone-canyon-and-temple-roads-of-rayalaseema",
      "chettinad-courtyards-and-chola-country",
      "nilgiri-rails-to-mysore-palaces"
    ],
    "seo": {
      "pageTitle": "Sandstone Kingdoms of the Deccan | 9-Day Karnataka Journey",
      "pageDesc": "Read northern Karnataka through Hampi, Aihole, Pattadakal, and Badami on a slower journey focused on architecture, archaeology, and landscape.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Sandstone temples and boulder fields glowing in late light across northern Karnataka",
      "breadcrumbName": "Sandstone Kingdoms of the Deccan",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Sandstone Kingdoms of the Deccan"
        }
      ],
      "coverImage": "/images/home/journey-pc.webp",
      "coverAlt": "Sandstone temples and boulder fields glowing in late light across northern Karnataka",
      "eyebrow": "Signature Itinerary",
      "title": "Sandstone Kingdoms of the Deccan",
      "intro": "Read the Deccan through stone, moving from Hampi’s Vijayanagara landscape to Badami, Pattadakal, and Aihole across northern Karnataka.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Karnataka"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Architecture & archaeology"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Sandstone Kingdoms of the Deccan",
      "shareText": "Read the Deccan through stone, moving from Hampi’s Vijayanagara landscape to Badami, Pattadakal, and Aihole across northern Karnataka."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Northern Karnataka holds several of India’s most important architectural landscapes within a route that rewards time and specialist interpretation. Hampi’s monumental ruins and boulder terrain lead naturally toward the Early Chalukyan experiments of Aihole, Pattadakal, and Badami.",
                "Rather than compressing the circuit into a hurried checklist, this itinerary uses early-morning and late-afternoon site visits, long lunches, and dedicated architecture sessions. The slower rhythm allows individual temples and urban spaces to remain distinct in memory."
              ],
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Multiple sessions across Hampi’s sacred and royal zones with an expert guide.",
                "Aihole’s experimental temple forms explored as an architectural laboratory.",
                "Pattadakal’s monumental temple group read in historical sequence.",
                "Badami’s rock-cut caves and Agastya Lake experienced in softer morning light."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Vijayanagara in the Landscape",
                  "bodySubtitle": "DAYS 1–4 | HAMPI",
                  "paragraphs": [
                    "Spend four nights in Hampi to separate the sacred centre, royal enclosure, river landscape, and surrounding villages into manageable, meaningful sessions."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy7.webp",
                      "alt": "Travel scene from Vijayanagara in the Landscape during the Sandstone Kingdoms of the Deccan journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Across the Deccan Plain",
                  "bodySubtitle": "DAY 5 | HAMPI TO AIHOLE",
                  "paragraphs": [
                    "Travel north with a relaxed road day and contextual stops before reaching the Chalukyan heartland."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal1.webp",
                      "alt": "Landscape and local detail from Across the Deccan Plain on the Sandstone Kingdoms of the Deccan route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Architecture in Experiment",
                  "bodySubtitle": "DAY 6 | AIHOLE",
                  "paragraphs": [
                    "Explore Aihole as a landscape of evolving temple forms, using a specialist guide to read plan, structure, sculpture, and chronology."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal5.webp",
                      "alt": "Regional landscape encountered around Architecture in Experiment during the Sandstone Kingdoms of the Deccan journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Monumental Synthesis",
                  "bodySubtitle": "DAY 7 | PATTADAKAL",
                  "paragraphs": [
                    "Continue to Pattadakal for an unhurried study of its major temple group and the convergence of architectural traditions."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy10.webp",
                      "alt": "Cultural travel detail representing Monumental Synthesis during the Sandstone Kingdoms of the Deccan journey"
                    },
                    {
                      "src": "/images/itineraries/dummy14.webp",
                      "alt": "Second editorial scene from Monumental Synthesis along the Sandstone Kingdoms of the Deccan journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Caves & Agastya Lake",
                  "bodySubtitle": "DAY 8 | BADAMI",
                  "paragraphs": [
                    "Spend the day with Badami’s rock-cut caves, Bhutanatha temples, lake edge, and cliff views, timed around heat and light."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy11.webp",
                      "alt": "Travel scene from Caves & Agastya Lake during the Sandstone Kingdoms of the Deccan journey"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure",
                  "bodySubtitle": "DAY 9 | HUBBALLI OR BENGALURU CONNECTION",
                  "paragraphs": [
                    "Transfer to the most practical onward airport or rail connection after breakfast."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Comfortable heritage-style stays positioned to reduce repetitive driving.",
                "Expert architecture guiding prioritized over generic sightseeing commentary.",
                "Early and late site sessions with midday rest during hotter months.",
                "Private road transport between Hampi and the Chalukyan sites."
              ],
              "image": "/images/journal/journal5.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Karnataka",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Breathable clothing for exposed archaeological landscapes.",
                "Excellent walking shoes for stone, steps, and uneven ground.",
                "Sun hat, sunscreen, and refillable water bottle.",
                "A light scarf for dust and strong afternoon sun.",
                "Notebook or sketchbook if architecture is a central interest."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Hampi overwhelms with scale; Aihole teaches experiment; Pattadakal resolves ideas; Badami returns everything to rock and water.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments That Define the Journey",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Sandstone Kingdoms of the Deccan journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Multiple sessions across Hampi’s sacred and royal zones with an expert guide."
                },
                {
                  "src": "/images/itineraries/dummy12.webp",
                  "alt": "Aihole’s experimental temple forms explored as an architectural laboratory on the Sandstone Kingdoms of the Deccan journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Aihole’s experimental temple forms explored as an architectural laboratory."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Pattadakal’s monumental temple group read in historical sequence on the Sandstone Kingdoms of the Deccan journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Pattadakal’s monumental temple group read in historical sequence."
                },
                {
                  "src": "/images/itineraries/dummy14.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Sandstone Kingdoms of the Deccan journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Badami’s rock-cut caves and Agastya Lake experienced in softer morning light."
                },
                {
                  "src": "/images/home/journey-pc.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Sandstone Kingdoms of the Deccan journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Multiple sessions across Hampi’s sacred and royal zones with an expert guide."
                },
                {
                  "src": "/images/home/journey-mob.webp",
                  "alt": "Aihole’s experimental temple forms explored as an architectural laboratory on the Sandstone Kingdoms of the Deccan journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Aihole’s experimental temple forms explored as an architectural laboratory."
                }
              ]
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "STONE & SUN NOTE",
              "text": "October to February offers the most comfortable conditions. Even in winter, exposed ruins are best explored early and late, with shaded breaks during the middle of the day."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Reading the Deccan in Sequence",
              "paragraphs": [
                "The order matters. Hampi gives you an imperial landscape, while Aihole, Pattadakal, and Badami gradually sharpen the eye toward earlier architectural experiments and solutions.",
                "By the end, individual columns, roof forms, shrine plans, and sculptural choices begin to feel like a conversation across centuries."
              ],
              "image": "/images/itineraries/dummy11.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Karnataka at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Karnataka."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Karnataka through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "How much walking is involved?",
                  "paragraphs": [
                    "Expect several hours of walking on major heritage days, broken into morning and afternoon sessions."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Is Hampi given enough time?",
                  "paragraphs": [
                    "Yes. Four nights allow the sacred, royal, river, and village landscapes to be explored separately."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can we add Bijapur or other Deccan sites?",
                  "paragraphs": [
                    "Yes. A longer northern Karnataka extension can be designed for travellers with deeper architectural interests."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-12",
      "slug": "coromandel-temples-and-french-quarters",
      "type": "signature",
      "featured": false,
      "title": "Coromandel Temples & French Quarters",
      "region": "Tamil Nadu & Puducherry",
      "days": 9,
      "categories": [
        "culture",
        "stays",
        "bespoke"
      ],
      "tags": [
        "#COROMANDEL",
        "#PUDUCHERRY",
        "#MAMALLAPURAM"
      ],
      "intro": "Follow the Coromandel Coast from Chennai through Kanchipuram and Mamallapuram to Puducherry and Chidambaram, tracing temple art, colonial streets, craft, and sea.",
      "image": "/images/journal/journal4.webp",
      "alt": "Coromandel coast architecture blending temple stone, shaded streets, and tropical seaside light",
      "featuredDescription": "A coastal cultural journey where Pallava and Chola stone, weaving towns, French-era streets, Tamil kitchens, and the Bay of Bengal share one route.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Kanchipuram sacred architecture"
        },
        {
          "icon": "village",
          "label": "Silk weaving traditions"
        },
        {
          "icon": "temple",
          "label": "Pallava stone monuments"
        },
        {
          "icon": "boat",
          "label": "Coromandel coastal life"
        }
      ]
    },
    "relatedSlugs": [
      "chettinad-courtyards-and-chola-country",
      "travancore-to-cape-comorin",
      "river-of-light-varanasi-and-awadh"
    ],
    "seo": {
      "pageTitle": "Coromandel Temples & French Quarters | 9-Day Coastal Journey",
      "pageDesc": "Follow the Coromandel Coast through Chennai, Kanchipuram, Mamallapuram, Puducherry, and Chidambaram for temples, textiles, food, and sea.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Coromandel coast architecture blending temple stone, shaded streets, and tropical seaside light",
      "breadcrumbName": "Coromandel Temples & French Quarters",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Coromandel Temples & French Quarters"
        }
      ],
      "coverImage": "/images/impact/impact4.webp",
      "coverAlt": "Coromandel coast architecture blending temple stone, shaded streets, and tropical seaside light",
      "eyebrow": "Signature Itinerary",
      "title": "Coromandel Temples & French Quarters",
      "intro": "Follow the Coromandel Coast from Chennai through Kanchipuram and Mamallapuram to Puducherry and Chidambaram, tracing temple art, colonial streets, craft, and sea.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Tamil Nadu & Puducherry"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Coastal heritage"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Coromandel Temples & French Quarters",
      "shareText": "Follow the Coromandel Coast from Chennai through Kanchipuram and Mamallapuram to Puducherry and Chidambaram, tracing temple art, colonial streets, craft, and sea."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The Coromandel Coast holds several very different cultural worlds within a manageable road journey. Chennai provides the urban frame, Kanchipuram introduces sacred architecture and silk, Mamallapuram shifts to Pallava stone and sea, and Puducherry changes the street pattern and colonial texture.",
                "The final movement toward Chidambaram returns to Tamil sacred geography before the route closes. The itinerary balances temples with textiles, food, neighbourhood walking, coast, and slower heritage stays so that no single theme overwhelms the journey."
              ],
              "image": "/images/itineraries/dummy12.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Tamil Nadu & Puducherry",
              "imageAspectRatio": "4 / 5",
              "caption": "Chennai → Kanchipuram → Mamallapuram → Puducherry → Chidambaram → Chennai",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Chennai neighbourhood, food, and cultural orientation with a local specialist.",
                "Kanchipuram temple architecture and silk-weaving context.",
                "Mamallapuram’s Pallava monuments explored in cooler morning and evening light.",
                "Puducherry’s Tamil and French quarters experienced through walking, food, and design."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes from the Journey",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Tamil Nadu & Puducherry",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Tamil Nadu & Puducherry, selected to complement the route’s slower editorial rhythm."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: The Urban Coromandel",
                  "bodySubtitle": "DAYS 1–2 | CHENNAI",
                  "paragraphs": [
                    "Begin with neighbourhood walks, markets, cultural institutions, and a food programme that establishes the coast’s Tamil identity."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy8.webp",
                      "alt": "Travel scene from The Urban Coromandel during the Coromandel Temples & French Quarters journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Silk & Sacred Geometry",
                  "bodySubtitle": "DAY 3 | KANCHIPURAM",
                  "paragraphs": [
                    "Travel inland for major temple architecture and a carefully chosen weaving encounter before returning toward the coast."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Landscape and local detail from Silk & Sacred Geometry on the Coromandel Temples & French Quarters route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Stone by the Sea",
                  "bodySubtitle": "DAYS 4–5 | MAMALLAPURAM",
                  "paragraphs": [
                    "Spend two nights near Mamallapuram to explore Pallava monuments in cooler light and leave time for the shoreline beyond the main sites."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/fallbacks/culture.webp",
                      "alt": "Regional landscape encountered around Stone by the Sea during the Coromandel Temples & French Quarters journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Two Quarters, One City",
                  "bodySubtitle": "DAYS 6–7 | PUDUCHERRY",
                  "paragraphs": [
                    "Walk both the Tamil and French quarters, focusing on urban form, food, design details, and the layered life of the former colonial settlement."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy11.webp",
                      "alt": "Cultural travel detail representing Two Quarters, One City during the Coromandel Temples & French Quarters journey"
                    },
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Second editorial scene from Two Quarters, One City along the Coromandel Temples & French Quarters journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Sacred Interior",
                  "bodySubtitle": "DAY 8 | CHIDAMBARAM",
                  "paragraphs": [
                    "Make a focused excursion to Chidambaram for temple context and the cultural landscape surrounding it, then return to your chosen coastal base."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Travel scene from Sacred Interior during the Coromandel Temples & French Quarters journey"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure",
                  "bodySubtitle": "DAY 9 | CHENNAI",
                  "paragraphs": [
                    "Return to Chennai for your onward flight, with time for a final meal if schedules allow."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Boutique heritage hotels and design-led stays selected for walkable locations.",
                "Private vehicle for intercity transfers, with substantial exploration done on foot.",
                "Architecture and textile specialists arranged at the places where expertise matters most.",
                "Temple-heavy days balanced with food, coast, design, and free time."
              ],
              "image": "/images/fallbacks/culture.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Tamil Nadu & Puducherry",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Breathable, modest clothing for warm weather and temple access.",
                "Comfortable sandals or shoes that are easy to remove.",
                "Sun protection for Mamallapuram’s exposed monument landscape.",
                "A lightweight scarf for sacred sites and air-conditioned interiors.",
                "A compact umbrella for tropical showers and strong sun."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The Coromandel Coast is a lesson in adjacency: granite shrine, silk loom, colonial facade, fishing shore, and modern city can sit within one day’s journey.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "COASTAL HEAT NOTE",
              "text": "Most outdoor monument visits are scheduled early or late. Midday is reserved for long lunches, shaded interiors, craft visits, or rest, especially from March through June."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Stone, Silk & Sea Air",
              "paragraphs": [
                "The route’s pleasure comes from contrast. Kanchipuram’s sacred weight, Mamallapuram’s sculpted stone, Puducherry’s street geometry, and Chennai’s urban energy sharpen one another.",
                "You leave with a broader sense of the Coromandel as a cultural coast rather than a collection of separate day trips."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Tamil Nadu & Puducherry through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is Puducherry the main focus of the route?",
                  "paragraphs": [
                    "No. It is one chapter within a wider Coromandel journey that gives equal weight to Tamil heritage."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Can we spend more time at the beach?",
                  "paragraphs": [
                    "Yes. Additional coastal nights can be added near Mamallapuram or Puducherry."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Is Kanchipuram a day trip?",
                  "paragraphs": [
                    "Usually yes on this route, with the day structured around a few important temples and a meaningful weaving visit."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-13",
      "slug": "desert-forts-and-artisan-cities",
      "type": "signature",
      "featured": true,
      "title": "Desert Forts & Artisan Cities",
      "region": "Rajasthan",
      "days": 11,
      "categories": [
        "culture",
        "stays",
        "bespoke"
      ],
      "tags": [
        "#RAJASTHAN",
        "#FORTS",
        "#CRAFT"
      ],
      "intro": "Move west across Rajasthan from Udaipur’s lake palaces to Jodhpur’s blue city and Jaisalmer’s desert fort, following craft, architecture, food, and living neighbourhoods.",
      "image": "/images/impact/impact5.webp",
      "alt": "Golden Rajasthan fort walls rising above blue streets and desert-edge neighbourhoods",
      "featuredDescription": "A palace-and-desert journey with equal attention to artisans, markets, stepwells, home kitchens, and the everyday life that exists beyond Rajasthan’s monumental facades.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Fort & palace heritage"
        },
        {
          "icon": "village",
          "label": "Artisan studio encounters"
        },
        {
          "icon": "village",
          "label": "Old-city food & markets"
        },
        {
          "icon": "wellness",
          "label": "Quiet desert stays"
        }
      ]
    },
    "relatedSlugs": [
      "sandstone-kingdoms-of-the-deccan",
      "river-of-light-varanasi-and-awadh",
      "chettinad-courtyards-and-chola-country"
    ],
    "seo": {
      "pageTitle": "Desert Forts & Artisan Cities | 11-Day Rajasthan Journey",
      "pageDesc": "Move from Udaipur to Jodhpur and Jaisalmer through lake palaces, forts, artisan workshops, old-city food, desert landscapes, and heritage stays.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Golden Rajasthan fort walls rising above blue streets and desert-edge neighbourhoods",
      "breadcrumbName": "Desert Forts & Artisan Cities",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Desert Forts & Artisan Cities"
        }
      ],
      "coverImage": "/images/home/solo-landscape.webp",
      "coverAlt": "Golden Rajasthan fort walls rising above blue streets and desert-edge neighbourhoods",
      "eyebrow": "Signature Itinerary",
      "title": "Desert Forts & Artisan Cities",
      "intro": "Move west across Rajasthan from Udaipur’s lake palaces to Jodhpur’s blue city and Jaisalmer’s desert fort, following craft, architecture, food, and living neighbourhoods.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "11 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Rajasthan"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Fort cities & craft"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Desert Forts & Artisan Cities",
      "shareText": "Move west across Rajasthan from Udaipur’s lake palaces to Jodhpur’s blue city and Jaisalmer’s desert fort, following craft, architecture, food, and living neighbourhoods."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Rajasthan’s monuments are spectacular, but this route is designed to keep human scale in the foreground. Udaipur begins with lake, palace, and miniature painting traditions; Jodhpur adds fort, market, textiles, and blue neighbourhoods; Jaisalmer shifts the palette toward sandstone and desert.",
                "Road days are broken with meaningful stops rather than treated as lost time. Craft studios, village meals, stepwells, and desert-edge communities create continuity between the major cities, while heritage stays make architecture part of the experience after sightseeing ends."
              ],
              "image": "/images/itineraries/dummy13.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Rajasthan",
              "imageAspectRatio": "4 / 5",
              "caption": "Udaipur → Ranakpur → Jodhpur → Osian → Jaisalmer"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 11-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Lakes, Palaces & Atelier Doors",
                  "bodySubtitle": "DAYS 1–3 | UDAIPUR",
                  "paragraphs": [
                    "Begin with the City Palace complex, old neighbourhoods, lake light, and a private craft or miniature-painting encounter."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Travel scene from Lakes, Palaces & Atelier Doors during the Desert Forts & Artisan Cities journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Across the Aravalli",
                  "bodySubtitle": "DAY 4 | RANAKPUR ROAD",
                  "paragraphs": [
                    "Travel toward Jodhpur through the Aravalli landscape, using a temple or village stop to break the journey naturally."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal3.webp",
                      "alt": "Landscape and local detail from Across the Aravalli on the Desert Forts & Artisan Cities route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Blue City & Mehrangarh",
                  "bodySubtitle": "DAYS 5–7 | JODHPUR",
                  "paragraphs": [
                    "Spend three nights exploring the fort, old city, markets, textiles, food, and quieter residential lanes with a local specialist."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/forest-landscape.webp",
                      "alt": "Regional landscape encountered around Blue City & Mehrangarh during the Desert Forts & Artisan Cities journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Toward the Thar",
                  "bodySubtitle": "DAY 8 | OSIAN & DESERT EDGE",
                  "paragraphs": [
                    "Move west through smaller settlements and desert-edge landscapes, with time for temple architecture and a locally hosted meal."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Cultural travel detail representing Toward the Thar during the Desert Forts & Artisan Cities journey"
                    },
                    {
                      "src": "/images/home/journey-mob.webp",
                      "alt": "Second editorial scene from Toward the Thar along the Desert Forts & Artisan Cities journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Sandstone City",
                  "bodySubtitle": "DAYS 9–10 | JAISALMER",
                  "paragraphs": [
                    "Explore the living fort, havelis, craft, and desert light without reducing the stay to a single sunset excursion."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy13.webp",
                      "alt": "Travel scene from Sandstone City during the Desert Forts & Artisan Cities journey"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure",
                  "bodySubtitle": "DAY 11 | JAISALMER OR JODHPUR CONNECTION",
                  "paragraphs": [
                    "Depart by the most practical air, rail, or road connection based on your onward plans."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Heritage hotels selected for strong architecture and manageable old-city access.",
                "Private vehicle throughout the intercity route, with slower scenic road days.",
                "Craft visits arranged directly with respected workshops or family studios where possible.",
                "Desert experiences designed to avoid crowded, high-volume entertainment camps."
              ],
              "image": "/images/home/forest-landscape.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Rajasthan",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light layers for warm days and cooler desert evenings.",
                "Comfortable shoes for forts, old-city lanes, and uneven steps.",
                "Sun protection and a reusable water bottle for exposed sightseeing.",
                "A scarf for dust, sun, and temple visits.",
                "One smart-casual outfit for heritage hotel dining or special evenings."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Details in Place",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Regional landscape and cultural detail encountered along the Desert Forts & Artisan Cities journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Lake and palace heritage in Udaipur with miniature painting or craft context."
                },
                {
                  "src": "/images/itineraries/dummy12.webp",
                  "alt": "Mehrangarh and Jodhpur’s old city explored beyond the main monument circuit on the Desert Forts & Artisan Cities journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Mehrangarh and Jodhpur’s old city explored beyond the main monument circuit."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Village and desert-edge experiences around Osian on the westward journey on the Desert Forts & Artisan Cities journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Village and desert-edge experiences around Osian on the westward journey."
                },
                {
                  "src": "/images/itineraries/dummy14.webp",
                  "alt": "Jaisalmer’s living fort, havelis, sandstone craft, and quiet desert light on the Desert Forts & Artisan Cities journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Jaisalmer’s living fort, havelis, sandstone craft, and quiet desert light."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Rajasthan becomes more interesting when the fort stops being the whole story and the street, workshop, kitchen, and desert edge begin speaking too.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "DESERT SEASON NOTE",
              "text": "October to March offers the most comfortable conditions. Winter nights can be genuinely cool in the desert, while daytime sun remains strong and requires protection."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Beyond the Palace Facade",
              "paragraphs": [
                "The great forts provide scale, but the journey’s emotional texture comes from smaller encounters: a painter’s hand, a market conversation, a courtyard breakfast, or sandstone turning gold at dusk.",
                "Moving west from the lakes toward the Thar creates a clear sense of progression, with landscape and architecture becoming progressively drier, sharper, and more elemental."
              ],
              "image": "/images/itineraries/dummy13.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Rajasthan at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Rajasthan."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Rajasthan through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Will we stay inside historic properties?",
                  "paragraphs": [
                    "Where the right property exists, yes. We balance heritage character with comfort, service, and practical access."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Is a camel safari included?",
                  "paragraphs": [
                    "Not by default. Desert time can be designed around walking, jeep access, local communities, or a short ethical camel experience if desired."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can Jaipur be added?",
                  "paragraphs": [
                    "Yes. Jaipur works well as a pre-journey extension, although it changes the route into a longer Rajasthan circuit."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-14",
      "slug": "river-of-light-varanasi-and-awadh",
      "type": "signature",
      "featured": false,
      "title": "River of Light: Varanasi & Awadh",
      "region": "Uttar Pradesh",
      "days": 9,
      "categories": [
        "culture",
        "wellness",
        "bespoke"
      ],
      "tags": [
        "#VARANASI",
        "#AWADH",
        "#GANGA"
      ],
      "intro": "Pair Varanasi’s riverfront, music, silk, and sacred geography with Lucknow’s Awadhi architecture, food, poetry, and refined urban culture.",
      "image": "/images/journal/journal5.webp",
      "alt": "Dawn light spreading across the Ganga ghats and old lanes of Varanasi",
      "featuredDescription": "A two-city North Indian journey built around living traditions: dawn on the Ganga, weaving and music in Varanasi, then architecture, etiquette, and cuisine in Lucknow.",
      "highlights": [
        {
          "icon": "boat",
          "label": "Private Ganga dawn boat"
        },
        {
          "icon": "temple",
          "label": "Varanasi & Sarnath heritage"
        },
        {
          "icon": "village",
          "label": "Silk & music encounters"
        },
        {
          "icon": "village",
          "label": "Awadhi food & craft"
        }
      ]
    },
    "relatedSlugs": [
      "desert-forts-and-artisan-cities",
      "coromandel-temples-and-french-quarters",
      "brahmaputra-tea-and-living-islands"
    ],
    "seo": {
      "pageTitle": "River of Light: Varanasi & Awadh | 9-Day North India Journey",
      "pageDesc": "Pair Varanasi’s riverfront, music, silk, and sacred geography with Lucknow’s Awadhi architecture, food, craft, poetry, and refined urban culture.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Dawn light spreading across the Ganga ghats and old lanes of Varanasi",
      "breadcrumbName": "River of Light: Varanasi & Awadh",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "River of Light: Varanasi & Awadh"
        }
      ],
      "coverImage": "/images/home/travel-video.webp",
      "coverAlt": "Dawn light spreading across the Ganga ghats and old lanes of Varanasi",
      "eyebrow": "Signature Itinerary",
      "title": "River of Light: Varanasi & Awadh",
      "intro": "Pair Varanasi’s riverfront, music, silk, and sacred geography with Lucknow’s Awadhi architecture, food, poetry, and refined urban culture.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Uttar Pradesh"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "Living sacred culture"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "River of Light: Varanasi & Awadh",
      "shareText": "Pair Varanasi’s riverfront, music, silk, and sacred geography with Lucknow’s Awadhi architecture, food, poetry, and refined urban culture."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Varanasi and Lucknow offer two very different expressions of North Indian culture. Varanasi is intensely riverine and sacred, shaped by ghats, lanes, music, silk, ritual, and daily life around the Ganga. Lucknow is more courtly, with Awadhi architecture, cuisine, poetry, and manners embedded in its urban memory.",
                "The itinerary gives each city enough time to breathe. In Varanasi, dawn and evening are protected for the river while midday is used for weaving, music, or rest. In Lucknow, architecture and food are paired so the city is experienced through both space and taste."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes from the Journey",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Uttar Pradesh",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Uttar Pradesh, selected to complement the route’s slower editorial rhythm."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: River, Lanes & Living Ritual",
                  "bodySubtitle": "DAYS 1–4 | VARANASI",
                  "paragraphs": [
                    "Spend four nights in Varanasi with dawn boat journeys, old-city walks, music or weaving encounters, and ample rest between the city’s most intense experiences."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy10.webp",
                      "alt": "Travel scene from River, Lanes & Living Ritual during the River of Light: Varanasi & Awadh journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: A Quieter Sacred Landscape",
                  "bodySubtitle": "DAY 5 | SARNATH",
                  "paragraphs": [
                    "Visit Sarnath for Buddhist history, stupas, museum collections, and a deliberately calmer day after Varanasi’s dense riverfront rhythm."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal4.webp",
                      "alt": "Landscape and local detail from A Quieter Sacred Landscape on the River of Light: Varanasi & Awadh route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Across the Gangetic Plain",
                  "bodySubtitle": "DAY 6 | VARANASI TO LUCKNOW",
                  "paragraphs": [
                    "Travel to Lucknow by the most suitable rail, air, or road connection and settle into a heritage-led city stay."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/journey-pc.webp",
                      "alt": "Regional landscape encountered around Across the Gangetic Plain during the River of Light: Varanasi & Awadh journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Awadh in Architecture & Taste",
                  "bodySubtitle": "DAYS 7–8 | LUCKNOW",
                  "paragraphs": [
                    "Explore Imambara architecture, old neighbourhoods, craft, and a carefully paced food programme that respects both famous dishes and quieter culinary traditions."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy13.webp",
                      "alt": "Cultural travel detail representing Awadh in Architecture & Taste during the River of Light: Varanasi & Awadh journey"
                    },
                    {
                      "src": "/images/home/journey-mob1.webp",
                      "alt": "Second editorial scene from Awadh in Architecture & Taste along the River of Light: Varanasi & Awadh journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Departure",
                  "bodySubtitle": "DAY 9 | LUCKNOW",
                  "paragraphs": [
                    "Enjoy a final breakfast and transfer to Lucknow airport or railway station."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "River-facing or heritage stays selected to balance atmosphere with retreat from city intensity.",
                "Private guides chosen separately for sacred history, craft, music, and Awadhi culture.",
                "Dawn and evening activities balanced with midday rest.",
                "Intercity travel chosen around comfort and schedule rather than forcing a single transport mode."
              ],
              "image": "/images/home/journey-pc.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Uttar Pradesh",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Modest lightweight clothing for sacred sites and warm daytime conditions.",
                "A warmer layer for winter dawn boat rides on the Ganga.",
                "Comfortable shoes for uneven lanes and long heritage walks.",
                "Easy-to-remove footwear for temples and some sacred spaces.",
                "A light scarf useful for dust, warmth, and cultural etiquette."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Varanasi asks you to witness life without editing it; Lucknow asks you to notice refinement in gesture, language, architecture, and food.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "RIVER & FESTIVAL NOTE",
              "text": "Festival periods can transform Varanasi dramatically and also increase crowding. We design river access, walking routes, and timings around local conditions rather than promising identical experiences every day."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Two Cities, Two Kinds of Memory",
              "paragraphs": [
                "Varanasi leaves an impression through repetition: bells, oars, smoke, silk, steps, and the changing river. Lucknow works more quietly through courtyards, language, craft, and food.",
                "Together they form a journey about living tradition rather than preserved heritage, with culture encountered as something still practised, argued over, cooked, woven, sung, and inhabited."
              ],
              "image": "/images/itineraries/dummy14.webp",
              "imageAlt": "Quiet reflective travel scene recalling the landscapes of Uttar Pradesh at journey’s end",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Uttar Pradesh."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Uttar Pradesh through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Is Varanasi overwhelming for first-time visitors?",
                  "paragraphs": [
                    "It can be intense, which is why the itinerary uses private guiding, protected rest periods, and carefully timed river access."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Is the dawn boat ride mandatory?",
                  "paragraphs": [
                    "No. It is recommended for atmosphere, but the schedule can be adapted for later mornings."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How do we travel between Varanasi and Lucknow?",
                  "paragraphs": [
                    "The best option depends on current rail and flight schedules; we choose for comfort and overall journey flow."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "sig-15",
      "slug": "brahmaputra-tea-and-living-islands",
      "type": "signature",
      "featured": true,
      "title": "Brahmaputra, Tea & Living Islands",
      "region": "Assam",
      "days": 10,
      "categories": [
        "nature",
        "culture",
        "offbeat"
      ],
      "tags": [
        "#BRAHMAPUTRA",
        "#MAJULI",
        "#KAZIRANGA"
      ],
      "intro": "Follow the Brahmaputra from Guwahati through Kaziranga to Majuli and Jorhat, weaving together river life, wildlife, tea, craft, and Assam’s living cultural traditions.",
      "image": "/images/impact/impact6.webp",
      "alt": "Wide Brahmaputra waters flowing past green Assam floodplains beneath a luminous sky",
      "featuredDescription": "A river-led Assam journey that balances wildlife with tea landscapes, island culture, weaving, monasteries, and the extraordinary scale of the Brahmaputra valley.",
      "highlights": [
        {
          "icon": "boat",
          "label": "Brahmaputra river journeys"
        },
        {
          "icon": "village",
          "label": "Majuli living traditions"
        },
        {
          "icon": "village",
          "label": "Jorhat tea country"
        },
        {
          "icon": "wellness",
          "label": "Slow floodplain stays"
        }
      ]
    },
    "relatedSlugs": [
      "eastern-ghats-coffee-and-coast",
      "wayanad-forests-and-nila-riverlands",
      "river-of-light-varanasi-and-awadh"
    ],
    "seo": {
      "pageTitle": "Brahmaputra, Tea & Living Islands | 10-Day Assam Journey",
      "pageDesc": "Follow the Brahmaputra from Guwahati to Kaziranga, Majuli, and Jorhat through wildlife, tea, river life, weaving, and living cultural traditions.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Wide Brahmaputra waters flowing past green Assam floodplains beneath a luminous sky",
      "breadcrumbName": "Brahmaputra, Tea & Living Islands",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Brahmaputra, Tea & Living Islands"
        }
      ],
      "coverImage": "/images/home/forest-landscape.webp",
      "coverAlt": "Wide Brahmaputra waters flowing past green Assam floodplains beneath a luminous sky",
      "eyebrow": "Signature Itinerary",
      "title": "Brahmaputra, Tea & Living Islands",
      "intro": "Follow the Brahmaputra from Guwahati through Kaziranga to Majuli and Jorhat, weaving together river life, wildlife, tea, craft, and Assam’s living cultural traditions.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Assam"
        },
        {
          "label": "Group",
          "value": "1–4 guests"
        },
        {
          "label": "Focus",
          "value": "River & living landscapes"
        },
        {
          "label": "Style",
          "value": "Private bespoke"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "BESPOKE JOURNEY",
      "price": "Price on request",
      "ctaTitle": "Want this trip, but shaped around you?",
      "ctaSubtitle": "Every route is a starting point. Talk to us to adjust the pace, stays, or detours.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Brahmaputra, Tea & Living Islands",
      "shareText": "Follow the Brahmaputra from Guwahati through Kaziranga to Majuli and Jorhat, weaving together river life, wildlife, tea, craft, and Assam’s living cultural traditions."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The Brahmaputra is the organising force of this journey. Guwahati introduces the river at urban scale, Kaziranga reveals the floodplain as habitat, and Majuli turns water into an island culture of satras, weaving, farming, music, and seasonal adaptation.",
                "The route then closes around Jorhat’s tea country, where plantation history and contemporary Assam meet. Wildlife is important but never allowed to dominate the entire itinerary; river, craft, food, and cultural life receive equal weight."
              ],
              "image": "/images/home/solo-portrait.webp",
              "imageAlt": "Editorial travel portrait representing landscapes and cultural encounters across Assam",
              "imageAspectRatio": "4 / 5",
              "caption": "Guwahati → Kaziranga → Majuli → Jorhat",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Sunset and cultural orientation along the Brahmaputra in Guwahati.",
                "Responsible wildlife drives and floodplain ecology in Kaziranga.",
                "Majuli’s satras, weaving, village life, and river-island landscapes.",
                "Tea estate experiences and regional food around Jorhat."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "First Impressions",
              "captionMob": true,
              "captionPc": true,
              "images": [
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Sunset and cultural orientation along the Brahmaputra in Guwahati on the Brahmaputra, Tea & Living Islands journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Sunset and cultural orientation along the Brahmaputra in Guwahati."
                },
                {
                  "src": "/images/itineraries/dummy12.webp",
                  "alt": "Responsible wildlife drives and floodplain ecology in Kaziranga on the Brahmaputra, Tea & Living Islands journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Responsible wildlife drives and floodplain ecology in Kaziranga."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Majuli’s satras, weaving, village life, and river-island landscapes on the Brahmaputra, Tea & Living Islands journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Majuli’s satras, weaving, village life, and river-island landscapes."
                },
                {
                  "src": "/images/itineraries/dummy14.webp",
                  "alt": "Tea estate experiences and regional food around Jorhat on the Brahmaputra, Tea & Living Islands journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Tea estate experiences and regional food around Jorhat."
                }
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around meaningful stays, sensible road movement, and enough time in each landscape to understand it rather than simply pass through."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Meeting the Brahmaputra",
                  "bodySubtitle": "DAYS 1–2 | GUWAHATI",
                  "paragraphs": [
                    "Begin in Guwahati with river orientation, local food, and cultural context before moving east into Assam’s floodplain landscape."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy11.webp",
                      "alt": "Travel scene from Meeting the Brahmaputra during the Brahmaputra, Tea & Living Islands journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Floodplain Wilderness",
                  "bodySubtitle": "DAYS 3–5 | KAZIRANGA",
                  "paragraphs": [
                    "Spend three nights near Kaziranga with responsible wildlife drives, naturalist interpretation, and time to understand how river, grassland, forest, and seasonal flooding shape the ecosystem."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal5.webp",
                      "alt": "Landscape and local detail from Floodplain Wilderness on the Brahmaputra, Tea & Living Islands route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Island of Living Traditions",
                  "bodySubtitle": "DAYS 6–8 | MAJULI",
                  "paragraphs": [
                    "Cross to Majuli for satra culture, weaving, village life, and slower exploration of an island continually shaped by the Brahmaputra."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Visit selected satras with cultural context and respectful timing.",
                    "Meet weaving or mask-making practitioners where access is appropriate."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/journey-pc1.webp",
                      "alt": "Regional landscape encountered around Island of Living Traditions during the Brahmaputra, Tea & Living Islands journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Tea Country",
                  "bodySubtitle": "DAY 9 | JORHAT",
                  "paragraphs": [
                    "Return to the mainland and spend time in Jorhat’s tea landscape with a tasting or estate-focused experience."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy14.webp",
                      "alt": "Cultural travel detail representing Tea Country during the Brahmaputra, Tea & Living Islands journey"
                    },
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Second editorial scene from Tea Country along the Brahmaputra, Tea & Living Islands journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Departure",
                  "bodySubtitle": "DAY 10 | JORHAT",
                  "paragraphs": [
                    "Transfer to Jorhat airport or continue by road depending on your onward plans."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Standards & Inclusions",
              "items": [
                "Comfortable river, wildlife, and tea-country stays selected for location and responsible operations.",
                "Naturalists used in Kaziranga and local cultural hosts used separately in Majuli.",
                "Ferry and road timing kept flexible around river and weather conditions.",
                "Wildlife drives limited to a sensible number so the journey remains culturally balanced."
              ],
              "image": "/images/home/journey-pc1.webp",
              "imageAlt": "Landscape detail illustrating the stays and regional character of Assam",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light layers for warm afternoons and cooler winter mornings.",
                "Neutral comfortable clothing for wildlife drives.",
                "Closed shoes for village, riverbank, and estate walking.",
                "A light rain layer during shoulder seasons.",
                "Binoculars and a compact daypack for wildlife and birding days."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "In Assam, the river is not scenery behind the journey. It is the force that shapes habitat, settlement, ritual, agriculture, risk, and imagination.",
              "author": "THE DESIGNER'S NOTEBOOK"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "The Journey in Motion",
              "video": {
                "videoId": "k1OU4CqguLw",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film still reflecting the landscapes and cultural atmosphere of Assam",
                "width": 800,
                "height": 450
              },
              "caption": "Moving impressions from Assam, selected to complement the route’s slower editorial rhythm."
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "RIVER & WILDLIFE NOTE",
              "text": "Kaziranga’s access is seasonal and Majuli ferry operations depend on river conditions. The journey is best treated as a flexible living-landscape itinerary rather than a rigid timetable."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Following the River East",
              "paragraphs": [
                "The Brahmaputra gives the route a natural narrative: city, floodplain, island, and tea country each reveal a different relationship with water and land.",
                "The strongest memories often come between headline moments, in a ferry crossing, a loom, morning mist over grassland, or tea shared on a verandah in Jorhat."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LEAD ROUTE ARCHITECT • KERALA, INDIA",
              "name": "Sreejith Raghavan",
              "bio": "Sreejith approaches Assam through slower route design, specialist local relationships, and a belief that culture, landscape, and hospitality should be experienced as one connected story.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait of Sreejith Raghavan, lead route architect for bespoke journeys across India"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can this route be tailored to our preferred dates and pace?",
                  "paragraphs": [
                    "Yes. Every Signature itinerary is a design framework, and we adjust nights, experiences, transport, and daily intensity around your interests and travel dates."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "When is the best time for this Assam route?",
                  "paragraphs": [
                    "The cooler months are generally best, with Kaziranga access typically aligning with the main winter tourism season."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are wildlife sightings guaranteed?",
                  "paragraphs": [
                    "No. Drives are led by trained naturalists, but sightings remain dependent on wild animals and habitat conditions."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "Can Majuli ferry schedules change?",
                  "paragraphs": [
                    "Yes. River conditions can affect crossings, so the itinerary keeps enough flexibility to adapt without losing the journey’s character."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "What is included when the final journey is quoted?",
                  "paragraphs": [
                    "The final proposal clearly separates accommodation, private transport, guiding, arranged experiences, and any route-specific permits or specialist access."
                  ],
                  "listTitle": "The exact inclusion list is confirmed before payment:",
                  "listItems": [
                    "Chosen accommodation category and meal plan.",
                    "Private transport and agreed transfers.",
                    "Confirmed guiding, hosted encounters, and ticketed experiences.",
                    "Any permits or special-access costs included in the final design."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the bespoke route, accommodation selection, and current supplier availability are approved, a 30% confirmation deposit secures the agreed services. The remaining balance is due 45 days before arrival unless the final proposal states otherwise."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We work directly with our partners to move dates whenever possible. Any non-refundable permits, transport tickets, or supplier penalties are passed through transparently."
                  ],
                  "listItems": [
                    "60+ days before arrival: deposit refund less confirmed non-refundable costs.",
                    "30–59 days before arrival: 50% refund or travel credit where supplier terms allow.",
                    "Less than 30 days before arrival: cancellation follows the confirmed supplier terms in your final proposal."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  
  // ==========================================
  // TIER 2: COLLABORATED ITINERARIES
  // ==========================================

  {
    "meta": {
      "id": "col-1",
      "slug": "valley-temples-and-annapurna-footpaths",
      "type": "collaborated",
      "featured": true,
      "title": "Valley Temples & Annapurna Footpaths",
      "region": "Nepal",
      "days": 11,
      "categories": [
        "culture",
        "nature",
        "stays"
      ],
      "tags": [
        "#NEPAL",
        "#HIMALAYA",
        "#VILLAGES"
      ],
      "intro": "Move from Kathmandu’s temple courtyards to hill towns and Annapurna foothpaths, guided by a designer who connects heritage with mountain village life.",
      "image": "/images/impact/impact1.webp",
      "alt": "Newar temple roofs and Himalayan foothills unfolding beneath clear Nepal mountain light",
      "collaborator": {
        "name": "Nima Gurung",
        "role": "Himalayan Cultural Journey Designer • Kathmandu, Nepal",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A measured Nepal journey linking Newar heritage, ridge-top towns, lakeside calm, and community-led Himalayan walking without turning the mountains into a race.",
      "highlights": [
        {
          "icon": "village",
          "label": "Private Newar architecture walks across Patan and Bhaktapur."
        },
        {
          "icon": "temple",
          "label": "An overnight pause in Bandipur above the Marsyangdi valley."
        },
        {
          "icon": "boat",
          "label": "Village-based walking beneath the Annapurna and Machhapuchhre ranges."
        },
        {
          "icon": "wellness",
          "label": "Local kitchens, craft studios, and monastery conversations shaped around conte"
        }
      ]
    },
    "relatedSlugs": [
      "dzongs-valleys-and-quiet-altitudes",
      "tea-monasteries-and-khangchendzonga",
      "monasteries-under-the-milky-way"
    ],
    "seo": {
      "pageTitle": "Valley Temples & Annapurna Footpaths | 11-Day Nepal Journey",
      "pageDesc": "Move from Kathmandu’s temple courtyards to hill towns and Annapurna foothpaths, guided by a designer who connects heritage with mountain village life.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Valley Temples & Annapurna Footpaths across Nepal for social sharing within this carefully designed",
      "breadcrumbName": "Valley Temples & Annapurna Footpaths",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Valley Temples & Annapurna Footpaths"
        }
      ],
      "coverImage": "/images/impact/impact4.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Nepal within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Valley Temples & Annapurna Footpaths",
      "intro": "Move from Kathmandu’s temple courtyards to hill towns and Annapurna foothpaths, guided by a designer who connects heritage with mountain village life.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "11 days"
        },
        {
          "label": "Pace",
          "value": "Measured"
        },
        {
          "label": "Region",
          "value": "Nepal"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Living heritage & mountain villages"
        },
        {
          "label": "Designer",
          "value": "Nima Gurung"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 2,450",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Valley Temples & Annapurna Footpaths",
      "shareText": "Move from Kathmandu’s temple courtyards to hill towns and Annapurna foothpaths, guided by a designer who connects heritage with mountain village life."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Begin in the Kathmandu Valley, where brick courtyards, carved timber windows, Buddhist stupas, and Hindu shrines reveal the layered Newar culture that shaped the old royal cities. Rather than rushing through monuments, the first days are built around neighbourhood walks, artisan studios, and conversations that give ritual spaces social context.",
                "The route then slows through Bandipur and Pokhara before entering the Annapurna foothills for village-based walking. Comfortable lodges, flexible trail distances, and locally hosted meals keep the mountain section immersive without demanding a full trekking expedition."
              ],
              "image": "/images/home/solo-portrait.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Nepal landscapes and local encounters within this carefully designed cultural",
              "imageAspectRatio": "4 / 5",
              "caption": "Kathmandu → Patan & Bhaktapur → Bandipur → Pokhara → Annapurna Foothills",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Private Newar architecture walks across Patan and Bhaktapur.",
                "An overnight pause in Bandipur above the Marsyangdi valley.",
                "Village-based walking beneath the Annapurna and Machhapuchhre ranges.",
                "Local kitchens, craft studios, and monastery conversations shaped around context."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Valley Temples & Annapurna Footpaths",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Nepal and its cultural landscapes within this carefully designed cultural",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Valley Temples & Annapurna Footpaths."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 11-day journey is paced around living heritage & mountain villages, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: The Living Valley",
                  "bodySubtitle": "DAYS 1–2 | KATHMANDU",
                  "paragraphs": [
                    "Settle into Kathmandu and explore old market lanes, temple courtyards, and neighbourhood shrines with a cultural interpreter who explains how sacred and everyday life overlap."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Walk around Boudhanath with time for monastery courtyards and tea houses.",
                    "Explore old Kathmandu lanes before the busiest sightseeing hours."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Editorial travel scene showing Kathmandu during the Valley Temples & Annapurna Footpaths journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Courtyards, Clay & Carved Timber",
                  "bodySubtitle": "DAYS 3–4 | PATAN & BHAKTAPUR",
                  "paragraphs": [
                    "Shift the focus to the historic cities of Patan and Bhaktapur, where palace squares, metalwork traditions, pottery quarters, and domestic architecture reward slower observation."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Meet a craft practitioner working in metal, wood, or clay.",
                    "Dine in a restored courtyard setting featuring Newar flavours."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/journey-pc.webp",
                      "alt": "Editorial travel scene showing Patan & Bhaktapur during the Valley Temples & Annapurna Footpaths journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: The Ridge Town Pause",
                  "bodySubtitle": "DAY 5 | BANDIPUR",
                  "paragraphs": [
                    "Drive west to Bandipur and spend an unhurried afternoon in the pedestrian old town, where merchant houses face Himalayan views and rural footpaths begin almost at the doorstep."
                  ],
                  "listItems": [
                    "Sunset ridge walk above the old bazaar.",
                    "Dinner built around seasonal hill produce."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/journey-pc1.webp",
                      "alt": "Editorial travel scene showing Bandipur during the Valley Temples & Annapurna Footpaths journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Lake to Mountain Footpaths",
                  "bodySubtitle": "DAYS 6–8 | POKHARA & ANNAPURNA FOOTHILLS",
                  "paragraphs": [
                    "Continue to Pokhara, then move into the Annapurna foothills for flexible village walks through stone steps, terrace fields, and forest paths with daily distances adjusted to comfort."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Dawn mountain viewpoints when weather permits.",
                    "Village lunches and locally managed lodge stays."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Editorial travel scene showing Pokhara & Annapurna Foothills during the Valley Temples & Annapurna Footpaths journey within this"
                    },
                    {
                      "src": "/images/itineraries/dummy1.webp",
                      "alt": "Editorial travel scene showing Pokhara & Annapurna Foothills during the Valley Temples & Annapurna Footpaths journey within this"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Time With the Hills",
                  "bodySubtitle": "DAYS 9–10 | FOOTHILL VILLAGES",
                  "paragraphs": [
                    "Remain in the foothills rather than rushing back, using the extra time for shorter walks, community encounters, and a quieter reading of farm life and mountain rhythms."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Optional birding or photography-focused morning walk.",
                    "Shared meal with a host family or community-run lodge team."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/travel-video.webp",
                      "alt": "Editorial travel scene showing Foothill Villages during the Valley Temples & Annapurna Footpaths journey within this carefully designed"
                    },
                    {
                      "src": "/images/impact/impact1.webp",
                      "alt": "Editorial travel scene showing Foothill Villages during the Valley Temples & Annapurna Footpaths journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 11 | POKHARA",
                  "paragraphs": [
                    "Return to Pokhara for a relaxed final breakfast and airport transfer, with onward flight planning built around weather and domestic schedule buffers."
                  ],
                  "listItems": [
                    "Flexible transfer coordination for onward flights.",
                    "Time reserved for weather-related schedule changes."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Characterful heritage hotels in Kathmandu and hill towns.",
                "Comfortable mountain lodges selected for location, warmth, and host quality.",
                "Private ground transfers with realistic mountain-road timing.",
                "Local cultural guides and walking leaders matched to each region."
              ],
              "image": "/images/journal/journal1.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Nepal within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Broken-in walking shoes with good grip for stone steps and village paths.",
                "Layered clothing for warm valley afternoons and cool mountain mornings.",
                "Sun protection, refillable water bottle, and a compact daypack.",
                "Modest clothing for monasteries, temples, and family-hosted visits."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Editorial travel scene showing landscape detail from Nepal on Valley Temples & Annapurna Footpaths within this carefully designed",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Nepal."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing landscape detail from Nepal on Valley Temples & Annapurna Footpaths within this carefully designed",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Nepal."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Nepal on Valley Temples & Annapurna Footpaths within this carefully designed",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Nepal."
                },
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Editorial travel scene showing landscape detail from Nepal on Valley Temples & Annapurna Footpaths within this carefully designed",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Nepal."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Editorial travel scene showing landscape detail from Nepal on Valley Temples & Annapurna Footpaths within this carefully designed",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Nepal."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": true,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Nepal becomes more intimate when the mountain is not the only thing you are looking at.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Nepal within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Nepal, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy6.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Nepal within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Nepal, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Nepal within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Nepal, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Nepal within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Nepal, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": true,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "ALTITUDE & TRAIL NOTE",
              "text": "This route stays mainly in the lower Annapurna foothills, but weather and trail conditions can still change quickly. Daily walking distance should remain flexible, and higher extensions should only be added after discussing fitness and acclimatisation."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "The Valley and the Mountain Stay Together",
              "paragraphs": [
                "The journey is designed so Kathmandu’s carved courtyards and the foothill villages do not feel like separate holidays. Both reveal how belief, craft, food, and landscape continue through ordinary life.",
                "What stays with you is less a summit than a sequence of human-scale details: butter lamps, hand-worked metal, terrace paths, and the changing outline of the Himalaya."
              ],
              "image": "/images/itineraries/dummy6.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Nepal within this carefully designed cultural journey",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Valley Temples & Annapurna Footpaths."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "HIMALAYAN CULTURAL JOURNEY DESIGNER • KATHMANDU, NEPAL",
              "name": "Nima Gurung",
              "bio": "Nima designs Nepal journeys around living heritage, village economies, and manageable mountain walking, favouring long conversations and locally rooted stays over rushed landmark collecting.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Nima Gurung for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Valley Temples & Annapurna Footpaths be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Nima Gurung’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "This route stays mainly in the lower Annapurna foothills, but weather and trail conditions can still change quickly. Daily walking distance should remain flexible, and higher extensions should only be added after discussing fitness and acclimatisation."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as measured. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-2",
      "slug": "northern-stories-and-knuckles-green",
      "type": "collaborated",
      "featured": true,
      "title": "Northern Stories & Knuckles Green",
      "region": "Sri Lanka",
      "days": 12,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#SRILANKA",
        "#JAFFNA",
        "#HIGHLANDS"
      ],
      "intro": "Travel from Jaffna’s Tamil north to the eastern coast, ancient heartland, and Knuckles highlands through food, memory, ecology, and village hospitality.",
      "image": "/images/impact/impact3.webp",
      "alt": "Palmyra country, temple towns, eastern lagoons and green Sri Lankan highlands in layered light",
      "collaborator": {
        "name": "Anjali Tharmalingam",
        "role": "Northern Sri Lanka Culture & Ecology Curator • Jaffna, Sri Lanka",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A less conventional Sri Lanka route connecting northern Tamil culture, east-coast lagoons, ancient dry-zone landscapes, and the green highlands around Kandy."
    },
    "relatedSlugs": [
      "oaxaca-kitchens-and-sierra-paths",
      "salt-looms-and-desert-villages",
      "geothermal-stories-and-southern-fjords"
    ],
    "seo": {
      "pageTitle": "Northern Stories & Knuckles Green | 12-Day Sri Lanka Journey",
      "pageDesc": "Travel from Jaffna’s Tamil north to the eastern coast, ancient heartland, and Knuckles highlands through food, memory, ecology, and village hospitality.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Northern Stories & Knuckles Green across Sri Lanka for social sharing within this carefully",
      "breadcrumbName": "Northern Stories & Knuckles Green",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Northern Stories & Knuckles Green"
        }
      ],
      "coverImage": "/images/impact/impact6.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Sri Lanka within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Northern Stories & Knuckles Green",
      "intro": "Travel from Jaffna’s Tamil north to the eastern coast, ancient heartland, and Knuckles highlands through food, memory, ecology, and village hospitality.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "12 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Sri Lanka"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Culture, food & ecology"
        },
        {
          "label": "Designer",
          "value": "Anjali Tharmalingam"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 2,680",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Northern Stories & Knuckles Green",
      "shareText": "Travel from Jaffna’s Tamil north to the eastern coast, ancient heartland, and Knuckles highlands through food, memory, ecology, and village hospitality."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This route begins by going north instead of following the familiar southern loop. In Jaffna, palmyra landscapes, kovils, markets, home cooking, and the memory carried by neighbourhoods create a culturally specific introduction to the island.",
                "From the north, the journey bends through Trincomalee and the dry-zone heartland before finishing in the cooler Knuckles foothills and Kandy. The progression is intentional: coast, stone, forest, and highland culture each arrive with enough time to feel distinct."
              ],
              "image": "/images/itineraries/dummy1.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Sri Lanka landscapes and local encounters within this carefully designed",
              "imageAspectRatio": "4 / 5",
              "caption": "Colombo → Jaffna → Trincomalee → Sigiriya → Knuckles → Kandy"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 12-day journey is paced around culture, food & ecology, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Arrival & Northern Orientation",
                  "bodySubtitle": "DAY 1 | COLOMBO",
                  "paragraphs": [
                    "Arrive in Colombo and use the first evening to settle, discuss the island’s regional differences, and prepare for the northward journey rather than overloading arrival day."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Private arrival transfer and route briefing.",
                    "Early dinner shaped around coastal Sri Lankan flavours."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Editorial travel scene showing Colombo during the Northern Stories & Knuckles Green journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Palmyra Country",
                  "bodySubtitle": "DAYS 2–4 | JAFFNA",
                  "paragraphs": [
                    "Base in Jaffna for temple architecture, market walks, home-style Tamil cuisine, and excursions across the peninsula where palmyra, lagoons, and village roads define the landscape."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Visit Nallur area with cultural interpretation and respectful timing.",
                    "Explore a market and kitchen session focused on northern ingredients."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact1.webp",
                      "alt": "Editorial travel scene showing Jaffna during the Northern Stories & Knuckles Green journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Eastern Water & Memory",
                  "bodySubtitle": "DAYS 5–6 | TRINCOMALEE",
                  "paragraphs": [
                    "Travel south-east to Trincomalee for harbour history, coastal shrines, and quieter lagoon or marine experiences chosen according to season and sea conditions."
                  ],
                  "listItems": [
                    "Sunrise coastal walk before the heat builds.",
                    "Lagoon or boat-based nature excursion when conditions are appropriate."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact2.webp",
                      "alt": "Editorial travel scene showing Trincomalee during the Northern Stories & Knuckles Green journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Dry-Zone Stone and Forest",
                  "bodySubtitle": "DAYS 7–8 | SIGIRIYA & HABARANA",
                  "paragraphs": [
                    "Move inland to the Cultural Triangle, balancing archaeological sites with village landscapes, tanks, and forest edges instead of treating the area as a monument checklist."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Early climb or viewpoint timing to avoid midday heat.",
                    "Village meal and irrigation-landscape interpretation."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Editorial travel scene showing Sigiriya & Habarana during the Northern Stories & Knuckles Green journey within this carefully"
                    },
                    {
                      "src": "/images/itineraries/dummy4.webp",
                      "alt": "Editorial travel scene showing Sigiriya & Habarana during the Northern Stories & Knuckles Green journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Green Ridges and Hill Country",
                  "bodySubtitle": "DAYS 9–11 | KNUCKLES & KANDY",
                  "paragraphs": [
                    "Finish in the central highlands with gentle Knuckles foothill walks, village stays, and time in Kandy for craft, food, and the living religious culture around the lake."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Flexible forest-edge walk with a local naturalist.",
                    "Kandy evening planned around ceremony timing and crowd conditions."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact4.webp",
                      "alt": "Editorial travel scene showing Knuckles & Kandy during the Northern Stories & Knuckles Green journey within this carefully"
                    },
                    {
                      "src": "/images/impact/impact5.webp",
                      "alt": "Editorial travel scene showing Knuckles & Kandy during the Northern Stories & Knuckles Green journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 12 | KANDY OR COLOMBO",
                  "paragraphs": [
                    "Use the final day for a calm departure transfer, with routing chosen around flight time and realistic road conditions."
                  ],
                  "listItems": [
                    "Private departure transfer.",
                    "Optional final market or tea stop if timing allows."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Small hotels and locally rooted stays rather than resort-heavy sequencing.",
                "Private vehicle for long inter-regional drives with sensible rest stops.",
                "Specialist local guiding in Jaffna, the Cultural Triangle, and highlands.",
                "Flexible coastal activities selected around sea and monsoon conditions."
              ],
              "image": "/images/journal/journal2.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Sri Lanka within this carefully designed cultural",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light breathable clothing for northern and eastern heat.",
                "A light rain layer and walking shoes for the central highlands.",
                "Modest attire for kovils, temples, and other sacred spaces.",
                "Sun protection and a reusable bottle for exposed archaeological sites."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Northern Stories & Knuckles Green",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Sri Lanka and its cultural landscapes within this carefully designed",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Northern Stories & Knuckles Green."
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The island changes language, food, weather, and memory long before the road reaches the next coast.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sri Lanka within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Sri Lanka, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy8.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sri Lanka within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Sri Lanka, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sri Lanka within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Sri Lanka, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sri Lanka within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Sri Lanka, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy11.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sri Lanka within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Sri Lanka, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sri Lanka within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Sri Lanka, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": false
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "MONSOON & REGIONAL WEATHER NOTE",
              "text": "Sri Lanka’s weather varies sharply by coast and season. The exact sequence should be checked against current monsoon patterns, sea conditions, and local access rather than relying on one island-wide “best time” rule."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "An Island With More Than One Rhythm",
              "paragraphs": [
                "The north, east, dry zone, and highlands each hold a different Sri Lanka. Keeping them distinct makes the transitions more meaningful than trying to compress them into one generic tropical story.",
                "The route leaves room for food, conversation, and small regional differences to do as much storytelling as the headline monuments."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "NORTHERN SRI LANKA CULTURE & ECOLOGY CURATOR • JAFFNA, SRI LANKA",
              "name": "Anjali Tharmalingam",
              "bio": "Anjali builds Sri Lanka journeys around regional identity, food memory, coastal ecology, and slower conversations, with a particular emphasis on the Tamil north and east.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Anjali Tharmalingam for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Northern Stories & Knuckles Green be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Anjali Tharmalingam’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Sri Lanka’s weather varies sharply by coast and season. The exact sequence should be checked against current monsoon patterns, sea conditions, and local access rather than relying on one island-wide “best time” rule."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as unhurried. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-3",
      "slug": "lantern-roads-of-kii",
      "type": "collaborated",
      "featured": true,
      "title": "Lantern Roads of Kii",
      "region": "Japan",
      "days": 10,
      "categories": [
        "culture",
        "wellness",
        "nature"
      ],
      "tags": [
        "#JAPAN",
        "#KUMANO",
        "#PILGRIMAGE"
      ],
      "intro": "Move from Kyoto’s living arts to Koyasan and the Kumano Kodo, where temple stays, cedar forests, hot springs, and pilgrimage paths shape the journey.",
      "image": "/images/impact/impact5.webp",
      "alt": "Cedar pilgrimage paths, temple lanterns and quiet Japanese mountain towns beneath soft seasonal light",
      "collaborator": {
        "name": "Aiko Mori",
        "role": "Pilgrimage & Living Traditions Curator • Kyoto, Japan",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A contemplative Japan journey linking Kyoto craft traditions with Buddhist temple life and selected walks along the sacred routes of the Kii Peninsula.",
      "highlights": [
        {
          "icon": "village",
          "label": "Private Kyoto craft and garden encounters arranged around quieter hours."
        },
        {
          "icon": "temple",
          "label": "Temple lodging and morning ritual on Koyasan."
        },
        {
          "icon": "boat",
          "label": "Selected Kumano Kodo walks through cedar forest and historic pilgrimage villag"
        },
        {
          "icon": "wellness",
          "label": "Onsen pauses and coastal arrival around Nachi and Kii-Katsuura."
        }
      ]
    },
    "relatedSlugs": [
      "dzongs-valleys-and-quiet-altitudes",
      "wine-roads-and-stone-monasteries",
      "sacred-valley-weaves-and-andean-trails"
    ],
    "seo": {
      "pageTitle": "Lantern Roads of Kii | 10-Day Japan Journey",
      "pageDesc": "Move from Kyoto’s living arts to Koyasan and the Kumano Kodo, where temple stays, cedar forests, hot springs, and pilgrimage paths shape the journey.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Lantern Roads of Kii across Japan for social sharing within this carefully designed cultural",
      "breadcrumbName": "Lantern Roads of Kii",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Lantern Roads of Kii"
        }
      ],
      "coverImage": "/images/journal/journal2.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Japan within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Lantern Roads of Kii",
      "intro": "Move from Kyoto’s living arts to Koyasan and the Kumano Kodo, where temple stays, cedar forests, hot springs, and pilgrimage paths shape the journey.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Contemplative"
        },
        {
          "label": "Region",
          "value": "Japan"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Pilgrimage & living traditions"
        },
        {
          "label": "Designer",
          "value": "Aiko Mori"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 3,980",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Lantern Roads of Kii",
      "shareText": "Move from Kyoto’s living arts to Koyasan and the Kumano Kodo, where temple stays, cedar forests, hot springs, and pilgrimage paths shape the journey."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The journey begins in Kyoto with attention to living craft, tea, gardens, and neighbourhood temples rather than a race through famous landmarks. Aiko’s approach uses small appointments and quiet timings to show how refinement survives in ordinary routines.",
                "From Nara, the route enters the Kii Peninsula for Koyasan temple life and selected sections of the Kumano Kodo. Walks are chosen for atmosphere and cultural meaning, with hot-spring pauses and luggage support where appropriate."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Japan within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Japan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy2.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Japan within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Japan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Japan within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Japan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Japan within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Japan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy5.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Japan within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Japan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Japan within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Japan, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": false
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around pilgrimage & living traditions, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Living Arts Before Icons",
                  "bodySubtitle": "DAYS 1–3 | KYOTO",
                  "paragraphs": [
                    "Spend three days in Kyoto using neighbourhood scale as the organising principle: craft studios, gardens, tea, food markets, and temple precincts experienced at quieter times."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Appointment with a craft practitioner or small atelier.",
                    "Early or late temple visit designed around reduced crowds."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Editorial travel scene showing Kyoto during the Lantern Roads of Kii journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Old Capital, Open Space",
                  "bodySubtitle": "DAY 4 | NARA",
                  "paragraphs": [
                    "Take a slower day in Nara, using temple landscapes and old lanes to bridge urban Kyoto and the more explicitly spiritual mountain stages ahead."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Walk between historic precincts with architectural context.",
                    "Seasonal lunch in a traditional machiya or small restaurant."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact5.webp",
                      "alt": "Editorial travel scene showing Nara during the Lantern Roads of Kii journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Mountain Buddhism & Temple Night",
                  "bodySubtitle": "DAYS 5–6 | KOYASAN",
                  "paragraphs": [
                    "Travel to Koyasan for shukubo temple lodging, vegetarian shojin ryori, cemetery paths, and morning ritual, with enough time to experience the mountain after day visitors leave."
                  ],
                  "listItems": [
                    "Temple lodging with shojin ryori dinner.",
                    "Evening or early morning walk through Okunoin approaches."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact6.webp",
                      "alt": "Editorial travel scene showing Koyasan during the Lantern Roads of Kii journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: The Pilgrim Forest",
                  "bodySubtitle": "DAYS 7–8 | KUMANO HONGU",
                  "paragraphs": [
                    "Continue into the Kumano region and walk a selected Nakahechi or comparable section suited to fitness, using village transfers and hot-spring stays to keep the pilgrimage reflective rather than punishing."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Forest walk toward Kumano Hongu Taisha.",
                    "Onsen stay near the pilgrimage corridor."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Editorial travel scene showing Kumano Hongu during the Lantern Roads of Kii journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/itineraries/dummy7.webp",
                      "alt": "Editorial travel scene showing Kumano Hongu during the Lantern Roads of Kii journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Waterfall, Shrine & Coast",
                  "bodySubtitle": "DAY 9 | NACHI & KII-KATSUURA",
                  "paragraphs": [
                    "Finish the sacred route around Nachi before descending to the coast, where shrine architecture, waterfall landscape, and fishing-town atmosphere close the journey."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Visit Nachi area in a quieter time window.",
                    "Seafood-focused dinner in Kii-Katsuura."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Editorial travel scene showing Nachi & Kii-Katsuura during the Lantern Roads of Kii journey within this carefully designed"
                    },
                    {
                      "src": "/images/journal/journal3.webp",
                      "alt": "Editorial travel scene showing Nachi & Kii-Katsuura during the Lantern Roads of Kii journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 10 | KII PENINSULA",
                  "paragraphs": [
                    "Travel onward by rail with luggage and transfer timing planned in advance so the final day remains calm."
                  ],
                  "listItems": [
                    "Reserved rail planning where available.",
                    "Luggage forwarding coordinated for the final stage."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Small design-led city stays and selected temple lodging.",
                "Rail and private transfer mix designed around rural connections.",
                "Luggage forwarding used where it meaningfully improves walking days.",
                "Walking distances matched to fitness rather than pilgrimage bravado."
              ],
              "image": "/images/journal/journal3.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Japan within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Comfortable walking shoes suited to stone and forest paths.",
                "Layered clothing appropriate to season and mountain temperature changes.",
                "Small overnight bag for temple and pilgrimage stages.",
                "Quiet, modest clothing for temple stays and morning ritual."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/journal/journal5.webp",
                  "alt": "Editorial travel scene showing landscape detail from Japan on Lantern Roads of Kii within this carefully designed cultural",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Japan."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Editorial travel scene showing landscape detail from Japan on Lantern Roads of Kii within this carefully designed cultural",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Japan."
                },
                {
                  "src": "/images/home/forest-landscape.webp",
                  "alt": "Editorial travel scene showing landscape detail from Japan on Lantern Roads of Kii within this carefully designed cultural",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Japan."
                },
                {
                  "src": "/images/home/journey-pc.webp",
                  "alt": "Editorial travel scene showing landscape detail from Japan on Lantern Roads of Kii within this carefully designed cultural",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Japan."
                },
                {
                  "src": "/images/home/journey-pc1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Japan on Lantern Roads of Kii within this carefully designed cultural",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Japan."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": false,
              "captionPc": false
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "A pilgrimage is not made sacred by distance alone, but by the attention carried into each step.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Lantern Roads of Kii",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Japan and its cultural landscapes within this carefully designed cultural",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Lantern Roads of Kii."
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PILGRIMAGE ETIQUETTE NOTE",
              "text": "Temple lodging, shrine visits, and pilgrimage paths are living religious environments. The route should respect local rules on photography, bathing, silence, footwear, and ritual participation rather than treating them as performance spaces."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "What the Forest Teaches",
              "paragraphs": [
                "Kyoto offers precision; Kii offers repetition: footsteps, cedar trunks, bells, water, and the return of simple routines. Together they create a journey that feels edited without feeling staged.",
                "The most memorable moments are often the least spectacular: a temple corridor before breakfast, steam over an onsen, or the sound of rain beginning on a forest path."
              ],
              "image": "/images/itineraries/dummy8.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Japan within this carefully designed cultural journey",
              "imageAspectRatio": "4 / 5"
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "PILGRIMAGE & LIVING TRADITIONS CURATOR • KYOTO, JAPAN",
              "name": "Aiko Mori",
              "bio": "Aiko designs journeys around Japan’s pilgrimage landscapes, temple communities, traditional arts, and seasonal rhythms, favouring meaningful access and silence over spectacle.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Aiko Mori for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Lantern Roads of Kii be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Aiko Mori’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Temple lodging, shrine visits, and pilgrimage paths are living religious environments. The route should respect local rules on photography, bathing, silence, footwear, and ritual participation rather than treating them as performance spaces."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as contemplative. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-4",
      "slug": "dzongs-valleys-and-quiet-altitudes",
      "type": "collaborated",
      "featured": false,
      "title": "Dzongs, Valleys & Quiet Altitudes",
      "region": "Bhutan",
      "days": 10,
      "categories": [
        "culture",
        "nature",
        "wellness"
      ],
      "tags": [
        "#BHUTAN",
        "#DZONGS",
        "#VALLEYS"
      ],
      "intro": "Cross Bhutan from Paro to Bumthang through dzongs, farm valleys, forest passes, and contemplative stays shaped by local heritage and mountain rhythm.",
      "image": "/images/journal/journal1.webp",
      "alt": "Bhutanese dzong walls, forest valleys and prayer flags beneath crisp Himalayan morning light",
      "collaborator": {
        "name": "Sonam Choden",
        "role": "Bhutanese Heritage & Valley Travel Designer • Thimphu, Bhutan",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A culturally grounded Bhutan route that balances fortress-monasteries, village landscapes, forested valleys, and gentle walking with the country’s slower sense of scale.",
      "highlights": [
        {
          "icon": "village",
          "label": "Paro and Thimphu introductions to Bhutanese architecture and contemporary life"
        },
        {
          "icon": "temple",
          "label": "Punakha valley walks around farms, rivers, and the great dzong."
        },
        {
          "icon": "boat",
          "label": "Phobjikha landscape interpreted through conservation and village culture."
        },
        {
          "icon": "wellness",
          "label": "Bumthang monasteries, forest paths, and farmhouse hospitality."
        }
      ]
    },
    "relatedSlugs": [
      "valley-temples-and-annapurna-footpaths",
      "monasteries-under-the-milky-way",
      "tea-monasteries-and-khangchendzonga"
    ],
    "seo": {
      "pageTitle": "Dzongs, Valleys & Quiet Altitudes | 10-Day Bhutan Journey",
      "pageDesc": "Cross Bhutan from Paro to Bumthang through dzongs, farm valleys, forest passes, and contemplative stays shaped by local heritage and mountain rhythm.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Dzongs, Valleys & Quiet Altitudes across Bhutan for social sharing within this carefully designed",
      "breadcrumbName": "Dzongs, Valleys & Quiet Altitudes",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Dzongs, Valleys & Quiet Altitudes"
        }
      ],
      "coverImage": "/images/journal/journal4.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Bhutan within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Dzongs, Valleys & Quiet Altitudes",
      "intro": "Cross Bhutan from Paro to Bumthang through dzongs, farm valleys, forest passes, and contemplative stays shaped by local heritage and mountain rhythm.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Slow"
        },
        {
          "label": "Region",
          "value": "Bhutan"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Heritage & mountain valleys"
        },
        {
          "label": "Designer",
          "value": "Sonam Choden"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 4,200",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Dzongs, Valleys & Quiet Altitudes",
      "shareText": "Cross Bhutan from Paro to Bumthang through dzongs, farm valleys, forest passes, and contemplative stays shaped by local heritage and mountain rhythm."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Bhutan rewards a route built around valleys rather than a list of sights. Paro and Thimphu establish the architectural and social context before the journey crosses forest passes toward Punakha, Phobjikha, and Bumthang.",
                "Sonam uses dzongs, village homes, monastery paths, and agricultural landscapes as connected chapters. Walking remains gentle, road days are kept realistic, and pauses are deliberately protected from over-programming."
              ],
              "image": "/images/itineraries/dummy3.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Bhutan landscapes and local encounters within this carefully designed cultural",
              "imageAspectRatio": "4 / 5",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Paro and Thimphu introductions to Bhutanese architecture and contemporary life.",
                "Punakha valley walks around farms, rivers, and the great dzong.",
                "Phobjikha landscape interpreted through conservation and village culture.",
                "Bumthang monasteries, forest paths, and farmhouse hospitality."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Dzongs, Valleys & Quiet Altitudes",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Bhutan and its cultural landscapes within this carefully designed cultural",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Dzongs, Valleys & Quiet Altitudes."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around heritage & mountain valleys, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Arrival in the Paro Valley",
                  "bodySubtitle": "DAYS 1–2 | PARO",
                  "paragraphs": [
                    "Use the first two days to acclimatise gently, explore the valley’s historic fabric, and understand the relationship between farm settlements, monasteries, and mountain geography."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Short heritage walk around Paro town and valley edges.",
                    "Optional gentle hike adjusted to arrival energy."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Editorial travel scene showing Paro during the Dzongs, Valleys & Quiet Altitudes journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Tradition in a Living Capital",
                  "bodySubtitle": "DAY 3 | THIMPHU",
                  "paragraphs": [
                    "Move to Thimphu for a compact introduction to Bhutan’s contemporary institutions, craft traditions, and urban life before the road journey deepens."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Craft or textile-focused visit.",
                    "Time in a local market or cultural institution."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal3.webp",
                      "alt": "Editorial travel scene showing Thimphu during the Dzongs, Valleys & Quiet Altitudes journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Rivers, Fields & Fortress Architecture",
                  "bodySubtitle": "DAYS 4–5 | PUNAKHA",
                  "paragraphs": [
                    "Descend into Punakha for warmer valley air, riverside farmland, and the monumental dzong positioned between the Pho Chhu and Mo Chhu."
                  ],
                  "listItems": [
                    "Village and farm walk through the valley.",
                    "Architectural visit timed outside peak group arrivals."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal4.webp",
                      "alt": "Editorial travel scene showing Punakha during the Dzongs, Valleys & Quiet Altitudes journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: The Wide Glacial Valley",
                  "bodySubtitle": "DAYS 6–7 | PHOBJIKHA",
                  "paragraphs": [
                    "Cross into Phobjikha and slow the pace around broad valley walks, conservation interpretation, and small settlements beneath forested ridges."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Gentle nature trail across the valley floor.",
                    "Conversation around local conservation practices."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Editorial travel scene showing Phobjikha during the Dzongs, Valleys & Quiet Altitudes journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/itineraries/dummy10.webp",
                      "alt": "Editorial travel scene showing Phobjikha during the Dzongs, Valleys & Quiet Altitudes journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Monasteries and Hearths",
                  "bodySubtitle": "DAYS 8–9 | BUMTHANG",
                  "paragraphs": [
                    "Continue to Bumthang for monastery valleys, farmhouse meals, forest paths, and a deeper sense of Bhutan’s religious geography."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Monastery circuit paced across two days.",
                    "Farmhouse meal or locally hosted cultural evening."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/fallbacks/culture.webp",
                      "alt": "Editorial travel scene showing Bumthang during the Dzongs, Valleys & Quiet Altitudes journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/home/forest-landscape.webp",
                      "alt": "Editorial travel scene showing Bumthang during the Dzongs, Valleys & Quiet Altitudes journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 10 | BUMTHANG OR PARO",
                  "paragraphs": [
                    "Use the final day for the best available onward connection, keeping domestic flight or road contingencies in the plan."
                  ],
                  "listItems": [
                    "Transfer coordination around domestic schedules.",
                    "Weather buffer maintained for onward international travel."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Boutique lodges and carefully selected valley hotels.",
                "Private guide and vehicle throughout the overland route.",
                "Walking adjusted for altitude, road conditions, and personal energy.",
                "Local cultural experiences arranged with appropriate permissions and hosts."
              ],
              "image": "/images/journal/journal4.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Bhutan within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Warm layers for high passes and cold mornings.",
                "Comfortable walking shoes for village and monastery paths.",
                "Modest clothing for dzongs and religious sites.",
                "Sun protection and personal medication for altitude-related comfort."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Bhutan reveals itself in the space between valleys, where the road slows and the mountain decides the day.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/home/journey-pc1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Bhutan within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Bhutan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy12.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Bhutan within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Bhutan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Bhutan within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Bhutan, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Bhutan within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Bhutan, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "ALTITUDE & ACCESS NOTE",
              "text": "Bhutan’s road and flight conditions can shift with weather and mountain works. The itinerary should preserve time buffers, avoid overly ambitious drive days, and treat access rules at religious sites as locally determined."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "A Country Read Valley by Valley",
              "paragraphs": [
                "The route is deliberately built as a sequence of changing valleys rather than a rapid national circuit. Architecture, farming, forest, and ritual become easier to understand when each has room to breathe.",
                "By Bumthang, the journey feels less like collecting dzongs and more like learning how Bhutan’s built and natural landscapes depend on one another."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "BHUTANESE HERITAGE & VALLEY TRAVEL DESIGNER • THIMPHU, BHUTAN",
              "name": "Sonam Choden",
              "bio": "Sonam designs Bhutan journeys around valley culture, architecture, farming landscapes, and contemplative pacing, with a preference for fewer stops and deeper local interpretation.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Sonam Choden for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Dzongs, Valleys & Quiet Altitudes be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Sonam Choden’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Bhutan’s road and flight conditions can shift with weather and mountain works. The itinerary should preserve time buffers, avoid overly ambitious drive days, and treat access rules at religious sites as locally determined."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as slow. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-5",
      "slug": "monasteries-under-the-milky-way",
      "type": "collaborated",
      "featured": true,
      "title": "Monasteries Under the Milky Way",
      "region": "Ladakh, India",
      "days": 9,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#LADAKH",
        "#MONASTERIES",
        "#DARKSKY"
      ],
      "intro": "Explore Ladakh through Indus monasteries, old villages, high-desert landscapes, and dark-sky nights, with acclimatisation treated as part of the design.",
      "image": "/images/journal/journal3.webp",
      "alt": "Ladakh monastery ridges, high desert villages and star-filled skies above the Indus valley",
      "collaborator": {
        "name": "Tsering Namgyal",
        "role": "High-Altitude Naturalist & Cultural Guide • Leh, Ladakh",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A high-altitude Ladakh journey where monastery culture, village architecture, desert ecology, and night skies are paced around responsible acclimatisation."
    },
    "relatedSlugs": [
      "dzongs-valleys-and-quiet-altitudes",
      "tea-monasteries-and-khangchendzonga",
      "pueblo-skies-and-desert-modernism"
    ],
    "seo": {
      "pageTitle": "Monasteries Under the Milky Way | 9-Day Ladakh, India Journey",
      "pageDesc": "Explore Ladakh through Indus monasteries, old villages, high-desert landscapes, and dark-sky nights, with acclimatisation treated as part of the design.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Monasteries Under the Milky Way across Ladakh, India for social sharing within this carefully",
      "breadcrumbName": "Monasteries Under the Milky Way",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Monasteries Under the Milky Way"
        }
      ],
      "coverImage": "/images/fallbacks/culture.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Ladakh, India within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Monasteries Under the Milky Way",
      "intro": "Explore Ladakh through Indus monasteries, old villages, high-desert landscapes, and dark-sky nights, with acclimatisation treated as part of the design.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Acclimatised"
        },
        {
          "label": "Region",
          "value": "Ladakh, India"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Monastic culture & dark skies"
        },
        {
          "label": "Designer",
          "value": "Tsering Namgyal"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 2,650",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Monasteries Under the Milky Way",
      "shareText": "Explore Ladakh through Indus monasteries, old villages, high-desert landscapes, and dark-sky nights, with acclimatisation treated as part of the design."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The first rule of this journey is that altitude sets the pace. Two quiet days in Leh come before major drives, giving the body time to adapt while introducing Ladakhi architecture, markets, and the layered Buddhist culture of the Indus valley.",
                "From there, Tsering links monasteries and villages west of Leh with the stark high-desert landscapes toward Hanle. Dark-sky observation is treated as an environmental experience rather than a guaranteed astronomy show, always dependent on weather and local conditions."
              ],
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Two-day acclimatisation window before longer high-altitude drives.",
                "Indus valley monastery visits including Thiksey or Hemis according to timing.",
                "Alchi and Lamayuru landscapes interpreted through art, geology, and village life.",
                "Dark-sky nights around Hanle with strict respect for local rules and observatory sensitivity."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around monastic culture & dark skies, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Acclimatise Before Exploring",
                  "bodySubtitle": "DAYS 1–2 | LEH",
                  "paragraphs": [
                    "Arrive in Leh and deliberately keep the first day quiet. Gentle neighbourhood walks, hydration, and rest come before any ambitious sightseeing, with a second day used for low-intensity cultural orientation."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Short old-town walk only after adequate rest.",
                    "Flexible visits based on individual acclimatisation."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Editorial travel scene showing Leh during the Monasteries Under the Milky Way journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Monasteries Along the River",
                  "bodySubtitle": "DAY 3 | INDUS VALLEY",
                  "paragraphs": [
                    "Use the Indus corridor for a measured day among monasteries such as Thiksey or Hemis, adding village and river-valley context rather than rushing between complexes."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Monastery visit timed around prayer and visitor flow.",
                    "Conversation on Ladakhi Buddhist art and architecture."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/forest-landscape.webp",
                      "alt": "Editorial travel scene showing Indus Valley during the Monasteries Under the Milky Way journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Painted Temples and Moonland Ridges",
                  "bodySubtitle": "DAYS 4–5 | ALCHI & LAMAYURU",
                  "paragraphs": [
                    "Travel west for Alchi’s artistic heritage, village lanes, and the dramatic geology around Lamayuru, staying overnight so the long road is not compressed into a day trip."
                  ],
                  "listItems": [
                    "Time with mural and monastery interpretation in Alchi.",
                    "Sunset walk around Lamayuru village and surrounding formations."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/journey-pc.webp",
                      "alt": "Editorial travel scene showing Alchi & Lamayuru during the Monasteries Under the Milky Way journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: High Desert and Dark Sky",
                  "bodySubtitle": "DAYS 6–7 | HANLE",
                  "paragraphs": [
                    "Move toward the Changthang landscape and Hanle, keeping the schedule light after the long drive. Nights are reserved for sky observation only when weather, health, and local protocols allow."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Low-impact village and landscape walk.",
                    "Dark-sky session with minimal lighting and no guaranteed celestial event."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Editorial travel scene showing Hanle during the Monasteries Under the Milky Way journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/itineraries/dummy13.webp",
                      "alt": "Editorial travel scene showing Hanle during the Monasteries Under the Milky Way journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Return Through the High Desert",
                  "bodySubtitle": "DAY 8 | LEH",
                  "paragraphs": [
                    "Return to Leh with generous road time and a quiet final evening, avoiding a late arrival before the departure day."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Rest stop schedule adapted to road conditions.",
                    "Final dinner focused on Ladakhi home-style dishes."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/solo-landscape.webp",
                      "alt": "Editorial travel scene showing Leh during the Monasteries Under the Milky Way journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/home/travel-video.webp",
                      "alt": "Editorial travel scene showing Leh during the Monasteries Under the Milky Way journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 9 | LEH",
                  "paragraphs": [
                    "Transfer to the airport with the final morning kept free of strenuous activity."
                  ],
                  "listItems": [
                    "Early airport transfer planning.",
                    "No high-altitude excursion scheduled on departure day."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Acclimatisation built into the route rather than treated as spare time.",
                "Private high-altitude vehicle with experienced local driver.",
                "Simple, warm stays chosen for location and reliable heating.",
                "Local guide support for monasteries, villages, and night-sky etiquette."
              ],
              "image": "/images/journal/journal5.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Ladakh, India within this carefully designed cultural",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Warm insulated layers for large day-to-night temperature swings.",
                "High-SPF sun protection, lip balm, and quality sunglasses.",
                "Comfortable shoes for uneven monastery steps and village lanes.",
                "Personal medication and medical advice appropriate to high-altitude travel."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Editorial travel scene showing landscape detail from Ladakh, India on Monasteries Under the Milky Way within this carefully",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Ladakh, India."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Ladakh, India on Monasteries Under the Milky Way within this carefully",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Ladakh, India."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Editorial travel scene showing landscape detail from Ladakh, India on Monasteries Under the Milky Way within this carefully",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Ladakh, India."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing landscape detail from Ladakh, India on Monasteries Under the Milky Way within this carefully",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Ladakh, India."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Editorial travel scene showing landscape detail from Ladakh, India on Monasteries Under the Milky Way within this carefully",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Ladakh, India."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": false,
              "captionPc": false
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "In Ladakh, the emptiness is not absence. It is what allows stone, prayer, and sky to become visible.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Monasteries Under the Milky Way",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Ladakh, India and its cultural landscapes within this carefully designed",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Monasteries Under the Milky Way."
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "HIGH-ALTITUDE SAFETY NOTE",
              "text": "This itinerary should never override medical advice or individual acclimatisation. Headache, nausea, unusual fatigue, or sleep disturbance must be taken seriously, and route changes should remain possible without treating them as failure."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "A Journey Designed Around Restraint",
              "paragraphs": [
                "Ladakh rewards travellers who stop measuring the day by distance. A monastery courtyard, an old irrigation channel, or a night sky can hold more meaning than another pass added for bragging rights.",
                "The route is deliberately spacious because altitude, weather, and community rhythm are part of the landscape, not inconveniences to overcome."
              ],
              "image": "/images/itineraries/dummy10.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Ladakh, India within this carefully designed cultural journey",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Monasteries Under the Milky Way."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "HIGH-ALTITUDE NATURALIST & CULTURAL GUIDE • LEH, LADAKH",
              "name": "Tsering Namgyal",
              "bio": "Tsering designs Ladakh journeys around acclimatisation, monastic heritage, village ecology, and dark-sky awareness, using high-altitude restraint as a core design principle.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Tsering Namgyal for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Monasteries Under the Milky Way be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Tsering Namgyal’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "This itinerary should never override medical advice or individual acclimatisation. Headache, nausea, unusual fatigue, or sleep disturbance must be taken seriously, and route changes should remain possible without treating them as failure."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as acclimatised. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-6",
      "slug": "tea-monasteries-and-khangchendzonga",
      "type": "collaborated",
      "featured": false,
      "title": "Tea, Monasteries & Khangchendzonga",
      "region": "Sikkim & Darjeeling, India",
      "days": 10,
      "categories": [
        "culture",
        "nature",
        "stays"
      ],
      "tags": [
        "#SIKKIM",
        "#DARJEELING",
        "#HIMALAYA"
      ],
      "intro": "Connect Darjeeling tea country with Sikkim’s monasteries, village homestays, and Khangchendzonga landscapes through a route shaped by local mountain culture.",
      "image": "/images/journal/journal5.webp",
      "alt": "Tea slopes, monastery roofs and Khangchendzonga ridges across the eastern Himalayan foothills",
      "collaborator": {
        "name": "Pema Lepcha",
        "role": "Eastern Himalayan Homestay & Culture Curator • Gangtok, Sikkim",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "An eastern Himalayan journey balancing tea heritage, Buddhist monastic landscapes, village stays, and forested ridges across Darjeeling and Sikkim.",
      "highlights": [
        {
          "icon": "village",
          "label": "Tea-estate interpretation and hill-town heritage in Darjeeling."
        },
        {
          "icon": "temple",
          "label": "Kalimpong nurseries, markets, and old trade-route stories."
        },
        {
          "icon": "boat",
          "label": "Monastery and market life around Gangtok."
        },
        {
          "icon": "wellness",
          "label": "Village stays and historic landscapes around Pelling and Yuksom."
        }
      ]
    },
    "relatedSlugs": [
      "valley-temples-and-annapurna-footpaths",
      "dzongs-valleys-and-quiet-altitudes",
      "monasteries-under-the-milky-way"
    ],
    "seo": {
      "pageTitle": "Tea, Monasteries & Khangchendzonga | 10-Day Journey",
      "pageDesc": "Connect Darjeeling tea country with Sikkim’s monasteries, village homestays, and Khangchendzonga landscapes through a route shaped by local mountain culture.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Tea, Monasteries & Khangchendzonga across Sikkim & Darjeeling, India for social sharing within this",
      "breadcrumbName": "Tea, Monasteries & Khangchendzonga",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Tea, Monasteries & Khangchendzonga"
        }
      ],
      "coverImage": "/images/home/journey-pc.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Sikkim & Darjeeling, India within this carefully designed",
      "eyebrow": "Collaborated Route",
      "title": "Tea, Monasteries & Khangchendzonga",
      "intro": "Connect Darjeeling tea country with Sikkim’s monasteries, village homestays, and Khangchendzonga landscapes through a route shaped by local mountain culture.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Gentle mountain"
        },
        {
          "label": "Region",
          "value": "Sikkim & Darjeeling, India"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Tea, villages & monasteries"
        },
        {
          "label": "Designer",
          "value": "Pema Lepcha"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 2,300",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Tea, Monasteries & Khangchendzonga",
      "shareText": "Connect Darjeeling tea country with Sikkim’s monasteries, village homestays, and Khangchendzonga landscapes through a route shaped by local mountain culture."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The journey starts among Darjeeling’s tea slopes and old hill-town institutions before crossing through Kalimpong into Sikkim. Tea is treated as a working landscape, not merely a tasting stop, while the road east introduces new languages, foods, and religious traditions.",
                "In Sikkim, the focus shifts to monasteries, forest paths, village stays, and views toward Khangchendzonga. Pema keeps the route away from unnecessary altitude chasing, preferring culturally rich western and central circuits with manageable drives."
              ],
              "image": "/images/itineraries/dummy5.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Sikkim & Darjeeling, India landscapes and local encounters within this",
              "imageAspectRatio": "4 / 5",
              "caption": "Darjeeling → Kalimpong → Gangtok → Pelling → Yuksom"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around tea, villages & monasteries, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Tea Country Above the Plains",
                  "bodySubtitle": "DAYS 1–2 | DARJEELING",
                  "paragraphs": [
                    "Begin in Darjeeling with tea-estate visits, early viewpoints when weather is clear, and walks through the town’s layered Himalayan history."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Tea garden walk with processing context.",
                    "Heritage walk through older hill-town quarters."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Editorial travel scene showing Darjeeling during the Tea, Monasteries & Khangchendzonga journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Old Trade Roads and Gardens",
                  "bodySubtitle": "DAY 3 | KALIMPONG",
                  "paragraphs": [
                    "Continue to Kalimpong for nurseries, market culture, and the memory of trans-Himalayan trade routes that once connected this ridge town to Tibet."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Local market and nursery visit.",
                    "Quiet monastery or viewpoint stop outside peak hours."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/travel-video.webp",
                      "alt": "Editorial travel scene showing Kalimpong during the Tea, Monasteries & Khangchendzonga journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: A Contemporary Himalayan Capital",
                  "bodySubtitle": "DAYS 4–5 | GANGTOK",
                  "paragraphs": [
                    "Cross into Sikkim and settle in Gangtok, balancing monastery visits with contemporary food, craft, and urban culture."
                  ],
                  "listItems": [
                    "Monastery visit with local interpretation.",
                    "Evening food walk focused on regional dishes."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact1.webp",
                      "alt": "Editorial travel scene showing Gangtok during the Tea, Monasteries & Khangchendzonga journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Ridges Facing Khangchendzonga",
                  "bodySubtitle": "DAYS 6–7 | PELLING",
                  "paragraphs": [
                    "Travel west to Pelling for monastery landscapes, village roads, and clear-weather views toward Khangchendzonga, using two nights to avoid constant repacking."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Pemayangtse or comparable heritage visit.",
                    "Short village and forest walk around the western ridge."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Editorial travel scene showing Pelling during the Tea, Monasteries & Khangchendzonga journey within this carefully designed cultural journey"
                    },
                    {
                      "src": "/images/home/journey-mob.webp",
                      "alt": "Editorial travel scene showing Pelling during the Tea, Monasteries & Khangchendzonga journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: The Historic Western Gateway",
                  "bodySubtitle": "DAYS 8–9 | YUKSOM",
                  "paragraphs": [
                    "Continue to Yuksom for old coronation history, Dubdi Monastery, and gentle walks in the forested foothills, with longer trekking kept optional."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Historic village and monastery walk.",
                    "Optional short trail section toward the Khangchendzonga trekking corridor."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact3.webp",
                      "alt": "Editorial travel scene showing Yuksom during the Tea, Monasteries & Khangchendzonga journey within this carefully designed cultural journey"
                    },
                    {
                      "src": "/images/impact/impact4.webp",
                      "alt": "Editorial travel scene showing Yuksom during the Tea, Monasteries & Khangchendzonga journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 10 | SIKKIM",
                  "paragraphs": [
                    "Transfer toward the nearest practical rail or airport connection with a large road-time buffer."
                  ],
                  "listItems": [
                    "Road buffer for mountain conditions.",
                    "No major activity scheduled before the onward journey."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Tea-estate, boutique hill hotel, and village stay combination.",
                "Private mountain vehicle with driver experienced on regional roads.",
                "Local guides used for monasteries, tea, and village interpretation.",
                "Permit-dependent areas only added after checking current requirements."
              ],
              "image": "/images/fallbacks/culture.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Sikkim & Darjeeling, India within this carefully",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Layered clothing for cool mornings and variable hill weather.",
                "Walking shoes with grip for wet stone and forest paths.",
                "A light rain shell outside the driest months.",
                "Modest clothing for monasteries and village visits."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing landscape detail from Sikkim & Darjeeling, India on Tea, Monasteries & Khangchendzonga within this",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Sikkim & Darjeeling, India."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Editorial travel scene showing landscape detail from Sikkim & Darjeeling, India on Tea, Monasteries & Khangchendzonga within this",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Sikkim & Darjeeling, India."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Editorial travel scene showing landscape detail from Sikkim & Darjeeling, India on Tea, Monasteries & Khangchendzonga within this",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Sikkim & Darjeeling, India."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing landscape detail from Sikkim & Darjeeling, India on Tea, Monasteries & Khangchendzonga within this",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Sikkim & Darjeeling, India."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Sikkim & Darjeeling, India on Tea, Monasteries & Khangchendzonga within this",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Sikkim & Darjeeling, India."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": false,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The eastern Himalaya is best read in layers: tea, cloud, monastery bell, market road, and mountain beyond.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sikkim & Darjeeling, India within this carefully designed cultural",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Sikkim & Darjeeling, India, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/journey-mob.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sikkim & Darjeeling, India within this carefully designed cultural",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Sikkim & Darjeeling, India, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Sikkim & Darjeeling, India within this carefully designed cultural",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Sikkim & Darjeeling, India, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PERMIT & WEATHER NOTE",
              "text": "Sikkim has permit-controlled areas and mountain roads that can be affected by weather or landslides. This route intentionally avoids making permit-dependent high-altitude excursions essential to the journey."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "The Mountain Is Not the Only Story",
              "paragraphs": [
                "Khangchendzonga may dominate the horizon, but the journey is built around what happens below it: tea workers, monasteries, homestays, nurseries, and market streets.",
                "That human scale keeps the route resilient even when cloud hides the great peaks, which is exactly how a mountain journey should be designed."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "EASTERN HIMALAYAN HOMESTAY & CULTURE CURATOR • GANGTOK, SIKKIM",
              "name": "Pema Lepcha",
              "bio": "Pema curates eastern Himalayan journeys around homestays, tea landscapes, monasteries, and community stories, with practical attention to weather, roads, and permit realities.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Pema Lepcha for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Tea, Monasteries & Khangchendzonga be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Pema Lepcha’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Sikkim has permit-controlled areas and mountain roads that can be affected by weather or landslides. This route intentionally avoids making permit-dependent high-altitude excursions essential to the journey."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as gentle mountain. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-7",
      "slug": "salt-looms-and-desert-villages",
      "type": "collaborated",
      "featured": false,
      "title": "Salt, Looms & Desert Villages",
      "region": "Kutch, India",
      "days": 9,
      "categories": [
        "culture",
        "offbeat",
        "stays"
      ],
      "tags": [
        "#KUTCH",
        "#CRAFT",
        "#DESERT"
      ],
      "intro": "Explore Kutch through Bhuj, artisan villages, Banni grasslands, the Great Rann, and Mandvi, with craft communities placed at the centre of the route.",
      "image": "/images/home/forest-landscape.webp",
      "alt": "Kutch textiles, white salt flats and desert villages glowing beneath warm western Indian light",
      "collaborator": {
        "name": "Reema Jadeja",
        "role": "Kutch Craft & Desert Community Curator • Bhuj, Gujarat",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A craft-led Kutch itinerary connecting textile traditions, desert ecology, village architecture, salt landscapes, and the old port town of Mandvi.",
      "highlights": [
        {
          "icon": "village",
          "label": "Bhuj orientation through museums, markets, and local design history."
        },
        {
          "icon": "temple",
          "label": "Small-group artisan visits in Ajrakhpur, Bhujodi, and selected villages."
        },
        {
          "icon": "boat",
          "label": "Sunrise or sunset on the Great Rann without building the whole trip around a p"
        },
        {
          "icon": "wellness",
          "label": "Mandvi’s port history, shipbuilding context, and coastal food traditions."
        }
      ]
    },
    "relatedSlugs": [
      "medinas-atlas-and-earthen-kasbahs",
      "oaxaca-kitchens-and-sierra-paths",
      "sacred-valley-weaves-and-andean-trails"
    ],
    "seo": {
      "pageTitle": "Salt, Looms & Desert Villages | 9-Day Kutch, India Journey",
      "pageDesc": "Explore Kutch through Bhuj, artisan villages, Banni grasslands, the Great Rann, and Mandvi, with craft communities placed at the centre of the route.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Salt, Looms & Desert Villages across Kutch, India for social sharing within this carefully",
      "breadcrumbName": "Salt, Looms & Desert Villages",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Salt, Looms & Desert Villages"
        }
      ],
      "coverImage": "/images/home/solo-landscape.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Kutch, India within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Salt, Looms & Desert Villages",
      "intro": "Explore Kutch through Bhuj, artisan villages, Banni grasslands, the Great Rann, and Mandvi, with craft communities placed at the centre of the route.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Unhurried"
        },
        {
          "label": "Region",
          "value": "Kutch, India"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Craft, desert & community"
        },
        {
          "label": "Designer",
          "value": "Reema Jadeja"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 2,100",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Salt, Looms & Desert Villages",
      "shareText": "Explore Kutch through Bhuj, artisan villages, Banni grasslands, the Great Rann, and Mandvi, with craft communities placed at the centre of the route."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Kutch is approached through the hands that make it. Bhuj anchors the journey, while nearby weaving, block-printing, embroidery, leather, and pottery communities provide a network of visits that can be paced according to who is available rather than treated as a fixed shopping circuit.",
                "The route then expands into Banni and the salt desert before turning south to Mandvi. Reema keeps the craft visits conversational and the desert portions spacious, allowing material culture and landscape to explain each other."
              ],
              "image": "/images/itineraries/dummy6.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Kutch, India landscapes and local encounters within this carefully designed",
              "imageAspectRatio": "4 / 5",
              "caption": "Bhuj → Ajrakhpur & Bhujodi → Banni Villages → Great Rann → Mandvi",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Bhuj orientation through museums, markets, and local design history.",
                "Small-group artisan visits in Ajrakhpur, Bhujodi, and selected villages.",
                "Sunrise or sunset on the Great Rann without building the whole trip around a photo stop.",
                "Mandvi’s port history, shipbuilding context, and coastal food traditions."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around craft, desert & community, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: The Craft Capital Orientation",
                  "bodySubtitle": "DAYS 1–2 | BHUJ",
                  "paragraphs": [
                    "Begin in Bhuj with museums, markets, historic neighbourhoods, and time to understand how Kutch’s communities, migration histories, and materials connect."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Curated museum or collection visit.",
                    "Market walk focused on identifying techniques before buying."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Editorial travel scene showing Bhuj during the Salt, Looms & Desert Villages journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Cloth, Dye and Loom",
                  "bodySubtitle": "DAY 3 | AJRAKHPUR & BHUJODI",
                  "paragraphs": [
                    "Spend a full day with selected textile communities, allowing enough time to understand process, family workshops, and the difference between techniques."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Ajrakh block-printing demonstration with process explanation.",
                    "Handloom visit in Bhujodi with direct artisan purchasing."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact4.webp",
                      "alt": "Editorial travel scene showing Ajrakhpur & Bhujodi during the Salt, Looms & Desert Villages journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Grasslands and Community Craft",
                  "bodySubtitle": "DAYS 4–5 | BANNI VILLAGES",
                  "paragraphs": [
                    "Move north into the Banni landscape for village stays or locally rooted lodges, visiting embroidery, leather, and other craft traditions according to host availability."
                  ],
                  "listItems": [
                    "Village-hosted craft conversations.",
                    "Grassland drive or nature walk with local context."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact5.webp",
                      "alt": "Editorial travel scene showing Banni Villages during the Salt, Looms & Desert Villages journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: The White Horizon",
                  "bodySubtitle": "DAY 6 | GREAT RANN",
                  "paragraphs": [
                    "Use a single well-timed day for the salt flats, prioritising light, weather, and quieter access rather than spending multiple nights in a large seasonal camp."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Sunrise or sunset salt-flat visit.",
                    "Time for landscape photography without staged props."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Editorial travel scene showing Great Rann during the Salt, Looms & Desert Villages journey within this carefully designed"
                    },
                    {
                      "src": "/images/itineraries/dummy1.webp",
                      "alt": "Editorial travel scene showing Great Rann during the Salt, Looms & Desert Villages journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Port, Timber and Sea",
                  "bodySubtitle": "DAYS 7–8 | MANDVI",
                  "paragraphs": [
                    "Travel south to Mandvi for old port stories, traditional wooden shipbuilding context, coastal architecture, and a softer final rhythm by the Arabian Sea."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Shipyard or maritime craft visit where access is permitted.",
                    "Coastal dinner built around Kutchi flavours."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal1.webp",
                      "alt": "Editorial travel scene showing Mandvi during the Salt, Looms & Desert Villages journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Editorial travel scene showing Mandvi during the Salt, Looms & Desert Villages journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 9 | BHUJ",
                  "paragraphs": [
                    "Return toward Bhuj for onward rail or air connections with sufficient road buffer."
                  ],
                  "listItems": [
                    "Private departure transfer.",
                    "Final craft purchases only if time remains."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Locally rooted hotels, village stays, and a coastal stay in Mandvi.",
                "Artisan appointments kept small and respectful of working time.",
                "Private vehicle for dispersed craft clusters and desert roads.",
                "Purchasing encouraged directly from makers whenever possible."
              ],
              "image": "/images/home/forest-landscape.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Kutch, India within this carefully designed cultural",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light breathable clothing with a warm layer for winter desert evenings.",
                "Slip-on or easy footwear for homes and workshops.",
                "Sun protection for exposed salt flats and grasslands.",
                "Extra luggage space only if you genuinely plan to purchase textiles or craft."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/home/journey-pc1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kutch, India within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Kutch, India, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy14.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kutch, India within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Kutch, India, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kutch, India within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Kutch, India, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kutch, India within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Kutch, India, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/journey-mob1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kutch, India within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Kutch, India, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kutch, India within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Kutch, India, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": true,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "In Kutch, the landscape can look empty until someone shows you how much knowledge is held in cloth, clay, timber, and salt.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "CRAFT VISIT ETIQUETTE",
              "text": "Workshops are workplaces and homes, not performance venues. Photography, demonstrations, and purchases should follow the artisan’s comfort, and the route must remain flexible when a family or workshop is unavailable."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Material Memory in a Wide Landscape",
              "paragraphs": [
                "The strongest Kutch journeys do not separate “craft” from “place.” Embroidery responds to community identity, timber to maritime history, and colour to local materials and trade.",
                "By the time the route reaches Mandvi, the salt desert feels less empty because the human systems around it have become visible."
              ],
              "image": "/images/itineraries/dummy12.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Kutch, India within this carefully designed cultural journey",
              "imageAspectRatio": "4 / 5"
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "KUTCH CRAFT & DESERT COMMUNITY CURATOR • BHUJ, GUJARAT",
              "name": "Reema Jadeja",
              "bio": "Reema designs Kutch journeys around artisan relationships, community-led craft economies, desert ecology, and direct purchasing, with an emphasis on process over souvenir hunting.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Reema Jadeja for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Salt, Looms & Desert Villages be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Reema Jadeja’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Workshops are workplaces and homes, not performance venues. Photography, demonstrations, and purchases should follow the artisan’s comfort, and the route must remain flexible when a family or workshop is unavailable."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as unhurried. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-8",
      "slug": "medinas-atlas-and-earthen-kasbahs",
      "type": "collaborated",
      "featured": true,
      "title": "Medinas, Atlas & Earthen Kasbahs",
      "region": "Morocco",
      "days": 11,
      "categories": [
        "culture",
        "stays",
        "bespoke"
      ],
      "tags": [
        "#MOROCCO",
        "#MEDINA",
        "#ATLAS"
      ],
      "intro": "Travel from Fez through the Atlas and southern kasbah country to Marrakech, using architecture, craft, food, and rural landscapes as one continuous story.",
      "image": "/images/home/journey-pc1.webp",
      "alt": "Moroccan medina lanes, Atlas valleys and earthen kasbah walls glowing in amber desert light",
      "collaborator": {
        "name": "Youssef El Mansouri",
        "role": "Medina, Architecture & Atlas Journey Designer • Fez, Morocco",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A Morocco journey built around medina craft, mountain transitions, earthen architecture, riad stays, and the cultural contrasts between Fez and Marrakech."
    },
    "relatedSlugs": [
      "salt-looms-and-desert-villages",
      "wine-roads-and-stone-monasteries",
      "pueblo-skies-and-desert-modernism"
    ],
    "seo": {
      "pageTitle": "Medinas, Atlas & Earthen Kasbahs | 11-Day Morocco Journey",
      "pageDesc": "Travel from Fez through the Atlas and southern kasbah country to Marrakech, using architecture, craft, food, and rural landscapes as one continuous story.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Medinas, Atlas & Earthen Kasbahs across Morocco for social sharing within this carefully designed",
      "breadcrumbName": "Medinas, Atlas & Earthen Kasbahs",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Medinas, Atlas & Earthen Kasbahs"
        }
      ],
      "coverImage": "/images/impact/impact1.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Morocco within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Medinas, Atlas & Earthen Kasbahs",
      "intro": "Travel from Fez through the Atlas and southern kasbah country to Marrakech, using architecture, craft, food, and rural landscapes as one continuous story.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "11 days"
        },
        {
          "label": "Pace",
          "value": "Layered"
        },
        {
          "label": "Region",
          "value": "Morocco"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Architecture, craft & food"
        },
        {
          "label": "Designer",
          "value": "Youssef El Mansouri"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 3,100",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Medinas, Atlas & Earthen Kasbahs",
      "shareText": "Travel from Fez through the Atlas and southern kasbah country to Marrakech, using architecture, craft, food, and rural landscapes as one continuous story."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Fez is given three nights because its medina makes more sense when craft, food, architecture, and neighbourhood life are layered over time. Youssef begins with orientation and then moves progressively deeper into specialist workshops and quieter residential quarters.",
                "The road south crosses mountain and oasis landscapes before reaching Skoura, earthen kasbah country, and the High Atlas. Marrakech closes the route as a contrast rather than a climax, showing a different urban energy and design language."
              ],
              "image": "/images/itineraries/dummy7.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Morocco landscapes and local encounters within this carefully designed cultural",
              "imageAspectRatio": "4 / 5",
              "caption": "Fez → Middle Atlas → Skoura → Aït Benhaddou → High Atlas → Marrakech",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Fez medina interpreted through craft, architecture, and food traditions.",
                "Middle Atlas transition through cedar and market towns.",
                "Oasis and earthen architecture around Skoura and Aït Benhaddou.",
                "Riad life, gardens, and contemporary craft perspectives in Marrakech."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Medinas, Atlas & Earthen Kasbahs",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Morocco and its cultural landscapes within this carefully designed cultural",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Medinas, Atlas & Earthen Kasbahs."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 11-day journey is paced around architecture, craft & food, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Inside the Medina Slowly",
                  "bodySubtitle": "DAYS 1–3 | FEZ",
                  "paragraphs": [
                    "Use three days to move from major landmarks into artisan quarters, food markets, fondouks, and domestic architecture, keeping routes short enough to absorb detail."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Specialist walk focused on zellige, wood, leather, or metal craft.",
                    "Private food-focused evening or home-style culinary session."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Editorial travel scene showing Fez during the Medinas, Atlas & Earthen Kasbahs journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: From Imperial City to Mountain Country",
                  "bodySubtitle": "DAY 4 | MIDDLE ATLAS",
                  "paragraphs": [
                    "Leave Fez through the Middle Atlas, pausing in forest and market landscapes to make the ecological transition visible rather than treating the drive as dead time."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Landscape stop away from roadside photo crowds.",
                    "Regional lunch reflecting mountain ingredients."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Editorial travel scene showing Middle Atlas during the Medinas, Atlas & Earthen Kasbahs journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Palm Groves and Earthen Architecture",
                  "bodySubtitle": "DAYS 5–6 | SKOURA",
                  "paragraphs": [
                    "Settle into the Skoura oasis for kasbah architecture, palm-grove walks, and time with local agricultural landscapes."
                  ],
                  "listItems": [
                    "Guided walk through oasis irrigation and settlement patterns.",
                    "Stay in a restored earthen property with architectural context."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal3.webp",
                      "alt": "Editorial travel scene showing Skoura during the Medinas, Atlas & Earthen Kasbahs journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Kasbah Roads and Mountain Passes",
                  "bodySubtitle": "DAYS 7–8 | AÏT BENHADDOU & HIGH ATLAS",
                  "paragraphs": [
                    "Continue toward Aït Benhaddou and the High Atlas, balancing famous architecture with smaller villages and mountain landscapes along the route."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Early or late visit to Aït Benhaddou.",
                    "Village or valley walk adapted to weather and road conditions."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Editorial travel scene showing Aït Benhaddou & High Atlas during the Medinas, Atlas & Earthen Kasbahs journey within"
                    },
                    {
                      "src": "/images/itineraries/dummy4.webp",
                      "alt": "Editorial travel scene showing Aït Benhaddou & High Atlas during the Medinas, Atlas & Earthen Kasbahs journey within"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: The Red City in Layers",
                  "bodySubtitle": "DAYS 9–10 | MARRAKECH",
                  "paragraphs": [
                    "Finish in Marrakech with riad courtyards, gardens, food, and design, using specialist visits to prevent the medina from becoming only a shopping maze."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Architecture and garden walk.",
                    "Contemporary craft or design studio appointment."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal5.webp",
                      "alt": "Editorial travel scene showing Marrakech during the Medinas, Atlas & Earthen Kasbahs journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/fallbacks/culture.webp",
                      "alt": "Editorial travel scene showing Marrakech during the Medinas, Atlas & Earthen Kasbahs journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 11 | MARRAKECH",
                  "paragraphs": [
                    "Keep the final morning light and flexible before the airport transfer."
                  ],
                  "listItems": [
                    "Private airport transfer.",
                    "Optional hammam or café stop if flight timing permits."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Characterful riads and restored earthen properties.",
                "Private vehicle for mountain and oasis stages.",
                "Specialist medina guiding rather than generic shopping escorts.",
                "Flexible village visits shaped around local hosts and seasonal conditions."
              ],
              "image": "/images/home/journey-pc.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Morocco within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Comfortable walking shoes for cobbled and uneven medina lanes.",
                "Light layers with a warmer piece for mountain evenings.",
                "Modest clothing for religious and rural settings.",
                "Sun protection for exposed oasis and kasbah landscapes."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Editorial travel scene showing landscape detail from Morocco on Medinas, Atlas & Earthen Kasbahs within this carefully designed",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Morocco."
                },
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Editorial travel scene showing landscape detail from Morocco on Medinas, Atlas & Earthen Kasbahs within this carefully designed",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Morocco."
                },
                {
                  "src": "/images/journal/journal5.webp",
                  "alt": "Editorial travel scene showing landscape detail from Morocco on Medinas, Atlas & Earthen Kasbahs within this carefully designed",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Morocco."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Editorial travel scene showing landscape detail from Morocco on Medinas, Atlas & Earthen Kasbahs within this carefully designed",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Morocco."
                },
                {
                  "src": "/images/home/forest-landscape.webp",
                  "alt": "Editorial travel scene showing landscape detail from Morocco on Medinas, Atlas & Earthen Kasbahs within this carefully designed",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Morocco."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": true,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Morocco is not one palette. Fez, the Atlas, the oases, and Marrakech each hold a different temperature of colour and time.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/home/journey-pc.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Morocco within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Morocco, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy2.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Morocco within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Morocco, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/solo-landscape.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Morocco within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Morocco, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Morocco within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Morocco, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy5.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Morocco within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Morocco, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Morocco within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Morocco, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": true,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "MEDINA & PHOTOGRAPHY NOTE",
              "text": "Medinas are living neighbourhoods. Ask before photographing people or workshops, avoid treating artisans as props, and use a trusted local guide when navigating specialist quarters or making significant purchases."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Architecture as a Way of Reading Place",
              "paragraphs": [
                "Courtyards, kasbah walls, irrigation channels, workshops, and mountain villages become the connective tissue of this route. The architecture is never just decoration; it records climate, trade, family, and material knowledge.",
                "Ending in Marrakech works because the journey has already taught the eye how to look beyond surface colour."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "MEDINA, ARCHITECTURE & ATLAS JOURNEY DESIGNER • FEZ, MOROCCO",
              "name": "Youssef El Mansouri",
              "bio": "Youssef designs Morocco journeys through architecture, craft economies, food, and rural transitions, connecting medina detail with the larger landscapes that shaped it.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Youssef El Mansouri for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Medinas, Atlas & Earthen Kasbahs be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Youssef El Mansouri’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Medinas are living neighbourhoods. Ask before photographing people or workshops, avoid treating artisans as props, and use a trusted local guide when navigating specialist quarters or making significant purchases."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as layered. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-9",
      "slug": "wine-roads-and-stone-monasteries",
      "type": "collaborated",
      "featured": false,
      "title": "Wine Roads & Stone Monasteries",
      "region": "Georgia & Armenia",
      "days": 12,
      "categories": [
        "culture",
        "stays",
        "offbeat"
      ],
      "tags": [
        "#CAUCASUS",
        "#WINE",
        "#MONASTERIES"
      ],
      "intro": "Cross the Caucasus through Tbilisi, Kakheti, Kazbegi, Yerevan, and Armenian monastery country, linking wine, bread, stone architecture, and mountain hospitality.",
      "image": "/images/home/travel-video.webp",
      "alt": "Caucasus vineyards, stone monasteries and mountain roads stretching between Georgia and Armenia",
      "collaborator": {
        "name": "Mariam Beridze",
        "role": "Caucasus Wine & Monastery Curator • Tbilisi, Georgia",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A cross-border Caucasus journey where qvevri wine, monastery landscapes, mountain roads, and family tables create a shared cultural thread across Georgia and Armenia.",
      "highlights": [
        {
          "icon": "village",
          "label": "Tbilisi neighbourhoods and contemporary Georgian food culture."
        },
        {
          "icon": "temple",
          "label": "Kakheti qvevri wine traditions and family-scale cellar visits."
        },
        {
          "icon": "boat",
          "label": "Kazbegi mountain landscapes and village roads."
        },
        {
          "icon": "wellness",
          "label": "Armenian monastery architecture around Geghard, Dilijan, and Sevan."
        }
      ]
    },
    "relatedSlugs": [
      "lantern-roads-of-kii",
      "medinas-atlas-and-earthen-kasbahs",
      "dolomite-paths-and-soca-waters"
    ],
    "seo": {
      "pageTitle": "Wine Roads & Stone Monasteries | 12-Day Georgia & Armenia Journey",
      "pageDesc": "Cross Georgia and Armenia through Tbilisi, Kakheti, Kazbegi, Yerevan, and monastery country, linking wine, bread, stone architecture, and mountain hospitality.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Wine Roads & Stone Monasteries across Georgia & Armenia for social sharing within this",
      "breadcrumbName": "Wine Roads & Stone Monasteries",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Wine Roads & Stone Monasteries"
        }
      ],
      "coverImage": "/images/impact/impact3.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Georgia & Armenia within this carefully designed cultural",
      "eyebrow": "Collaborated Route",
      "title": "Wine Roads & Stone Monasteries",
      "intro": "Cross the Caucasus through Tbilisi, Kakheti, Kazbegi, Yerevan, and Armenian monastery country, linking wine, bread, stone architecture, and mountain hospitality.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "12 days"
        },
        {
          "label": "Pace",
          "value": "Generous"
        },
        {
          "label": "Region",
          "value": "Georgia & Armenia"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Wine, monasteries & mountains"
        },
        {
          "label": "Designer",
          "value": "Mariam Beridze"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 3,250",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Wine Roads & Stone Monasteries",
      "shareText": "Cross the Caucasus through Tbilisi, Kakheti, Kazbegi, Yerevan, and Armenian monastery country, linking wine, bread, stone architecture, and mountain hospitality."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This itinerary treats Georgia and Armenia as neighbouring cultures with distinct voices rather than flattening them into a single “Caucasus” aesthetic. Tbilisi and Kakheti begin with wine, food, and urban history before the road climbs toward Kazbegi.",
                "After crossing into Armenia, Yerevan provides a new architectural and culinary rhythm, followed by monastery landscapes around Geghard, Dilijan, and Lake Sevan. The route privileges family tables, small producers, and stone architecture over checklist touring."
              ],
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Tbilisi neighbourhoods and contemporary Georgian food culture.",
                "Kakheti qvevri wine traditions and family-scale cellar visits.",
                "Kazbegi mountain landscapes and village roads.",
                "Armenian monastery architecture around Geghard, Dilijan, and Sevan."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 12-day journey is paced around wine, monasteries & mountains, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Balconies, Baths and New Georgia",
                  "bodySubtitle": "DAYS 1–2 | TBILISI",
                  "paragraphs": [
                    "Begin in Tbilisi with old neighbourhoods, bathhouse architecture, food, and contemporary creative spaces that show the city beyond postcard balconies."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Neighbourhood walk across old and contemporary districts.",
                    "Georgian table experience focused on regional dishes and wine."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Editorial travel scene showing Tbilisi during the Wine Roads & Stone Monasteries journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Qvevri Country",
                  "bodySubtitle": "DAYS 3–4 | KAKHETI",
                  "paragraphs": [
                    "Move east into Kakheti for vineyard landscapes and traditional qvevri wine, keeping cellar visits small and educational rather than turning the day into a tasting marathon."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Family cellar visit with qvevri explanation.",
                    "Village lunch with seasonal Kakhetian dishes."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/fallbacks/culture.webp",
                      "alt": "Editorial travel scene showing Kakheti during the Wine Roads & Stone Monasteries journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Road to the Greater Caucasus",
                  "bodySubtitle": "DAYS 5–6 | KAZBEGI",
                  "paragraphs": [
                    "Travel north along the mountain road for Kazbegi, allowing time for viewpoints, village life, and a flexible walk depending on weather."
                  ],
                  "listItems": [
                    "Mountain walk adapted to conditions.",
                    "Local dinner and early night in the high valley."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/forest-landscape.webp",
                      "alt": "Editorial travel scene showing Kazbegi during the Wine Roads & Stone Monasteries journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: A New Capital Rhythm",
                  "bodySubtitle": "DAYS 7–8 | YEREVAN",
                  "paragraphs": [
                    "Cross or connect into Armenia and settle in Yerevan, using markets, architecture, food, and museums to establish a distinct Armenian context."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Market and food-focused orientation.",
                    "Architecture walk through central Yerevan."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Editorial travel scene showing Yerevan during the Wine Roads & Stone Monasteries journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/itineraries/dummy7.webp",
                      "alt": "Editorial travel scene showing Yerevan during the Wine Roads & Stone Monasteries journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Stone, Gorge and Sacred Space",
                  "bodySubtitle": "DAY 9 | GARNI & GEGHARD",
                  "paragraphs": [
                    "Take a focused day into the Azat Valley for Garni and Geghard, balancing major sites with landscape and village food."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Geghard monastery visit timed for quieter periods.",
                    "Lavash or local food experience where available."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/journey-pc1.webp",
                      "alt": "Editorial travel scene showing Garni & Geghard during the Wine Roads & Stone Monasteries journey within this carefully"
                    },
                    {
                      "src": "/images/home/solo-landscape.webp",
                      "alt": "Editorial travel scene showing Garni & Geghard during the Wine Roads & Stone Monasteries journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Forest Monasteries and Water",
                  "bodySubtitle": "DAYS 10–11 | DILIJAN & LAKE SEVAN",
                  "paragraphs": [
                    "Finish in northern Armenia with forested Dilijan, monastery landscapes, and Lake Sevan, slowing the route before departure."
                  ],
                  "listItems": [
                    "Forest or monastery walk around Dilijan.",
                    "Lakeside meal featuring regional ingredients."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/solo-landscape.webp",
                      "alt": "Editorial travel scene showing Dilijan & Lake Sevan during the Wine Roads & Stone Monasteries journey within this"
                    }
                  ]
                },
                {
                  "id": "phase-07",
                  "headerTitle": "Phase 07: Departure & Onward Connections",
                  "bodySubtitle": "DAY 12 | YEREVAN",
                  "paragraphs": [
                    "Return to Yerevan for onward travel with border and road timing kept conservative."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Private departure transfer.",
                    "Schedule buffer for cross-border routing."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Boutique city hotels and small wine-country properties.",
                "Private vehicle and guide support across both countries.",
                "Wine visits limited to quality producers with cultural context.",
                "Cross-border documentation and routing confirmed before final booking."
              ],
              "image": "/images/home/journey-pc1.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Georgia & Armenia within this carefully designed",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Layered clothing for variable mountain temperatures.",
                "Comfortable shoes for stone monasteries and uneven village lanes.",
                "A light rain shell outside the driest summer period.",
                "Space in luggage only if you intend to transport wine legally."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Wine Roads & Stone Monasteries",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Georgia & Armenia and its cultural landscapes within this carefully",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Wine Roads & Stone Monasteries."
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The Caucasus is held together by tables, stone, mountains, and the insistence that every valley has its own story.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Georgia & Armenia within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Georgia & Armenia, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Georgia & Armenia within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Georgia & Armenia, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Georgia & Armenia within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Georgia & Armenia, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "BORDER & WINE NOTE",
              "text": "Cross-border procedures and transport arrangements can change, so the exact Georgia–Armenia connection should be reconfirmed before travel. Wine transport limits should also be checked for the traveller’s onward destination."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Two Countries, One Long Conversation",
              "paragraphs": [
                "Georgia and Armenia share mountain geography and ancient Christian traditions, yet their architecture, wine, bread, music, and urban life remain wonderfully distinct.",
                "The route works because it gives each country enough time to speak before drawing connections between them."
              ],
              "image": "/images/itineraries/dummy14.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Georgia & Armenia within this carefully designed cultural",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Wine Roads & Stone Monasteries."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "CAUCASUS WINE & MONASTERY CURATOR • TBILISI, GEORGIA",
              "name": "Mariam Beridze",
              "bio": "Mariam curates Caucasus travel through wine culture, monastery architecture, family tables, and mountain roads, with careful attention to the differences between neighbouring regions.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Mariam Beridze for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Wine Roads & Stone Monasteries be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Mariam Beridze’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Cross-border procedures and transport arrangements can change, so the exact Georgia–Armenia connection should be reconfirmed before travel. Wine transport limits should also be checked for the traveller’s onward destination."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as generous. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-10",
      "slug": "dolomite-paths-and-soca-waters",
      "type": "collaborated",
      "featured": false,
      "title": "Dolomite Paths & Soča Waters",
      "region": "Italy & Slovenia",
      "days": 10,
      "categories": [
        "nature",
        "stays",
        "wellness"
      ],
      "tags": [
        "#DOLOMITES",
        "#SOCA",
        "#ALPS"
      ],
      "intro": "Walk selected Dolomite trails, eat through Friuli, and follow the Soča into Slovenia on a refined alpine route that balances movement with restorative stays.",
      "image": "/images/impact/impact2.webp",
      "alt": "Dolomite peaks, alpine meadows and turquoise Soča waters beneath clear summer mountain skies",
      "collaborator": {
        "name": "Lucia Marin",
        "role": "Alpine Food & Trail Designer • Udine, Italy",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "An alpine journey through the Dolomites, Friuli, the Soča Valley, and Bohinj, designed around moderate walking, regional food, and design-led mountain stays.",
      "highlights": [
        {
          "icon": "village",
          "label": "Moderate Dolomite day walks with route choice based on weather and fitness."
        },
        {
          "icon": "temple",
          "label": "Friulian food and wine between mountains and the Collio hills."
        },
        {
          "icon": "boat",
          "label": "Soča Valley river landscapes and First World War history interpreted with care"
        },
        {
          "icon": "wellness",
          "label": "Bohinj and Triglav-area nature without overloading the final days."
        }
      ]
    },
    "relatedSlugs": [
      "fjords-ferries-and-lofoten-light",
      "hebridean-roads-and-highland-memory",
      "wine-roads-and-stone-monasteries"
    ],
    "seo": {
      "pageTitle": "Dolomite Paths & Soča Waters | 10-Day Italy & Slovenia Journey",
      "pageDesc": "Walk selected Dolomite trails, eat through Friuli, and follow the Soča into Slovenia on a refined alpine route that balances movement with restorative stays.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Dolomite Paths & Soča Waters across Italy & Slovenia for social sharing within this",
      "breadcrumbName": "Dolomite Paths & Soča Waters",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Dolomite Paths & Soča Waters"
        }
      ],
      "coverImage": "/images/impact/impact5.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Italy & Slovenia within this carefully designed cultural",
      "eyebrow": "Collaborated Route",
      "title": "Dolomite Paths & Soča Waters",
      "intro": "Walk selected Dolomite trails, eat through Friuli, and follow the Soča into Slovenia on a refined alpine route that balances movement with restorative stays.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Active relaxed"
        },
        {
          "label": "Region",
          "value": "Italy & Slovenia"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Alpine walking & food"
        },
        {
          "label": "Designer",
          "value": "Lucia Marin"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 4,100",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Dolomite Paths & Soča Waters",
      "shareText": "Walk selected Dolomite trails, eat through Friuli, and follow the Soča into Slovenia on a refined alpine route that balances movement with restorative stays."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Lucia’s route is designed for travellers who want to walk in the Alps without turning every day into a performance metric. Three nights in the Dolomites establish the mountain rhythm through moderate hikes, rifugio lunches, and time in elegant valley towns.",
                "The route then moves east through Friuli’s food and wine country into Slovenia’s Soča Valley and Bohinj. The landscape remains alpine, but language, cuisine, architecture, and river culture change visibly across the border."
              ],
              "image": "/images/itineraries/dummy9.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Italy & Slovenia landscapes and local encounters within this carefully",
              "imageAspectRatio": "4 / 5",
              "caption": "Cortina → Friuli Dolomites → Collio → Soča Valley → Bohinj → Ljubljana"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around alpine walking & food, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Walk, Eat, Recover",
                  "bodySubtitle": "DAYS 1–3 | CORTINA & DOLOMITES",
                  "paragraphs": [
                    "Base in the Dolomites for three nights and choose daily walks according to weather, trail conditions, and energy, pairing mountain time with slow lunches and proper recovery."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "One moderate panoramic trail with optional shorter version.",
                    "Rifugio lunch built into the walking day rather than rushed afterward."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Editorial travel scene showing Cortina & Dolomites during the Dolomite Paths & Soča Waters journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: From Peaks to Table Country",
                  "bodySubtitle": "DAYS 4–5 | FRIULI",
                  "paragraphs": [
                    "Move east into Friuli for smaller mountain landscapes, historic towns, and a food culture shaped by the Alps, Adriatic influence, and border history."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Regional wine or food producer visit.",
                    "Evening in a smaller historic town rather than a major city."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/solo-landscape.webp",
                      "alt": "Editorial travel scene showing Friuli during the Dolomite Paths & Soča Waters journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: The Border Becomes Visible",
                  "bodySubtitle": "DAY 6 | COLLIO & BORDERLANDS",
                  "paragraphs": [
                    "Spend a day among vineyard hills and border villages before crossing into Slovenia, using food and local history to make the transition tangible."
                  ],
                  "listItems": [
                    "Small winery or farm visit.",
                    "Short village walk across the cultural borderland."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/travel-video.webp",
                      "alt": "Editorial travel scene showing Collio & Borderlands during the Dolomite Paths & Soča Waters journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Turquoise Water, Steep History",
                  "bodySubtitle": "DAYS 7–8 | SOČA VALLEY",
                  "paragraphs": [
                    "Follow the Soča through mountain settlements and river landscapes, balancing easy outdoor activity with interpretation of the region’s difficult twentieth-century history."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Riverside walk or gentle activity chosen to comfort level.",
                    "Local museum or guided historical interpretation."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Editorial travel scene showing Soča Valley during the Dolomite Paths & Soča Waters journey within this carefully designed"
                    },
                    {
                      "src": "/images/itineraries/dummy10.webp",
                      "alt": "Editorial travel scene showing Soča Valley during the Dolomite Paths & Soča Waters journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: A Quieter Alpine Lake",
                  "bodySubtitle": "DAY 9 | BOHINJ",
                  "paragraphs": [
                    "Finish with a slower day around Bohinj and the edge of Triglav National Park before heading toward Ljubljana."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Lakeside walk or cable-car option depending weather.",
                    "Final alpine dinner focused on Slovenian regional produce."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact2.webp",
                      "alt": "Editorial travel scene showing Bohinj during the Dolomite Paths & Soča Waters journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/impact/impact3.webp",
                      "alt": "Editorial travel scene showing Bohinj during the Dolomite Paths & Soča Waters journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 10 | LJUBLJANA",
                  "paragraphs": [
                    "Transfer to Ljubljana for onward travel, with the final hours intentionally unscheduled."
                  ],
                  "listItems": [
                    "Private station or airport transfer.",
                    "Optional old-town lunch if departure timing allows."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Design-led alpine hotels with strong food and recovery spaces.",
                "Private transfer support between regions and border stages.",
                "Certified mountain guides used where trail complexity requires them.",
                "Daily walking choice based on current weather and trail conditions."
              ],
              "image": "/images/home/solo-landscape.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Italy & Slovenia within this carefully designed",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Supportive hiking shoes already broken in before travel.",
                "Waterproof shell and warm layer even during summer.",
                "Small daypack with water, sun protection, and snacks.",
                "Smart-casual layer for refined mountain hotels and wine-country dinners."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/home/journey-pc1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Italy & Slovenia on Dolomite Paths & Soča Waters within this",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Italy & Slovenia."
                },
                {
                  "src": "/images/home/solo-landscape.webp",
                  "alt": "Editorial travel scene showing landscape detail from Italy & Slovenia on Dolomite Paths & Soča Waters within this",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Italy & Slovenia."
                },
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Editorial travel scene showing landscape detail from Italy & Slovenia on Dolomite Paths & Soča Waters within this",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Italy & Slovenia."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Italy & Slovenia on Dolomite Paths & Soča Waters within this",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Italy & Slovenia."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Editorial travel scene showing landscape detail from Italy & Slovenia on Dolomite Paths & Soča Waters within this",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Italy & Slovenia."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": true,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The Alps become richer when the border is not an interruption, but another way of seeing how landscape shapes culture.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Dolomite Paths & Soča Waters",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Italy & Slovenia and its cultural landscapes within this carefully",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Dolomite Paths & Soča Waters."
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "MOUNTAIN WEATHER NOTE",
              "text": "Dolomite and Slovenian alpine weather can change quickly. The exact trail plan should be chosen locally each morning, and no single hike should be treated as essential to the success of the journey."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "One Mountain System, Different Cultures",
              "paragraphs": [
                "The route follows a geological continuity while culture changes around it: Italian, Friulian, Slovenian, rural, refined, historic, and contemporary.",
                "Walking provides the pace, but food, architecture, and the shift in language provide the story."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "ALPINE FOOD & TRAIL DESIGNER • UDINE, ITALY",
              "name": "Lucia Marin",
              "bio": "Lucia designs alpine journeys that pair moderate walking with regional food, thoughtful hotels, and cross-border cultural context, always letting weather determine the trail rather than ego.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Lucia Marin for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Dolomite Paths & Soča Waters be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Lucia Marin’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Dolomite and Slovenian alpine weather can change quickly. The exact trail plan should be chosen locally each morning, and no single hike should be treated as essential to the success of the journey."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as active relaxed. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-11",
      "slug": "fjords-ferries-and-lofoten-light",
      "type": "collaborated",
      "featured": true,
      "title": "Fjords, Ferries & Lofoten Light",
      "region": "Norway",
      "days": 11,
      "categories": [
        "nature",
        "stays",
        "offbeat"
      ],
      "tags": [
        "#NORWAY",
        "#FJORDS",
        "#LOFOTEN"
      ],
      "intro": "Move from Bergen through western fjords and onward to Lofoten, using ferries, scenic roads, fishing villages, and coastal light as the structure of the journey.",
      "image": "/images/impact/impact4.webp",
      "alt": "Norwegian fjords, red fishing cabins and jagged Lofoten mountains beneath changing Arctic light",
      "collaborator": {
        "name": "Ingrid Solheim",
        "role": "Fjord & Arctic Coast Journey Designer • Bergen, Norway",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A Norway route combining western fjord landscapes with the Arctic fishing culture of Lofoten, paced around ferries, weather, and long northern light."
    },
    "relatedSlugs": [
      "hebridean-roads-and-highland-memory",
      "dolomite-paths-and-soca-waters",
      "geothermal-stories-and-southern-fjords"
    ],
    "seo": {
      "pageTitle": "Fjords, Ferries & Lofoten Light | 11-Day Norway Journey",
      "pageDesc": "Move from Bergen through western fjords and onward to Lofoten, using ferries, scenic roads, fishing villages, and coastal light as the structure of the journey.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Fjords, Ferries & Lofoten Light across Norway for social sharing within this carefully designed",
      "breadcrumbName": "Fjords, Ferries & Lofoten Light",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Fjords, Ferries & Lofoten Light"
        }
      ],
      "coverImage": "/images/journal/journal1.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Norway within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Fjords, Ferries & Lofoten Light",
      "intro": "Move from Bergen through western fjords and onward to Lofoten, using ferries, scenic roads, fishing villages, and coastal light as the structure of the journey.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "11 days"
        },
        {
          "label": "Pace",
          "value": "Scenic"
        },
        {
          "label": "Region",
          "value": "Norway"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Fjords & Arctic coast"
        },
        {
          "label": "Designer",
          "value": "Ingrid Solheim"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 5,600",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Fjords, Ferries & Lofoten Light",
      "shareText": "Move from Bergen through western fjords and onward to Lofoten, using ferries, scenic roads, fishing villages, and coastal light as the structure of the journey."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Norway is designed here around transport as experience. Ferries, fjord roads, and short scenic drives are not merely connectors; they reveal how settlements sit between water and mountain in the west.",
                "After several nights in Fjord Norway, the route flies north for Lofoten, where fishing villages, exposed beaches, maritime history, and long light create a completely different coastal scale. The itinerary avoids trying to drive every scenic road in the country."
              ],
              "image": "/images/itineraries/dummy10.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Norway landscapes and local encounters within this carefully designed cultural",
              "imageAspectRatio": "4 / 5",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Bergen’s maritime history and food scene before entering the fjords.",
                "Hardanger and Aurland landscapes experienced through ferry, road, and short walks.",
                "Nærøyfjord-area water travel with quieter timing where possible.",
                "Four nights in Lofoten for fishing villages, coast, and weather-dependent exploration."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 11-day journey is paced around fjords & arctic coast, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: The Maritime Gateway",
                  "bodySubtitle": "DAYS 1–2 | BERGEN",
                  "paragraphs": [
                    "Begin in Bergen with harbour history, food, and neighbourhood walks, using the city to explain Norway’s relationship with coast and trade."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Bryggen and harbour interpretation beyond the façade.",
                    "Seafood-focused dinner using seasonal local catch."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Editorial travel scene showing Bergen during the Fjords, Ferries & Lofoten Light journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Orchards, Waterfalls and Deep Water",
                  "bodySubtitle": "DAYS 3–4 | HARDANGER",
                  "paragraphs": [
                    "Travel into Hardanger for fjord roads, orchard country, and short walks, keeping enough time for ferries and weather-dependent stops."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Scenic ferry or fjord crossing.",
                    "Short waterfall or orchard walk selected locally."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact3.webp",
                      "alt": "Editorial travel scene showing Hardanger during the Fjords, Ferries & Lofoten Light journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: The Narrow Fjord Country",
                  "bodySubtitle": "DAYS 5–6 | AURLAND & NÆRØYFJORD",
                  "paragraphs": [
                    "Continue toward Aurland and the Nærøyfjord landscape, using boat travel and viewpoints without compressing the region into a single transfer day."
                  ],
                  "listItems": [
                    "Fjord cruise or ferry through narrow water.",
                    "Village walk away from peak arrival windows."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact4.webp",
                      "alt": "Editorial travel scene showing Aurland & Nærøyfjord during the Fjords, Ferries & Lofoten Light journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Fishing Villages and Arctic Light",
                  "bodySubtitle": "DAYS 7–10 | LOFOTEN ISLANDS",
                  "paragraphs": [
                    "Fly north and spend four nights moving slowly through Lofoten, where short drives connect fishing villages, beaches, galleries, and mountain-backed harbours."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Visit a fishing village with maritime history context.",
                    "Weather-dependent coastal walk with local guide option."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Editorial travel scene showing Lofoten Islands during the Fjords, Ferries & Lofoten Light journey within this carefully designed"
                    },
                    {
                      "src": "/images/itineraries/dummy13.webp",
                      "alt": "Editorial travel scene showing Lofoten Islands during the Fjords, Ferries & Lofoten Light journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Departure & Onward Connections",
                  "bodySubtitle": "DAY 11 | LOFOTEN",
                  "paragraphs": [
                    "Keep the final day flexible for island airport or ferry connections, which can be sensitive to weather."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Transfer buffer for flight or ferry schedule.",
                    "No major hike planned before departure."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Boutique city hotel, fjord properties, and rorbuer-style stays where appropriate.",
                "Transport mix using ferries, scenic roads, and domestic flights.",
                "Flexible daily sequencing around weather and ferry timetables.",
                "Local guides used for exposed coastal walks or specialist nature outings."
              ],
              "image": "/images/home/travel-video.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Norway within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Waterproof shell and wind-resistant layers throughout the journey.",
                "Comfortable walking shoes with grip for wet coastal paths.",
                "Warm mid-layer even in summer, especially in Lofoten.",
                "Sleep mask during periods of very long summer daylight."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/home/journey-pc.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Norway within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Norway, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Norway within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Norway, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/solo-landscape.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Norway within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Norway, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": false
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "In Norway, the route is drawn by water first. Roads, ferries, and villages simply learn how to follow it.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Editorial travel scene showing landscape detail from Norway on Fjords, Ferries & Lofoten Light within this carefully designed",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Norway."
                },
                {
                  "src": "/images/journal/journal5.webp",
                  "alt": "Editorial travel scene showing landscape detail from Norway on Fjords, Ferries & Lofoten Light within this carefully designed",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Norway."
                },
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Editorial travel scene showing landscape detail from Norway on Fjords, Ferries & Lofoten Light within this carefully designed",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Norway."
                },
                {
                  "src": "/images/home/forest-landscape.webp",
                  "alt": "Editorial travel scene showing landscape detail from Norway on Fjords, Ferries & Lofoten Light within this carefully designed",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Norway."
                },
                {
                  "src": "/images/home/journey-pc.webp",
                  "alt": "Editorial travel scene showing landscape detail from Norway on Fjords, Ferries & Lofoten Light within this carefully designed",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Norway."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": false,
              "captionPc": false
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "WEATHER & FERRY NOTE",
              "text": "Ferry schedules, wind, and coastal weather can change the shape of a day. The itinerary should preserve alternatives and avoid making a single hike or boat departure the only meaningful experience."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Travel by the Shape of the Coast",
              "paragraphs": [
                "Western fjords and Lofoten are far apart, but both make geography impossible to ignore. Water decides where people build, how they move, and what the journey feels like.",
                "The route becomes memorable because transport remains visible instead of being hidden behind a sequence of airport transfers."
              ],
              "image": "/images/home/journey-mob.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Norway within this carefully designed cultural journey",
              "imageAspectRatio": "4 / 5"
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "FJORD & ARCTIC COAST JOURNEY DESIGNER • BERGEN, NORWAY",
              "name": "Ingrid Solheim",
              "bio": "Ingrid designs Norway routes around ferry systems, coastal settlements, weather-aware walking, and maritime culture, using fewer bases to create more time in changing light.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Ingrid Solheim for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Fjords, Ferries & Lofoten Light be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Ingrid Solheim’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Ferry schedules, wind, and coastal weather can change the shape of a day. The itinerary should preserve alternatives and avoid making a single hike or boat departure the only meaningful experience."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as scenic. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-12",
      "slug": "hebridean-roads-and-highland-memory",
      "type": "collaborated",
      "featured": false,
      "title": "Hebridean Roads & Highland Memory",
      "region": "Scotland",
      "days": 10,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#SCOTLAND",
        "#HEBRIDES",
        "#GAELIC"
      ],
      "intro": "Travel from the Highlands to Skye and the Outer Hebrides through Gaelic culture, crofting landscapes, archaeology, ferries, and Atlantic weather.",
      "image": "/images/impact/impact6.webp",
      "alt": "Hebridean beaches, stone ruins and Highland roads stretching beneath dramatic Atlantic weather",
      "collaborator": {
        "name": "Fiona MacLeod",
        "role": "Gaelic Landscape & Island Culture Curator • Inverness, Scotland",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A Scotland journey shaped by island ferries, Gaelic place names, archaeology, crofting history, and the slower roads of Skye, Harris, and Lewis.",
      "highlights": [
        {
          "icon": "village",
          "label": "Highland road journey through Wester Ross with long scenic pauses."
        },
        {
          "icon": "temple",
          "label": "Three nights on Skye for landscape, food, and local cultural context."
        },
        {
          "icon": "boat",
          "label": "Ferry crossing to Harris and time in crofting communities."
        },
        {
          "icon": "wellness",
          "label": "Lewis archaeology and Gaelic heritage without rushing the island roads."
        }
      ]
    },
    "relatedSlugs": [
      "fjords-ferries-and-lofoten-light",
      "dolomite-paths-and-soca-waters",
      "pueblo-skies-and-desert-modernism"
    ],
    "seo": {
      "pageTitle": "Hebridean Roads & Highland Memory | 10-Day Scotland Journey",
      "pageDesc": "Travel from the Highlands to Skye and the Outer Hebrides through Gaelic culture, crofting landscapes, archaeology, ferries, and Atlantic weather.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Hebridean Roads & Highland Memory across Scotland for social sharing within this carefully designed",
      "breadcrumbName": "Hebridean Roads & Highland Memory",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Hebridean Roads & Highland Memory"
        }
      ],
      "coverImage": "/images/journal/journal3.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Scotland within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Hebridean Roads & Highland Memory",
      "intro": "Travel from the Highlands to Skye and the Outer Hebrides through Gaelic culture, crofting landscapes, archaeology, ferries, and Atlantic weather.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Slow road"
        },
        {
          "label": "Region",
          "value": "Scotland"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Gaelic culture & islands"
        },
        {
          "label": "Designer",
          "value": "Fiona MacLeod"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 4,400",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Hebridean Roads & Highland Memory",
      "shareText": "Travel from the Highlands to Skye and the Outer Hebrides through Gaelic culture, crofting landscapes, archaeology, ferries, and Atlantic weather."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This route is less about famous castles than about how people live on exposed edges of land. From Inverness, the road moves west through Highland glens and sea lochs before crossing to Skye and then by ferry into the Outer Hebrides.",
                "Fiona layers Gaelic language, crofting history, archaeology, island food, and Atlantic weather into the route. Ferry days remain deliberately light because the crossing itself is part of the experience."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around gaelic culture & islands, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Into the Northwest Highlands",
                  "bodySubtitle": "DAYS 1–2 | INVERNESS & WESTER ROSS",
                  "paragraphs": [
                    "Begin around Inverness before driving west through glens, lochs, and small communities, using the road to introduce Highland history and land use."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Local history walk or museum visit.",
                    "Slow scenic drive with short coastal stops."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Editorial travel scene showing Inverness & Wester Ross during the Hebridean Roads & Highland Memory journey within this"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: An Island Beyond Viewpoints",
                  "bodySubtitle": "DAYS 3–5 | ISLE OF SKYE",
                  "paragraphs": [
                    "Stay three nights on Skye and resist the temptation to chase every famous viewpoint. Use one area at a time for walking, food, geology, and community stories."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Weather-dependent coastal or hill walk.",
                    "Dinner focused on island seafood and produce."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal1.webp",
                      "alt": "Editorial travel scene showing Isle of Skye during the Hebridean Roads & Highland Memory journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Crossing the Minch",
                  "bodySubtitle": "DAY 6 | FERRY TO HARRIS",
                  "paragraphs": [
                    "Travel by ferry to the Outer Hebrides and keep the rest of the day intentionally quiet, allowing weather, harbour arrival, and island orientation to set the pace."
                  ],
                  "listItems": [
                    "Ferry crossing treated as part of the journey.",
                    "Short Harris beach or village walk after arrival."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Editorial travel scene showing Ferry to Harris during the Hebridean Roads & Highland Memory journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Crofting, Cloth and Atlantic Edge",
                  "bodySubtitle": "DAYS 7–8 | HARRIS",
                  "paragraphs": [
                    "Explore Harris through crofting landscapes, weaving traditions, beaches, and low-key village roads rather than long mileage."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Context around Harris Tweed production and crofting.",
                    "Coastal walk chosen according to wind and tide."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Editorial travel scene showing Harris during the Hebridean Roads & Highland Memory journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/home/journey-mob.webp",
                      "alt": "Editorial travel scene showing Harris during the Hebridean Roads & Highland Memory journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Stone, Peat and Deep Time",
                  "bodySubtitle": "DAY 9 | LEWIS",
                  "paragraphs": [
                    "Move north to Lewis for archaeology, peat landscapes, and Gaelic cultural context, keeping the day focused rather than scattered."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Visit a major archaeological site with interpretation.",
                    "Evening conversation or cultural programme when available."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/journal/journal4.webp",
                      "alt": "Editorial travel scene showing Lewis during the Hebridean Roads & Highland Memory journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/journal/journal5.webp",
                      "alt": "Editorial travel scene showing Lewis during the Hebridean Roads & Highland Memory journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 10 | STORNOWAY",
                  "paragraphs": [
                    "Depart from Stornoway or connect onward by ferry, with weather contingency protected."
                  ],
                  "listItems": [
                    "Flexible airport or ferry transfer.",
                    "No fixed final-morning activity."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Small Highland hotels and island inns with strong local character.",
                "Ferry bookings integrated into the route from the beginning.",
                "Driving days kept short enough for unscheduled weather stops.",
                "Local cultural interpretation rather than folklore-only storytelling."
              ],
              "image": "/images/impact/impact1.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Scotland within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Waterproof jacket and warm layers regardless of season.",
                "Walking shoes suitable for wet grass, peat, and rocky coast.",
                "Small binoculars for coastal wildlife if desired.",
                "Flexible mindset for ferries, wind, and rapidly changing weather."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Editorial travel scene showing landscape detail from Scotland on Hebridean Roads & Highland Memory within this carefully designed",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Scotland."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Editorial travel scene showing landscape detail from Scotland on Hebridean Roads & Highland Memory within this carefully designed",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Scotland."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing landscape detail from Scotland on Hebridean Roads & Highland Memory within this carefully designed",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Scotland."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Scotland on Hebridean Roads & Highland Memory within this carefully designed",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Scotland."
                },
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Editorial travel scene showing landscape detail from Scotland on Hebridean Roads & Highland Memory within this carefully designed",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Scotland."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": false,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The islands do not reward hurry. Weather closes one door and opens another view, another conversation, another road.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/home/forest-landscape.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Scotland within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Scotland, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy10.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Scotland within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Scotland, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/journey-pc1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Scotland within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Scotland, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "FERRY & ISLAND ETIQUETTE",
              "text": "Island transport is weather-sensitive and communities are small. Ferry buffers, respectful parking, closed gates, livestock, and private croft land should all be treated as part of responsible travel."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Memory Held in Roads and Place Names",
              "paragraphs": [
                "Skye, Harris, and Lewis are visually spectacular, but the deeper route lives in language, crofting systems, archaeology, and the practical realities of island life.",
                "The best days often begin with a plan and become something better because weather forces it to change."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "GAELIC LANDSCAPE & ISLAND CULTURE CURATOR • INVERNESS, SCOTLAND",
              "name": "Fiona MacLeod",
              "bio": "Fiona curates Highland and Hebridean journeys through Gaelic culture, crofting history, archaeology, ferries, and local food, with weather flexibility built into every day.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Fiona MacLeod for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Hebridean Roads & Highland Memory be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Fiona MacLeod’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Island transport is weather-sensitive and communities are small. Ferry buffers, respectful parking, closed gates, livestock, and private croft land should all be treated as part of responsible travel."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as slow road. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-13",
      "slug": "conservancies-and-maasai-horizons",
      "type": "collaborated",
      "featured": true,
      "title": "Conservancies & Maasai Horizons",
      "region": "Kenya",
      "days": 9,
      "categories": [
        "nature",
        "culture",
        "stays"
      ],
      "tags": [
        "#KENYA",
        "#CONSERVANCY",
        "#SAFARI"
      ],
      "intro": "Move from Nairobi to community conservancies in Laikipia and the Maasai Mara, where wildlife, land stewardship, and local ownership shape the safari.",
      "image": "/images/journal/journal2.webp",
      "alt": "Kenyan savannah wildlife, conservancy grasslands and distant escarpments under broad golden skies",
      "collaborator": {
        "name": "Wanjiku Njeri",
        "role": "Conservancy & Community Safari Designer • Nairobi, Kenya",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A conservation-led Kenya safari linking Laikipia and the Mara through small camps, wildlife tracking, community conservancy models, and spacious game-viewing days.",
      "highlights": [
        {
          "icon": "village",
          "label": "Laikipia wildlife viewing paired with conservation and land-use context."
        },
        {
          "icon": "temple",
          "label": "Small-camp stays with low vehicle density where possible."
        },
        {
          "icon": "boat",
          "label": "Maasai Mara ecosystem experienced from a conservancy base."
        },
        {
          "icon": "wellness",
          "label": "Community and ranger conversations integrated without staging culture for visi"
        }
      ]
    },
    "relatedSlugs": [
      "desert-silence-to-delta-water",
      "geothermal-stories-and-southern-fjords",
      "northern-stories-and-knuckles-green"
    ],
    "seo": {
      "pageTitle": "Conservancies & Maasai Horizons | 9-Day Kenya Journey",
      "pageDesc": "Move from Nairobi to community conservancies in Laikipia and the Maasai Mara, where wildlife, land stewardship, and local ownership shape the safari.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Conservancies & Maasai Horizons across Kenya for social sharing within this carefully designed cultural",
      "breadcrumbName": "Conservancies & Maasai Horizons",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Conservancies & Maasai Horizons"
        }
      ],
      "coverImage": "/images/journal/journal5.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Kenya within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Conservancies & Maasai Horizons",
      "intro": "Move from Nairobi to community conservancies in Laikipia and the Maasai Mara, where wildlife, land stewardship, and local ownership shape the safari.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Dawn to dusk"
        },
        {
          "label": "Region",
          "value": "Kenya"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Wildlife & community conservancy"
        },
        {
          "label": "Designer",
          "value": "Wanjiku Njeri"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 6,200",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Conservancies & Maasai Horizons",
      "shareText": "Move from Nairobi to community conservancies in Laikipia and the Maasai Mara, where wildlife, land stewardship, and local ownership shape the safari."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This safari is structured around conservancies rather than a checklist of national parks. After a short Nairobi orientation, the route moves to Laikipia for varied landscapes and conservation work before finishing in a private or community-linked conservancy adjoining the Maasai Mara ecosystem.",
                "Wanjiku builds each stay around the people managing the land as much as the animals moving through it. Game drives remain central, but walking, tracking, conservation conversations, and community-owned tourism help explain why wildlife still has space here."
              ],
              "image": "/images/itineraries/dummy12.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Kenya landscapes and local encounters within this carefully designed cultural",
              "imageAspectRatio": "4 / 5",
              "caption": "Nairobi → Laikipia Conservancy → Maasai Mara Conservancy",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Laikipia wildlife viewing paired with conservation and land-use context.",
                "Small-camp stays with low vehicle density where possible.",
                "Maasai Mara ecosystem experienced from a conservancy base.",
                "Community and ranger conversations integrated without staging culture for visitors."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Conservancies & Maasai Horizons",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Kenya and its cultural landscapes within this carefully designed cultural",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Conservancies & Maasai Horizons."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around wildlife & community conservancy, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Arrival & Conservation Context",
                  "bodySubtitle": "DAY 1 | NAIROBI",
                  "paragraphs": [
                    "Arrive in Nairobi and use the first day lightly, with an optional museum, gallery, or conservation-focused visit before an early night."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Private airport transfer.",
                    "Optional cultural or conservation orientation."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Editorial travel scene showing Nairobi during the Conservancies & Maasai Horizons journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Wildlife Across Working Landscapes",
                  "bodySubtitle": "DAYS 2–4 | LAIKIPIA",
                  "paragraphs": [
                    "Fly or drive to Laikipia for three nights in a conservancy where game viewing is paired with tracking, walking where permitted, and conversations about land management."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Morning and evening wildlife drives.",
                    "Conservation or ranger-led activity according to the property."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal5.webp",
                      "alt": "Editorial travel scene showing Laikipia during the Conservancies & Maasai Horizons journey within this carefully designed cultural journey"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: The Open Grassland Rhythm",
                  "bodySubtitle": "DAYS 5–8 | MAASAI MARA CONSERVANCY",
                  "paragraphs": [
                    "Continue to a conservancy in the greater Mara ecosystem for four nights, giving enough time for patient wildlife observation rather than chasing sightings across huge distances."
                  ],
                  "listItems": [
                    "Flexible dawn and late-afternoon game drives.",
                    "Community or land-stewardship conversation arranged respectfully."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/fallbacks/culture.webp",
                      "alt": "Editorial travel scene showing Maasai Mara Conservancy during the Conservancies & Maasai Horizons journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Departure & Onward Connections",
                  "bodySubtitle": "DAY 9 | NAIROBI",
                  "paragraphs": [
                    "Return to Nairobi by scheduled bush flight or road connection with international flight buffers protected."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Domestic connection timed with onward flight.",
                    "Day room arranged if a long layover requires it."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Small safari camps selected for guiding quality and land model.",
                "Internal flights used where they reduce long road transfers.",
                "Private or shared game-viewing vehicle options clarified in advance.",
                "Community visits only where locally led and genuinely wanted."
              ],
              "image": "/images/impact/impact2.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Kenya within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Neutral lightweight clothing for warm days and dusty roads.",
                "Warm layer for early-morning drives, especially at altitude.",
                "Binoculars and camera gear with dust protection.",
                "Soft-sided luggage suitable for light-aircraft restrictions."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Kenya on Conservancies & Maasai Horizons within this carefully designed cultural",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Kenya."
                },
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Editorial travel scene showing landscape detail from Kenya on Conservancies & Maasai Horizons within this carefully designed cultural",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Kenya."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Editorial travel scene showing landscape detail from Kenya on Conservancies & Maasai Horizons within this carefully designed cultural",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Kenya."
                },
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Editorial travel scene showing landscape detail from Kenya on Conservancies & Maasai Horizons within this carefully designed cultural",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Kenya."
                },
                {
                  "src": "/images/journal/journal5.webp",
                  "alt": "Editorial travel scene showing landscape detail from Kenya on Conservancies & Maasai Horizons within this carefully designed cultural",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Kenya."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": false,
              "captionPc": false
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "A good safari is not a race to the next animal. It is time spent understanding why the landscape can still hold them.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kenya within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Kenya, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy12.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kenya within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Kenya, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kenya within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Kenya, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Kenya within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Kenya, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": false
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "WILDLIFE ETHICS NOTE",
              "text": "Sightings can never be guaranteed. Drivers and guides should prioritise animal space, vehicle etiquette, and conservancy rules over crowding a sighting for a photograph."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "The Landscape Behind the Wildlife",
              "paragraphs": [
                "The route is designed to make conservation visible, not as a slogan but as land, employment, grazing decisions, ranger work, and community ownership.",
                "That context changes the meaning of every sighting because the animal is no longer separated from the system that keeps the habitat intact."
              ],
              "image": "/images/home/solo-portrait.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Kenya within this carefully designed cultural journey",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Conservancies & Maasai Horizons."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "CONSERVANCY & COMMUNITY SAFARI DESIGNER • NAIROBI, KENYA",
              "name": "Wanjiku Njeri",
              "bio": "Wanjiku designs Kenyan safaris around conservancy models, guiding quality, patient wildlife observation, and respectful community engagement rather than checklist game drives.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Wanjiku Njeri for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Conservancies & Maasai Horizons be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Wanjiku Njeri’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Sightings can never be guaranteed. Drivers and guides should prioritise animal space, vehicle etiquette, and conservancy rules over crowding a sighting for a photograph."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as dawn to dusk. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-14",
      "slug": "desert-silence-to-delta-water",
      "type": "collaborated",
      "featured": true,
      "title": "Desert Silence to Delta Water",
      "region": "Namibia & Botswana",
      "days": 12,
      "categories": [
        "nature",
        "offbeat",
        "stays"
      ],
      "tags": [
        "#NAMIBIA",
        "#OKAVANGO",
        "#WILDERNESS"
      ],
      "intro": "Cross from Namibia’s dune country to Botswana’s Okavango Delta, contrasting vast desert silence with seasonal waterways and wildlife-rich floodplains.",
      "image": "/images/journal/journal4.webp",
      "alt": "Namib dunes, Atlantic desert coast and Okavango channels forming a dramatic wilderness contrast",
      "collaborator": {
        "name": "Kabelo Motsumi",
        "role": "Delta & Desert Expedition Designer • Maun, Botswana",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A high-contrast southern African expedition linking Sossusvlei and the Namib coast with the Okavango Delta through light aircraft, desert lodges, and water-based safari."
    },
    "relatedSlugs": [
      "conservancies-and-maasai-horizons",
      "fjords-ferries-and-lofoten-light",
      "geothermal-stories-and-southern-fjords"
    ],
    "seo": {
      "pageTitle": "Desert Silence to Delta Water | 12-Day Namibia & Botswana Journey",
      "pageDesc": "Cross from Namibia’s dune country to Botswana’s Okavango Delta, contrasting vast desert silence with seasonal waterways and wildlife-rich floodplains.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Desert Silence to Delta Water across Namibia & Botswana for social sharing within this",
      "breadcrumbName": "Desert Silence to Delta Water",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Desert Silence to Delta Water"
        }
      ],
      "coverImage": "/images/home/forest-landscape.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Namibia & Botswana within this carefully designed cultural",
      "eyebrow": "Collaborated Route",
      "title": "Desert Silence to Delta Water",
      "intro": "Cross from Namibia’s dune country to Botswana’s Okavango Delta, contrasting vast desert silence with seasonal waterways and wildlife-rich floodplains.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "12 days"
        },
        {
          "label": "Pace",
          "value": "Expedition relaxed"
        },
        {
          "label": "Region",
          "value": "Namibia & Botswana"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Desert & wetland wilderness"
        },
        {
          "label": "Designer",
          "value": "Kabelo Motsumi"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 7,800",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Desert Silence to Delta Water",
      "shareText": "Cross from Namibia’s dune country to Botswana’s Okavango Delta, contrasting vast desert silence with seasonal waterways and wildlife-rich floodplains."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The journey begins with space. From Windhoek, the road reaches the Namib where dunes, gravel plains, and the clarity of desert light create days that are intentionally sparse. Swakopmund adds the Atlantic edge before the route changes countries and ecosystems.",
                "From Maun, light aircraft access takes the journey into the Okavango Delta. Water levels determine the exact balance of mokoro, boating, and game drives, making seasonal flexibility a central design feature rather than a complication."
              ],
              "image": "/images/itineraries/dummy13.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Namibia & Botswana landscapes and local encounters within this carefully",
              "imageAspectRatio": "4 / 5",
              "caption": "Windhoek → Sossusvlei → Swakopmund → Maun → Okavango Delta",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Three nights in the Namib for sunrise, desert ecology, and unhurried dune landscapes.",
                "Atlantic desert transition around Swakopmund.",
                "Scenic light-aircraft change from arid Namibia to the Okavango system.",
                "Four nights in the Delta balancing water and dry-land safari activities."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 12-day journey is paced around desert & wetland wilderness, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Arrival & Expedition Briefing",
                  "bodySubtitle": "DAY 1 | WINDHOEK",
                  "paragraphs": [
                    "Arrive in Windhoek and keep the first evening simple, using a detailed briefing to cover luggage limits, light-aircraft logistics, and seasonal conditions."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Private airport transfer.",
                    "Route and baggage briefing before remote stages."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/solo-portrait.webp",
                      "alt": "Editorial travel scene showing Windhoek during the Desert Silence to Delta Water journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Dune Light and Desert Time",
                  "bodySubtitle": "DAYS 2–4 | SOSSUSVLEI & NAMIB",
                  "paragraphs": [
                    "Travel into the Namib for three nights, giving sunrise and late-afternoon light priority while avoiding a rushed one-night photo stop."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Early Sossusvlei or Deadvlei excursion.",
                    "Desert ecology walk or drive with a specialist guide."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/journey-pc1.webp",
                      "alt": "Editorial travel scene showing Sossusvlei & Namib during the Desert Silence to Delta Water journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Where Desert Meets Atlantic",
                  "bodySubtitle": "DAYS 5–6 | SWAKOPMUND",
                  "paragraphs": [
                    "Continue to the coast for cooler air, marine influence, and the strange meeting of dunes and ocean around Swakopmund."
                  ],
                  "listItems": [
                    "Coastal or dune ecology experience.",
                    "Free time for rest between wilderness stages."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/solo-landscape.webp",
                      "alt": "Editorial travel scene showing Swakopmund during the Desert Silence to Delta Water journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Crossing Into the Delta System",
                  "bodySubtitle": "DAY 7 | MAUN",
                  "paragraphs": [
                    "Fly to Botswana and stage through Maun, keeping the day logistically light before the bush flight into the Delta."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "International and bush-flight connection management.",
                    "Luggage repack for light-aircraft limits."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Editorial travel scene showing Maun during the Desert Silence to Delta Water journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/itineraries/dummy4.webp",
                      "alt": "Editorial travel scene showing Maun during the Desert Silence to Delta Water journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Water, Islands and Wildlife",
                  "bodySubtitle": "DAYS 8–11 | OKAVANGO DELTA",
                  "paragraphs": [
                    "Fly into a Delta camp for four nights, allowing the activity mix to follow water levels and wildlife movement rather than a fixed menu."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Mokoro or boat activity when water conditions allow.",
                    "Game drives and guided walks according to camp concession rules."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact1.webp",
                      "alt": "Editorial travel scene showing Okavango Delta during the Desert Silence to Delta Water journey within this carefully designed"
                    },
                    {
                      "src": "/images/impact/impact2.webp",
                      "alt": "Editorial travel scene showing Okavango Delta during the Desert Silence to Delta Water journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 12 | MAUN",
                  "paragraphs": [
                    "Fly back to Maun with conservative onward connection timing."
                  ],
                  "listItems": [
                    "Bush-flight weather buffer.",
                    "Assistance with onward regional or international connection."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Remote desert and Delta lodges selected for location and guiding quality.",
                "Light-aircraft baggage restrictions communicated before departure.",
                "Activity mix adjusted to seasonal water and wildlife conditions.",
                "No single sighting, water activity, or scenic flight treated as guaranteed."
              ],
              "image": "/images/impact/impact3.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Namibia & Botswana within this carefully designed",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Soft-sided duffel suitable for light-aircraft baggage limits.",
                "Neutral safari clothing plus warm layers for desert and dawn drives.",
                "Strong sun protection and high-quality sunglasses.",
                "Camera equipment secured against dust and small-aircraft handling."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Desert Silence to Delta Water",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Namibia & Botswana and its cultural landscapes within this carefully",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Desert Silence to Delta Water."
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The power of this route lies in contrast: one landscape removes water, the next reorganises life around every channel.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Namibia & Botswana within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Namibia & Botswana, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy14.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Namibia & Botswana within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Namibia & Botswana, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Namibia & Botswana within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Namibia & Botswana, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Namibia & Botswana within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Namibia & Botswana, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/journey-mob1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Namibia & Botswana within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Namibia & Botswana, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Namibia & Botswana within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Namibia & Botswana, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": true,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "SEASONAL WATER NOTE",
              "text": "Okavango water levels vary by season and year, so mokoro, boating, and vehicle access differ between camps and dates. The journey should be sold around the ecosystem, not a guaranteed activity list."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "From Absence to Abundance",
              "paragraphs": [
                "Namibia teaches the eye to notice scarcity: shade, water, vegetation, distance. The Delta then reverses the logic with channels, islands, reeds, and concentrated wildlife.",
                "Together they create a journey whose meaning comes from ecological contrast rather than simply combining two famous destinations."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "DELTA & DESERT EXPEDITION DESIGNER • MAUN, BOTSWANA",
              "name": "Kabelo Motsumi",
              "bio": "Kabelo designs southern African wilderness journeys around seasonal ecology, light-aircraft logistics, responsible guiding, and the contrast between desert and wetland systems.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Kabelo Motsumi for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Desert Silence to Delta Water be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Kabelo Motsumi’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Okavango water levels vary by season and year, so mokoro, boating, and vehicle access differ between camps and dates. The journey should be sold around the ecosystem, not a guaranteed activity list."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as expedition relaxed. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-15",
      "slug": "sacred-valley-weaves-and-andean-trails",
      "type": "collaborated",
      "featured": false,
      "title": "Sacred Valley Weaves & Andean Trails",
      "region": "Peru",
      "days": 10,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#PERU",
        "#SACREDVALLEY",
        "#TEXTILES"
      ],
      "intro": "Travel through Cusco and the Sacred Valley with weaving communities, terrace landscapes, Quechua food traditions, and archaeological sites connected by slower Andean days.",
      "image": "/images/fallbacks/culture.webp",
      "alt": "Andean weaving, Sacred Valley terraces and high mountain villages beneath clear Peruvian skies",
      "collaborator": {
        "name": "Camila Huamán",
        "role": "Andean Community & Textile Journey Designer • Cusco, Peru",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A community-centred Sacred Valley journey pairing textile traditions, terraces, village life, and carefully paced archaeology with time to acclimatise around Cusco.",
      "highlights": [
        {
          "icon": "village",
          "label": "Two-night acclimatisation window in Cusco before a busier valley programme."
        },
        {
          "icon": "temple",
          "label": "Community-led textile and agricultural experiences in the Sacred Valley."
        },
        {
          "icon": "boat",
          "label": "Maras and Moray explored with landscape and farming context."
        },
        {
          "icon": "wellness",
          "label": "Ollantaytambo and Machu Picchu approached without turning the route into a spr"
        }
      ]
    },
    "relatedSlugs": [
      "oaxaca-kitchens-and-sierra-paths",
      "salt-looms-and-desert-villages",
      "valley-temples-and-annapurna-footpaths"
    ],
    "seo": {
      "pageTitle": "Sacred Valley Weaves & Andean Trails | 10-Day Peru Journey",
      "pageDesc": "Explore Cusco and the Sacred Valley through weaving communities, terraces, Quechua food traditions, and carefully paced archaeology on a 10-day journey.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Sacred Valley Weaves & Andean Trails across Peru for social sharing within this carefully",
      "breadcrumbName": "Sacred Valley Weaves & Andean Trails",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Sacred Valley Weaves & Andean Trails"
        }
      ],
      "coverImage": "/images/home/journey-pc1.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Peru within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Sacred Valley Weaves & Andean Trails",
      "intro": "Travel through Cusco and the Sacred Valley with weaving communities, terrace landscapes, Quechua food traditions, and archaeological sites connected by slower Andean days.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Acclimatised"
        },
        {
          "label": "Region",
          "value": "Peru"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Community culture & Andes"
        },
        {
          "label": "Designer",
          "value": "Camila Huamán"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 3,600",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Sacred Valley Weaves & Andean Trails",
      "shareText": "Travel through Cusco and the Sacred Valley with weaving communities, terrace landscapes, Quechua food traditions, and archaeological sites connected by slower Andean days."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The route begins with acclimatisation in Cusco before dropping into the Sacred Valley, where lower elevations, farm terraces, markets, and village communities create a more gradual relationship with the Andes. Community visits are built around real activities rather than costume performance.",
                "Camila gives textiles a central role because weaving, natural dyes, agriculture, and identity intersect throughout the valley. Archaeological sites remain important, but they are sequenced alongside living communities so the past never overwhelms the present."
              ],
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Two-night acclimatisation window in Cusco before a busier valley programme.",
                "Community-led textile and agricultural experiences in the Sacred Valley.",
                "Maras and Moray explored with landscape and farming context.",
                "Ollantaytambo and Machu Picchu approached without turning the route into a sprint."
              ]
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Peru within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Peru, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy8.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Peru within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Peru, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Peru within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Peru, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Peru within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Peru, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy11.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Peru within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Peru, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Peru within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Peru, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around community culture & andes, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Acclimatise in the Old Inca Capital",
                  "bodySubtitle": "DAYS 1–2 | CUSCO",
                  "paragraphs": [
                    "Use the first two days gently, combining rest with short walks through Cusco’s Inca stonework, colonial layers, markets, and food culture."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Short historic walk only after adequate rest.",
                    "Market or culinary introduction to Andean ingredients."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy3.webp",
                      "alt": "Editorial travel scene showing Cusco during the Sacred Valley Weaves & Andean Trails journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Terraces, Markets and River Valley",
                  "bodySubtitle": "DAYS 3–4 | PISAC & SACRED VALLEY",
                  "paragraphs": [
                    "Move into the Sacred Valley for Pisac and surrounding communities, using the lower valley to continue acclimatisation while exploring farming landscapes."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Terrace and archaeological interpretation.",
                    "Locally hosted meal or market experience."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact2.webp",
                      "alt": "Editorial travel scene showing Pisac & Sacred Valley during the Sacred Valley Weaves & Andean Trails journey within"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Salt, Agriculture and Textile Knowledge",
                  "bodySubtitle": "DAYS 5–6 | MARAS, MORAY & CHINCHERO",
                  "paragraphs": [
                    "Spend two days around Maras, Moray, and Chinchero, linking salt, experimental-looking terraces, natural dyes, and weaving traditions."
                  ],
                  "listItems": [
                    "Textile session led by a local weaving group.",
                    "Landscape interpretation around Maras and Moray."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact3.webp",
                      "alt": "Editorial travel scene showing Maras, Moray & Chinchero during the Sacred Valley Weaves & Andean Trails journey within"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Living Valley Communities",
                  "bodySubtitle": "DAYS 7–8 | HUILLOC & OLLANTAYTAMBO",
                  "paragraphs": [
                    "Base around Ollantaytambo and spend meaningful time with a community such as Huilloc when locally available, then return to the living Inca town for the evening."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Community-led agricultural or textile activity.",
                    "Evening walk through Ollantaytambo lanes."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Editorial travel scene showing Huilloc & Ollantaytambo during the Sacred Valley Weaves & Andean Trails journey within this"
                    },
                    {
                      "src": "/images/itineraries/dummy7.webp",
                      "alt": "Editorial travel scene showing Huilloc & Ollantaytambo during the Sacred Valley Weaves & Andean Trails journey within this"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: The Citadel in Context",
                  "bodySubtitle": "DAY 9 | MACHU PICCHU",
                  "paragraphs": [
                    "Travel to Machu Picchu with timed entry and an interpretive visit that connects the site to the broader valley journey rather than treating it as a detached finale."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Timed archaeological visit with specialist guide.",
                    "Rail return planned without an unnecessarily late arrival."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/impact/impact5.webp",
                      "alt": "Editorial travel scene showing Machu Picchu during the Sacred Valley Weaves & Andean Trails journey within this carefully"
                    },
                    {
                      "src": "/images/impact/impact6.webp",
                      "alt": "Editorial travel scene showing Machu Picchu during the Sacred Valley Weaves & Andean Trails journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 10 | CUSCO",
                  "paragraphs": [
                    "Return or connect onward with a quiet final day and adequate airport timing."
                  ],
                  "listItems": [
                    "Private transfer coordination.",
                    "No demanding activity on departure day."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Cusco hotel and valley lodges selected for comfort and altitude management.",
                "Community experiences arranged through local organisations or hosts.",
                "Rail and timed-entry logistics confirmed well in advance.",
                "Walking distances adapted to altitude and individual fitness."
              ],
              "image": "/images/impact/impact4.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Peru within this carefully designed cultural journey",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Warm layers for cold mornings and strong Andean sun later in the day.",
                "Comfortable walking shoes for stone streets and uneven archaeological paths.",
                "Sun protection and reusable water bottle for high-altitude dryness.",
                "Respectful clothing for community-hosted visits and ceremonies."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The valley is not an archaeological corridor. It is a living place where weaving, farming, language, and memory continue beside the ruins.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Sacred Valley Weaves & Andean Trails",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from Peru and its cultural landscapes within this carefully designed cultural",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Sacred Valley Weaves & Andean Trails."
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "ALTITUDE & COMMUNITY NOTE",
              "text": "Altitude tolerance differs greatly between travellers. Community experiences should also be booked through local hosts who control the format, timing, photography expectations, and whether a visit is appropriate at all."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "The Living Valley Beyond the Ruins",
              "paragraphs": [
                "Machu Picchu matters, but it gains depth after days spent with terraces, salt ponds, weaving groups, markets, and valley towns. The journey gives the present enough space to stand beside the past.",
                "That balance is what makes the Sacred Valley feel inhabited rather than preserved behind glass."
              ],
              "image": "/images/itineraries/dummy2.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from Peru within this carefully designed cultural journey",
              "imageAspectRatio": "4 / 5"
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "ANDEAN COMMUNITY & TEXTILE JOURNEY DESIGNER • CUSCO, PERU",
              "name": "Camila Huamán",
              "bio": "Camila designs Andean journeys around community tourism, textile knowledge, acclimatisation, and the relationship between living culture and archaeological landscapes.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Camila Huamán for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Sacred Valley Weaves & Andean Trails be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Camila Huamán’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Altitude tolerance differs greatly between travellers. Community experiences should also be booked through local hosts who control the format, timing, photography expectations, and whether a visit is appropriate at all."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as acclimatised. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-16",
      "slug": "oaxaca-kitchens-and-sierra-paths",
      "type": "collaborated",
      "featured": false,
      "title": "Oaxaca Kitchens & Sierra Paths",
      "region": "Oaxaca, Mexico",
      "days": 9,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#OAXACA",
        "#FOOD",
        "#SIERRA"
      ],
      "intro": "Move from Oaxaca City’s markets and kitchens into craft villages, Sierra Norte communities, and the Pacific coast on a food-and-landscape-led route.",
      "image": "/images/home/journey-pc.webp",
      "alt": "Oaxaca markets, woven textiles, pine mountain villages and Pacific coast glowing in warm light",
      "collaborator": {
        "name": "Ximena Santiago",
        "role": "Oaxaca Food, Craft & Mountain Curator • Oaxaca, Mexico",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A Oaxaca journey where markets, mezcal country, weaving villages, community mountain tourism, and the Pacific coast connect through food and local stewardship.",
      "highlights": [
        {
          "icon": "village",
          "label": "Oaxaca City markets, kitchens, and neighbourhood food traditions."
        },
        {
          "icon": "temple",
          "label": "Central Valley craft villages visited through working studios rather than souv"
        },
        {
          "icon": "boat",
          "label": "Community-managed walking and forest experiences in the Sierra Norte."
        },
        {
          "icon": "wellness",
          "label": "A final Pacific coast pause shaped around ecology and local food."
        }
      ]
    },
    "relatedSlugs": [
      "sacred-valley-weaves-and-andean-trails",
      "salt-looms-and-desert-villages",
      "northern-stories-and-knuckles-green"
    ],
    "seo": {
      "pageTitle": "Oaxaca Kitchens & Sierra Paths | 9-Day Oaxaca, Mexico Journey",
      "pageDesc": "Move from Oaxaca City’s markets and kitchens into craft villages, Sierra Norte communities, and the Pacific coast on a food-and-landscape-led route.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Oaxaca Kitchens & Sierra Paths across Oaxaca, Mexico for social sharing within this carefully",
      "breadcrumbName": "Oaxaca Kitchens & Sierra Paths",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Oaxaca Kitchens & Sierra Paths"
        }
      ],
      "coverImage": "/images/home/travel-video.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of Oaxaca, Mexico within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Oaxaca Kitchens & Sierra Paths",
      "intro": "Move from Oaxaca City’s markets and kitchens into craft villages, Sierra Norte communities, and the Pacific coast on a food-and-landscape-led route.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "9 days"
        },
        {
          "label": "Pace",
          "value": "Immersive"
        },
        {
          "label": "Region",
          "value": "Oaxaca, Mexico"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Food, craft & mountain community"
        },
        {
          "label": "Designer",
          "value": "Ximena Santiago"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 2,950",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Oaxaca Kitchens & Sierra Paths",
      "shareText": "Move from Oaxaca City’s markets and kitchens into craft villages, Sierra Norte communities, and the Pacific coast on a food-and-landscape-led route."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Oaxaca City begins with food because markets, maize, chocolate, chillies, mezcal, and regional cooking provide a vocabulary for everything that follows. Craft villages in the Central Valleys then reveal how material traditions remain tied to family workshops and local economies.",
                "The second half climbs into the Sierra Norte for community-managed mountain experiences before descending toward the Pacific. The changing ecosystems keep the route varied without forcing too many one-night stops."
              ],
              "image": "/images/home/forest-portrait.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of Oaxaca, Mexico landscapes and local encounters within this carefully designed",
              "imageAspectRatio": "4 / 5",
              "caption": "Oaxaca City → Central Valleys → Sierra Norte → Pacific Coast"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 9-day journey is paced around food, craft & mountain community, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Markets, Maize and Mezcal Context",
                  "bodySubtitle": "DAYS 1–2 | OAXACA CITY",
                  "paragraphs": [
                    "Settle into Oaxaca City with market walks, a cooking or food session, and neighbourhood exploration before visiting producers outside the city."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Market breakfast and ingredient-focused walk.",
                    "Evening mezcal tasting with production context."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy6.webp",
                      "alt": "Editorial travel scene showing Oaxaca City during the Oaxaca Kitchens & Sierra Paths journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Workshops and Village Roads",
                  "bodySubtitle": "DAYS 3–4 | CENTRAL VALLEYS",
                  "paragraphs": [
                    "Spend two days in selected valleys for weaving, pottery, woodcarving, or mezcal visits chosen for quality and host relationships rather than quantity."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Studio visit with a working artisan family.",
                    "Field or palenque visit explaining agave and mezcal production."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/impact/impact6.webp",
                      "alt": "Editorial travel scene showing Central Valleys during the Oaxaca Kitchens & Sierra Paths journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Community Forests and High Villages",
                  "bodySubtitle": "DAYS 5–6 | SIERRA NORTE",
                  "paragraphs": [
                    "Travel into a Sierra Norte community for forest walks, mountain air, and locally managed lodging or guiding, keeping activities appropriate to weather and elevation."
                  ],
                  "listItems": [
                    "Community-guided forest walk.",
                    "Local meal and conversation about community tourism."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal1.webp",
                      "alt": "Editorial travel scene showing Sierra Norte during the Oaxaca Kitchens & Sierra Paths journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: From Pine Forest to Warm Pacific",
                  "bodySubtitle": "DAYS 7–8 | PACIFIC COAST",
                  "paragraphs": [
                    "Descend toward the coast for two nights of slower beach, lagoon, or mangrove experiences chosen according to location and season."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Coastal ecology or lagoon outing where appropriate.",
                    "Seafood-focused meal with local sourcing."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Editorial travel scene showing Pacific Coast during the Oaxaca Kitchens & Sierra Paths journey within this carefully designed"
                    },
                    {
                      "src": "/images/itineraries/dummy10.webp",
                      "alt": "Editorial travel scene showing Pacific Coast during the Oaxaca Kitchens & Sierra Paths journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Departure & Onward Connections",
                  "bodySubtitle": "DAY 9 | OAXACA REGION",
                  "paragraphs": [
                    "Use the final day for the most practical airport connection, protecting road-time buffers from the coast."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Private transfer or domestic connection.",
                    "No fixed final excursion before travel."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Boutique city hotel, community mountain stay, and simple coastal property mix.",
                "Artisan and food visits arranged with working producers.",
                "Private transfers for mountain and coast stages.",
                "Community tourism activities booked through local host organisations."
              ],
              "image": "/images/impact/impact5.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from Oaxaca, Mexico within this carefully designed cultural",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Light city clothing plus warmer layers for Sierra evenings.",
                "Walking shoes with grip for forest and village paths.",
                "Sun protection and insect repellent for coastal environments.",
                "Reusable tote or packing space for responsibly purchased craft."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/home/solo-landscape.webp",
                  "alt": "Editorial travel scene showing landscape detail from Oaxaca, Mexico on Oaxaca Kitchens & Sierra Paths within this carefully",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of Oaxaca, Mexico."
                },
                {
                  "src": "/images/home/travel-video.webp",
                  "alt": "Editorial travel scene showing landscape detail from Oaxaca, Mexico on Oaxaca Kitchens & Sierra Paths within this carefully",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of Oaxaca, Mexico."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing landscape detail from Oaxaca, Mexico on Oaxaca Kitchens & Sierra Paths within this carefully",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of Oaxaca, Mexico."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Editorial travel scene showing landscape detail from Oaxaca, Mexico on Oaxaca Kitchens & Sierra Paths within this carefully",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of Oaxaca, Mexico."
                },
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing landscape detail from Oaxaca, Mexico on Oaxaca Kitchens & Sierra Paths within this carefully",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of Oaxaca, Mexico."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": true,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Oaxaca makes more sense when food is treated as geography: maize, agave, smoke, forest, coast, and the hands that connect them.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Oaxaca, Mexico within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Oaxaca, Mexico, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/solo-portrait.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Oaxaca, Mexico within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from Oaxaca, Mexico, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/journey-pc.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Oaxaca, Mexico within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Oaxaca, Mexico, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/home/journey-pc1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in Oaxaca, Mexico within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from Oaxaca, Mexico, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": true,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "COMMUNITY & FOOD NOTE",
              "text": "Cooking sessions, mezcal visits, and mountain experiences should remain small and host-led. Avoid presenting sacred or community traditions as entertainment, and ask before photographing people at work."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "A State Read Through Ingredients and Hands",
              "paragraphs": [
                "Oaxaca’s scale is the surprise. City markets, dry valleys, pine forest, and humid coast can all belong to one state, yet each requires a different pace.",
                "Food and craft provide the connective tissue because they carry landscape into daily practice."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "OAXACA FOOD, CRAFT & MOUNTAIN CURATOR • OAXACA, MEXICO",
              "name": "Ximena Santiago",
              "bio": "Ximena builds Oaxaca journeys through food systems, craft workshops, community-managed mountain tourism, and ecological transitions, with local hosts controlling the experience.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Ximena Santiago for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Oaxaca Kitchens & Sierra Paths be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Ximena Santiago’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Cooking sessions, mezcal visits, and mountain experiences should remain small and host-led. Avoid presenting sacred or community traditions as entertainment, and ask before photographing people at work."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as immersive. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-17",
      "slug": "pueblo-skies-and-desert-modernism",
      "type": "collaborated",
      "featured": false,
      "title": "Pueblo Skies & Desert Modernism",
      "region": "New Mexico & Arizona, USA",
      "days": 10,
      "categories": [
        "culture",
        "nature",
        "offbeat"
      ],
      "tags": [
        "#SOUTHWEST",
        "#PUEBLO",
        "#DESERT"
      ],
      "intro": "Travel from Santa Fe and Taos through Pueblo cultural institutions and desert landscapes before crossing toward canyon country in the American Southwest.",
      "image": "/images/home/solo-landscape.webp",
      "alt": "Adobe towns, high desert mesas and canyon country beneath expansive New Mexico and Arizona skies",
      "collaborator": {
        "name": "Elena Chavez",
        "role": "Southwest Arts & Desert Architecture Curator • Santa Fe, New Mexico",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A Southwest journey combining adobe architecture, Indigenous-led cultural institutions, contemporary art, dark skies, and canyon landscapes with careful visitor etiquette."
    },
    "relatedSlugs": [
      "salt-looms-and-desert-villages",
      "medinas-atlas-and-earthen-kasbahs",
      "hebridean-roads-and-highland-memory"
    ],
    "seo": {
      "pageTitle": "Pueblo Skies & Desert Modernism | 10-Day Southwest Journey",
      "pageDesc": "Travel from Santa Fe and Taos through Pueblo cultural institutions and desert landscapes before crossing toward canyon country in the American Southwest.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Pueblo Skies & Desert Modernism across New Mexico & Arizona, USA for social sharing",
      "breadcrumbName": "Pueblo Skies & Desert Modernism",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Pueblo Skies & Desert Modernism"
        }
      ],
      "coverImage": "/images/impact/impact2.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of New Mexico & Arizona, USA within this carefully",
      "eyebrow": "Collaborated Route",
      "title": "Pueblo Skies & Desert Modernism",
      "intro": "Travel from Santa Fe and Taos through Pueblo cultural institutions and desert landscapes before crossing toward canyon country in the American Southwest.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "10 days"
        },
        {
          "label": "Pace",
          "value": "Open-road"
        },
        {
          "label": "Region",
          "value": "New Mexico & Arizona, USA"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Architecture, art & desert culture"
        },
        {
          "label": "Designer",
          "value": "Elena Chavez"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 4,800",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Pueblo Skies & Desert Modernism",
      "shareText": "Travel from Santa Fe and Taos through Pueblo cultural institutions and desert landscapes before crossing toward canyon country in the American Southwest."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This journey treats the American Southwest as a living cultural region, not a cinematic backdrop. Santa Fe and Taos introduce adobe architecture, contemporary art, and high-desert history before Indigenous-led institutions provide essential context for Pueblo cultures.",
                "The route then moves west toward canyon and Navajo Nation landscapes. Access, photography, and guiding are always determined by local rules and community operators, so the itinerary is designed with alternatives rather than assumptions of unrestricted entry."
              ],
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Santa Fe adobe architecture, art, and high-desert food culture.",
                "Taos landscape and locally interpreted historic context.",
                "Indigenous-led cultural institutions in New Mexico.",
                "Canyon country experienced with authorised local guiding where required."
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 10-day journey is paced around architecture, art & desert culture, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Adobe, Art and High Desert Light",
                  "bodySubtitle": "DAYS 1–3 | SANTA FE",
                  "paragraphs": [
                    "Begin in Santa Fe with architecture, museums, contemporary art, and food, using the city to distinguish regional design from generic Southwest styling."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Architecture walk through historic and contemporary adobe forms.",
                    "Curated museum or gallery visit focused on regional artists."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy9.webp",
                      "alt": "Editorial travel scene showing Santa Fe during the Pueblo Skies & Desert Modernism journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Mesa, Mountain and Local History",
                  "bodySubtitle": "DAYS 4–5 | TAOS",
                  "paragraphs": [
                    "Continue to Taos for high-desert landscapes, art history, and cultural context, respecting community access rules at all times."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Landscape and art-focused day around Taos.",
                    "Locally guided cultural visit only where explicitly open to visitors."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/journal/journal4.webp",
                      "alt": "Editorial travel scene showing Taos during the Pueblo Skies & Desert Modernism journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Pueblo Cultural Context",
                  "bodySubtitle": "DAY 6 | ALBUQUERQUE",
                  "paragraphs": [
                    "Travel south for a day centred on Indigenous-led cultural interpretation, ideally through established institutions that present history and contemporary life on their own terms."
                  ],
                  "listItems": [
                    "Visit the Indian Pueblo Cultural Center or comparable institution.",
                    "Regional food experience led by local businesses."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal5.webp",
                      "alt": "Editorial travel scene showing Albuquerque during the Pueblo Skies & Desert Modernism journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Canyon Country With Local Guidance",
                  "bodySubtitle": "DAYS 7–8 | CANYON DE CHELLY REGION",
                  "paragraphs": [
                    "Move west toward canyon landscapes, using authorised local guiding where required and treating access as community-controlled rather than assumed."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Guided canyon experience according to current local rules.",
                    "Sunset or evening landscape observation from public viewpoints."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Editorial travel scene showing Canyon de Chelly Region during the Pueblo Skies & Desert Modernism journey within this"
                    },
                    {
                      "src": "/images/itineraries/dummy13.webp",
                      "alt": "Editorial travel scene showing Canyon de Chelly Region during the Pueblo Skies & Desert Modernism journey within this"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: The Wide Desert Frame",
                  "bodySubtitle": "DAY 9 | MONUMENT VALLEY REGION",
                  "paragraphs": [
                    "Continue into the Monument Valley region for one spacious day focused on geology, road scale, and locally guided access where appropriate."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Local guide option for permitted areas.",
                    "Dark-sky evening if weather and lodging location allow."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/forest-landscape.webp",
                      "alt": "Editorial travel scene showing Monument Valley Region during the Pueblo Skies & Desert Modernism journey within this carefully"
                    },
                    {
                      "src": "/images/home/journey-pc.webp",
                      "alt": "Editorial travel scene showing Monument Valley Region during the Pueblo Skies & Desert Modernism journey within this carefully"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 10 | SOUTHWEST HUB",
                  "paragraphs": [
                    "Depart through the most practical regional airport with a conservative road buffer."
                  ],
                  "listItems": [
                    "Private transfer or one-way vehicle coordination.",
                    "No fixed activity before the airport drive."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Design-led city stays and carefully chosen desert lodging.",
                "Vehicle route built around realistic Southwest distances.",
                "Cultural access only through open, authorised, or Indigenous-led channels.",
                "Dark-sky plans treated as weather-dependent rather than guaranteed."
              ],
              "image": "/images/impact/impact6.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from New Mexico & Arizona, USA within this",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Layered clothing for large high-desert temperature swings.",
                "Strong sun protection and a refillable water bottle.",
                "Comfortable shoes for museums, towns, and rocky viewpoints.",
                "Respectful photography habits in Indigenous communities and sacred landscapes."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Pueblo Skies & Desert Modernism",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from New Mexico & Arizona, USA and its cultural landscapes within",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Pueblo Skies & Desert Modernism."
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The Southwest is not empty land. It is layered with nations, histories, architecture, art, and rules about who gets to tell the story.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/home/solo-landscape.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Mexico & Arizona, USA within this carefully designed",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from New Mexico & Arizona, USA, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy2.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Mexico & Arizona, USA within this carefully designed",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from New Mexico & Arizona, USA, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Mexico & Arizona, USA within this carefully designed",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from New Mexico & Arizona, USA, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Mexico & Arizona, USA within this carefully designed",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from New Mexico & Arizona, USA, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy5.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Mexico & Arizona, USA within this carefully designed",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from New Mexico & Arizona, USA, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Mexico & Arizona, USA within this carefully designed",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from New Mexico & Arizona, USA, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "INDIGENOUS ACCESS NOTE",
              "text": "Pueblos and tribal lands are sovereign communities with their own visitor, photography, and closure rules. Access must be checked directly and never assumed because a place appears on a map or social feed."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Learning to See Beyond the Western Myth",
              "paragraphs": [
                "Adobe walls, museums, mesas, and canyon roads become more meaningful once the route acknowledges whose land and cultural history shape the region.",
                "The strongest version of this journey is therefore less about “discovering” the Southwest and more about learning how to visit it with attention."
              ],
              "image": "/images/itineraries/dummy4.webp",
              "imageAlt": "Editorial travel scene showing a final reflective travel moment from New Mexico & Arizona, USA within this carefully",
              "imageAspectRatio": "4 / 5",
              "caption": "A final visual note from Pueblo Skies & Desert Modernism."
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "SOUTHWEST ARTS & DESERT ARCHITECTURE CURATOR • SANTA FE, NEW MEXICO",
              "name": "Elena Chavez",
              "bio": "Elena curates Southwest journeys around architecture, art, Indigenous-led interpretation, dark-sky landscapes, and responsible access rather than frontier mythology.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Elena Chavez for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Pueblo Skies & Desert Modernism be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Elena Chavez’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Pueblos and tribal lands are sovereign communities with their own visitor, photography, and closure rules. Access must be checked directly and never assumed because a place appears on a map or social feed."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as open-road. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "col-18",
      "slug": "geothermal-stories-and-southern-fjords",
      "type": "collaborated",
      "featured": true,
      "title": "Geothermal Stories & Southern Fjords",
      "region": "New Zealand",
      "days": 12,
      "categories": [
        "nature",
        "culture",
        "stays"
      ],
      "tags": [
        "#AOTEAROA",
        "#MAORI",
        "#FIORDLAND"
      ],
      "intro": "Link Rotorua’s geothermal and Māori cultural landscapes with Queenstown, Fiordland, and Aoraki Mackenzie on a cross-island journey shaped by conservation.",
      "image": "/images/impact/impact1.webp",
      "alt": "Rotorua geothermal steam, alpine lakes and Fiordland valleys beneath clear New Zealand light",
      "collaborator": {
        "name": "Maia Te Rangi",
        "role": "Aotearoa Cultural & Conservation Journey Designer • Rotorua, New Zealand",
        "avatar": "/images/testimonials/avatar.webp"
      },
      "featuredDescription": "A New Zealand journey connecting Māori-led cultural experiences in Rotorua with South Island lakes, Fiordland, alpine landscapes, and conservation-focused guiding.",
      "highlights": [
        {
          "icon": "village",
          "label": "Māori-led cultural and geothermal experiences around Rotorua."
        },
        {
          "icon": "temple",
          "label": "South Island transition through Queenstown without over-programming adventure "
        },
        {
          "icon": "boat",
          "label": "Three nights in Fiordland for water, forest, and weather-dependent exploration"
        },
        {
          "icon": "wellness",
          "label": "Aoraki Mackenzie landscapes with conservation and dark-sky context."
        }
      ]
    },
    "relatedSlugs": [
      "fjords-ferries-and-lofoten-light",
      "desert-silence-to-delta-water",
      "conservancies-and-maasai-horizons"
    ],
    "seo": {
      "pageTitle": "Geothermal Stories & Southern Fjords | 12-Day New Zealand Journey",
      "pageDesc": "Link Rotorua’s geothermal and Māori cultural landscapes with Queenstown, Fiordland, and Aoraki Mackenzie on a cross-island journey shaped by conservation.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Editorial travel scene showing Geothermal Stories & Southern Fjords across New Zealand for social sharing within this carefully",
      "breadcrumbName": "Geothermal Stories & Southern Fjords",
      "publishDate": "2026-02-01"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Geothermal Stories & Southern Fjords"
        }
      ],
      "coverImage": "/images/impact/impact4.webp",
      "coverAlt": "Editorial travel scene showing the landscapes and cultural atmosphere of New Zealand within this carefully designed cultural journey",
      "eyebrow": "Collaborated Route",
      "title": "Geothermal Stories & Southern Fjords",
      "intro": "Link Rotorua’s geothermal and Māori cultural landscapes with Queenstown, Fiordland, and Aoraki Mackenzie on a cross-island journey shaped by conservation.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "12 days"
        },
        {
          "label": "Pace",
          "value": "Balanced"
        },
        {
          "label": "Region",
          "value": "New Zealand"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Culture, geology & conservation"
        },
        {
          "label": "Designer",
          "value": "Maia Te Rangi"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "ESTIMATED BUDGET",
      "price": "From USD 6,100",
      "priceUnit": "per person",
      "ctaTitle": "Want this collaboration shaped around you?",
      "ctaSubtitle": "Every route is a starting point. We can adjust pace, stays, and specialist experiences around your dates and interests.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "partnerEyebrow": "FOR TRAVEL PARTNERS",
      "consultLabel": "Consult With Me",
      "consultTo": "/planYourJourney",
      "phone": "+91 99433 60478",
      "whatsapp": "919943360478",
      "email": "sreejith@sreejithtravel.com",
      "shareTitle": "Geothermal Stories & Southern Fjords",
      "shareText": "Link Rotorua’s geothermal and Māori cultural landscapes with Queenstown, Fiordland, and Aoraki Mackenzie on a cross-island journey shaped by conservation."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The route begins in Rotorua because geology and Māori cultural interpretation belong together here. Geothermal landscapes are experienced through places and operators that can explain the stories, land relationships, and contemporary community context rather than offering scenery alone.",
                "A domestic flight then changes scale dramatically for the South Island. Queenstown is used as a gateway rather than the centrepiece, with longer stays in Fiordland and the Aoraki Mackenzie region to focus on water, alpine ecology, and conservation."
              ],
              "image": "/images/home/journey-mob1.webp",
              "imageAlt": "Editorial travel scene showing an editorial portrait of New Zealand landscapes and local encounters within this carefully designed",
              "imageAspectRatio": "4 / 5",
              "caption": "Rotorua → Queenstown → Fiordland → Aoraki Mackenzie → Christchurch",
              "highlightsTitle": "Highlights of the Journey",
              "highlights": [
                "Māori-led cultural and geothermal experiences around Rotorua.",
                "South Island transition through Queenstown without over-programming adventure activities.",
                "Three nights in Fiordland for water, forest, and weather-dependent exploration.",
                "Aoraki Mackenzie landscapes with conservation and dark-sky context."
              ]
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "FIELD DISPATCH",
              "title": "Field Notes: Geothermal Stories & Southern Fjords",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Editorial travel scene showing moving travel impressions from New Zealand and its cultural landscapes within this carefully designed",
                "width": 800,
                "height": 450
              },
              "caption": "A moving editorial glimpse selected to complement the pace and atmosphere of Geothermal Stories & Southern Fjords."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "This 12-day journey is paced around culture, geology & conservation, realistic transfers, and enough time in each region for the place to develop beyond first impressions."
              ],
              "title": "Detailed Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Phase 01: Geothermal Land and Living Culture",
                  "bodySubtitle": "DAYS 1–3 | ROTORUA",
                  "paragraphs": [
                    "Spend three days in Rotorua combining geothermal landscapes with Māori-led cultural interpretation, food, and contemporary community context."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Guided geothermal experience with cultural interpretation.",
                    "Māori-led evening or daytime programme selected for depth and host ownership."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/itineraries/dummy12.webp",
                      "alt": "Editorial travel scene showing Rotorua during the Geothermal Stories & Southern Fjords journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Phase 02: Lakes, Ranges and Southern Arrival",
                  "bodySubtitle": "DAYS 4–5 | QUEENSTOWN",
                  "paragraphs": [
                    "Fly south and settle around Queenstown for lake landscapes, local food, and a gentle introduction to the Southern Alps without filling every hour with adrenaline activities."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Scenic lake or valley outing.",
                    "Food-focused evening featuring South Island produce."
                  ],
                  "imageOrientation": "square",
                  "imageLayout": "side-by-side",
                  "images": [
                    {
                      "src": "/images/home/journey-pc.webp",
                      "alt": "Editorial travel scene showing Queenstown during the Geothermal Stories & Southern Fjords journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Phase 03: Water, Rainforest and Deep Valleys",
                  "bodySubtitle": "DAYS 6–8 | FIORDLAND",
                  "paragraphs": [
                    "Base for three nights near Fiordland, allowing cruise, walk, or kayak choices to follow weather and water conditions rather than a single fixed plan."
                  ],
                  "listItems": [
                    "Fiord excursion selected according to conditions.",
                    "Guided forest or shoreline walk with conservation context."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/journey-pc1.webp",
                      "alt": "Editorial travel scene showing Fiordland during the Geothermal Stories & Southern Fjords journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Phase 04: Alpine Space and Night Sky",
                  "bodySubtitle": "DAYS 9–10 | AORAKI MACKENZIE",
                  "paragraphs": [
                    "Travel toward Aoraki Mackenzie for two nights of alpine landscape, glacial history, and optional dark-sky observation when weather allows."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Short alpine walk adapted to conditions.",
                    "Dark-sky session or observatory experience if available."
                  ],
                  "imageOrientation": "portrait",
                  "images": [
                    {
                      "src": "/images/home/forest-portrait.webp",
                      "alt": "Editorial travel scene showing Aoraki Mackenzie during the Geothermal Stories & Southern Fjords journey within this carefully designed"
                    },
                    {
                      "src": "/images/home/journey-mob.webp",
                      "alt": "Editorial travel scene showing Aoraki Mackenzie during the Geothermal Stories & Southern Fjords journey within this carefully designed"
                    }
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Phase 05: Garden City Landing",
                  "bodySubtitle": "DAY 11 | CHRISTCHURCH",
                  "paragraphs": [
                    "Continue to Christchurch for a final, calmer day of food, design, or urban regeneration before departure."
                  ],
                  "listTitle": "Selected Encounters",
                  "listItems": [
                    "Flexible city walk or design-focused visit.",
                    "Final dinner with regional produce."
                  ],
                  "imageOrientation": "landscape",
                  "imageLayout": "block",
                  "images": [
                    {
                      "src": "/images/home/travel-video.webp",
                      "alt": "Editorial travel scene showing Christchurch during the Geothermal Stories & Southern Fjords journey within this carefully designed cultural"
                    },
                    {
                      "src": "/images/impact/impact1.webp",
                      "alt": "Editorial travel scene showing Christchurch during the Geothermal Stories & Southern Fjords journey within this carefully designed cultural"
                    }
                  ]
                },
                {
                  "id": "phase-06",
                  "headerTitle": "Phase 06: Departure & Onward Connections",
                  "bodySubtitle": "DAY 12 | CHRISTCHURCH",
                  "paragraphs": [
                    "Transfer to the airport with no major activity fixed before the international journey."
                  ],
                  "listItems": [
                    "Private airport transfer.",
                    "Departure timing protected from long overland drives."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Journey Logistics & Stay Standards",
              "items": [
                "Culturally led experiences booked with host-owned or community-accountable operators.",
                "Domestic flight used to avoid an impractical cross-island road marathon.",
                "Fiordland activities selected according to live weather conditions.",
                "Alpine and dark-sky experiences kept flexible and never guaranteed."
              ],
              "image": "/images/journal/journal1.webp",
              "imageAlt": "Editorial travel scene showing a representative lodging and landscape detail from New Zealand within this carefully designed cultural",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Suggested Packing & Preparation",
              "items": [
                "Waterproof shell and warm layers for Fiordland and alpine regions.",
                "Comfortable walking shoes for geothermal and mountain paths.",
                "Sun protection for strong ultraviolet exposure.",
                "Small daypack for variable weather and layered clothing."
              ]
            }
          },
          {
            "type": "slider",
            "data": {
              "eyebrow": "ROUTE IN FRAMES",
              "title": "Selected Landscapes & Stays",
              "images": [
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Editorial travel scene showing landscape detail from New Zealand on Geothermal Stories & Southern Fjords within this carefully",
                  "caption": "Visual field note 1 from the landscapes and cultural atmosphere of New Zealand."
                },
                {
                  "src": "/images/impact/impact6.webp",
                  "alt": "Editorial travel scene showing landscape detail from New Zealand on Geothermal Stories & Southern Fjords within this carefully",
                  "caption": "Visual field note 2 from the landscapes and cultural atmosphere of New Zealand."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Editorial travel scene showing landscape detail from New Zealand on Geothermal Stories & Southern Fjords within this carefully",
                  "caption": "Visual field note 3 from the landscapes and cultural atmosphere of New Zealand."
                },
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Editorial travel scene showing landscape detail from New Zealand on Geothermal Stories & Southern Fjords within this carefully",
                  "caption": "Visual field note 4 from the landscapes and cultural atmosphere of New Zealand."
                },
                {
                  "src": "/images/journal/journal3.webp",
                  "alt": "Editorial travel scene showing landscape detail from New Zealand on Geothermal Stories & Southern Fjords within this carefully",
                  "caption": "Visual field note 5 from the landscapes and cultural atmosphere of New Zealand."
                }
              ],
              "width": 1200,
              "height": 800,
              "autoplay": false,
              "interval": 5000,
              "captionMob": true,
              "captionPc": true
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Aotearoa becomes clearer when geology, culture, and conservation are allowed to speak together instead of competing for attention.",
              "author": "THE COLLABORATOR'S NOTEBOOK"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "VISUAL NOTES",
              "title": "Moments Along the Route",
              "images": [
                {
                  "src": "/images/impact/impact3.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Zealand within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from New Zealand, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/itineraries/dummy4.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Zealand within this carefully designed cultural journey",
                  "width": 800,
                  "height": 1050,
                  "caption": "Visual note from New Zealand, chosen to support the journey’s editorial atmosphere."
                },
                {
                  "src": "/images/impact/impact5.webp",
                  "alt": "Editorial travel scene showing cultural and landscape moment in New Zealand within this carefully designed cultural journey",
                  "width": 1200,
                  "height": 800,
                  "caption": "Visual note from New Zealand, chosen to support the journey’s editorial atmosphere."
                }
              ],
              "captionMob": true,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "WEATHER & CULTURAL HOSTING NOTE",
              "text": "Fiordland weather can change rapidly, and cultural experiences should be chosen for host ownership and depth rather than spectacle. The route should remain flexible enough to respect both."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "From Steam to Fjord Water",
              "paragraphs": [
                "Rotorua and Fiordland seem like opposite landscapes, yet both show how water and geology shape culture, movement, and conservation.",
                "The cross-island structure works because each region is given enough time to establish its own voice before the next dramatic landscape arrives."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "AOTEAROA CULTURAL & CONSERVATION JOURNEY DESIGNER • ROTORUA, NEW ZEALAND",
              "name": "Maia Te Rangi",
              "bio": "Maia designs Aotearoa journeys around culturally led interpretation, geology, conservation, and weather-aware wilderness travel, connecting the North and South Islands without rushing either.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Portrait placeholder representing collaborator Maia Te Rangi for this curated travel itinerary"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can Geothermal Stories & Southern Fjords be tailored to our dates and interests?",
                  "paragraphs": [
                    "Yes. Maia Te Rangi’s route is a design framework rather than a fixed group departure. Stays, activity intensity, and specialist visits can be adjusted while protecting the geographic logic of the journey."
                  ],
                  "listTitle": "Common ways to personalise the route:",
                  "listItems": [
                    "Add or remove a night at the most important base.",
                    "Reduce walking or replace it with a lower-intensity alternative.",
                    "Add a specialist food, craft, wildlife, or photography focus where locally appropriate."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "What is the best season for this journey?",
                  "paragraphs": [
                    "Fiordland weather can change rapidly, and cultural experiences should be chosen for host ownership and depth rather than spectacle. The route should remain flexible enough to respect both."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "What is included in the estimated journey budget?",
                  "listTitle": "Typical inclusions include:",
                  "listItems": [
                    "Handpicked accommodation described in the final confirmed proposal.",
                    "Private or pre-arranged ground transfers listed in the route.",
                    "Specialist guiding and scheduled cultural or nature experiences.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "How physically demanding is the itinerary?",
                  "paragraphs": [
                    "The default pace is described as balanced. Walking, altitude, wildlife activity, or outdoor intensity varies by region, so the final version should be adjusted to the traveller’s fitness, health, and comfort."
                  ],
                  "listItems": [
                    "Alternative or shorter activity options are used where practical.",
                    "Weather and local conditions can change the day plan."
                  ]
                },
                {
                  "id": "faq-05",
                  "question": "How far in advance should we plan?",
                  "paragraphs": [
                    "For small lodges, specialist guides, rail or ferry seats, light-aircraft sectors, or permit-sensitive experiences, planning several months ahead gives the best flexibility. The exact lead time depends on season and destination."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How are reservations confirmed and scheduled?",
                  "paragraphs": [
                    "Once the final route, accommodation, and specialist experiences are approved, a 30% confirmation deposit is used to secure services. The remaining balance is normally due 45 days before arrival unless a supplier requires different terms."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What is the policy for date changes or cancellations?",
                  "paragraphs": [
                    "We try to shift dates or restructure the route whenever suppliers allow, but remote lodges, permits, flights, ferries, and specialist appointments may carry their own non-refundable conditions."
                  ],
                  "listItems": [
                    "60+ days before arrival: refund or credit is calculated after non-refundable supplier costs.",
                    "30–59 days before arrival: partial refund or rescheduling credit depends on confirmed supplier terms.",
                    "Less than 30 days before arrival: cancellation follows the individual confirmed service conditions."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },

  // ==========================================
  // TIER 3: ESSENTIAL / TRAVEL YOUR WAY ROUTES
  // ==========================================

  {
    "meta": {
      "id": "ess-1",
      "slug": "periyar-spice-hills-and-lake-trails",
      "type": "essential",
      "featured": true,
      "title": "Periyar Spice Hills & Lake Trails",
      "region": "Kerala",
      "days": 5,
      "categories": [
        "nature",
        "culture",
        "wellness"
      ],
      "tags": [
        "#PERIYAR",
        "#SPICEHILLS",
        "#LAKETRAILS"
      ],
      "intro": "A practical five-day Periyar escape pairing spice-country walks, forest-edge experiences, lake time, and relaxed plantation stays.",
      "image": "/images/impact/impact1.webp",
      "alt": "Forest road winding through green spice hills near Periyar in Kerala",
      "featuredDescription": "A dependable 5-day route focused on nature & spice country, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "boat",
          "label": "Periyar lake excursion"
        },
        {
          "icon": "village",
          "label": "Spice plantation walks"
        },
        {
          "icon": "wellness",
          "label": "Slow highland stays"
        },
        {
          "icon": "temple",
          "label": "Local market and food stops"
        }
      ],
      "collaborator": {
        "name": "Periyar Highlands Network",
        "role": "Regional Nature & Spice Partner",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "munnar-tea-country-escape",
      "wayanad-forest-and-plantation-break",
      "varkala-coast-and-wellness-retreat"
    ],
    "seo": {
      "pageTitle": "Periyar Spice Hills & Lake Trails — 5-Day Essential Itinerary",
      "pageDesc": "A practical five-day Periyar escape pairing spice-country walks, forest-edge experiences, lake time, and relaxed plantation stays.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Forest road winding through green spice hills near Periyar in Kerala",
      "breadcrumbName": "Periyar Spice Hills & Lake Trails",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Periyar Spice Hills & Lake Trails"
        }
      ],
      "coverImage": "/images/impact/impact1.webp",
      "coverAlt": "Forest road winding through green spice hills near Periyar in Kerala",
      "eyebrow": "Essential Blueprint",
      "title": "Periyar Spice Hills & Lake Trails",
      "intro": "A practical five-day Periyar escape pairing spice-country walks, forest-edge experiences, lake time, and relaxed plantation stays.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Nature & spice country"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 540",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Periyar Spice Hills & Lake Trails",
      "shareText": "A practical five-day Periyar escape pairing spice-country walks, forest-edge experiences, lake time, and relaxed plantation stays."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Use Thekkady as the base and keep transfers short. The route mixes easy nature time with plantation visits, local food, and free evenings."
              ],
              "caption": "Thekkady → Periyar → Kumily → Spice Estates",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Periyar lake excursion",
                "Spice plantation walks",
                "Slow highland stays",
                "Local market and food stops"
              ],
              "image": "/images/itineraries/dummy1.webp",
              "imageAlt": "Traveller view representing the periyar spice hills & lake trails journey across Kerala",
              "imageAspectRatio": "4 / 5"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Arrival & Settle In",
                  "bodySubtitle": "DAY 1 | THEKKADY",
                  "listItems": [
                    "Private transfer to Thekkady.",
                    "Check in near the forest edge.",
                    "Evening walk through Kumily market."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Lake & Forest Edge",
                  "bodySubtitle": "DAY 2 | PERIYAR",
                  "listItems": [
                    "Morning lake excursion.",
                    "Guided forest-edge nature walk.",
                    "Free evening at the lodge."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/forest-landscape.webp",
                      "alt": "Landscape view representing lake & forest edge on the periyar spice hills & lake trails route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Spice Country",
                  "bodySubtitle": "DAY 3 | PLANTATIONS",
                  "listItems": [
                    "Walk through cardamom, pepper, clove, and cinnamon plots.",
                    "Simple plantation lunch.",
                    "Optional spice-shopping stop."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Slow Highland Day",
                  "bodySubtitle": "DAY 4 | THEKKADY",
                  "listItems": [
                    "Choose a light trek, cooking session, or relaxed wellness treatment.",
                    "Keep the afternoon unscheduled."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | ONWARD",
                  "listItems": [
                    "Breakfast and checkout.",
                    "Private transfer to your next Kerala stop."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "What This Route Covers",
              "items": [
                "Private road transfers within the route.",
                "Comfortable plantation or nature-lodge stay.",
                "Local guiding for spice and forest activities.",
                "Flexible free time between scheduled experiences."
              ],
              "image": "/images/impact/impact1.webp",
              "imageAlt": "Forest road winding through green spice hills near Periyar in Kerala",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Carry light walking shoes.",
                "Keep a rain layer between June and September.",
                "Use neutral clothing for nature walks.",
                "Avoid packing every hour with activities. Periyar is better slowly."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Periyar works best when the plan leaves enough room for the forest to set the pace.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "October to March is easiest for dry-weather sightseeing; monsoon months are greener, quieter, and wetter."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This is a straightforward highland escape: easy logistics, a little wildlife, a lot of green, and enough spice-country detail to make the route feel distinctly Kerala."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "REGIONAL NATURE & SPICE PARTNER • KERALA",
              "name": "Periyar Highlands Network",
              "bio": "A local operating network supporting nature walks, plantation visits, regional guides, and practical highland logistics around Periyar.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Periyar Highlands Network, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in nature & spice country.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-2",
      "slug": "munnar-tea-country-escape",
      "type": "essential",
      "featured": false,
      "title": "Munnar Tea Country Escape",
      "region": "Kerala",
      "days": 5,
      "categories": [
        "nature",
        "stays",
        "offbeat"
      ],
      "tags": [
        "#MUNNAR",
        "#TEACOUNTRY",
        "#HIGHLANDS"
      ],
      "intro": "Five easy days around Munnar for tea gardens, viewpoints, short walks, cool evenings, and an unhurried hill-country break.",
      "image": "/images/journal/journal2.webp",
      "alt": "Misty tea covered hills and layered mountain ridges around Munnar",
      "featuredDescription": "A dependable 5-day route focused on tea country & viewpoints, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "village",
          "label": "Tea estate visit"
        },
        {
          "icon": "wellness",
          "label": "Cool hill-country stays"
        },
        {
          "icon": "temple",
          "label": "Local town and market time"
        },
        {
          "icon": "boat",
          "label": "Reservoir viewpoints"
        }
      ]
    },
    "relatedSlugs": [
      "periyar-spice-hills-and-lake-trails",
      "ooty-coonoor-and-the-nilgiri-hills",
      "wayanad-forest-and-plantation-break"
    ],
    "seo": {
      "pageTitle": "Munnar Tea Country Escape — 5-Day Essential Itinerary",
      "pageDesc": "Five easy days around Munnar for tea gardens, viewpoints, short walks, cool evenings, and an unhurried hill-country break.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Misty tea covered hills and layered mountain ridges around Munnar",
      "breadcrumbName": "Munnar Tea Country Escape",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Munnar Tea Country Escape"
        }
      ],
      "coverImage": "/images/journal/journal2.webp",
      "coverAlt": "Misty tea covered hills and layered mountain ridges around Munnar",
      "eyebrow": "Essential Blueprint",
      "title": "Munnar Tea Country Escape",
      "intro": "Five easy days around Munnar for tea gardens, viewpoints, short walks, cool evenings, and an unhurried hill-country break.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Tea country & viewpoints"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 520",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Munnar Tea Country Escape",
      "shareText": "Five easy days around Munnar for tea gardens, viewpoints, short walks, cool evenings, and an unhurried hill-country break."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Keep one base in Munnar and explore outward rather than changing hotels. The emphasis is scenery, tea culture, and comfortable half-day outings."
              ],
              "caption": "Kochi → Munnar → Eravikulam → Top Station",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Tea estate visit",
                "Cool hill-country stays",
                "Local town and market time",
                "Reservoir viewpoints"
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Drive Into the High Range",
                  "bodySubtitle": "DAY 1 | KOCHI TO MUNNAR",
                  "listItems": [
                    "Private transfer into the hills.",
                    "Check in and keep the evening free."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Landscape view representing drive into the high range on the munnar tea country escape route"
                    }
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Tea Country",
                  "bodySubtitle": "DAY 2 | MUNNAR",
                  "listItems": [
                    "Tea museum or estate visit.",
                    "Tea tasting.",
                    "Short viewpoint stops."
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Eravikulam Morning",
                  "bodySubtitle": "DAY 3 | NATIONAL PARK",
                  "listItems": [
                    "Morning park visit subject to access.",
                    "Lunch back in Munnar.",
                    "Free afternoon."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Top Station Loop",
                  "bodySubtitle": "DAY 4 | HIGH-RANGE DRIVE",
                  "listItems": [
                    "Scenic drive toward Top Station.",
                    "Photo stops and short walks.",
                    "Return before evening mist."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | ONWARD",
                  "listItems": [
                    "Breakfast.",
                    "Private transfer to Kochi, Thekkady, or onward route."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Simple Inclusions",
              "items": [
                "One Munnar base for the full stay.",
                "Private vehicle for scheduled outings.",
                "Tea-country guiding where useful.",
                "Flexible weather-dependent timing."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Pack a light sweater for evenings.",
                "Carry comfortable shoes with grip.",
                "Start viewpoints early for clearer skies.",
                "Keep one spare half-day for weather changes."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The pleasure of Munnar is simple: cool air, long ridgelines, tea, and nowhere urgent to be.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "ROUTE SNAPSHOTS",
              "title": "A Few Visual Notes",
              "images": [
                {
                  "src": "/images/journal/journal2.webp",
                  "alt": "Travel image 1 supporting the munnar tea country escape journey in Kerala",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 1 from Kerala."
                },
                {
                  "src": "/images/home/forest-portrait.webp",
                  "alt": "Travel image 2 supporting the munnar tea country escape journey in Kerala",
                  "width": 800,
                  "height": 1050,
                  "caption": "Route snapshot 2 from Kerala."
                },
                {
                  "src": "/images/impact/impact1.webp",
                  "alt": "Travel image 3 supporting the munnar tea country escape journey in Kerala",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 3 from Kerala."
                }
              ],
              "captionMob": false,
              "captionPc": false
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "Views are often clearest in the morning. Afternoon mist is part of Munnar, not a system failure. 😂"
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This route is deliberately uncomplicated. One hill base, a few well-chosen outings, and enough free time to actually enjoy being in Munnar."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "ESSENTIAL ROUTE CURATOR • KERALA",
              "name": "Sreejith Travel",
              "bio": "Sreejith Travel keeps this blueprint intentionally simple, using a single base and trusted local drivers for an easy hill-country escape.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Sreejith Travel, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in tea country & viewpoints.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-3",
      "slug": "alleppey-backwaters-and-village-life",
      "type": "essential",
      "featured": true,
      "title": "Alleppey Backwaters & Village Life",
      "region": "Kerala",
      "days": 4,
      "categories": [
        "culture",
        "nature",
        "stays"
      ],
      "tags": [
        "#ALLEPPEY",
        "#BACKWATERS",
        "#KUTTANAD"
      ],
      "intro": "A short backwater route through Alleppey and Kuttanad with a houseboat night, canoe time, village stops, and easy local food.",
      "image": "/images/journal/journal5.webp",
      "alt": "Wooden canoe moving through palm lined Kerala backwater village canals",
      "featuredDescription": "A dependable 4-day route focused on backwaters & village life, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "boat",
          "label": "Private houseboat night"
        },
        {
          "icon": "village",
          "label": "Kuttanad village canoe"
        },
        {
          "icon": "temple",
          "label": "Waterside heritage stops"
        },
        {
          "icon": "wellness",
          "label": "Slow mornings by the lake"
        }
      ],
      "collaborator": {
        "name": "Kuttanad Backwater Collective",
        "role": "Local Waterways & Village Partner",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "fort-kochi-heritage-weekend",
      "varkala-coast-and-wellness-retreat",
      "goa-beyond-the-beach"
    ],
    "seo": {
      "pageTitle": "Alleppey Backwaters & Village Life — 4-Day Essential Itinerary",
      "pageDesc": "A short backwater route through Alleppey and Kuttanad with a houseboat night, canoe time, village stops, and easy local food.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Wooden canoe moving through palm lined Kerala backwater village canals",
      "breadcrumbName": "Alleppey Backwaters & Village Life",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Alleppey Backwaters & Village Life"
        }
      ],
      "coverImage": "/images/journal/journal5.webp",
      "coverAlt": "Wooden canoe moving through palm lined Kerala backwater village canals",
      "eyebrow": "Essential Blueprint",
      "title": "Alleppey Backwaters & Village Life",
      "intro": "A short backwater route through Alleppey and Kuttanad with a houseboat night, canoe time, village stops, and easy local food.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "4 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Backwaters & village life"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 480",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Alleppey Backwaters & Village Life",
      "shareText": "A short backwater route through Alleppey and Kuttanad with a houseboat night, canoe time, village stops, and easy local food."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "The route keeps the backwater experience compact: one land stay, one houseboat night, a smaller canoe outing, and village time away from the busiest channels."
              ],
              "caption": "Kochi → Alleppey → Kuttanad → Vembanad",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Private houseboat night",
                "Kuttanad village canoe",
                "Waterside heritage stops",
                "Slow mornings by the lake"
              ],
              "image": "/images/itineraries/dummy3.webp",
              "imageAlt": "Traveller view representing the alleppey backwaters & village life journey across Kerala",
              "imageAspectRatio": "4 / 5"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "QUICK LOOK",
              "title": "A Short Look at the Route",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film thumbnail introducing the alleppey backwaters & village life route",
                "width": 800,
                "height": 450
              },
              "caption": "A short visual introduction before the practical route details."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "4 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Arrive in Alleppey",
                  "bodySubtitle": "DAY 1 | ALAPPUZHA",
                  "listItems": [
                    "Transfer from Kochi.",
                    "Check in by the water.",
                    "Sunset walk or short boat ride."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Houseboat Day",
                  "bodySubtitle": "DAY 2 | BACKWATERS",
                  "listItems": [
                    "Board a private houseboat.",
                    "Lunch on board.",
                    "Cruise through wider waterways and settle overnight."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/travel-video.webp",
                      "alt": "Landscape view representing houseboat day on the alleppey backwaters & village life route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Small Canals & Villages",
                  "bodySubtitle": "DAY 3 | KUTTANAD",
                  "listItems": [
                    "Switch to a smaller canoe.",
                    "Visit village lanes and local workshops.",
                    "Return to a land stay by evening."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 4 | ONWARD",
                  "listItems": [
                    "Breakfast by the water.",
                    "Transfer to Kochi, Kumarakom, or onward destination."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Backwater Basics",
              "items": [
                "One private houseboat night.",
                "Smaller canoe outing through village canals.",
                "Private road transfers in and out.",
                "Meals on the houseboat as specified."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Pack light for the houseboat night.",
                "Carry sun protection and insect repellent.",
                "Expect humidity.",
                "Choose a smaller canoe if you want the narrow canals."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The best backwater moments usually happen after the engine goes quiet.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "For quieter waterways, start early and avoid making the entire trip one long houseboat cruise."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This is the no-nonsense Kerala backwater essential: boat, village, food, water, sleep, repeat. Exactly enough."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LOCAL WATERWAYS & VILLAGE PARTNER • KERALA",
              "name": "Kuttanad Backwater Collective",
              "bio": "A regional operating collective coordinating small boats, houseboat crews, village access, and practical backwater logistics across Kuttanad.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Kuttanad Backwater Collective, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 4-day plan.",
                    "Guests interested in backwaters & village life.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-4",
      "slug": "fort-kochi-heritage-weekend",
      "type": "essential",
      "featured": false,
      "title": "Fort Kochi Heritage Weekend",
      "region": "Kerala",
      "days": 3,
      "categories": [
        "culture",
        "stays",
        "bespoke"
      ],
      "tags": [
        "#FORTKOCHI",
        "#HERITAGE",
        "#WEEKEND"
      ],
      "intro": "Three compact days for Fort Kochi and Mattancherry: heritage streets, galleries, food, waterfront evenings, and one very easy base.",
      "image": "/images/home/journey-pc.webp",
      "alt": "Warmly lit heritage street in Fort Kochi during a quiet evening",
      "featuredDescription": "A dependable 3-day route focused on urban heritage & food, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Mattancherry heritage walk"
        },
        {
          "icon": "village",
          "label": "Local food and markets"
        },
        {
          "icon": "boat",
          "label": "Harbour sunset time"
        },
        {
          "icon": "wellness",
          "label": "Slow heritage stay"
        }
      ]
    },
    "relatedSlugs": [
      "alleppey-backwaters-and-village-life",
      "madurai-and-chettinad-heritage-trail",
      "pondicherry-and-the-coromandel-coast"
    ],
    "seo": {
      "pageTitle": "Fort Kochi Heritage Weekend — 3-Day Essential Itinerary",
      "pageDesc": "Three compact days for Fort Kochi and Mattancherry: heritage streets, galleries, food, waterfront evenings, and one very easy base.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Warmly lit heritage street in Fort Kochi during a quiet evening",
      "breadcrumbName": "Fort Kochi Heritage Weekend",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Fort Kochi Heritage Weekend"
        }
      ],
      "coverImage": "/images/home/journey-pc.webp",
      "coverAlt": "Warmly lit heritage street in Fort Kochi during a quiet evening",
      "eyebrow": "Essential Blueprint",
      "title": "Fort Kochi Heritage Weekend",
      "intro": "Three compact days for Fort Kochi and Mattancherry: heritage streets, galleries, food, waterfront evenings, and one very easy base.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "3 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Urban heritage & food"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 390",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Fort Kochi Heritage Weekend",
      "shareText": "Three compact days for Fort Kochi and Mattancherry: heritage streets, galleries, food, waterfront evenings, and one very easy base."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Stay in Fort Kochi and walk or drive short distances. This is designed as an easy beginning or ending to a longer South India journey."
              ],
              "caption": "Fort Kochi → Mattancherry → Jew Town → Harbour",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Mattancherry heritage walk",
                "Local food and markets",
                "Harbour sunset time",
                "Slow heritage stay"
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "3 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Check In & Walk",
                  "bodySubtitle": "DAY 1 | FORT KOCHI",
                  "listItems": [
                    "Arrive and settle into a heritage stay.",
                    "Walk the waterfront and old streets.",
                    "Easy dinner nearby."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Mattancherry & Jew Town",
                  "bodySubtitle": "DAY 2 | HERITAGE CORE",
                  "listItems": [
                    "Guided heritage walk.",
                    "Spice-market and gallery stops.",
                    "Late afternoon free."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/journey-pc.webp",
                      "alt": "Landscape view representing mattancherry & jew town on the fort kochi heritage weekend route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Morning & Departure",
                  "bodySubtitle": "DAY 3 | FORT KOCHI",
                  "listItems": [
                    "Breakfast.",
                    "Optional café, gallery, or waterfront stop.",
                    "Airport or onward transfer."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Weekend Setup",
              "items": [
                "One central Fort Kochi base.",
                "Private arrival and departure transfers.",
                "Half-day guided heritage walk.",
                "Free time for galleries, cafés, and shopping."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Wear light clothing.",
                "Carry modest attire for religious sites.",
                "Use comfortable walking shoes.",
                "Do not schedule six museums before lunch. You are on holiday."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "A good Fort Kochi weekend needs less itinerary and more wandering.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "Fort Kochi is best explored on foot in the cooler morning and late afternoon hours."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This route is intentionally small. It gives first-time visitors enough context to understand the neighbourhood and enough free time to enjoy it."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "ESSENTIAL ROUTE CURATOR • KERALA",
              "name": "Sreejith Travel",
              "bio": "Sreejith Travel uses this compact city blueprint as an easy arrival, departure, or weekend add-on within longer South India journeys.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Sreejith Travel, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 3-day plan.",
                    "Guests interested in urban heritage & food.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-5",
      "slug": "wayanad-forest-and-plantation-break",
      "type": "essential",
      "featured": false,
      "title": "Wayanad Forest & Plantation Break",
      "region": "Kerala",
      "days": 5,
      "categories": [
        "nature",
        "offbeat",
        "stays"
      ],
      "tags": [
        "#WAYANAD",
        "#FOREST",
        "#PLANTATIONS"
      ],
      "intro": "A relaxed Wayanad break with plantation stays, short forest-edge walks, viewpoints, waterfalls, and plenty of unscheduled green time.",
      "image": "/images/home/forest-landscape.webp",
      "alt": "Dense green forest and plantation landscape across the hills of Wayanad",
      "featuredDescription": "A dependable 5-day route focused on forest & plantations, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "village",
          "label": "Plantation-hosted stay"
        },
        {
          "icon": "wellness",
          "label": "Quiet forest-edge mornings"
        },
        {
          "icon": "temple",
          "label": "Local village and market stops"
        },
        {
          "icon": "boat",
          "label": "Reservoir or river viewpoints"
        }
      ],
      "collaborator": {
        "name": "Anjali Varghese",
        "role": "Wayanad Nature Host",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "periyar-spice-hills-and-lake-trails",
      "munnar-tea-country-escape",
      "mysuru-and-coorg-slow-escape"
    ],
    "seo": {
      "pageTitle": "Wayanad Forest & Plantation Break — 5-Day Essential Itinerary",
      "pageDesc": "A relaxed Wayanad break with plantation stays, short forest-edge walks, viewpoints, waterfalls, and plenty of unscheduled green time.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Dense green forest and plantation landscape across the hills of Wayanad",
      "breadcrumbName": "Wayanad Forest & Plantation Break",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Wayanad Forest & Plantation Break"
        }
      ],
      "coverImage": "/images/home/forest-landscape.webp",
      "coverAlt": "Dense green forest and plantation landscape across the hills of Wayanad",
      "eyebrow": "Essential Blueprint",
      "title": "Wayanad Forest & Plantation Break",
      "intro": "A relaxed Wayanad break with plantation stays, short forest-edge walks, viewpoints, waterfalls, and plenty of unscheduled green time.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Forest & plantations"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 510",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Wayanad Forest & Plantation Break",
      "shareText": "A relaxed Wayanad break with plantation stays, short forest-edge walks, viewpoints, waterfalls, and plenty of unscheduled green time."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Use one comfortable Wayanad base and keep the days flexible. Weather and road conditions can change the best order of waterfalls, viewpoints, and walks."
              ],
              "caption": "Calicut → Wayanad → Plantation Country → Forest Edge",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Plantation-hosted stay",
                "Quiet forest-edge mornings",
                "Local village and market stops",
                "Reservoir or river viewpoints"
              ],
              "image": "/images/itineraries/dummy5.webp",
              "imageAlt": "Traveller view representing the wayanad forest & plantation break journey across Kerala",
              "imageAspectRatio": "4 / 5"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Into Wayanad",
                  "bodySubtitle": "DAY 1 | CALICUT TO WAYANAD",
                  "listItems": [
                    "Private hill transfer.",
                    "Check in to a plantation stay.",
                    "Free evening."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Plantation Day",
                  "bodySubtitle": "DAY 2 | COFFEE & SPICE COUNTRY",
                  "listItems": [
                    "Guided plantation walk.",
                    "Local lunch.",
                    "Rest or short sunset outing."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/forest-landscape.webp",
                      "alt": "Landscape view representing plantation day on the wayanad forest & plantation break route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Forest & Viewpoints",
                  "bodySubtitle": "DAY 3 | WAYANAD",
                  "listItems": [
                    "Choose a suitable forest-edge or viewpoint walk.",
                    "Keep the route weather dependent."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Waterfall or Village Day",
                  "bodySubtitle": "DAY 4 | FLEXIBLE",
                  "listItems": [
                    "Choose one major outing.",
                    "Leave the rest of the day open.",
                    "Optional local craft or food stop."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | CALICUT",
                  "listItems": [
                    "Breakfast.",
                    "Return transfer to Calicut."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "What to Expect",
              "items": [
                "One plantation or forest-edge base.",
                "Private local transport.",
                "One guided plantation experience.",
                "Flexible routing for weather and access."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Carry shoes with good grip.",
                "Bring a compact rain layer year-round.",
                "Expect leeches on some wet-season trails.",
                "Keep electronics protected during monsoon."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Wayanad is not improved by rushing from waterfall to waterfall.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "ROUTE SNAPSHOTS",
              "title": "A Few Visual Notes",
              "images": [
                {
                  "src": "/images/home/forest-landscape.webp",
                  "alt": "Travel image 1 supporting the wayanad forest & plantation break journey in Kerala",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 1 from Kerala."
                },
                {
                  "src": "/images/itineraries/dummy3.webp",
                  "alt": "Travel image 2 supporting the wayanad forest & plantation break journey in Kerala",
                  "width": 800,
                  "height": 1050,
                  "caption": "Route snapshot 2 from Kerala."
                },
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Travel image 3 supporting the wayanad forest & plantation break journey in Kerala",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 3 from Kerala."
                }
              ],
              "captionMob": true,
              "captionPc": false
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "In heavy rain, swap ambitious walks for plantation, food, and village experiences instead of forcing the original plan."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This route keeps Wayanad practical: one base, a few good outings, and enough empty space for the hills to feel like a break."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "WAYANAD NATURE HOST • KERALA",
              "name": "Anjali Varghese",
              "bio": "Anjali coordinates plantation stays, easy nature walks, and local-hosted experiences across Wayanad with an emphasis on comfortable pacing.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Anjali Varghese, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in forest & plantations.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-6",
      "slug": "varkala-coast-and-wellness-retreat",
      "type": "essential",
      "featured": false,
      "title": "Varkala Coast & Wellness Retreat",
      "region": "Kerala",
      "days": 5,
      "categories": [
        "wellness",
        "nature",
        "stays"
      ],
      "tags": [
        "#VARKALA",
        "#WELLNESS",
        "#COAST"
      ],
      "intro": "Five coastal days in Varkala with beach time, simple wellness sessions, cliff walks, local food, and almost aggressively little rushing.",
      "image": "/images/home/solo-landscape.webp",
      "alt": "Quiet tropical coastline beneath a broad evening sky near Varkala",
      "featuredDescription": "A dependable 5-day route focused on coast & wellness, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "wellness",
          "label": "Yoga or Ayurveda sessions"
        },
        {
          "icon": "boat",
          "label": "Coastal and estuary time"
        },
        {
          "icon": "village",
          "label": "Local food stops"
        },
        {
          "icon": "temple",
          "label": "Temple-town context"
        }
      ],
      "collaborator": {
        "name": "Varkala Wellness Circle",
        "role": "Local Wellness & Stay Partner",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "alleppey-backwaters-and-village-life",
      "periyar-spice-hills-and-lake-trails",
      "pondicherry-and-the-coromandel-coast"
    ],
    "seo": {
      "pageTitle": "Varkala Coast & Wellness Retreat — 5-Day Essential Itinerary",
      "pageDesc": "Five coastal days in Varkala with beach time, simple wellness sessions, cliff walks, local food, and almost aggressively little rushing.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Quiet tropical coastline beneath a broad evening sky near Varkala",
      "breadcrumbName": "Varkala Coast & Wellness Retreat",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Varkala Coast & Wellness Retreat"
        }
      ],
      "coverImage": "/images/home/solo-landscape.webp",
      "coverAlt": "Quiet tropical coastline beneath a broad evening sky near Varkala",
      "eyebrow": "Essential Blueprint",
      "title": "Varkala Coast & Wellness Retreat",
      "intro": "Five coastal days in Varkala with beach time, simple wellness sessions, cliff walks, local food, and almost aggressively little rushing.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Kerala"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Coast & wellness"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 460",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Varkala Coast & Wellness Retreat",
      "shareText": "Five coastal days in Varkala with beach time, simple wellness sessions, cliff walks, local food, and almost aggressively little rushing."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Stay in one place and resist the urge to turn a wellness break into a military campaign. Schedule one or two meaningful activities a day and leave the rest alone."
              ],
              "caption": "Trivandrum → Varkala → Coastal Villages → Trivandrum",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Yoga or Ayurveda sessions",
                "Coastal and estuary time",
                "Local food stops",
                "Temple-town context"
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Arrival",
                  "bodySubtitle": "DAY 1 | VARKALA",
                  "listItems": [
                    "Transfer from Trivandrum.",
                    "Check in.",
                    "Cliff walk at sunset."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Wellness & Coast",
                  "bodySubtitle": "DAY 2 | VARKALA",
                  "listItems": [
                    "Morning yoga or wellness session.",
                    "Beach time.",
                    "Free evening."
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Local Day",
                  "bodySubtitle": "DAY 3 | COASTAL VILLAGES",
                  "listItems": [
                    "Short local excursion.",
                    "Simple regional lunch.",
                    "Return early."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Nothing Heroic",
                  "bodySubtitle": "DAY 4 | VARKALA",
                  "listItems": [
                    "Optional Ayurveda session.",
                    "Read, swim, walk, eat.",
                    "That is the itinerary. Congratulations. 😂"
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | TRIVANDRUM",
                  "listItems": [
                    "Breakfast.",
                    "Airport or onward transfer."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Retreat Basics",
              "items": [
                "One Varkala base for all nights.",
                "Private airport or station transfers.",
                "Optional yoga and Ayurveda bookings.",
                "Flexible free time every day."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Pack beachwear plus modest local clothing.",
                "Carry sun protection.",
                "Discuss medical concerns directly with qualified wellness providers.",
                "Do not confuse more appointments with more wellness."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The luxury here is not having somewhere else to be.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "Wellness treatments should be chosen with qualified practitioners and matched to the traveller, not copied from a generic menu."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "Varkala works because the route refuses to overperform. Sea, cliff, food, rest, a little wellness, and enough silence between them."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "LOCAL WELLNESS & STAY PARTNER • KERALA",
              "name": "Varkala Wellness Circle",
              "bio": "A local partner network supporting vetted wellness appointments, coastal stays, and simple on-ground logistics around Varkala.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Varkala Wellness Circle, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in coast & wellness.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-7",
      "slug": "madurai-and-chettinad-heritage-trail",
      "type": "essential",
      "featured": true,
      "title": "Madurai & Chettinad Heritage Trail",
      "region": "Tamil Nadu",
      "days": 5,
      "categories": [
        "culture",
        "stays",
        "bespoke"
      ],
      "tags": [
        "#MADURAI",
        "#CHETTINAD",
        "#HERITAGE"
      ],
      "intro": "A five-day Tamil heritage route connecting Madurai's temple city energy with Chettinad mansions, food, markets, and village architecture.",
      "image": "/images/fallbacks/culture.webp",
      "alt": "South Indian heritage architecture and carved details representing Tamil cultural travel",
      "featuredDescription": "A dependable 5-day route focused on temple city & mansions, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Madurai temple heritage"
        },
        {
          "icon": "village",
          "label": "Chettinad village streets"
        },
        {
          "icon": "wellness",
          "label": "Heritage mansion stays"
        },
        {
          "icon": "boat",
          "label": "Market and tank-side walks"
        }
      ],
      "collaborator": {
        "name": "Meena Subramanian",
        "role": "Chettinad Heritage Curator",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "fort-kochi-heritage-weekend",
      "hampi-and-badami-heritage-circuit",
      "pondicherry-and-the-coromandel-coast"
    ],
    "seo": {
      "pageTitle": "Madurai & Chettinad Heritage Trail — 5-Day Essential Itinerary",
      "pageDesc": "A five-day Tamil heritage route connecting Madurai's temple city energy with Chettinad mansions, food, markets, and village architecture.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "South Indian heritage architecture and carved details representing Tamil cultural travel",
      "breadcrumbName": "Madurai & Chettinad Heritage Trail",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Madurai & Chettinad Heritage Trail"
        }
      ],
      "coverImage": "/images/fallbacks/culture.webp",
      "coverAlt": "South Indian heritage architecture and carved details representing Tamil cultural travel",
      "eyebrow": "Essential Blueprint",
      "title": "Madurai & Chettinad Heritage Trail",
      "intro": "A five-day Tamil heritage route connecting Madurai's temple city energy with Chettinad mansions, food, markets, and village architecture.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Tamil Nadu"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Temple city & mansions"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 590",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Madurai & Chettinad Heritage Trail",
      "shareText": "A five-day Tamil heritage route connecting Madurai's temple city energy with Chettinad mansions, food, markets, and village architecture."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Start with Madurai's dense temple-city core, then slow the pace in Chettinad. The second half is more about mansions, meals, streets, and material culture than ticking monuments."
              ],
              "caption": "Madurai → Karaikudi → Kanadukathan → Chettinad",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Madurai temple heritage",
                "Chettinad village streets",
                "Heritage mansion stays",
                "Market and tank-side walks"
              ],
              "image": "/images/itineraries/dummy7.webp",
              "imageAlt": "Traveller view representing the madurai & chettinad heritage trail journey across Tamil Nadu",
              "imageAspectRatio": "4 / 5"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "QUICK LOOK",
              "title": "A Short Look at the Route",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film thumbnail introducing the madurai & chettinad heritage trail route",
                "width": 800,
                "height": 450
              },
              "caption": "A short visual introduction before the practical route details."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Madurai Arrival",
                  "bodySubtitle": "DAY 1 | MADURAI",
                  "listItems": [
                    "Check in centrally.",
                    "Evening market walk.",
                    "Temple exterior or evening visit if timing suits."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Temple City",
                  "bodySubtitle": "DAY 2 | MADURAI",
                  "listItems": [
                    "Guided heritage walk.",
                    "Temple and palace context.",
                    "Local lunch.",
                    "Free evening."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/fallbacks/culture.webp",
                      "alt": "Landscape view representing temple city on the madurai & chettinad heritage trail route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Into Chettinad",
                  "bodySubtitle": "DAY 3 | KARAIKUDI",
                  "listItems": [
                    "Drive to Chettinad.",
                    "Check into a heritage mansion.",
                    "Village walk."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Mansions & Food",
                  "bodySubtitle": "DAY 4 | CHETTINAD",
                  "listItems": [
                    "Architecture walk.",
                    "Tile, antique, or craft stop.",
                    "Chettinad lunch.",
                    "Free late afternoon."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | ONWARD",
                  "listItems": [
                    "Breakfast.",
                    "Transfer toward Madurai, Trichy, or onward route."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Heritage Route Basics",
              "items": [
                "Private road transfers.",
                "Central Madurai and heritage Chettinad stays.",
                "Local guiding for temple-city and mansion context.",
                "Flexible food and market stops."
              ],
              "image": "/images/fallbacks/culture.webp",
              "imageAlt": "South Indian heritage architecture and carved details representing Tamil cultural travel",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Carry shoulder-and-knee-covering clothing for temple visits.",
                "Remove footwear where required.",
                "Expect hot afternoons for much of the year.",
                "Keep water handy during walking sections."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Madurai gives you density; Chettinad gives you time to notice the details.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "ROUTE SNAPSHOTS",
              "title": "A Few Visual Notes",
              "images": [
                {
                  "src": "/images/fallbacks/culture.webp",
                  "alt": "Travel image 1 supporting the madurai & chettinad heritage trail journey in Tamil Nadu",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 1 from Tamil Nadu."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Travel image 2 supporting the madurai & chettinad heritage trail journey in Tamil Nadu",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 2 from Tamil Nadu."
                },
                {
                  "src": "/images/itineraries/dummy8.webp",
                  "alt": "Travel image 3 supporting the madurai & chettinad heritage trail journey in Tamil Nadu",
                  "width": 800,
                  "height": 1050,
                  "caption": "Route snapshot 3 from Tamil Nadu."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "Temple access rules can vary by area. The route should respect current local practice rather than assume every interior space is visitor-accessible."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This is a clean culture route with an easy contrast: energetic temple city first, slower domestic heritage and food culture second."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "CHETTINAD HERITAGE CURATOR • TAMIL NADU",
              "name": "Meena Subramanian",
              "bio": "Meena works with local heritage homes, food hosts, and guides to interpret Chettinad's architecture and domestic culture without overcomplicating the route.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Meena Subramanian, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in temple city & mansions.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-8",
      "slug": "ooty-coonoor-and-the-nilgiri-hills",
      "type": "essential",
      "featured": false,
      "title": "Ooty, Coonoor & the Nilgiri Hills",
      "region": "Tamil Nadu",
      "days": 5,
      "categories": [
        "nature",
        "stays",
        "culture"
      ],
      "tags": [
        "#NILGIRIS",
        "#OOTY",
        "#COONOOR"
      ],
      "intro": "A classic Nilgiri hill break linking Coonoor and Ooty with tea gardens, viewpoints, railway atmosphere, and easy mountain days.",
      "image": "/images/journal/journal2.webp",
      "alt": "Layered green mountain slopes and drifting mist across the Nilgiri hills",
      "featuredDescription": "A dependable 5-day route focused on hill stations & tea, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "village",
          "label": "Coonoor tea country"
        },
        {
          "icon": "wellness",
          "label": "Cool hill stays"
        },
        {
          "icon": "temple",
          "label": "Ooty heritage stops"
        },
        {
          "icon": "boat",
          "label": "Lake and valley viewpoints"
        }
      ],
      "collaborator": {
        "name": "Nilgiri Hills Travel Collective",
        "role": "Regional Hill-Country Partner",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "munnar-tea-country-escape",
      "mysuru-and-coorg-slow-escape",
      "wayanad-forest-and-plantation-break"
    ],
    "seo": {
      "pageTitle": "Ooty, Coonoor & the Nilgiri Hills — 5-Day Essential Itinerary",
      "pageDesc": "A classic Nilgiri hill break linking Coonoor and Ooty with tea gardens, viewpoints, railway atmosphere, and easy mountain days.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Layered green mountain slopes and drifting mist across the Nilgiri hills",
      "breadcrumbName": "Ooty, Coonoor & the Nilgiri Hills",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Ooty, Coonoor & the Nilgiri Hills"
        }
      ],
      "coverImage": "/images/journal/journal2.webp",
      "coverAlt": "Layered green mountain slopes and drifting mist across the Nilgiri hills",
      "eyebrow": "Essential Blueprint",
      "title": "Ooty, Coonoor & the Nilgiri Hills",
      "intro": "A classic Nilgiri hill break linking Coonoor and Ooty with tea gardens, viewpoints, railway atmosphere, and easy mountain days.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Tamil Nadu"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Hill stations & tea"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 500",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Ooty, Coonoor & the Nilgiri Hills",
      "shareText": "A classic Nilgiri hill break linking Coonoor and Ooty with tea gardens, viewpoints, railway atmosphere, and easy mountain days."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Split the stay between Coonoor and Ooty only if the traveller enjoys changing bases; otherwise use one and day-trip. The route is deliberately flexible."
              ],
              "caption": "Coimbatore → Coonoor → Ooty → Nilgiri Hills",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Coonoor tea country",
                "Cool hill stays",
                "Ooty heritage stops",
                "Lake and valley viewpoints"
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Climb to Coonoor",
                  "bodySubtitle": "DAY 1 | COIMBATORE TO COONOOR",
                  "listItems": [
                    "Private transfer into the Nilgiris.",
                    "Check in.",
                    "Free evening."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Tea & Viewpoints",
                  "bodySubtitle": "DAY 2 | COONOOR",
                  "listItems": [
                    "Tea garden visit.",
                    "Short viewpoint circuit.",
                    "Local lunch."
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Railway & Ooty",
                  "bodySubtitle": "DAY 3 | NILGIRI HILLS",
                  "listItems": [
                    "Use the mountain railway where schedules and tickets allow.",
                    "Continue to Ooty.",
                    "Light evening."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal2.webp",
                      "alt": "Landscape view representing railway & ooty on the ooty, coonoor & the nilgiri hills route"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Ooty Day",
                  "bodySubtitle": "DAY 4 | OOTY",
                  "listItems": [
                    "Choose gardens, heritage, or a scenic drive.",
                    "Keep the afternoon relaxed."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | COIMBATORE",
                  "listItems": [
                    "Breakfast.",
                    "Drive down to Coimbatore."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Hill-Station Setup",
              "items": [
                "Private road transfers.",
                "Tea-country visit.",
                "Flexible Ooty and Coonoor sightseeing.",
                "Railway segment subject to operating schedule and availability."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Pack a light jacket.",
                "Carry motion-sickness medication if winding roads bother you.",
                "Book railway seats early when possible.",
                "Keep weather flexibility in the plan."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "The Nilgiris are easy to enjoy once you stop trying to photograph every bend in the road.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "The Nilgiri Mountain Railway is operationally constrained, so the itinerary should work even if the preferred train segment is unavailable."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This is the classic hill-country essential: tea, cool air, old railway atmosphere, a couple of viewpoints, and no need to pretend it is an expedition."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "REGIONAL HILL-COUNTRY PARTNER • TAMIL NADU",
              "name": "Nilgiri Hills Travel Collective",
              "bio": "A regional partner network supporting drivers, hill stays, tea visits, and practical routing between Coonoor, Ooty, and Coimbatore.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Nilgiri Hills Travel Collective, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in hill stations & tea.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-9",
      "slug": "mysuru-and-coorg-slow-escape",
      "type": "essential",
      "featured": true,
      "title": "Mysuru & Coorg Slow Escape",
      "region": "Karnataka",
      "days": 6,
      "categories": [
        "culture",
        "nature",
        "stays"
      ],
      "tags": [
        "#MYSURU",
        "#COORG",
        "#COFFEE"
      ],
      "intro": "Six days combining Mysuru's palace-city heritage with Coorg coffee country, plantation stays, gentle drives, and relaxed regional food.",
      "image": "/images/impact/impact2.webp",
      "alt": "Green plantation landscape and winding road through the hills of Karnataka",
      "featuredDescription": "A dependable 6-day route focused on heritage & coffee country, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Mysuru palace-city heritage"
        },
        {
          "icon": "village",
          "label": "Coffee plantation stay"
        },
        {
          "icon": "wellness",
          "label": "Slow hill-country mornings"
        },
        {
          "icon": "boat",
          "label": "River and viewpoint stops"
        }
      ],
      "collaborator": {
        "name": "Rohan Cariappa",
        "role": "Coorg Plantation Host",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "wayanad-forest-and-plantation-break",
      "ooty-coonoor-and-the-nilgiri-hills",
      "hampi-and-badami-heritage-circuit"
    ],
    "seo": {
      "pageTitle": "Mysuru & Coorg Slow Escape — 6-Day Essential Itinerary",
      "pageDesc": "Six days combining Mysuru's palace-city heritage with Coorg coffee country, plantation stays, gentle drives, and relaxed regional food.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Green plantation landscape and winding road through the hills of Karnataka",
      "breadcrumbName": "Mysuru & Coorg Slow Escape",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Mysuru & Coorg Slow Escape"
        }
      ],
      "coverImage": "/images/impact/impact2.webp",
      "coverAlt": "Green plantation landscape and winding road through the hills of Karnataka",
      "eyebrow": "Essential Blueprint",
      "title": "Mysuru & Coorg Slow Escape",
      "intro": "Six days combining Mysuru's palace-city heritage with Coorg coffee country, plantation stays, gentle drives, and relaxed regional food.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "6 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Karnataka"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Heritage & coffee country"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 660",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Mysuru & Coorg Slow Escape",
      "shareText": "Six days combining Mysuru's palace-city heritage with Coorg coffee country, plantation stays, gentle drives, and relaxed regional food."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Spend the first half around Mysuru, then move once to Coorg and stay put. It is a simple combination that works because the two halves feel genuinely different."
              ],
              "caption": "Bengaluru → Mysuru → Srirangapatna → Coorg",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Mysuru palace-city heritage",
                "Coffee plantation stay",
                "Slow hill-country mornings",
                "River and viewpoint stops"
              ],
              "image": "/images/itineraries/dummy9.webp",
              "imageAlt": "Traveller view representing the mysuru & coorg slow escape journey across Karnataka",
              "imageAspectRatio": "4 / 5"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "6 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Mysuru Arrival",
                  "bodySubtitle": "DAY 1 | MYSURU",
                  "listItems": [
                    "Transfer from Bengaluru.",
                    "Check in.",
                    "Evening market or palace-area walk."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Palace City",
                  "bodySubtitle": "DAY 2 | MYSURU",
                  "listItems": [
                    "Major heritage visits.",
                    "Market stop.",
                    "Regional lunch.",
                    "Free evening."
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Srirangapatna to Coorg",
                  "bodySubtitle": "DAY 3 | TRANSFER DAY",
                  "listItems": [
                    "Short heritage stop en route.",
                    "Continue to plantation country.",
                    "Check in and rest."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact2.webp",
                      "alt": "Landscape view representing srirangapatna to coorg on the mysuru & coorg slow escape route"
                    }
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Coffee Country",
                  "bodySubtitle": "DAYS 4–5 | COORG",
                  "listItems": [
                    "Plantation walk.",
                    "Local food.",
                    "One viewpoint, river, or village outing.",
                    "Keep one half-day entirely free."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 6 | BENGALURU OR MYSURU",
                  "listItems": [
                    "Breakfast.",
                    "Private onward transfer."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Route Essentials",
              "items": [
                "Private road transport throughout.",
                "Central Mysuru stay and plantation-style Coorg stay.",
                "Local guiding for main heritage visits.",
                "One plantation walk or hosted coffee experience."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Carry comfortable walking shoes.",
                "Pack a light layer for Coorg evenings.",
                "Expect a longer road transfer on the final day if returning to Bengaluru.",
                "Keep luggage compact for easier hotel changes."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Mysuru gives the route structure; Coorg gives it room to breathe.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "ROUTE SNAPSHOTS",
              "title": "A Few Visual Notes",
              "images": [
                {
                  "src": "/images/impact/impact2.webp",
                  "alt": "Travel image 1 supporting the mysuru & coorg slow escape journey in Karnataka",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 1 from Karnataka."
                },
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Travel image 2 supporting the mysuru & coorg slow escape journey in Karnataka",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 2 from Karnataka."
                },
                {
                  "src": "/images/home/forest-portrait.webp",
                  "alt": "Travel image 3 supporting the mysuru & coorg slow escape journey in Karnataka",
                  "width": 800,
                  "height": 1050,
                  "caption": "Route snapshot 3 from Karnataka."
                }
              ],
              "captionMob": true,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "Do not overload the Coorg half with distant day trips. The plantation stay is part of the point."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This blueprint is easy to sell because it is easy to understand: city heritage first, coffee hills second, one clean transition between them."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "COORG PLANTATION HOST • KARNATAKA",
              "name": "Rohan Cariappa",
              "bio": "Rohan coordinates plantation stays, local food experiences, and low-key hill excursions across Coorg for travellers who prefer slower days.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Rohan Cariappa, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 6-day plan.",
                    "Guests interested in heritage & coffee country.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-10",
      "slug": "hampi-and-badami-heritage-circuit",
      "type": "essential",
      "featured": false,
      "title": "Hampi & Badami Heritage Circuit",
      "region": "Karnataka",
      "days": 6,
      "categories": [
        "culture",
        "offbeat",
        "bespoke"
      ],
      "tags": [
        "#HAMPI",
        "#BADAMI",
        "#DECCAN"
      ],
      "intro": "A six-day Deccan heritage circuit through Hampi, Aihole, Pattadakal, and Badami with temple architecture, boulder landscapes, and practical road pacing.",
      "image": "/images/impact/impact3.webp",
      "alt": "Rocky heritage landscape under open skies recalling Karnataka's Deccan plateau",
      "featuredDescription": "A dependable 6-day route focused on architecture & archaeology, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Hampi temple complexes"
        },
        {
          "icon": "village",
          "label": "Deccan town and market life"
        },
        {
          "icon": "wellness",
          "label": "Unhurried heritage stays"
        },
        {
          "icon": "boat",
          "label": "Tungabhadra river views"
        }
      ],
      "collaborator": {
        "name": "Deccan Heritage Routes",
        "role": "Regional Heritage Operating Partner",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "madurai-and-chettinad-heritage-trail",
      "mysuru-and-coorg-slow-escape",
      "pondicherry-and-the-coromandel-coast"
    ],
    "seo": {
      "pageTitle": "Hampi & Badami Heritage Circuit — 6-Day Essential Itinerary",
      "pageDesc": "A six-day Deccan heritage circuit through Hampi, Aihole, Pattadakal, and Badami with temple architecture, boulder landscapes, and practical road pacing.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Rocky heritage landscape under open skies recalling Karnataka's Deccan plateau",
      "breadcrumbName": "Hampi & Badami Heritage Circuit",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Hampi & Badami Heritage Circuit"
        }
      ],
      "coverImage": "/images/impact/impact3.webp",
      "coverAlt": "Rocky heritage landscape under open skies recalling Karnataka's Deccan plateau",
      "eyebrow": "Essential Blueprint",
      "title": "Hampi & Badami Heritage Circuit",
      "intro": "A six-day Deccan heritage circuit through Hampi, Aihole, Pattadakal, and Badami with temple architecture, boulder landscapes, and practical road pacing.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "6 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Karnataka"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Architecture & archaeology"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 690",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Hampi & Badami Heritage Circuit",
      "shareText": "A six-day Deccan heritage circuit through Hampi, Aihole, Pattadakal, and Badami with temple architecture, boulder landscapes, and practical road pacing."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "This route is about sequencing major heritage sites sensibly. Hampi gets the most time; Aihole, Pattadakal, and Badami follow as a compact northern extension."
              ],
              "caption": "Hospet → Hampi → Aihole → Pattadakal → Badami",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Hampi temple complexes",
                "Deccan town and market life",
                "Unhurried heritage stays",
                "Tungabhadra river views"
              ],
              "image": "/images/itineraries/dummy10.webp",
              "imageAlt": "Traveller view representing the hampi & badami heritage circuit journey across Karnataka",
              "imageAspectRatio": "4 / 5"
            }
          },
          {
            "type": "youtube",
            "data": {
              "eyebrow": "QUICK LOOK",
              "title": "A Short Look at the Route",
              "video": {
                "videoId": "4KtLGaNl9VQ",
                "thumbnail": "/images/home/travel-video.webp",
                "alt": "Travel film thumbnail introducing the hampi & badami heritage circuit route",
                "width": 800,
                "height": 450
              },
              "caption": "A short visual introduction before the practical route details."
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "6 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Arrive Near Hampi",
                  "bodySubtitle": "DAY 1 | HOSPET",
                  "listItems": [
                    "Arrival transfer.",
                    "Check in.",
                    "Sunset viewpoint if energy allows."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Hampi Core",
                  "bodySubtitle": "DAYS 2–3 | HAMPI",
                  "listItems": [
                    "Split major monuments across two mornings.",
                    "Use afternoons for rest or smaller sites.",
                    "Include one river or landscape viewpoint."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/impact/impact3.webp",
                      "alt": "Landscape view representing hampi core on the hampi & badami heritage circuit route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "North to Badami",
                  "bodySubtitle": "DAY 4 | TRANSFER",
                  "listItems": [
                    "Drive north.",
                    "Stop selectively rather than everywhere.",
                    "Check in and rest."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Aihole & Pattadakal",
                  "bodySubtitle": "DAY 5 | HERITAGE LOOP",
                  "listItems": [
                    "Architecture-focused guiding.",
                    "Lunch break.",
                    "Return to Badami."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Badami & Departure",
                  "bodySubtitle": "DAY 6 | BADAMI",
                  "listItems": [
                    "Morning cave-temple visit.",
                    "Onward transfer."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Heritage Circuit Basics",
              "items": [
                "Private vehicle between all major sites.",
                "Local heritage guiding on key monument days.",
                "Comfortable midday breaks during hot weather.",
                "Flexible sequencing around opening times and heat."
              ],
              "image": "/images/impact/impact3.webp",
              "imageAlt": "Rocky heritage landscape under open skies recalling Karnataka's Deccan plateau",
              "imageAspectRatio": "1 / 1"
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Carry a hat and sun protection.",
                "Wear shoes suitable for stone and uneven ground.",
                "Start early in hotter months.",
                "Bring water and avoid stacking every monument into one day."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Hampi is enormous. The essential skill is knowing what not to squeeze into the same afternoon.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "The best pacing uses mornings for exposed archaeological sites and the hottest hours for lunch, rest, or driving."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This is a boilerplate heritage circuit in the best sense: clear route, strong monuments, sensible pacing, and no fake need to make archaeology dramatic. It already is."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "REGIONAL HERITAGE OPERATING PARTNER • KARNATAKA",
              "name": "Deccan Heritage Routes",
              "bio": "A Karnataka-based operating partner supporting monument guides, road logistics, and practical sequencing across Hampi, Badami, Aihole, and Pattadakal.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Deccan Heritage Routes, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 6-day plan.",
                    "Guests interested in architecture & archaeology.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-11",
      "slug": "goa-beyond-the-beach",
      "type": "essential",
      "featured": false,
      "title": "Goa Beyond the Beach",
      "region": "Goa",
      "days": 5,
      "categories": [
        "culture",
        "stays",
        "offbeat"
      ],
      "tags": [
        "#GOA",
        "#FONTAINHAS",
        "#COAST"
      ],
      "intro": "Five days balancing Old Goa, Panjim, Fontainhas, local food, village drives, and enough coast to remember that this is still Goa.",
      "image": "/images/journal/journal1.webp",
      "alt": "Warm heritage architecture and shaded courtyard details evoking old neighbourhoods in Goa",
      "featuredDescription": "A dependable 5-day route focused on heritage, food & coast, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Old Goa heritage"
        },
        {
          "icon": "village",
          "label": "Fontainhas and local neighbourhoods"
        },
        {
          "icon": "boat",
          "label": "Coastal time"
        },
        {
          "icon": "wellness",
          "label": "Relaxed boutique stay"
        }
      ],
      "collaborator": {
        "name": "Ines D'Souza",
        "role": "Goa Culture & Food Curator",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "alleppey-backwaters-and-village-life",
      "fort-kochi-heritage-weekend",
      "pondicherry-and-the-coromandel-coast"
    ],
    "seo": {
      "pageTitle": "Goa Beyond the Beach — 5-Day Essential Itinerary",
      "pageDesc": "Five days balancing Old Goa, Panjim, Fontainhas, local food, village drives, and enough coast to remember that this is still Goa.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Warm heritage architecture and shaded courtyard details evoking old neighbourhoods in Goa",
      "breadcrumbName": "Goa Beyond the Beach",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Goa Beyond the Beach"
        }
      ],
      "coverImage": "/images/journal/journal1.webp",
      "coverAlt": "Warm heritage architecture and shaded courtyard details evoking old neighbourhoods in Goa",
      "eyebrow": "Essential Blueprint",
      "title": "Goa Beyond the Beach",
      "intro": "Five days balancing Old Goa, Panjim, Fontainhas, local food, village drives, and enough coast to remember that this is still Goa.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Goa"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Heritage, food & coast"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 620",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Goa Beyond the Beach",
      "shareText": "Five days balancing Old Goa, Panjim, Fontainhas, local food, village drives, and enough coast to remember that this is still Goa."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Use Panjim or a nearby heritage area as the first base, then finish closer to the coast if desired. The route balances culture and beach without pretending either one needs to win."
              ],
              "caption": "Panjim → Old Goa → Fontainhas → South Goa",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Old Goa heritage",
                "Fontainhas and local neighbourhoods",
                "Coastal time",
                "Relaxed boutique stay"
              ]
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Panjim Arrival",
                  "bodySubtitle": "DAY 1 | PANJIM",
                  "listItems": [
                    "Check in.",
                    "Evening riverfront or neighbourhood walk.",
                    "Easy dinner."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Old Goa & Fontainhas",
                  "bodySubtitle": "DAY 2 | HERITAGE DAY",
                  "listItems": [
                    "Major churches and historic core.",
                    "Fontainhas walk.",
                    "Local lunch."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/journal/journal1.webp",
                      "alt": "Landscape view representing old goa & fontainhas on the goa beyond the beach route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Food & Villages",
                  "bodySubtitle": "DAY 3 | CENTRAL GOA",
                  "listItems": [
                    "Market or village stop.",
                    "Hosted meal or food walk.",
                    "Free afternoon."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Coast Day",
                  "bodySubtitle": "DAY 4 | SOUTH OR CENTRAL COAST",
                  "listItems": [
                    "Move toward the coast if changing base.",
                    "Beach time.",
                    "No compulsory cultural enrichment after 4 p.m. 😂"
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | GOA",
                  "listItems": [
                    "Breakfast.",
                    "Airport transfer."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Goa Route Basics",
              "items": [
                "Private airport transfers.",
                "One heritage-focused guided day.",
                "Optional food or village experience.",
                "Flexible coastal time."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Pack lightweight clothing.",
                "Carry respectful attire for church visits.",
                "Use sun protection.",
                "Avoid scheduling long cross-state drives during peak traffic windows."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Goa becomes more interesting the moment the beach stops being the only sentence.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "masonry",
            "data": {
              "eyebrow": "ROUTE SNAPSHOTS",
              "title": "A Few Visual Notes",
              "images": [
                {
                  "src": "/images/journal/journal1.webp",
                  "alt": "Travel image 1 supporting the goa beyond the beach journey in Goa",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 1 from Goa."
                },
                {
                  "src": "/images/home/solo-landscape.webp",
                  "alt": "Travel image 2 supporting the goa beyond the beach journey in Goa",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 2 from Goa."
                },
                {
                  "src": "/images/journal/journal4.webp",
                  "alt": "Travel image 3 supporting the goa beyond the beach journey in Goa",
                  "width": 1200,
                  "height": 800,
                  "caption": "Route snapshot 3 from Goa."
                }
              ],
              "captionMob": false,
              "captionPc": true
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "Choose the base based on what matters more: Panjim and heritage access, or immediate beach time. Trying to be beside everything usually means being beside traffic."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This is still an easy holiday. It simply gives Goa a little more context before handing the afternoon back to the sea."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "GOA CULTURE & FOOD CURATOR • GOA",
              "name": "Ines D'Souza",
              "bio": "Ines builds easy Goa routes around neighbourhood history, regional food, village life, and sensible combinations with coastal stays.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Ines D'Souza, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in heritage, food & coast.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    "meta": {
      "id": "ess-12",
      "slug": "pondicherry-and-the-coromandel-coast",
      "type": "essential",
      "featured": true,
      "title": "Pondicherry & the Coromandel Coast",
      "region": "Puducherry & Tamil Nadu",
      "days": 5,
      "categories": [
        "culture",
        "stays",
        "bespoke"
      ],
      "tags": [
        "#PONDICHERRY",
        "#COROMANDEL",
        "#MAHABALIPURAM"
      ],
      "intro": "A five-day coastal route from Chennai through Mahabalipuram to Pondicherry for shore temples, old quarters, cafés, and an easy seaside rhythm.",
      "image": "/images/home/journey-pc1.webp",
      "alt": "Coastal road and heritage atmosphere along South India's Coromandel shoreline",
      "featuredDescription": "A dependable 5-day route focused on coastal heritage, sensible logistics, comfortable pacing, and easy customization.",
      "highlights": [
        {
          "icon": "temple",
          "label": "Mahabalipuram monuments"
        },
        {
          "icon": "village",
          "label": "Tamil coastal settlements"
        },
        {
          "icon": "wellness",
          "label": "Slow Pondicherry mornings"
        },
        {
          "icon": "boat",
          "label": "Coromandel shoreline time"
        }
      ],
      "collaborator": {
        "name": "Coromandel Heritage Partners",
        "role": "Regional Coastal Heritage Partner",
        "avatar": "/images/testimonials/avatar.webp"
      }
    },
    "relatedSlugs": [
      "madurai-and-chettinad-heritage-trail",
      "fort-kochi-heritage-weekend",
      "goa-beyond-the-beach"
    ],
    "seo": {
      "pageTitle": "Pondicherry & the Coromandel Coast — 5-Day Essential Itinerary",
      "pageDesc": "A five-day coastal route from Chennai through Mahabalipuram to Pondicherry for shore temples, old quarters, cafés, and an easy seaside rhythm.",
      "ogImage": "/images/favicons/sreejith-og-image.jpg",
      "ogImageAlt": "Coastal road and heritage atmosphere along South India's Coromandel shoreline",
      "breadcrumbName": "Pondicherry & the Coromandel Coast",
      "publishDate": "2026-11-07"
    },
    "header": {
      "breadcrumbs": [
        {
          "label": "Home",
          "to": "/"
        },
        {
          "label": "Itineraries",
          "to": "/itineraries"
        },
        {
          "label": "Pondicherry & the Coromandel Coast"
        }
      ],
      "coverImage": "/images/home/journey-pc1.webp",
      "coverAlt": "Coastal road and heritage atmosphere along South India's Coromandel shoreline",
      "eyebrow": "Essential Blueprint",
      "title": "Pondicherry & the Coromandel Coast",
      "intro": "A five-day coastal route from Chennai through Mahabalipuram to Pondicherry for shore temples, old quarters, cafés, and an easy seaside rhythm.",
      "journeyDetails": [
        {
          "label": "Duration",
          "value": "5 days"
        },
        {
          "label": "Pace",
          "value": "Easy"
        },
        {
          "label": "Region",
          "value": "Puducherry & Tamil Nadu"
        },
        {
          "label": "Group",
          "value": "1–6 guests"
        },
        {
          "label": "Focus",
          "value": "Coastal heritage"
        },
        {
          "label": "Style",
          "value": "Essential"
        }
      ]
    },
    "sidebar": {
      "budgetLabel": "STARTING BUDGET",
      "price": "From USD 560",
      "priceUnit": "per person",
      "ctaTitle": "Want the simple route, adjusted for you?",
      "ctaSubtitle": "Change the dates, stay level, pace, or one or two experiences without rebuilding the whole thing.",
      "planLabel": "Plan Your Journey",
      "planTo": "/planYourJourney",
      "enquireLabel": "Enquire",
      "enquireTo": "/contact",
      "shareTitle": "Pondicherry & the Coromandel Coast",
      "shareText": "A five-day coastal route from Chennai through Mahabalipuram to Pondicherry for shore temples, old quarters, cafés, and an easy seaside rhythm."
    },
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "blocks": [
          {
            "type": "summary",
            "data": {
              "eyebrow": "THE JOURNEY AT A GLANCE",
              "title": "Route Overview",
              "paragraphs": [
                "Keep the route linear: leave Chennai, stop properly in Mahabalipuram, then settle in Pondicherry. It is short enough that there is no need for clever detours."
              ],
              "caption": "Chennai → Mahabalipuram → Pondicherry",
              "highlightsTitle": "What You Get",
              "highlights": [
                "Mahabalipuram monuments",
                "Tamil coastal settlements",
                "Slow Pondicherry mornings",
                "Coromandel shoreline time"
              ],
              "image": "/images/itineraries/dummy12.webp",
              "imageAlt": "Traveller view representing the pondicherry & the coromandel coast journey across Puducherry & Tamil Nadu",
              "imageAspectRatio": "4 / 5"
            }
          }
        ]
      },
      {
        "id": "itinerary",
        "label": "Itinerary",
        "blocks": [
          {
            "type": "itinerary",
            "data": {
              "introTitle": "The Pace & Flow",
              "introParagraphs": [
                "5 days, short transfers where possible, and a practical sequence that leaves room for weather, opening times, and actual human energy."
              ],
              "title": "Route Progression",
              "items": [
                {
                  "id": "phase-01",
                  "headerTitle": "Chennai to Mahabalipuram",
                  "bodySubtitle": "DAY 1 | COROMANDEL COAST",
                  "listItems": [
                    "Private coastal transfer.",
                    "Check in near Mahabalipuram.",
                    "Late afternoon monument walk."
                  ]
                },
                {
                  "id": "phase-02",
                  "headerTitle": "Mahabalipuram Morning",
                  "bodySubtitle": "DAY 2 | HERITAGE",
                  "listItems": [
                    "Early monument circuit.",
                    "Lunch.",
                    "Continue to Pondicherry."
                  ],
                  "imageOrientation": "landscape",
                  "images": [
                    {
                      "src": "/images/home/journey-pc1.webp",
                      "alt": "Landscape view representing mahabalipuram morning on the pondicherry & the coromandel coast route"
                    }
                  ]
                },
                {
                  "id": "phase-03",
                  "headerTitle": "Old Quarters",
                  "bodySubtitle": "DAY 3 | PONDICHERRY",
                  "listItems": [
                    "Walking orientation.",
                    "Market or café stop.",
                    "Free evening."
                  ]
                },
                {
                  "id": "phase-04",
                  "headerTitle": "Slow Coastal Day",
                  "bodySubtitle": "DAY 4 | PONDICHERRY",
                  "listItems": [
                    "Choose one local outing.",
                    "Keep the rest unscheduled.",
                    "Sunset by the promenade."
                  ]
                },
                {
                  "id": "phase-05",
                  "headerTitle": "Departure",
                  "bodySubtitle": "DAY 5 | CHENNAI OR ONWARD",
                  "listItems": [
                    "Breakfast.",
                    "Private onward transfer."
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        "id": "details",
        "label": "Details",
        "blocks": [
          {
            "type": "checklist",
            "data": {
              "title": "Coastal Route Basics",
              "items": [
                "Private road transfers from Chennai.",
                "One guided Mahabalipuram heritage visit.",
                "Central Pondicherry stay.",
                "Flexible local time after arrival."
              ]
            }
          },
          {
            "type": "numbered-list",
            "data": {
              "title": "Before You Go",
              "items": [
                "Start monument visits early in hot months.",
                "Carry sun protection.",
                "Pack modest attire for temple contexts.",
                "Allow extra road time around Chennai traffic."
              ]
            }
          }
        ]
      },
      {
        "id": "essence",
        "label": "Essence",
        "blocks": [
          {
            "type": "quote",
            "data": {
              "quote": "Mahabalipuram gives the journey its history; Pondicherry gives it somewhere to exhale.",
              "author": "ESSENTIAL ROUTE NOTE"
            }
          },
          {
            "type": "tip-note",
            "data": {
              "title": "PRACTICAL NOTE",
              "text": "The route works because it is linear. Resist the urge to bolt unrelated day trips onto a five-day coastal break."
            }
          },
          {
            "type": "summary",
            "data": {
              "eyebrow": "PARTING THOUGHTS",
              "title": "Why This Route Works",
              "paragraphs": [
                "This is a neat southern coastal add-on: one major heritage stop, one relaxed town, and enough sea between them to make the transfer feel like part of the trip."
              ]
            }
          },
          {
            "type": "designer-profile",
            "data": {
              "eyebrow": "REGIONAL COASTAL HERITAGE PARTNER • PUDUCHERRY & TAMIL NADU",
              "name": "Coromandel Heritage Partners",
              "bio": "A regional operating partner coordinating heritage guiding, coastal transfers, and simple stay logistics between Chennai, Mahabalipuram, and Pondicherry.",
              "avatar": "/images/testimonials/avatar.webp",
              "avatarAlt": "Profile placeholder representing Coromandel Heritage Partners, curator for this essential travel route"
            }
          }
        ]
      },
      {
        "id": "essentials",
        "label": "Essentials",
        "blocks": [
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "GOOD TO KNOW",
              "title": "Frequently Asked Questions",
              "items": [
                {
                  "id": "faq-01",
                  "question": "Can the route be adjusted for our dates and pace?",
                  "paragraphs": [
                    "Yes. Essential routes are starting templates, so nights, transfer points, and activity intensity can be adjusted before confirmation."
                  ]
                },
                {
                  "id": "faq-02",
                  "question": "Who is this route best suited to?",
                  "listItems": [
                    "Travellers wanting a straightforward 5-day plan.",
                    "Guests interested in coastal heritage.",
                    "People who prefer dependable logistics over a heavily authored expedition."
                  ]
                },
                {
                  "id": "faq-03",
                  "question": "Are all activities fixed?",
                  "paragraphs": [
                    "No. Weather, local opening times, transport schedules, and personal energy can change the daily order without changing the core route."
                  ]
                },
                {
                  "id": "faq-04",
                  "question": "What does the starting price cover?",
                  "listTitle": "Typical core inclusions:",
                  "listItems": [
                    "Accommodation in the selected category.",
                    "Private transfers listed in the route.",
                    "Guiding or activity support where specified.",
                    "On-ground coordination for the confirmed itinerary."
                  ]
                }
              ]
            }
          },
          {
            "type": "customer-query",
            "data": {
              "eyebrow": "BOOKING & ROUTE POLICIES",
              "title": "Reservation & Cancellation Terms",
              "items": [
                {
                  "id": "term-01",
                  "question": "How is the booking confirmed?",
                  "paragraphs": [
                    "A confirmation deposit is collected after the final route, stay category, and travel dates are approved. Supplier-specific non-refundable amounts are identified before payment."
                  ]
                },
                {
                  "id": "term-02",
                  "question": "What happens if dates change?",
                  "paragraphs": [
                    "We first try to move the same services to new dates. Any cancellation or amendment cost depends on the actual hotel, transport, guide, permit, and activity terms attached to the booking."
                  ],
                  "listItems": [
                    "Date changes remain subject to availability.",
                    "Non-refundable supplier charges are passed through at cost.",
                    "Any revised balance is confirmed before rebooking."
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  }
  
]