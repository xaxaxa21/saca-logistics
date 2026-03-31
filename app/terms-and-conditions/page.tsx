import type { Metadata } from 'next'

import { LegalPageShell, LegalSection } from '@/components/legal/legal-page-shell'
import { COMPANY_INFO } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Terms & Conditions | SACA Logistics',
  description:
    'Website terms governing access to the SACA Logistics site, content use, and inquiry submissions.',
}

export default function TermsAndConditionsPage() {
  return (
    <LegalPageShell
      eyebrow="Terms & Conditions"
      title="Rules for using this website"
      description="These terms describe how visitors may use the SACA Logistics website, what the informational content is intended for, and the limits that apply to site usage and inquiry handling."
    >
      <LegalSection title="Scope of the website">
        <p>
          This website presents the services, expertise, and contact channels of{' '}
          {COMPANY_INFO.brandName} ({COMPANY_INFO.legalName}). It is intended for
          business information and inquiry handling, not for direct online
          consumer checkout.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <ul className="list-disc space-y-3 pl-5">
          <li>
            Use the site only for lawful purposes and genuine requests about our
            services.
          </li>
          <li>
            Do not attempt to disrupt the site, test its vulnerabilities without
            authorization, or submit misleading information.
          </li>
          <li>
            Do not copy, scrape, or republish content in a way that infringes
            intellectual property or database rights.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Content disclaimer">
        <p>
          We aim to keep the website accurate and current, but service
          descriptions, market references, and availability statements are
          informational only and may change without notice.
        </p>
        <p>
          Nothing on this website guarantees the availability of a specific
          logistics solution or creates a binding offer without separate written
          confirmation.
        </p>
      </LegalSection>

      <LegalSection title="Inquiry submissions">
        <p>
          By submitting the contact form, you confirm that the information you
          provide is accurate and that you are authorized to share it for a
          business inquiry.
        </p>
        <p>
          Submission of the form does not create a contractual relationship. We
          may respond, request more detail, or decline an inquiry at our
          discretion.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Unless stated otherwise, the site design, branding, text, graphics,
          and other original content belong to {COMPANY_INFO.brandName} or are
          used with permission. You may not reproduce them commercially without
          prior written approval.
        </p>
      </LegalSection>

      <LegalSection title="Liability limitation">
        <p>
          To the maximum extent permitted by law, we are not liable for indirect
          losses, loss of profit, loss of opportunity, or interruption arising
          from use of the website or reliance on its informational content.
        </p>
      </LegalSection>

      <LegalSection title="Applicable law">
        <p>
          These terms are governed by the laws applicable in Romania, subject to
          any mandatory consumer or data-protection rules that may apply.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
