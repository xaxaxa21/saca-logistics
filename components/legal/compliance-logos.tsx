import Image from 'next/image'

import { COMPLIANCE_LOGOS } from '@/lib/legal'

export function ComplianceLogos({
  className = '',
}: {
  className?: string
}) {
  return (
    <div className={className}>
      {/* Keep trust assets lightweight and responsive so they reinforce compliance without crowding the layout. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {COMPLIANCE_LOGOS.map((logo) => (
          <div
            key={logo.src}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="relative h-12 w-20 shrink-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
            <p className="text-sm leading-5 text-slate-600">{logo.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
