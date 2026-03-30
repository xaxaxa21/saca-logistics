"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Package,
  RotateCcw,
  Warehouse,
  ArrowDownToLine,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Zone {
  id: string;
  name: string;
  color: string;
  items: string[];
  icon: LucideIcon;
}

const zones: Zone[] = [
  {
    id: "inbound",
    name: "Inbound",
    color: "#F5A623",
    icon: ArrowDownToLine,
    items: ["Reception & QC", "Labeling / Compliance", "Mezzanine Area"],
  },
  {
    id: "storage",
    name: "Storage & Replenishment",
    color: "#3988EA",
    icon: Layers,
    items: [
      "High Pallet Racking",
      "Pallet Storage and Overflow",
      "Replenishment Area",
    ],
  },
  {
    id: "fulfillment",
    name: "Fulfillment",
    color: "#124D95",
    icon: Package,
    items: ["Picking Zone", "Packing / Co-packing", "Value Added Services"],
  },
  {
    id: "outbound",
    name: "Outbound & Dispatch",
    color: "#F5A623",
    icon: RotateCcw,
    items: ["Loading Docks", "Staging Area", "Fleet Management"],
  },
];

const scaleSteps = [
  { value: "500", label: "Starter footprint", accent: "#F5A623" },
  { value: "750", label: "Flexible expansion", accent: "#3988EA" },
  { value: "1,000", label: "Growing operations", accent: "#124D95" },
  { value: "2,500", label: "Multi-flow handling", accent: "#3988EA" },
  { value: "5,000", label: "Structured warehouse scale", accent: "#124D95" },
  { value: "7,500", label: "High-volume readiness", accent: "#3988EA" },
  { value: "10,000", label: "Full operational capacity", accent: "#F5A623" },
];

export const InfrastructureSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".infra-badge",
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".infra-title",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".infra-title-word",
        { opacity: 0, y: 42, rotateX: -28, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".infra-title",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".infra-subtitle",
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".infra-title",
            start: "top 76%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".scale-panel",
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".scale-panel",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".scale-step",
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".scale-track",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".zones-grid .zone-card",
        { opacity: 0, y: 36, rotateY: -4 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".zones-grid",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.to(".infra-bg-shape-1", {
        y: -24,
        x: 16,
        rotation: 8,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".infra-bg-shape-2", {
        y: 18,
        x: -18,
        rotation: -6,
        duration: 8.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const stepEls = gsap.utils.toArray<HTMLElement>(".scale-step");
      if (stepEls.length) {
        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 0.6,
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ".scale-panel",
            start: "top 80%",
          },
        });

        stepEls.forEach((el, i) => {
          tl.call(() => setActiveStep(i))
            .to(
              el,
              {
                y: -6,
                boxShadow: "0 16px 40px rgba(18,77,149,0.16)",
                duration: 0.35,
              },
              0,
            )
            .to(
              ".scale-progress-fill",
              {
                width: `${((i + 1) / stepEls.length) * 100}%`,
                duration: 0.55,
              },
              "<",
            )
            .to(
              el,
              {
                y: 0,
                boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
                duration: 0.35,
              },
              "+=0.35",
            );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="infrastructure"
      className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="infra-bg-shape-1 absolute right-16 top-20 h-[380px] w-[380px] rounded-full bg-[#3988EA]/5 blur-[100px]" />
        <div className="infra-bg-shape-2 absolute bottom-16 left-10 h-[460px] w-[460px] rounded-full bg-[#124D95]/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(#124D95 1px, transparent 1px), linear-gradient(90deg, #124D95 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div
          className="infra-title mx-auto mb-16 max-w-4xl text-center lg:mb-20"
          style={{ perspective: "1000px" }}
        >
          <span className="infra-badge mb-8 inline-flex items-center gap-2 rounded-full border border-[#3988EA]/20 bg-[#3988EA]/10 px-5 py-2.5 text-sm font-semibold text-[#3988EA]">
            <Warehouse className="h-4 w-4" />
            Warehouse & Infrastructure
          </span>

          <h2 className="mb-8 text-4xl font-bold leading-tight text-[#124D95] md:text-5xl lg:text-6xl">
            <span className="infra-title-word inline-block">From</span>{" "}
            <span className="infra-title-word inline-block text-[#3988EA]">
              500
            </span>{" "}
            <span className="infra-title-word inline-block">to</span>{" "}
            <span className="infra-title-word inline-block text-[#3988EA]">
              10,000
            </span>{" "}
            <span className="infra-title-word inline-block">m²</span>{" "}
            <span className="infra-title-word inline-block">as</span>{" "}
            <span className="infra-title-word inline-block">your</span>{" "}
            <span className="infra-title-word inline-block text-[#3988EA]">
              operation
            </span>{" "}
            <span className="infra-title-word inline-block text-[#3988EA]">
              grows
            </span>
          </h2>

          <p className="infra-subtitle mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 lg:text-xl">
            We scale warehouse footprint around your real operational needs —
            starting lean, expanding fast, and structuring space for inbound,
            storage, fulfillment, value added services and dispatch.
          </p>
        </div>

        {/* Scale growth panel */}
        <div className="scale-panel relative mb-18 overflow-hidden rounded-[28px] border border-gray-200 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-7 lg:mb-20 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,136,234,0.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(245,166,35,0.08),transparent_24%)]" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#124D95]/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#124D95]">
                Flexible capacity model
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <h3 className="mt-5 text-2xl font-bold leading-tight text-[#124D95] sm:text-3xl lg:text-4xl">
                Start with the space you need today.
                <br className="hidden sm:block" />
                Expand when volume demands it.
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                Instead of forcing one fixed footprint, we structure capacity in
                stages. That means a cleaner cost base at launch and a smoother
                path toward larger pallet storage, e-commerce pick density and
                outbound throughput.
              </p>

              <div className="mt-6 rounded-2xl border border-[#3988EA]/15 bg-[#F8FBFF] p-4 sm:p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3988EA]">
                  Current highlight
                </div>
                <div className="mt-2 flex items-end gap-2">
                  <span
                    className="text-4xl font-bold leading-none sm:text-5xl"
                    style={{ color: scaleSteps[activeStep].accent }}
                  >
                    {scaleSteps[activeStep].value}
                  </span>
                  <span className="mb-1 text-sm font-semibold text-[#124D95] sm:text-base">
                    m²
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {scaleSteps[activeStep].label}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#124D95] sm:text-base">
                    Capacity roadmap
                  </p>
                  <p className="text-xs text-gray-500 sm:text-sm">
                    Structured steps from launch to full-scale operations
                  </p>
                </div>
                <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500">
                  500 → 10,000 m²
                </div>
              </div>

              <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#124D95]/8">
                <div className="scale-progress-fill h-full w-0 rounded-full bg-[linear-gradient(90deg,#F5A623_0%,#3988EA_45%,#124D95_100%)]" />
              </div>

              <div className="scale-track grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {scaleSteps.map((step, index) => (
                  <div
                    key={step.value}
                    className={`scale-step rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                      index === activeStep
                        ? "border-transparent bg-white shadow-[0_16px_40px_rgba(18,77,149,0.12)]"
                        : "border-gray-200 bg-white/70 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                    }`}
                  >
                    <div
                      className="mb-3 h-1.5 w-12 rounded-full"
                      style={{ backgroundColor: step.accent }}
                    />
                    <div
                      className="text-2xl font-bold sm:text-3xl"
                      style={{ color: step.accent }}
                    >
                      {step.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#124D95]">
                      m²
                    </div>
                    <p className="mt-3 text-xs leading-5 text-gray-600 sm:text-sm">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Zone Highlights */}
        <div className="zones-grid" style={{ perspective: "1000px" }}>
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold text-[#124D95] lg:text-4xl">
              Zone <span className="text-[#3988EA]">Highlights</span>
            </h3>
            <p className="text-gray-600">
              Organized for maximum operational efficiency at every scale
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {zones.map((zone) => {
              const Icon = zone.icon;

              return (
                <div
                  key={zone.id}
                  className="zone-card group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
                  style={{ transformStyle: "preserve-3d" }}
                  onMouseEnter={() => setActiveZone(zone.id)}
                  onMouseLeave={() => setActiveZone(null)}
                >
                  <div
                    className="absolute left-0 right-0 top-0 h-1"
                    style={{ backgroundColor: zone.color }}
                  />

                  <div
                    className="mb-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: zone.color }}
                  >
                    <Icon className="h-4 w-4" />
                    {zone.name}
                  </div>

                  <ul className="space-y-3">
                    {zone.items.map((item, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                          activeZone === zone.id
                            ? "translate-x-1 text-[#124D95]"
                            : "text-gray-600"
                        }`}
                      >
                        <span
                          className="h-2 w-2 flex-shrink-0 rounded-full transition-transform duration-300"
                          style={{
                            backgroundColor: zone.color,
                            transform:
                              activeZone === zone.id
                                ? "scale(1.3)"
                                : "scale(1)",
                          }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(135deg, ${zone.color}08 0%, transparent 50%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
