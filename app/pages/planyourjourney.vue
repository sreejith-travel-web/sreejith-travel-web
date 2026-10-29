<!-- ~/app/pages/planYourJourney.vue -->

<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import JourneyPlanner from '~/components/JourneyPlanner.vue'
import type {
  QuestionnaireConfig,
  ReassuranceConfig,
  ContactAlternativeConfig
} from '~/components/JourneyPlanner.vue'

const pageData = {
  hero: {
    eyebrow: 'Begin Your Story',
    titleMain: 'Design Your Bespoke',
    titleItalic: 'Indian Odyssey',
    intro:
      'Share your curiosities, preferred pace, and travel dreams so we can begin weaving an itinerary tailored exclusively to you.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Plan your custom travel journey in India'
  },

  questionnaire: {
    id: 'journey-planner',
    titleLine1: 'Let’s begin with you.',
    titleLine2Cursive: 'Every detail makes it yours.',
    description:
      'A few thoughtful questions to help us understand your journey.',

    pathSelector: {
      label: 'What brings you here?',
      changeLabel: 'Change inquiry type',
      changeNotice:
        'Your answers will remain available while you explore the other inquiry type.',
      options: [
        {
          id: 'traveller',
          title: 'Plan a personal journey',
          description: 'For yourself, your family, or your friends.'
        },
        {
          id: 'partner',
          title: 'Discuss a partnership',
          description: 'For travel professionals and organisations.'
        }
      ],
      requiredMessage: 'Please choose the type of inquiry.'
    },

    navigation: {
      backLabel: 'Back',
      continueLabel: 'Continue',
      editLabel: 'Edit',
      stepLabel: 'Step',
      stepSeparator: 'of',
      nextLabel: 'Next',
      completedLabel: 'Completed',
      currentLabel: 'Current step',
      requiredLabel: 'Required',
      optionalLabel: 'Optional',
      requiredFieldsNote: 'Fields marked with an asterisk are required.',
      sidebarNote:
        'Start with what you know. We can shape the rest together.'
    },

    paths: [
      {
        id: 'traveller',
        progressTitle: 'Your journey, in four steps',
        submitLabel: 'Send My Inquiry',

        steps: [
          {
            id: 'journey',
            navigationTitle: 'Your journey',
            title: 'Where would you like to go?',
            description:
              'Share the outlines of your trip. It’s fine if your plans are still taking shape.',

            fields: [
              {
                id: 'preferredRegion',
                type: 'singleChoice',
                label: 'Preferred region',
                requirement: 'required',
                options: [
                  {
                    value: 'south-india',
                    label: 'South India'
                  },
                  {
                    value: 'elsewhere-in-india',
                    label: 'Elsewhere in India'
                  },
                  {
                    value: 'help-me-decide',
                    label: 'Help me decide'
                  }
                ],
                validation: {
                  requiredMessage:
                    'Choose a region, or select “Help me decide”.'
                }
              },
              {
                id: 'preferredStartDate',
                type: 'date',
                label: 'Preferred start date',
                placeholder: 'Choose a date',
                requirement: 'conditional',
                requiredWhen: {
                  field: 'datesFlexible',
                  operator: 'equals',
                  value: 'no'
                },
                validation: {
                  earliest: 'today',
                  requiredMessage:
                    'Choose a start date, or tell us your dates are flexible.',
                  invalidMessage: 'Enter a valid date.',
                  earliestMessage:
                    'Please choose today or a future date.'
                }
              },
              {
                id: 'durationDays',
                type: 'number',
                label: 'Duration (days)',
                placeholder: 'For example, 10',
                requirement: 'required',
                helpText:
                  'An approximate number is enough at this stage.',
                validation: {
                  min: 1,
                  step: 1,
                  requiredMessage:
                    'Tell us approximately how many days you would like to travel.',
                  invalidMessage:
                    'Enter a whole number of days.',
                  minMessage:
                    'The journey duration must be at least one day.'
                }
              },
              {
                id: 'datesFlexible',
                type: 'checkbox',
                label: 'My dates are flexible',
                requirement: 'optional',
                checkedValue: 'yes',
                uncheckedValue: 'no',
                initialValue: 'no',
                helpText:
                  'You can leave the date open if you would like help choosing when to travel.'
              }
            ]
          },

          {
            id: 'travel-style',
            navigationTitle: 'Your travel style',
            title: 'How do you love to travel?',
            description:
              'Tell us who’s joining you and what draws you to a place.',

            fields: [
              {
                id: 'travellerCount',
                type: 'numberStepper',
                label: 'Number of travellers',
                requirement: 'required',
                initialValue: 2,
                helpText:
                  'Include everyone travelling, including children.',
                decreaseLabel: 'Decrease the number of travellers',
                increaseLabel: 'Increase the number of travellers',
                validation: {
                  min: 1,
                  step: 1,
                  requiredMessage:
                    'Tell us how many people will be travelling.',
                  invalidMessage:
                    'Enter a whole number of travellers.',
                  minMessage:
                    'Please include at least one traveller.'
                }
              },
              {
                id: 'primaryInterests',
                type: 'multipleChoice',
                label: 'Primary interests',
                helpText: 'Select all that apply',
                requirement: 'required',
                options: [
                  {
                    value: 'culture-heritage',
                    label: 'Culture & Heritage'
                  },
                  {
                    value: 'nature-wildlife',
                    label: 'Nature & Wildlife'
                  },
                  {
                    value: 'wellness-spiritual',
                    label: 'Wellness & Spiritual'
                  },
                  {
                    value: 'culinary-flavours',
                    label: 'Culinary Flavours'
                  },
                  {
                    value: 'offbeat-adventures',
                    label: 'Offbeat Adventures'
                  },
                  {
                    value: 'bespoke-luxury',
                    label: 'Bespoke Luxury'
                  }
                ],
                validation: {
                  minSelections: 1,
                  requiredMessage:
                    'Choose at least one interest.'
                }
              },
              {
                id: 'travelPace',
                type: 'singleChoice',
                label: 'Pace & travel style',
                requirement: 'required',
                options: [
                  {
                    value: 'relaxed-leisurely',
                    label: 'Relaxed & Leisurely',
                    description:
                      'Unhurried days, fewer moves, and time to settle in.'
                  },
                  {
                    value: 'balanced-curious',
                    label: 'Balanced & Curious',
                    description:
                      'A comfortable mix of exploration and time to yourself.'
                  },
                  {
                    value: 'active-fast-paced',
                    label: 'Active & Fast-Paced',
                    description:
                      'Fuller days, more movement, and plenty to discover.'
                  }
                ],
                validation: {
                  requiredMessage:
                    'Choose the pace that feels closest to your travel style.'
                }
              }
            ]
          },

          {
            id: 'about-you',
            navigationTitle: 'About you',
            title: 'Who are we designing for?',
            description:
              'Share your contact details so we can begin a personal conversation.',

            fields: [
              {
                id: 'fullName',
                type: 'text',
                label: 'Full name',
                placeholder: 'Your full name',
                autocomplete: 'name',
                requirement: 'required',
                validation: {
                  maxLength: 150,
                  requiredMessage: 'Please enter your name.',
                  maxLengthMessage:
                    'Please keep your name within 150 characters.'
                }
              },
              {
                id: 'email',
                type: 'email',
                label: 'Email address',
                placeholder: 'you@example.com',
                autocomplete: 'email',
                requirement: 'required',
                helpText:
                  'We’ll use this to respond to your inquiry.',
                validation: {
                  maxLength: 254,
                  requiredMessage:
                    'Please enter your email address.',
                  invalidMessage:
                    'Please enter a valid email address.'
                }
              },
              {
                id: 'phone',
                type: 'phone',
                label: 'Phone number',
                placeholder: 'Phone number',
                countryPlaceholder: 'Country code',
                autocomplete: 'tel',
                requirement: 'required',
                helpText:
                  'Include your country calling code.',
                validation: {
                  requiredMessage:
                    'Please enter your phone number.',
                  invalidMessage:
                    'Check the country code and phone number.'
                }
              },
              {
                id: 'age',
                type: 'number',
                label: 'Your age',
                placeholder: 'Age in years',
                requirement: 'required',
                helpText:
                  'Age of the person completing this form.',
                validation: {
                  min: 18,
                  step: 1,
                  requiredMessage: 'Please enter your age.',
                  invalidMessage:
                    'Enter your age as a whole number.',
                  minMessage:
                    'Please ask an adult to submit this inquiry.'
                }
              }
            ]
          },

          {
            id: 'final-details',
            navigationTitle: 'Final details',
            title: 'Anything else we should know?',
            description:
              'Add the details that matter to you, then review your inquiry.',

            fields: [
              {
                id: 'specialRequirements',
                type: 'textarea',
                label: 'Special requirements & notes',
                placeholder:
                  'Share dietary preferences, accessibility needs, occasions, or anything else you would like us to consider.',
                requirement: 'optional',
                helpText:
                  'Share practical requirements; detailed medical information is not needed here.',
                validation: {
                  maxLength: 3000,
                  maxLengthMessage:
                    'Please keep your notes within 3,000 characters.'
                }
              }
            ],

            review: {
              title: 'Your journey at a glance',
              description:
                'Check your details before sending. You can return to any step to make changes.',
              groups: [
                {
                  title: 'Journey',
                  stepId: 'journey',
                  fields: [
                    'preferredRegion',
                    'preferredStartDate',
                    'datesFlexible',
                    'durationDays'
                  ]
                },
                {
                  title: 'Travel style',
                  stepId: 'travel-style',
                  fields: [
                    'travellerCount',
                    'primaryInterests',
                    'travelPace'
                  ]
                },
                {
                  title: 'Contact',
                  stepId: 'about-you',
                  fields: [
                    'fullName',
                    'email',
                    'phone',
                    'age'
                  ]
                }
              ]
            }
          }
        ],

        submissionNote:
          'This starts a conversation. It does not confirm a booking.',

        success: {
          eyebrow: 'INQUIRY RECEIVED',
          titleLine1: 'Your journey starts',
          titleLine2Cursive: 'with a conversation.',
          description:
            'Thank you for sharing your travel ideas. We’ll review your inquiry and contact you using the details you provided.',
          referenceLabel: 'Your inquiry reference',
          nextSteps: [
            'We review your interests, dates, and practical requirements.',
            'We contact you to clarify your priorities and explore the possibilities.',
            'We explain the planning process and any applicable fees before you commit.'
          ],
          ctaLabel: 'Explore the Journal',
          ctaTo: '/blog',
          secondaryCtaLabel: 'Back to Home',
          secondaryCtaTo: '/'
        }
      },

      {
        id: 'partner',
        progressTitle: 'A partnership, in three steps',
        submitLabel: 'Send Partnership Inquiry',

        steps: [
          {
            id: 'organisation',
            navigationTitle: 'Your organisation',
            title: 'Tell us about your business.',
            description:
              'Help us understand your work and the kind of collaboration you have in mind.',

            fields: [
              {
                id: 'companyName',
                type: 'text',
                label: 'Agency / company name',
                placeholder: 'Your business or organisation',
                autocomplete: 'organization',
                requirement: 'required',
                validation: {
                  maxLength: 200,
                  requiredMessage:
                    'Please enter your company or organisation name.',
                  maxLengthMessage:
                    'Please keep the name within 200 characters.'
                }
              },
              {
                id: 'annualClientVolume',
                type: 'select',
                label: 'Number of Clients (annual)',
                placeholder: 'Select an estimated volume',
                requirement: 'required',
                helpText:
                  'An estimate is enough. You can also tell us if the opportunity is still developing.',
                options: [
                  {
                    value: '1-10',
                    label: '1–10 travellers'
                  },
                  {
                    value: '11-25',
                    label: '11–25 travellers'
                  },
                  {
                    value: '26-50',
                    label: '26–50 travellers'
                  },
                  {
                    value: '51-100',
                    label: '51–100 travellers'
                  },
                  {
                    value: '101-plus',
                    label: 'More than 100 travellers'
                  },
                  {
                    value: 'not-yet-known',
                    label: 'Not yet known'
                  }
                ],
                validation: {
                  requiredMessage:
                    'Select an estimated volume or “Not yet known”.'
                }
              },
              {
                id: 'partnershipCategory',
                type: 'singleChoice',
                label: 'Partnership category',
                requirement: 'required',
                options: [
                  {
                    value: 'boutique-travel-agency',
                    label: 'Boutique Travel Agency'
                  },
                  {
                    value: 'luxury-concierge',
                    label: 'Luxury Concierge'
                  },
                  {
                    value: 'corporate-retreats',
                    label: 'Corporate Retreats'
                  },
                  {
                    value: 'wellness-collective',
                    label: 'Wellness Collective'
                  },
                  {
                    value: 'other',
                    label: 'Other'
                  }
                ],
                validation: {
                  requiredMessage:
                    'Choose the category closest to your organisation.'
                }
              },
              {
                id: 'partnershipCategoryOther',
                type: 'text',
                label: 'Describe your organisation',
                placeholder:
                  'For example, a specialist tour operator or educational organisation',
                requirement: 'conditional',
                visibleWhen: {
                  field: 'partnershipCategory',
                  operator: 'equals',
                  value: 'other'
                },
                requiredWhen: {
                  field: 'partnershipCategory',
                  operator: 'equals',
                  value: 'other'
                },
                validation: {
                  maxLength: 200,
                  requiredMessage:
                    'Briefly describe your organisation.',
                  maxLengthMessage:
                    'Please keep this description within 200 characters.'
                }
              }
            ]
          },

          {
            id: 'collaboration',
            navigationTitle: 'Collaboration interests',
            title: 'What could we create together?',
            description:
              'Share your regions of interest and the support or experiences you are looking for.',

            fields: [
              {
                id: 'regionsOfInterest',
                type: 'multipleChoice',
                label: 'Regions of interest',
                requirement: 'required',
                helpText: 'Select all that apply',
                options: [
                  {
                    value: 'south-india',
                    label: 'South India'
                  },
                  {
                    value: 'north-himalayas',
                    label: 'North & Himalayas'
                  },
                  {
                    value: 'sri-lanka',
                    label: 'Sri Lanka'
                  },
                  {
                    value: 'cross-border-circuits',
                    label: 'Cross-Border Circuits'
                  }
                ],
                validation: {
                  minSelections: 1,
                  requiredMessage:
                    'Choose at least one region of interest.'
                }
              },
              {
                id: 'collaborationInquiry',
                type: 'textarea',
                label: 'Collaboration proposal / inquiry',
                placeholder:
                  'Tell us about your clients, intended experiences, travel windows, and the kind of partnership you would like to explore.',
                requirement: 'required',
                helpText:
                  'An early idea is welcome. Please avoid sharing confidential client details.',
                validation: {
                  maxLength: 4000,
                  requiredMessage:
                    'Tell us a little about your proposed collaboration.',
                  maxLengthMessage:
                    'Please keep your inquiry within 4,000 characters.'
                }
              }
            ]
          },

          {
            id: 'partner-contact',
            navigationTitle: 'Contact & review',
            title: 'Let’s start the conversation.',
            description:
              'Tell us who to contact, then check your partnership inquiry.',

            fields: [
              {
                id: 'primaryContactName',
                type: 'text',
                label: 'Primary contact name',
                placeholder: 'Your full name',
                autocomplete: 'name',
                requirement: 'required',
                validation: {
                  maxLength: 150,
                  requiredMessage:
                    'Please enter the primary contact’s name.',
                  maxLengthMessage:
                    'Please keep the name within 150 characters.'
                }
              },
              {
                id: 'businessEmail',
                type: 'email',
                label: 'Business email',
                placeholder: 'you@company.com',
                autocomplete: 'email',
                requirement: 'required',
                validation: {
                  maxLength: 254,
                  requiredMessage:
                    'Please enter your business email address.',
                  invalidMessage:
                    'Please enter a valid email address.'
                }
              },
              {
                id: 'directPhone',
                type: 'phone',
                label: 'Direct phone number',
                placeholder: 'Your direct contact number',
                countryPlaceholder: 'Country code',
                autocomplete: 'tel',
                requirement: 'required',
                helpText:
                  'Include your country calling code.',
                validation: {
                  requiredMessage:
                    'Please enter a direct contact number.',
                  invalidMessage:
                    'Check the country code and phone number.'
                }
              }
            ],

            review: {
              title: 'Your partnership inquiry',
              description:
                'Review your organisation and collaboration details before sending.',
              groups: [
                {
                  title: 'Organisation',
                  stepId: 'organisation',
                  fields: [
                    'companyName',
                    'partnershipCategory',
                    'partnershipCategoryOther',
                    'annualClientVolume'
                  ]
                },
                {
                  title: 'Collaboration',
                  stepId: 'collaboration',
                  fields: [
                    'regionsOfInterest',
                    'collaborationInquiry'
                  ]
                },
                {
                  title: 'Contact',
                  stepId: 'partner-contact',
                  fields: [
                    'primaryContactName',
                    'businessEmail',
                    'directPhone'
                  ]
                }
              ]
            }
          }
        ],

        submissionNote:
          'Submitting an inquiry does not establish a partnership or confirm service availability.',

        success: {
          eyebrow: 'PARTNERSHIP INQUIRY RECEIVED',
          titleLine1: 'Meaningful possibilities,',
          titleLine2Cursive: 'explored together.',
          description:
            'Thank you for introducing your organisation. We’ll review your proposal and contact you to discuss the possibilities.',
          referenceLabel: 'Your inquiry reference',
          nextSteps: [
            'We review your organisation, regions of interest, and proposed collaboration.',
            'We contact you to clarify the opportunity and our potential role.',
            'We discuss availability, responsibilities, and commercial arrangements before any commitment.'
          ],
          ctaLabel: 'Explore Our Services',
          ctaTo: '/collaborate',
          secondaryCtaLabel: 'Back to Home',
          secondaryCtaTo: '/'
        }
      }
    ],

    reviewLabels: {
      notProvided: 'Not provided',
      flexibleDates: 'Flexible dates',
      preferredDateWithFlexibility: 'Flexible',
      daySingular: 'day',
      dayPlural: 'days',
      travellerSingular: 'traveller',
      travellerPlural: 'travellers',
      ageUnit: 'years'
    },

    privacyAcknowledgement: {
      id: 'privacyAcknowledgement',
      type: 'checkbox',
      requirement: 'required',
      checkedValue: 'accepted',
      uncheckedValue: 'not-accepted',
      initialValue: 'not-accepted',
      label:
        'I have read the Privacy Policy and agree to be contacted about this inquiry.',
      link: {
        label: 'Privacy Policy',
        to: '/privacy'
      },
      helpText:
        'Your details will be used to respond to this inquiry. This does not subscribe you to promotional emails.',
      validation: {
        requiredMessage:
          'Please acknowledge the Privacy Policy before sending your inquiry.'
      }
    },

    submission: {
      sendingLabel: 'Sending your inquiry…',
      retryLabel: 'Try Again',
      validationSummaryTitle: 'A few details need your attention.',
      validationSummaryDescription:
        'Please review the highlighted fields before continuing.',
      errorTitle: 'Your inquiry could not be sent.',
      errorDescription:
        'Your answers are still here. Please check your connection and try again.',
      timeoutTitle: 'We could not confirm submission.',
      timeoutDescription:
        'Please try again using the same inquiry. If the problem continues, contact us before submitting a new request.',
      unavailableTitle: 'The inquiry form is temporarily unavailable.',
      unavailableDescription:
        'Please try again later or use our contact page to reach us.',
      fallbackCtaLabel: 'Contact Us',
      fallbackCtaTo: '/contact'
    }
  } as QuestionnaireConfig,

  reassurance: {
    title: 'A thoughtful beginning.',
    items: [
      {
        title: 'You don’t need every answer',
        description:
          'Approximate dates and early ideas are enough to begin.'
      },
      {
        title: 'A personal conversation',
        description:
          'Your inquiry helps us understand what matters to you.'
      },
      {
        title: 'Clarity before commitment',
        description:
          'We explain the next steps and any applicable fees before you proceed.'
      }
    ]
  } as ReassuranceConfig,

  contactAlternative: {
    title: 'Prefer to speak first?',
    description:
      'If your plans need a conversation before a questionnaire, tell us how we can help.',
    ctaLabel: 'Get in Touch',
    ctaTo: '/contact'
  } as ContactAlternativeConfig
}
</script>

<template>
  <div class="w-full">
    <PageHero class="bg-bg-light" :data="pageData.hero" />

    <JourneyPlanner 
      class="bg-bg-light"
      :questionnaire="pageData.questionnaire"
      :reassurance="pageData.reassurance"
      :contactAlternative="pageData.contactAlternative"
    />
  </div>
</template>