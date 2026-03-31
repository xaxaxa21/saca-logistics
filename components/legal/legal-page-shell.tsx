import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

import { ComplianceLogos } from '@/components/legal/compliance-logos'
import { CookieSettingsButton } from '@/components/legal/cookie-consent'
import { COMPANY_INFO, LEGAL_NAV_ITEMS } from '@/lib/legal'

export function LegalPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_38%,#f7f9fc_100%)] text-slate-900">
      <section className="border-b border-slate-200 bg-[#071018] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              {/* The hero keeps legal routes readable and fast without reusing the animated homepage shell. */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to homepage
              </Link>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#9bcbff]">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 lg:max-w-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#3988EA]/20 p-3 text-[#9bcbff]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Data controller
                  </p>
                  <p className="text-sm text-white/70">
                    {COMPANY_INFO.brandName} ({COMPANY_INFO.legalName})
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-white/72">
                <p>{COMPANY_INFO.city}</p>
                <p>{COMPANY_INFO.email}</p>
                <p>{COMPANY_INFO.phone}</p>
              </div>
            </div>
          </div>

          <nav
            aria-label="Legal navigation"
            className="flex flex-wrap items-center gap-3"
          >
            {LEGAL_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <CookieSettingsButton className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/78 transition hover:bg-white/10 hover:text-white">
              Cookie settings
            </CookieSettingsButton>
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="space-y-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-8">
            {children}
          </article>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#124D95]">
                Need a privacy contact?
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Email {COMPANY_INFO.privacyContact} to exercise GDPR rights,
                withdraw analytics consent, or ask for more detail about data
                handling.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[#124D95]">
                Compliance references
              </p>
              <ComplianceLogos className="mt-4" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export function LegalSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="space-y-4 text-[15px] leading-7 text-slate-600">
        {children}
      </div>
    </section>
  )
}
