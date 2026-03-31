export const LEGAL_POLICY_VERSION = '2026-03-31'

export const COMPANY_INFO = {
  brandName: 'SACA Logistics',
  legalName: 'Saca Experts SRL',
  email: 'office@sacaexperts.ro',
  phone: '+40 725 193 181',
  city: 'Bucharest, Romania',
  websiteUrl: 'https://sacalogistics.com',
  privacyContact: 'office@sacaexperts.ro',
  registeredOfficePlaceholder: '[To be completed: full registered office address]',
  registrationNumberPlaceholder:
    '[To be completed: Trade Register / company registration number]',
  vatNumberPlaceholder: '[To be completed: VAT / CUI]',
} as const

export const LEGAL_NAV_ITEMS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Legal Notice', href: '/legal-notice' },
] as const

export const COMPLIANCE_LOGOS = [
  {
    src: '/anpc-logo.webp',
    alt: 'ANPC compliance badge',
    label: 'Consumer protection information',
  },
  {
    src: '/comunicat-ue-logo.webp',
    alt: 'European Union communication badge',
    label: 'EU communication and transparency',
  },
  {
    src: '/litigii-logo.webp',
    alt: 'Dispute resolution badge',
    label: 'Dispute resolution awareness',
  },
] as const

export const DATA_COLLECTION_SUMMARY = {
  inquiryFields: ['name', 'email', 'company', 'phone', 'message'],
  processors: [
    'Vercel for hosting and deployment infrastructure.',
    'FormSync for secure delivery of contact form submissions.',
    'Vercel Analytics only after the visitor grants analytics consent.',
    'Google Analytics (gtag.js) for aggregated traffic measurement, only after analytics consent.',
  ],
  legalBases: [
    'Article 6(1)(b) GDPR for steps taken before entering into a contract when an inquiry relates to requested services.',
    'Article 6(1)(f) GDPR for legitimate interests in handling business inquiries, preventing abuse, and maintaining service quality.',
    'Article 6(1)(a) GDPR for optional analytics cookies, only after explicit consent.',
  ],
  retention:
    'Inquiry data is retained only for as long as necessary to answer the request, continue related commercial discussions, and comply with record-keeping obligations.',
} as const
