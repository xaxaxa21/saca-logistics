"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import {
  GraduationCap,
  BarChart3,
  ClipboardCheck,
  LineChart,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin);

const roles = [
  {
    icon: GraduationCap,
    title: "Logistic Trainer",
    color: "#3988EA",
    intro:
      "Our logistics training function is led by professionals with over 10 years of experience in large-scale logistics centers with operational teams exceeding 200 employees.",
    bullets: [
      "Onboarding and operational training programs",
      "Mentoring and workforce development",
      "Performance improvement initiatives",
      "SOP implementation and operational discipline",
      "Continuous operational coaching for warehouse teams",
    ],
    outro:
      "This ensures that operational standards remain consistent and scalable as operations grow.",
  },
  {
    icon: BarChart3,
    title: "Capacity Planner",
    color: "#124D95",
    intro:
      "Our Capacity Planning function analyzes operational demand and resource availability to ensure optimal logistics performance.",
    bullets: [
      "Demand forecasting and workload analysis",
      "Warehouse capacity planning (space, workforce, equipment)",
      "Operational resource allocation",
      "Ensuring sufficient capacity to meet customer needs efficiently",
    ],
    outro:
      "This role is essential for maintaining balanced and efficient logistics operations.",
  },
  {
    icon: ClipboardCheck,
    title: "Stock Controller",
    color: "#F5A623",
    intro:
      "Our Stock Controllers are responsible for maintaining accurate inventory records and ensuring full alignment between physical goods and digital systems.",
    bullets: [
      "Monitoring stock levels and movements",
      "Cycle counts and inventory verification",
      "Discrepancy investigation and resolution",
      "Ensuring system accuracy across WMS and ERP platforms",
    ],
    outro:
      "This function ensures reliable stock visibility and operational continuity.",
  },
  {
    icon: LineChart,
    title: "Data Analyst / MIS Executive",
    color: "#3988EA",
    intro:
      "Data plays a central role in modern logistics operations. Our data analysis function supports operational decision-making.",
    bullets: [
      "KPI monitoring and performance reporting",
      "Operational data analysis",
      "Lead time and cost optimization",
      "Identifying process improvement opportunities",
    ],
    outro:
      "Through data-driven insights we continuously improve operational efficiency and service quality.",
  },
];

/* Per-card parallax speeds (subtle depth illusion) */
const cardSpeeds = [0.94, 0.97, 1.03, 1.06];

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardBodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chevronRefs = useRef<(HTMLDivElement | null)[]>([]);
  const expandedRef = useRef<number>(-1);

  /* ── Accordion (mobile only, imperative) ── */
  const openCard = useCallback((index: number) => {
    const body = cardBodyRefs.current[index];
    const chevron = chevronRefs.current[index];
    if (body) {
      gsap.to(body, { height: "auto", duration: 0.5, ease: "power3.out" });
      gsap.fromTo(
        body.querySelectorAll(".role-bullet"),
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.05,
          delay: 0.12,
          ease: "power2.out",
        },
      );
    }
    if (chevron)
      gsap.to(chevron, { rotation: 180, duration: 0.3, ease: "power2.out" });
  }, []);

  const closeCard = useCallback((index: number) => {
    const body = cardBodyRefs.current[index];
    const chevron = chevronRefs.current[index];
    if (body) {
      gsap.to(body.querySelectorAll(".role-bullet"), {
        autoAlpha: 0,
        y: 8,
        duration: 0.2,
        ease: "power2.in",
      });
      gsap.to(body, {
        height: 0,
        duration: 0.4,
        ease: "power3.inOut",
        delay: 0.1,
      });
    }
    if (chevron)
      gsap.to(chevron, { rotation: 0, duration: 0.3, ease: "power2.out" });
  }, []);

  const toggleCard = useCallback(
    (index: number) => {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      const prev = expandedRef.current;
      if (prev >= 0 && prev !== index) closeCard(prev);
      if (prev === index) {
        closeCard(index);
        expandedRef.current = -1;
      } else {
        openCard(index);
        expandedRef.current = index;
      }
    },
    [openCard, closeCard],
  );

  /* ── GSAP orchestration ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const cardsEl = cardsRef.current;

      /* ── "Operational Expertise" editorial animations ── */
      gsap.fromTo(
        ".expertise-label",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: reduce ? 0.3 : 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".expertise-word",
        {
          opacity: 0,
          y: reduce ? 16 : 50,
          rotateX: reduce ? 0 : -30,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: reduce ? 0.4 : 0.75,
          stagger: reduce ? 0.04 : 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".expertise-body",
        reduce
          ? { opacity: 0, y: 12 }
          : { opacity: 0, y: 28, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          ...(reduce ? {} : { filter: "blur(0px)" }),
          duration: reduce ? 0.4 : 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".expertise-bullet",
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: reduce ? 0.3 : 0.6,
          stagger: reduce ? 0.05 : 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".expertise-bullet",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".team-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: reduce ? 0.4 : 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".team-divider",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* ── Team section title word-by-word reveal ── */
      gsap.fromTo(
        ".team-title-word",
        {
          opacity: 0,
          y: reduce ? 16 : 40,
          rotateX: reduce ? 0 : -20,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: reduce ? 0.4 : 0.75,
          stagger: reduce ? 0.04 : 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* ── Subtitle + intro blur reveal ── */
      gsap.fromTo(
        ".team-intro",
        reduce
          ? { opacity: 0, y: 12 }
          : { opacity: 0, y: 24, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          ...(reduce ? {} : { filter: "blur(0px)" }),
          duration: reduce ? 0.4 : 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* ── Accent rule draw ── */
      gsap.fromTo(
        ".team-rule",
        { scaleX: 0, transformOrigin: "0% 50%" },
        {
          scaleX: 1,
          duration: reduce ? 0.4 : 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* ── Closing block reveal (once: true so it stays visible on mobile) ── */
      gsap.fromTo(
        ".team-closing",
        { opacity: 0, y: reduce ? 12 : 30 },
        {
          opacity: 1,
          y: 0,
          duration: reduce ? 0.4 : 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".team-closing",
            start: "top 92%",
            once: true,
          },
        },
      );

      /* ── matchMedia: desktop vs mobile ── */
      const mm = gsap.matchMedia();

      /* Desktop (768px+) */
      mm.add("(min-width: 768px)", () => {
        /* Card entrance */
        gsap.fromTo(
          ".team-card",
          {
            opacity: 0,
            y: reduce ? 20 : 60,
            scale: reduce ? 1 : 0.92,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: reduce ? 0.4 : 0.7,
            stagger: { each: reduce ? 0.05 : 0.12, from: "start" },
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsEl,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );

        if (reduce) return;

        /* Parallax depth per card */
        gsap.utils.toArray<HTMLElement>(".team-card").forEach((card, i) => {
          const speed = cardSpeeds[i] ?? 1;
          const shift = (speed - 1) * 80;
          gsap.to(card, {
            y: shift,
            ease: "none",
            scrollTrigger: {
              trigger: cardsEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });

        /* Inertia tilt on hover */
        const cleanups: Array<() => void> = [];
        gsap.utils.toArray<HTMLElement>(".team-card").forEach((card, idx) => {
          const wrap = card.querySelector<HTMLElement>(".team-icon-physics");
          const qRotX = gsap.quickTo(card, "rotationX", {
            duration: 0.4,
            ease: "power2.out",
          });
          const qRotY = gsap.quickTo(card, "rotationY", {
            duration: 0.4,
            ease: "power2.out",
          });

          const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
            qRotY(dx * 6);
            qRotX(-dy * 6);
          };

          const onLeave = () => {
            gsap.to(card, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.5)",
            });
          };

          card.addEventListener("pointermove", onMove, { passive: true });
          card.addEventListener("pointerleave", onLeave, { passive: true });
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });

          /* Physics2D icon toss on hover */
          if (!wrap) return;
          const angle = -52 + (idx % 4) * 22;
          const onEnter = () => {
            gsap.killTweensOf(wrap);
            gsap.fromTo(
              wrap,
              { x: 0, y: 0, rotation: 0 },
              {
                duration: 0.9,
                physics2D: {
                  velocity: 340,
                  angle,
                  gravity: 1350,
                  friction: 0.62,
                },
              },
            );
          };
          const onIconLeave = () => {
            gsap.killTweensOf(wrap);
            gsap.to(wrap, {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.48,
              ease: "power3.out",
              overwrite: true,
            });
          };
          card.addEventListener("pointerenter", onEnter);
          card.addEventListener("pointerleave", onIconLeave);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", onEnter);
            card.removeEventListener("pointerleave", onIconLeave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });

      /* Mobile (below 768px) */
      mm.add("(max-width: 767px)", () => {
        if (!cardsEl) return;
        const q = gsap.utils.selector(cardsEl);

        /* Collapse bodies for accordion */
        gsap.set(q(".team-card-body"), { height: 0, overflow: "hidden" });
        gsap.set(q(".role-bullet"), { autoAlpha: 0, y: 10 });

        /* Slide entrance */
        gsap.fromTo(
          ".team-card",
          { opacity: 0, x: reduce ? -12 : -40 },
          {
            opacity: 1,
            x: 0,
            duration: reduce ? 0.4 : 0.65,
            stagger: reduce ? 0.05 : 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsEl,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );

        if (!reduce) {
          /* Icon float */
          gsap.to(q(".team-icon-physics"), {
            y: -3,
            scale: 1.06,
            duration: 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.3, from: "random" },
          });

          /* Physics2D burst on tap */
          const cleanups: Array<() => void> = [];
          const lastBurst = new Map<HTMLElement, number>();
          gsap.utils.toArray<HTMLElement>(".team-card").forEach((card) => {
            const wrap = card.querySelector<HTMLElement>(".team-icon-physics");
            if (!wrap) return;
            const onDown = () => {
              const now = Date.now();
              if (now - (lastBurst.get(card) ?? 0) < 750) return;
              lastBurst.set(card, now);
              gsap.killTweensOf(wrap);
              gsap.fromTo(
                wrap,
                { x: 0, y: 0, rotation: 0 },
                {
                  duration: 0.58,
                  physics2D: {
                    velocity: 165,
                    angle: -48,
                    gravity: 950,
                    friction: 0.78,
                  },
                },
              );
            };
            card.addEventListener("pointerdown", onDown);
            cleanups.push(() =>
              card.removeEventListener("pointerdown", onDown),
            );
          });

          return () => cleanups.forEach((fn) => fn());
        }

        return () => {
          expandedRef.current = -1;
          if (!cardsEl) return;
          const q2 = gsap.utils.selector(cardsEl);
          gsap.set(q2(".team-card-body"), { clearProps: "height,overflow" });
          gsap.set(q2(".role-bullet"), {
            clearProps: "opacity,visibility,y",
          });
          q2(".team-card-chevron").forEach((el: Element) => {
            gsap.set(el, { rotation: 0 });
          });
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative overflow-hidden bg-white py-24 lg:py-36"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#3988EA]/4 blur-[140px]" />
        <div className="absolute -right-40 bottom-20 h-[600px] w-[600px] rounded-full bg-[#124D95]/4 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Accent rule */}
        <div className="team-rule mb-12 h-px w-full bg-linear-to-r from-[#3988EA] via-[#124D95]/25 to-transparent" />

        {/* ── "Operational Expertise. Proven Execution." editorial block ── */}
        <div className="mb-20 flex flex-col gap-10 lg:mb-28 lg:flex-row lg:gap-20">
          <div
            className="lg:w-[45%] lg:shrink-0"
            style={{ perspective: "1000px" }}
          >
            <span className="expertise-label mb-5 inline-block font-mono text-[11px] uppercase tracking-[0.28em] text-[#3988EA]">
              02 — Why Choose Us
            </span>

            <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-gray-900 sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
              <span className="expertise-word inline-block">Operational</span>{" "}
              <span className="expertise-word inline-block font-serif italic text-[#3988EA]">
                Expertise.
              </span>
              <br />
              <span className="expertise-word inline-block">Proven</span>{" "}
              <span className="expertise-word inline-block">Execution.</span>
            </h2>
          </div>

          <div className="flex-1">
            <div className="expertise-body">
              <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                At Saca Logistics, our strength lies in operational leadership,
                structured processes and a highly specialized logistics team.
                The company was built by professionals with extensive experience
                in warehouse management, FMCG distribution and large-scale
                logistics environments.
              </p>
              <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                Our leadership team brings more than a decade of hands-on
                experience in managing complex operations, scaling teams and
                optimizing high-volume warehouse workflows. This experience
                allows us to design logistics operations that are efficient,
                scalable and fully aligned with the needs of modern retail and
                e-commerce businesses.
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {[
                "Built by logistics operators with real warehouse leadership experience",
                "Certified logistics personnel and structured operational teams",
                "Experience in high-volume FMCG and retail distribution environments",
                "Operational governance through SOPs, KPIs and continuous improvement",
              ].map((b) => (
                <li
                  key={b}
                  className="expertise-bullet flex items-start gap-3 text-sm leading-relaxed text-gray-600 sm:text-base"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#F5A623]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider between editorial and team section ── */}
        <div className="team-divider mb-16 h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent" />

        {/* ── Operational Logistics Team header ── */}
        <div className="mb-16 max-w-3xl" style={{ perspective: "1000px" }}>
          <span className="team-intro mb-4 inline-block font-mono text-[11px] uppercase tracking-[0.28em] text-[#3988EA]">
            Our Team
          </span>

          <h2 className="text-3xl font-bold leading-tight tracking-[-0.02em] text-gray-900 sm:text-4xl lg:text-5xl">
            <span className="team-title-word inline-block">Operational</span>{" "}
            <span className="team-title-word inline-block font-serif italic text-[#3988EA]">
              Logistics
            </span>{" "}
            <span className="team-title-word inline-block">Team</span>
          </h2>

          <p className="team-intro mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[#F5A623]">
            A certified logistics team built for operational performance
          </p>

          <p className="team-intro mt-6 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
            Beyond infrastructure and systems, our biggest asset is our
            logistics team. Our operational staff includes certified
            professionals specialized in warehouse and supply chain management,
            ensuring structured execution, continuous improvement and
            operational reliability.
          </p>
        </div>

        {/* Cards grid */}
        <div ref={cardsRef}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {roles.map((role, index) => (
              <article
                key={role.title}
                className="team-card group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-400 hover:shadow-md md:cursor-default"
                style={{
                  perspective: "800px",
                  transformStyle: "preserve-3d",
                }}
                onClick={() => toggleCard(index)}
              >
                {/* Top accent line */}
                <div
                  className="absolute inset-x-0 top-0 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, ${role.color}, transparent)`,
                  }}
                />

                {/* Card number */}
                <span className="absolute right-5 top-5 font-mono text-[2.5rem] font-bold leading-none text-gray-100 md:text-[3.5rem]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Card header */}
                <div className="flex items-center gap-3.5 p-5 md:block md:p-7 md:pb-4">
                  {/* Icon with Physics2D */}
                  <div className="shrink-0 md:mb-5">
                    <div
                      className="team-icon-physics inline-block will-change-transform"
                      style={{ transformOrigin: "50% 50%" }}
                    >
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl border transition-shadow duration-400 group-hover:shadow-lg md:h-13 md:w-13"
                        style={{
                          backgroundColor: `${role.color}18`,
                          borderColor: `${role.color}30`,
                        }}
                      >
                        <role.icon
                          className="h-5 w-5 md:h-6 md:w-6"
                          style={{ color: role.color }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Title + chevron (mobile) */}
                  <div className="flex min-w-0 flex-1 items-center gap-2 md:block">
                    <h3 className="flex-1 text-[15px] font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-[#3988EA] md:text-lg">
                      {role.title}
                    </h3>
                    <div
                      ref={(el) => {
                        chevronRefs.current[index] = el;
                      }}
                      className="team-card-chevron shrink-0 text-gray-400 md:hidden"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Collapsible body — height:0 on mobile via GSAP, natural on desktop */}
                <div
                  ref={(el) => {
                    cardBodyRefs.current[index] = el;
                  }}
                  className="team-card-body"
                >
                  <div className="px-5 pb-5 md:px-7 md:pb-7">
                    <p className="role-bullet text-sm leading-relaxed text-gray-500">
                      {role.intro}
                    </p>

                    <ul className="mt-4 space-y-2.5">
                      {role.bullets.map((b) => (
                        <li
                          key={b}
                          className="role-bullet flex items-start gap-2.5 text-sm leading-relaxed text-gray-600"
                        >
                          <span
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: role.color }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>

                    <p className="role-bullet mt-4 text-sm leading-relaxed text-gray-400 italic">
                      {role.outro}
                    </p>
                  </div>
                </div>

                {/* Hover arrow — desktop only */}
                <div
                  className="absolute bottom-5 right-5 hidden h-8 w-8 translate-x-1 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:flex"
                  style={{ backgroundColor: `${role.color}15` }}
                >
                  <ArrowRight
                    className="h-4 w-4"
                    style={{ color: role.color }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Closing block */}
        <div className="team-closing mt-16 max-w-3xl">
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Logistics operations designed for{" "}
            <span className="text-[#3988EA]">growth</span>
          </h3>
          <p className="mt-4 text-base leading-relaxed text-gray-500 sm:text-lg">
            Our operational model is designed to support companies at different
            stages of development — from early market entry to complex
            distribution environments. Through a combination of experienced
            leadership, certified logistics personnel and structured operational
            processes, we provide logistics solutions that adapt to the evolving
            needs of our clients.
          </p>
        </div>
      </div>
    </section>
  );
}
