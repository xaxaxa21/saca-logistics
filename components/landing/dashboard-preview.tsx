"use client";

import Image from "next/image";

export function DashboardPreviewSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-[#f6f9ff] to-white py-16 sm:py-20 lg:py-24">
      {/* Soft background accents keep the section visually connected to the brand palette. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-[#3988EA]/10 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute -right-16 bottom-4 h-64 w-64 rounded-full bg-[#124D95]/10 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        {/* Minimal copy prioritizes visual storytelling while preserving context. */}
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 lg:mb-12">
          <p className="mb-4 inline-flex rounded-full border border-[#3988EA]/20 bg-[#3988EA]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#124D95]">
            Client dashboard preview
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#124D95] sm:text-4xl lg:text-5xl">
            Visibility your teams can act on
          </h2>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            Live stocks, order status and operational detail in one view.
          </p>
        </div>

        {/* Mobile-first stack becomes a balanced two-column gallery on larger screens. */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="group relative overflow-hidden rounded-2xl border border-[#124D95]/10 bg-white shadow-[0_18px_50px_rgba(18,77,149,0.12)]">
            {/* Fixed ratio avoids CLS and keeps predictable rendering across devices. */}
            <div className="relative aspect-4/3 sm:aspect-16/10">
              <Image
                src="/sacapan.jpeg"
                alt="Dashboard preview showing stock and operational metrics"
                fill
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, (min-width: 640px) 88vw, 94vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-2xl border border-[#124D95]/10 bg-white shadow-[0_18px_50px_rgba(18,77,149,0.12)]">
            {/* Second render uses the same layout rules for consistent responsive behavior. */}
            <div className="relative aspect-4/3 sm:aspect-16/10">
              <Image
                src="/scapan2.jpeg"
                alt="Dashboard preview with detailed inventory and fulfillment insights"
                fill
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) 46vw, (min-width: 640px) 88vw, 94vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
