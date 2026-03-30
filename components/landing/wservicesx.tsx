"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Anchor, ArrowRight, Globe, Plane, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getServiceCardById,
  servicesCardsData,
  type ServiceCardData,
} from "@/lib/services-cards-data";
import { ServiceCardView } from "@/components/landing/service-card-view";
import { useServiceHubNavOptional } from "@/components/landing/service-hub-nav-context";

gsap.registerPlugin(ScrollTrigger);

/** Hub node id → shared services card id (null = keep dedicated modal) */
const HUB_TO_SERVICE_CARD_ID: Record<number, ServiceCardData["id"] | null> = {
  1: null,
  2: "fulfillment",
  3: "workforce",
  4: "value-added",
  5: "3pl",
};

type ServiceItem = {
  id: number;
  title: string;
  eyebrow: string;
  intro: string;
  capabilities: string[];
  color: string;
  image: string;
};

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1,
    title: "Global Import & Export",
    eyebrow: "International flows",
    intro:
      "Through our sister company SBA Logistic, we support international supply chain flows from origin to final destination.",
    capabilities: [
      "International freight coordination",
      "Import and export management",
      "Global sourcing logistics",
      "Integration with warehousing and fulfillment operations",
      "Fully coordinated supply chain execution",
    ],
    color: "#2563EB",
    image: "/globalimp.png",
  },
  {
    id: 2,
    title: "Fulfillment Solutions",
    eyebrow: "E-commerce & omnichannel",
    intro:
      "Our fulfillment services support e-commerce and omnichannel businesses requiring reliable order processing and operational visibility.",
    capabilities: [
      "B2B and B2C order processing",
      "Pick & pack operations",
      "Returns management",
      "Order consolidation and packaging",
      "Integration with client systems",
      "Performance monitoring and reporting",
    ],
    color: "#3988EA",
    image: "/fulfillment.png",
  },
  {
    id: 3,
    title: "Workforce & Operational Flexibility",
    eyebrow: "Capacity scaling",
    intro:
      "One of the core advantages of Saca Logistics is the ability to scale operational capacity quickly.",
    capabilities: [
      "Recruitment and workforce placement",
      "Temporary and permanent operational staffing",
      "Operational ramp-up support",
      "Seasonal peak management",
      "Dedicated or shared operational teams",
    ],
    color: "#124D95",
    image: "/workforce.png",
  },
  {
    id: 4,
    title: "Labeling, Packaging & Co-packing",
    eyebrow: "Market readiness",
    intro:
      "In addition to standard logistics operations, we provide a range of services designed to prepare products for distribution and retail markets.",
    capabilities: [
      "Product labelling and re-labelling",
      "Translation of product labels from any language",
      "Implementation of nutritional information labels for food products",
      "Kitting and promotional packaging",
      "Packing and co-packing operations",
      "Product preparation and rework",
      "Packaging adjustments for retail distribution",
    ],
    color: "#1D4ED8",
    image: "/valuead.png",
  },
  {
    id: 5,
    title: "3PL Logistics — Retail & FMCG",
    eyebrow: "Retail & FMCG",
    intro:
      "Our 3PL services provide structured warehouse operations designed to ensure accuracy, reliability and scalability.",
    capabilities: [
      "Inbound reception and quality control",
      "Pallet storage and warehouse management",
      "Replenishment operations",
      "Picking and packing",
      "Cross-docking services",
      "Inventory control and cycle counting",
      "KPI reporting and operational monitoring",
    ],
    color: "#60A5FA",
    image: "/3pl.png",
  },
];

const GLOBAL_TRANSPORT_MODES = [
  {
    icon: Ship,
    label: "Sea Freight",
    stat: "Global Coverage",
    color: "#3988EA",
  },
  {
    icon: Plane,
    label: "Air Freight",
    stat: "Express Delivery",
    color: "#F5A623",
  },
  {
    icon: Truck,
    label: "Road Transport",
    stat: "EU Network",
    color: "#124D95",
  },
];

const DESKTOP_POSITIONS = [
  { top: "12%", left: "50%", transform: "translate(-50%, 0)" },
  { top: "34%", left: "81%", transform: "translate(-50%, -50%)" },
  { top: "76%", left: "70%", transform: "translate(-50%, -50%)" },
  { top: "68%", left: "24%", transform: "translate(-50%, -50%)" }, // Value Added Services
  { top: "34%", left: "19%", transform: "translate(-50%, -50%)" },
];

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function splitTitle(text: string) {
  return text.split(" ");
}

/** True when enough of the hub section is on-screen to open a modal from nav */
function sectionSufficientlyVisible(root: HTMLElement): boolean {
  const r = root.getBoundingClientRect();
  const vh = window.innerHeight;
  const visibleHeight = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  return visibleHeight > 0 && visibleHeight / vh >= 0.12;
}

function HubIcon() {
  return (
    <svg
      className="h-5 w-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 7.5 12 3l9 4.5M4.5 9.5V16L12 20l7.5-4V9.5M12 20v-8"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const desktopHubRef = useRef<HTMLDivElement>(null);
  const desktopNodesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopLinesRef = useRef<(SVGPathElement | null)[]>([]);
  const mobileHubRef = useRef<HTMLDivElement>(null);
  const mobileNodesRef = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileLinesRef = useRef<(SVGLineElement | null)[]>([]);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);

  const [activeService, setActiveService] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  /* Resolve portal target after mount so modal escapes ScrollSmoother's transform */
  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const hubNav = useServiceHubNavOptional();

  /* Open the correct hub modal after header submenu navigation (scroll + pending id) */
  useEffect(() => {
    if (!hubNav || hubNav.pendingServiceId === null) return;
    const pending = hubNav.pendingServiceId;
    const clearPending = hubNav.clearPendingService;
    const root = sectionRef.current;
    if (!root) return;

    const open = () => {
      setActiveService(pending);
      clearPending();
    };

    if (sectionSufficientlyVisible(root)) {
      open();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting && e.intersectionRatio >= 0.12) {
          open();
          io.disconnect();
        }
      },
      { threshold: [0, 0.12, 0.2, 0.35] },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [hubNav, hubNav?.pendingServiceId]);

  const activeServiceData = useMemo(
    () =>
      activeService !== null
        ? (SERVICES_DATA.find((s) => s.id === activeService) ?? null)
        : null,
    [activeService],
  );

  const richServiceCard = useMemo(() => {
    if (activeService === null) return null;
    const sid = HUB_TO_SERVICE_CARD_ID[activeService];
    if (!sid) return null;
    return getServiceCardById(sid) ?? null;
  }, [activeService]);

  const richCardIndex = useMemo(() => {
    if (activeService === null) return 0;
    const sid = HUB_TO_SERVICE_CARD_ID[activeService];
    if (!sid) return 0;
    const idx = servicesCardsData.findIndex((s) => s.id === sid);
    return idx >= 0 ? idx : 0;
  }, [activeService]);

  const closeModal = useCallback(() => {
    const overlay = modalOverlayRef.current;
    const panel = modalPanelRef.current;

    if (!overlay || !panel) {
      setActiveService(null);
      return;
    }

    if (reduceMotion) {
      setActiveService(null);
      return;
    }

    gsap
      .timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => setActiveService(null),
      })
      .to(panel, {
        autoAlpha: 0,
        y: 16,
        scale: 0.96,
        duration: 0.18,
      })
      .to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.16,
        },
        0,
      );
  }, [reduceMotion]);

  const scrollToContactAndClose = useCallback(() => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }

    mediaQuery.addListener(onChange);
    return () => mediaQuery.removeListener(onChange);
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const coarse = isCoarsePointer();

    let sectionObserver: IntersectionObserver | null = null;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      if (reduceMotion) {
        gsap.set(q(".srv-kicker"), { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(q(".srv-title-word"), {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
        });
        gsap.set(q(".srv-sub"), { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(q(".srv-rule"), { scaleX: 1 });
        gsap.set(q(".srv-desktop-hub"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-desktop-node"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-desktop-line"), {
          opacity: 0.42,
          strokeDashoffset: 0,
        });
        gsap.set(q(".srv-mobile-hub"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-mobile-node"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-mobile-line"), {
          opacity: 0.58,
          strokeDashoffset: 0,
        });
        return;
      }

      gsap.set(q(".srv-kicker"), {
        opacity: 0,
        y: 16,
        filter: "blur(10px)",
      });

      gsap.set(q(".srv-title-word"), {
        opacity: 0,
        y: 42,
        rotateX: -70,
        transformOrigin: "50% 100%",
        filter: "blur(10px)",
      });

      gsap.set(q(".srv-sub"), {
        opacity: 0,
        y: 18,
        filter: "blur(10px)",
      });

      gsap.set(q(".srv-rule"), {
        scaleX: 0,
        transformOrigin: "50% 50%",
      });

      gsap.set(q(".srv-desktop-hub"), {
        opacity: 0,
        y: 18,
        scale: 0.92,
      });

      gsap.set(q(".srv-desktop-node"), {
        opacity: 0,
        y: 22,
        scale: 0.8,
      });

      gsap.set(q(".srv-desktop-line"), {
        opacity: 0,
        strokeDashoffset: 36,
      });

      gsap.set(q(".srv-mobile-hub"), {
        opacity: 0,
        y: 14,
        scale: 0.78,
      });

      gsap.set(q(".srv-mobile-node"), {
        opacity: 0,
        y: 14,
        scale: 0.74,
      });

      gsap.set(q(".srv-mobile-line"), {
        opacity: 0,
        strokeDashoffset: 80,
      });

      /* Use IntersectionObserver instead of ScrollTrigger for the entrance
         animation — ScrollSmoother applies transforms to the content container
         which can desync ScrollTrigger positions on desktop. IO is immune. */
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        paused: true,
      });

      sectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            introTl.play();
            sectionObserver?.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      sectionObserver.observe(root);

      introTl
        .to(q(".srv-kicker"), {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
        })
        .to(
          q(".srv-title-word"),
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.72,
            stagger: 0.05,
            ease: "back.out(1.3)",
          },
          0.06,
        )
        .to(
          q(".srv-sub"),
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
          },
          0.18,
        )
        .to(
          q(".srv-rule"),
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.inOut",
          },
          0.28,
        )
        .to(
          q(".srv-desktop-hub"),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: "back.out(1.5)",
          },
          0.38,
        )
        .to(
          q(".srv-desktop-line"),
          {
            opacity: 0.42,
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.05,
          },
          0.5,
        )
        .to(
          q(".srv-desktop-node"),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "back.out(1.6)",
          },
          0.62,
        )
        .to(
          q(".srv-mobile-hub"),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.68,
            ease: "back.out(1.5)",
          },
          0.38,
        )
        .to(
          q(".srv-mobile-line"),
          {
            opacity: 0.58,
            strokeDashoffset: 0,
            duration: 0.8,
            stagger: 0.04,
          },
          0.5,
        )
        .to(
          q(".srv-mobile-node"),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.56,
            stagger: {
              each: 0.08,
              from: "center",
            },
            ease: "back.out(1.6)",
          },
          0.62,
        );

      if (!coarse) {
        q(".srv-desktop-node").forEach((node, i) => {
          gsap.to(node, {
            y: i % 2 === 0 ? -7 : 7,
            duration: 3.2 + i * 0.25,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        if (desktopHubRef.current) {
          gsap.to(desktopHubRef.current, {
            boxShadow:
              "0 0 0 1px rgba(37,99,235,0.08), 0 30px 80px rgba(37,99,235,0.18)",
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }

      q(".srv-mobile-node").forEach((node, i) => {
        gsap.to(node, {
          y: i % 2 === 0 ? -5 : 5,
          duration: 2.6 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.to(q(".srv-desktop-line"), {
        strokeDashoffset: -18,
        duration: 2.8,
        repeat: -1,
        ease: "none",
      });

      gsap.to(q(".srv-mobile-line"), {
        strokeDashoffset: -16,
        duration: 2.3,
        repeat: -1,
        ease: "none",
      });

      gsap.fromTo(
        q(".srv-copy-parallax"),
        { yPercent: 0 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: coarse ? 0.3 : 0.8,
          },
        },
      );

      gsap.fromTo(
        q(".srv-network-parallax"),
        { yPercent: 0 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: coarse ? 0.3 : 0.8,
          },
        },
      );
    }, root);

    let cleanupPointer = () => {};

    if (!reduceMotion && !coarse && spotlightRef.current) {
      const spotX = gsap.quickTo(spotlightRef.current, "x", {
        duration: 0.55,
        ease: "power3.out",
        overwrite: true,
      });
      const spotY = gsap.quickTo(spotlightRef.current, "y", {
        duration: 0.55,
        ease: "power3.out",
        overwrite: true,
      });

      const onMove = (event: PointerEvent) => {
        const bounds = root.getBoundingClientRect();
        spotX(event.clientX - bounds.left);
        spotY(event.clientY - bounds.top);
      };

      const onLeave = () => {
        const bounds = root.getBoundingClientRect();
        spotX(bounds.width / 2);
        spotY(bounds.height / 2);
      };

      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave, { passive: true });

      cleanupPointer = () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      cleanupPointer();
      sectionObserver?.disconnect();
      ctx.revert();
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (activeService === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", onKeyDown);

    const overlay = modalOverlayRef.current;
    const panel = modalPanelRef.current;

    if (overlay && panel) {
      if (reduceMotion) {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(panel, { autoAlpha: 1, y: 0, scale: 1 });
      } else {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(panel, { autoAlpha: 0, y: 20, scale: 0.96 });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(overlay, {
            autoAlpha: 1,
            duration: 0.2,
          })
          .to(
            panel,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.28,
            },
            0.04,
          );
      }
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeService, closeModal, reduceMotion]);

  return (
    <>
      <section
        id="services"
        ref={sectionRef}
        className="relative min-h-screen w-full overflow-hidden bg-[#FAF8F5] py-16 md:py-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_18%,rgba(37,99,235,0.10),transparent_44%),radial-gradient(700px_circle_at_12%_20%,rgba(57,136,234,0.06),transparent_28%),linear-gradient(180deg,#FAF8F5_0%,#F5F7FB_52%,#FAF8F5_100%)] pointer-events-none" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(18,77,149,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(18,77,149,0.12)_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_38%,rgba(15,23,42,0.06)_100%)]" />

        <div
          ref={spotlightRef}
          className="pointer-events-none absolute left-0 top-0 hidden h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),rgba(59,130,246,0.04)_48%,transparent_72%)] blur-3xl md:block"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="srv-copy-parallax mx-auto max-w-3xl text-center">
            <div className="srv-kicker inline-flex items-center rounded-full border border-[#2563EB]/15 bg-white/80 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.32em] text-[#124D95] shadow-[0_12px_30px_rgba(37,99,235,0.08)] backdrop-blur">
              Service architecture
            </div>

            <h2
              ref={titleRef}
              className="mt-5 mb-6 text-center text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#0F172A] md:mb-8 sm:text-[3rem] md:text-[4.6rem]"
            >
              <span className="sr-only">What can we do for you</span>
              <span
                aria-hidden="true"
                className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2"
              >
                {splitTitle("What can we do for you").map((word, i) => (
                  <span
                    key={`${word}-${i}`}
                    className={`srv-title-word inline-block ${
                      word === "you"
                        ? "bg-[linear-gradient(90deg,#124D95_0%,#2563EB_45%,#60A5FA_100%)] bg-clip-text text-transparent"
                        : ""
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h2>

            <p className="srv-sub mx-auto max-w-2xl text-sm leading-7 text-[#475569] sm:text-base lg:text-lg">
              Explore the five core service pillars around a single operational
              hub. Each node opens a focused service panel with room for richer
              content later.
            </p>

            <div className="srv-rule mx-auto mt-7 h-px w-full max-w-md bg-[linear-gradient(90deg,transparent,rgba(18,77,149,0.58),rgba(96,165,250,0.55),transparent)]" />
          </div>

          <div className="srv-network-parallax">
            <div className="relative mx-auto mt-12 hidden aspect-square w-full max-w-4xl md:mt-16 md:block">
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  ref={(el) => {
                    desktopLinesRef.current[0] = el;
                  }}
                  className="srv-desktop-line"
                  d="M50 50 Q50 34 50 12"
                  stroke="#3988EA"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    desktopLinesRef.current[1] = el;
                  }}
                  className="srv-desktop-line"
                  d="M50 50 Q64 40 81 34"
                  stroke="#2563EB"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    desktopLinesRef.current[2] = el;
                  }}
                  className="srv-desktop-line"
                  d="M50 50 Q60 64 70 76"
                  stroke="#60A5FA"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    desktopLinesRef.current[3] = el;
                  }}
                  className="srv-desktop-line"
                  d="M50 50 Q40 64 30 76"
                  stroke="#1D4ED8"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  ref={(el) => {
                    desktopLinesRef.current[4] = el;
                  }}
                  className="srv-desktop-line"
                  d="M50 50 Q36 40 19 34"
                  stroke="#124D95"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-line"
                  d="M19 34 Q50 12 81 34"
                  stroke="#3988EA"
                  strokeWidth="0.14"
                  fill="none"
                  strokeDasharray="0.9 1.3"
                  strokeLinecap="round"
                  opacity="0.25"
                />
                <path
                  className="srv-desktop-line"
                  d="M30 76 Q50 86 70 76"
                  stroke="#3988EA"
                  strokeWidth="0.14"
                  fill="none"
                  strokeDasharray="0.9 1.3"
                  strokeLinecap="round"
                  opacity="0.2"
                />
              </svg>

              <div
                ref={desktopHubRef}
                className="srv-desktop-hub absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] backdrop-blur-xl"
              >
                <img
                  src="/logo_trans.svg"
                  alt="Saca Logistics Logo"
                  className="max-w-[110px] max-h-[110px]"
                  style={{ display: "block", margin: "auto" }}
                />
              </div>

              {SERVICES_DATA.map((service, i) => (
                <button
                  key={service.id}
                  ref={(el) => {
                    desktopNodesRef.current[i] = el;
                  }}
                  onClick={() => setActiveService(service.id)}
                  className="srv-desktop-node absolute rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-4"
                  style={DESKTOP_POSITIONS[i]}
                  aria-label={`View ${service.title} details`}
                  type="button"
                >
                  <span
                    className={`absolute whitespace-nowrap text-sm font-medium text-[#334155] transition-colors group-hover:text-[#2563EB] ${
                      i === 0
                        ? "-top-14 left-1/2 -translate-x-1/2 text-center"
                        : i === 1
                          ? "right-[calc(100%+16px)] top-1/2 -translate-y-1/2 text-right"
                          : i === 2
                            ? "right-[calc(100%+16px)] top-1/2 -translate-y-1/2 text-right"
                            : i === 3
                              ? "left-[calc(100%+16px)] top-1/2 -translate-y-1/2 text-left"
                              : "left-[calc(100%+16px)] top-1/2 -translate-y-1/2 text-left"
                    }`}
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#124D95]/65">
                      {service.eyebrow}
                    </span>
                    <span className="mt-1 block">{service.title}</span>
                  </span>

                  <div className="relative h-24 w-24 rounded-full p-[8px] transition-all duration-300 group-hover:scale-105">
                    <span
                      className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-100"
                      style={{ background: `${service.color}30` }}
                    />
                    <span
                      className="absolute inset-0 rounded-full border"
                      style={{ borderColor: `${service.color}55` }}
                    />
                    <div className="absolute inset-[8px] overflow-hidden rounded-full border border-white/70 bg-white/85 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at 28% 24%, ${service.color}66, transparent 35%), linear-gradient(135deg, #eff6ff 0%, #ffffff 45%, #dbeafe 100%)`,
                        }}
                      />
                      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(transparent_0%,transparent_47%,rgba(18,77,149,0.9)_48%,transparent_49%,transparent_100%)] [background-size:100%_16px]" />
                      <div className="absolute inset-[1px] overflow-hidden rounded-full border border-white/70 bg-white">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div
              className="relative mt-10 w-full md:hidden"
              style={{ height: "590px" }}
            >
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                style={{ overflow: "visible" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="mobileLineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#124D95" stopOpacity="0.55" />
                    <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop
                      offset="100%"
                      stopColor="#60A5FA"
                      stopOpacity="0.55"
                    />
                  </linearGradient>
                </defs>

                <line
                  ref={(el) => {
                    mobileLinesRef.current[0] = el;
                  }}
                  className="srv-mobile-line"
                  x1="50%"
                  y1="278"
                  x2="50%"
                  y2="78"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  ref={(el) => {
                    mobileLinesRef.current[1] = el;
                  }}
                  className="srv-mobile-line"
                  x1="50%"
                  y1="292"
                  x2="18%"
                  y2="202"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  ref={(el) => {
                    mobileLinesRef.current[2] = el;
                  }}
                  className="srv-mobile-line"
                  x1="50%"
                  y1="292"
                  x2="82%"
                  y2="202"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  ref={(el) => {
                    mobileLinesRef.current[3] = el;
                  }}
                  className="srv-mobile-line"
                  x1="50%"
                  y1="308"
                  x2="22%"
                  y2="428"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  ref={(el) => {
                    mobileLinesRef.current[4] = el;
                  }}
                  className="srv-mobile-line"
                  x1="50%"
                  y1="308"
                  x2="78%"
                  y2="428"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="78"
                  x2="18%"
                  y2="202"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="78"
                  x2="82%"
                  y2="202"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="18%"
                  y1="202"
                  x2="82%"
                  y2="202"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="22%"
                  y1="428"
                  x2="78%"
                  y2="428"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="18%"
                  y1="202"
                  x2="22%"
                  y2="428"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="82%"
                  y1="202"
                  x2="78%"
                  y2="428"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
              </svg>

              <button
                ref={(el) => {
                  mobileNodesRef.current[0] = el;
                }}
                className="srv-mobile-node absolute rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                style={{
                  top: "38px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                onClick={() => setActiveService(SERVICES_DATA[0].id)}
                aria-label={`View ${SERVICES_DATA[0].title} details`}
                type="button"
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[18px] font-semibold text-[#334155] transition-colors group-hover:text-[#2563EB]">
                  Global Import & Export
                </span>
                <div className="relative h-16 w-16 rounded-full p-[5px]">
                  <span
                    className="absolute inset-0 rounded-full blur-lg"
                    style={{ background: `${SERVICES_DATA[0].color}25` }}
                  />
                  <div className="absolute inset-0 rounded-full border border-[#2563EB]/35 bg-white/90 shadow-[0_16px_34px_rgba(15,23,42,0.10)]" />
                  <div className="absolute inset-[1px] overflow-hidden rounded-full border border-white/70 bg-white">
                    <img
                      src="/globalimp.png"
                      alt="Global Import & Export"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>

              <div
                ref={mobileHubRef}
                className="srv-mobile-hub absolute left-1/2 top-[236px] flex h-28 w-28 -translate-x-1/2 items-center justify-center opacity-0"
              >
                <img
                  src="/logo_trans.svg"
                  alt="Saca Logistics Logo"
                  className="max-w-[70px] max-h-[70px]"
                  style={{ display: "block", margin: "auto" }}
                />
              </div>

              <button
                ref={(el) => {
                  mobileNodesRef.current[1] = el;
                }}
                className="srv-mobile-node absolute rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                style={{
                  top: "162px",
                  left: "18%",
                  transform: "translateX(-50%)",
                }}
                onClick={() => setActiveService(SERVICES_DATA[1].id)}
                aria-label={`View ${SERVICES_DATA[1].title} details`}
                type="button"
              >
                <span className="absolute left-1/2 -top-2 -translate-y-[20%] translate-x-[30%] whitespace-nowrap text-[18px] font-medium text-[#334155] transition-colors group-hover:text-[#2563EB]">
                  Fulfillment
                </span>
                <div className="relative h-14 w-14 rounded-full p-[4px]">
                  <span
                    className="absolute inset-0 rounded-full blur-lg"
                    style={{ background: `${SERVICES_DATA[1].color}22` }}
                  />
                  <div className="absolute inset-0 rounded-full border border-[#3988EA]/30 bg-white/90 shadow-[0_14px_28px_rgba(15,23,42,0.10)]" />
                  <div className="absolute inset-[1px] overflow-hidden rounded-full border border-white/70 bg-white">
                    <img
                      src="/fulfillment.png"
                      alt="Fulfillment"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>

              <button
                ref={(el) => {
                  mobileNodesRef.current[2] = el;
                }}
                className="srv-mobile-node absolute rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                style={{
                  top: "162px",
                  left: "82%",
                  transform: "translateX(-50%)",
                }}
                onClick={() => setActiveService(SERVICES_DATA[2].id)}
                aria-label={`View ${SERVICES_DATA[2].title} details`}
                type="button"
              >
                <span className="absolute left-1/2 -top-4 -translate-x-[30%] -translate-y-[20%] whitespace-nowrap text-[18px] font-medium text-[#334155] transition-colors group-hover:text-[#2563EB]">
                  Workforce
                </span>
                <div className="relative h-14 w-14 rounded-full p-[4px]">
                  <span
                    className="absolute inset-0 rounded-full blur-lg"
                    style={{ background: `${SERVICES_DATA[2].color}22` }}
                  />
                  <div className="absolute inset-0 rounded-full border border-[#124D95]/30 bg-white/90 shadow-[0_14px_28px_rgba(15,23,42,0.10)]" />
                  <div className="absolute inset-[1px] overflow-hidden rounded-full border border-white/70 bg-white">
                    <img
                      src="/workforce.png"
                      alt="Workforce"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>

              <button
                ref={(el) => {
                  mobileNodesRef.current[3] = el;
                }}
                className="srv-mobile-node absolute rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                style={{
                  top: "418px",
                  left: "22%",
                  transform: "translateX(-50%)",
                }}
                onClick={() => setActiveService(SERVICES_DATA[3].id)}
                aria-label={`View ${SERVICES_DATA[3].title} details`}
                type="button"
              >
                <span className="absolute -left-[-135%] lg:left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[18px] font-medium text-[#334155] transition-colors group-hover:text-[#2563EB]">
                  Labeling, Packaging & Co-packing
                </span>
                <div className="relative h-14 w-14 rounded-full p-[4px]">
                  <span
                    className="absolute inset-0 rounded-full blur-lg"
                    style={{ background: `${SERVICES_DATA[3].color}22` }}
                  />
                  <div className="absolute inset-0 rounded-full border border-[#1D4ED8]/30 bg-white/90 shadow-[0_14px_28px_rgba(15,23,42,0.10)]" />
                  <div className="absolute inset-[1px] overflow-hidden rounded-full border border-white/70 bg-white">
                    <img
                      src="/valuead.png"
                      alt="Value Added"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>

              <button
                ref={(el) => {
                  mobileNodesRef.current[4] = el;
                }}
                className="srv-mobile-node absolute rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                style={{
                  top: "388px",
                  left: "78%",
                  transform: "translateX(-50%)",
                }}
                onClick={() => setActiveService(SERVICES_DATA[4].id)}
                aria-label={`View ${SERVICES_DATA[4].title} details`}
                type="button"
              >
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[18px] font-medium text-[#334155] transition-colors group-hover:text-[#2563EB]">
                  3PL Logistics
                </span>
                <div className="relative h-14 w-14 rounded-full p-[4px]">
                  <span
                    className="absolute inset-0 rounded-full blur-lg"
                    style={{ background: `${SERVICES_DATA[4].color}22` }}
                  />
                  <div className="absolute inset-0 rounded-full border border-[#60A5FA]/30 bg-white/90 shadow-[0_14px_28px_rgba(15,23,42,0.10)]" />
                  <div className="absolute inset-[1px] overflow-hidden rounded-full border border-white/70 bg-white">
                    <img
                      src="/3pl.png"
                      alt="3PL Logistics"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeService !== null &&
        portalRoot &&
        createPortal(
          <div
            ref={modalOverlayRef}
            className="fixed inset-0 z-50 bg-slate-950/50 px-4 py-6 backdrop-blur-md"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex min-h-full items-center justify-center">
              <div
                ref={modalPanelRef}
                className={
                  activeService === 1
                    ? "relative w-full max-w-6xl overflow-y-auto overflow-x-hidden rounded-[24px] border border-white/15 bg-[#124D95] shadow-[0_30px_90px_rgba(15,23,42,0.45)] max-h-[min(92vh,960px)]"
                    : "relative w-full max-w-5xl overflow-y-auto overflow-x-hidden rounded-[24px] border border-white/15 bg-[#124D95] shadow-[0_30px_90px_rgba(15,23,42,0.45)] max-h-[min(92vh,960px)]"
                }
                onClick={(e) => e.stopPropagation()}
              >
                {activeService === 1 && activeServiceData ? (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a1628_0%,#124D95_58%,#0f4f9f_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_15%_20%,rgba(57,136,234,0.22),transparent_35%),radial-gradient(520px_circle_at_85%_80%,rgba(245,166,35,0.14),transparent_30%)]" />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
                        backgroundSize: "44px 44px",
                      }}
                    />

                    <button
                      onClick={closeModal}
                      className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:border-white/40 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      aria-label="Close modal"
                      type="button"
                    >
                      <CloseIcon />
                    </button>

                    <div className="relative z-10 p-5 sm:p-6 lg:p-8">
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
                        <div className="min-w-0">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                            <Anchor className="h-4 w-4 text-[#F5A623]" />
                            SBA Logistic Partnership
                          </span>

                          <div className="mt-5">
                            <div className="text-[11px] font-medium uppercase tracking-[0.26em] text-white/60">
                              {activeServiceData.eyebrow}
                            </div>

                            <h3
                              id="modal-title"
                              className="mt-3 text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl"
                            >
                              Global Reach.{" "}
                              <span className="text-[#60A5FA]">
                                Local Execution.
                              </span>
                            </h3>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                              Through our sister company SBA Logistic, we manage
                              your supply chain end-to-end from worldwide
                              import/export to final market placement. One
                              partner for your entire logistics journey.
                            </p>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            {GLOBAL_TRANSPORT_MODES.map((mode) => (
                              <div
                                key={mode.label}
                                className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:bg-white/[0.12] hover:border-white/25"
                              >
                                <div
                                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                                  style={{ backgroundColor: `${mode.color}22` }}
                                >
                                  <mode.icon
                                    className="h-5 w-5"
                                    style={{ color: mode.color }}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-white">
                                    {mode.label}
                                  </p>
                                  <p className="text-xs text-white/55">
                                    {mode.stat}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6 rounded-[24px] border border-white/15 bg-white/[0.08] p-5 backdrop-blur-xl">
                            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                              Capabilities
                            </h4>

                            <ul className="grid gap-3 sm:grid-cols-2">
                              {activeServiceData.capabilities.map(
                                (cap, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-3 text-white/85"
                                  >
                                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#60A5FA]" />
                                    <span className="text-sm leading-6">
                                      {cap}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>

                          <div className="mt-6">
                            <Button
                              size="lg"
                              className="group rounded-full bg-[linear-gradient(90deg,#F5A623,#E09612)] px-8 py-6 text-white shadow-[0_18px_40px_rgba(245,166,35,0.25)] transition-all duration-300 hover:shadow-[0_22px_48px_rgba(245,166,35,0.32)]"
                              onClick={scrollToContactAndClose}
                            >
                              <span className="flex items-center gap-2">
                                Explore Global Solutions
                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </Button>
                          </div>
                        </div>

                        <div className="relative min-w-0">
                          <div className="relative overflow-hidden rounded-[28px] border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                            <div className="relative aspect-[4/3] w-full">
                              <Image
                                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070"
                                alt="Global shipping"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/75 via-[#0a1628]/20 to-transparent" />
                              <div
                                className="absolute inset-0 opacity-20 mix-blend-overlay"
                                style={{
                                  backgroundImage:
                                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                                  backgroundSize: "18px 18px",
                                }}
                              />
                            </div>
                          </div>

                          <div className="absolute -bottom-4 -left-3 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:-left-4 sm:p-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#3988EA,#124D95)] shadow-[0_12px_28px_rgba(37,99,235,0.25)]">
                                <Globe className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-[#124D95]">
                                  50+
                                </p>
                                <p className="text-xs text-slate-500">
                                  Countries Served
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute -right-2 -top-3 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:-right-4 sm:p-5">
                            <div className="flex items-center gap-3">
                              <Ship className="h-7 w-7 text-[#3988EA]" />
                              <div>
                                <p className="text-base font-bold text-[#124D95]">
                                  End-to-End
                                </p>
                                <p className="text-xs text-slate-500">
                                  Supply Chain
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute -bottom-6 -right-6 -z-10 h-28 w-28 rounded-3xl bg-[#3988EA]/20 blur-2xl" />
                          <div className="absolute -left-6 -top-6 -z-10 h-24 w-24 rounded-3xl bg-[#F5A623]/20 blur-2xl" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : richServiceCard ? (
                  <>
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                      }}
                    />
                    <button
                      onClick={closeModal}
                      className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#124D95]/90 text-white transition-colors hover:border-white/50 hover:bg-[#0e3d7a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      aria-label="Close modal"
                      type="button"
                    >
                      <CloseIcon />
                    </button>
                    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                      <ServiceCardView
                        service={richServiceCard}
                        index={richCardIndex}
                        variant="modal"
                        titleId="modal-title"
                        onCtaClick={scrollToContactAndClose}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>,
          portalRoot,
        )}
    </>
  );
}
