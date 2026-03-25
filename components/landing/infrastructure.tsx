// Optimized InfrastructureSection component without an image.
// This version removes the static Image component and instead renders
// descriptive text about the 10,000 m² warehouse layout. It also cleans up
// unused imports and simplifies the animation logic where appropriate.

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideIcon } from "lucide-react";
import {
  Maximize2,
  Layers,
  ShoppingBag,
  Users,
  Truck,
  ArrowDownToLine,
  Package,
  RotateCcw,
  Warehouse,
} from "lucide-react";

// Register the GSAP ScrollTrigger plugin once at module scope.
gsap.registerPlugin(ScrollTrigger);

// Types for metrics and zones
interface Metric {
  icon: LucideIcon;
  value: string;
  unit: string;
  label: string;
  color: string;
}

interface Zone {
  id: string;
  name: string;
  color: string;
  items: string[];
}

// Define our key metrics for the warehouse. The `color` property is used for
// styling the cards and hover effects.
const metrics: Metric[] = [
  {
    icon: Maximize2,
    value: "10,000",
    unit: "m²",
    label: "Capacity",
    color: "#3988EA",
  },
  {
    icon: Layers,
    value: "7,000-8,000",
    unit: "",
    label: "Pallet Positions",
    color: "#124D95",
  },
  {
    icon: ShoppingBag,
    value: "150",
    unit: "",
    label: "E-commerce Pick Lines",
    color: "#F5A623",
  },
  {
    icon: Users,
    value: "60-80",
    unit: "",
    label: "Operators",
    color: "#3988EA",
  },
  {
    icon: Truck,
    value: "6",
    unit: "",
    label: "Loading Docks",
    color: "#124D95",
  },
];

// Define the operational zones within the warehouse along with their
// descriptions and accent colours. These are used in the zone cards below.
const zones: Zone[] = [
  {
    id: "inbound",
    name: "Inbound",
    color: "#F5A623",
    items: ["Reception & QC", "Labeling / Compliance", "Mezzanine Area"],
  },
  {
    id: "storage",
    name: "Storage & Replenishment",
    color: "#3988EA",
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
    items: ["Picking Zone", "Packing / Co-packing", "Value Added Services"],
  },
  {
    id: "outbound",
    name: "Outbound & Dispatch",
    color: "#F5A623",
    items: ["Loading Docks", "Staging Area", "Fleet Management"],
  },
];

export const InfrastructureSection: React.FC = () => {
  // Set up references and state for the animated counters and hover effects.
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>(
    {},
  );
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  useEffect(() => {
    // Encapsulate GSAP animations within a context, so they can be
    // reverted cleanly when the component unmounts or dependencies change.
    const ctx = gsap.context(() => {
      // Badge entrance
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

      // Title words animation
      gsap.fromTo(
        ".infra-title-word",
        { opacity: 0, y: 50, rotateX: -30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".infra-title",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Subtitle blur reveal
      gsap.fromTo(
        ".infra-subtitle",
        { opacity: 0, y: 30, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".infra-title",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Metrics counter animation
      ScrollTrigger.create({
        trigger: ".metrics-grid",
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated) {
            setHasAnimated(true);
            metrics.forEach((metric, index) => {
              const numericValue = parseInt(
                metric.value.replace(/[,-]/g, ""),
                10,
              );
              const obj = { value: 0 };
              gsap.to(obj, {
                value: numericValue,
                duration: 2.5,
                ease: "power2.out",
                delay: index * 0.15,
                onUpdate: () => {
                  setAnimatedValues((prev) => ({
                    ...prev,
                    [metric.label]: Math.floor(obj.value),
                  }));
                },
              });
            });
          }
        },
      });

      // Metric cards stagger entrance
      gsap.fromTo(
        ".metric-card",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".metrics-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Zone cards stagger
      gsap.fromTo(
        ".zone-card",
        { opacity: 0, x: -40, rotateY: -5 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".zones-grid",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Background shapes floating
      gsap.to(".infra-bg-shape-1", {
        y: -25,
        x: 15,
        rotation: 8,
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".infra-bg-shape-2", {
        y: 20,
        x: -20,
        rotation: -6,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hasAnimated]);

  // Format values for display; if the animated value is defined we use it,
  // otherwise fallback to the original formatted string. Pallet positions are
  // displayed as-is because they are a range and not animated.
  const formatValue = (metric: Metric): string => {
    if (metric.label === "Pallet Positions") return metric.value;
    const animated = animatedValues[metric.label] || 0;
    return animated.toLocaleString();
  };

  return (
    <section
      ref={sectionRef}
      id="infrastructure"
      className="relative py-28 lg:py-36 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="infra-bg-shape-1 absolute top-20 right-20 w-[400px] h-[400px] bg-[#3988EA]/5 rounded-full blur-[100px]" />
        <div className="infra-bg-shape-2 absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#124D95]/5 rounded-full blur-[120px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(#124D95 1px, transparent 1px),
              linear-gradient(90deg, #124D95 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className="infra-title max-w-4xl mx-auto text-center mb-20"
          style={{ perspective: "1000px" }}
        >
          <span className="infra-badge inline-flex items-center gap-2 bg-[#3988EA]/10 text-[#3988EA] px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-[#3988EA]/20">
            <Warehouse className="w-4 h-4" />
            Warehouse & Infrastructure
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#124D95] mb-8 leading-tight">
            <span className="infra-title-word inline-block">Warehouse</span>{" "}
            <span className="infra-title-word inline-block">Layout</span>{" "}
            <span className="infra-title-word inline-block">–</span>{" "}
            <span className="infra-title-word inline-block text-[#3988EA]">
              10,000
            </span>{" "}
            <span className="infra-title-word inline-block text-[#3988EA]">
              m²
            </span>{" "}
            <span className="infra-title-word inline-block text-[#3988EA]">
              Capacity
            </span>
          </h2>
          <p className="infra-subtitle text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Optimized for pallet logistics, e‑commerce fulfillment and value
            added services. Modern infrastructure designed for operational
            excellence.
          </p>
        </div>

        {/* Warehouse description box (replaces image) */}
        <div
          className="relative mb-20 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 group bg-white flex items-center justify-center"
          style={{ perspective: "1000px", minHeight: "320px" }}
        >
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#124D95]/60 via-[#124D95]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Corner accent */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#3988EA] via-[#F5A623] to-[#124D95]" />
          {/* Text content */}
          <div className="relative z-10 p-10 text-center">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#124D95] mb-4">
              10,000 m² Warehouse Layout
            </h3>
            <p className="text-gray-600 text-lg lg:text-xl max-w-2xl mx-auto">
              Our state‑of‑the‑art warehouse spans 10,000 square metres,
              providing the capacity and flexibility needed for modern supply
              chains. Purpose‑built zones streamline inbound reception, storage,
              fulfillment and outbound dispatch for operational excellence.
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-20">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="metric-card relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#3988EA]/10 transition-all duration-500 group text-center overflow-hidden"
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${metric.color}10 0%, transparent 70%)`,
                }}
              />
              <div
                className="relative z-10 w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${metric.color}20 0%, ${metric.color}10 100%)`,
                }}
              >
                <metric.icon
                  className="w-7 h-7 transition-colors duration-500"
                  style={{ color: metric.color }}
                />
              </div>
              <div className="relative z-10 text-3xl lg:text-4xl font-bold text-[#124D95] mb-2 counter">
                {formatValue(metric)}
                <span style={{ color: metric.color }}>{metric.unit}</span>
              </div>
              <p className="relative z-10 text-sm text-gray-600">
                {metric.label}
              </p>
              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 group-hover:w-3/4 transition-all duration-500 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
            </div>
          ))}
        </div>

        {/* Zone Highlights */}
        <div className="zones-grid" style={{ perspective: "1000px" }}>
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-[#124D95] mb-4">
              Zone <span className="text-[#3988EA]">Highlights</span>
            </h3>
            <p className="text-gray-600">
              Organized for maximum operational efficiency
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="zone-card relative bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group cursor-pointer overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
                onMouseEnter={() => setActiveZone(zone.id)}
                onMouseLeave={() => setActiveZone(null)}
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: zone.color }}
                />
                {/* Zone header */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white mb-6"
                  style={{ backgroundColor: zone.color }}
                >
                  {zone.id === "inbound" && (
                    <ArrowDownToLine className="w-4 h-4" />
                  )}
                  {zone.id === "storage" && <Layers className="w-4 h-4" />}
                  {zone.id === "fulfillment" && <Package className="w-4 h-4" />}
                  {zone.id === "outbound" && <RotateCcw className="w-4 h-4" />}
                  {zone.name}
                </div>
                {/* Zone items */}
                <ul className="space-y-3">
                  {zone.items.map((item, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                        activeZone === zone.id
                          ? "text-[#124D95] translate-x-1"
                          : "text-gray-600"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 transition-transform duration-300"
                        style={{
                          backgroundColor: zone.color,
                          transform:
                            activeZone === zone.id ? "scale(1.3)" : "scale(1)",
                        }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${zone.color}05 0%, transparent 50%)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
