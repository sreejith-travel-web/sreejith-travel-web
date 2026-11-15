<!-- ~/app/components/JourneyPlanner.vue -->
<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import CtaButton from '~/components/CtaButton.vue'

// ==========================================
// INTERFACES & TYPES
// ==========================================
export interface FieldCondition {
  field: string
  operator: 'equals'
  value: string
}

export interface FieldOption {
  value: string
  label: string
  description?: string
}

export interface FieldValidation {
  requiredMessage?: string
  invalidMessage?: string
  min?: number
  step?: number
  minMessage?: string
  maxLength?: number
  maxLengthMessage?: string
  minSelections?: number
  earliest?: 'today'
  earliestMessage?: string
}

export interface QuestionnaireField {
  id: string
  type: 'singleChoice' | 'multipleChoice' | 'date' | 'checkbox' | 'number' | 'numberStepper' | 'text' | 'email' | 'phone' | 'select' | 'textarea'
  label: string
  placeholder?: string
  countryPlaceholder?: string
  autocomplete?: string
  requirement: 'required' | 'optional' | 'conditional'
  visibleWhen?: FieldCondition
  requiredWhen?: FieldCondition
  helpText?: string
  options?: FieldOption[]
  checkedValue?: string
  uncheckedValue?: string
  initialValue?: string | number
  decreaseLabel?: string
  increaseLabel?: string
  validation?: FieldValidation
  link?: {
    label: string
    to: string
  }
}

export interface ReviewGroup {
  title: string
  stepId: string
  fields: string[]
}

export interface QuestionnaireStep {
  id: string
  navigationTitle: string
  title: string
  description: string
  fields: QuestionnaireField[]
  review?: {
    title: string
    description: string
    groups: ReviewGroup[]
  }
}

export interface PathSuccessConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  referenceLabel: string
  nextSteps: string[]
  ctaLabel: string
  ctaTo: string
  secondaryCtaLabel: string
  secondaryCtaTo: string
}

export interface QuestionnairePath {
  id: 'traveller' | 'partner'
  progressTitle: string
  submitLabel: string
  steps: QuestionnaireStep[]
  submissionNote: string
  success: PathSuccessConfig
}

export interface QuestionnaireConfig {
  id: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  pathSelector: {
    label: string
    changeLabel: string
    changeNotice: string
    options: {
      id: 'traveller' | 'partner'
      title: string
      description: string
    }[]
    requiredMessage: string
  }
  navigation: {
    backLabel: string
    continueLabel: string
    editLabel: string
    stepLabel: string
    stepSeparator: string
    nextLabel: string
    completedLabel: string
    currentLabel: string
    requiredLabel: string
    optionalLabel: string
    requiredFieldsNote: string
    sidebarNote: string
  }
  paths: QuestionnairePath[]
  reviewLabels: {
    notProvided: string
    flexibleDates: string
    preferredDateWithFlexibility: string
    daySingular: string
    dayPlural: string
    travellerSingular: string
    travellerPlural: string
    ageUnit: string
  }
  privacyAcknowledgement: QuestionnaireField
  submission: {
    sendingLabel: string
    retryLabel: string
    validationSummaryTitle: string
    validationSummaryDescription: string
    errorTitle: string
    errorDescription: string
    timeoutTitle: string
    timeoutDescription: string
    unavailableTitle: string
    unavailableDescription: string
    fallbackCtaLabel: string
    fallbackCtaTo: string
  }
}

export interface ReassuranceConfig {
  title: string
  items: {
    title: string
    description: string
  }[]
}

export interface ContactAlternativeConfig {
  title: string
  description: string
  ctaLabel: string
  ctaTo: string
}

export type PlannerPathId = 'traveller' | 'partner'

const props = withDefaults(
  defineProps<{
    questionnaire: QuestionnaireConfig
    reassurance: ReassuranceConfig
    contactAlternative: ContactAlternativeConfig
    pathId?: PlannerPathId
  }>(),
  {
    pathId: 'traveller'
  }
)

const emit = defineEmits<{
  (e: 'update:pathId', pathId: PlannerPathId): void
}>()


const router = useRouter()

// ==========================================
// COUNTRY CALLING CODES (NO EXTERNAL LIBS)
// ==========================================
const countryCodes = [
  { code: '+93', label: '🇦🇫 +93' }, // Afghanistan
  { code: '+355', label: '🇦🇱 +355' }, // Albania
  { code: '+213', label: '🇩🇿 +213' }, // Algeria
  { code: '+1-684', label: '🇦🇸 +1-684' }, // American Samoa
  { code: '+376', label: '🇦🇩 +376' }, // Andorra
  { code: '+244', label: '🇦🇴 +244' }, // Angola
  { code: '+1-264', label: '🇦🇮 +1-264' }, // Anguilla
  { code: '+1-268', label: '🇦🇬 +1-268' }, // Antigua and Barbuda
  { code: '+54', label: '🇦🇷 +54' }, // Argentina
  { code: '+374', label: '🇦🇲 +374' }, // Armenia
  { code: '+297', label: '🇦🇼 +297' }, // Aruba
  { code: '+61', label: '🇦🇺 +61' }, // Australia
  { code: '+43', label: '🇦🇹 +43' }, // Austria
  { code: '+994', label: '🇦🇿 +994' }, // Azerbaijan
  { code: '+1-242', label: '🇧🇸 +1-242' }, // Bahamas
  { code: '+973', label: '🇧🇭 +973' }, // Bahrain
  { code: '+880', label: '🇧🇩 +880' }, // Bangladesh
  { code: '+1-246', label: '🇧🇧 +1-246' }, // Barbados
  { code: '+375', label: '🇧🇾 +375' }, // Belarus
  { code: '+32', label: '🇧🇪 +32' }, // Belgium
  { code: '+501', label: '🇧🇿 +501' }, // Belize
  { code: '+229', label: '🇧🇯 +229' }, // Benin
  { code: '+1-441', label: '🇧🇲 +1-441' }, // Bermuda
  { code: '+975', label: '🇧🇹 +975' }, // Bhutan
  { code: '+591', label: '🇧🇴 +591' }, // Bolivia
  { code: '+387', label: '🇧🇦 +387' }, // Bosnia and Herzegovina
  { code: '+267', label: '🇧🇼 +267' }, // Botswana
  { code: '+55', label: '🇧🇷 +55' }, // Brazil
  { code: '+1-284', label: '🇻🇬 +1-284' }, // British Virgin Islands
  { code: '+673', label: '🇧🇳 +673' }, // Brunei
  { code: '+359', label: '🇧🇬 +359' }, // Bulgaria
  { code: '+226', label: '🇧🇫 +226' }, // Burkina Faso
  { code: '+257', label: '🇧🇮 +257' }, // Burundi
  { code: '+855', label: '🇰🇭 +855' }, // Cambodia
  { code: '+237', label: '🇨🇲 +237' }, // Cameroon
  { code: '+1', label: '🇨🇦 +1' }, // Canada
  { code: '+238', label: '🇨🇻 +238' }, // Cape Verde
  { code: '+1-345', label: '🇰🇾 +1-345' }, // Cayman Islands
  { code: '+236', label: '🇨🇫 +236' }, // Central African Republic
  { code: '+235', label: '🇹🇩 +235' }, // Chad
  { code: '+56', label: '🇨🇱 +56' }, // Chile
  { code: '+86', label: '🇨🇳 +86' }, // China
  { code: '+61', label: '🇨🇽 +61' }, // Christmas Island
  { code: '+61', label: '🇨🇨 +61' }, // Cocos Islands
  { code: '+57', label: '🇨🇴 +57' }, // Colombia
  { code: '+269', label: '🇰🇲 +269' }, // Comoros
  { code: '+242', label: '🇨🇬 +242' }, // Congo
  { code: '+243', label: '🇨🇩 +243' }, // DR Congo
  { code: '+682', label: '🇨🇰 +682' }, // Cook Islands
  { code: '+506', label: '🇨🇷 +506' }, // Costa Rica
  { code: '+225', label: '🇨🇮 +225' }, // Côte d'Ivoire
  { code: '+385', label: '🇭🇷 +385' }, // Croatia
  { code: '+53', label: '🇨🇺 +53' }, // Cuba
  { code: '+599', label: '🇨🇼 +599' }, // Curaçao
  { code: '+357', label: '🇨🇾 +357' }, // Cyprus
  { code: '+420', label: '🇨🇿 +420' }, // Czechia
  { code: '+45', label: '🇩🇰 +45' }, // Denmark
  { code: '+253', label: '🇩🇯 +253' }, // Djibouti
  { code: '+1-767', label: '🇩🇲 +1-767' }, // Dominica
  { code: '+1-809', label: '🇩🇴 +1-809' }, // Dominican Republic
  { code: '+670', label: '🇹🇱 +670' }, // Timor-Leste
  { code: '+593', label: '🇪🇨 +593' }, // Ecuador
  { code: '+20', label: '🇪🇬 +20' }, // Egypt
  { code: '+503', label: '🇸🇻 +503' }, // El Salvador
  { code: '+240', label: '🇬🇶 +240' }, // Equatorial Guinea
  { code: '+291', label: '🇪🇷 +291' }, // Eritrea
  { code: '+372', label: '🇪🇪 +372' }, // Estonia
  { code: '+268', label: '🇸🇿 +268' }, // Eswatini
  { code: '+251', label: '🇪🇹 +251' }, // Ethiopia
  { code: '+500', label: '🇫🇰 +500' }, // Falkland Islands
  { code: '+298', label: '🇫🇴 +298' }, // Faroe Islands
  { code: '+679', label: '🇫🇯 +679' }, // Fiji
  { code: '+358', label: '🇫🇮 +358' }, // Finland
  { code: '+33', label: '🇫🇷 +33' }, // France
  { code: '+594', label: '🇬🇫 +594' }, // French Guiana
  { code: '+689', label: '🇵🇫 +689' }, // French Polynesia
  { code: '+241', label: '🇬🇦 +241' }, // Gabon
  { code: '+220', label: '🇬🇲 +220' }, // Gambia
  { code: '+995', label: '🇬🇪 +995' }, // Georgia
  { code: '+49', label: '🇩🇪 +49' }, // Germany
  { code: '+233', label: '🇬🇭 +233' }, // Ghana
  { code: '+350', label: '🇬🇮 +350' }, // Gibraltar
  { code: '+30', label: '🇬🇷 +30' }, // Greece
  { code: '+299', label: '🇬🇱 +299' }, // Greenland
  { code: '+1-473', label: '🇬🇩 +1-473' }, // Grenada
  { code: '+590', label: '🇬🇵 +590' }, // Guadeloupe
  { code: '+1-671', label: '🇬🇺 +1-671' }, // Guam
  { code: '+502', label: '🇬🇹 +502' }, // Guatemala
  { code: '+44', label: '🇬🇬 +44' }, // Guernsey
  { code: '+224', label: '🇬🇳 +224' }, // Guinea
  { code: '+245', label: '🇬🇼 +245' }, // Guinea-Bissau
  { code: '+592', label: '🇬🇾 +592' }, // Guyana
  { code: '+509', label: '🇭🇹 +509' }, // Haiti
  { code: '+504', label: '🇭🇳 +504' }, // Honduras
  { code: '+852', label: '🇭🇰 +852' }, // Hong Kong
  { code: '+36', label: '🇭🇺 +36' }, // Hungary
  { code: '+354', label: '🇮🇸 +354' }, // Iceland
  { code: '+91', label: '🇮🇳 +91' }, // India
  { code: '+62', label: '🇮🇩 +62' }, // Indonesia
  { code: '+98', label: '🇮🇷 +98' }, // Iran
  { code: '+964', label: '🇮🇶 +964' }, // Iraq
  { code: '+353', label: '🇮🇪 +353' }, // Ireland
  { code: '+44', label: '🇮🇲 +44' }, // Isle of Man
  { code: '+972', label: '🇮🇱 +972' }, // Israel
  { code: '+39', label: '🇮🇹 +39' }, // Italy
  { code: '+1-876', label: '🇯🇲 +1-876' }, // Jamaica
  { code: '+81', label: '🇯🇵 +81' }, // Japan
  { code: '+44', label: '🇯🇪 +44' }, // Jersey
  { code: '+962', label: '🇯🇴 +962' }, // Jordan
  { code: '+7', label: '🇰🇿 +7' }, // Kazakhstan
  { code: '+254', label: '🇰🇪 +254' }, // Kenya
  { code: '+686', label: '🇰🇮 +686' }, // Kiribati
  { code: '+383', label: '🇽🇰 +383' }, // Kosovo
  { code: '+965', label: '🇰🇼 +965' }, // Kuwait
  { code: '+996', label: '🇰🇬 +996' }, // Kyrgyzstan
  { code: '+856', label: '🇱🇦 +856' }, // Laos
  { code: '+371', label: '🇱🇻 +371' }, // Latvia
  { code: '+961', label: '🇱🇧 +961' }, // Lebanon
  { code: '+266', label: '🇱🇸 +266' }, // Lesotho
  { code: '+231', label: '🇱🇷 +231' }, // Liberia
  { code: '+218', label: '🇱🇾 +218' }, // Libya
  { code: '+423', label: '🇱🇮 +423' }, // Liechtenstein
  { code: '+370', label: '🇱🇹 +370' }, // Lithuania
  { code: '+352', label: '🇱🇺 +352' }, // Luxembourg
  { code: '+853', label: '🇲🇴 +853' }, // Macau
  { code: '+261', label: '🇲🇬 +261' }, // Madagascar
  { code: '+265', label: '🇲🇼 +265' }, // Malawi
  { code: '+60', label: '🇲🇾 +60' }, // Malaysia
  { code: '+960', label: '🇲🇻 +960' }, // Maldives
  { code: '+223', label: '🇲🇱 +223' }, // Mali
  { code: '+356', label: '🇲🇹 +356' }, // Malta
  { code: '+692', label: '🇲🇭 +692' }, // Marshall Islands
  { code: '+596', label: '🇲🇶 +596' }, // Martinique
  { code: '+222', label: '🇲🇷 +222' }, // Mauritania
  { code: '+230', label: '🇲🇺 +230' }, // Mauritius
  { code: '+262', label: '🇾🇹 +262' }, // Mayotte
  { code: '+52', label: '🇲🇽 +52' }, // Mexico
  { code: '+691', label: '🇫🇲 +691' }, // Micronesia
  { code: '+373', label: '🇲🇩 +373' }, // Moldova
  { code: '+377', label: '🇲🇨 +377' }, // Monaco
  { code: '+976', label: '🇲🇳 +976' }, // Mongolia
  { code: '+382', label: '🇲🇪 +382' }, // Montenegro
  { code: '+1-664', label: '🇲🇸 +1-664' }, // Montserrat
  { code: '+212', label: '🇲🇦 +212' }, // Morocco
  { code: '+258', label: '🇲🇿 +258' }, // Mozambique
  { code: '+95', label: '🇲🇲 +95' }, // Myanmar
  { code: '+264', label: '🇳🇦 +264' }, // Namibia
  { code: '+674', label: '🇳🇷 +674' }, // Nauru
  { code: '+977', label: '🇳🇵 +977' }, // Nepal
  { code: '+31', label: '🇳🇱 +31' }, // Netherlands
  { code: '+687', label: '🇳🇨 +687' }, // New Caledonia
  { code: '+64', label: '🇳🇿 +64' }, // New Zealand
  { code: '+505', label: '🇳🇮 +505' }, // Nicaragua
  { code: '+227', label: '🇳🇪 +227' }, // Niger
  { code: '+234', label: '🇳🇬 +234' }, // Nigeria
  { code: '+683', label: '🇳🇺 +683' }, // Niue
  { code: '+672', label: '🇳🇫 +672' }, // Norfolk Island
  { code: '+850', label: '🇰🇵 +850' }, // North Korea
  { code: '+389', label: '🇲🇰 +389' }, // North Macedonia
  { code: '+1-670', label: '🇲🇵 +1-670' }, // Northern Mariana Islands
  { code: '+47', label: '🇳🇴 +47' }, // Norway
  { code: '+968', label: '🇴🇲 +968' }, // Oman
  { code: '+92', label: '🇵🇰 +92' }, // Pakistan
  { code: '+680', label: '🇵🇼 +680' }, // Palau
  { code: '+970', label: '🇵🇸 +970' }, // Palestine
  { code: '+507', label: '🇵🇦 +507' }, // Panama
  { code: '+675', label: '🇵🇬 +675' }, // Papua New Guinea
  { code: '+595', label: '🇵🇾 +595' }, // Paraguay
  { code: '+51', label: '🇵🇪 +51' }, // Peru
  { code: '+63', label: '🇵🇭 +63' }, // Philippines
  { code: '+64', label: '🇵🇳 +64' }, // Pitcairn Islands
  { code: '+48', label: '🇵🇱 +48' }, // Poland
  { code: '+351', label: '🇵🇹 +351' }, // Portugal
  { code: '+1-787', label: '🇵🇷 +1-787' }, // Puerto Rico
  { code: '+974', label: '🇶🇦 +974' }, // Qatar
  { code: '+262', label: '🇷🇪 +262' }, // Réunion
  { code: '+40', label: '🇷🇴 +40' }, // Romania
  { code: '+7', label: '🇷🇺 +7' }, // Russia
  { code: '+250', label: '🇷🇼 +250' }, // Rwanda
  { code: '+590', label: '🇧🇱 +590' }, // Saint Barthélemy
  { code: '+290', label: '🇸🇭 +290' }, // Saint Helena
  { code: '+1-869', label: '🇰🇳 +1-869' }, // Saint Kitts and Nevis
  { code: '+1-758', label: '🇱🇨 +1-758' }, // Saint Lucia
  { code: '+590', label: '🇲🇫 +590' }, // Saint Martin
  { code: '+508', label: '🇵🇲 +508' }, // Saint Pierre and Miquelon
  { code: '+1-784', label: '🇻🇨 +1-784' }, // Saint Vincent and the Grenadines
  { code: '+685', label: '🇼🇸 +685' }, // Samoa
  { code: '+378', label: '🇸🇲 +378' }, // San Marino
  { code: '+239', label: '🇸🇹 +239' }, // São Tomé and Príncipe
  { code: '+966', label: '🇸🇦 +966' }, // Saudi Arabia
  { code: '+221', label: '🇸🇳 +221' }, // Senegal
  { code: '+381', label: '🇷🇸 +381' }, // Serbia
  { code: '+248', label: '🇸🇨 +248' }, // Seychelles
  { code: '+232', label: '🇸🇱 +232' }, // Sierra Leone
  { code: '+65', label: '🇸🇬 +65' }, // Singapore
  { code: '+1-721', label: '🇸🇽 +1-721' }, // Sint Maarten
  { code: '+421', label: '🇸🇰 +421' }, // Slovakia
  { code: '+386', label: '🇸🇮 +386' }, // Slovenia
  { code: '+677', label: '🇸🇧 +677' }, // Solomon Islands
  { code: '+252', label: '🇸🇴 +252' }, // Somalia
  { code: '+27', label: '🇿🇦 +27' }, // South Africa
  { code: '+82', label: '🇰🇷 +82' }, // South Korea
  { code: '+211', label: '🇸🇸 +211' }, // South Sudan
  { code: '+34', label: '🇪🇸 +34' }, // Spain
  { code: '+94', label: '🇱🇰 +94' }, // Sri Lanka
  { code: '+249', label: '🇸🇩 +249' }, // Sudan
  { code: '+597', label: '🇸🇷 +597' }, // Suriname
  { code: '+46', label: '🇸🇪 +46' }, // Sweden
  { code: '+41', label: '🇨🇭 +41' }, // Switzerland
  { code: '+963', label: '🇸🇾 +963' }, // Syria
  { code: '+886', label: '🇹🇼 +886' }, // Taiwan
  { code: '+992', label: '🇹🇯 +992' }, // Tajikistan
  { code: '+255', label: '🇹🇿 +255' }, // Tanzania
  { code: '+66', label: '🇹🇭 +66' }, // Thailand
  { code: '+228', label: '🇹🇬 +228' }, // Togo
  { code: '+690', label: '🇹🇰 +690' }, // Tokelau
  { code: '+676', label: '🇹🇴 +676' }, // Tonga
  { code: '+1-868', label: '🇹🇹 +1-868' }, // Trinidad and Tobago
  { code: '+216', label: '🇹🇳 +216' }, // Tunisia
  { code: '+90', label: '🇹🇷 +90' }, // Türkiye
  { code: '+993', label: '🇹🇲 +993' }, // Turkmenistan
  { code: '+1-649', label: '🇹🇨 +1-649' }, // Turks and Caicos Islands
  { code: '+688', label: '🇹🇻 +688' }, // Tuvalu
  { code: '+256', label: '🇺🇬 +256' }, // Uganda
  { code: '+380', label: '🇺🇦 +380' }, // Ukraine
  { code: '+971', label: '🇦🇪 +971' }, // United Arab Emirates
  { code: '+44', label: '🇬🇧 +44' }, // United Kingdom
  { code: '+1', label: '🇺🇸 +1' }, // United States
  { code: '+1-340', label: '🇻🇮 +1-340' }, // US Virgin Islands
  { code: '+598', label: '🇺🇾 +598' }, // Uruguay
  { code: '+998', label: '🇺🇿 +998' }, // Uzbekistan
  { code: '+678', label: '🇻🇺 +678' }, // Vanuatu
  { code: '+39', label: '🇻🇦 +39' }, // Vatican City
  { code: '+58', label: '🇻🇪 +58' }, // Venezuela
  { code: '+84', label: '🇻🇳 +84' }, // Vietnam
  { code: '+681', label: '🇼🇫 +681' }, // Wallis and Futuna
  { code: '+212', label: '🇪🇭 +212' }, // Western Sahara
  { code: '+967', label: '🇾🇪 +967' }, // Yemen
  { code: '+260', label: '🇿🇲 +260' }, // Zambia
  { code: '+263', label: '🇿🇼 +263' } // Zimbabwe
]

// ==========================================
// REACTIVE STATE MANAGEMENT
// ==========================================
const activePathId = ref<PlannerPathId>(props.pathId)

watch(
  () => props.pathId,
  (nextPath) => {
    if (nextPath && nextPath !== activePathId.value) {
      selectPath(nextPath, false)
    }
  }
)

const stepIndices = reactive<Record<'traveller' | 'partner', number>>({
  traveller: 0,
  partner: 0
})

const answers = reactive<Record<string, any>>({})
const phoneCountryCodes = reactive<Record<string, string>>({
  phone: '+91',
  directPhone: '+91'
})
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})

const isDirty = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const inquiryReference = ref('')
const showStepErrorBanner = ref(false)
const showPathSwitchNotice = ref(false)
let pathNoticeTimer: ReturnType<typeof setTimeout> | null = null

// Custom Unsaved Changes Modal State (Internal Navigation)
const showLeaveModal = ref(false)
const pendingRouteUrl = ref<string | null>(null)
const allowConfirmedLeave = ref(false)

// Ref for smooth scrolling to form container on step change
const plannerTopRef = ref<HTMLElement | null>(null)

// Initialize all field values from JSON schema
const initializeState = () => {
  props.questionnaire.paths.forEach((path) => {
    path.steps.forEach((step) => {
      step.fields.forEach((field) => {
        if (field.type === 'multipleChoice') {
          answers[field.id] = []
        } else if (field.initialValue !== undefined) {
          answers[field.id] = field.initialValue
        } else {
          answers[field.id] = ''
        }
        errors[field.id] = ''
        touched[field.id] = false
      })
    })
  })

  const priv = props.questionnaire.privacyAcknowledgement
  answers[priv.id] = priv.initialValue ?? 'not-accepted'
  errors[priv.id] = ''
  touched[priv.id] = false
}

initializeState()

// Today's ISO string (YYYY-MM-DD) for date input min attribute
const todayIso = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

// ==========================================
// COMPUTED HELPERS
// ==========================================
const activePath = computed<QuestionnairePath>(() => {
  return (
    props.questionnaire.paths.find(p => p.id === activePathId.value) ||
    props.questionnaire.paths[0]!
  )
})

const currentStepIndex = computed({
  get: () => stepIndices[activePathId.value],
  set: (val: number) => {
    stepIndices[activePathId.value] = val
  }
})

const totalSteps = computed(() => activePath.value.steps.length)

const currentStep = computed<QuestionnaireStep>(() => {
  return activePath.value.steps[currentStepIndex.value] || activePath.value.steps[0]!
})

const nextStep = computed<QuestionnaireStep | null>(() => {
  const nextIdx = currentStepIndex.value + 1
  return nextIdx < totalSteps.value ? activePath.value.steps[nextIdx] || null : null
})

const progressPercentage = computed(() => {
  return Math.round(((currentStepIndex.value + 1) / totalSteps.value) * 100)
})

// Check field visibility condition
const isFieldVisible = (field: QuestionnaireField): boolean => {
  if (!field.visibleWhen) return true
  const { field: depField, operator, value } = field.visibleWhen
  if (operator === 'equals') {
    return String(answers[depField]) === value
  }
  return true
}

// Check if field is currently required
const isFieldRequired = (field: QuestionnaireField): boolean => {
  if (!isFieldVisible(field)) return false
  if (field.requirement === 'required') return true
  if (field.requirement === 'conditional' && field.requiredWhen) {
    const { field: depField, operator, value } = field.requiredWhen
    if (operator === 'equals') {
      return String(answers[depField]) === value
    }
  }
  return false
}

// Helper to lookup any field config by ID in the active path
const getFieldById = (fieldId: string): QuestionnaireField | undefined => {
  for (const step of activePath.value.steps) {
    const found = step.fields.find(f => f.id === fieldId)
    if (found) return found
  }
  return undefined
}

// ==========================================
// VALIDATION ENGINE
// ==========================================
const validateSingleField = (field: QuestionnaireField): string => {
  if (!isFieldVisible(field)) return ''

  const val = answers[field.id]
  const req = isFieldRequired(field)
  const rules = field.validation

  // 1. Multiple Choice Check
  if (field.type === 'multipleChoice') {
    const arr = Array.isArray(val) ? val : []
    const minSel = rules?.minSelections ?? (req ? 1 : 0)
    if (req && arr.length < minSel) {
      return rules?.requiredMessage || 'Please select at least one option.'
    }
    return ''
  }

  // 2. Checkbox Check
  if (field.type === 'checkbox') {
    const checkedVal = field.checkedValue || 'yes'
    if (req && val !== checkedVal) {
      return rules?.requiredMessage || 'This acknowledgement is required.'
    }
    return ''
  }

  // 3. Empty Check for Standard Inputs
  const isEmpty = val === '' || val === null || val === undefined
  if (isEmpty) {
    return req ? (rules?.requiredMessage || 'This field is required.') : ''
  }

  const strVal = String(val).trim()
  if (strVal === '') {
    return req ? (rules?.requiredMessage || 'This field is required.') : ''
  }

  // 4. Max Length Check
  if (rules?.maxLength && strVal.length > rules.maxLength) {
    return rules.maxLengthMessage || `Maximum ${rules.maxLength} characters allowed.`
  }

  // 5. Email Check
  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(strVal)) {
      return rules?.invalidMessage || 'Please enter a valid email address.'
    }
  }

  // 6. Phone Check
  if (field.type === 'phone') {
    const digitsOnly = strVal.replace(/[\s\-().]/g, '')
    const phoneRegex = /^[0-9]{6,15}$/
    if (!phoneRegex.test(digitsOnly)) {
      return rules?.invalidMessage || 'Check the country code and phone number.'
    }
  }

  // 7. Number & Stepper Check
  if (field.type === 'number' || field.type === 'numberStepper') {
    const numVal = Number(val)
    if (Number.isNaN(numVal)) {
      return rules?.invalidMessage || 'Please enter a valid number.'
    }
    if (rules?.step === 1 && !Number.isInteger(numVal)) {
      return rules?.invalidMessage || 'Please enter a whole number.'
    }
    if (rules?.min !== undefined && numVal < rules.min) {
      return rules?.minMessage || `Value must be at least ${rules.min}.`
    }
  }

  // 8. Date Check
  if (field.type === 'date') {
    const parsed = Date.parse(strVal)
    if (Number.isNaN(parsed)) {
      return rules?.invalidMessage || 'Enter a valid date.'
    }
    if (rules?.earliest === 'today' && strVal < todayIso.value) {
      return rules.earliestMessage || 'Please choose today or a future date.'
    }
  }

  return ''
}

// Validate all fields in a specific step
const validateStep = (stepIdx: number): boolean => {
  const step = activePath.value.steps[stepIdx]
  if (!step) return true

  let isStepValid = true

  step.fields.forEach((field) => {
    touched[field.id] = true
    const err = validateSingleField(field)
    errors[field.id] = err
    if (err) isStepValid = false
  })

  // If this is the final step, also validate Privacy Acknowledgement
  if (stepIdx === totalSteps.value - 1) {
    const priv = props.questionnaire.privacyAcknowledgement
    touched[priv.id] = true
    const privErr = validateSingleField(priv)
    errors[priv.id] = privErr
    if (privErr) isStepValid = false
  }

  showStepErrorBanner.value = !isStepValid
  return isStepValid
}

// Check if a past step has all valid required fields (for sidebar checkmark)
const isStepCompleted = (stepIdx: number): boolean => {
  if (stepIdx >= currentStepIndex.value) return false
  const step = activePath.value.steps[stepIdx]
  if (!step) return false
  return step.fields.every(field => validateSingleField(field) === '')
}

// Re-validate touched fields immediately on change
const onFieldChange = (field: QuestionnaireField) => {
  if (!isSubmitted.value) {
    isDirty.value = true
  }
  if (touched[field.id]) {
    errors[field.id] = validateSingleField(field)
  }
  // If datesFlexible changed, re-evaluate preferredStartDate error
  if (field.id === 'datesFlexible') {
    const dateField = getFieldById('preferredStartDate')
    if (dateField && touched.preferredStartDate) {
      errors.preferredStartDate = validateSingleField(dateField)
    }
  }
  // Update step error banner if all errors on current step are resolved
  if (showStepErrorBanner.value) {
    const hasRemainingErrors = currentStep.value.fields.some(f => Boolean(errors[f.id])) ||
      (currentStepIndex.value === totalSteps.value - 1 && Boolean(errors[props.questionnaire.privacyAcknowledgement.id]))
    if (!hasRemainingErrors) {
      showStepErrorBanner.value = false
    }
  }
}

// ==========================================
// INTERACTION HANDLERS
// ==========================================
const selectPath = (pathId: PlannerPathId, shouldEmit = true) => {
  if (activePathId.value === pathId) return
  if (isSubmitted.value) {
    isSubmitted.value = false
  }
  activePathId.value = pathId
  showStepErrorBanner.value = false

  if (isDirty.value) {
    showPathSwitchNotice.value = true
    if (pathNoticeTimer) clearTimeout(pathNoticeTimer)
    pathNoticeTimer = setTimeout(() => {
      showPathSwitchNotice.value = false
    }, 5000)
  }

  if (shouldEmit) {
    emit('update:pathId', pathId)
  }
}

const toggleMultipleChoice = (field: QuestionnaireField, optionValue: string) => {
  const currentArr: string[] = Array.isArray(answers[field.id]) ? [...answers[field.id]] : []
  const idx = currentArr.indexOf(optionValue)
  if (idx > -1) {
    currentArr.splice(idx, 1)
  } else {
    currentArr.push(optionValue)
  }
  answers[field.id] = currentArr
  onFieldChange(field)
}

const toggleCheckbox = (field: QuestionnaireField) => {
  const checkedVal = field.checkedValue || 'yes'
  const uncheckedVal = field.uncheckedValue || 'no'
  answers[field.id] = answers[field.id] === checkedVal ? uncheckedVal : checkedVal
  onFieldChange(field)
}

const adjustStepper = (field: QuestionnaireField, delta: number) => {
  const currentVal = Number(answers[field.id]) || 1
  const minVal = field.validation?.min ?? 1
  const nextVal = Math.max(minVal, currentVal + delta)
  answers[field.id] = nextVal
  onFieldChange(field)
}

const scrollToPlannerTop = () => {
  if (!plannerTopRef.value) return
  const rect = plannerTopRef.value.getBoundingClientRect()
  const targetY = rect.top + window.scrollY - 100
  if (window.scrollY > targetY) {
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' })
  }
}

const focusFirstError = () => {
  nextTick(() => {
    const firstErrEl = document.querySelector('[data-error-active="true"]') as HTMLElement | null
    if (firstErrEl) {
      firstErrEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

const goToNextStep = () => {
  if (validateStep(currentStepIndex.value)) {
    if (currentStepIndex.value < totalSteps.value - 1) {
      currentStepIndex.value += 1
      showStepErrorBanner.value = false
      scrollToPlannerTop()
    }
  } else {
    focusFirstError()
  }
}

const goToPreviousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value -= 1
    showStepErrorBanner.value = false
    scrollToPlannerTop()
  }
}

const jumpToStepById = (stepId: string) => {
  const targetIdx = activePath.value.steps.findIndex(s => s.id === stepId)
  if (targetIdx === -1) return

  // Allow jumping back freely, or jumping forward if intermediate steps are valid
  if (targetIdx < currentStepIndex.value) {
    currentStepIndex.value = targetIdx
    showStepErrorBanner.value = false
    scrollToPlannerTop()
  } else if (targetIdx > currentStepIndex.value) {
    let canAdvance = true
    for (let i = currentStepIndex.value; i < targetIdx; i++) {
      if (!validateStep(i)) {
        canAdvance = false
        currentStepIndex.value = i
        focusFirstError()
        break
      }
    }
    if (canAdvance) {
      currentStepIndex.value = targetIdx
      showStepErrorBanner.value = false
      scrollToPlannerTop()
    }
  }
}

// ==========================================
// REVIEW SUMMARY FORMATTER
// ==========================================
const formatDateForReview = (dateStr: string): string => {
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr
  const [year, month, day] = parts as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
}

const getReviewGroupSummary = (group: ReviewGroup): string => {
  const labels = props.questionnaire.reviewLabels
  const parts: string[] = []

  // Special handling for Journey group date + flexibility combination
  const hasDateField = group.fields.includes('preferredStartDate')
  const hasFlexibleField = group.fields.includes('datesFlexible')

  if (hasDateField && hasFlexibleField) {
    // 1. Region
    const regionField = getFieldById('preferredRegion')
    const regionVal = answers.preferredRegion
    if (regionField && regionVal) {
      const opt = regionField.options?.find(o => o.value === regionVal)
      if (opt) parts.push(opt.label)
    }

    // 2. Date + Flexibility
    const dateVal = answers.preferredStartDate
    const isFlex = answers.datesFlexible === 'yes'
    if (dateVal && isFlex) {
      parts.push(`${formatDateForReview(dateVal)} (${labels.preferredDateWithFlexibility})`)
    } else if (dateVal) {
      parts.push(formatDateForReview(dateVal))
    } else if (isFlex) {
      parts.push(labels.flexibleDates)
    }

    // 3. Duration
    const durVal = Number(answers.durationDays)
    if (durVal > 0) {
      parts.push(`${durVal} ${durVal === 1 ? labels.daySingular : labels.dayPlural}`)
    }

    return parts.length > 0 ? parts.join('  •  ') : labels.notProvided
  }

  // Standard group formatting
  group.fields.forEach((fieldId) => {
    const field = getFieldById(fieldId)
    if (!field || !isFieldVisible(field)) return

    const val = answers[fieldId]
    if (val === '' || val === null || val === undefined) return

    if (field.type === 'singleChoice' || field.type === 'select') {
      // If partnershipCategory is 'other' and partnershipCategoryOther is filled, let partnershipCategoryOther represent it
      if (fieldId === 'partnershipCategory' && val === 'other' && answers.partnershipCategoryOther) {
        return
      }
      const opt = field.options?.find(o => o.value === val)
      if (opt) parts.push(opt.label)
    } else if (field.type === 'multipleChoice' && Array.isArray(val) && val.length > 0) {
      val.forEach((v) => {
        const opt = field.options?.find(o => o.value === v)
        if (opt) parts.push(opt.label)
      })
    } else if (fieldId === 'travellerCount') {
      const count = Number(val)
      if (count > 0) {
        parts.push(`${count} ${count === 1 ? labels.travellerSingular : labels.travellerPlural}`)
      }
    } else if (fieldId === 'age') {
      parts.push(`Age ${val}`)
    } else if (field.type === 'phone') {
      const code = phoneCountryCodes[fieldId] || '+91'
      parts.push(`${code} ${val}`)
    } else {
      const str = String(val).trim()
      if (str.length > 90) {
        parts.push(`${str.slice(0, 90)}…`)
      } else if (str) {
        parts.push(str)
      }
    }
  })

  return parts.length > 0 ? parts.join('  •  ') : labels.notProvided
}

// ==========================================
// FORM SUBMISSION
// ==========================================
const handleSubmit = async () => {
  // Validate all steps in active path
  for (let i = 0; i < totalSteps.value; i++) {
    if (!validateStep(i)) {
      currentStepIndex.value = i
      focusFirstError()
      return
    }
  }

  isSubmitting.value = true

  // Simulate network request for immediate feedback & Web Vitals responsiveness
  await new Promise(resolve => setTimeout(resolve, 650))

  const randomDigits = Math.floor(1000 + Math.random() * 9000)
  const prefix = activePathId.value === 'traveller' ? 'ST-JRN' : 'ST-PRT'
  inquiryReference.value = `${prefix}-${new Date().getFullYear()}-${randomDigits}`

  isSubmitting.value = false
  isSubmitted.value = true
  isDirty.value = false
  scrollToPlannerTop()
}

// ==========================================
// UNSAVED CHANGES PROTECTION (HYBRID)
// ==========================================
const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value && !isSubmitted.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (pathNoticeTimer) clearTimeout(pathNoticeTimer)
})

const isInternalPlannerPath = (path: string): boolean => {
  const clean = (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path).toLowerCase()
  return (
    clean === '/planyourjourney' ||
    clean === '/planyourjourney/traveller' ||
    clean === '/planyourjourney/traveler' ||
    clean === '/planyourjourney/partner' ||
    clean === '/planyourjourney/partners'
  )
}

// Intercept Vue Router internal navigation with custom styled modal
onBeforeRouteLeave((to) => {
  if (
    allowConfirmedLeave.value ||
    !isDirty.value ||
    isSubmitted.value ||
    isInternalPlannerPath(to.path)
  ) {
    return true
  }
  pendingRouteUrl.value = to.fullPath
  showLeaveModal.value = true
  return false
})

const confirmLeavePage = () => {
  showLeaveModal.value = false
  allowConfirmedLeave.value = true
  if (pendingRouteUrl.value) {
    router.push(pendingRouteUrl.value)
  }
}

const cancelLeavePage = () => {
  showLeaveModal.value = false
  pendingRouteUrl.value = null
}
</script>

<template>
  <section
    id="journey-planner-workspace"
    ref="plannerTopRef"
    data-theme="light"
    class="text-primary-light section-wrapper"
  >
    <div class="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">

      <!-- ==========================================
           1. QUESTIONNAIRE ACTIVE VIEW
           ========================================== -->
      <div v-if="!isSubmitted" class="w-full flex flex-col items-center">

        <!-- SECTION HEADER -->
        <div class="relative w-full flex flex-col items-center text-center mb-8 md:mb-12 px-2">
          <h2 class="section-title-wrapper">
            <span class="text-journey-deep section-title-sans capitalize">
              {{ questionnaire.titleLine1 }}
            </span>
            <span class="text-dark-gold section-title-cursive mt-1">
              {{ questionnaire.titleLine2Cursive }}
            </span>
          </h2>

          <p class="text-secondary-light max-w-2xl section-paragraph">
            {{ questionnaire.description }}
          </p>
        </div>

        <!-- PATH SELECTOR CARDS (Traveller vs Partner) -->
        <div
          class="w-full mb-8 md:mb-12"
          role="radiogroup"
          :aria-label="questionnaire.pathSelector.label"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <button
              v-for="option in questionnaire.pathSelector.options"
              :key="option.id"
              type="button"
              role="radio"
              :aria-checked="activePathId === option.id"
              @click="selectPath(option.id)"
              class="group w-full text-left p-5 sm:p-6 rounded-xl border transition-all duration-300 flex items-start gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue select-none"
              :class="[
                activePathId === option.id
                  ? 'bg-soft-blue/20 border-intention-blue shadow-xs'
                  : 'bg-surface-light border-journey-deep/15 hover:border-intention-blue/50 active:border-intention-blue/50'
              ]"
            >
              <!-- Custom Radio Indicator -->
              <div
                class="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300"
                :class="[
                  activePathId === option.id
                    ? 'border-intention-blue'
                    : 'border-journey-deep/35 group-hover:border-intention-blue'
                ]"
              >
                <div
                  class="w-2.5 h-2.5 rounded-full bg-intention-blue transition-transform duration-300"
                  :class="activePathId === option.id ? 'scale-100' : 'scale-0'"
                />
              </div>

              <div class="flex flex-col gap-1">
                <span class="hero-paragraph font-semibold text-journey-deep">
                  {{ option.title }}
                </span>
                <span class="section-subparagraph text-secondary-light">
                  {{ option.description }}
                </span>
              </div>
            </button>
          </div>

          <!-- Non-intrusive Path Switch Reassurance Notice -->
          <div
            class="grid transition-all duration-300 ease-editorial"
            :class="showPathSwitchNotice ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'"
          >
            <div class="overflow-hidden">
              <p class="section-subparagraph text-intention-blue bg-soft-blue/15 border border-intention-blue/20 rounded-lg px-4 py-2.5 text-center">
                {{ questionnaire.pathSelector.changeNotice }}
              </p>
            </div>
          </div>
        </div>

        <!-- MOBILE PROGRESS TRACKER (< lg) -->
        <div class="lg:hidden w-full mb-8 bg-surface-light border border-journey-deep/10 rounded-xl p-4 sm:p-5 shadow-2xs">
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="card-eyebrow font-bold text-darker-gold uppercase mb-0">
              {{ questionnaire.navigation.stepLabel }} {{ String(currentStepIndex + 1).padStart(2, '0') }} {{ questionnaire.navigation.stepSeparator }} {{ String(totalSteps).padStart(2, '0') }}
            </span>
            <span class="card-tag font-bold text-secondary-light">
              {{ progressPercentage }}%
            </span>
          </div>

          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="hero-paragraph font-semibold text-journey-deep">
              {{ currentStep.navigationTitle }}
            </span>
          </div>

          <!-- Progress Bar Track -->
          <div class="w-full h-1.5 bg-journey-deep/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-darker-gold rounded-full transition-all duration-500 ease-editorial"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>
        </div>

        <!-- MAIN 12-COLUMN QUESTIONNAIRE WORKSPACE -->
        <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <!-- LEFT COLUMN: DESKTOP STEP SIDEBAR (lg+) -->
          <aside
            class="hidden lg:flex lg:col-span-4 flex-col sticky top-28 bg-soft-cream/25 border border-journey-deep/10 rounded-2xl p-6 xl:p-8 justify-between min-h-120"
            :aria-label="activePath.progressTitle"
          >
            <div class="flex flex-col">
              <h3 class="card-eyebrow font-bold text-journey-deep uppercase mb-6">
                {{ activePath.progressTitle }}
              </h3>

              <ol class="flex flex-col divide-y divide-journey-deep/10">
                <li
                  v-for="(step, sIdx) in activePath.steps"
                  :key="step.id"
                  class="py-3.5 first:pt-0 last:pb-0"
                >
                  <button
                    type="button"
                    @click="jumpToStepById(step.id)"
                    class="w-full flex items-center justify-between gap-3 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue rounded-md py-1"
                    :aria-current="currentStepIndex === sIdx ? 'step' : undefined"
                  >
                    <div class="flex items-center gap-3.5">
                      <!-- Active Vertical Accent Pill -->
                      <span
                        class="w-1 h-5 rounded-full transition-colors duration-300"
                        :class="currentStepIndex === sIdx ? 'bg-darker-gold' : 'bg-transparent'"
                      />
                      <span
                        class="section-subparagraph font-bold transition-colors duration-300"
                        :class="currentStepIndex === sIdx ? 'text-darker-gold' : 'text-journey-deep/60'"
                      >
                        {{ String(sIdx + 1).padStart(2, '0') }}
                      </span>
                      <span
                        class="section-subparagraph transition-colors duration-300"
                        :class="[
                          currentStepIndex === sIdx
                            ? 'font-bold text-journey-deep'
                            : 'font-normal text-secondary-light group-hover:text-journey-deep'
                        ]"
                      >
                        {{ step.navigationTitle }}
                      </span>
                    </div>

                    <!-- Step Status Indicator (Completed Checkmark vs Active Dot) -->
                    <div class="shrink-0 flex items-center justify-center w-5 h-5">
                      <span
                        v-if="currentStepIndex === sIdx"
                        class="w-3 h-3 rounded-full bg-darker-gold ring-4 ring-darker-gold/20"
                        :title="questionnaire.navigation.currentLabel"
                      />
                      <svg
                        v-else-if="isStepCompleted(sIdx)"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-4 h-4 text-journey-deep/70"
                        :aria-label="questionnaire.navigation.completedLabel"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <span
                        v-else
                        class="w-2.5 h-2.5 rounded-full border border-journey-deep/25"
                      />
                    </div>
                  </button>
                </li>
              </ol>
            </div>

            <!-- Sidebar Reassurance Footer -->
            <div class="pt-6 mt-8 border-t border-journey-deep/10">
              <div class="w-8 h-0.5 bg-darker-gold mb-3 rounded-full" />
              <p class="section-subparagraph text-secondary-light">
                {{ questionnaire.navigation.sidebarNote }}
              </p>
            </div>
          </aside>

          <!-- RIGHT COLUMN: ACTIVE FORM PANEL (Zero-CLS Container) -->
          <div class="lg:col-span-8 w-full bg-surface-light border border-journey-deep/10 rounded-2xl p-5 sm:p-8 md:p-10 shadow-xs min-h-136 flex flex-col justify-between">
            <form @submit.prevent="handleSubmit" novalidate class="w-full flex flex-col justify-between grow">

              <div class="w-full">
                <!-- Desktop Step Eyebrow & Progress Bar -->
                <div class="hidden lg:flex flex-col gap-2 mb-6">
                  <div class="flex items-center justify-between">
                    <span class="card-eyebrow font-bold text-darker-gold uppercase mb-0">
                      {{ questionnaire.navigation.stepLabel }} {{ String(currentStepIndex + 1).padStart(2, '0') }} {{ questionnaire.navigation.stepSeparator }} {{ String(totalSteps).padStart(2, '0') }}
                    </span>
                    <span class="card-tag font-semibold text-secondary-light">
                      {{ progressPercentage }}%
                    </span>
                  </div>
                  <div class="w-full h-1 bg-journey-deep/10 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-darker-gold rounded-full transition-all duration-500 ease-editorial"
                      :style="{ width: `${progressPercentage}%` }"
                    />
                  </div>
                </div>

                <!-- Step Heading & Description -->
                <div class="mb-6 md:mb-8">
                  <h3 class="section-smaller-subtitle font-semibold text-journey-deep mb-2">
                    {{ currentStep.title }}
                  </h3>
                  <p class="section-paragraph text-secondary-light">
                    {{ currentStep.description }}
                  </p>
                </div>

                <!-- Validation Summary Alert Banner (Zero-CLS Grid Expansion) -->
                <div
                  class="grid transition-all duration-300 ease-editorial"
                  :class="showStepErrorBanner ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0 mb-0'"
                  role="alert"
                  aria-live="polite"
                >
                  <div class="overflow-hidden">
                    <div class="bg-terracotta/10 border-l-4 border-terracotta rounded-r-xl p-4 flex flex-col gap-1">
                      <p class="section-paragraph font-semibold text-terracotta">
                        {{ questionnaire.submission.validationSummaryTitle }}
                      </p>
                      <p class="section-subparagraph text-secondary-light">
                        {{ questionnaire.submission.validationSummaryDescription }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- ==========================================
                     DYNAMIC STEP FIELDS RENDERER
                     ========================================== -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <template v-for="field in currentStep.fields" :key="field.id">
                    <div
                      v-if="isFieldVisible(field)"
                      :data-error-active="Boolean(errors[field.id])"
                      :class="[
                        ['fullName', 'email', 'phone', 'age', 'preferredStartDate', 'durationDays', 'companyName', 'annualClientVolume', 'primaryContactName', 'businessEmail'].includes(field.id)
                          ? 'md:col-span-1'
                          : 'md:col-span-2',
                        field.id === 'datesFlexible' ? '-mt-3 md:col-span-2' : ''
                      ]"
                      class="flex flex-col"
                    >
                      <!-- Standard Field Label (Hidden for standalone checkbox which renders its own inline label) -->
                      <label
                        v-if="field.type !== 'checkbox'"
                        :for="`field-${field.id}`"
                        class="card-eyebrow font-bold text-journey-deep uppercase mb-2 flex items-center flex-wrap gap-1.5"
                      >
                        <span>{{ field.label }}</span>
                        <span
                          v-if="field.helpText && field.type === 'multipleChoice'"
                          class="card-tag text-secondary-light font-normal uppercase"
                        >
                          ({{ field.helpText }})
                        </span>
                        <span
                          v-if="isFieldRequired(field)"
                          class="text-darker-gold font-bold"
                          :title="questionnaire.navigation.requiredLabel"
                        >*</span>
                        <span
                          v-else-if="field.requirement === 'optional'"
                          class="card-tag text-secondary-light font-normal uppercase"
                        >
                          ({{ questionnaire.navigation.optionalLabel }})
                        </span>
                      </label>

                      <!-- 1. SINGLE CHOICE CARDS (Radio Group) -->
                      <div
                        v-if="field.type === 'singleChoice'"
                        role="radiogroup"
                        :aria-label="field.label"
                        class="grid gap-3"
                        :class="[
                          (field.options?.length || 0) === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-1 sm:grid-cols-2'
                        ]"
                      >
                        <label
                          v-for="opt in field.options"
                          :key="opt.value"
                          class="group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none"
                          :class="[
                            answers[field.id] === opt.value
                              ? 'bg-soft-blue/20 border-intention-blue shadow-2xs'
                              : errors[field.id]
                                ? 'bg-surface-light border-terracotta/60 hover:border-terracotta'
                                : 'bg-surface-light border-journey-deep/15 hover:border-intention-blue/50 active:border-intention-blue/50'
                          ]"
                        >
                          <input
                            type="radio"
                            :name="field.id"
                            :value="opt.value"
                            v-model="answers[field.id]"
                            @change="onFieldChange(field)"
                            class="sr-only"
                          />
                          <!-- Indicator Circle -->
                          <span
                            class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                            :class="[
                              answers[field.id] === opt.value
                                ? 'border-intention-blue bg-intention-blue text-surface-light'
                                : 'border-journey-deep/30 group-hover:border-intention-blue'
                            ]"
                          >
                            <svg
                              v-if="answers[field.id] === opt.value"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="w-3 h-3"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>

                          <span class="flex flex-col gap-0.5">
                            <span class="section-subparagraph font-semibold text-journey-deep">
                              {{ opt.label }}
                            </span>
                            <span v-if="opt.description" class="card-paragraph text-secondary-light">
                              {{ opt.description }}
                            </span>
                          </span>
                        </label>
                      </div>

                      <!-- 2. MULTIPLE CHOICE CARDS (Checkbox Group) -->
                      <div
                        v-else-if="field.type === 'multipleChoice'"
                        role="group"
                        :aria-label="field.label"
                        class="grid grid-cols-1 sm:grid-cols-2 gap-3"
                      >
                        <label
                          v-for="opt in field.options"
                          :key="opt.value"
                          class="group relative flex items-center gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none"
                          :class="[
                            Array.isArray(answers[field.id]) && answers[field.id].includes(opt.value)
                              ? 'bg-soft-blue/20 border-intention-blue shadow-2xs'
                              : errors[field.id]
                                ? 'bg-surface-light border-terracotta/60 hover:border-terracotta'
                                : 'bg-surface-light border-journey-deep/15 hover:border-intention-blue/50 active:border-intention-blue/50'
                          ]"
                        >
                          <input
                            type="checkbox"
                            :value="opt.value"
                            :checked="Array.isArray(answers[field.id]) && answers[field.id].includes(opt.value)"
                            @change="toggleMultipleChoice(field, opt.value)"
                            class="sr-only"
                          />
                          <!-- Custom Checkbox Square -->
                          <span
                            class="w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors"
                            :class="[
                              Array.isArray(answers[field.id]) && answers[field.id].includes(opt.value)
                                ? 'bg-intention-blue border-intention-blue text-surface-light'
                                : 'border-journey-deep/30 group-hover:border-intention-blue'
                            ]"
                          >
                            <svg
                              v-if="Array.isArray(answers[field.id]) && answers[field.id].includes(opt.value)"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="w-3.5 h-3.5"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>

                          <span class="section-subparagraph font-semibold text-journey-deep">
                            {{ opt.label }}
                          </span>
                        </label>
                      </div>

                      <!-- 3. STANDALONE CHECKBOX (e.g. My dates are flexible) -->
                      <div v-else-if="field.type === 'checkbox'" class="flex flex-col">
                        <label
                          :for="`field-${field.id}`"
                          class="inline-flex items-center gap-3 cursor-pointer select-none group w-fit py-1"
                        >
                          <input
                            :id="`field-${field.id}`"
                            type="checkbox"
                            :checked="answers[field.id] === (field.checkedValue || 'yes')"
                            @change="toggleCheckbox(field)"
                            class="sr-only"
                          />
                          <span
                            class="w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors"
                            :class="[
                              answers[field.id] === (field.checkedValue || 'yes')
                                ? 'bg-intention-blue border-intention-blue text-surface-light'
                                : 'border-journey-deep/35 group-hover:border-intention-blue'
                            ]"
                          >
                            <svg
                              v-if="answers[field.id] === (field.checkedValue || 'yes')"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="w-3.5 h-3.5"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          </span>
                          <span class="section-subparagraph font-medium text-journey-deep">
                            {{ field.label }}
                          </span>
                        </label>
                      </div>

                      <!-- 4. NUMBER STEPPER (Number of Travellers) -->
                      <div
                        v-else-if="field.type === 'numberStepper'"
                        class="inline-flex items-center border border-journey-deep/20 rounded-xl bg-surface-light overflow-hidden w-full sm:w-56 h-12"
                      >
                        <button
                          type="button"
                          @click="adjustStepper(field, -1)"
                          :disabled="Number(answers[field.id]) <= (field.validation?.min ?? 1)"
                          :aria-label="field.decreaseLabel || 'Decrease'"
                          class="w-14 h-full flex items-center justify-center border-r border-journey-deep/15 text-journey-deep hover:bg-soft-cream/30 active:bg-soft-cream/50 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                            <path d="M5 12h14" />
                          </svg>
                        </button>

                        <input
                          :id="`field-${field.id}`"
                          type="number"
                          :min="field.validation?.min ?? 1"
                          v-model.number="answers[field.id]"
                          @input="onFieldChange(field)"
                          class="w-full h-full text-center section-paragraph font-bold text-journey-deep bg-transparent focus:outline-none no-spin-buttons"
                        />

                        <button
                          type="button"
                          @click="adjustStepper(field, 1)"
                          :aria-label="field.increaseLabel || 'Increase'"
                          class="w-14 h-full flex items-center justify-center border-l border-journey-deep/15 text-journey-deep hover:bg-soft-cream/30 active:bg-soft-cream/50 transition-colors cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>

                      <!-- 5. DATE INPUT -->
                      <div v-else-if="field.type === 'date'" class="relative w-full">
                        <input
                          :id="`field-${field.id}`"
                          type="date"
                          :min="field.validation?.earliest === 'today' ? todayIso : undefined"
                          v-model="answers[field.id]"
                          @input="onFieldChange(field)"
                          @change="onFieldChange(field)"
                          class="w-full h-12 px-4 rounded-xl border bg-surface-light section-subparagraph transition-colors focus:outline-none focus:border-intention-blue"
                          :class="[
                            errors[field.id]
                              ? 'border-terracotta'
                              : 'border-journey-deep/20 hover:border-journey-deep/40',
                            !answers[field.id] ? 'text-secondary-light/70' : 'text-journey-deep font-medium'
                          ]"
                        />
                      </div>

                      <!-- 6. SELECT DROPDOWN -->
                      <div v-else-if="field.type === 'select'" class="relative w-full">
                        <select
                          :id="`field-${field.id}`"
                          v-model="answers[field.id]"
                          @change="onFieldChange(field)"
                          class="w-full h-12 pl-4 pr-10 rounded-xl border bg-surface-light section-subparagraph appearance-none cursor-pointer transition-colors focus:outline-none focus:border-intention-blue"
                          :class="[
                            errors[field.id]
                              ? 'border-terracotta'
                              : 'border-journey-deep/20 hover:border-journey-deep/40',
                            !answers[field.id] ? 'text-secondary-light/70' : 'text-journey-deep font-medium'
                          ]"
                        >
                          <option value="" disabled>{{ field.placeholder }}</option>
                          <option
                            v-for="opt in field.options"
                            :key="opt.value"
                            :value="opt.value"
                            class="text-journey-deep"
                          >
                            {{ opt.label }}
                          </option>
                        </select>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          class="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-journey-deep/60"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>

                      <!-- 7. PHONE INPUT (With Integrated Country Calling Code Selector) -->
                      <div
                        v-else-if="field.type === 'phone'"
                        class="flex items-center w-full h-12 rounded-xl border bg-surface-light overflow-hidden transition-colors focus-within:border-intention-blue"
                        :class="errors[field.id] ? 'border-terracotta' : 'border-journey-deep/20 hover:border-journey-deep/40'"
                      >
                        <div class="relative h-full shrink-0 border-r border-journey-deep/15 bg-soft-cream/15">
                          <select
                            v-model="phoneCountryCodes[field.id]"
                            :aria-label="field.countryPlaceholder || 'Country code'"
                            class="h-full pl-3 pr-7 bg-transparent section-subparagraph font-semibold text-journey-deep appearance-none cursor-pointer focus:outline-none"
                          >
                            <option v-for="c in countryCodes" :key="c.code" :value="c.code">
                              {{ c.label }}
                            </option>
                          </select>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-journey-deep/60"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>

                        <input
                          :id="`field-${field.id}`"
                          type="tel"
                          :autocomplete="field.autocomplete || 'tel-national'"
                          :placeholder="field.placeholder"
                          v-model="answers[field.id]"
                          @input="onFieldChange(field)"
                          class="w-full h-full px-3.5 bg-transparent section-subparagraph text-journey-deep placeholder:text-secondary-light/50 focus:outline-none"
                        />
                      </div>

                      <!-- 8. TEXT / EMAIL / NUMBER INPUTS -->
                      <div
                        v-else-if="['text', 'email', 'number'].includes(field.type)"
                        class="w-full"
                      >
                        <input
                          :id="`field-${field.id}`"
                          :type="field.type"
                          :min="field.validation?.min"
                          :maxlength="field.validation?.maxLength"
                          :autocomplete="field.autocomplete"
                          :placeholder="field.placeholder"
                          v-model="answers[field.id]"
                          @input="onFieldChange(field)"
                          class="w-full h-12 px-4 rounded-xl border bg-surface-light section-subparagraph text-journey-deep placeholder:text-secondary-light/50 transition-colors focus:outline-none focus:border-intention-blue"
                          :class="errors[field.id] ? 'border-terracotta' : 'border-journey-deep/20 hover:border-journey-deep/40'"
                        />
                      </div>

                      <!-- 9. TEXTAREA -->
                      <div v-else-if="field.type === 'textarea'" class="w-full">
                        <textarea
                          :id="`field-${field.id}`"
                          rows="4"
                          :maxlength="field.validation?.maxLength"
                          :placeholder="field.placeholder"
                          v-model="answers[field.id]"
                          @input="onFieldChange(field)"
                          class="w-full p-4 rounded-xl border bg-surface-light section-subparagraph text-journey-deep placeholder:text-secondary-light/50 transition-colors focus:outline-none focus:border-intention-blue resize-y"
                          :class="errors[field.id] ? 'border-terracotta' : 'border-journey-deep/20 hover:border-journey-deep/40'"
                        />
                      </div>

                      <!-- Field Help Text (Below Input) -->
                      <p
                        v-if="field.helpText && field.type !== 'multipleChoice'"
                        class="card-paragraph text-secondary-light mt-1.5"
                      >
                        {{ field.helpText }}
                      </p>

                      <!-- Field Validation Error Message -->
                      <p
                        v-if="errors[field.id]"
                        class="section-subparagraph font-semibold text-terracotta mt-1.5 flex items-center gap-1.5"
                        role="alert"
                      >
                        <span>* {{ errors[field.id] }}</span>
                      </p>
                    </div>
                  </template>
                </div>

                <!-- ==========================================
                     FINAL STEP: REVIEW AT A GLANCE & PRIVACY
                     ========================================== -->
                <div
                  v-if="currentStep.review"
                  class="mt-8 pt-6 border-t border-journey-deep/10 flex flex-col gap-6"
                >
                  <div>
                    <h4 class="hero-paragraph font-semibold text-journey-deep mb-1">
                      {{ currentStep.review.title }}
                    </h4>
                    <p class="section-subparagraph text-secondary-light mb-4">
                      {{ currentStep.review.description }}
                    </p>

                    <!-- Summary Box -->
                    <div class="bg-soft-cream/25 border border-journey-deep/10 rounded-xl divide-y divide-journey-deep/10 px-4 sm:px-6">
                      <div
                        v-for="group in currentStep.review.groups"
                        :key="group.title"
                        class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
                      >
                        <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 grow">
                          <span class="card-eyebrow font-bold text-journey-deep uppercase sm:w-32 shrink-0 mb-0">
                            {{ group.title }}
                          </span>
                          <span class="section-subparagraph font-medium text-journey-deep">
                            {{ getReviewGroupSummary(group) }}
                          </span>
                        </div>

                        <button
                          type="button"
                          @click="jumpToStepById(group.stepId)"
                          class="section-subparagraph font-semibold text-intention-blue hover:text-action-blue underline self-start sm:self-center shrink-0 cursor-pointer"
                        >
                          {{ questionnaire.navigation.editLabel }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Privacy Policy Acknowledgement Checkbox -->
                  <div
                    :data-error-active="Boolean(errors[questionnaire.privacyAcknowledgement.id])"
                    class="flex flex-col"
                  >
                    <label
                      :for="`field-${questionnaire.privacyAcknowledgement.id}`"
                      class="inline-flex items-start gap-3 cursor-pointer select-none group"
                    >
                      <input
                        :id="`field-${questionnaire.privacyAcknowledgement.id}`"
                        type="checkbox"
                        :checked="answers[questionnaire.privacyAcknowledgement.id] === questionnaire.privacyAcknowledgement.checkedValue"
                        @change="toggleCheckbox(questionnaire.privacyAcknowledgement)"
                        class="sr-only"
                      />
                      <span
                        class="mt-0.5 w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-colors"
                        :class="[
                          answers[questionnaire.privacyAcknowledgement.id] === questionnaire.privacyAcknowledgement.checkedValue
                            ? 'bg-intention-blue border-intention-blue text-surface-light'
                            : errors[questionnaire.privacyAcknowledgement.id]
                              ? 'border-terracotta'
                              : 'border-journey-deep/35 group-hover:border-intention-blue'
                        ]"
                      >
                        <svg
                          v-if="answers[questionnaire.privacyAcknowledgement.id] === questionnaire.privacyAcknowledgement.checkedValue"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="w-3.5 h-3.5"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>

                      <span class="section-subparagraph text-journey-deep">
                        I have read the
                        <NuxtLink
                          v-if="questionnaire.privacyAcknowledgement.link"
                          :to="questionnaire.privacyAcknowledgement.link.to"
                          class="font-semibold text-intention-blue underline hover:text-action-blue"
                          @click.stop
                        >
                          {{ questionnaire.privacyAcknowledgement.link.label }}
                        </NuxtLink>
                        and agree to be contacted about this inquiry.
                      </span>
                    </label>

                    <p
                      v-if="questionnaire.privacyAcknowledgement.helpText"
                      class="card-paragraph text-secondary-light pl-8 mt-1"
                    >
                      {{ questionnaire.privacyAcknowledgement.helpText }}
                    </p>

                    <p
                      v-if="errors[questionnaire.privacyAcknowledgement.id]"
                      class="section-subparagraph font-semibold text-terracotta pl-8 mt-1.5"
                      role="alert"
                    >
                      * {{ errors[questionnaire.privacyAcknowledgement.id] }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- ==========================================
                   STEP NAVIGATION FOOTER (Back / Continue / Submit)
                   ========================================== -->
              <div class="mt-10 pt-6 border-t border-journey-deep/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-start justify-between gap-4">
                <!-- Left Side: Back Button or Submission Reassurance Note -->
                <div class="flex items-center">
                  <button
                    v-if="currentStepIndex > 0"
                    type="button"
                    @click="goToPreviousStep"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-journey-deep/30 section-subparagraph font-semibold uppercase text-journey-deep hover:border-intention-blue hover:text-intention-blue active:scale-98 transition-all cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>{{ questionnaire.navigation.backLabel }}</span>
                  </button>
                  <p v-else class="card-paragraph text-secondary-light text-center sm:text-left w-full">
                    {{ activePath.submissionNote }}
                  </p>
                </div>

                <!-- Right Side: Continue or Submit Button + Next Step Hint -->
                <div class="flex flex-col items-center sm:items-end gap-1.5">
                  <button
                    v-if="currentStepIndex < totalSteps - 1"
                    type="button"
                    @click="goToNextStep"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-md border-2 border-intention-blue bg-surface-light text-intention-blue hover:bg-intention-blue hover:text-surface-light active:bg-intention-blue active:text-surface-light section-subparagraph font-bold uppercase transition-all duration-300 cursor-pointer"
                  >
                    <span>{{ questionnaire.navigation.continueLabel }}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    v-else
                    type="submit"
                    :disabled="isSubmitting"
                    class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-md border-2 border-intention-blue bg-intention-blue text-surface-light hover:bg-journey-deep hover:border-journey-deep section-subparagraph font-bold uppercase transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    <span>{{ isSubmitting ? questionnaire.submission.sendingLabel : activePath.submitLabel }}</span>
                    <svg
                      v-if="!isSubmitting"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      class="w-4 h-4"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </button>

                  <span
                    v-if="nextStep"
                    class="card-paragraph text-secondary-light"
                  >
                    {{ questionnaire.navigation.nextLabel }}: {{ nextStep.navigationTitle }}
                  </span>
                  <span
                    v-else
                    class="card-paragraph text-secondary-light text-center sm:text-right"
                  >
                    {{ activePath.submissionNote }}
                  </span>
                </div>
              </div>

            </form>
          </div>

        </div>
      </div>

      <!-- ==========================================
           2. SUBMISSION SUCCESS VIEW
           ========================================== -->
      <div
        v-else
        class="w-full max-w-3xl mx-auto bg-surface-light border border-journey-deep/10 rounded-2xl p-6 sm:p-10 md:p-14 text-center shadow-sm flex flex-col items-center"
        role="status"
        aria-live="polite"
      >
        <div class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <span class="text-journey-deep eyebrow-text">
            {{ activePath.success.eyebrow }}
          </span>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2 class="section-title-wrapper">
          <span class="text-journey-deep section-title-sans">
            {{ activePath.success.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ activePath.success.titleLine2Cursive }}
          </span>
        </h2>

        <p class="section-paragraph text-secondary-light max-w-xl mb-6">
          {{ activePath.success.description }}
        </p>

        <!-- Reference Badge -->
        <div class="bg-soft-cream/35 border border-darker-gold/30 rounded-xl px-6 py-3 mb-8 inline-flex flex-col items-center gap-1">
          <span class="card-tag font-bold text-journey-deep uppercase">
            {{ activePath.success.referenceLabel }}
          </span>
          <span class="hero-paragraph font-bold text-darker-gold">
            {{ inquiryReference }}
          </span>
        </div>

        <!-- Next Steps List -->
        <div class="w-full max-w-xl bg-bg-light border border-journey-deep/10 rounded-xl p-5 sm:p-6 text-left mb-8">
          <ol class="list-decimal pl-5 flex flex-col gap-2.5">
            <li
              v-for="(item, idx) in activePath.success.nextSteps"
              :key="idx"
              class="section-subparagraph text-secondary-light"
            >
              {{ item }}
            </li>
          </ol>
        </div>

        <div class="hero-cta-wrapper">
          <CtaButton :to="activePath.success.ctaTo" :label="activePath.success.ctaLabel" variant="light" />
          <CtaButton :to="activePath.success.secondaryCtaTo" :label="activePath.success.secondaryCtaLabel" variant="light" />
        </div>
      </div>

      <!-- ==========================================
           3. REASSURANCE & CONTACT ALTERNATIVE FOOTER
           ========================================== -->
      <div class="w-full mt-16 md:mt-24 pt-12 border-t border-journey-deep/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Reassurance 3 Columns -->
        <div class="lg:col-span-8 flex flex-col gap-5">
          <h3 class="section-smaller-subtitle font-semibold text-journey-deep">
            {{ reassurance.title }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div
              v-for="item in reassurance.items"
              :key="item.title"
              class="bg-soft-cream/25 border border-journey-deep/10 rounded-xl p-5 flex flex-col gap-1.5"
            >
              <h4 class="section-paragraph font-semibold text-journey-deep">
                {{ item.title }}
              </h4>
              <p class="section-subparagraph text-secondary-light">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Contact Alternative Card -->
        <div class="lg:col-span-4 bg-surface-light border border-journey-deep/15 rounded-2xl p-6 sm:p-7 flex flex-col items-start justify-between gap-4 shadow-2xs">
          <div class="flex flex-col gap-2">
            <h4 class="hero-paragraph font-semibold text-journey-deep">
              {{ contactAlternative.title }}
            </h4>
            <p class="section-subparagraph text-secondary-light">
              {{ contactAlternative.description }}
            </p>
          </div>
          <CtaButton :to="contactAlternative.ctaTo" :label="contactAlternative.ctaLabel" variant="light" />
        </div>
      </div>

    </div>

    <!-- ==========================================
         4. CUSTOM UNSAVED-CHANGES ROUTE MODAL
         ========================================== -->
    <Teleport to="body">
      <div
        v-if="showLeaveModal"
        class="fixed inset-0 z-200 flex items-center justify-center p-4 bg-journey-deep/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-modal-title"
      >
        <div class="bg-surface-light border border-journey-deep/15 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-4">
          <h3 id="leave-modal-title" class="section-smaller-subtitle font-semibold text-journey-deep">
            Leave your inquiry unfinished?
          </h3>
          <p class="section-paragraph text-secondary-light">
            You have unsaved details in your journey questionnaire. Leaving this page now will clear the progress you have made so far.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-journey-deep/10">
            <button
              type="button"
              @click="cancelLeavePage"
              class="w-full sm:w-auto px-5 py-2.5 rounded-md bg-intention-blue text-surface-light section-subparagraph font-semibold uppercase hover:bg-journey-deep transition-colors cursor-pointer"
            >
              Stay & Continue
            </button>
            <button
              type="button"
              @click="confirmLeavePage"
              class="w-full sm:w-auto px-5 py-2.5 rounded-md border border-terracotta/40 text-terracotta section-subparagraph font-semibold uppercase hover:bg-terracotta/10 transition-colors cursor-pointer"
            >
              Discard & Leave
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
/* Hide native spin buttons on stepper input across Chrome, Safari, Edge, Firefox */
.no-spin-buttons::-webkit-outer-spin-button,
.no-spin-buttons::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-spin-buttons {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>