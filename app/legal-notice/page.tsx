import type { Metadata } from 'next'

import { LegalPageShell, LegalSection } from '@/components/legal/legal-page-shell'
import { COMPANY_INFO } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Legal Notice | SACA Logistics',
  description:
    'Company disclosure information and placeholders for mandatory registration identifiers.',
}

export default function LegalNoticePage() {
  return (
    <LegalPageShell
      eyebrow="Legal Notice"
      title="Company disclosure information"
      description="This page gathers the core legal identifiers and corporate contact details associated with the SACA Logistics website."
    >
      <LegalSection title="Company identity">
        <p>
          Trading name: {COMPANY_INFO.brandName}
          <br />
          Legal entity: {COMPANY_INFO.legalName}
          <br />
          Website: {COMPANY_INFO.websiteUrl}
        </p>
      </LegalSection>

      <LegalSection title="Contact channels">
        <p>
          General contact email: {COMPANY_INFO.email}
          <br />
          Privacy contact: {COMPANY_INFO.privacyContact}
          <br />
          Phone: {COMPANY_INFO.phone}
          <br />
          Operational location: {COMPANY_INFO.city}
        </p>
      </LegalSection>

      <LegalSection title="Mandatory identifiers to complete">
        <p>
          The following fields should be replaced with the finalized corporate
          records before public launch:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>{COMPANY_INFO.registeredOfficePlaceholder}</li>
          <li>{COMPANY_INFO.registrationNumberPlaceholder}</li>
          <li>{COMPANY_INFO.vatNumberPlaceholder}</li>
        </ul>
      </LegalSection>

      <LegalSection title="Hosting and infrastructure">
        <p>
          The website is deployed using Vercel infrastructure. Contact form
          messages are routed through FormSync. Additional third-party tools may
          be listed here if they are activated in the future.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
