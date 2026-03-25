"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "Why Us", href: "#why-us" },
  { label: "Services", href: "#services" },
  { label: "Global Logistics", href: "#global" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Contact", href: "#contact" },
];

const sectionIds = [
  "hero",
  "why-us",
  "services",
  "global",
  "infrastructure",
  "contact",
] as const;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuOpenBtnRef = useRef<HTMLButtonElement>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const headerVisibleRef = useRef(false);

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const isMenuOpenRef = useRef(isMenuOpen);
  isMenuOpenRef.current = isMenuOpen;

  /* ── Portal target ── */
  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  /* ── Show/hide header on scroll (hidden on load, revealed after scrolling past 60px) ── */
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.set(header, { yPercent: -110 });

    const show = () => {
      if (headerVisibleRef.current) return;
      headerVisibleRef.current = true;
      gsap.to(header, {
        yPercent: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const hide = () => {
      if (!headerVisibleRef.current || isMenuOpenRef.current) return;
      headerVisibleRef.current = false;
      gsap.to(header, {
        yPercent: -110,
        duration: 0.4,
        ease: "power2.in",
      });
    };

    const onScroll = () => {
      if (window.scrollY > 60) {
        show();
      } else {
        hide();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section tracking ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-32% 0px -52% 0px", threshold: [0.1, 0.2, 0.35, 0.5] },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── Menu overlay GSAP timeline ── */
  useEffect(() => {
    if (!portalTarget || !overlayRef.current) return;
    const root = overlayRef.current;

    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 0 });
      gsap.set(".menu-inner", { autoAlpha: 0, y: 20 });
      gsap.set(".menu-link", { autoAlpha: 0, y: 28, filter: "blur(6px)" });
      gsap.set(".menu-cta", { autoAlpha: 0, y: 16 });

      openTimelineRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .to(root, { autoAlpha: 1, duration: 0.25, ease: "power2.out" })
        .to(".menu-inner", { autoAlpha: 1, y: 0, duration: 0.35 }, 0.02)
        .to(
          ".menu-link",
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.5,
            stagger: 0.05,
          },
          0.08,
        )
        .to(".menu-cta", { autoAlpha: 1, y: 0, duration: 0.4 }, 0.25);
    }, root);

    return () => {
      ctx.revert();
      openTimelineRef.current = null;
    };
  }, [portalTarget]);

  /* ── Lock/unlock body scroll while menu is open ── */
  useEffect(() => {
    const mainEl = document.querySelector("main");

    if (!isMenuOpen) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      mainEl?.removeAttribute("inert");
      return;
    }

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    mainEl?.setAttribute("inert", "");
    openTimelineRef.current?.play(0);
  }, [isMenuOpen]);

  /* ── Restore body on unmount ── */
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.querySelector("main")?.removeAttribute("inert");
    };
  }, []);

  /* ── Close menu (animated reverse) ── */
  const closeMenu = useCallback((opts?: { focusTrigger?: boolean }) => {
    if (!isMenuOpenRef.current) {
      if (opts?.focusTrigger)
        queueMicrotask(() => menuOpenBtnRef.current?.focus());
      return;
    }
    const tl = openTimelineRef.current;
    if (!tl) {
      setIsMenuOpen(false);
      if (opts?.focusTrigger)
        queueMicrotask(() => menuOpenBtnRef.current?.focus());
      return;
    }
    tl.eventCallback("onReverseComplete", () => {
      setIsMenuOpen(false);
      if (opts?.focusTrigger)
        queueMicrotask(() => menuOpenBtnRef.current?.focus());
    });
    tl.reverse();
  }, []);

  const openMenu = useCallback(() => {
    openTimelineRef.current?.eventCallback("onReverseComplete", null);
    setIsMenuOpen(true);
  }, []);

  /* ── Escape key ── */
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu({ focusTrigger: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen, closeMenu]);

  /* ── Scroll to section ── */
  const scrollToSection = useCallback(
    (href: string) => {
      const el = document.querySelector(href);
      if (!el) return;
      closeMenu();
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [closeMenu],
  );

  return (
    <>
      {/* ── Floating pill header ── */}
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <div className="relative flex w-full max-w-md items-center justify-between gap-4 rounded-full border border-white/12 bg-[rgba(8,14,28,0.72)] px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
          {/* Subtle top highlight */}
          <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_trans-9QtDf9f8VqN0uSrRU2qmGBdv3uyoyp.png"
                alt="SACA Logistics Logo"
                fill
                sizes="36px"
                className="object-contain p-1"
                priority
              />
            </div>
            <span className="text-[0.85rem] font-semibold tracking-[0.16em] text-white">
              SACA{" "}
              <span className="text-[#A9C8FF]">LOGISTICS</span>
            </span>
          </Link>

          <button
            ref={menuOpenBtnRef}
            type="button"
            onClick={openMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="site-navigation-dialog"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {/* ── Full-screen menu overlay ── */}
      {portalTarget
        ? createPortal(
            <div
              ref={overlayRef}
              id="site-navigation-dialog"
              role="dialog"
              aria-modal={isMenuOpen}
              aria-hidden={!isMenuOpen}
              aria-label="Site navigation"
              inert={!isMenuOpen ? true : undefined}
              className="fixed inset-0 z-100 bg-[rgba(5,10,21,0.96)] backdrop-blur-2xl"
            >
              {/* Background click closes menu */}
              <button
                type="button"
                aria-label="Close menu"
                className="absolute inset-0 z-0 cursor-default bg-transparent"
                onClick={() => closeMenu()}
              />

              {/* Ambient radial glow */}
              <div className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(600px_circle_at_50%_20%,rgba(56,98,255,0.14),transparent_60%)]" />

              <div
                className="menu-inner relative z-2 mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 py-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button row */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => closeMenu({ focusTrigger: true })}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation links */}
                <nav className="mt-12 flex flex-1 flex-col justify-center gap-1 sm:mt-16">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.href.slice(1);
                    return (
                      <button
                        key={item.label}
                        onClick={() => scrollToSection(item.href)}
                        className="menu-link group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-white/5"
                      >
                        {/* Active dot indicator */}
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-[#A9C8FF] shadow-[0_0_10px_rgba(169,200,255,0.6)]"
                              : "bg-white/15"
                          }`}
                        />
                        <span
                          className={`text-[1.6rem] font-medium tracking-[-0.02em] transition-colors duration-200 sm:text-[2rem] ${
                            isActive
                              ? "text-white"
                              : "text-white/50 group-hover:text-white/90"
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Single CTA */}
                <div className="menu-cta pb-4 pt-8">
                  <Button
                    className="w-full rounded-full bg-linear-to-r from-[#F6BF58] to-[#E4A22A] py-6 text-sm font-semibold tracking-wide text-[#08101E] shadow-[0_12px_36px_rgba(228,162,42,0.25)]"
                    onClick={() => scrollToSection("#contact")}
                  >
                    Request a Quote
                  </Button>
                </div>
              </div>
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
