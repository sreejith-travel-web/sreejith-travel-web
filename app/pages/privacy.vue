<!-- ~/app/pages/privacy.vue -->

<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import LegalDocument from '~/components/LegalDocument.vue'
import type { LegalDocumentConfig } from '~/components/LegalDocument.vue'

const pageData = {
  hero: {
    eyebrow: 'Privacy Policy',
    titleMain: 'Your Trust Matters',
    titleItalic: 'Protecting Your Discretion',
    intro: 'How we safeguard your personal information, travel preferences, and private correspondence with the utmost care.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Privacy policy'
  },
  privacy: {
    eyebrow: 'Legal & Trust',
    titleLine1: 'Privacy - Respected',
    titleLine2Cursive: 'Data - Guarded.',
    description:
      'Understanding the information you share with us, why we need it, and how we care for it throughout your journey.',

    effectiveDate: '2026-10-26',
    lastUpdated: '2026-10-26',

    introduction: [
      'Planning a personal journey involves sharing information about yourself, your preferences, and sometimes the people travelling with you. At Sreejith Travel, we recognise the trust involved and aim to handle that information thoughtfully, transparently, and only for appropriate purposes.',
      'This Privacy Policy explains how we collect, use, store, and share personal information when you browse our website, contact us, complete a planning questionnaire, book a journey, or participate in our experiences. It also explains how to contact us about your information and privacy preferences.'
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
        id: 'about-this-policy',
        title: '1. About This Policy',
        blocks: [
          {
            type: 'paragraph',
            text: 'In this policy, “we”, “us”, and “our” refer to Sreejith Travel, operated as Sreejith Cultural Journeys. “You” refers to website visitors, people making inquiries, travellers, booking contacts, community members, and other individuals whose personal information we handle.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'What this policy covers'
          },
          {
            type: 'unorderedList',
            items: [
              'Visits to our website and interactions with its features.',
              'Journey-planning questionnaires and travel inquiries.',
              'Correspondence through email, telephone, messaging, or meetings.',
              'Bookings and the coordination of travel services.',
              'Feedback, testimonials, photographs, and marketing preferences.',
              'Professional and community-partnership inquiries.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Independent services'
          },
          {
            type: 'paragraph',
            text: 'Hotels, airlines, payment providers, messaging platforms, and other independent organisations may handle information under their own privacy policies. This policy describes our handling of information; it does not replace the policies of those organisations.'
          }
        ]
      },

      {
        id: 'information-you-provide',
        title: '2. Information You Share With Us',
        blocks: [
          {
            type: 'paragraph',
            text: 'The information we request depends on how you interact with us. An initial inquiry usually requires fewer details than a confirmed journey involving accommodation, transport, permits, or specialist assistance.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Contact and inquiry details'
          },
          {
            type: 'unorderedList',
            items: [
              'Your name and preferred form of address.',
              'Email address, telephone number, and preferred contact method.',
              'Country of residence and time zone where relevant.',
              'Messages, questions, and information you choose to include in correspondence.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Journey preferences'
          },
          {
            type: 'unorderedList',
            items: [
              'Preferred travel dates, destinations, and journey duration.',
              'Approximate budget and accommodation preferences.',
              'Interests, travel pace, and desired experiences.',
              'Group size, room arrangements, and relevant age information.',
              'Dietary preferences, accessibility requirements, and other practical needs.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Booking and identification details'
          },
          {
            type: 'paragraph',
            text: 'When required for a confirmed service, we may request names as shown on travel documents, nationality, date of birth, identification details, or other information needed by the relevant provider. We aim to request these details only when there is a specific booking or administrative reason.'
          },
          {
            type: 'callout',
            title: 'Share only what is needed',
            text: 'Please do not include passport copies, payment-card details, medical records, or other sensitive documents in a general inquiry form. If additional information is necessary, we will explain the purpose and the appropriate way to provide it.'
          }
        ]
      },

      {
        id: 'information-collected-automatically',
        title: '3. Information Collected Through the Website',
        blocks: [
          {
            type: 'paragraph',
            text: 'When you visit the website, the systems used to deliver and protect it may process technical information about the request. This helps the website function, supports troubleshooting, and enables us to understand its operation.'
          },
          {
            type: 'unorderedList',
            items: [
              'Internet Protocol address and request timestamps.',
              'Browser type, device characteristics, and operating system.',
              'Requested pages, referring pages, and response information.',
              'Error reports and security-related events.',
              'Cookie or similar technology information, where used.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Website measurement'
          },
          {
            type: 'paragraph',
            text: 'Where website analytics are enabled, we may use them to understand which pages are useful and where visitors encounter difficulties. Any non-essential tracking should follow the choices available through the website’s privacy controls.'
          },
          {
            type: 'paragraph',
            text: 'We do not need you to provide your identity simply to browse public pages. Technical data may nevertheless relate to an identifiable device or individual and is handled accordingly.'
          }
        ]
      },

      {
        id: 'information-from-other-people',
        title: '4. Information Received From Other People',
        blocks: [
          {
            type: 'paragraph',
            text: 'We may receive information about you from a lead traveller, family member, authorised travel professional, or service provider involved in your arrangements. For example, a booking contact may provide names for a shared itinerary, or a property may report an issue requiring our assistance.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Providing information about fellow travellers'
          },
          {
            type: 'paragraph',
            text: 'If you provide information about someone else, please ensure that you are authorised to do so and that they know their information is being shared. Give them access to this policy and avoid sending personal details unrelated to the arrangements.'
          },
          {
            type: 'paragraph',
            text: 'Where appropriate, we may ask the individual to confirm a requirement or provide information directly, particularly when the information is sensitive or a personal choice needs to be recorded.'
          }
        ]
      },

      {
        id: 'how-we-use-information',
        title: '5. How We Use Your Information',
        blocks: [
          {
            type: 'paragraph',
            text: 'We use personal information for defined purposes connected with our website, services, and business responsibilities. The information needed for a purpose should be proportionate to that purpose.'
          },
          {
            type: 'table',
            caption: 'Common uses of personal information',
            columns: [
              'Purpose',
              'Information commonly involved'
            ],
            rows: [
              [
                'Responding to an inquiry',
                'Name, contact details, correspondence, and initial travel interests'
              ],
              [
                'Designing a journey',
                'Travel preferences, dates, budget, group requirements, and planning feedback'
              ],
              [
                'Confirming services',
                'Traveller names, booking details, and identification information where required'
              ],
              [
                'Supporting your journey',
                'Itinerary, contact details, relevant requirements, and service updates'
              ],
              [
                'Managing payments and accounts',
                'Billing information, invoices, payment references, and transaction status'
              ],
              [
                'Improving our services',
                'Feedback, complaints, website performance information, and service records'
              ],
              [
                'Sending requested updates',
                'Contact details, subscription choices, and communication preferences'
              ],
              [
                'Protecting the business and meeting obligations',
                'Relevant records concerning security, accounting, disputes, or lawful requests'
              ]
            ]
          },
          {
            type: 'paragraph',
            text: 'If we wish to use information for a materially different purpose, we will explain that purpose and obtain any permission required before proceeding.'
          }
        ]
      },

      {
        id: 'grounds-for-processing',
        title: '6. Why We May Process Your Information',
        blocks: [
          {
            type: 'paragraph',
            text: 'The grounds on which we handle personal information depend on the purpose and the laws applicable to the interaction. These may include your consent, steps you request before booking, delivery of agreed services, legal obligations, and other grounds permitted by applicable law.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Consent and your choices'
          },
          {
            type: 'paragraph',
            text: 'Where we rely on consent, we aim to explain what you are agreeing to and provide a way to withdraw it. Withdrawing consent does not undo processing already carried out lawfully, but it may affect a service that depends on the information.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Information needed for a booking'
          },
          {
            type: 'paragraph',
            text: 'Some information is necessary to arrange a service you request. If you choose not to provide it, we will explain whether we can offer an alternative or whether the affected service cannot be confirmed.'
          }
        ]
      },

      {
        id: 'sensitive-travel-requirements',
        title: '7. Dietary, Health & Accessibility Information',
        blocks: [
          {
            type: 'paragraph',
            text: 'A thoughtful journey may require us to understand practical needs that reveal sensitive information. Examples include a food allergy, mobility requirement, religious dietary practice, or assistance needed during an activity.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Keeping requests proportionate'
          },
          {
            type: 'paragraph',
            text: 'We generally need to understand the arrangement required rather than your complete medical history or personal circumstances. For example, confirming a step-free room may require access measurements and bathroom details, not an explanation of a diagnosis.'
          },
          {
            type: 'unorderedList',
            items: [
              'We ask for information relevant to the arrangement.',
              'We explain when a provider needs to receive it.',
              'We seek appropriate permission where required.',
              'We limit access to people involved in addressing the requirement.',
              'We avoid using sensitive travel requirements for unrelated marketing.'
            ]
          },
          {
            type: 'paragraph',
            text: 'Please tell us if you would prefer to discuss a requirement privately. We will explain available communication options and any limits on our ability to arrange the service without sharing essential details.'
          }
        ]
      },

      {
        id: 'sharing-with-travel-providers',
        title: '8. Sharing Information to Arrange Your Journey',
        blocks: [
          {
            type: 'paragraph',
            text: 'Travel coordination often requires limited sharing with the people and organisations delivering your arrangements. We aim to share relevant information rather than forward an entire inquiry or traveller record unnecessarily.'
          },
          {
            type: 'table',
            caption: 'Examples of journey-related sharing',
            columns: [
              'Recipient',
              'Information they may need',
              'Purpose'
            ],
            rows: [
              [
                'Accommodation provider',
                'Guest names, stay dates, room arrangements, and essential requirements',
                'Preparing and delivering your stay'
              ],
              [
                'Driver or transfer operator',
                'Lead contact details, pickup location, timing, and luggage requirements',
                'Coordinating the confirmed transfer'
              ],
              [
                'Guide or experience host',
                'Group size, meeting details, relevant interests, and participation requirements',
                'Preparing an appropriate visit or activity'
              ],
              [
                'Transport or permit provider',
                'Traveller identification details required for the specific service',
                'Issuing tickets or obtaining permissions'
              ],
              [
                'Journey-support partner',
                'Relevant itinerary and contact information',
                'Helping resolve an issue affecting the journey'
              ]
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Independent responsibilities'
          },
          {
            type: 'paragraph',
            text: 'Some recipients act independently and have their own recordkeeping obligations and privacy practices. Where relevant, you may need to review their policies or contact them directly about information they hold.'
          }
        ]
      },

      {
        id: 'other-service-providers',
        title: '9. Other Service Providers & Disclosures',
        blocks: [
          {
            type: 'paragraph',
            text: 'We may use providers that support website hosting, email delivery, document storage, business administration, payments, security, and professional advice. Access should be limited to what is appropriate for the service they provide.'
          },
          {
            type: 'unorderedList',
            items: [
              'Technology providers supporting the website and business systems.',
              'Payment processors and financial institutions handling transactions.',
              'Accountants, legal advisers, and other professional advisers.',
              'Authorities where disclosure is required or otherwise permitted by law.',
              'Relevant parties where necessary to investigate fraud, protect safety, or establish or defend a legal claim.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Business changes'
          },
          {
            type: 'paragraph',
            text: 'If the business is reorganised or transferred, relevant information may need to be reviewed or transferred as part of that process. Any such handling should remain subject to appropriate confidentiality, legal requirements, and notice where required.'
          },
          {
            type: 'paragraph',
            text: 'We do not sell traveller contact lists or provide personal information to unrelated businesses for their own marketing purposes.'
          }
        ]
      },

      {
        id: 'payments-and-billing',
        title: '10. Payments & Billing Information',
        blocks: [
          {
            type: 'paragraph',
            text: 'We may retain invoices, billing details, payment references, amounts received, and transaction status to manage your booking and maintain financial records.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Payment credentials'
          },
          {
            type: 'paragraph',
            text: 'Where a payment provider processes your transaction, payment credentials should be entered through that provider’s designated interface. We do not ask you to send a card security code, banking password, or one-time payment code through an inquiry form or ordinary correspondence.'
          },
          {
            type: 'callout',
            title: 'Keep payment credentials private',
            text: 'Do not send full card details, passwords, or payment authorisation codes to our team. If you receive an unexpected request for such information, verify it using your established booking contact.'
          },
          {
            type: 'paragraph',
            text: 'Payment providers handle information under their own terms and privacy policies. We may receive confirmation or transaction information without receiving the full credentials used to make the payment.'
          }
        ]
      },

      {
        id: 'cookies-and-local-storage',
        title: '11. Cookies & Similar Technologies',
        blocks: [
          {
            type: 'paragraph',
            text: 'Cookies and similar technologies can help a website remember choices, maintain a session, understand performance, or connect with third-party features. Browser storage may also retain preferences on your device.'
          },
          {
            type: 'table',
            caption: 'Types of website technologies',
            columns: [
              'Category',
              'Purpose',
              'How choices are handled'
            ],
            rows: [
              [
                'Essential functionality',
                'Supporting security, form operation, and features needed to provide the requested website service',
                'Explained through website notices and browser controls'
              ],
              [
                'Preference storage',
                'Remembering choices such as display preferences or privacy settings',
                'Controlled through available website settings and browser storage'
              ],
              [
                'Analytics',
                'Understanding website use and identifying problems',
                'Subject to applicable permission requirements and available privacy controls'
              ],
              [
                'Third-party media',
                'Displaying embedded video, maps, or other external content',
                'May be deferred until you choose to load the feature'
              ]
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Managing your preferences'
          },
          {
            type: 'paragraph',
            text: 'Where privacy controls are provided, you can use them to review or change non-essential technology choices. You can also manage cookies and stored data through your browser. Blocking some technologies may affect the features available to you.'
          },
          {
            type: 'paragraph',
            text: 'The technologies actually used, their providers, and their relevant storage periods should be described in the website’s cookie information. This policy does not imply that every category is active on every page.'
          }
        ]
      },

      {
        id: 'embedded-content',
        title: '12. Videos, Maps & External Platforms',
        blocks: [
          {
            type: 'paragraph',
            text: 'Our website may link to or display content from video platforms, mapping services, social networks, or other external providers. Loading an embedded feature may allow its provider to receive technical information about your visit.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Choosing to load external content'
          },
          {
            type: 'paragraph',
            text: 'Where a click-to-load option is available, the external feature remains inactive until you choose to open it. Its provider may then apply its own cookies, technologies, account settings, and privacy practices.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Leaving our website'
          },
          {
            type: 'paragraph',
            text: 'An external link takes you to a service operated independently of Sreejith Travel. Review that service’s privacy information before submitting personal details or connecting an account.'
          }
        ]
      },

      {
        id: 'communications-and-marketing',
        title: '13. Communications & Marketing Preferences',
        blocks: [
          {
            type: 'heading',
            level: 3,
            text: 'Journey-related communications'
          },
          {
            type: 'paragraph',
            text: 'We use your contact details to respond to inquiries, discuss proposals, send confirmations, and communicate practical updates. These messages are connected with the service you requested and are separate from optional promotional communications.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Optional updates'
          },
          {
            type: 'paragraph',
            text: 'Where you choose to receive them, we may send travel ideas, journal updates, or information about our experiences. We aim to make the choice clear rather than treat every inquiry as an unrestricted marketing subscription.'
          },
          {
            type: 'unorderedList',
            items: [
              'Use the unsubscribe option in a promotional email.',
              'Contact us to change the address or channel used for updates.',
              'Ask us to stop optional promotional communications.',
              'Tell us if a preference change has not been reflected.'
            ]
          },
          {
            type: 'paragraph',
            text: 'After an unsubscribe request, we may retain a limited suppression record so we can respect your choice. You may still receive necessary messages about an active booking, outstanding payment, or relevant legal matter.'
          }
        ]
      },

      {
        id: 'messaging-and-correspondence',
        title: '14. Email, Messaging & Correspondence',
        blocks: [
          {
            type: 'paragraph',
            text: 'You may choose to contact us through email, telephone, messaging applications, or social platforms. We use those communications to understand your request and maintain a record of relevant arrangements.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Using third-party communication channels'
          },
          {
            type: 'paragraph',
            text: 'Messaging and social platforms have their own privacy practices. If you prefer not to use a particular platform, ask us about another available contact method.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Documents and sensitive details'
          },
          {
            type: 'paragraph',
            text: 'Before sending identification documents or information about personal support needs, ask which channel is appropriate. We may move important booking details from a conversation into a booking record so they can be managed consistently.'
          },
          {
            type: 'paragraph',
            text: 'We do not routinely record calls. If a call or online meeting is to be recorded, we will explain that before recording begins and obtain any permission required.'
          }
        ]
      },

      {
        id: 'photographs-and-testimonials',
        title: '15. Photographs, Stories & Testimonials',
        blocks: [
          {
            type: 'paragraph',
            text: 'Travel often creates photographs and stories that people wish to share. We distinguish between material needed to deliver a service and material proposed for public use.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Your permission'
          },
          {
            type: 'paragraph',
            text: 'Booking a journey does not automatically authorise us to publish your portrait, name, personal story, or testimonial. Where we seek permission, we will explain the material and intended use.'
          },
          {
            type: 'unorderedList',
            items: [
              'A written testimonial displayed on the website.',
              'A photograph used in a journal article or experience page.',
              'A video shared through our website or social channels.',
              'A community profile identifying a host or professional partner.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Changing your mind'
          },
          {
            type: 'paragraph',
            text: 'Contact us if you wish to withdraw permission for a use based on consent. We will review the request and explain what can be removed or stopped, including any practical limits affecting printed material already distributed or content independently shared by others.'
          },
          {
            type: 'paragraph',
            text: 'Please do not submit another person’s identifiable photograph or story for publication unless you have the necessary permission.'
          }
        ]
      },

      {
        id: 'children-and-family-information',
        title: '16. Children & Family Information',
        blocks: [
          {
            type: 'paragraph',
            text: 'Our inquiry and booking services are intended to be used by adults. A parent, guardian, or authorised adult should coordinate information needed for children included in a family journey.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Information needed for family arrangements'
          },
          {
            type: 'paragraph',
            text: 'We may need a child’s name, age, relevant travel-document details, or practical requirements to arrange suitable rooms, tickets, meals, or activities. We aim to avoid collecting details that are not needed for those arrangements.'
          },
          {
            type: 'paragraph',
            text: 'We do not use children’s booking details to create marketing profiles. Publication of identifiable photographs or stories involving children requires appropriate permission and consideration of the child’s privacy and wellbeing.'
          },
          {
            type: 'paragraph',
            text: 'If you believe a child has submitted personal information directly without appropriate authorisation, contact us so we can investigate and take suitable action.'
          }
        ]
      },

      {
        id: 'storage-and-retention',
        title: '17. Storage & Retention',
        blocks: [
          {
            type: 'paragraph',
            text: 'We retain information for as long as it is reasonably needed for the purpose for which it was collected, including relevant accounting, legal, complaint-handling, and recordkeeping obligations. Different records may require different retention periods.'
          },
          {
            type: 'table',
            caption: 'How retention is considered',
            columns: [
              'Record category',
              'Retention approach'
            ],
            rows: [
              [
                'Unconfirmed inquiries',
                'Reviewed after the inquiry becomes inactive and removed or reduced when no longer needed'
              ],
              [
                'Confirmed booking records',
                'Kept for service administration and the applicable recordkeeping period'
              ],
              [
                'Identification documents',
                'Kept only as long as required for the relevant booking purpose or obligation'
              ],
              [
                'Dietary, health, and accessibility details',
                'Reviewed after the journey and removed when the operational need and any relevant obligation end'
              ],
              [
                'Financial records',
                'Retained for the period required by applicable accounting and tax obligations'
              ],
              [
                'Marketing preferences',
                'Kept while relevant, with limited suppression information retained to honour opt-out requests'
              ],
              [
                'Complaints and disputes',
                'Kept while the matter remains relevant and for any applicable legal period'
              ]
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Deletion and backups'
          },
          {
            type: 'paragraph',
            text: 'When information is no longer needed, we aim to delete it, anonymise it, or reduce it to the minimum record still required. Backup copies may remain until the relevant backup cycle completes and should remain protected during that period.'
          }
        ]
      },

      {
        id: 'information-security',
        title: '18. Information Security',
        blocks: [
          {
            type: 'paragraph',
            text: 'We use organisational and technical measures appropriate to the systems and information involved. These measures are intended to reduce the risk of unauthorised access, loss, misuse, or disclosure.'
          },
          {
            type: 'unorderedList',
            items: [
              'Limiting access according to work responsibilities.',
              'Using appropriate account and device protections.',
              'Keeping relevant systems and software maintained.',
              'Selecting suitable channels for sharing booking information.',
              'Reviewing information-handling practices and responding to reported concerns.'
            ]
          },
          {
            type: 'paragraph',
            text: 'No website, communication channel, or storage system can be guaranteed completely secure. Please protect your own devices and accounts, and avoid sending sensitive information through a shared or unsecured device.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Suspected incidents'
          },
          {
            type: 'paragraph',
            text: 'If we become aware of an incident affecting personal information, we will assess it, take appropriate containment and response steps, and provide notifications where required. Contact us promptly if you suspect that information shared with us has been misused.'
          }
        ]
      },

      {
        id: 'international-information-handling',
        title: '19. International Information Handling',
        blocks: [
          {
            type: 'paragraph',
            text: 'Travel arrangements and digital services can involve organisations in more than one country. Information may be accessed or processed where a relevant provider, traveller, business system, or support team operates.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Cross-border arrangements'
          },
          {
            type: 'paragraph',
            text: 'Where information is transferred internationally, we will consider the requirements applicable to that transfer and the safeguards appropriate to the service. A provider’s location does not by itself determine whether a transfer is suitable.'
          },
          {
            type: 'paragraph',
            text: 'Contact us if you need more information about international handling relevant to your inquiry or booking. We will explain what we can about the arrangements involved.'
          }
        ]
      },

      {
        id: 'your-privacy-choices',
        title: '20. Your Privacy Choices & Requests',
        blocks: [
          {
            type: 'paragraph',
            text: 'Depending on the laws applicable to your information and the circumstances of the request, you may have rights concerning access, correction, deletion, consent, objections, or other aspects of processing.'
          },
          {
            type: 'unorderedList',
            items: [
              'Ask about the personal information we hold about you.',
              'Request correction of inaccurate or incomplete information.',
              'Ask us to delete information that no longer needs to be retained.',
              'Withdraw consent where processing relies on that consent.',
              'Change optional communication preferences.',
              'Raise a concern about how information has been handled.',
              'Request other remedies available under applicable law.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Limits and explanations'
          },
          {
            type: 'paragraph',
            text: 'A request may be subject to identity checks, legal exceptions, or continuing obligations. For example, deleting an inquiry is different from deleting an invoice that must be retained. If we cannot fully fulfil a request, we will explain the relevant reason where permitted.'
          },
          {
            type: 'paragraph',
            text: 'Changing information held by us does not automatically change records held independently by a hotel, airline, payment provider, or other organisation. We can help identify the relevant recipient where appropriate.'
          }
        ]
      },

      {
        id: 'making-a-privacy-request',
        title: '21. Making a Privacy Request',
        blocks: [
          {
            type: 'orderedList',
            items: [
              'Email our privacy contact using the address below.',
              'Describe the information or handling practice your request concerns.',
              'Include an inquiry or booking reference if it helps identify the relevant record.',
              'Complete any proportionate identity verification we request.',
              'Receive our response or an explanation of any further steps required.'
            ]
          },
          {
            type: 'paragraph',
            text: 'We aim to acknowledge privacy requests within three working days. The time needed to complete a request depends on its scope, verification, and the applicable legal requirements. We will explain any extension or outstanding information needed.'
          },
          {
            type: 'callout',
            title: 'Identity verification should remain proportionate',
            text: 'Please do not send a passport copy with your initial privacy request. We will explain whether verification is necessary and seek an appropriate method for the circumstances.'
          },
          {
            type: 'links',
            items: [
              {
                label: 'Contact our privacy team',
                to: 'mailto:privacy.sreejith@example.com'
              }
            ]
          }
        ]
      },

      {
        id: 'partners-and-community-members',
        title: '22. Partners & Community Members',
        blocks: [
          {
            type: 'paragraph',
            text: 'If you contact us as a travel professional, accommodation provider, artisan, guide, host, or other prospective partner, we may use your details to assess the inquiry, communicate about collaboration, and maintain relevant professional records.'
          },
          {
            type: 'heading',
            level: 3,
            text: 'Professional information'
          },
          {
            type: 'unorderedList',
            items: [
              'Name, professional role, and organisation.',
              'Business contact details and location.',
              'Information about your services, experience, or availability.',
              'Correspondence and agreed partnership arrangements.',
              'Approved profile material intended for public presentation.'
            ]
          },
          {
            type: 'heading',
            level: 3,
            text: 'Public community profiles'
          },
          {
            type: 'paragraph',
            text: 'Information provided to discuss a partnership is not automatically intended for publication. Before presenting an identifiable community profile, we will agree on the material to be displayed and the appropriate contact route for updates or concerns.'
          }
        ]
      },

      {
        id: 'privacy-concerns',
        title: '23. Privacy Concerns & Complaints',
        blocks: [
          {
            type: 'paragraph',
            text: 'If you are concerned about how your information has been handled, contact us with a clear description of the issue. We will review the concern, seek relevant information, and explain our response.'
          },
          {
            type: 'unorderedList',
            items: [
              'Identify the interaction, inquiry, or booking involved.',
              'Describe what you believe happened.',
              'Explain the outcome or clarification you are seeking.',
              'Include relevant correspondence without forwarding unnecessary sensitive information.'
            ]
          },
          {
            type: 'paragraph',
            text: 'You may also have the right to raise a concern with a competent privacy or data-protection authority under the law applicable to your circumstances. Contacting us does not remove any such right.'
          },
          {
            type: 'links',
            items: [
              {
                label: 'Send a privacy concern',
                to: 'mailto:privacy.sreejith@example.com'
              },
              {
                label: 'Visit our contact page',
                to: '/contact'
              }
            ]
          }
        ]
      },

      {
        id: 'policy-updates',
        title: '24. Changes to This Policy',
        blocks: [
          {
            type: 'paragraph',
            text: 'We may update this policy when our services, technology, information-handling practices, or applicable requirements change. The last-updated date identifies the version displayed on this page.'
          },
          {
            type: 'paragraph',
            text: 'Where a change materially affects how we use information already collected, we will provide an appropriate notice and seek any additional permission required. Publishing a revised policy does not by itself authorise an unrelated new use of your information.'
          }
        ]
      },

      {
        id: 'privacy-contact',
        title: '25. Contact Us',
        blocks: [
          {
            type: 'paragraph',
            text: 'For questions about this Privacy Policy, your personal information, or a privacy request, please contact our privacy team. Include only the details needed to explain your inquiry.'
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
            email: 'privacy.sreejith@example.com',
            bookingEmail: 'journeys.sreejith@example.com',
            officeHours: 'Monday to Saturday, 9:30 AM to 6:00 PM IST'
          },
          {
            type: 'links',
            items: [
              {
                label: 'Email our privacy team',
                to: 'mailto:privacy.sreejith@example.com'
              },
              {
                label: 'Terms and Conditions',
                to: '/terms'
              },
              {
                label: 'Frequently asked questions',
                to: '/faq'
              },
              {
                label: 'Contact us',
                to: '/contact'
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
    <LegalDocument class="bg-bg-light" :data="pageData.privacy" />
  </div>
</template>