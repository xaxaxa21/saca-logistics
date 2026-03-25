"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(MorphSVGPlugin, CustomEase);

const SESSION_KEY_DEFAULT = "site-intro-played";

// ── HEAD morph chain (circle rising upward in 2 smooth steps) ──
const HEAD_START =
  "M400 232C487 232 554 299 554 386C554 473 487 540 400 540C313 540 246 473 246 386C246 299 313 232 400 232Z";
const HEAD_B =
  "M400 153C486 153 554 221 554 307C554 393 486 461 400 461C314 461 246 393 246 307C246 221 314 153 400 153Z";
const HEAD_FINAL =
  "M400 74C485 74 554 143 554 228C554 313 485 382 400 382C315 382 246 313 246 228C246 143 315 74 400 74Z";

// ── CORE morph chain (hexagon unfurling into body with legs) ──
const CORE_START =
  "M352 338L448 338L502 392L468 496L332 496L298 392L352 338Z";
const CORE_B =
  "M320 374L480 374L500 396L468 580L400 680L332 580L300 396L320 374Z";
const CORE_FINAL =
  "M300 396C334 388 466 388 500 396L460 474L496 654L400 790L304 654L340 474L300 396Z";

// ── LEFT ARM morph chain (angular shape sweeping outward) ──
const LEFT_START =
  "M278 386L352 336L336 426L278 474L222 420L278 386Z";
const LEFT_B =
  "M174 430L286 380L262 490L298 594L252 660L104 515L174 430Z";
const LEFT_FINAL =
  "M122 453L253 402L223 522L307 657L256 752L80 558L122 453Z";

// ── RIGHT ARM morph chain (mirrors left arm) ──
const RIGHT_START =
  "M522 386L448 336L464 426L522 474L578 420L522 386Z";
const RIGHT_B =
  "M626 430L514 380L538 490L502 594L548 660L696 515L626 430Z";
const RIGHT_FINAL =
  "M678 453L547 402L577 522L493 657L544 752L720 558L678 453Z";

// ── TIE morph chain (narrow strip elongating into full tie) ──
const TIE_START =
  "M384 326L416 326L448 380L428 486L372 486L352 380L384 326Z";
const TIE_B =
  "M375 400L425 400L448 434L430 540L440 620L400 720L360 620L370 540L352 434L375 400Z";
const TIE_FINAL =
  "M370 430L430 430L448 454L426 502L451 648L400 788L349 648L374 502L352 454L370 430Z";

// Particle burst
const PARTICLES = [
  { cx: 400, cy: 400, r: 3.5 },
  { cx: 400, cy: 400, r: 2.5 },
  { cx: 400, cy: 400, r: 2.8 },
  { cx: 400, cy: 400, r: 2.2 },
  { cx: 400, cy: 400, r: 3.2 },
  { cx: 400, cy: 400, r: 2.4 },
  { cx: 400, cy: 400, r: 2.6 },
  { cx: 400, cy: 400, r: 3.1 },
  { cx: 400, cy: 400, r: 2.3 },
  { cx: 400, cy: 400, r: 2.7 },
  { cx: 400, cy: 400, r: 2.1 },
  { cx: 400, cy: 400, r: 2.9 },
];
const PARTICLE_X = [
  -180, -120, -70, -28, 36, 88, 124, 168, -148, -92, 102, 142,
];
const PARTICLE_Y = [
  -56, -122, -168, -136, -150, -112, -44, 18, 98, 142, 110, 64,
];
const PARTICLE_SCALE = [
  1.2, 0.9, 1, 0.8, 1.1, 0.95, 0.9, 1.05, 0.85, 1, 0.9, 1.15,
];

export interface IntroGateProps {
  children: React.ReactNode;
  sessionKey?: string;
  logoPath?: string;
}

/**
 * Full-screen intro that morphs 5 geometric shapes into a suited-person
 * silhouette through 2 graduated steps per piece, then crossfades to
 * the raster logo. Plays once per session (~2.5s).
 */
export default function IntroGate({
  children,
  sessionKey = SESSION_KEY_DEFAULT,
  logoPath = "/logo_trans.svg",
}: IntroGateProps) {
  const [hydrated, setHydrated] = useState(false);
  const [playIntro, setPlayIntro] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const stageWrapRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<SVGGElement | null>(null);
  const glowRef = useRef<SVGGElement | null>(null);
  const ringsRef = useRef<SVGGElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const logoHaloRef = useRef<HTMLDivElement | null>(null);
  const headRef = useRef<SVGPathElement | null>(null);
  const coreRef = useRef<SVGPathElement | null>(null);
  const leftRef = useRef<SVGPathElement | null>(null);
  const rightRef = useRef<SVGPathElement | null>(null);
  const tieRef = useRef<SVGPathElement | null>(null);
  const morphSvgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setHydrated(true);
    try {
      if (!sessionStorage.getItem(sessionKey)) {
        setPlayIntro(true);
      }
    } catch {
      /* private mode — skip intro */
    }
  }, [sessionKey]);

  useEffect(() => {
    if (!playIntro) return;
    const html = document.documentElement;
    const body = document.body;
    const prevH = html.style.overflow;
    const prevB = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevH;
      body.style.overflow = prevB;
    };
  }, [playIntro]);

  useLayoutEffect(() => {
    if (!playIntro) return;

    let cancelled = false;
    let tl: gsap.core.Timeline | null = null;
    let raf1 = 0;
    let raf2 = 0;

    const markDone = () => {
      if (cancelled) return;
      try {
        sessionStorage.setItem(sessionKey, "1");
      } catch {
        /* quota / private */
      }
      setPlayIntro(false);
    };

    const ready = () =>
      !!(
        overlayRef.current &&
        stageWrapRef.current &&
        stageRef.current &&
        headRef.current &&
        coreRef.current &&
        leftRef.current &&
        rightRef.current &&
        tieRef.current &&
        glowRef.current &&
        ringsRef.current &&
        logoRef.current &&
        logoHaloRef.current &&
        morphSvgRef.current
      );

    const run = () => {
      if (cancelled || !ready()) return;

      // Silk-smooth eases tuned for vertex interpolation
      CustomEase.create("intro-silk", "0.25, 0.1, 0.25, 1");
      CustomEase.create("intro-settle", "0.19, 0.85, 0.22, 1");
      CustomEase.create("intro-bloom", "0.25, 0.88, 0.22, 1");
      CustomEase.create("intro-exit", "0.33, 0.01, 0.08, 1");

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      const overlay = overlayRef.current!;
      const stageWrap = stageWrapRef.current!;
      const stage = stageRef.current!;
      const morphSvg = morphSvgRef.current!;
      const head = headRef.current!;
      const core = coreRef.current!;
      const left = leftRef.current!;
      const right = rightRef.current!;
      const tie = tieRef.current!;
      const logo = logoRef.current!;
      const halo = logoHaloRef.current!;
      const glow = glowRef.current!;

      const particles = gsap.utils.toArray<SVGCircleElement>(
        ".intro-particle",
        overlay,
      );
      const rings = gsap.utils.toArray<SVGCircleElement>(
        ".intro-ring",
        overlay,
      );

      const allPaths = [head, core, left, right, tie];

      // ── Initial states ──
      gsap.set(overlay, { opacity: 1 });
      gsap.set(stageWrap, {
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        force3D: true,
      });
      gsap.set(morphSvg, { willChange: "opacity", force3D: true });
      gsap.set(stage, {
        transformOrigin: "50% 50%",
        svgOrigin: "400 400",
        opacity: 0,
        scale: mobile ? 0.82 : 0.76,
        y: mobile ? 20 : 34,
        rotation: mobile ? -4 : -6,
      });
      gsap.set(allPaths, {
        transformOrigin: "50% 50%",
        svgOrigin: "400 400",
        strokeOpacity: 0.9,
      });
      gsap.set(glow, {
        scale: 0.65,
        opacity: 0,
        transformOrigin: "50% 50%",
        svgOrigin: "400 400",
      });
      gsap.set(rings, {
        scale: 0.35,
        opacity: 0,
        transformOrigin: "50% 50%",
        svgOrigin: "400 400",
      });
      gsap.set(particles, {
        opacity: 0,
        scale: 0,
        transformOrigin: "50% 50%",
        svgOrigin: "400 400",
      });
      gsap.set(halo, {
        opacity: 0,
        scale: 0.88,
        transformOrigin: "50% 50%",
        force3D: true,
      });
      gsap.set(logo, {
        opacity: 0,
        scale: mobile ? 0.94 : 0.9,
        transformOrigin: "50% 50%",
        force3D: true,
      });

      // ── Reduced-motion path ──
      if (prefersReduced) {
        tl = gsap
          .timeline({ onComplete: markDone })
          .to(stage, {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(
            logo,
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
            0.1,
          )
          .to(
            overlay,
            { opacity: 0, duration: 0.4, ease: "power1.out" },
            0.25,
          );
        return;
      }

      // ── Full 4-phase animation (~2.5s) ──
      const spread = mobile ? 0.58 : 1;
      // Per-step morph duration
      const S = mobile ? 0.42 : 0.38;

      tl = gsap.timeline({
        defaults: { ease: "intro-silk" },
        onComplete: markDone,
      });

      // ────────────────────────────────────────────
      // PHASE 1 — Stage Entrance (0 – 0.3s)
      // ────────────────────────────────────────────
      tl.to(stage, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: mobile ? 0.34 : 0.3,
        ease: "intro-settle",
      })
        .to(
          glow,
          { opacity: 1, scale: 1.04, duration: 0.3, ease: "sine.out" },
          0,
        )
        .to(
          rings,
          {
            opacity: (i: number) => [0.34, 0.2, 0.12][i] ?? 0.1,
            scale: (i: number) => [1.02, 1.12, 1.26][i] ?? 1.2,
            duration: mobile ? 0.32 : 0.3,
            stagger: mobile ? 0.025 : 0.02,
            ease: "intro-settle",
          },
          0.02,
        )
        .to(
          particles,
          {
            opacity: (i: number) => (i % 3 === 0 ? 0.82 : 0.48),
            scale: (i: number) => PARTICLE_SCALE[i],
            x: (i: number) => PARTICLE_X[i] * spread,
            y: (i: number) => PARTICLE_Y[i] * spread,
            duration: mobile ? 0.3 : 0.26,
            stagger: mobile ? 0.012 : 0.01,
            ease: "intro-settle",
          },
          0.06,
        )

        // ────────────────────────────────────────────
        // PHASE 2 — Cascaded 2-Step Morphs (0.2 – 1.15s)
        // Each piece morphs: START → B → FINAL
        // Pieces cascade: head, core, arms, tie
        // ────────────────────────────────────────────

        // HEAD — 2 morph steps
        .to(
          head,
          {
            morphSVG: { shape: HEAD_B, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.2,
        )
        .to(
          head,
          {
            morphSVG: { shape: HEAD_FINAL, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.2 + S,
        )

        // CORE — 2 morph steps (staggered 0.06s after head)
        .to(
          core,
          {
            morphSVG: { shape: CORE_B, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.26,
        )
        .to(
          core,
          {
            morphSVG: { shape: CORE_FINAL, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.26 + S,
        )

        // LEFT ARM — 2 morph steps
        .to(
          left,
          {
            morphSVG: { shape: LEFT_B, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.32,
        )
        .to(
          left,
          {
            morphSVG: { shape: LEFT_FINAL, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.32 + S,
        )

        // RIGHT ARM — 2 morph steps (same timing as left for symmetry)
        .to(
          right,
          {
            morphSVG: { shape: RIGHT_B, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.32,
        )
        .to(
          right,
          {
            morphSVG: { shape: RIGHT_FINAL, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.32 + S,
        )

        // TIE — 2 morph steps (cascaded 0.18s behind head)
        .to(
          tie,
          {
            morphSVG: { shape: TIE_B, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.38,
        )
        .to(
          tie,
          {
            morphSVG: { shape: TIE_FINAL, shapeIndex: "auto" },
            duration: S,
            ease: "intro-silk",
          },
          0.38 + S,
        )

        // Single smooth glow swell during morphs
        .to(
          glow,
          {
            scale: 1.08,
            opacity: 0.7,
            duration: 0.6,
            ease: "sine.inOut",
          },
          0.3,
        )

        // ────────────────────────────────────────────
        // PHASE 3 — Logo Crystallization (1.1 – 1.85s)
        // ────────────────────────────────────────────

        // Particles drift out
        .to(
          particles,
          {
            opacity: 0,
            scale: 0.15,
            y: mobile ? "-=5" : "-=8",
            duration: mobile ? 0.38 : 0.34,
            stagger: mobile ? 0.012 : 0.01,
            ease: "intro-settle",
          },
          1.1,
        )
        // Rings fade
        .to(
          rings,
          {
            opacity: 0,
            scale: "+=0.04",
            duration: mobile ? 0.38 : 0.34,
            stagger: mobile ? 0.025 : 0.02,
            ease: "intro-settle",
          },
          1.15,
        )
        // Glow softens
        .to(
          glow,
          { opacity: 0.15, scale: 1.12, duration: 0.4, ease: "sine.inOut" },
          1.2,
        )
        // Strokes fade so the fill shapes dissolve cleanly
        .to(
          allPaths,
          {
            strokeOpacity: 0,
            duration: 0.35,
            stagger: { each: 0.025, from: "center" },
            ease: "power1.out",
          },
          1.2,
        )
        // Stage (vector shapes) fades down
        .to(
          stage,
          { opacity: 0.2, scale: 0.995, duration: 0.38, ease: "sine.inOut" },
          1.3,
        )
        // Raster logo fades in
        .to(
          logo,
          {
            opacity: 0.75,
            scale: 0.97,
            duration: mobile ? 0.32 : 0.28,
            ease: "intro-bloom",
          },
          1.3,
        )
        .to(
          halo,
          {
            opacity: 0.62,
            scale: 0.98,
            duration: mobile ? 0.34 : 0.3,
            ease: "intro-bloom",
          },
          1.3,
        )
        // Logo fully materializes with glow
        .to(
          logo,
          {
            opacity: 1,
            scale: 1,
            duration: mobile ? 0.4 : 0.36,
            ease: "intro-bloom",
          },
          1.45,
        )
        .to(
          halo,
          {
            opacity: 0.92,
            scale: 1.1,
            duration: mobile ? 0.36 : 0.32,
            ease: "sine.inOut",
          },
          1.42,
        )
        // Stage vector shapes fully disappear
        .to(
          stage,
          {
            opacity: 0,
            scale: 0.985,
            y: -3,
            duration: 0.3,
            ease: "power2.in",
          },
          1.55,
        )
        .to(
          glow,
          { opacity: 0.04, duration: 0.25, ease: "power1.out" },
          1.6,
        )

        // ────────────────────────────────────────────
        // PHASE 4 — Hero Beat & Exit (1.85 – 2.5s)
        // ────────────────────────────────────────────

        // Logo halo settles into gentle glow
        .to(
          halo,
          {
            opacity: 0.35,
            scale: 1.06,
            duration: 0.35,
            ease: "sine.inOut",
          },
          1.85,
        )
        // Overlay fades out, site revealed
        .to(
          overlay,
          { opacity: 0, duration: 0.5, ease: "intro-exit" },
          2.0,
        );
    };

    const schedule = (retry: boolean) => {
      if (cancelled) return;
      if (!ready()) {
        if (!retry) {
          raf1 = requestAnimationFrame(() => {
            if (cancelled) return;
            raf2 = requestAnimationFrame(() => schedule(true));
          });
        } else {
          setPlayIntro(false);
        }
        return;
      }
      run();
    };

    schedule(false);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      tl?.kill();
      tl = null;
    };
  }, [playIntro, sessionKey]);

  return (
    <>
      <div
        className={
          hydrated ? "opacity-100 transition-opacity duration-300" : "opacity-0"
        }
        suppressHydrationWarning
      >
        {children}
      </div>

      {playIntro && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="fixed inset-0 z-[9999] overflow-hidden bg-slate-900/20 backdrop-blur-md md:backdrop-blur-xl"
          style={{ contain: "layout paint" }}
        >
          {/* Layered scrim */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(96,165,250,0.22),transparent_42%),radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_50%_50%,rgba(30,41,59,0.35),rgba(15,23,42,0.55)_72%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_28%,transparent_72%,rgba(255,255,255,0.04))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_25%,transparent_75%,rgba(255,255,255,0.04))]" />

          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[min(36rem,110vw)] w-[min(36rem,110vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/8 blur-2xl md:h-[44rem] md:w-[44rem] md:blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[min(20rem,72vw)] w-[min(20rem,72vw)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 shadow-[0_0_120px_rgba(96,165,250,0.08)] md:h-[22rem] md:w-[22rem]" />
          </div>

          {/* Stage */}
          <div
            ref={stageWrapRef}
            className="absolute inset-0 grid transform-gpu place-items-center [backface-visibility:hidden] [perspective:1200px]"
          >
            <div className="relative flex items-center justify-center">
              {/* Logo — crossfades in during Phase 3 */}
              <div
                ref={logoRef}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  ref={logoHaloRef}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[min(52vh,30rem)] w-[min(70vw,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-[42%] bg-[radial-gradient(ellipse_at_50%_40%,rgba(191,219,254,0.65)_0%,rgba(96,165,250,0.35)_32%,rgba(59,130,246,0.12)_55%,transparent_72%)] opacity-0 blur-3xl"
                />
                <img
                  src={logoPath}
                  alt="Logo"
                  decoding="async"
                  className="relative z-[1] h-full w-full bg-transparent object-contain mix-blend-normal"
                />
              </div>

              {/* SVG morph stage */}
              <svg
                ref={morphSvgRef}
                viewBox="0 0 800 860"
                className="h-[min(58vh,38rem)] w-[min(90vw,32rem)] overflow-visible bg-transparent md:h-[min(62vh,34rem)] md:w-[min(82vw,28rem)]"
                fill="none"
                style={{ shapeRendering: "geometricPrecision" }}
              >
                <defs>
                  <linearGradient
                    id="intro-head-gradient"
                    x1="260"
                    y1="90"
                    x2="560"
                    y2="360"
                  >
                    <stop offset="0%" stopColor="#1D71D9" />
                    <stop offset="45%" stopColor="#0E4AAE" />
                    <stop offset="100%" stopColor="#082B5C" />
                  </linearGradient>
                  <linearGradient
                    id="intro-side-gradient"
                    x1="80"
                    y1="380"
                    x2="340"
                    y2="760"
                  >
                    <stop offset="0%" stopColor="#1157BF" />
                    <stop offset="50%" stopColor="#0B3D91" />
                    <stop offset="100%" stopColor="#072654" />
                  </linearGradient>
                  <linearGradient
                    id="intro-side-gradient-right"
                    x1="720"
                    y1="380"
                    x2="460"
                    y2="760"
                  >
                    <stop offset="0%" stopColor="#1157BF" />
                    <stop offset="50%" stopColor="#0B3D91" />
                    <stop offset="100%" stopColor="#072654" />
                  </linearGradient>
                  <linearGradient
                    id="intro-core-gradient"
                    x1="280"
                    y1="390"
                    x2="500"
                    y2="790"
                  >
                    <stop offset="0%" stopColor="#0A2F67" />
                    <stop offset="100%" stopColor="#061E42" />
                  </linearGradient>
                  <linearGradient
                    id="intro-tie-gradient"
                    x1="350"
                    y1="420"
                    x2="460"
                    y2="790"
                  >
                    <stop offset="0%" stopColor="#5FA2FF" />
                    <stop offset="100%" stopColor="#2D74D5" />
                  </linearGradient>
                  <filter
                    id="intro-blur-glow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                    colorInterpolationFilters="sRGB"
                  >
                    <feGaussianBlur stdDeviation="20" />
                  </filter>
                  <filter
                    id="intro-soft"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                    colorInterpolationFilters="sRGB"
                  >
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </defs>

                {/* Glow behind shapes */}
                <g ref={glowRef}>
                  <ellipse
                    cx="400"
                    cy="400"
                    rx="148"
                    ry="148"
                    fill="rgba(96,165,250,0.35)"
                    filter="url(#intro-blur-glow)"
                  />
                  <ellipse
                    cx="400"
                    cy="400"
                    rx="86"
                    ry="86"
                    fill="rgba(255,255,255,0.28)"
                    filter="url(#intro-soft)"
                  />
                </g>

                {/* Concentric rings */}
                <g ref={ringsRef}>
                  <circle
                    className="intro-ring"
                    cx="400"
                    cy="400"
                    r="126"
                    stroke="rgba(255,255,255,0.24)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle
                    className="intro-ring"
                    cx="400"
                    cy="400"
                    r="154"
                    stroke="rgba(96,165,250,0.18)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle
                    className="intro-ring"
                    cx="400"
                    cy="400"
                    r="188"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="1"
                    fill="none"
                  />
                </g>

                {/* Particles */}
                <g>
                  {PARTICLES.map((p, idx) => (
                    <circle
                      key={idx}
                      className="intro-particle"
                      cx={p.cx}
                      cy={p.cy}
                      r={p.r}
                      fill={
                        idx % 2 === 0
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(96,165,250,0.88)"
                      }
                    />
                  ))}
                </g>

                {/* 5-piece morphing silhouette */}
                <g ref={stageRef}>
                  <path
                    ref={headRef}
                    d={HEAD_START}
                    fill="url(#intro-head-gradient)"
                    stroke="rgba(147,197,253,0.7)"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    paintOrder="stroke fill"
                  />
                  <path
                    ref={leftRef}
                    d={LEFT_START}
                    fill="url(#intro-side-gradient)"
                    stroke="rgba(147,197,253,0.7)"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    paintOrder="stroke fill"
                  />
                  <path
                    ref={rightRef}
                    d={RIGHT_START}
                    fill="url(#intro-side-gradient-right)"
                    stroke="rgba(147,197,253,0.7)"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    paintOrder="stroke fill"
                  />
                  <path
                    ref={coreRef}
                    d={CORE_START}
                    fill="url(#intro-core-gradient)"
                    stroke="rgba(147,197,253,0.7)"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    paintOrder="stroke fill"
                  />
                  <path
                    ref={tieRef}
                    d={TIE_START}
                    fill="url(#intro-tie-gradient)"
                    stroke="rgba(147,197,253,0.7)"
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                    paintOrder="stroke fill"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
