"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const metrics = [
  { value: "24/7", label: "Structured Execution", color: "#3988EA" },
  { value: "4x", label: "Integrated Services", color: "#124D95", countTo: 4 },
  { value: "B2B", label: "Retail / FMCG / E-com", color: "#F5A623" },
] as const;

export function BufferTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const metricRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /* Initial hidden states */
      gsap.set(q(".buffer-rule"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(q(".buffer-metric"), {
        autoAlpha: 0,
        y: reduce ? 12 : 50,
        scale: reduce ? 1 : 0.92,
      });
      gsap.set(q(".buffer-label"), {
        autoAlpha: 0,
        y: reduce ? 8 : 24,
        filter: reduce ? "none" : "blur(6px)",
      });
      gsap.set(q(".buffer-divider"), { autoAlpha: 0, y: 20 });

      /* Shared entrance tween builder */
      const buildEntrance = (tl: gsap.core.Timeline) => {
        tl.to(
          q(".buffer-rule"),
          {
            scaleX: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power2.inOut",
          },
          0,
        )
          .to(
            q(".buffer-metric"),
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
            },
            0.2,
          )
          .to(
            q(".buffer-label"),
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
            },
            0.45,
          )
          .to(
            q(".buffer-divider"),
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            0.6,
          );
      };

      /* Mobile: instant toggle (no per-frame scrub work) / Desktop: smooth scrub */
      const mm = gsap.matchMedia();
      mm.add("(pointer: coarse)", () => {
        buildEntrance(
          gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }),
        );
      });
      mm.add("(pointer: fine)", () => {
        buildEntrance(
          gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              end: "top 35%",
              scrub: reduce ? false : 0.5,
              toggleActions: reduce ? "play none none reverse" : undefined,
            },
          }),
        );
      });

      /* Animated metric values — fire once when scrolled into view */
      if (!reduce) {
        ScrollTrigger.create({
          trigger: root,
          start: "top 75%",
          once: true,
          onEnter: () => {
            /* "24/7" — scramble through digits */
            const m0 = metricRefs.current[0];
            if (m0) {
              gsap.to(m0, {
                duration: 1.5,
                scrambleText: {
                  text: "24/7",
                  chars: "0123456789/",
                  speed: 0.5,
                },
              });
            }

            /* "4x" — count up from 0 */
            const m1 = metricRefs.current[1];
            if (m1) {
              const counter = { val: 0 };
              gsap.to(counter, {
                val: 4,
                duration: 1.8,
                ease: "power2.out",
                onUpdate: () => {
                  m1.textContent = Math.round(counter.val) + "x";
                },
              });
            }

            /* "B2B" — scramble through letters */
            const m2 = metricRefs.current[2];
            if (m2) {
              gsap.to(m2, {
                duration: 1.75,
                scrambleText: {
                  text: "B2B / B2C",
                  chars: "C2B / BB2",
                  speed: 0.3,
                },
              });
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        /* Extended dark zone so metric content stays readable on all screens */
        background:
          "linear-gradient(180deg, #124D95 0%, #0e3570 40%, #1a5aaf 65%, #f8f9fb 85%, #ffffff 100%)",
      }}
    >
      {/* Swiss grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(#3988EA 1px, transparent 1px), linear-gradient(90deg, #3988EA 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content — positioned within the dark zone */}
      <div className="relative z-10 mx-auto max-w-[1120px] px-4 pb-32 pt-20 sm:px-10 sm:pb-36 sm:pt-28 lg:px-16 lg:pb-44 lg:pt-32">
        {/* 3-column grid — horizontal on ALL screens for dark-zone consistency */}
        <div className="grid grid-cols-3 gap-3 sm:gap-8 lg:gap-16">
          {metrics.map((m, i) => (
            <div key={m.value} className="group text-center sm:text-left">
              {/* Accent rule */}
              <div
                className="buffer-rule mx-auto mb-3 h-[2px] sm:mx-0 sm:mb-6"
                style={{
                  background: `linear-gradient(90deg, ${m.color}, transparent)`,
                }}
              />

              {/* Metric value — animated on scroll */}
              <div className="buffer-metric font-semibold tracking-[-0.04em]">
                <span
                  ref={(el) => {
                    metricRefs.current[i] = el;
                  }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
                  style={{ color: m.color }}
                >
                  {m.value}
                </span>
              </div>

              {/* Label */}
              <p className="buffer-label mt-2 font-mono text-[8px] uppercase leading-tight tracking-[0.16em] text-white/40 sm:mt-3 sm:text-[11px] sm:tracking-[0.22em]">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SVG wave divider — smooth visual transition to next section */}
      <div className="buffer-divider absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block h-12 w-full sm:h-16 lg:h-20"
          fill="none"
        >
          <path
            d="M0,55 C320,15 480,70 720,35 C960,0 1200,50 1440,25 L1440,80 L0,80 Z"
            fill="white"
          />
          <path
            d="M0,55 C320,15 480,70 720,35 C960,0 1200,50 1440,25"
            stroke="rgba(57,136,234,0.15)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
}
