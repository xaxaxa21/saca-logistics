"use client";

import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ServiceCardData } from "@/lib/services-cards-data";

type ServiceCardViewProps = {
  service: ServiceCardData;
  /** 0-based index for the large number badge */
  index: number;
  onCtaClick?: () => void;
  titleId?: string;
  /** When false, image column is always on top (modal layout) */
  alternateLayout?: boolean;
  className?: string;
  /**
   * section: use .svc-card classes for GSAP ScrollTrigger in #services.
   * modal: use .svc-modal-* so hub modal is not animated by the section.
   */
  variant?: "section" | "modal";
};

/**
 * Presentational service card matching the Services section design.
 */
export function ServiceCardView({
  service,
  index,
  onCtaClick,
  titleId,
  alternateLayout = true,
  className,
  variant = "modal",
}: ServiceCardViewProps) {
  const Icon = service.icon;
  const isEven = index % 2 === 0;
  const isSection = variant === "section";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl bg-white/[0.07] shadow-lg shadow-black/10 backdrop-blur-sm md:rounded-3xl",
        isSection ? "svc-card" : "svc-modal-card",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-stretch",
          alternateLayout && !isEven && "md:flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "relative aspect-16/10 w-full shrink-0 overflow-hidden md:aspect-auto md:w-[45%]",
            isSection ? "svc-card-img" : "svc-modal-img",
          )}
        >
          <Image
            src={service.image}
            alt={`${service.title} — photography`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 540px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-black/10" />

          <div className="absolute bottom-4 right-4 flex items-center gap-2 md:bottom-6 md:right-6">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg backdrop-blur-md md:h-12 md:w-12 md:text-base"
              style={{ backgroundColor: `${service.color}CC` }}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-mono text-3xl font-bold text-white/30 md:text-4xl">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">
          <div
            className={cn(
              "mb-4 h-[2px] w-16 origin-left md:mb-5",
              isSection ? "svc-card-rule" : "svc-modal-rule",
            )}
            style={{
              background: `linear-gradient(90deg, ${service.color}, transparent)`,
            }}
          />

          <h3
            id={titleId}
            className={cn(
              "mb-2 text-xl font-bold text-white sm:text-2xl md:text-3xl",
              isSection ? "svc-card-anim" : "svc-modal-title",
            )}
          >
            {service.title}
          </h3>

          <p
            className={cn(
              "mb-6 text-sm leading-relaxed text-white/70 md:text-base",
              isSection && "svc-card-anim",
            )}
          >
            {service.subtitle}
          </p>

          <ul
            className={cn(
              "mb-8 grid gap-3 text-sm text-white/80 sm:grid-cols-2 md:gap-4",
              isSection ? "svc-card-anim" : "svc-modal-features",
            )}
          >
            {service.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <CheckCircle className="h-3.5 w-3.5 text-white/70" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className={cn(isSection ? "svc-card-anim" : "svc-modal-cta")}>
            <Button
              type="button"
              className={cn(
                "w-full rounded-xl bg-linear-to-r px-8 py-5 font-semibold text-white transition-all hover:opacity-90 hover:shadow-xl sm:w-auto",
                service.gradient,
              )}
              onClick={onCtaClick}
            >
              <span className="flex items-center justify-center gap-2">
                Learn more
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
