'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Cookie, ShieldCheck, SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { LEGAL_POLICY_VERSION } from '@/lib/legal'
import { cn } from '@/lib/utils'

type ConsentMode = 'accepted-all' | 'essential-only' | 'denied-optional'

type ConsentPreferences = {
  necessary: true
  analytics: boolean
  mode: ConsentMode
  policyVersion: string
  savedAt: string
}

type ConsentContextValue = {
  preferences: ConsentPreferences | null
  isLoaded: boolean
  shouldPrompt: boolean
  isDrawerOpen: boolean
  analyticsEnabled: boolean
  openSettings: () => void
  closeSettings: () => void
  acceptAll: () => void
  essentialOnly: () => void
  denyOptional: () => void
  saveAnalyticsPreference: (enabled: boolean) => void
}

const CONSENT_STORAGE_KEY = 'saca.cookieConsent'
const CONSENT_COOKIE_NAME = 'saca_cookie_consent'
const OPEN_SETTINGS_EVENT = 'saca:open-cookie-settings'

/** GA4 measurement ID — loaded only when the visitor opts in to analytics (see AnalyticsGate). */
const GA_MEASUREMENT_ID = 'G-1NWC9S747P'

const CookieConsentContext = createContext<ConsentContextValue | null>(null)

function buildPreferences(mode: ConsentMode): ConsentPreferences {
  return {
    necessary: true,
    analytics: mode === 'accepted-all',
    mode,
    policyVersion: LEGAL_POLICY_VERSION,
    savedAt: new Date().toISOString(),
  }
}

function persistPreferences(preferences: ConsentPreferences) {
  // Store the full payload locally for client-side preference checks.
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences))

  // Mirror the high-level choice in a cookie so non-JS tooling can inspect it later if needed.
  const maxAge = 60 * 60 * 24 * 180
  const encodedValue = encodeURIComponent(preferences.mode)
  const secureAttribute = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodedValue}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secureAttribute}`
}

function readPreferences(): ConsentPreferences | null {
  const storedValue = window.localStorage.getItem(CONSENT_STORAGE_KEY)

  if (!storedValue) {
    return null
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<ConsentPreferences>

    if (
      parsed.necessary !== true ||
      typeof parsed.analytics !== 'boolean' ||
      (parsed.mode !== 'accepted-all' &&
        parsed.mode !== 'essential-only' &&
        parsed.mode !== 'denied-optional') ||
      typeof parsed.savedAt !== 'string'
    ) {
      return null
    }

    return {
      necessary: true,
      analytics: parsed.analytics,
      mode: parsed.mode,
      policyVersion:
        typeof parsed.policyVersion === 'string'
          ? parsed.policyVersion
          : LEGAL_POLICY_VERSION,
      savedAt: parsed.savedAt,
    }
  } catch {
    return null
  }
}

function CookieConsentInner() {
  const consent = useCookieConsent()
  const [analyticsToggle, setAnalyticsToggle] = useState(
    consent.preferences?.analytics ?? false,
  )

  useEffect(() => {
    setAnalyticsToggle(consent.preferences?.analytics ?? false)
  }, [consent.preferences])

  if (!consent.isLoaded) {
    return null
  }

  return (
    <>
      {consent.shouldPrompt ? (
        <section
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-70 border-t border-white/10 bg-[rgba(7,16,24,0.94)] px-4 py-4 text-white shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {/* Keep the first-visit prompt short and scannable for better acceptance UX on mobile. */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                <Cookie className="h-3.5 w-3.5" />
                Cookie preferences
              </div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Choose how this site uses cookies and analytics
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/72 sm:text-[15px]">
                We only enable non-essential analytics after explicit consent.
                Necessary storage keeps the site secure and your consent choice
                remembered. See the{' '}
                <Link
                  href="/cookie-policy"
                  className="font-medium text-[#7db7ff] underline-offset-4 hover:underline"
                >
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-[#7db7ff] underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:max-w-[520px] lg:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={consent.denyOptional}
                className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white hover:text-[#124D95]"
              >
                Deny optional
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={consent.essentialOnly}
                className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white hover:text-[#124D95]"
              >
                Essential only
              </Button>
              <Button
                type="button"
                onClick={consent.acceptAll}
                className="h-11 bg-[#3988EA] px-5 text-white hover:bg-[#2f73c7]"
              >
                Accept all
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={consent.openSettings}
                className="h-11 justify-start px-2 text-white/75 hover:bg-transparent hover:text-white sm:justify-center"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      <Drawer
        open={consent.isDrawerOpen}
        onOpenChange={(open) => (open ? consent.openSettings() : consent.closeSettings())}
      >
        <DrawerContent className="border-white/10 bg-[#071018] text-white">
          <DrawerHeader className="mx-auto w-full max-w-3xl px-4 pt-5 sm:px-6">
            {/* The drawer mirrors the stored state so visitors can revise consent at any time. */}
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              <ShieldCheck className="h-3.5 w-3.5" />
              Cookie settings
            </div>
            <DrawerTitle className="text-left text-2xl text-white">
              Manage privacy choices
            </DrawerTitle>
            <DrawerDescription className="text-left leading-6 text-white/65">
              Necessary storage stays enabled so the website can function and
              remember your consent decision. Optional analytics remain disabled
              until you allow them.
            </DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto grid w-full max-w-3xl gap-4 px-4 pb-2 sm:px-6">
            <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Strictly necessary
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Required for security, accessibility, and saving your cookie
                    choice.
                  </p>
                </div>
                <span className="inline-flex h-8 items-center rounded-full border border-[#3988EA]/40 bg-[#3988EA]/15 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#9bcbff]">
                  Always active
                </span>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <label className="flex cursor-pointer items-start gap-4">
                <Checkbox
                  checked={analyticsToggle}
                  onCheckedChange={(checked) => setAnalyticsToggle(checked === true)}
                  aria-label="Allow analytics cookies"
                  className={cn(
                    'mt-1 border-white/30',
                    analyticsToggle ? 'bg-[#3988EA] text-white' : 'bg-transparent',
                  )}
                />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Analytics
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Measures site usage with Vercel Analytics and Google
                    Analytics (gtag.js). This category is disabled by default and
                    only turns on after you opt in.
                  </p>
                </div>
              </label>
            </article>
          </div>

          <DrawerFooter className="mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={() => consent.saveAnalyticsPreference(analyticsToggle)}
                  className="min-w-[160px] bg-[#3988EA] text-white hover:bg-[#2f73c7]"
                >
                  Save preferences
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={consent.acceptAll}
                  className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-[#124D95]"
                >
                  Accept all
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={consent.denyOptional}
                  className="border-white/20 bg-white/5 text-white hover:bg-white hover:text-[#124D95]"
                >
                  Deny optional
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/65">
                <Link href="/cookie-policy" className="hover:text-white">
                  Cookie Policy
                </Link>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export function CookieConsentProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const stored = readPreferences()
    setPreferences(stored)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const openSettings = () => setIsDrawerOpen(true)

    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings)
  }, [])

  const savePreferences = useCallback((nextPreferences: ConsentPreferences) => {
    persistPreferences(nextPreferences)
    setPreferences(nextPreferences)
    setIsDrawerOpen(false)
  }, [])

  const acceptAll = useCallback(() => {
    savePreferences(buildPreferences('accepted-all'))
  }, [savePreferences])

  const essentialOnly = useCallback(() => {
    savePreferences(buildPreferences('essential-only'))
  }, [savePreferences])

  const denyOptional = useCallback(() => {
    savePreferences(buildPreferences('denied-optional'))
  }, [savePreferences])

  const saveAnalyticsPreference = useCallback(
    (enabled: boolean) => {
      savePreferences(buildPreferences(enabled ? 'accepted-all' : 'essential-only'))
    },
    [savePreferences],
  )

  const value = useMemo<ConsentContextValue>(
    () => ({
      preferences,
      isLoaded,
      shouldPrompt: isLoaded && preferences === null,
      isDrawerOpen,
      analyticsEnabled: preferences?.analytics === true,
      openSettings: () => setIsDrawerOpen(true),
      closeSettings: () => setIsDrawerOpen(false),
      acceptAll,
      essentialOnly,
      denyOptional,
      saveAnalyticsPreference,
    }),
    [
      acceptAll,
      denyOptional,
      essentialOnly,
      isDrawerOpen,
      isLoaded,
      preferences,
      saveAnalyticsPreference,
    ],
  )

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function CookieConsentController() {
  return <CookieConsentInner />
}

export function CookieSettingsButton({
  className,
  children = 'Cookie settings',
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
      className={className}
    >
      {children}
    </button>
  )
}

export function AnalyticsGate() {
  const { analyticsEnabled, isLoaded } = useCookieConsent()

  // Do not mount optional analytics until the client has loaded and explicit consent exists.
  if (!isLoaded || !analyticsEnabled) {
    return null
  }

  return (
    <>
      {/* Google Analytics (gtag.js) — same consent gate as Vercel Analytics. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Analytics />
    </>
  )
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext)

  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }

  return context
}
