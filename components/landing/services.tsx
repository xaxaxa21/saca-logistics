"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";
import { servicesCardsData } from "@/lib/services-cards-data";
import { ServiceCardView } from "@/components/landing/service-card-view";

gsap.registerPlugin(ScrollTrigger);

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const q = gsap.utils.selector(section);

      /* ── Section header entrance ── */
      gsap.fromTo(
        q(".services-badge"),
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        q(".services-title-word"),
        { opacity: 0, y: reduce ? 16 : 60, rotateX: reduce ? 0 : -45 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        q(".services-subtitle"),
        {
          opacity: 0,
          y: reduce ? 10 : 30,
          filter: reduce ? "none" : "blur(5px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* ── Per-card scroll reveal ── */
      const cards = q(".svc-card");
      cards.forEach((card: HTMLElement, i: number) => {
        const isEven = i % 2 === 0;
        const imgEl = card.querySelector(".svc-card-img");
        const textEls = card.querySelectorAll(".svc-card-anim");
        const ruleEl = card.querySelector(".svc-card-rule");

        const xDir = reduce ? 0 : isEven ? -60 : 60;

        if (imgEl) {
          gsap.fromTo(
            imgEl,
            {
              opacity: 0,
              x: xDir,
              scale: reduce ? 1 : 0.92,
              filter: reduce ? "none" : "blur(8px)",
            },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: reduce ? 0.4 : 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        if (textEls.length > 0) {
          gsap.fromTo(
            textEls,
            {
              opacity: 0,
              y: reduce ? 8 : 28,
            },
            {
              opacity: 1,
              y: 0,
              duration: reduce ? 0.3 : 0.7,
              stagger: reduce ? 0.04 : 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        if (ruleEl) {
          gsap.fromTo(
            ruleEl,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: reduce ? 0.3 : 0.8,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });

      /* ── Ambient background shape drift ── */
      if (!reduce) {
        gsap.to(q(".service-bg-shape-1"), {
          y: -30,
          x: 20,
          rotation: 15,
          duration: 6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        gsap.to(q(".service-bg-shape-2"), {
          y: 25,
          x: -15,
          rotation: -10,
          duration: 8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, section);

    return () => ctx.revert();
  }, [reduceMotion]);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-[#124D95] py-20 md:py-28 lg:py-32"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[min(600px,120vw)] w-[min(600px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3988EA]/20 blur-[120px] md:blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[min(500px,100vw)] w-[min(500px,100vw)] translate-x-1/4 translate-y-1/4 rounded-full bg-[#0a1628]/50 blur-[100px] md:blur-[120px]" />
        <div className="service-bg-shape-1 absolute right-4 top-1/4 h-24 w-24 rounded-3xl border border-white/10 md:right-10 md:h-32 md:w-32" />
        <div className="service-bg-shape-2 absolute bottom-1/4 left-4 h-20 w-20 rounded-2xl bg-white/5 md:left-10 md:h-24 md:w-24" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <div
          ref={titleRef}
          className="mx-auto mb-14 max-w-4xl text-center md:mb-20"
          style={{ perspective: "1000px" }}
        >
          <span className="services-badge mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm md:mb-8">
            <Sparkles className="h-4 w-4 text-[#F5A623]" aria-hidden />
            Our Services
          </span>

          <h2 className="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl md:mb-8 md:text-5xl lg:text-6xl">
            <span className="services-title-word inline-block">
              Operational
            </span>{" "}
            <span className="services-title-word inline-block">
              Expertise.
            </span>{" "}
            <span className="services-title-word inline-block text-[#3988EA]">
              Proven
            </span>{" "}
            <span className="services-title-word inline-block text-[#3988EA]">
              Execution.
            </span>
          </h2>

          <p className="services-subtitle mx-auto max-w-3xl text-base leading-relaxed text-white/80 lg:text-xl">
            Led by Warehouse Directors & Operations Managers with{" "}
            <span className="relative inline-block">
              <span className="font-bold text-[#3988EA]">12+ years</span>
              <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-linear-to-r from-[#3988EA] to-transparent" />
            </span>{" "}
            of hands-on experience.
          </p>
        </div>

        {/* ── Service cards — stacked scroll reveals ── */}
        <div className="flex flex-col gap-14 md:gap-20">
          {servicesCardsData.map((service, index) => (
            <ServiceCardView
              key={service.id}
              service={service}
              index={index}
              variant="section"
              onCtaClick={scrollToContact}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
