"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Anchor,
  ArrowRight,
  Camera,
  FileText,
  Globe,
  Megaphone,
  Monitor,
  Plane,
  Search,
  Ship,
  ShoppingCart,
  Target,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getServiceCardById,
  servicesCardsData,
  type ServiceCardData,
} from "@/lib/services-cards-data";
import { ServiceCardView } from "@/components/landing/service-card-view";
import { useServiceHubNavOptional } from "@/components/landing/service-hub-nav-context";

gsap.registerPlugin(ScrollTrigger);

/** Hub node id → shared services card id (null = dedicated modal) */
const HUB_TO_SERVICE_CARD_ID: Record<number, ServiceCardData["id"] | null> = {
  1: null,
  2: "fulfillment",
  3: "workforce",
  4: "value-added",
  5: "3pl",
  6: null,
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

type NodeLayout = {
  style: CSSProperties;
  labelClass: string;
  bubbleClass: string;
  innerClass: string;
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
    title: "3PL Logistics",
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
  {
    id: 6,
    title: "Website & Digital Growth",
    eyebrow: "Launch & scale",
    intro:
      "We build the digital layer around the product: custom launch pages, commerce-ready experiences and performance campaigns that help a product reach the market with speed.",
    capabilities: [
      "Custom-coded landing pages for launches and validation",
      "Full e-commerce builds and staged migrations to mature platforms",
      "Google Ads and SEO execution tied to commercial goals",
      "Social media management, content creation and UGC production",
      "Video ads, creative assets and campaign support",
      "Physical branding support such as flyers and catalogues",
    ],
    color: "#06B6D4",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
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

const DIGITAL_GROWTH_FEATURES = [
  {
    icon: Monitor,
    title: "Launch Pages",
    text: "Custom-coded pages built fast for product tests, pre-launches and high-intent campaigns.",
  },
  {
    icon: ShoppingCart,
    title: "Commerce Builds",
    text: "From temporary launch sites to full online stores and later platform migrations.",
  },
  {
    icon: Megaphone,
    title: "Demand Generation",
    text: "Google Ads, social support and campaign structures designed around real commercial intent.",
  },
  {
    icon: Search,
    title: "SEO Foundations",
    text: "On-page SEO, site structure and search visibility designed to support scale over time.",
  },
  {
    icon: Camera,
    title: "Creative & UGC",
    text: "Content creation, UGC-style assets, social media management and video ad production.",
  },
  {
    icon: FileText,
    title: "Brand Materials",
    text: "Physical brand support including flyers, catalogues and launch collateral when needed.",
  },
];

const DESKTOP_NODE_LAYOUT: Record<number, NodeLayout> = {
  1: {
    style: { top: "9%", left: "50%", transform: "translate(-50%, 0)" },
    labelClass:
      "-top-16 left-1/2 -translate-x-1/2 w-56 text-center whitespace-normal",
    bubbleClass: "h-24 w-24 p-[8px]",
    innerClass: "inset-[8px]",
  },
  2: {
    style: { top: "28%", left: "19%", transform: "translate(-50%, -50%)" },
    labelClass:
      "left-[calc(100%+18px)] top-1/2 -translate-y-1/2 w-48 text-left whitespace-normal",
    bubbleClass: "h-24 w-24 p-[8px]",
    innerClass: "inset-[8px]",
  },
  3: {
    style: { top: "28%", left: "81%", transform: "translate(-50%, -50%)" },
    labelClass:
      "right-[calc(100%+18px)] top-1/2 -translate-y-1/2 w-48 text-right whitespace-normal",
    bubbleClass: "h-24 w-24 p-[8px]",
    innerClass: "inset-[8px]",
  },
  4: {
    style: { top: "64%", left: "16%", transform: "translate(-50%, -50%)" },
    labelClass:
      "top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-56 text-center whitespace-normal",
    bubbleClass: "h-24 w-24 p-[8px]",
    innerClass: "inset-[8px]",
  },
  5: {
    style: { top: "64%", left: "84%", transform: "translate(-50%, -50%)" },
    labelClass:
      "top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-40 text-center whitespace-normal",
    bubbleClass: "h-24 w-24 p-[8px]",
    innerClass: "inset-[8px]",
  },
  6: {
    style: { top: "79%", left: "50%", transform: "translate(-50%, -50%)" },
    labelClass:
      "top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-52 text-center whitespace-normal",
    bubbleClass: "h-20 w-20 p-[7px]",
    innerClass: "inset-[7px]",
  },
};

const MOBILE_NODE_LAYOUT: Record<number, NodeLayout> = {
  1: {
    style: { top: "34px", left: "50%", transform: "translateX(-50%)" },
    labelClass:
      "-top-10 left-1/2 -translate-x-1/2 w-56 text-center whitespace-normal",
    bubbleClass: "h-16 w-16 p-[5px]",
    innerClass: "inset-[5px]",
  },
  2: {
    style: { top: "162px", left: "18%", transform: "translateX(-50%)" },
    labelClass:
      "left-[calc(100%+12px)] top-1/2 -translate-y-1/2 w-32 text-left whitespace-normal",
    bubbleClass: "h-14 w-14 p-[4px]",
    innerClass: "inset-[4px]",
  },
  3: {
    style: { top: "162px", left: "82%", transform: "translateX(-50%)" },
    labelClass:
      "right-[calc(100%+12px)] top-1/2 -translate-y-1/2 w-32 text-right whitespace-normal",
    bubbleClass: "h-14 w-14 p-[4px]",
    innerClass: "inset-[4px]",
  },
  4: {
    style: { top: "414px", left: "18%", transform: "translateX(-50%)" },
    labelClass:
      "top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-44 text-center whitespace-normal",
    bubbleClass: "h-14 w-14 p-[4px]",
    innerClass: "inset-[4px]",
  },
  5: {
    style: { top: "414px", left: "82%", transform: "translateX(-50%)" },
    labelClass:
      "top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-28 text-center whitespace-normal",
    bubbleClass: "h-14 w-14 p-[4px]",
    innerClass: "inset-[4px]",
  },
  6: {
    style: { top: "560px", left: "50%", transform: "translateX(-50%)" },
    labelClass:
      "bottom-[calc(80%+12px)] left-1/2 -translate-x-1/2 w-44 text-center whitespace-normal",
    bubbleClass: "h-14 w-14 p-[4px]",
    innerClass: "inset-[4px]",
  },
};

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function splitTitle(text: string) {
  return text.split(" ");
}

/** True when enough of the hub section is on-screen to open a modal from nav */
function sectionSufficientlyVisible(root: HTMLElement) {
  const r = root.getBoundingClientRect();
  const vh = window.innerHeight;
  const visibleHeight = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  return visibleHeight > 0 && visibleHeight / vh >= 0.12;
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

function ServiceNode({
  service,
  layout,
  className,
  onClick,
}: {
  service: ServiceItem;
  layout: NodeLayout;
  className: string;
  onClick: (id: number) => void;
}) {
  return (
    <button
      onClick={() => onClick(service.id)}
      className={`absolute rounded-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-4 ${className}`}
      style={layout.style}
      aria-label={`View ${service.title} details`}
      type="button"
    >
      <span
        className={`absolute text-sm font-medium leading-tight text-[#334155] transition-colors group-hover:text-[#2563EB] ${layout.labelClass}`}
      >
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#124D95]/65">
          {service.eyebrow}
        </span>
        <span className="mt-1 block">{service.title}</span>
      </span>

      <div
        className={`relative rounded-full transition-all duration-300 group-hover:scale-105 ${layout.bubbleClass}`}
      >
        <span
          className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `${service.color}30` }}
        />
        <span
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: `${service.color}55` }}
        />
        <div className="absolute inset-0 overflow-hidden rounded-full border border-white/70 bg-white/85 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 28% 24%, ${service.color}66, transparent 35%), linear-gradient(135deg, #eff6ff 0%, #ffffff 45%, #dbeafe 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(transparent_0%,transparent_47%,rgba(18,77,149,0.9)_48%,transparent_49%,transparent_100%)] [background-size:100%_16px]" />
          <div
            className={`absolute overflow-hidden rounded-full border border-white/70 bg-white ${layout.innerClass}`}
          >
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function EndCustomerNode({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={`srv-end-node absolute ${
        mobile
          ? "left-1/2 top-[725px] -translate-x-1/2"
          : "left-1/2 top-[93%] -translate-x-1/2"
      }`}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center">
        <span className="srv-end-customer-ring absolute inset-0 rounded-full border border-[#06B6D4]/35" />
        <span className="srv-end-customer-ring absolute inset-[-10px] rounded-full border border-[#60A5FA]/20" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#2563EB]/25 bg-white/90 shadow-[0_22px_48px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:h-24 sm:w-24">
          <div className="absolute inset-[8px] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(37,99,235,0.22),transparent_34%),linear-gradient(135deg,#ffffff_0%,#eff6ff_52%,#dbeafe_100%)]" />
          <div className="absolute inset-[14px] rounded-full border border-white/80 bg-white shadow-inner" />
          <Target className="relative z-10 h-8 w-8 text-[#124D95] sm:h-9 sm:w-9" />
        </div>

        <div className="mt-3 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#124D95]/65">
            Final destination
          </div>
          <div className="mt-1 text-sm font-semibold text-[#0F172A] sm:text-base">
            End Customer
          </div>
          <div className="mt-1 text-xs leading-5 text-[#475569]">
            The final operational and commercial endpoint.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopHubRef = useRef<HTMLDivElement>(null);
  const mobileHubRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);

  const [activeService, setActiveService] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const hubNav = useServiceHubNavOptional();

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
        gsap.set(q(".srv-mobile-hub"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-desktop-node"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-mobile-node"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-end-node"), { opacity: 1, scale: 1, y: 0 });
        gsap.set(q(".srv-desktop-line"), {
          opacity: 0.42,
          strokeDashoffset: 0,
        });
        gsap.set(q(".srv-desktop-end-line"), {
          opacity: 0.72,
          strokeDashoffset: 0,
        });
        gsap.set(q(".srv-mobile-line"), {
          opacity: 0.58,
          strokeDashoffset: 0,
        });
        gsap.set(q(".srv-mobile-end-line"), {
          opacity: 0.72,
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

      gsap.set(q(".srv-mobile-hub"), {
        opacity: 0,
        y: 14,
        scale: 0.78,
      });

      gsap.set(q(".srv-desktop-node"), {
        opacity: 0,
        y: 22,
        scale: 0.8,
      });

      gsap.set(q(".srv-mobile-node"), {
        opacity: 0,
        y: 14,
        scale: 0.74,
      });

      gsap.set(q(".srv-end-node"), {
        opacity: 0,
        y: 18,
        scale: 0.84,
      });

      gsap.set(q(".srv-desktop-line"), {
        opacity: 0,
        strokeDashoffset: 36,
      });

      gsap.set(q(".srv-desktop-end-line"), {
        opacity: 0,
        strokeDashoffset: 40,
      });

      gsap.set(q(".srv-mobile-line"), {
        opacity: 0,
        strokeDashoffset: 80,
      });

      gsap.set(q(".srv-mobile-end-line"), {
        opacity: 0,
        strokeDashoffset: 90,
      });

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
            duration: 0.72,
            stagger: 0.03,
          },
          0.48,
        )
        .to(
          q(".srv-desktop-node"),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.58,
            stagger: 0.06,
            ease: "back.out(1.6)",
          },
          0.6,
        )
        .to(
          q(".srv-desktop-end-line"),
          {
            opacity: 0.72,
            strokeDashoffset: 0,
            duration: 0.68,
            stagger: 0.03,
          },
          0.82,
        )
        .to(
          q(".srv-end-node"),
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.58,
            ease: "back.out(1.6)",
          },
          0.9,
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
            stagger: 0.03,
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
              each: 0.06,
              from: "center",
            },
            ease: "back.out(1.6)",
          },
          0.62,
        )
        .to(
          q(".srv-mobile-end-line"),
          {
            opacity: 0.72,
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.03,
          },
          0.86,
        );

      if (!coarse) {
        q(".srv-desktop-node").forEach((node, i) => {
          gsap.to(node, {
            y: i % 2 === 0 ? -7 : 7,
            duration: 3.1 + i * 0.18,
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
          duration: 2.5 + i * 0.16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.to(q(".srv-end-node"), {
        y: -6,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(q(".srv-end-customer-ring"), {
        scale: 1.22,
        opacity: 0,
        duration: 2.4,
        repeat: -1,
        stagger: 0.8,
        ease: "power1.out",
      });

      gsap.to(q(".srv-desktop-line"), {
        strokeDashoffset: -18,
        duration: 2.8,
        repeat: -1,
        ease: "none",
      });

      gsap.to(q(".srv-desktop-end-line"), {
        strokeDashoffset: -20,
        duration: 2.3,
        repeat: -1,
        ease: "none",
      });

      gsap.to(q(".srv-mobile-line"), {
        strokeDashoffset: -16,
        duration: 2.3,
        repeat: -1,
        ease: "none",
      });

      gsap.to(q(".srv-mobile-end-line"), {
        strokeDashoffset: -18,
        duration: 2.1,
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

    if (!reduceMotion && !isCoarsePointer() && spotlightRef.current) {
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
        className="relative min-h-screen w-full overflow-hidden bg-[#FAF8F5] py-16 pb-28 md:py-24 md:pb-36"
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

            <h2 className="mt-5 mb-6 text-center text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[#0F172A] md:mb-8 sm:text-[3rem] md:text-[4.6rem]">
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
              Explore six coordinated service pillars around one operational
              hub. The full flow moves from logistics and launch support to one
              shared outcome: reaching the end customer.
            </p>

            <div className="srv-rule mx-auto mt-7 h-px w-full max-w-md bg-[linear-gradient(90deg,transparent,rgba(18,77,149,0.58),rgba(96,165,250,0.55),transparent)]" />
          </div>

          <div className="srv-network-parallax">
            <div className="relative mx-auto mt-12 hidden aspect-[1/1.14] w-full max-w-5xl md:mt-16 md:block">
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="desktopHubGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#124D95" stopOpacity="0.6" />
                    <stop offset="55%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop
                      offset="100%"
                      stopColor="#60A5FA"
                      stopOpacity="0.55"
                    />
                  </linearGradient>
                  <linearGradient
                    id="desktopClientGradient"
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                <path
                  className="srv-desktop-line"
                  d="M50 50 Q50 31 50 11"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-line"
                  d="M50 50 Q35 41 19 28"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-line"
                  d="M50 50 Q65 41 81 28"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-line"
                  d="M50 50 Q34 59 16 64"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-line"
                  d="M50 50 Q66 59 84 64"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-line"
                  d="M50 50 Q42 67 36 79"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.22"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />

                <path
                  className="srv-desktop-line"
                  d="M19 28 Q50 10 81 28"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.14"
                  fill="none"
                  strokeDasharray="0.9 1.3"
                  strokeLinecap="round"
                  opacity="0.22"
                />
                <path
                  className="srv-desktop-line"
                  d="M16 64 Q26 74 36 79"
                  stroke="url(#desktopHubGradient)"
                  strokeWidth="0.14"
                  fill="none"
                  strokeDasharray="0.9 1.3"
                  strokeLinecap="round"
                  opacity="0.2"
                />

                <path
                  className="srv-desktop-end-line"
                  d="M16 64 Q28 82 50 93"
                  stroke="url(#desktopClientGradient)"
                  strokeWidth="0.24"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-end-line"
                  d="M84 64 Q72 82 50 93"
                  stroke="url(#desktopClientGradient)"
                  strokeWidth="0.24"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
                <path
                  className="srv-desktop-end-line"
                  d="M36 79 Q41 88 50 93"
                  stroke="url(#desktopClientGradient)"
                  strokeWidth="0.24"
                  fill="none"
                  strokeDasharray="1.2 1.2"
                  strokeLinecap="round"
                />
              </svg>

              <div
                ref={desktopHubRef}
                className="srv-desktop-hub absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] backdrop-blur-xl"
              >
                <img
                  src="/logo_trans.svg"
                  alt="Saca Logistics Logo"
                  className="max-h-[110px] max-w-[110px]"
                  style={{ display: "block", margin: "auto" }}
                />
              </div>

              {SERVICES_DATA.map((service) => (
                <ServiceNode
                  key={service.id}
                  service={service}
                  layout={DESKTOP_NODE_LAYOUT[service.id]}
                  className="srv-desktop-node"
                  onClick={setActiveService}
                />
              ))}

              <EndCustomerNode />
            </div>

            <div
              className="relative mt-10 w-full md:hidden"
              style={{ height: "860px" }}
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
                  <linearGradient
                    id="mobileClientGradient"
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.78" />
                    <stop
                      offset="100%"
                      stopColor="#06B6D4"
                      stopOpacity="0.92"
                    />
                  </linearGradient>
                </defs>

                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="304"
                  x2="50%"
                  y2="74"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="304"
                  x2="18%"
                  y2="190"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="304"
                  x2="82%"
                  y2="190"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="304"
                  x2="18%"
                  y2="430"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="304"
                  x2="82%"
                  y2="430"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="304"
                  x2="49%"
                  y2="588"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  opacity="0"
                />

                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="74"
                  x2="18%"
                  y2="190"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="74"
                  x2="82%"
                  y2="190"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="18%"
                  y1="190"
                  x2="82%"
                  y2="190"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="18%"
                  y1="430"
                  x2="34%"
                  y2="588"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-line"
                  x1="50%"
                  y1="588"
                  x2="50%"
                  y2="714"
                  stroke="url(#mobileLineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0"
                />

                <line
                  className="srv-mobile-end-line"
                  x1="18%"
                  y1="430"
                  x2="50%"
                  y2="742"
                  stroke="url(#mobileClientGradient)"
                  strokeWidth="1.6"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-end-line"
                  x1="82%"
                  y1="430"
                  x2="50%"
                  y2="742"
                  stroke="url(#mobileClientGradient)"
                  strokeWidth="1.6"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-end-line"
                  x1="34%"
                  y1="588"
                  x2="50%"
                  y2="742"
                  stroke="url(#mobileClientGradient)"
                  strokeWidth="1.6"
                  strokeDasharray="6 4"
                  opacity="0"
                />
                <line
                  className="srv-mobile-end-line"
                  x1="66%"
                  y1="588"
                  x2="50%"
                  y2="742"
                  stroke="url(#mobileClientGradient)"
                  strokeWidth="1.6"
                  strokeDasharray="6 4"
                  opacity="0"
                />
              </svg>

              <div
                ref={mobileHubRef}
                className="srv-mobile-hub absolute left-1/2 top-[264px] flex h-28 w-28 -translate-x-1/2 items-center justify-center opacity-0"
              >
                <img
                  src="/logo_trans.svg"
                  alt="Saca Logistics Logo"
                  className="max-h-[70px] max-w-[70px]"
                  style={{ display: "block", margin: "auto" }}
                />
              </div>

              {SERVICES_DATA.map((service) => (
                <ServiceNode
                  key={service.id}
                  service={service}
                  layout={MOBILE_NODE_LAYOUT[service.id]}
                  className="srv-mobile-node"
                  onClick={setActiveService}
                />
              ))}

              <EndCustomerNode mobile />
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
                  activeService === 1 || activeService === 6
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
                                className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12]"
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
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                              <img
                                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070&auto=format&fit=crop"
                                alt="Global shipping"
                                className="absolute inset-0 h-full w-full object-cover"
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
                ) : activeService === 6 && activeServiceData ? (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#071420_0%,#0F3C74_52%,#0D5FA9_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_12%_18%,rgba(6,182,212,0.20),transparent_34%),radial-gradient(520px_circle_at_86%_80%,rgba(37,99,235,0.16),transparent_30%)]" />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                        backgroundSize: "46px 46px",
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
                      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.06fr_0.94fr] lg:gap-8">
                        <div className="min-w-0">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white/90 backdrop-blur-sm">
                            <Megaphone className="h-4 w-4 text-[#22D3EE]" />
                            Integrated commerce add-on
                          </span>

                          <div className="mt-5">
                            <div className="text-[11px] font-medium uppercase tracking-[0.26em] text-white/60">
                              {activeServiceData.eyebrow}
                            </div>

                            <h3
                              id="modal-title"
                              className="mt-3 text-3xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-4xl"
                            >
                              Build demand{" "}
                              <span className="text-[#67E8F9]">
                                before the first pallet moves.
                              </span>
                            </h3>

                            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                              This pillar is designed as an add-on to the core
                              logistics engine, not a disconnected agency
                              service. It is ideal when a product is being
                              introduced through networking, new market entry or
                              a launch phase that needs a serious digital
                              presence before scaling into a full commerce
                              platform.
                            </p>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <div className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm text-white/85 backdrop-blur-xl">
                              Custom-coded launch pages
                            </div>
                            <div className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm text-white/85 backdrop-blur-xl">
                              E-commerce builds & migrations
                            </div>
                            <div className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-sm text-white/85 backdrop-blur-xl">
                              Google Ads, SEO & creative production
                            </div>
                          </div>

                          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {DIGITAL_GROWTH_FEATURES.map((item) => (
                              <div
                                key={item.title}
                                className="rounded-[22px] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl"
                              >
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                  <item.icon className="h-5 w-5 text-[#67E8F9]" />
                                </div>
                                <h4 className="mt-4 text-sm font-semibold text-white">
                                  {item.title}
                                </h4>
                                <p className="mt-2 text-sm leading-6 text-white/68">
                                  {item.text}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6">
                            <Button
                              size="lg"
                              className="group rounded-full bg-[linear-gradient(90deg,#06B6D4,#0EA5E9)] px-8 py-6 text-white shadow-[0_18px_40px_rgba(6,182,212,0.28)] transition-all duration-300 hover:shadow-[0_22px_48px_rgba(6,182,212,0.34)]"
                              onClick={scrollToContactAndClose}
                            >
                              <span className="flex items-center gap-2">
                                Let’s Build Your Commerce Engine
                                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </Button>
                          </div>
                        </div>

                        <div className="relative min-w-0">
                          <div className="relative overflow-hidden rounded-[28px] border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                              <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop"
                                alt="Website and digital growth"
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#071420]/82 via-[#071420]/18 to-transparent" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(103,232,249,0.24),transparent_24%)]" />
                            </div>
                          </div>

                          <div className="absolute -left-3 top-5 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:-left-4 sm:p-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#06B6D4,#2563EB)] shadow-[0_12px_28px_rgba(6,182,212,0.25)]">
                                <Monitor className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <p className="text-base font-bold text-[#0F3C74]">
                                  Pre-launch → Store
                                </p>
                                <p className="text-xs text-slate-500">
                                  One staged growth path
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute -bottom-4 right-2 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.22)] sm:-right-3 sm:p-5">
                            <div className="flex items-center gap-3">
                              <Search className="h-7 w-7 text-[#06B6D4]" />
                              <div>
                                <p className="text-base font-bold text-[#0F3C74]">
                                  Traffic + trust
                                </p>
                                <p className="text-xs text-slate-500">
                                  Ads, SEO and content
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="absolute -bottom-6 -right-6 -z-10 h-28 w-28 rounded-3xl bg-[#06B6D4]/20 blur-2xl" />
                          <div className="absolute -left-6 -top-6 -z-10 h-24 w-24 rounded-3xl bg-[#2563EB]/18 blur-2xl" />
                        </div>
                      </div>
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
