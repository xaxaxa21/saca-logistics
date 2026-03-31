import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'

import {
  AnalyticsGate,
  CookieConsentController,
  CookieConsentProvider,
} from '@/components/legal/cookie-consent'
import IntroGate from '@/components/ui/preview-logo'
import './globals.css'

/** GA4 measurement ID shared across layout and consent-mode scripts. */
const GA_ID = 'G-1NWC9S747P'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sacalogistics.com'),
  title: 'SACA Logistics | 3PL, Fulfillment & Global Supply Chain Solutions',
  description: 'From sourcing to shelf – fully managed. Flexible 3PL, fulfillment & global logistics solutions for retail, FMCG and e-commerce. Built by senior operational experts with 12+ years of industry experience.',
  keywords: '3PL logistics, fulfillment solutions, warehouse management, supply chain, e-commerce logistics, FMCG distribution, retail logistics, global freight, Romania logistics',
  authors: [{ name: 'SACA Logistics' }],
  creator: 'SACA Logistics',
  publisher: 'SACA Logistics',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sacalogistics.com',
    siteName: 'SACA Logistics',
    title: 'SACA Logistics | From Sourcing to Shelf – Fully Managed',
    description: 'Flexible 3PL, fulfillment & global logistics solutions for retail, FMCG and e-commerce. Built by senior operational experts with 12+ years of industry experience.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SACA Logistics - 3PL & Fulfillment Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SACA Logistics | 3PL, Fulfillment & Global Logistics',
    description: 'From sourcing to shelf – fully managed logistics solutions for retail, FMCG and e-commerce.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://sacalogistics.com',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  themeColor: '#124D95',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {/*
          Google Consent Mode v2 — must initialise BEFORE gtag.js loads so the tag is
          always detectable by Google (Search Console, GA setup) while data collection
          stays off by default until the visitor explicitly opts in via the cookie banner.
        */}
        <Script id="google-consent-init" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
        `}</Script>

        {/* Always load the gtag.js library so Google can verify the tag is present. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />

        {/* Configure the GA4 property; data is only sent when consent_storage is 'granted'. */}
        <Script id="google-analytics-config" strategy="afterInteractive">{`
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>

        {/* Mount consent once at the root so every route shares the same privacy state. */}
        <CookieConsentProvider>
          <IntroGate>{children}</IntroGate>
          <CookieConsentController />
          <AnalyticsGate />
        </CookieConsentProvider>
      </body>
    </html>
  )
}
