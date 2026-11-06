<!-- ~/app/pages/itinerary-dummy.vue -->
<script setup lang="ts">
import { onMounted, onActivated } from 'vue'
import ItineraryHeader, { type ItineraryHeaderData } from '~/components/itineraries/ItineraryHeader.vue'
import ItineraryScrollNav, { type ScrollNavSection } from '~/components/itineraries/ItineraryScrollNav.vue'
import ItinerarySidebar, { type ItinerarySidebarData } from '~/components/itineraries/ItinerarySidebar.vue'
import RelatedItineraries, { type RelatedItinerariesConfig } from '~/components/RelatedItineraries.vue'
import type { ItineraryOverviewBlockData } from '~/components/itineraries/blocks/BlockOverview.vue'
import type { ItineraryProgressionBlockData } from '~/components/itineraries/blocks/BlockItinerary.vue'
import { ITINERARIES_DATABASE } from '~~/server/utils/itinerariesData'
import type { ItineraryChecklistBlockData } from '~/components/itineraries/blocks/BlockChecklist.vue'
import type { ItineraryQuoteBlockData } from '~/components/itineraries/blocks/BlockQuote.vue'
import type { ItineraryTipNoteBlockData } from '~/components/itineraries/blocks/BlockTipNote.vue'
import type { ItineraryNumberedListBlockData } from '~/components/itineraries/blocks/BlockNumberedList.vue'
import type { ItineraryDesignerProfileBlockData } from '~/components/itineraries/blocks/BlockDesignerProfile.vue'
import type { ItineraryFaqBlockData } from '~/components/itineraries/blocks/BlockFaq.vue'

const { forceTransparent } = useHeaderTheme()

const syncLightHeader = () => {
  forceTransparent.value = false
}

onMounted(syncLightHeader)
onActivated(syncLightHeader)

const headerData: ItineraryHeaderData = {
  breadcrumbs: [
    { label: 'Home', to: '/' },
    { label: 'Itineraries', to: '/itineraries' },
    { label: 'Malabar Coast' }
  ],
  coverImage: '/images/fallbacks/culture.webp',
  coverAlt: 'Traditional wooden boat gliding across tranquil Malabar backwaters at dawn',
  eyebrow: 'Signature Itinerary',
  title: 'Stories Along the Malabar Coast',
  intro:
    'Follow the old trading ports of the Malabar Coast, where boatbuilders, spice merchants and fishing families share their stories.',
  journeyDetails: [
    { label: 'Duration', value: '11 days' },
    { label: 'Pace', value: 'Unhurried' },
    { label: 'Region', value: 'Kerala' },
    { label: 'Group', value: '1–4 guests' },
    { label: 'Focus', value: 'Living culture' },
    { label: 'Distance', value: '320 km' }
  ]
}

const navSections: ScrollNavSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'stays', label: 'Stays' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'faqs', label: 'FAQs' }
]

const overviewBlockData: ItineraryOverviewBlockData = {
  sectionId: 'overview',
  eyebrow: 'THE JOURNEY AT A GLANCE',
  title: 'Route Overview',
  paragraphs: [
    'Traverse the legendary spice routes of Kerala and ascend into the misty tea-clad heights of the Nilgiri Biosphere. Designed for travellers who favour deep historical context, private estate stays and slow, unhurried exploration.',
    'From the historic harbour streets of Fort Kochi to private rice barges drifting across Vembanad Lake and cloud-wrapped planters’ bungalows in the Western Ghats, every stop is paced so you experience the living culture of the region intimately.'
  ],
  image: '/images/itineraries/dummy2.webp',
  imageAlt: 'Fresh green pepper vines overlooking misty tea estates in Munnar',
  imageAspectRatio: '4 / 5', // Default is '1 / 1'; try '4 / 5' or '3 / 4' to test portrait
  routeStops: ['Cochin', 'Alleppey', 'Periyar', 'Munnar', 'Nilgiris'],
  highlightsTitle: 'Highlights of the Journey',
  highlights: [
    'Stay in a 200-year-old restored colonial mansion in Fort Kochi.',
    'Overnight cruise on a private, non-motorized traditional rice barge.',
    'Exclusive tea-tasting masterclass with a regional estate manager.',
    'Guided night-walks in the Periyar Tiger Reserve with indigenous trackers.'
  ]
}

const itineraryBlockData: ItineraryProgressionBlockData = {
  sectionId: 'itinerary',
  introTitle: 'The Pace & Flow',
  introParagraphs: [
    'Before diving into the daily progression, it is important to note that this blueprint relies heavily on the concept of slow travel. We ensure you spend at least two to three nights at each sanctuary, eliminating the exhaustion of constant repacking and driving.'
  ],
  title: 'Detailed Progression',
  items: [
    // 1. 1 Portrait Image -> Always Sticky on Right + Long Paragraphs + List
    {
      id: 'phase-01',
      headerTitle: 'Phase 01: The Maritime History (1 Portrait -> Always Sticky Right)',
      bodySubtitle: 'DAYS 1-3 | FORT KOCHI & MATTANCHERRY',
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
          src: '/images/itineraries/dummy3.webp',
          alt: 'Traditional teakwood courtyard inside an ancestral Fort Kochi mansion'
        }
      ]
    },

    // 2. 1 Square Image (Sticky Right Mode) + Paragraphs
    {
      id: 'phase-02',
      headerTitle: 'Phase 02: Labyrinths of Vembanad (1 Square -> Sticky Right Mode)',
      bodySubtitle: 'DAYS 4-5 | BACKWATERS & KUTTANAD VILLAGES',
      paragraphs: [
        'Board a private, hand-stitched Kettuvallam rice barge crewed by a personal chef and two oarsmen. Glide away from the main waterways into narrow, palm-shaded village canals where life unfolds at the water’s edge.',
        'Wake to mist rising off the backwaters, watch toddy tappers climb coconut palms at dawn, and step ashore to visit coir-spinning guilds and ancient waterside temples.'
      ],
      imageOrientation: 'square',
      imageLayout: 'side-by-side',
      images: [
        {
          src: '/images/itineraries/dummy4.webp',
          alt: 'Serene backwater canals of Vembanad at sunrise'
        }
      ]
    },

    // 3. 1 Square Image (Block Mode) + Paragraphs + List
    {
      id: 'phase-03',
      headerTitle: 'Phase 03: The Cardamom Ascent (1 Square -> Full-Width Block Mode)',
      bodySubtitle: 'DAYS 6-7 | PERIYAR & HIGHLAND SPICE ESTATES',
      paragraphs: [
        'Ascend into the cool highland spice belt of Periyar, staying inside a secluded plantation homestead surrounded by cardamom and wild pepper.'
      ],
      listTitle: 'Highland Experiences Included',
      listItems: [
        'Guided twilight walk along the Periyar rainforest buffer with indigenous trackers.',
        'Private spice-harvesting walk through shade-grown cardamom and vanilla groves.',
        'Farm-to-table plantation lunch hosted by a third-generation planter family.',
        'Early morning bamboo-rafting excursion across tranquil forest reservoirs.'
      ],
      imageOrientation: 'square',
      imageLayout: 'block',
      images: [
        {
          src: '/images/itineraries/dummy5.webp',
          alt: 'Forested trails and spice hills of the Western Ghats'
        }
      ]
    },

    // 4. 2 Portrait Images -> Always Block Mode (Side-by-Side on Separate Line)
    {
      id: 'phase-04',
      headerTitle: 'Phase 04: Heritage Courtyards (2 Portrait Images -> Always Block Mode)',
      bodySubtitle: 'DAY 8 | ANCESTRAL ARCHITECTURE & CRAFT',
      paragraphs: [
        'Explore restored timber-and-laterite homesteads and meet master woodcarvers preserving centuries-old temple and domestic architectural traditions.'
      ],
      imageOrientation: 'portrait',
      images: [
        {
          src: '/images/itineraries/dummy1.webp',
          alt: 'Restored heritage mansion entrance'
        },
        {
          src: '/images/itineraries/dummy3.webp',
          alt: 'Carved teakwood pillars and sunlit courtyard'
        }
      ]
    },

    // 5. 1 Landscape Image -> Always Full-Width Block Mode (16:9)
    {
      id: 'phase-05',
      headerTitle: 'Phase 05: The Cloud Forests (1 Landscape -> Always Block Mode)',
      bodySubtitle: 'DAY 9 | MUNNAR & ERAAVIKULAM RIDGES',
      paragraphs: [
        'Ascend along winding mountain roads into the high-range shola-grassland mosaic of Munnar. Settle into a colonial-era stone bungalow surrounded by heirloom tea gardens and drifting valley clouds.'
      ],
      listItems: [
        'Dawn conservation walk in search of the endemic Nilgiri Tahr.',
        'Private orthodox tea-tasting session inside a historic 19th-century factory.'
      ],
      imageOrientation: 'landscape',
      images: [
        {
          src: '/images/fallbacks/culture.webp',
          alt: 'Panoramic view of Malabar heritage and coastal waterways'
        }
      ]
    },

    // 6. 2 Landscape Images -> Always Block Mode (16:10 Pair)
    {
      id: 'phase-06',
      headerTitle: 'Phase 06: Artisans of the Palakkad Gap (2 Landscapes -> Always Block)',
      bodySubtitle: 'DAY 10 | KUTHAMPULLY & NILA RIVER VALLEY',
      paragraphs: [
        'Descend through the dramatic Palakkad Gap into emerald paddy plains bordered by palmyra palms. Spend the day inside master handloom weaving clusters and traditional bell-metal ateliers.'
      ],
      imageOrientation: 'landscape',
      images: [
        {
          src: '/images/itineraries/dummy6.webp',
          alt: 'Master handloom weaver crafting Kasavu cotton textiles'
        },
        {
          src: '/images/itineraries/dummy7.webp',
          alt: 'Evening lamps inside a traditional Kerala temple courtyard'
        }
      ]
    },

    // 7. 2 Square Images -> Always Block Mode
    {
      id: 'phase-07',
      headerTitle: 'Phase 07: Sacred Groves of North Malabar (2 Squares -> Always Block)',
      bodySubtitle: 'DAY 11 | BEYPORE & CALICUT COAST',
      listTitle: 'Final Day Highlights',
      listItems: [
        'Visit the legendary Uru wooden dhow shipyards of Beypore with master shipwrights.',
        'Explore Calicut’s historic Mittai Theruvu and traditional timber trading quays.'
      ],
      imageOrientation: 'square',
      images: [
        {
          src: '/images/itineraries/dummy8.webp',
          alt: 'Handcrafted wooden dhow construction in Beypore'
        },
        {
          src: '/images/itineraries/dummy9.webp',
          alt: 'Coastal spice bazaar in historic Calicut'
        }
      ]
    },

    // 8. Text & Unordered List Only (Zero Images)
    {
      id: 'phase-08',
      headerTitle: 'Phase 08: Departure & Onward Connections (Text & List Only)',
      bodySubtitle: 'DAY 12 | CALICUT OR COCHIN INTERNATIONAL AIRPORT',
      paragraphs: [
        'Enjoy an unhurried breakfast overlooking the Arabian Sea before your private chauffeur transfers you to the airport for your onward flight home.'
      ],
      listItems: [
        'Flexible late-checkout coordination subject to flight schedules.',
        'Dedicated airport assistance and farewell artisan gift hamper.'
      ]
    }
  ]
}

const lodgingChecklistData: ItineraryChecklistBlockData = {
  sectionId: 'stays',
  title: 'Our Lodging Standards',
  items: [
    'Restored colonial mansions honoring local heritage.',
    'Eco-lodges built without felling a single native tree.',
    'Working tea estates prioritizing organic cultivation.',
    'Absolute privacy with dedicated on-site concierges.'
  ],
  image: '/images/itineraries/dummy1.webp',
  imageAlt: 'Restored heritage colonial bungalow at dusk',
  imageAspectRatio: '1 / 1'
}

const quoteBlockData: ItineraryQuoteBlockData = {
  quote:
    'To truly understand the Malabar coast, one must look beyond the postcard perfection of the palm fringes and listen to the murmurs of its ancient trading courtyards.',
  author: "THE DESIGNER'S NOTEBOOK"
}

const climateTipData: ItineraryTipNoteBlockData = {
  sectionId: 'inclusions',
  title: 'SEASONAL CLIMATE NOTE',
  text: 'While the winter months (November to February) offer crisp, dry weather, the monsoon (June to August) transforms Kerala into a vivid, washed-green paradise, highly recommended for profound Ayurvedic wellness retreats.'
}

const packingListData: ItineraryNumberedListBlockData = {
  title: 'Suggested Packing List',
  items: [
    'Lightweight, breathable linen or cotton clothing for coastal humidity.',
    'A warm fleece jacket or heavy sweater for the high-altitude tea estates.',
    'Sturdy, enclosed walking boots for plantation and jungle treks.',
    'Eco-friendly, reef-safe sunscreen and DEET-free mosquito repellent.'
  ]
}

const faqBlockData: ItineraryFaqBlockData = {
  sectionId: 'faqs',
  eyebrow: 'GOOD TO KNOW',
  title: 'Frequently Asked Questions',
  items: [
    // 1. Both Paragraphs + Unordered List
    {
      id: 'faq-01',
      question: 'Can this Malabar & Nilgiri route be customized to our preferred dates and pace?',
      paragraphs: [
        'Every blueprint we design is privately tailored around your travel dates, interests, and preferred rhythm. You can extend your time in the backwaters, add an Ayurvedic retreat, or adjust driving stages before we lock in your stays.'
      ],
      listTitle: 'Ways we routinely tailor this route:',
      listItems: [
        'Adding private culinary sessions or temple architecture walks with regional scholars.',
        'Upgrading inter-region transfers to charter flights or scenic heritage train segments.',
        'Adjusting the number of nights at each heritage bungalow or plantation estate.'
      ]
    },
    // 2. Paragraphs Only
    {
      id: 'faq-02',
      question: 'What is the ideal season to travel along the Malabar Coast and Western Ghats?',
      paragraphs: [
        'October through March brings clear skies, gentle coastal breezes, and crisp highland mornings—ideal for coastal walks, wildlife tracking, and open-air dining.',
        'For travellers drawn to lush landscapes, quiet sanctuaries, and traditional Ayurvedic rejuvenation, the monsoon months from June to September offer an unforgettable, emerald-green atmosphere.'
      ]
    },
    // 3. Unordered List Only
    {
      id: 'faq-03',
      question: 'What is included in the estimated journey budget?',
      listTitle: 'Core inclusions across all our signature blueprints:',
      listItems: [
        'Handpicked heritage mansions, boutique eco-lodges, and private Kettuvallam houseboat stays.',
        'Dedicated chauffeur-driven luxury vehicle from arrival in Cochin to departure.',
        'Privately guided cultural walks, estate tastings, and reserve entry permits.',
        '24/7 concierge support from Sreejith and our on-ground regional hosts.'
      ]
    },
    // 4. Both Paragraphs + Unordered List
    {
      id: 'faq-04',
      question: 'How physically demanding are the walks and highland excursions?',
      paragraphs: [
        'This journey is paced as an unhurried cultural and nature immersion rather than a strenuous trek. All estate walks and forest trails are led by private naturalists who adapt the distance and terrain to your comfort.'
      ],
      listItems: [
        'Fort Kochi & Calicut walks: Easy, flat heritage lanes (1.5 to 2 hours at a relaxed pace).',
        'Periyar & Munnar trails: Gentle undulating plantation paths with optional vehicle support.'
      ]
    },
    // 5. Paragraphs Only
    {
      id: 'faq-05',
      question: 'How far in advance should we reserve this itinerary?',
      paragraphs: [
        'Because we partner with intimate heritage homesteads and small plantation bungalows that often have only four to eight suites, we recommend initiating your journey design three to six months in advance—especially if travelling between December and February.'
      ]
    }
  ]
}

const designerProfileData: ItineraryDesignerProfileBlockData = {
  eyebrow: 'LEAD ROUTE ARCHITECT • KERALA, INDIA',
  name: 'Sreejith Raghavan',
  bio: 'Having traversed the Western Ghats for over a decade, Sreejith designed this blueprint to showcase the hidden, delicate balance between Kerala’s colonial trading history and its profound ecological biodiversity.',
  avatar: '/images/itineraries/dummy12.webp',
  avatarAlt: 'Sreejith Raghavan - Lead Route Architect'
}

const sidebarData: ItinerarySidebarData = {
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
  phone: '+91 99433 60478',
  whatsapp: '919943360478',
  email: 'sreejith@sreejithtravel.com',
  shareTitle: headerData.title,
  shareText: headerData.intro
}

const relatedConfig: RelatedItinerariesConfig = {
  eyebrow: 'CONTINUE EXPLORING',
  titleLine1: 'Related',
  titleLine2Cursive: 'Journeys.',
  items: ITINERARIES_DATABASE.slice(1, 4).map((entry) => entry.meta)
}

useSeoMeta({
  title: `${headerData.title} | Sreejith Travel Experience Designer`,
  description: headerData.intro,
  ogImage: headerData.coverImage,
  ogImageWidth: 1200,
  ogImageHeight: 630
})
</script>

<template>
  <div class="min-h-screen bg-bg-light text-journey-deep pb-24 lg:pb-32">
    <!-- 1. ITINERARY HEADER -->
    <ItineraryHeader :data="headerData" />

    <!-- 2. STICKY HORIZONTAL SCROLL-SPY NAVIGATION -->
    <ItineraryScrollNav :sections="navSections" />

    <!-- 3. MAIN 12-COLUMN EDITORIAL GRID + STICKY RIGHT SIDEBAR -->
    <div class="section-wrapper pt-8! sm:pt-12! pb-12!">
      <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- LEFT COLUMN: Dynamic Itinerary Blocks -->
        <div class="lg:col-span-8 flex flex-col gap-12 sm:gap-16 w-full">
          <!-- BLOCK 1: Journey Overview + Highlights -->
          <LazyItinerariesBlocksBlockOverview
            hydrate-on-visible
            :data="overviewBlockData"
          />

          <!-- BLOCK 2: Detailed Progression Accordions -->
          <LazyItinerariesBlocksBlockItinerary
            hydrate-on-visible
            :data="itineraryBlockData"
          />

          <!-- BLOCK 3: Important Checklist with Sticky Image (Stays) -->
          <LazyItinerariesBlocksBlockChecklist
            hydrate-on-visible
            :data="lodgingChecklistData"
          />

          <!-- BLOCK 4: Editorial Quote -->
          <LazyItinerariesBlocksBlockQuote
            hydrate-on-visible
            :data="quoteBlockData"
          />

          <!-- BLOCK 5: Seasonal Climate / Tip Note -->
          <LazyItinerariesBlocksBlockTipNote
            hydrate-on-visible
            :data="climateTipData"
          />

          <!-- BLOCK 6: Numbered List (Packing List) -->
          <LazyItinerariesBlocksBlockNumberedList
            hydrate-on-visible
            :data="packingListData"
          />

          <!-- BLOCK 7: Travel Designer Profile (Light Surface) -->
          <LazyItinerariesBlocksBlockDesignerProfile
            hydrate-on-visible
            :data="designerProfileData"
          />

          <!-- BLOCK 8: Frequently Asked Questions (5 Q&As with Paragraphs & Unordered Lists) -->
          <LazyItinerariesBlocksBlockFaq
            hydrate-on-visible
            :data="faqBlockData"
          />
        </div>

        <!-- RIGHT COLUMN: Sticky Desktop Sidebar + Mobile Bottom Bar & Popup -->
        <div class="lg:col-span-4 w-full lg:sticky lg:top-36 self-start">
          <ItinerarySidebar :data="sidebarData" />
        </div>

      </div>
    </div>

    <!-- 4. RELATED ITINERARIES (Outside Scroll-Spy & Below Sticky Sidebar Boundary) -->
    <RelatedItineraries
      v-if="relatedConfig.items.length > 0"
      :data="relatedConfig"
    />
  </div>
</template>