<!-- ~/app/pages/terms.vue -->
<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import LegalDocument from '~/components/LegalDocument.vue'
import type { LegalDocumentConfig } from '~/components/LegalDocument.vue'

const pageData = {
  hero: {
    eyebrow: 'Terms & Conditions',
    titleMain: 'The Details That Matter',    
    titleItalic: 'Simplified.',
    intro: 'Our mutual guidelines governing bespoke itinerary planning, reservations, cancellations, and on-ground operations.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Terms and conditions'
  },
  terms: {
    eyebrow: 'Booking & Guidelines',
    titleLine1: 'Transparent Commitments',
    titleLine2Cursive: 'Brought to you',
    description:
      'Clear arrangements, shared responsibilities, and thoughtful preparation for every journey we design together.',

    effectiveDate: '2026-10-26',
    lastUpdated: '2026-10-26',

    introduction: [
      'These Terms and Conditions explain how Sreejith Travel provides journey-design services, coordinates travel arrangements, and manages bookings. They also describe your responsibilities when using our website or travelling on a journey arranged through us.',
      'Please read these terms alongside your personalised proposal, booking confirmation, and any supplier conditions supplied before booking. Together, these documents explain the services you have selected, the price you have agreed to pay, and the conditions applicable to your journey.'
    ],

    business: {
      name: 'Sreejith Travel',
      legalName: 'Sreejith Cultural Journeys',
      address: {
        line1: 'Journey House, 18 Heritage Lane',
        line2: 'Fort Kochi',
        city: 'Kochi',
        state: 'Kerala',
        postalCode: '682001',
        country: 'India'
      },
      email: 'sreejith.travel@example.com',
      bookingEmail: 'journeys.sreejith@example.com',
      privacyEmail: 'privacy.sreejith@example.com',
      officeHours: 'Monday to Saturday, 9:30 AM to 6:00 PM',
      timezone: 'Indian Standard Time'
    },

    contentsTitle: 'On this page',

    sections: [
      {
        id: 'understanding-these-terms',
        title: '1. Understanding These Terms',
        blocks: [
          {
            type: 'paragraph',
            text: 'In these terms, “we”, “us”, and “our” refer to Sreejith Travel. “You” and “your” refer to the person making an inquiry or booking and, where appropriate, every traveller included in that booking. The “lead traveller” is the person authorised to communicate with us on behalf of the travelling party.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Website use and travel bookings'
          },
          {
            type: 'paragraph',
            text: 'You may browse our website and inquire about a journey without making a booking. The provisions concerning website use apply when you access our content or submit information. The provisions concerning journey design and travel services apply when you engage us for those services or confirm a booking.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Your booking documents'
          },
          {
            type: 'unorderedList',
            items: [
              'Your final accepted journey proposal.',
              'The written booking confirmation and payment schedule.',
              'These Terms and Conditions as accepted at the time of booking.',
              'Supplier conditions disclosed and incorporated into your booking.',
              'Any subsequent amendments agreed in writing.'
            ]
          },
          {
            type: 'paragraph',
            text: 'A journey-specific provision expressly agreed in writing takes priority over a general provision addressing the same subject, subject to applicable law. Please ask us to clarify any inconsistency before accepting your proposal.'
          }
        ]
      },

      {
        id: 'journey-design-services',
        title: '2. Our Journey-Design Services',
        blocks: [
          {
            type: 'paragraph',
            text: 'We design personalised travel experiences shaped around your interests, preferred pace, travel style, and practical requirements. Our work may include route development, accommodation recommendations, cultural experiences, local introductions, transport coordination, and journey support.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'The scope of your arrangements'
          },
          {
            type: 'paragraph',
            text: 'Your proposal identifies the services we are providing and the arrangements we are coordinating with independent providers. Activities, upgrades, assistance, and additional services are included only when expressly stated.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Planning fees and revisions'
          },
          {
            type: 'paragraph',
            text: 'Where a separate journey-design fee applies, its amount and scope will be explained before planning begins. Unless your planning agreement states otherwise, this covers an initial proposal and two consolidated rounds of revisions. Further changes or substantial redevelopment of the original brief may require an additional fee, agreed before that work proceeds.'
          },
          {
            type: 'paragraph',
            text: 'Once the agreed planning work has been delivered, the corresponding design fee is earned for that work and is not automatically refundable if you decide not to book. Any credit towards a confirmed journey will be stated in your planning agreement.'
          }
        ]
      },

      {
        id: 'booking-your-journey',
        title: '3. Booking Your Journey',
        blocks: [
          {
            type: 'paragraph',
            text: 'An itinerary proposal is an invitation to confirm arrangements, not a guarantee that every suggested service has been reserved. Proposals remain valid for 14 calendar days unless another validity period is stated. Availability may change until the relevant reservations are secured.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'The booking process'
          },
          {
            type: 'orderedList',
            items: [
              'Review the route, accommodation, experiences, inclusions, exclusions, and total price.',
              'Provide the requested traveller details and disclose essential requirements.',
              'Accept the final proposal and the applicable booking terms in writing.',
              'Pay the deposit or other amount specified in your payment request.',
              'Receive a written confirmation identifying the services secured for your journey.'
            ]
          },
          {
            type: 'callout',
            title: 'Please check your confirmation',
            text: 'Review traveller names, travel dates, room arrangements, arrival details, and included services promptly. Tell us about discrepancies as soon as you notice them so we can investigate before further reservations depend on that information.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Bookings made for a group'
          },
          {
            type: 'paragraph',
            text: 'The lead traveller must be at least 18 years old and authorised to make arrangements for the party. They are responsible for sharing the booking documents and important updates with every traveller and for obtaining appropriate permission to provide information on their behalf.'
          }
        ]
      },

      {
        id: 'prices-and-inclusions',
        title: '4. Prices, Inclusions & Exclusions',
        blocks: [
          {
            type: 'paragraph',
            text: 'Your journey price is based on the dates, number of travellers, room configuration, route, and services described in the proposal. Prices are quoted in Indian Rupees unless another currency is expressly stated.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'What your price includes'
          },
          {
            type: 'paragraph',
            text: 'Only the services listed as included form part of the quoted price. These may include accommodation, specified meals, private transfers, guiding, entrance fees, or hosted experiences. Descriptions and photographs elsewhere on the website do not add services to your individual booking.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Common exclusions'
          },
          {
            type: 'unorderedList',
            items: [
              'International flights and travel to the agreed starting point.',
              'Visa fees, passport costs, and travel insurance.',
              'Meals, drinks, and room service not listed as included.',
              'Personal purchases, laundry, minibar items, and incidental expenses.',
              'Optional activities, upgrades, and independently arranged excursions.',
              'Gratuities unless expressly included in the proposal.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Taxes and changes to a quotation'
          },
          {
            type: 'paragraph',
            text: 'The quotation will state whether applicable taxes are included or itemised separately. Before confirmation, a change in availability, exchange rates, supplier rates, or your requested arrangements may require a revised proposal.'
          },
          {
            type: 'paragraph',
            text: 'After confirmation, we will not change the agreed price simply because our ordinary operating costs increase. Any adjustment arising from your requested amendments or a specifically disclosed variable charge will be explained before you are asked to accept it.'
          }
        ]
      },

      {
        id: 'payments',
        title: '5. Deposits & Payments',
        blocks: [
          {
            type: 'paragraph',
            text: 'A deposit secures the booking process and enables us to commit funds to the services identified in your proposal. Some properties, transport fares, and specialist experiences require earlier or full payment; these requirements will be disclosed before you confirm.'
          },
          {
            type: 'table',
            caption: 'Standard payment schedule',
            columns: ['Payment', 'Amount', 'Due date'],
            rows: [
              [
                'Booking deposit',
                '30% of the confirmed journey price',
                'Within 7 calendar days of accepting the final proposal'
              ],
              [
                'Final balance',
                'Remaining 70%',
                '60 calendar days before the journey begins'
              ],
              [
                'Bookings made within 60 days of departure',
                '100% of the confirmed journey price',
                'At the time of confirmation'
              ],
              [
                'Additional services requested after confirmation',
                'As quoted and accepted',
                'Before the additional service is secured'
              ]
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Payment methods and charges'
          },
          {
            type: 'paragraph',
            text: 'Available payment methods and account details will be provided with your invoice. Any processing fee charged by us will be disclosed before payment. Your bank or payment provider may separately charge transaction or currency-conversion fees.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Late payments'
          },
          {
            type: 'paragraph',
            text: 'Contact us before the due date if you anticipate difficulty completing a payment. We will notify you of an outstanding balance and explain any deadline for resolving it. If payment remains overdue after that notice, affected services may be released or the booking cancelled under the applicable cancellation terms.'
          },
          {
            type: 'callout',
            title: 'Verify unexpected payment instructions',
            text: 'If you receive a request to pay a different account or use an unfamiliar payment channel, verify it through your established booking contact before transferring funds.'
          }
        ]
      },

      {
        id: 'changes-requested-by-you',
        title: '6. Changes Requested by You',
        blocks: [
          {
            type: 'paragraph',
            text: 'We understand that plans can evolve. Requests to change dates, travellers, accommodation, activities, or transport should be sent in writing by the lead traveller. Changes depend on availability and the conditions attached to the affected services.'
          },
          {
            type: 'orderedList',
            items: [
              'Send your requested amendment with the booking reference.',
              'We review availability, supplier conditions, and the effect on your itinerary.',
              'We provide the proposed changes and any additional cost or available credit.',
              'You accept the revised arrangements in writing.',
              'We issue an updated confirmation once the changes are secured.'
            ]
          },
          {
            type: 'paragraph',
            text: 'You will be responsible for disclosed supplier amendment charges and any agreed price difference. If a request requires substantial additional planning, we will explain the proposed planning fee before carrying out that work.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Substituting a traveller'
          },
          {
            type: 'paragraph',
            text: 'Replacing a traveller may be possible for some services but restricted for others. Named tickets, permits, and specialist activities may require cancellation and rebooking. We will explain the relevant conditions before proceeding.'
          }
        ]
      },

      {
        id: 'cancellation-and-postponement',
        title: '7. Cancellation, Postponement & Refunds',
        blocks: [
          {
            type: 'paragraph',
            text: 'Cancellation requests must be submitted in writing. We will acknowledge receipt and identify the effective cancellation date. The standard schedule below applies to the confirmed journey price unless different component-specific conditions were disclosed and accepted before booking.'
          },
          {
            type: 'table',
            caption: 'Standard cancellation schedule',
            columns: [
              'Notice before the journey begins',
              'Cancellation charge',
              'Refund of the journey price'
            ],
            rows: [
              ['91 days or more', '10%', '90%'],
              ['61–90 days', '30%', '70%'],
              ['31–60 days', '60%', '40%'],
              ['30 days or fewer', '100%', 'No standard refund']
            ]
          },
          {
            type: 'paragraph',
            text: 'Where a component has separately accepted non-refundable conditions, its charge replaces the standard percentage for that component rather than being added to the same amount twice. We will provide a breakdown of the calculation. Any mandatory entitlement to a refund remains unaffected.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Postponing your journey'
          },
          {
            type: 'paragraph',
            text: 'You may request a change of dates instead of cancellation. We will explore whether suppliers can transfer the arrangements or provide credit. Postponement is not automatically free: new dates may involve different rates, amendment charges, or services that cannot be transferred.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Refund processing'
          },
          {
            type: 'paragraph',
            text: 'Once a refund is agreed, we aim to initiate it within 14 working days. Bank and payment-provider processing times are additional. Where a supplier recovery remains unresolved, we will identify the amount under review and update you rather than delay payment of any separate, undisputed refund.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Unused services and early departure'
          },
          {
            type: 'paragraph',
            text: 'Unused meals, nights, transfers, or activities are not automatically refundable when you voluntarily change your plans or leave early. We will investigate any recoverable amount where appropriate and explain the outcome.'
          }
        ]
      },

      {
        id: 'changes-by-us',
        title: '8. Changes or Cancellations Affecting Your Journey',
        blocks: [
          {
            type: 'paragraph',
            text: 'We plan carefully, but local circumstances and supplier availability can occasionally require adjustments. We will communicate relevant changes and consider their effect on the journey you agreed to book.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Minor operational changes'
          },
          {
            type: 'unorderedList',
            items: [
              'Reordering visits within the same day.',
              'Adjusting departure times to account for access or local conditions.',
              'Changing a meeting point or transfer instruction.',
              'Arranging a suitable alternative host when the original host is unavailable.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Significant changes'
          },
          {
            type: 'paragraph',
            text: 'If an essential confirmed service becomes unavailable or must change substantially, we will explain the situation and the available alternatives. We will consider location, accessibility, room arrangements, and the purpose of the service when assessing an alternative—not only its price.'
          },
          {
            type: 'paragraph',
            text: 'Where we cancel a journey for reasons within our control, we will offer a refund of payments for services we will not provide or an alternative arrangement you choose to accept. Your applicable rights and the circumstances of the cancellation will determine any further remedy.'
          }
        ]
      },

      {
        id: 'accommodation-and-transport',
        title: '9. Accommodation, Transport & Independent Providers',
        blocks: [
          {
            type: 'heading',
            level: 3,
            text: 'Accommodation'
          },
          {
            type: 'paragraph',
            text: 'Our suggested stays may include heritage homes, boutique properties, retreats, and contemporary hotels. Their facilities and operating styles differ. Room categories, included meals, and essential confirmed requirements will be identified in your booking documents.'
          },
          {
            type: 'paragraph',
            text: 'Early check-in, late check-out, adjoining rooms, specific views, and bed preferences depend on availability unless expressly confirmed. Additional nights may be necessary to guarantee access to a room outside the property’s normal check-in and check-out times.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Transport and guiding'
          },
          {
            type: 'paragraph',
            text: 'Your itinerary will specify included transfers and transport services. A driver is not automatically a specialist guide, and a vehicle is not automatically available for unrestricted use outside the confirmed schedule. Additional journeys, waiting time, or substantial detours may incur charges agreed before use.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Independent providers'
          },
          {
            type: 'paragraph',
            text: 'Hotels, transport operators, local guides, and experience hosts may deliver services independently. We remain responsible for the obligations we undertake in your booking; using an independent provider does not by itself remove those responsibilities.'
          },
          {
            type: 'paragraph',
            text: 'Services you book separately are governed by your agreement with that provider. Please share details where those services affect the timing or delivery of our arrangements.'
          }
        ]
      },

      {
        id: 'experiences-and-community-visits',
        title: '10. Experiences, Community Visits & Participation',
        blocks: [
          {
            type: 'paragraph',
            text: 'Our experiences involve working communities, living traditions, and natural environments. Access depends on the willingness of hosts, local permissions, seasonal conditions, and the practical suitability of the visit.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Respecting hosts and local life'
          },
          {
            type: 'unorderedList',
            items: [
              'Follow the host’s guidance about access, dress, and participation.',
              'Ask before photographing, recording, or sharing identifying information.',
              'Respect private spaces and activities that are not open to visitors.',
              'Handle tools, objects, and materials only with permission.',
              'Recognise that a visit does not create an obligation to perform, pose, or disclose personal information.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Nature and wildlife experiences'
          },
          {
            type: 'paragraph',
            text: 'Wildlife sightings, weather conditions, and natural events cannot be guaranteed. Guides and operators may alter an activity when conditions require it. Travellers must follow instructions concerning distance, noise, routes, and interaction with wildlife.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Specialist access and documentation'
          },
          {
            type: 'paragraph',
            text: 'Research visits, commercial photography, filming, drone use, and formal interviews require advance discussion. Permission for a leisure visit does not automatically authorise documentation or commercial use. Any required approvals must be secured before the activity proceeds.'
          }
        ]
      },

      {
        id: 'documents-health-and-accessibility',
        title: '11. Travel Documents, Health & Accessibility',
        blocks: [
          {
            type: 'heading',
            level: 3,
            text: 'Passports, visas, and permissions'
          },
          {
            type: 'paragraph',
            text: 'You are responsible for checking current official entry, transit, and permit requirements relevant to your nationality and itinerary. We can provide confirmed journey details for your applications but cannot guarantee approval or entry.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Health and fitness to participate'
          },
          {
            type: 'paragraph',
            text: 'Seek appropriate professional advice about your personal readiness to travel and participate in the planned activities. Tell us about practical requirements that may affect arrangements, without providing more sensitive information than is necessary.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Accessibility and essential requirements'
          },
          {
            type: 'paragraph',
            text: 'Please identify essential requirements before booking. We will request relevant information from providers and explain what can be confirmed. Historic buildings, rural environments, and some transport options may have physical limitations that cannot be resolved through a general accessibility request.'
          },
          {
            type: 'unorderedList',
            items: [
              'Step-free routes and mobility-equipment dimensions.',
              'Bathroom configuration and transfer requirements.',
              'Comfortable walking distances and terrain limitations.',
              'Essential dietary restrictions and cross-contact concerns.',
              'Required assistance, storage, or power arrangements.'
            ]
          },
          {
            type: 'callout',
            title: 'Essential requirements need specific confirmation',
            text: 'A request noted in correspondence is not the same as a confirmed arrangement. Please ensure that any requirement essential to your participation is explicitly addressed in the final booking documents.'
          }
        ]
      },

      {
        id: 'travel-insurance',
        title: '12. Travel Insurance',
        blocks: [
          {
            type: 'paragraph',
            text: 'We strongly recommend arranging suitable travel insurance when you make your first non-refundable payment. Review the policy directly with the insurer to understand eligibility, exclusions, limits, and the activities covered.'
          },
          {
            type: 'unorderedList',
            items: [
              'Cancellation and interruption of the journey.',
              'Medical treatment and emergency assistance.',
              'Transport disruption and missed connections.',
              'Loss, theft, or damage affecting belongings.',
              'Any planned activities requiring specific cover.'
            ]
          },
          {
            type: 'paragraph',
            text: 'We do not assess insurance suitability or guarantee that an insurer will accept a claim. If a particular activity requires evidence of cover, this will be explained before that activity is confirmed.'
          }
        ]
      },

      {
        id: 'traveller-conduct',
        title: '13. Traveller Conduct & Personal Responsibilities',
        blocks: [
          {
            type: 'paragraph',
            text: 'Every traveller is expected to act respectfully towards fellow travellers, hosts, guides, drivers, and the wider community. Conduct that creates a safety risk or involves harassment, discrimination, damage, or unlawful activity may affect continued participation.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Your responsibilities during the journey'
          },
          {
            type: 'unorderedList',
            items: [
              'Arrive at agreed meeting points on time.',
              'Follow reasonable safety instructions.',
              'Take appropriate care of personal belongings.',
              'Inform the journey contact promptly about problems affecting the arrangements.',
              'Provide suitable supervision for accompanying children.',
              'Respect property, cultural sites, and natural environments.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Refusal or termination of participation'
          },
          {
            type: 'paragraph',
            text: 'Where conduct presents a serious or immediate concern, a provider may restrict an activity or require a traveller to leave. Where practical, the concern and the opportunity to resolve it will be explained first. Any effect on costs or refunds will be assessed under the applicable terms and circumstances rather than assumed automatically.'
          }
        ]
      },

      {
        id: 'unexpected-events',
        title: '14. Unexpected Events & Disruption',
        blocks: [
          {
            type: 'paragraph',
            text: 'Events outside the reasonable control of the parties can affect a journey. These may include severe weather, natural hazards, transport interruptions, government restrictions, public disturbances, or unexpected closure of sites and facilities.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'How we respond'
          },
          {
            type: 'orderedList',
            items: [
              'Assess the effect on the confirmed arrangements.',
              'Communicate the information available and any immediate instructions.',
              'Explore reasonable alternatives with the affected providers.',
              'Explain known additional costs and unresolved decisions.',
              'Confirm agreed changes and continue providing relevant updates.'
            ]
          },
          {
            type: 'paragraph',
            text: 'The occurrence of an unexpected event does not automatically remove refund rights or transfer every additional expense to the traveller. The outcome depends on the affected services, the booking conditions, and applicable law.'
          }
        ]
      },

      {
        id: 'responsibility-and-liability',
        title: '15. Responsibility & Liability',
        blocks: [
          {
            type: 'paragraph',
            text: 'We will exercise reasonable care and skill in providing the services we agree to undertake. Our responsibilities are determined by the confirmed scope of the booking and the obligations that apply to those services.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Loss and disruption'
          },
          {
            type: 'paragraph',
            text: 'We are not responsible for every disappointment, inconvenience, or loss that occurs during travel. Responsibility depends on what happened, the duties owed, and whether a failure within our responsibility caused the loss.'
          },
          {
            type: 'paragraph',
            text: 'Where you independently purchase a service outside our confirmed arrangements, we do not become its provider merely by discussing it or helping coordinate a meeting time. This does not exclude responsibility for any separate commitment we expressly make.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Reporting and reducing loss'
          },
          {
            type: 'paragraph',
            text: 'Please report problems promptly and take reasonable steps to prevent avoidable additional loss. Keep relevant receipts and correspondence where you intend to request reimbursement or another remedy.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Your statutory rights'
          },
          {
            type: 'paragraph',
            text: 'Nothing in these terms excludes or restricts any liability, protection, or remedy that cannot lawfully be excluded or restricted. Any provision that conflicts with a mandatory legal requirement applies only to the extent permitted.'
          }
        ]
      },

      {
        id: 'website-and-content',
        title: '16. Website Use & Intellectual Property',
        blocks: [
          {
            type: 'paragraph',
            text: 'Our website introduces destinations, experiences, and our approach to travel design. We aim to keep information useful and accurate, but availability, access, schedules, and services can change. Your confirmed booking documents identify the arrangements purchased.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Using our content'
          },
          {
            type: 'paragraph',
            text: 'Website writing, photographs, films, illustrations, branding, and itinerary materials are owned by us or used with permission from their respective rights holders. You may browse and share public page links for personal purposes. Reproduction, redistribution, or commercial reuse requires permission where protected rights apply.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Acceptable website use'
          },
          {
            type: 'unorderedList',
            items: [
              'Submit genuine inquiries using accurate information.',
              'Do not attempt to access restricted accounts or systems.',
              'Do not introduce malicious code or interfere with website operation.',
              'Do not impersonate another person or misrepresent an association with us.',
              'Do not use contact forms for unsolicited promotions or fraudulent requests.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'External links'
          },
          {
            type: 'paragraph',
            text: 'Links to other websites may provide additional information or access to independent services. Those websites operate under their own terms and privacy practices. A link does not by itself establish ownership, control, or endorsement.'
          }
        ]
      },

      {
        id: 'privacy-and-photography',
        title: '17. Privacy, Photography & Personal Information',
        blocks: [
          {
            type: 'paragraph',
            text: 'We use traveller information to respond to inquiries, develop proposals, manage bookings, and coordinate agreed services. Our Privacy Policy explains the handling of personal information in greater detail.'
          },
          {
            type: 'links',
            items: [
              {
                label: 'Read our Privacy Policy',
                to: '/privacy'
              }
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Sharing information for your journey'
          },
          {
            type: 'paragraph',
            text: 'Relevant information may need to be shared with accommodation providers, transport operators, guides, or other parties involved in delivering your arrangements. We aim to limit disclosures to what is needed for the stated purpose.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Photographs and testimonials'
          },
          {
            type: 'paragraph',
            text: 'Booking a journey does not grant us unrestricted permission to publish your portrait, testimonial, or personal story. Where we would like to use identifiable material for promotion, we will seek appropriate permission separately.'
          },
          {
            type: 'paragraph',
            text: 'You must also respect the privacy and image rights of hosts, community members, and other travellers. Permission to take a photograph should not be treated as automatic permission for commercial publication.'
          }
        ]
      },

      {
        id: 'complaints-and-resolution',
        title: '18. Feedback, Complaints & Resolution',
        blocks: [
          {
            type: 'paragraph',
            text: 'We welcome feedback and ask that concerns affecting your journey be raised as soon as practical. Early communication gives us and the relevant provider a better opportunity to understand and resolve the issue.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'During your journey'
          },
          {
            type: 'orderedList',
            items: [
              'Inform your designated journey contact or the relevant on-site provider.',
              'Explain the issue and how it differs from the confirmed arrangement.',
              'Describe the practical resolution you would find helpful.',
              'Allow a reasonable opportunity for a response where the circumstances permit.',
              'Keep relevant details of the issue and any agreed action.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Written complaints'
          },
          {
            type: 'paragraph',
            text: 'If an issue remains unresolved, email a written summary with your booking reference, relevant dates, supporting information, and requested outcome. We aim to acknowledge complaints within three working days and provide a substantive response within 14 working days.'
          },
          {
            type: 'paragraph',
            text: 'Some matters require information from independent providers. Where further investigation is necessary, we will explain the outstanding steps and provide an updated response timeframe.'
          },
          {
            type: 'links',
            items: [
              {
                label: 'Contact our journey team',
                to: 'mailto:journeys.sreejith@example.com'
              },
              {
                label: 'Visit the contact page',
                to: '/contact'
              }
            ]
          }
        ]
      },

      {
        id: 'governing-law-and-updates',
        title: '19. Governing Law & Updates',
        blocks: [
          {
            type: 'heading',
            level: 3,
            text: 'Governing law'
          },
          {
            type: 'paragraph',
            text: 'These terms are governed by the laws of India. Subject to any mandatory right to bring proceedings elsewhere or use an applicable consumer forum, disputes will be submitted to the competent courts in Ernakulam, Kerala.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Changes to these terms'
          },
          {
            type: 'paragraph',
            text: 'We may update these terms to reflect changes in our services or operating arrangements. The date at the top of this page identifies the latest published version. Updated terms do not automatically replace those accepted for an existing booking.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'The agreement as a whole'
          },
          {
            type: 'paragraph',
            text: 'The accepted booking documents record the agreement concerning your journey. A subsequent amendment must be agreed in writing. If a provision is found unenforceable, the remaining provisions continue to apply to the extent permitted by law.'
          }
        ]
      },

      {
        id: 'contact-details',
        title: '20. Contact Details',
        blocks: [
          {
            type: 'paragraph',
            text: 'For questions about these terms, your proposal, or an existing booking, please contact our team. Include your booking reference where available so we can direct the inquiry appropriately.'
          },
          {
            type: 'contact',
            name: 'Sreejith Travel',
            legalName: 'Sreejith Cultural Journeys',
            address: [
              'Journey House, 18 Heritage Lane',
              'Fort Kochi, Kochi',
              'Kerala 682001',
              'India'
            ],
            email: 'sreejith.travel@example.com',
            bookingEmail: 'journeys.sreejith@example.com',
            officeHours: 'Monday to Saturday, 9:30 AM to 6:00 PM IST'
          },
          {
            type: 'paragraph',
            text: 'Travellers with confirmed arrangements will receive their designated journey-support contact before departure. Office hours shown here should not be interpreted as the support schedule for an individual booking.'
          },
          {
            type: 'links',
            items: [
              {
                label: 'Contact us',
                to: '/contact'
              },
              {
                label: 'Frequently asked questions',
                to: '/faq'
              },
              {
                label: 'Privacy Policy',
                to: '/privacy'
              }
            ]
          }
        ]
      }
    ]
  } as LegalDocumentConfig
}
</script>

<template>
  <div class="w-full">
    <PageHero class="bg-bg-light" :data="pageData.hero" />
    <LegalDocument class="bg-bg-light" :data="pageData.terms" />
  </div>
</template>