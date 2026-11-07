<!-- ~/app/pages/itinerary-dummy.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue'
import ItineraryHeader, { type ItineraryHeaderData } from '~/components/itineraries/ItineraryHeader.vue'
import ItineraryScrollNav, { type ScrollNavSection } from '~/components/itineraries/ItineraryScrollNav.vue'
import ItinerarySidebar, { type ItinerarySidebarData } from '~/components/itineraries/ItinerarySidebar.vue'
import ItineraryLightbox from '~/components/itineraries/ItineraryLightbox.vue'
import type { LightboxMediaItem, LightboxOpenPayload } from '~/components/Lightbox.vue'
import RelatedItineraries, { type RelatedItinerariesConfig } from '~/components/RelatedItineraries.vue'
import type { ItinerarySummaryBlockData } from '~/components/itineraries/blocks/BlockSummary.vue'
import type { ItineraryProgressionBlockData } from '~/components/itineraries/blocks/BlockItinerary.vue'
import type { ItineraryChecklistBlockData } from '~/components/itineraries/blocks/BlockChecklist.vue'
import type { ItineraryNumberedListBlockData } from '~/components/itineraries/blocks/BlockNumberedList.vue'
import type { ItineraryQuoteBlockData } from '~/components/itineraries/blocks/BlockQuote.vue'
import type { ItineraryTipNoteBlockData } from '~/components/itineraries/blocks/BlockTipNote.vue'
import type { ItineraryDesignerProfileBlockData } from '~/components/itineraries/blocks/BlockDesignerProfile.vue'
import type { ItineraryCustomerQueryBlockData } from '~/components/itineraries/blocks/BlockCustomerQuery.vue'
import type { ItineraryMasonryBlockData } from '~/components/itineraries/blocks/BlockMasonry.vue'
import type { ItineraryYoutubeBlockData } from '~/components/itineraries/blocks/BlockYoutube.vue'
import type { ItinerarySliderBlockData } from '~/components/itineraries/blocks/BlockSlider.vue'
import { ITINERARIES_DATABASE } from '~~/server/utils/itinerariesData'
import { useTravelSeo } from '~/composables/useTravelSeo'

export interface ItinerarySeoConfig {
  pageTitle?: string
  pageDesc?: string
  /** 1200x630 .jpg social sharing image */
  ogImage?: string
  ogImageAlt?: string
  breadcrumbName?: string
  publishDate?: string
}

export interface ItineraryUnifiedRecord {
  slug: string
  seo?: ItinerarySeoConfig
  header: ItineraryHeaderData
  sidebar: ItinerarySidebarData
  sections: ItinerarySectionGroup[]
}



// =========================================================
// UNIFIED SECTION-GROUPED ITINERARY SCHEMA
// =========================================================
export type ItineraryContentBlock =
  | { type: 'summary'; data: ItinerarySummaryBlockData }
  | { type: 'itinerary'; data: ItineraryProgressionBlockData }
  | { type: 'checklist'; data: ItineraryChecklistBlockData }
  | { type: 'numbered-list'; data: ItineraryNumberedListBlockData }
  | { type: 'quote'; data: ItineraryQuoteBlockData }
  | { type: 'tip-note'; data: ItineraryTipNoteBlockData }
  | { type: 'designer-profile'; data: ItineraryDesignerProfileBlockData }
  | { type: 'customer-query'; data: ItineraryCustomerQueryBlockData }
  | { type: 'masonry'; data: ItineraryMasonryBlockData }
  | { type: 'youtube'; data: ItineraryYoutubeBlockData }
  | { type: 'slider'; data: ItinerarySliderBlockData }

export interface ItinerarySectionGroup {
  id: string
  label: string
  blocks: ItineraryContentBlock[]
}

export interface ItineraryUnifiedRecord {
  slug: string
  header: ItineraryHeaderData
  sidebar: ItinerarySidebarData
  sections: ItinerarySectionGroup[]
}

const { forceTransparent } = useHeaderTheme()

const syncLightHeader = () => {
  forceTransparent.value = false
}

onMounted(syncLightHeader)
onActivated(syncLightHeader)

// =========================================================
// ROOT LIGHTBOX STATE (Handles all image blocks on the page)
// =========================================================
const lightboxState = ref<{
  isOpen: boolean
  items: LightboxMediaItem[]
  index: number
}>({
  isOpen: false,
  items: [],
  index: 0
})

const openLightbox = (payload: LightboxOpenPayload) => {
  if (!payload?.items?.length) return
  lightboxState.value = {
    isOpen: true,
    items: payload.items,
    index: payload.index || 0
  }
}

const closeLightbox = () => {
  lightboxState.value.isOpen = false
}

// =========================================================
// SINGLE UNIFIED ITINERARY JSON SOURCE
// Order: Overview -> Itinerary -> Details -> Essence -> Essentials
// =========================================================
const itineraryRecord: ItineraryUnifiedRecord = {
  slug: 'stories-along-the-malabar-coast',

  seo: {
    pageTitle: 'Stories Along the Malabar Coast — 12-Day Kerala Cultural Itinerary',
    pageDesc:
      'Follow the old trading ports of the Malabar Coast on a private 12-day luxury journey through Fort Kochi, Vembanad backwaters, Periyar, Munnar, and Calicut.',
    ogImage: '/images/favicons/sreejith-og-image.jpg',
    ogImageAlt: 'Wooden canoe gliding through palm-lined Malabar backwaters at golden hour',
    breadcrumbName: 'Malabar Coast',
    publishDate: '2026-02-01'
  },

  header: {
    breadcrumbs: [
      { label: 'Home', to: '/' },
      { label: 'Itineraries', to: '/itineraries' },
      { label: 'Malabar Coast' }
    ],
    coverImage: '/images/home/solo-landscape.webp',
    coverAlt: 'Wooden canoe gliding through palm-lined Malabar backwaters at golden hour',
    eyebrow: 'Signature Itinerary',
    title: 'Stories Along the Malabar Coast',
    intro:
      'Follow the old trading ports of the Malabar Coast, where boatbuilders, spice merchants and fishing families share their stories.',
    journeyDetails: [
      { label: 'Duration', value: '12 days' },
      { label: 'Pace', value: 'Unhurried' },
      { label: 'Region', value: 'Kerala' },
      { label: 'Group', value: '1–4 guests' },
      { label: 'Focus', value: 'Living culture' },
      { label: 'Distance', value: '320 km' }
    ]
  },

  sidebar: {
    budgetLabel: 'ESTIMATED BUDGET',
    price: 'From USD 1,471',
    priceUnit: 'per person',
    ctaTitle: 'Want this trip, but shaped around you?',
    ctaSubtitle:
      'Every route is a starting point—talk to us to adjust the pace, stays, or detours.',
    planLabel: 'Plan Your Journey',
    planTo: '/planYourJourney',
    enquireLabel: 'Enquire',
    enquireTo: '/contact',
    partnerEyebrow: 'FOR TRAVEL PARTNERS',
    consultLabel: 'Consult With Me',
    consultTo: '/planYourJourney',
    phone: '+91 99433 60478',
    whatsapp: '919943360478',
    email: 'sreejith@sreejithtravel.com',
    shareTitle: 'Stories Along the Malabar Coast',
    shareText:
      'Follow the old trading ports of the Malabar Coast, where boatbuilders, spice merchants and fishing families share their stories.'
  },

  sections: [
    // ---------------------------------------------------------
    // 1. OVERVIEW (Summary + YouTube Film)
    // ---------------------------------------------------------
    {
      id: 'overview',
      label: 'Overview',
      blocks: [
        {
          type: 'summary',
          data: {
            eyebrow: 'THE JOURNEY AT A GLANCE',
            title: 'Route Overview',
            paragraphs: [
              'Traverse the legendary spice routes of Kerala and ascend into the misty tea-clad heights of the Western Ghats. Designed for travellers who favour deep historical context, private heritage stays, and slow, unhurried exploration.',
              'From the historic harbour lanes of Fort Kochi to hand-stitched rice barges drifting across Vembanad Lake and cloud-wrapped planters’ bungalows in the high ranges, every stop is paced so you experience the living culture of the region intimately.'
            ],
            image: '/images/itineraries/dummy1.webp',
            imageAlt: 'Traditional wooden boat resting among emerald lotus leaves in the Kerala backwaters',
            imageAspectRatio: '4 / 5',
            caption: 'Cochin → Alleppey → Periyar → Munnar → Palakkad → Calicut',
            highlightsTitle: 'Highlights of the Journey',
            highlights: [
              'Stay in a 200-year-old restored colonial mansion in Fort Kochi.',
              'Overnight cruise on a private, non-motorized traditional Kettuvallam barge.',
              'Exclusive orthodox tea-tasting masterclass with a regional estate manager.',
              'Guided twilight walks in the Periyar forest buffer with indigenous trackers.'
            ]
          }
        },
        {
          type: 'youtube',
          data: {
            eyebrow: 'FIELD DISPATCH',
            title: 'Glimpses Along the Waterline',
            video: {
              videoId: '4KtLGaNl9VQ',
              thumbnail: '/images/home/travel-video.webp',
              alt: 'Artisan weaving basket during a cultural travel experience in India',
              width: 800,
              height: 450
            },
            caption: 'A quiet morning drifting past Kuttanad fishing villages and ancestral spice quays.'
          }
        }
      ]
    },

    // ---------------------------------------------------------
    // 2. ITINERARY
    // ---------------------------------------------------------
    {
      id: 'itinerary',
      label: 'Itinerary',
      blocks: [
        {
          type: 'itinerary',
          data: {
            introTitle: 'The Pace & Flow',
            introParagraphs: [
              'Before diving into the daily progression, it is important to note that this blueprint relies heavily on the concept of slow travel. We ensure you spend at least two to three nights at each sanctuary, eliminating the exhaustion of constant repacking and driving.'
            ],
            title: 'Detailed Progression',
            items: [
              {
                id: 'phase-01',
                headerTitle: 'Phase 01: The Maritime History',
                bodySubtitle: 'DAYS 1–3 | FORT KOCHI & MATTANCHERRY',
                paragraphs: [
                  'Arrive at Cochin International Airport where your private chauffeur awaits. Check into an ancestral home turned boutique sanctuary tucked along a quiet heritage street.',
                  'Spend the next two days walking through ancient spice warehouses, visiting the 16th-century Paradesi Synagogue, and dining on fresh pearl-spot fish beneath the cantilevered Chinese fishing nets.',
                  'In the evenings, gather in private courtyard gardens for conversations with local maritime historians who trace five centuries of Arab, Portuguese, Dutch, and Malabar trade.'
                ],
                listTitle: 'Signature Encounters in Fort Kochi',
                listItems: [
                  'Private scholar-led walk through Jew Town and Mattancherry spice auctions.',
                  'Sunset harbour cruise aboard a restored wooden motor launch.',
                  'Heirloom Syrian Christian & Malabar coastal tasting dinner.'
                ],
                imageOrientation: 'portrait',
                images: [
                  {
                    src: '/images/home/journey-mob.webp',
                    alt: 'Lantern-lit colonial heritage street in Fort Kochi after dusk'
                  }
                ]
              },
              {
                id: 'phase-02',
                headerTitle: 'Phase 02: Labyrinths of Vembanad',
                bodySubtitle: 'DAYS 4–5 | BACKWATERS & KUTTANAD VILLAGES',
                paragraphs: [
                  'Board a private, hand-stitched Kettuvallam rice barge crewed by a personal chef and two oarsmen. Glide away from the main waterways into narrow, palm-shaded village canals where life unfolds at the water’s edge.',
                  'Wake to mist rising off the backwaters, watch toddy tappers climb coconut palms at dawn, and step ashore to visit coir-spinning guilds and ancient waterside temples.'
                ],
                imageOrientation: 'square',
                imageLayout: 'side-by-side',
                images: [
                  {
                    src: '/images/home/travel-video.webp',
                    alt: 'Private thatched Kettuvallam houseboat drifting across calm Vembanad waters'
                  }
                ]
              },
              {
                id: 'phase-03',
                headerTitle: 'Phase 03: The Cardamom Ascent',
                bodySubtitle: 'DAYS 6–7 | PERIYAR & HIGHLAND SPICE ESTATES',
                paragraphs: [
                  'Ascend into the cool highland spice belt of Periyar, staying inside a secluded plantation homestead surrounded by shade-grown cardamom and wild black pepper.'
                ],
                listTitle: 'Highland Experiences Included',
                listItems: [
                  'Guided twilight walk along the Periyar rainforest buffer with indigenous trackers.',
                  'Private spice-harvesting walk through cardamom, clove, and vanilla groves.',
                  'Farm-to-table plantation lunch hosted by a third-generation planter family.',
                  'Early morning bamboo-rafting excursion across tranquil forest reservoirs.'
                ],
                imageOrientation: 'square',
                imageLayout: 'block',
                images: [
                  {
                    src: '/images/impact/impact1.webp',
                    alt: 'Sunlit forest road winding through the Western Ghats spice hills'
                  }
                ]
              },
              {
                id: 'phase-04',
                headerTitle: 'Phase 04: Ancestral Courtyards & Sacred Groves',
                bodySubtitle: 'DAY 8 | CENTRAL TRAVANCORE FOOTHILLS',
                paragraphs: [
                  'Journey through quiet river valleys to visit restored timber-and-laterite homesteads, meeting master woodcarvers and traditional architects who preserve Kerala’s vernacular building craft.'
                ],
                imageOrientation: 'portrait',
                images: [
                  {
                    src: '/images/itineraries/dummy3.webp',
                    alt: 'Morning sunbeams filtering through ancient avenue trees along a heritage trail'
                  },
                  {
                    src: '/images/itineraries/dummy8.webp',
                    alt: 'Quiet wooden bench beneath flowering garden trees at a heritage estate'
                  }
                ]
              },
              {
                id: 'phase-05',
                headerTitle: 'Phase 05: The Cloud Forests of the High Range',
                bodySubtitle: 'DAY 9 | MUNNAR & ERAVIKULAM RIDGES',
                paragraphs: [
                  'Climb along winding mountain roads into the high-range shola-grassland mosaic of Munnar. Settle into a colonial-era stone bungalow surrounded by heirloom tea gardens and drifting valley clouds.'
                ],
                listItems: [
                  'Dawn conservation walk in search of the endemic Nilgiri Tahr.',
                  'Private orthodox tea-tasting session inside a historic 19th-century factory.'
                ],
                imageOrientation: 'landscape',
                images: [
                  {
                    src: '/images/journal/journal2.webp',
                    alt: 'Misty green escarpments and cloud forests of the Western Ghats'
                  }
                ]
              },
              {
                id: 'phase-06',
                headerTitle: 'Phase 06: Artisans & Culinary Heritage of the Nila Valley',
                bodySubtitle: 'DAY 10 | PALAKKAD GAP & KUTHAMPULLY',
                paragraphs: [
                  'Descend through the dramatic Palakkad Gap into emerald paddy plains bordered by palmyra palms. Spend the day inside master handloom weaving clusters and traditional ancestral kitchens.'
                ],
                imageOrientation: 'landscape',
                images: [
                  {
                    src: '/images/journal/journal3.webp',
                    alt: 'Master weaver working at a traditional wooden handloom in Kuthampully'
                  },
                  {
                    src: '/images/journal/journal4.webp',
                    alt: 'Traditional Kerala feast served on a fresh green plantain leaf with brass vessels'
                  }
                ]
              },
              {
                id: 'phase-07',
                headerTitle: 'Phase 07: Historic Timber Quays of North Malabar',
                bodySubtitle: 'DAY 11 | BEYPORE & CALICUT COAST',
                listTitle: 'North Malabar Coastal Encounters',
                listItems: [
                  'Visit the legendary Uru wooden dhow shipyards of Beypore with master shipwrights.',
                  'Explore Calicut’s historic spice bazaars and traditional timber trading quays.'
                ],
                imageOrientation: 'square',
                images: [
                  {
                    src: '/images/journal/journal1.webp',
                    alt: 'Carved wooden pillars and warm courtyard inside a traditional Malabar nalukettu'
                  },
                  {
                    src: '/images/home/journey-pc.webp',
                    alt: 'Warmly lit heritage trading street along the Malabar coast at twilight'
                  }
                ]
              },
              {
                id: 'phase-08',
                headerTitle: 'Phase 08: Departure & Onward Connections',
                bodySubtitle: 'DAY 12 | CALICUT OR COCHIN INTERNATIONAL AIRPORT',
                paragraphs: [
                  'Enjoy an unhurried breakfast overlooking the Arabian Sea before your private chauffeur transfers you to the airport for your onward flight home.'
                ],
                listItems: [
                  'Flexible late-checkout coordination subject to flight schedules.',
                  'Dedicated airport assistance and farewell artisan spice hamper.'
                ]
              }
            ]
          }
        }
      ]
    },

    // ---------------------------------------------------------
    // 3. DETAILS (Unordered Checklist + Ordered Numbered List)
    // ---------------------------------------------------------
    {
      id: 'details',
      label: 'Details',
      blocks: [
        {
          type: 'checklist',
          data: {
            title: 'Our Sanctuary & Lodging Standards',
            items: [
              'Restored colonial mansions and ancestral homes honoring local heritage.',
              'Intimate eco-lodges built without felling a single native forest tree.',
              'Working spice and tea estates prioritizing organic highland cultivation.',
              'Absolute privacy with dedicated regional hosts and on-site concierges.'
            ],
            image: '/images/journal/journal1.webp',
            imageAlt: 'Sunlit teakwood pillars and traditional courtyard of a restored Kerala heritage mansion',
            imageAspectRatio: '1 / 1'
          }
        },
        {
          type: 'numbered-list',
          data: {
            title: 'Suggested Packing & Preparation',
            items: [
              'Lightweight, breathable linen or pure cotton clothing for coastal humidity.',
              'A warm fleece jacket or light wool sweater for cool highland evenings in Munnar.',
              'Comfortable, enclosed walking shoes for spice estate and forest trails.',
              'Modest shoulder-and-knee-covering attire for visits to historic temples and synagogues.',
              'Eco-friendly sunscreen and natural, DEET-free botanical insect repellent.'
            ]
          }
        },
        {
          type: 'slider',
          data: {
            eyebrow: 'SANCTUARY SHOWCASE',
            title: 'Inside Our Heritage Estates & Barges',
            width: 1200,
            height: 800,
            autoplay: false,
            captionMob: true,
            captionPc: true,
            images: [
              {
                src: '/images/journal/journal1.webp',
                caption: 'Teakwood pillared courtyard inside an ancestral Fort Kochi sanctuary.'
              },
              {
                src: '/images/home/travel-video.webp',
                caption: 'Private Kettuvallam barge gliding across the quiet waters of Vembanad Lake.'
              },
              {
                src: '/images/home/journey-pc.webp',
                caption: 'Evening lanterns illuminating historic spice merchant quarters in Mattancherry.'
              },
              {
                src: '/images/journal/journal2.webp',
                caption: 'High-altitude cloud forests and tea ridges surrounding our Munnar bungalow.'
              },
              {
                src: '/images/journal/journal4.webp',
                caption: 'Heirloom Malabar coastal cuisine prepared fresh by your private estate chef.'
              },
              {
                src: '/images/impact/impact1.webp',
                caption: 'Shaded spice-garden trails leading to our secluded Periyar homestead.'
              },
              {
                src: '/images/journal/journal5.webp',
                caption: 'Dawn canoe excursion through narrow village canals in Kuttanad.'
              }
            ]
          }
        },
      ]
    },

    // ---------------------------------------------------------
    // 4. ESSENCE (Quote + Masonry Gallery + Tip Note + Conclusion Summary + Designer Profile)
    // ---------------------------------------------------------
    {
      id: 'essence',
      label: 'Essence',
      blocks: [
        {
          type: 'quote',
          data: {
            quote:
              'To truly understand the Malabar coast, one must look beyond the postcard perfection of the palm fringes and listen to the murmurs of its ancient trading courtyards.',
            author: "THE DESIGNER'S NOTEBOOK"
          }
        },
        {
          type: 'masonry',
          data: {
            eyebrow: 'VISUAL NOTES',
            title: 'Moments Along the Route',
            captionMob: true,
            captionPc: true,
            images: [
              {
                src: '/images/journal/journal1.webp',
                width: 1200,
                height: 800,
                caption: 'Carved teakwood pillars inside an ancestral Malabar homestead.'
              },
              {
                src: '/images/itineraries/dummy2.webp',
                width: 800,
                height: 1000,
                caption: 'Stone garden path winding through a highland spice sanctuary.'
              },
              {
                src: '/images/journal/journal3.webp',
                width: 1200,
                height: 800,
                caption: 'Master weaver crafting handloomed cotton in Kuthampully.'
              },
              {
                src: '/images/home/forest-portrait.webp',
                width: 800,
                height: 1100,
                caption: 'First light slanting through the Western Ghats shola canopy.'
              },
              {
                src: '/images/journal/journal4.webp',
                width: 1200,
                height: 800,
                caption: 'Heirloom coastal dishes served on fresh plantain leaf.'
              },
              {
                src: '/images/itineraries/dummy10.webp',
                width: 800,
                height: 1050,
                caption: 'Tranquil courtyard waters reflecting coconut palms at midday.'
              }
            ]
          }
        },
        {
          type: 'tip-note',
          data: {
            title: 'SEASONAL CLIMATE NOTE',
            text: 'While the winter months (November to February) offer crisp, dry coastal breezes and cool mountain mornings, the monsoon (June to August) transforms Kerala into a vivid, washed-green sanctuary—ideal for unhurried Ayurvedic rejuvenation.'
          }
        },
        {
          type: 'summary',
          data: {
            eyebrow: 'PARTING THOUGHTS',
            title: 'The Rhythm You Carry Home',
            paragraphs: [
              'Long after the scent of wild cardamom and woodsmoke fades from your luggage, the Malabar Coast lingers in quieter ways—the unhurried cadence of an evening boat crossing, the warmth of hand-loomed cotton, and conversations shared over freshly brewed estate tea.',
              'This route is designed not as a checklist of monuments, but as a living dialogue with the craftspeople, naturalists, and families who keep Kerala’s coastal and highland heritage alive.'
            ],
            image: '/images/journal/journal5.webp',
            imageAlt: 'Golden morning sunbeams slanting through tall highland forest trees',
            imageAspectRatio: '4 / 5',
            caption: 'Morning light filtering through the highland shola forests of the Western Ghats.'
          }
        },
        {
          type: 'designer-profile',
          data: {
            eyebrow: 'LEAD ROUTE ARCHITECT • KERALA, INDIA',
            name: 'Sreejith Raghavan',
            bio: 'Having traversed the Western Ghats and Malabar ports for over a decade, Sreejith designed this blueprint to reveal the delicate balance between Kerala’s maritime trading history and its profound ecological biodiversity.',
            avatar: '/images/testimonials/avatar.webp',
            avatarAlt: 'Portrait of Sreejith Raghavan, Lead Route Architect'
          }
        }
      ]
    },

    // ---------------------------------------------------------
    // 5. ESSENTIALS (FAQs + Booking & Route Terms)
    // ---------------------------------------------------------
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
                question: 'Can this Malabar & Western Ghats route be tailored to our preferred dates and pace?',
                paragraphs: [
                  'Every blueprint we craft is privately designed around your travel dates, interests, and preferred rhythm. You can extend your stay in the backwaters, add a dedicated Ayurvedic retreat, or adjust driving stages before we finalize your sanctuaries.'
                ],
                listTitle: 'Ways we routinely personalize this journey:',
                listItems: [
                  'Adding private culinary sessions or temple architecture walks with regional scholars.',
                  'Adjusting the number of nights at each heritage mansion or highland tea bungalow.',
                  'Arranging specialized photography, birding, or textile-weaving immersions.'
                ]
              },
              {
                id: 'faq-02',
                question: 'What is the ideal season to travel along the Malabar Coast?',
                paragraphs: [
                  'October through March brings clear skies, calm coastal waters, and crisp highland mornings—ideal for harbour walks, wildlife tracking, and open-air courtyard dining.',
                  'For travellers drawn to lush landscapes, quiet sanctuaries, and authentic Ayurvedic treatments, the monsoon months from June to September offer an unforgettable emerald atmosphere.'
                ]
              },
              {
                id: 'faq-03',
                question: 'What is included in the estimated journey budget?',
                listTitle: 'Core inclusions across all our signature blueprints:',
                listItems: [
                  'Handpicked heritage mansions, boutique eco-lodges, and private Kettuvallam barge stays.',
                  'Dedicated chauffeur-driven luxury vehicle from arrival in Cochin to final departure.',
                  'Privately guided cultural walks, spice estate tastings, and forest reserve entry permits.',
                  '24/7 on-ground concierge support from Sreejith and our regional hosts.'
                ]
              },
              {
                id: 'faq-04',
                question: 'How physically demanding are the walks and highland excursions?',
                paragraphs: [
                  'This journey is paced as an unhurried cultural and nature immersion rather than a strenuous trek. All estate walks and forest trails are led by private naturalists who adapt the distance and terrain to your comfort.'
                ],
                listItems: [
                  'Fort Kochi & Calicut walks: Easy, flat heritage lanes (1.5 to 2 hours at a relaxed pace).',
                  'Periyar & Munnar trails: Gentle undulating plantation paths with vehicle support always nearby.'
                ]
              },
              {
                id: 'faq-05',
                question: 'How far in advance should we reserve this itinerary?',
                paragraphs: [
                  'Because we partner with intimate heritage homesteads and small plantation bungalows that often feature only four to eight suites, we recommend initiating your journey design three to six months in advance—especially for travel between December and February.'
                ]
              }
            ]
          }
        },
        {
          type: 'customer-query',
          data: {
            eyebrow: 'BOOKING & ROUTE POLICIES',
            title: 'Reservation & Cancellation Terms',
            items: [
              {
                id: 'term-01',
                question: 'How are reservations confirmed and scheduled?',
                paragraphs: [
                  'Once your bespoke route blueprint and accommodation selection are approved, a 30% confirmation deposit secures all heritage stays, private barges, and specialist guides. The remaining balance is due 45 days prior to arrival.'
                ]
              },
              {
                id: 'term-02',
                question: 'What is the policy for date changes or cancellations?',
                paragraphs: [
                  'We understand that international travel plans can evolve. Whenever possible, we work directly with our estate partners to shift your reservation dates without penalty subject to seasonal availability.'
                ],
                listItems: [
                  '60+ days prior to arrival: Full refund of deposit less any non-refundable permit fees.',
                  '30–59 days prior to arrival: 50% refund or 100% credit toward rescheduled dates within 12 months.',
                  'Less than 30 days prior to arrival: Governed by individual heritage property release terms.'
                ]
              }
            ]
          }
        }
      ]
    }
  ]
}

// Auto-generate Sticky Scroll-Spy tabs directly from non-empty sections
const navSections = computed<ScrollNavSection[]>(() =>
  itineraryRecord.sections
    .filter((section) => section.blocks.length > 0)
    .map((section) => ({
      id: section.id,
      label: section.label
    }))
)

const relatedConfig: RelatedItinerariesConfig = {
  eyebrow: 'CONTINUE EXPLORING',
  titleLine1: 'Related',
  titleLine2Cursive: 'Journeys.',
  items: ITINERARIES_DATABASE.slice(1, 4).map((entry) => entry.meta)
}

useTravelSeo({
  pageTitle: itineraryRecord.seo?.pageTitle || itineraryRecord.header.title,
  pageDesc: itineraryRecord.seo?.pageDesc || itineraryRecord.header.intro,
  canonicalPath: `/itineraries/${itineraryRecord.slug}`,
  ogImage: itineraryRecord.seo?.ogImage || '/images/favicons/sreejith-og-image.jpg',
  ogImageAlt: itineraryRecord.seo?.ogImageAlt || itineraryRecord.header.coverAlt,
  pageType: 'itinerary',
  breadcrumbName:
    itineraryRecord.seo?.breadcrumbName ||
    itineraryRecord.header.breadcrumbs[itineraryRecord.header.breadcrumbs.length - 1]?.label,
  publishDate: itineraryRecord.seo?.publishDate,
  priceText: itineraryRecord.sidebar.price,
  itinerarySections: itineraryRecord.sections
})

</script>

<template>
  <div class="min-h-screen bg-bg-light text-journey-deep pb-24 lg:pb-32">
    <!-- 1. ITINERARY HEADER -->
    <ItineraryHeader :data="itineraryRecord.header" />

    <!-- 2. STICKY HORIZONTAL SCROLL-SPY NAVIGATION -->
    <ItineraryScrollNav :sections="navSections" />

    <!-- 3. MAIN 12-COLUMN EDITORIAL GRID + STICKY RIGHT SIDEBAR -->
    <div class="section-wrapper pt-8! sm:pt-12! pb-12!">
      <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- LEFT COLUMN: Section-Grouped Dynamic Block Dispatcher -->
        <div class="lg:col-span-8 flex flex-col gap-12 sm:gap-16 w-full">
          <div
            v-for="section in itineraryRecord.sections"
            :id="section.id"
            :key="section.id"
            class="scroll-mt-36 flex flex-col gap-8 sm:gap-10 w-full"
          >
            <template
              v-for="(block, bIdx) in section.blocks"
              :key="`${section.id}-${block.type}-${bIdx}`"
            >
              <LazyItinerariesBlocksBlockSummary
                v-if="block.type === 'summary'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockItinerary
                v-else-if="block.type === 'itinerary'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockChecklist
                v-else-if="block.type === 'checklist'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockNumberedList
                v-else-if="block.type === 'numbered-list'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockQuote
                v-else-if="block.type === 'quote'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockTipNote
                v-else-if="block.type === 'tip-note'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockDesignerProfile
                v-else-if="block.type === 'designer-profile'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockCustomerQuery
                v-else-if="block.type === 'customer-query'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockMasonry
                v-else-if="block.type === 'masonry'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockYoutube
                v-else-if="block.type === 'youtube'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockSlider
                v-else-if="block.type === 'slider'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />
            </template>
          </div>
        </div>

        <!-- RIGHT COLUMN: Sticky Desktop Sidebar + Mobile Bottom Bar & Popup -->
        <div class="lg:col-span-4 w-full lg:sticky lg:top-36 self-start">
          <ItinerarySidebar :data="itineraryRecord.sidebar" />
        </div>

      </div>
    </div>

    <!-- 4. RELATED ITINERARIES (Outside Scroll-Spy & Below Sticky Sidebar Boundary) -->
    <RelatedItineraries
      v-if="relatedConfig.items.length > 0"
      :data="relatedConfig"
    />

    <!-- 5. ROOT-LEVEL ITINERARY LIGHTBOX -->
    <ItineraryLightbox
      :is-open="lightboxState.isOpen"
      :items="lightboxState.items"
      :initial-index="lightboxState.index"
      @close="closeLightbox"
    />
  </div>
</template>