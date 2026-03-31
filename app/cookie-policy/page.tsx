import type { Metadata } from 'next'

import { LegalPageShell, LegalSection } from '@/components/legal/legal-page-shell'
import { LEGAL_POLICY_VERSION } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Cookie Policy | SACA Logistics',
  description:
    'Detailed explanation of necessary cookies, analytics cookies, and how to manage consent on SACA Logistics.',
}

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Cookie Policy"
      title="How cookies and tracking choices work"
      description="This page explains which categories of cookies or similar technologies may be used on this website, which ones are always required, and how visitors can change their consent settings."
    >
      <LegalSection title="Consent model">
        <p>
          This website uses a strict opt-in approach for optional analytics.
          Non-essential analytics stay disabled until you actively choose{' '}
          <strong>Accept all</strong> or enable analytics in the cookie settings
          drawer.
        </p>
        <p>
          The current policy version is {LEGAL_POLICY_VERSION}. We store your
          latest consent selection so the site can remember your preference.
        </p>
      </LegalSection>

      <LegalSection title="Necessary technologies">
        <p>
          Necessary storage is used to preserve core site behavior, accessibility
          and the consent record itself. These technologies do not require
          separate consent because they are needed for the service to operate as
          expected.
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>Remembering whether you already answered the cookie prompt.</li>
          <li>Keeping the website secure and technically available.</li>
          <li>Supporting user-interface state that is required for the app.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Analytics technologies">
        <p>
          Analytics is an optional category used to understand aggregate traffic
          and improve the website. It is currently reserved for Vercel Analytics
          and is only loaded after explicit consent.
        </p>
        <p>
          If additional analytics or tag-management tools are added later, they
          will remain off until consent is granted and this policy will be
          updated before activation.
        </p>
      </LegalSection>

      <LegalSection title="How to change your choice">
        <p>
          You can reopen the cookie settings drawer at any time from the footer
          or the legal pages. You may:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>Accept all optional analytics.</li>
          <li>Keep only essential storage enabled.</li>
          <li>Deny optional technologies entirely.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Browser controls">
        <p>
          Most browsers also allow you to clear cookies, block future storage,
          or notify you when cookies are being set. Blocking necessary storage
          may reduce site functionality.
        </p>
      </LegalSection>
    </LegalPageShell>
  )
}
