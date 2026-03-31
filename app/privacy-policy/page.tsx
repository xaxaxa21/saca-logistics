import type { Metadata } from 'next'

import { LegalPageShell, LegalSection } from '@/components/legal/legal-page-shell'
import { COMPANY_INFO, DATA_COLLECTION_SUMMARY } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy Policy | SACA Logistics',
  description:
    'How SACA Logistics collects, uses, stores, and protects personal data under GDPR.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Privacy Policy"
      title="How we collect and use personal data"
      description="This notice explains what information SACA Logistics processes, why it is processed, which service providers support the website, and how visitors can exercise their GDPR rights."
    >
      <LegalSection title="Who controls your data">
        <p>
          The data controller for this website is {COMPANY_INFO.brandName} (
          {COMPANY_INFO.legalName}), based in {COMPANY_INFO.city}.
        </p>
        <p>
          Contact email: {COMPANY_INFO.email}. Contact phone:{' '}
          {COMPANY_INFO.phone}.
        </p>
        <p>
          Registered office: {COMPANY_INFO.registeredOfficePlaceholder}
          <br />
          Registration number: {COMPANY_INFO.registrationNumberPlaceholder}
          <br />
          VAT / CUI: {COMPANY_INFO.vatNumberPlaceholder}
        </p>
      </LegalSection>

      <LegalSection title="What data we collect">
        <p>
          When you submit the contact form, we collect the following inquiry
          fields: {DATA_COLLECTION_SUMMARY.inquiryFields.join(', ')}.
        </p>
        <p>
          We may also process limited technical data required to keep the site
          available and secure, such as server logs, request metadata, and the
          consent record used to remember your cookie choice.
        </p>
      </LegalSection>

      <LegalSection title="Why we process personal data">
        <ul className="list-disc space-y-3 pl-5">
          <li>To review and answer commercial or operational inquiries.</li>
          <li>
            To assess whether our logistics, fulfillment, or supply-chain
            services match your request.
          </li>
          <li>
            To protect the website, prevent misuse, and document consent
            preferences.
          </li>
          <li>
            To measure aggregated website usage only after explicit analytics
            consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Legal bases under GDPR">
        <ul className="list-disc space-y-3 pl-5">
          {DATA_COLLECTION_SUMMARY.legalBases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Processors and recipients">
        <p>
          We use carefully selected service providers to host the site and route
          inquiries. Current processors or supporting providers include:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          {DATA_COLLECTION_SUMMARY.processors.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          If we later add services such as Google Analytics, Google Tag Manager,
          or similar marketing and measurement tools, they will only be enabled
          after consent and this policy will be updated accordingly.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>{DATA_COLLECTION_SUMMARY.retention}</p>
        <p>
          Where a request leads to a commercial relationship, relevant records
          may be retained for longer where necessary for contract management,
          accounting, or legal compliance.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Subject to applicable law, you may request access, rectification,
          erasure, restriction, objection, data portability, and withdrawal of
          consent for optional analytics.
        </p>
        <p>
          To exercise these rights, contact {COMPANY_INFO.privacyContact}. You
          also have the right to lodge a complaint with the competent data
          protection authority.
        </p>
      </LegalSection>

      <LegalSection title="International transfers and security">
        <p>
          Depending on the infrastructure used by our hosting and form-delivery
          providers, limited data may be processed outside your jurisdiction.
          Where required, we rely on appropriate safeguards such as standard
          contractual clauses or equivalent protective measures made available by
          the provider.
        </p>
        <p>
          We apply reasonable technical and organizational measures to protect
          personal data against unauthorized access, loss, or disclosure.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
