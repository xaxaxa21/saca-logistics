"use client";
import React from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  },
);

/** Arc stroke colors (cycles for variety without random re-renders) */
const ARC_COLORS = ["#06b6d4", "#3b82f6", "#6366f1"] as const;

type GlobeArc = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

/** Global business hubs — extra routes are woven between these for a dense “live network” look */
const GLOBE_HUBS = [
  { lat: 22.3193, lng: 114.1694 },
  { lat: 40.7128, lng: -74.006 },
  { lat: 34.0522, lng: -118.2437 },
  { lat: 51.5074, lng: -0.1278 },
  { lat: 48.8566, lng: 2.3522 },
  { lat: 35.6762, lng: 139.6503 },
  { lat: 1.3521, lng: 103.8198 },
  { lat: -33.8688, lng: 151.2069 },
  { lat: 25.2048, lng: 55.2708 },
  { lat: 19.076, lng: 72.8777 },
  { lat: -23.5505, lng: -46.6333 },
  { lat: 19.4326, lng: -99.1332 },
  { lat: -26.2041, lng: 28.0473 },
  { lat: 55.7558, lng: 37.6173 },
  { lat: 41.0082, lng: 28.9784 },
  { lat: 30.0444, lng: 31.2357 },
  { lat: -1.2921, lng: 36.8219 },
  { lat: -6.2088, lng: 106.8456 },
  { lat: 37.5665, lng: 126.978 },
  { lat: 43.6532, lng: -79.3832 },
  { lat: 41.8781, lng: -87.6298 },
  { lat: 25.7617, lng: -80.1918 },
  { lat: 40.4168, lng: -3.7038 },
  { lat: 52.52, lng: 13.405 },
  { lat: 50.1109, lng: 8.6821 },
  { lat: 59.3293, lng: 18.0686 },
  { lat: 52.2297, lng: 21.0122 },
  { lat: 32.0853, lng: 34.7818 },
  { lat: 14.5995, lng: 120.9842 },
  { lat: 13.7563, lng: 100.5018 },
  { lat: 3.139, lng: 101.6869 },
  { lat: 31.2304, lng: 121.4737 },
  { lat: 39.9042, lng: 116.4074 },
  { lat: 28.6139, lng: 77.209 },
  { lat: -37.8136, lng: 144.9631 },
  { lat: 49.2827, lng: -123.1207 },
  { lat: 53.3498, lng: -6.2603 },
  { lat: 60.1699, lng: 24.9384 },
  { lat: -36.8485, lng: 174.7633 },
  { lat: 4.1755, lng: 73.5093 },
  { lat: 24.7136, lng: 46.6753 },
  { lat: 50.4501, lng: 30.5234 },
  { lat: 45.4642, lng: 9.19 },
  { lat: -34.6037, lng: -58.3816 },
  { lat: -12.0464, lng: -77.0428 },
  { lat: 50.0755, lng: 14.4378 },
] as const;

/** Synthetic long-haul routes layered on top of the hand-tuned base arcs */
function buildNetworkArcs(count: number): GlobeArc[] {
  const hubs = GLOBE_HUBS;
  const out: GlobeArc[] = [];
  for (let i = 0; i < count; i++) {
    const ia = (i * 13) % hubs.length;
    const ib = (i * 17 + 11) % hubs.length;
    if (ia === ib) continue;
    const A = hubs[ia];
    const B = hubs[ib];
    out.push({
      order: (i % 32) + 1,
      startLat: A.lat,
      startLng: A.lng,
      endLat: B.lat,
      endLng: B.lng,
      arcAlt: 0.1 + ((i * 3) % 9) * 0.04,
      color: ARC_COLORS[i % ARC_COLORS.length],
    });
  }
  return out;
}

/** Hand-tuned arcs shown alongside generated routes */
const BASE_GLOBE_ARCS: GlobeArc[] = [
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: ARC_COLORS[0],
  },
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: ARC_COLORS[1],
  },
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -1.303396,
    endLng: 36.852443,
    arcAlt: 0.5,
    color: ARC_COLORS[2],
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: ARC_COLORS[0],
  },
  {
    order: 2,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.3,
    color: ARC_COLORS[1],
  },
  {
    order: 2,
    startLat: -15.785493,
    startLng: -47.909029,
    endLat: 36.162809,
    endLng: -115.119411,
    arcAlt: 0.3,
    color: ARC_COLORS[2],
  },
  {
    order: 3,
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: ARC_COLORS[0],
  },
  {
    order: 3,
    startLat: 21.3099,
    startLng: -157.8581,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.3,
    color: ARC_COLORS[1],
  },
  {
    order: 3,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: ARC_COLORS[2],
  },
  {
    order: 4,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.5,
    color: ARC_COLORS[0],
  },
  {
    order: 4,
    startLat: -34.6037,
    startLng: -58.3816,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.7,
    color: ARC_COLORS[1],
  },
  {
    order: 4,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.1,
    color: ARC_COLORS[2],
  },
  {
    order: 5,
    startLat: 14.5995,
    startLng: 120.9842,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: ARC_COLORS[0],
  },
  {
    order: 5,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.2,
    color: ARC_COLORS[1],
  },
  {
    order: 5,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.2,
    color: ARC_COLORS[2],
  },
  {
    order: 6,
    startLat: -15.432563,
    startLng: 28.315853,
    endLat: 1.094136,
    endLng: -63.34546,
    arcAlt: 0.7,
    color: ARC_COLORS[0],
  },
  {
    order: 6,
    startLat: 37.5665,
    startLng: 126.978,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.1,
    color: ARC_COLORS[1],
  },
  {
    order: 6,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: ARC_COLORS[2],
  },
  {
    order: 7,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.1,
    color: ARC_COLORS[0],
  },
  {
    order: 7,
    startLat: 48.8566,
    startLng: -2.3522,
    endLat: 52.52,
    endLng: 13.405,
    arcAlt: 0.1,
    color: ARC_COLORS[1],
  },
  {
    order: 7,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: ARC_COLORS[2],
  },
  {
    order: 8,
    startLat: -8.833221,
    startLng: 13.264837,
    endLat: -33.936138,
    endLng: 18.436529,
    arcAlt: 0.2,
    color: ARC_COLORS[0],
  },
  {
    order: 8,
    startLat: 49.2827,
    startLng: -123.1207,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.2,
    color: ARC_COLORS[1],
  },
  {
    order: 8,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.5,
    color: ARC_COLORS[2],
  },
  {
    order: 9,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: ARC_COLORS[0],
  },
  {
    order: 9,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.7,
    color: ARC_COLORS[1],
  },
  {
    order: 9,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.5,
    color: ARC_COLORS[2],
  },
  {
    order: 10,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: 28.6139,
    endLng: 77.209,
    arcAlt: 0.7,
    color: ARC_COLORS[0],
  },
  {
    order: 10,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.3,
    color: ARC_COLORS[1],
  },
  {
    order: 10,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.3,
    color: ARC_COLORS[2],
  },
  {
    order: 11,
    startLat: 41.9028,
    startLng: 12.4964,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: ARC_COLORS[0],
  },
  {
    order: 11,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.2,
    color: ARC_COLORS[1],
  },
  {
    order: 11,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 1.3521,
    endLng: 103.8198,
    arcAlt: 0.2,
    color: ARC_COLORS[2],
  },
  {
    order: 12,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 37.7749,
    endLng: -122.4194,
    arcAlt: 0.1,
    color: ARC_COLORS[0],
  },
  {
    order: 12,
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.2,
    color: ARC_COLORS[1],
  },
  {
    order: 12,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.3,
    color: ARC_COLORS[2],
  },
  {
    order: 13,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: ARC_COLORS[0],
  },
  {
    order: 13,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.3,
    color: ARC_COLORS[1],
  },
  {
    order: 13,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.1,
    color: ARC_COLORS[2],
  },
  {
    order: 14,
    startLat: -33.936138,
    startLng: 18.436529,
    endLat: 21.395643,
    endLng: 39.883798,
    arcAlt: 0.3,
    color: ARC_COLORS[0],
  },
];

export default function GlobeDemo() {
  // Slower arc dashes + longer ring repeat + fewer stacked rings = calmer hub pulses.
  const globeConfig = {
    pointSize: 5,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1900,
    arcLength: 0.72,
    rings: 1,
    maxRings: 4,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.85,
  };

  const sampleArcs = React.useMemo(
    () => [...BASE_GLOBE_ARCS, ...buildNetworkArcs(96)],
    [],
  );

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 sm:py-20 md:py-28">
      {/* Swiss grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(#124D95 1px, transparent 1px), linear-gradient(90deg, #124D95 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        {/* Desktop: asymmetric 2-col — text left, globe right. Mobile: stacked. */}
        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-12 lg:gap-16">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-20 w-full shrink-0 text-center md:max-w-md md:pt-12 md:text-left lg:max-w-lg lg:pt-20"
          >
            {/* Swiss section label */}
            <span className="mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.28em] text-gray-400">
              03 — Global Reach
            </span>

            <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-[#124D95] sm:text-4xl lg:text-5xl">
              Global Logistics <span className="text-[#3988EA]">Network</span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
              Built by logistics operators with real warehouse leadership
              experience Certified logistics personnel and structured
              operational teams Experience in high‑volume FMCG and retail
              distribution environments Operational governance through SOPs,
              KPIs and continuous improvement
            </p>

            {/* Accent rule */}
            <div className="mx-auto mt-6 h-[2px] w-24 bg-[linear-gradient(90deg,#3988EA,transparent)] md:mx-0" />
          </motion.div>

          {/* Globe column */}
          <div className="relative mt-8 w-full max-w-[36rem] sm:mt-10 md:mt-0 md:flex-1">
            <div className="relative h-[20rem] sm:h-[22rem] md:h-[36rem]">
              <World data={sampleArcs} globeConfig={globeConfig} />
            </div>
            {/* Bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white sm:h-32" />
          </div>
        </div>
      </div>
    </section>
  );
}
