<!-- ~/app/pages/faq.vue -->
<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import FaqAccordion from '~/components/FaqAccordion.vue'
import type { FaqConfig } from '~/components/FaqAccordion.vue'

const pageData = {
  hero: {
    eyebrow: 'Frequently Asked Questions',
    titleMain: 'Traveler Guidance',
    titleItalic: 'Everything You Need To Know',
    intro: 'Thoughtful answers to help you plan, prepare, and travel with confidence.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Frequently asked questions about bespoke India travel'
  },
  faq: {
    "eyebrow": "Things to know",
    "titleLine1": "EVERY JOURNEY Begins",
    "titleLine2Cursive": "with a few Questions.",
    "description": "Clear, thoughtful answers regarding how we design custom routes, handle logistics, and ensure seamless comfort throughout your journey.",
    "categories": [
      {
        "id": "getting-started",
        "label": "Getting Started"
      },
      {
        "id": "journey-design",
        "label": "Your Journey Design"
      },
      {
        "id": "destinations",
        "label": "Destinations & Seasons"
      },
      {
        "id": "experiences",
        "label": "Culture & Experiences"
      },
      {
        "id": "stays",
        "label": "Handpicked Stays"
      },
      {
        "id": "transport",
        "label": "Transport & Transfers"
      },
      {
        "id": "travel-styles",
        "label": "Who You Travel With"
      },
      {
        "id": "food",
        "label": "Food & Dietary Needs"
      },
      {
        "id": "preparation",
        "label": "Before You Travel"
      },
      {
        "id": "support",
        "label": "Support During Your Journey"
      },
      {
        "id": "payments",
        "label": "Pricing, Payments & Changes"
      },
      {
        "id": "responsible-travel",
        "label": "Community & Responsible Travel"
      }
    ],
    "items": [
      {
        "id": "q001",
        "categoryId": "getting-started",
        "question": "How do I begin planning a journey with Sreejith Travel?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Start with our journey-planning questionnaire or contact us using the details on our website. You do not need a finished itinerary. A destination, an interest, or simply a feeling you want from your time away is enough to begin the conversation."
          },
          {
            "type": "orderedList",
            "items": [
              "Share your preferred dates, group size, interests, and approximate budget.",
              "Tell us how you enjoy travelling and anything you would like us to accommodate.",
              "We discuss the possibilities and explain the next steps before developing your proposal."
            ]
          }
        ]
      },
      {
        "id": "q002",
        "categoryId": "getting-started",
        "question": "Do I need to know where I want to go before contacting you?",
        "answer": [
          {
            "type": "paragraph",
            "text": "No. Tell us what draws you to travel, and we can help you explore destinations that suit your interests, available time, and preferred season."
          }
        ]
      },
      {
        "id": "q003",
        "categoryId": "getting-started",
        "question": "What information should I include in my first inquiry?",
        "answer": [
          {
            "type": "paragraph",
            "text": "A few practical details help us make the first conversation useful. Estimates are welcome if your plans are still taking shape."
          },
          {
            "type": "unorderedList",
            "items": [
              "Your intended travel dates or approximate month.",
              "The number of travellers and the ages of any children.",
              "Your main interests and preferred travel pace.",
              "An approximate budget and whether it includes international flights.",
              "Any dietary, accessibility, or accommodation requirements."
            ]
          }
        ]
      },
      {
        "id": "q004",
        "categoryId": "getting-started",
        "question": "How far in advance should I contact you?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Contact us as soon as you have an approximate travel window. Small heritage properties, specialist hosts, and festival dates can require earlier planning, particularly during popular periods."
          },
          {
            "type": "paragraph",
            "text": "If your departure is close, we can still explore what is possible. The available stays and experiences may influence the final route."
          }
        ]
      },
      {
        "id": "q005",
        "categoryId": "getting-started",
        "question": "Can you help with a last-minute journey?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can assess your request against current availability and the time needed to arrange it responsibly. Please share your dates, arrival point, and priorities at the outset."
          }
        ]
      },
      {
        "id": "q006",
        "categoryId": "getting-started",
        "question": "Can we speak before I decide to book?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. An initial conversation helps us understand your expectations and explain how we work. Any consultation or journey-design fee that applies to your request will be explained before you agree to proceed."
          }
        ]
      },
      {
        "id": "q007",
        "categoryId": "getting-started",
        "question": "Can I inquire on behalf of someone else?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. You can help organise a journey for family, friends, or colleagues. We may also need input from the travellers themselves, especially where personal preferences, consent, or specific support needs affect the arrangements."
          }
        ]
      },
      {
        "id": "q008",
        "categoryId": "getting-started",
        "question": "Does sending an inquiry commit me to a booking?",
        "answer": [
          {
            "type": "paragraph",
            "text": "No. An inquiry starts a conversation. Your proposal will explain what is required to proceed and when any payment or booking commitment becomes applicable."
          }
        ]
      },
      {
        "id": "q009",
        "categoryId": "getting-started",
        "question": "What happens after I submit the planning questionnaire?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We review your ideas and identify any details that need clarification. The next conversation focuses on what matters most to you, rather than asking you to select from a fixed package."
          },
          {
            "type": "orderedList",
            "items": [
              "We clarify your priorities, practical requirements, and travel window.",
              "We discuss a suitable direction and the scope of our planning service.",
              "We explain the proposal process, applicable fees, and booking steps."
            ]
          }
        ]
      },
      {
        "id": "q010",
        "categoryId": "journey-design",
        "question": "What does a tailor-made journey actually mean?",
        "answer": [
          {
            "type": "paragraph",
            "text": "It means the route, stays, experiences, and daily rhythm are considered together around your preferences. We begin with how you want to travel, then shape the arrangements to support that."
          },
          {
            "type": "paragraph",
            "text": "For one traveller, that may mean unhurried mornings and long conversations with local hosts. For another, it may mean walking, photography, and active exploration. Personalisation also includes practical details such as shorter transfers, quieter rooms, or time to rest."
          }
        ]
      },
      {
        "id": "q011",
        "categoryId": "journey-design",
        "question": "How does your Journey Design Framework work?",
        "answer": [
          {
            "type": "orderedList",
            "items": [
              "Dream: share your interests, aspirations, and preferred way of travelling.",
              "Define: explore destinations, seasons, stays, and experiences that suit your vision.",
              "Design: bring the route, accommodation, activities, and logistics into a coherent proposal.",
              "Deliver: put the confirmed arrangements into practice with the agreed support.",
              "Difference: consider how the journey can support local people, living heritage, and more responsible travel."
            ]
          }
        ]
      },
      {
        "id": "q012",
        "categoryId": "journey-design",
        "question": "Can I adapt one of the journeys shown on your website?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. Our featured journeys can serve as starting points. We can discuss changes to the duration, route, stays, and experiences according to your interests and availability."
          }
        ]
      },
      {
        "id": "q013",
        "categoryId": "journey-design",
        "question": "Can you design a journey around one particular interest?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. A strong interest can give a journey its character, whether that is architecture, textiles, food, photography, nature, or living traditions."
          },
          {
            "type": "paragraph",
            "text": "Tell us how deeply you would like to explore the subject. An introductory encounter, a practical workshop, and a specialist-led visit require different arrangements and may depend on a host's availability."
          }
        ]
      },
      {
        "id": "q014",
        "categoryId": "journey-design",
        "question": "How much free time can we include?",
        "answer": [
          {
            "type": "paragraph",
            "text": "As much as suits your journey. We can protect open mornings, unscheduled afternoons, or full rest days instead of filling every available hour."
          }
        ]
      },
      {
        "id": "q015",
        "categoryId": "journey-design",
        "question": "Can different people in our group have different activities?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can explore separate activities where the destination, staffing, and transport allow it. For example, some travellers might join a walk while others enjoy a cooking session or time at the property."
          },
          {
            "type": "paragraph",
            "text": "Please raise these preferences early. Parallel arrangements can affect costs, meeting points, and the day's timing."
          }
        ]
      },
      {
        "id": "q016",
        "categoryId": "journey-design",
        "question": "How many revisions can we make to the proposed itinerary?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Your planning agreement will explain the scope of revisions. We encourage clear feedback on the route, pace, accommodation, and overall budget so changes remain focused and useful."
          }
        ]
      },
      {
        "id": "q017",
        "categoryId": "journey-design",
        "question": "Can I book only part of a longer trip through you?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Tell us which portion you would like help with. We will confirm whether we can support that scope and clarify where our arrangements begin and end."
          }
        ]
      },
      {
        "id": "q018",
        "categoryId": "journey-design",
        "question": "What will my journey proposal include?",
        "answer": [
          {
            "type": "paragraph",
            "text": "The proposal sets out the intended experience and the practical scope of the arrangements. Read it alongside the booking terms before confirming."
          },
          {
            "type": "unorderedList",
            "items": [
              "A proposed route and day-by-day outline.",
              "Suggested accommodation and room categories.",
              "Included experiences and transport arrangements.",
              "Pricing, exclusions, and any optional additions.",
              "Availability conditions, payment requirements, and applicable terms."
            ]
          }
        ]
      },
      {
        "id": "q019",
        "categoryId": "destinations",
        "question": "Do you only design journeys in South India?",
        "answer": [
          {
            "type": "paragraph",
            "text": "South India is central to our approach and local relationships. If you would like to travel elsewhere, share your plans so we can confirm the destinations and partner arrangements available for your journey."
          }
        ]
      },
      {
        "id": "q020",
        "categoryId": "destinations",
        "question": "How do we choose the right destinations for our interests?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We consider what you enjoy alongside the season, journey length, and distances involved. A place that looks appealing in photographs may not be the right fit for your preferred pace or travel dates."
          },
          {
            "type": "unorderedList",
            "items": [
              "The experiences you would most like to have.",
              "Your comfort with heat, rain, altitude, and walking.",
              "The balance you want between towns, countryside, coast, and nature.",
              "How often you are happy to change accommodation."
            ]
          }
        ]
      },
      {
        "id": "q021",
        "categoryId": "destinations",
        "question": "What is the best time of year to travel?",
        "answer": [
          {
            "type": "paragraph",
            "text": "There is no single best season for every route. Coastal, hill, forest, and inland destinations can have different conditions. Share your dates and priorities, and we can discuss the trade-offs for your specific journey."
          }
        ]
      },
      {
        "id": "q022",
        "categoryId": "destinations",
        "question": "Is a monsoon journey worth considering?",
        "answer": [
          {
            "type": "paragraph",
            "text": "It can be, if you enjoy rain, greener landscapes, and a slower rhythm. It also requires flexibility: outdoor activities, road access, and some experiences may be affected by conditions."
          },
          {
            "type": "paragraph",
            "text": "We would discuss suitable destinations and alternatives rather than assume that a dry-season itinerary can be followed unchanged."
          }
        ]
      },
      {
        "id": "q023",
        "categoryId": "destinations",
        "question": "Can we combine several states in one journey?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes, where your available time supports it. We will help balance variety against transfer time so the journey does not become a sequence of hurried departures."
          }
        ]
      },
      {
        "id": "q024",
        "categoryId": "destinations",
        "question": "Can you plan around a festival or seasonal event?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can explore this, subject to confirmed dates, access, local permissions, and availability. Festivals are living community occasions, and participation may involve crowds, changing schedules, or restrictions."
          },
          {
            "type": "paragraph",
            "text": "We will discuss what kind of attendance is appropriate and what can realistically be arranged. Access to a particular ritual or viewing position should never be assumed."
          }
        ]
      },
      {
        "id": "q025",
        "categoryId": "destinations",
        "question": "How many destinations should I include?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Usually fewer than you might initially expect. Staying longer in selected places often creates more room for local encounters, rest, and unexpected discoveries."
          }
        ]
      },
      {
        "id": "q026",
        "categoryId": "destinations",
        "question": "Can we visit quieter places without missing the major highlights?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. We can combine well-known sites with smaller towns, village visits, or less crowded experiences. The balance depends on your interests, access, and the time available."
          }
        ]
      },
      {
        "id": "q027",
        "categoryId": "experiences",
        "question": "What kinds of cultural experiences can you arrange?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Possibilities depend on the destination and the people available to host you. We focus on encounters that have context and a clear connection to local life."
          },
          {
            "type": "unorderedList",
            "items": [
              "Conversations and demonstrations with craftspeople.",
              "Food experiences with local cooks or specialist hosts.",
              "Heritage walks and architectural exploration.",
              "Introductions to music, performance, and living traditions.",
              "Nature experiences led by suitable local guides."
            ]
          }
        ]
      },
      {
        "id": "q028",
        "categoryId": "experiences",
        "question": "Are community visits staged for travellers?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Our intention is to arrange respectful encounters around a host's real knowledge and work. Some experiences are scheduled specifically for visitors, but that should not mean presenting a community as a performance."
          },
          {
            "type": "paragraph",
            "text": "We aim to explain what has been arranged, what participation involves, and any boundaries set by the host."
          }
        ]
      },
      {
        "id": "q029",
        "categoryId": "experiences",
        "question": "Can I take part in a craft workshop?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Where a host offers hands-on participation, yes. Tell us whether you want a brief introduction or a more involved session so we can explore an appropriate format."
          }
        ]
      },
      {
        "id": "q030",
        "categoryId": "experiences",
        "question": "Can you arrange private experiences?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can request private arrangements where offered. Your proposal should specify whether an activity is exclusive to your party or shared with other visitors."
          }
        ]
      },
      {
        "id": "q031",
        "categoryId": "experiences",
        "question": "Can our journey include photography-focused experiences?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. We can discuss light, timing, walking pace, and subjects when planning the route. Specialist photographic guidance, private access, and permissions require separate confirmation."
          },
          {
            "type": "paragraph",
            "text": "A person's willingness to host a visit does not automatically include permission for portraits, filming, or commercial use of their image."
          }
        ]
      },
      {
        "id": "q032",
        "categoryId": "experiences",
        "question": "Can we include nature walks without doing strenuous hikes?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. Share your comfortable walking distance and any terrain limitations. We can explore gentler options rather than assume every nature experience needs to be physically demanding."
          }
        ]
      },
      {
        "id": "q033",
        "categoryId": "experiences",
        "question": "Are wildlife sightings guaranteed?",
        "answer": [
          {
            "type": "paragraph",
            "text": "No. Wildlife is unpredictable. We can plan suitable opportunities with appropriate guides, but sightings and animal behaviour cannot be guaranteed."
          }
        ]
      },
      {
        "id": "q034",
        "categoryId": "experiences",
        "question": "What happens if a local host becomes unavailable?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We will explain the change and discuss a suitable alternative where possible. Community experiences depend on real people whose family responsibilities, work, health, or local circumstances may change."
          },
          {
            "type": "paragraph",
            "text": "Any implications for the confirmed arrangements will be handled according to your booking terms."
          }
        ]
      },
      {
        "id": "q035",
        "categoryId": "experiences",
        "question": "Can you arrange research-led or specialist-interest visits?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can assess requests involving research, documentation, or specialist learning. Please describe the purpose clearly, including any interviews, recording, publication, or institutional involvement."
          },
          {
            "type": "unorderedList",
            "items": [
              "The subject and intended outcome of the visit.",
              "Who you hope to meet and why.",
              "Whether you plan to photograph, record, or publish.",
              "Any permissions or formal introductions you already have."
            ]
          },
          {
            "type": "paragraph",
            "text": "A leisure visit does not automatically provide research access or permission to document people and practices."
          }
        ]
      },
      {
        "id": "q036",
        "categoryId": "stays",
        "question": "What kinds of accommodation do you recommend?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We look for stays that suit the place and your preferences. These may include heritage homes, intimate hotels, characterful retreats, or other thoughtfully chosen properties."
          },
          {
            "type": "paragraph",
            "text": "Atmosphere matters, but so do practical details such as access, room configuration, food, service, and proximity to your planned experiences."
          }
        ]
      },
      {
        "id": "q037",
        "categoryId": "stays",
        "question": "Will every property have the same level of facilities?",
        "answer": [
          {
            "type": "paragraph",
            "text": "No. A restored heritage home and a contemporary hotel may offer very different facilities. We will help you understand the relevant differences before you confirm."
          }
        ]
      },
      {
        "id": "q038",
        "categoryId": "stays",
        "question": "Can I request a particular hotel or room category?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. Share your preference early. A request is not confirmed until availability and the booking conditions have been checked and accepted."
          }
        ]
      },
      {
        "id": "q039",
        "categoryId": "stays",
        "question": "Are heritage properties suitable for travellers with limited mobility?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Some may be suitable; others have steps, uneven floors, narrow doorways, or no lift. A property's heritage character should never be treated as proof of accessibility."
          },
          {
            "type": "unorderedList",
            "items": [
              "Tell us whether step-free access is essential.",
              "Share relevant mobility-aid dimensions.",
              "Explain any bathroom or bed-access requirements.",
              "Ask us to seek specific measurements or photographs where needed."
            ]
          },
          {
            "type": "paragraph",
            "text": "We can request detailed information, but suitability should be assessed against your individual requirements before booking."
          }
        ]
      },
      {
        "id": "q040",
        "categoryId": "stays",
        "question": "Can you arrange adjoining rooms or family accommodation?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can request these arrangements. Connecting rooms, adjacent rooms, and family suites are different options, so please tell us exactly what you need."
          }
        ]
      },
      {
        "id": "q041",
        "categoryId": "stays",
        "question": "Can we spend several nights at one property?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Absolutely. A longer stay can reduce packing and transfers while creating time to explore the surrounding area at a more relaxed pace."
          }
        ]
      },
      {
        "id": "q042",
        "categoryId": "stays",
        "question": "Are early check-in and late check-out included?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Only when explicitly confirmed. These arrangements depend on the property, room availability, and any additional charges. For an arrival well before standard check-in, booking the previous night may be worth considering."
          }
        ]
      },
      {
        "id": "q043",
        "categoryId": "stays",
        "question": "Can we combine a heritage stay with a wellness retreat?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes, if the route and your available time allow it. Tell us whether you want general relaxation or a structured programme, as the appropriate property and minimum stay may differ."
          },
          {
            "type": "paragraph",
            "text": "Any treatment suitability or health-related decisions should be discussed directly with an appropriately qualified practitioner."
          }
        ]
      },
      {
        "id": "q044",
        "categoryId": "transport",
        "question": "Is private transport included in every journey?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Transport is included only as stated in your proposal. The vehicle type, service dates, transfer scope, and any limitations should be confirmed before booking."
          }
        ]
      },
      {
        "id": "q045",
        "categoryId": "transport",
        "question": "Will the same driver accompany us throughout?",
        "answer": [
          {
            "type": "paragraph",
            "text": "That may be possible on some routes, but changes can be necessary when regions, transport providers, or operating requirements change. We will clarify the intended arrangement."
          }
        ]
      },
      {
        "id": "q046",
        "categoryId": "transport",
        "question": "Is our driver also our guide?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Not necessarily. Driving and specialist guiding are separate responsibilities. Your proposal will identify any local guides, expert hosts, or guided visits included in the journey."
          }
        ]
      },
      {
        "id": "q047",
        "categoryId": "transport",
        "question": "How do you plan comfortable travel days?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We consider the practical experience of the journey, not just the distance on a map. Road conditions, town traffic, comfort stops, and the timing of visits all affect the day."
          },
          {
            "type": "unorderedList",
            "items": [
              "Allow realistic time for transfers and breaks.",
              "Avoid unnecessary changes of accommodation.",
              "Discuss shorter driving days where possible.",
              "Consider an overnight stop or another transport option when appropriate."
            ]
          }
        ]
      },
      {
        "id": "q048",
        "categoryId": "transport",
        "question": "Can you arrange airport arrival and departure transfers?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can explore transfers as part of your arrangements. Please provide accurate flight details and confirm whether each transfer is included in your proposal."
          }
        ]
      },
      {
        "id": "q049",
        "categoryId": "transport",
        "question": "Can our journey include trains or domestic flights?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes, where they make sense for the route and can be arranged within the service offered. Schedules, ticket availability, baggage allowances, and fare conditions will affect the options."
          },
          {
            "type": "paragraph",
            "text": "Please check which tickets are included and who is responsible for booking them before purchasing any connecting travel."
          }
        ]
      },
      {
        "id": "q050",
        "categoryId": "transport",
        "question": "Can you arrange child seats or additional luggage space?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Tell us what you need before vehicle arrangements are confirmed. Child-seat type, luggage quantity, and mobility equipment can affect vehicle suitability and availability."
          }
        ]
      },
      {
        "id": "q051",
        "categoryId": "transport",
        "question": "Can we stop for photographs or breaks during a transfer?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Usually, where it is safe and the day's schedule allows. Discuss longer detours in advance, as they may affect driving time, access, or confirmed activities."
          }
        ]
      },
      {
        "id": "q052",
        "categoryId": "travel-styles",
        "question": "Can you design a journey for a solo traveller?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. We can shape the balance between independent time, hosted encounters, and practical support around your preferences."
          }
        ]
      },
      {
        "id": "q053",
        "categoryId": "travel-styles",
        "question": "How do you plan journeys for families with children?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We begin with the children's ages, interests, routines, and comfort with travel. A family itinerary should work for everyone rather than simply add children to an adult schedule."
          },
          {
            "type": "unorderedList",
            "items": [
              "Keep activity lengths and transfer days realistic.",
              "Include breaks and time for unstructured play.",
              "Check room configurations and meal flexibility.",
              "Discuss age restrictions and supervision requirements.",
              "Balance shared experiences with different family interests."
            ]
          }
        ]
      },
      {
        "id": "q054",
        "categoryId": "travel-styles",
        "question": "Can you accommodate a multigenerational family?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. We can discuss shared experiences alongside different energy levels, room needs, and opportunities to rest. Clear information about everyone's requirements helps us find a comfortable balance."
          }
        ]
      },
      {
        "id": "q055",
        "categoryId": "travel-styles",
        "question": "Can you plan a honeymoon or anniversary journey?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. Tell us the atmosphere you want, whether that is quiet time together, cultural exploration, nature, or a combination. Any special arrangements will be confirmed individually."
          }
        ]
      },
      {
        "id": "q056",
        "categoryId": "travel-styles",
        "question": "Can a group of friends travel together?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. It helps to appoint one planning contact while gathering each traveller's essential preferences. We will discuss suitable accommodation, transport, and the balance between shared and optional activities."
          }
        ]
      },
      {
        "id": "q057",
        "categoryId": "travel-styles",
        "question": "Can older travellers enjoy your journeys?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Age alone does not determine the right itinerary. Tell us about comfortable walking distances, preferred travel days, and any specific assistance needs so we can assess suitable arrangements."
          }
        ]
      },
      {
        "id": "q058",
        "categoryId": "travel-styles",
        "question": "Can you help plan around accessibility requirements?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can investigate options and request detailed information from relevant providers. Accessibility varies considerably, so we need specific requirements rather than a general request for an accessible trip."
          },
          {
            "type": "paragraph",
            "text": "Please describe what you need for transport, accommodation, bathrooms, activities, and personal assistance. We will explain what can be confirmed, what remains uncertain, and where an alternative may be necessary."
          },
          {
            "type": "paragraph",
            "text": "We should agree on the suitability of essential arrangements before you commit to the journey."
          }
        ]
      },
      {
        "id": "q059",
        "categoryId": "travel-styles",
        "question": "Can you organise educational or team journeys?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can assess the group's purpose, size, and required support. Share your learning objectives or team goals, along with supervision needs, institutional requirements, and intended dates."
          }
        ]
      },
      {
        "id": "q060",
        "categoryId": "food",
        "question": "Can you accommodate vegetarian or vegan travellers?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can communicate your requirements and investigate suitable options. Please explain what you avoid, as interpretations of vegetarian and vegan food can differ between hosts."
          }
        ]
      },
      {
        "id": "q061",
        "categoryId": "food",
        "question": "What should I tell you about a food allergy?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Tell us about allergies before booking so we can ask providers about their capabilities. We cannot assume that every kitchen can prevent cross-contact."
          },
          {
            "type": "unorderedList",
            "items": [
              "Identify the ingredients you must avoid.",
              "Explain whether cross-contact is a concern.",
              "Share any written information you want passed to hosts.",
              "Tell us whether your requirements affect your willingness to join particular food experiences."
            ]
          },
          {
            "type": "paragraph",
            "text": "Reconfirm essential requirements directly with food providers and discuss your personal preparation with your clinician."
          }
        ]
      },
      {
        "id": "q062",
        "categoryId": "food",
        "question": "Do all journeys include meals?",
        "answer": [
          {
            "type": "paragraph",
            "text": "No. Included meals vary by itinerary and property. Your proposal should identify what is covered and which meals remain at your own expense."
          }
        ]
      },
      {
        "id": "q063",
        "categoryId": "food",
        "question": "Can we include a meal in a local home?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can explore hosted meals where suitable local arrangements are available. The menu, setting, group size, and dietary flexibility depend on the host."
          }
        ]
      },
      {
        "id": "q064",
        "categoryId": "food",
        "question": "Can we request mild food?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. We can communicate your preference, although some dishes or pre-prepared components may not be adjustable. Tell your host before the meal rather than after it is served."
          }
        ]
      },
      {
        "id": "q065",
        "categoryId": "food",
        "question": "Can food be the main focus of our journey?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. We can explore a route shaped around regional cooking, ingredients, markets, and the people who prepare local food."
          },
          {
            "type": "unorderedList",
            "items": [
              "Hosted meals and conversations with cooks.",
              "Market visits with appropriate local guidance.",
              "Cooking demonstrations or hands-on sessions.",
              "Introductions to seasonal produce and regional food traditions."
            ]
          },
          {
            "type": "paragraph",
            "text": "Specific experiences depend on the destination, season, and host availability."
          }
        ]
      },
      {
        "id": "q066",
        "categoryId": "food",
        "question": "Can you accommodate religious dietary requirements?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Please explain the exact requirements, including preparation practices or certification needs. We can check options, but availability should be confirmed before the relevant stay or experience is booked."
          }
        ]
      },
      {
        "id": "q067",
        "categoryId": "food",
        "question": "Can we leave some meals unplanned?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Certainly. Open meal times can give you flexibility to follow your appetite, relax at your property, or choose from local recommendations."
          }
        ]
      },
      {
        "id": "q068",
        "categoryId": "preparation",
        "question": "What travel documents will I need?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Document requirements depend on your nationality, itinerary, and personal circumstances. Check the current official requirements for entry, transit, and any restricted-area visits before booking and again before departure."
          },
          {
            "type": "paragraph",
            "text": "We can identify itinerary details relevant to your checks, but we cannot determine your eligibility or guarantee entry."
          }
        ]
      },
      {
        "id": "q069",
        "categoryId": "preparation",
        "question": "Will you arrange my visa?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Do not assume visa services are included. Ask us what assistance, if any, is available for your booking, and use official channels to verify requirements and submit applications."
          }
        ]
      },
      {
        "id": "q070",
        "categoryId": "preparation",
        "question": "Should I arrange travel insurance?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Review appropriate cover before committing to travel, including cancellation, medical needs, disruption, and the activities you intend to undertake. Ask the insurer directly about exclusions and eligibility."
          },
          {
            "type": "paragraph",
            "text": "Your booking terms will explain any insurance requirement that applies to your journey."
          }
        ]
      },
      {
        "id": "q071",
        "categoryId": "preparation",
        "question": "What should I pack?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Pack for your confirmed route, season, and activities. We can help identify practical requirements once the itinerary is settled."
          },
          {
            "type": "unorderedList",
            "items": [
              "Comfortable clothing appropriate to the expected conditions.",
              "Footwear suited to the walks and visits you have chosen.",
              "Any personal medication and relevant documentation.",
              "A suitable layer or rain protection where needed.",
              "Clothing appropriate for the cultural and religious sites on your route."
            ]
          }
        ]
      },
      {
        "id": "q072",
        "categoryId": "preparation",
        "question": "Will you advise us about local etiquette?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. We can explain expectations relevant to your arranged visits, including dress, footwear, photography, and respectful participation. Follow the host's instructions where local practices differ."
          }
        ]
      },
      {
        "id": "q073",
        "categoryId": "preparation",
        "question": "What should I do if I have health concerns before travelling?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Discuss your itinerary and personal circumstances with an appropriately qualified healthcare professional. Tell us about practical requirements that affect the arrangements, such as walking limits, refrigeration needs, or proximity to services."
          },
          {
            "type": "paragraph",
            "text": "We can provide itinerary information for that discussion, but cannot assess whether you are medically fit to travel."
          }
        ]
      },
      {
        "id": "q074",
        "categoryId": "preparation",
        "question": "Can you help me plan for phone connectivity and internet access?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can ask properties about their connectivity and discuss practical options for your route. Coverage and connection quality can vary, especially in rural or remote settings."
          },
          {
            "type": "paragraph",
            "text": "If you need reliable access for work, tell us before booking rather than relying on a general Wi-Fi listing."
          }
        ]
      },
      {
        "id": "q075",
        "categoryId": "preparation",
        "question": "What information will I receive before departure?",
        "answer": [
          {
            "type": "paragraph",
            "text": "The exact documents depend on your arrangements. You should have the practical information needed to understand your confirmed journey."
          },
          {
            "type": "unorderedList",
            "items": [
              "Your confirmed itinerary and accommodation details.",
              "Included services and any important exclusions.",
              "Arrival instructions and relevant contact details.",
              "Activity-specific preparation or access notes.",
              "Any outstanding information or actions required from you."
            ]
          }
        ]
      },
      {
        "id": "q076",
        "categoryId": "support",
        "question": "Who do I contact during my journey?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Your pre-departure information will identify the relevant contacts and the scope of support provided. Save these details before travelling, including an offline copy."
          }
        ]
      },
      {
        "id": "q077",
        "categoryId": "support",
        "question": "Is someone available around the clock?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Support hours and emergency-contact arrangements must be confirmed for your booking. Please do not assume a 24-hour staffed service unless it is explicitly included."
          }
        ]
      },
      {
        "id": "q078",
        "categoryId": "support",
        "question": "What should I do if my arrival flight is delayed?",
        "answer": [
          {
            "type": "orderedList",
            "items": [
              "Follow the airline's instructions and confirm your revised travel details.",
              "Notify your designated journey contact as soon as practical.",
              "Share the updated flight number, arrival time, and any connection changes.",
              "Wait for confirmation of any revised transfer or accommodation arrangements."
            ]
          },
          {
            "type": "paragraph",
            "text": "Additional waiting time or changes may involve charges under the applicable supplier and booking terms."
          }
        ]
      },
      {
        "id": "q079",
        "categoryId": "support",
        "question": "Can I change an activity while travelling?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Ask your journey contact before making changes. We can explore alternatives, but availability, notice periods, and additional costs may affect what is possible."
          }
        ]
      },
      {
        "id": "q080",
        "categoryId": "support",
        "question": "What happens if weather disrupts an experience?",
        "answer": [
          {
            "type": "paragraph",
            "text": "The relevant operator or host may modify, postpone, or cancel an activity when conditions require it. We can help coordinate the next steps within the scope of your arrangements."
          },
          {
            "type": "paragraph",
            "text": "An alternative experience is not always equivalent or available. Any credit, refund, or additional cost will depend on the applicable terms."
          }
        ]
      },
      {
        "id": "q081",
        "categoryId": "support",
        "question": "What if I feel unwell during the journey?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Seek appropriate medical assistance and inform your designated contact when practical. We can help communicate changes to arranged services, but medical assessment and treatment belong with qualified professionals."
          },
          {
            "type": "paragraph",
            "text": "Keep your insurance assistance details accessible and contact the insurer where relevant to your circumstances."
          }
        ]
      },
      {
        "id": "q082",
        "categoryId": "support",
        "question": "How should I raise a concern about a stay or experience?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Raise it promptly with the relevant provider and your journey contact. Explaining the specific issue while you are still there gives everyone a better opportunity to respond."
          },
          {
            "type": "unorderedList",
            "items": [
              "Describe what differs from the confirmed arrangement.",
              "Explain what resolution would help.",
              "Share relevant photographs or details when appropriate.",
              "Keep a record of the response and any agreed next steps."
            ]
          }
        ]
      },
      {
        "id": "q083",
        "categoryId": "support",
        "question": "Can I add extra days once the journey has started?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We can investigate an extension. Accommodation, transport, existing tickets, and any entry conditions will need to be checked before additional arrangements are confirmed."
          }
        ]
      },
      {
        "id": "q084",
        "categoryId": "payments",
        "question": "How is a tailor-made journey priced?",
        "answer": [
          {
            "type": "paragraph",
            "text": "The price reflects your specific route and arrangements rather than a single standard package rate."
          },
          {
            "type": "unorderedList",
            "items": [
              "Travel dates and the number of travellers.",
              "Accommodation choices and room arrangements.",
              "Transport, guides, and specialist hosts.",
              "Included meals, experiences, and tickets.",
              "The scope of planning and journey support."
            ]
          },
          {
            "type": "paragraph",
            "text": "Your proposal should explain the total quoted amount, what it includes, and the conditions under which it may change."
          }
        ]
      },
      {
        "id": "q085",
        "categoryId": "payments",
        "question": "Can you design a journey around a stated budget?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. Share a realistic range and identify your priorities. We can discuss trade-offs in route, duration, stays, and experiences, or explain when the requested combination is unlikely to fit."
          }
        ]
      },
      {
        "id": "q086",
        "categoryId": "payments",
        "question": "Is there a separate journey-design fee?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Any planning or consultation fee will be explained before the relevant work begins, including its scope and whether it is credited towards a confirmed booking."
          }
        ]
      },
      {
        "id": "q087",
        "categoryId": "payments",
        "question": "How much deposit is required?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Your proposal and booking terms will specify the deposit and due date. Requirements can vary according to the suppliers, travel dates, and time remaining before departure."
          }
        ]
      },
      {
        "id": "q088",
        "categoryId": "payments",
        "question": "When is the remaining balance due?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Follow the payment schedule in your confirmed booking documents. Some arrangements may require earlier or full payment, which should be disclosed before confirmation."
          }
        ]
      },
      {
        "id": "q089",
        "categoryId": "payments",
        "question": "Which payment methods and currencies can I use?",
        "answer": [
          {
            "type": "paragraph",
            "text": "We will provide the available payment methods, billing currency, and payment instructions with your booking information. Ask about transaction charges, conversion costs, and any applicable payment limits before sending funds."
          }
        ]
      },
      {
        "id": "q090",
        "categoryId": "payments",
        "question": "What is included in the quoted price?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Only the services explicitly listed as included in your proposal. Do not assume that flights, every meal, permits, tips, or personal expenses are covered."
          },
          {
            "type": "paragraph",
            "text": "Ask us to clarify anything ambiguous before confirming. Optional experiences and services arranged later may be charged separately."
          }
        ]
      },
      {
        "id": "q091",
        "categoryId": "payments",
        "question": "What if I need to cancel or postpone?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Contact us promptly in writing. Cancellation and postponement are governed by your accepted booking terms and the conditions attached to the individual services."
          },
          {
            "type": "orderedList",
            "items": [
              "Identify the booking and explain the change you are requesting.",
              "We review the affected arrangements and applicable supplier conditions.",
              "We explain available options and any charges or recoverable amounts.",
              "You confirm how you would like to proceed before revised arrangements are made."
            ]
          },
          {
            "type": "paragraph",
            "text": "Date changes are not automatically free, and refunds should not be assumed until they are confirmed."
          }
        ]
      },
      {
        "id": "q092",
        "categoryId": "payments",
        "question": "Can the price change after I receive a proposal?",
        "answer": [
          {
            "type": "paragraph",
            "text": "A proposal may have a validity period and remain subject to availability until booking. Your terms should explain any permitted changes after confirmation."
          },
          {
            "type": "paragraph",
            "text": "If you request different dates, additional services, or other amendments, we will explain the revised cost before proceeding."
          }
        ]
      },
      {
        "id": "q093",
        "categoryId": "responsible-travel",
        "question": "What does regenerative travel mean in your approach?",
        "answer": [
          {
            "type": "paragraph",
            "text": "It is an intention to make travel contribute positively to the people, culture, and natural environments connected with a journey. It requires thoughtful choices and honest assessment rather than a promise that travel has no impact."
          },
          {
            "type": "paragraph",
            "text": "For us, the discussion begins with who participates, how local knowledge is valued, what activities are appropriate, and whether the pace and scale of a visit suit the place. Any specific environmental or community-impact claim should be supported by evidence."
          }
        ]
      },
      {
        "id": "q094",
        "categoryId": "responsible-travel",
        "question": "How can my journey support local people?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Thoughtful local spending and respectful participation can help ensure that a journey has value for its hosts as well as its travellers."
          },
          {
            "type": "unorderedList",
            "items": [
              "Choose locally hosted experiences where appropriate.",
              "Value the time and expertise of guides and craftspeople.",
              "Buy directly from makers when suitable opportunities arise.",
              "Respect a host's boundaries and working schedule.",
              "Ask questions without expecting unrestricted access to private life."
            ]
          }
        ]
      },
      {
        "id": "q095",
        "categoryId": "responsible-travel",
        "question": "How are local hosts involved in planning experiences?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Hosts should have a say in what they offer, when they are available, and how visitors participate. We discuss arrangements with the people involved rather than assume their homes, work, or traditions are always open to visitors."
          }
        ]
      },
      {
        "id": "q096",
        "categoryId": "responsible-travel",
        "question": "Should I ask before photographing people?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Yes. Ask clearly and respect the answer. Permission to take a photograph does not automatically include permission to publish it, use it commercially, or identify the person online."
          },
          {
            "type": "paragraph",
            "text": "For children, sensitive settings, and restricted sites, follow the relevant safeguarding requirements and local rules. Your host or guide can help explain appropriate boundaries."
          }
        ]
      },
      {
        "id": "q097",
        "categoryId": "responsible-travel",
        "question": "Can I visit a community without making a purchase?",
        "answer": [
          {
            "type": "paragraph",
            "text": "A visit should not depend on pressure to shop. Any hosting or workshop fee should be explained separately, and purchases should remain your choice."
          }
        ]
      },
      {
        "id": "q098",
        "categoryId": "responsible-travel",
        "question": "Can I bring gifts or make a donation during a visit?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Please discuss this with us beforehand. An unsolicited gift or donation can create expectations or reach the wrong recipient, even when well intended."
          },
          {
            "type": "paragraph",
            "text": "Where support is welcomed, we can ask the host or relevant organisation what is useful and how it should be handled. Avoid distributing items directly to children during visits."
          }
        ]
      },
      {
        "id": "q099",
        "categoryId": "responsible-travel",
        "question": "How can I reduce waste during my journey?",
        "answer": [
          {
            "type": "unorderedList",
            "items": [
              "Carry reusable items that are practical for your route.",
              "Ask about suitable drinking-water refill options.",
              "Decline unnecessary packaging where possible.",
              "Follow local waste arrangements rather than assuming recycling is available.",
              "Leave natural and cultural sites as you found them."
            ]
          },
          {
            "type": "paragraph",
            "text": "Small choices help, but they do not replace the need to consider the journey's wider transport and resource use."
          }
        ]
      },
      {
        "id": "q100",
        "categoryId": "responsible-travel",
        "question": "How can I give feedback about the journey's impact?",
        "answer": [
          {
            "type": "paragraph",
            "text": "Tell us what felt respectful, worthwhile, uncomfortable, or unclear. Feedback about hosting, group size, photography, environmental practices, and the quality of encounters helps us review future arrangements."
          },
          {
            "type": "paragraph",
            "text": "Specific observations are especially useful. Describe the experience and its context without sharing a host's personal details publicly unless you have permission."
          }
        ]
      }
    ]
  } as FaqConfig
}
</script>

<template>
  <div class="overflow-x-hidden">
    <PageHero class="bg-bg-light" :data="pageData.hero" />

    <FaqAccordion class="bg-bg-light" :data="pageData.faq" />
  </div>
</template>