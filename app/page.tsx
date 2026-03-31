"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero";
import { WhyUsSection } from "@/components/landing/why-us";
import { InfrastructureSection } from "@/components/landing/infrastructure";
import { ServiceHubNavProvider } from "@/components/landing/service-hub-nav-context";

import { ContactSection } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";
import { BufferTransition } from "@/components/landing/buffer-transition";
import { CinematicVideoBlock } from "@/components/landing/cinematic-video-block";
import { DashboardPreviewSection } from "@/components/landing/dashboard-preview";
import GlobeDemo from "@/components/globe-demo";
import WServicesSection from "@/components/landing/wservicesx";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollTrigger.config({ ignoreMobileResize: true });

export default function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Desktop-only ScrollSmoother; mobile uses native scroll */
  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const isTouch = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    let smoother: ScrollSmoother | null = null;

    if (!isTouch) {
      smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 0.9,
        smoothTouch: false,
        effects: true,
        normalizeScroll: true,
        ease: "expo",
      });
    }

    return () => {
      smoother?.kill();
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);

  return (
    <ServiceHubNavProvider>
      <Header />

      <div id="smooth-wrapper" ref={wrapperRef} className="overflow-x-clip">
        <div id="smooth-content" ref={contentRef}>
          <main className="relative min-h-screen overflow-x-clip bg-white">
            <HeroSection />
            <BufferTransition />
            <GlobeDemo />

            {/* Warehouse cinematic video */}
            <div className="relative bg-[#124D95]">
              {/* Grid overlay matching Services section */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
              <div className="relative z-10 mx-auto max-w-[1240px] px-4 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-14 lg:px-16 lg:pb-12 lg:pt-16">
                <div className="mb-4 flex items-center justify-between gap-4 sm:mb-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/60">
                    Live warehouse orchestration
                  </p>
                  <div className="h-[2px] w-20 bg-linear-to-r from-white/40 to-transparent sm:w-40" />
                </div>
              </div>
              <CinematicVideoBlock
                src="/ealistic_cinematic_video_of_a_modern_logistics_warehouse,_based_on_the_reference_images._Tall_pallet_seed2368098061.mp4"
                className="relative z-10 mx-auto aspect-16/10 w-full max-w-[1240px] overflow-hidden rounded-none border-y border-white/15 bg-[#0e3d7a] sm:rounded-xl sm:border sm:shadow-[0_24px_80px_rgba(18,77,149,0.35)]"
                videoClassName="scale-[1.03]"
                overlayClassName="bg-[linear-gradient(180deg,rgba(18,77,149,0.22)_0%,rgba(18,77,149,0.08)_36%,rgba(18,77,149,0.52)_100%)]"
                label="Operational expertise"
                title="Real-time execution from inbound to dispatch"
                description="Teams, systems and floor operations move in sync to keep volume high and service quality predictable."
                reveal
                allowAutoplayOnCoarse
                priority="section"
              />
              <div className="relative z-10 mx-auto max-w-[1240px] px-4 pb-10 pt-4 sm:px-10 sm:pb-14 sm:pt-6 lg:px-16 lg:pb-16">
                <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3)_26%,rgba(255,255,255,0.5)_62%,transparent)] opacity-60" />
              </div>
            </div>
            <WServicesSection />

            <WhyUsSection />

            {/* Global shipment cinematic video */}
            <div className="relative bg-[#124D95]">
              {/* Grid overlay matching Services section */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
              <div className="relative z-10 mx-auto max-w-[1240px] px-4 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-14 lg:px-16 lg:pb-12 lg:pt-16">
                <div className="mb-4 flex items-center justify-between gap-4 sm:mb-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/60">
                    Global shipment network
                  </p>
                  <div className="h-[2px] w-20 bg-linear-to-r from-white/40 to-transparent sm:w-40" />
                </div>
              </div>
              <CinematicVideoBlock
                src="/Create_a_realistic_cinematic_global_shipment_logistics_video_for_SACA_Logistics,_showing_an_integrat_seed3516286562.mp4"
                className="relative z-10 mx-auto aspect-16/10 w-full max-w-[1240px] overflow-hidden rounded-none border-y border-white/15 bg-[#0e3d7a] sm:rounded-xl sm:border sm:shadow-[0_24px_80px_rgba(18,77,149,0.35)]"
                videoClassName="scale-[1.03]"
                overlayClassName="bg-[linear-gradient(180deg,rgba(18,77,149,0.22)_0%,rgba(18,77,149,0.08)_36%,rgba(18,77,149,0.52)_100%)]"
                label="End-to-end logistics"
                title="From supplier to shelf, across every continent"
                description="Integrated global shipment coordination connecting warehouses, carriers and last-mile delivery into a single operational flow."
                reveal
                allowAutoplayOnCoarse
                priority="section"
              />
              <div className="relative z-10 mx-auto max-w-[1240px] px-4 pb-10 pt-4 sm:px-10 sm:pb-14 sm:pt-6 lg:px-16 lg:pb-16">
                <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3)_26%,rgba(255,255,255,0.5)_62%,transparent)] opacity-60" />
              </div>
            </div>

            <InfrastructureSection />
            <DashboardPreviewSection />

            <ContactSection />
            <Footer />
          </main>
        </div>
      </div>
    </ServiceHubNavProvider>
  );
}
