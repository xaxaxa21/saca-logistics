"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, ScrambleTextPlugin);

/* ── Utilities ── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches ?? false
  );
}

type CanvasPulse = {
  lane: number;
  t: number;
  speed: number;
  size: number;
  alpha: number;
};

/* ── Network Blueprint Layout ── */
const CX = 200;
const CY = 200;
const OUTER_R = 130;

/* 5 outer nodes in a pentagon, starting from top */
const outerNodes = Array.from({ length: 5 }, (_, i) => {
  const angle = ((i * 72 - 90) * Math.PI) / 180;
  return {
    x: Math.round(CX + OUTER_R * Math.cos(angle)),
    y: Math.round(CY + OUTER_R * Math.sin(angle)),
  };
});

/* Slightly curved paths from hub to each outer node */
const hubPaths = outerNodes.map((n, i) => {
  const mx = (CX + n.x) / 2;
  const my = (CY + n.y) / 2;
  const dx = n.x - CX;
  const dy = n.y - CY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const off = (i % 2 === 0 ? 1 : -1) * 18;
  const cpx = Math.round(mx + (-dy / len) * off);
  const cpy = Math.round(my + (dx / len) * off);
  return `M${CX},${CY} Q${cpx},${cpy} ${n.x},${n.y}`;
});

/* Cross-connections between select outer nodes */
const crossPaths = [
  `M${outerNodes[0].x},${outerNodes[0].y} Q${Math.round((outerNodes[0].x + outerNodes[4].x) / 2 - 30)},${Math.round((outerNodes[0].y + outerNodes[4].y) / 2 - 20)} ${outerNodes[4].x},${outerNodes[4].y}`,
  `M${outerNodes[1].x},${outerNodes[1].y} Q${Math.round((outerNodes[1].x + outerNodes[2].x) / 2 + 25)},${Math.round((outerNodes[1].y + outerNodes[2].y) / 2)} ${outerNodes[2].x},${outerNodes[2].y}`,
];

const allPaths = [...hubPaths, ...crossPaths];

/* ── Video node data: maps each outer node to a video source + CSS position ── */
const videoNodeData = [
  {
    src: "/Create_a_realistic_cinematic_global_shipment_logistics_video_for_SACA_Logistics,_showing_an_integrat_seed3516286562.mp4",
    left: "50%",
    top: "17.5%",
    color: "#3988EA",
  },
  {
    src: "/Create_a_realistic_cinematic_homepage_hero_video_for_a_premium_logistics_and_fulfillment_brand._Show_seed2899836490.mp4",
    left: "81%",
    top: "40%",
    color: "#2563EB",
  },
  {
    src: "/ealistic_cinematic_video_of_a_modern_logistics_warehouse,_based_on_the_reference_images._Tall_pallet_seed2368098061.mp4",
    left: "69%",
    top: "76.25%",
    color: "#3988EA",
  },
  {
    src: "/Create_a_realistic_cinematic_business_video_set_in_a_modern_logistics_facility,_showing_a_profession_seed1252580125.mp4",
    left: "31%",
    top: "76.25%",
    color: "#124D95",
  },
  {
    src: "/reate_a_realistic_cinematic_hero_video_for_the_homepage_of_SACA_LOGISTICS._The_video_should_represen_seed3601031554.mp4",
    left: "19%",
    top: "40%",
    color: "#124D95",
  },
];

/* ── Per-node orbital motion config for "controlled chaos" ── */
const nodeOrbits = [
  { rx: 18, ry: 12, dur: 5.5, reverse: false },
  { rx: 22, ry: 14, dur: 7.2, reverse: true },
  { rx: 16, ry: 10, dur: 6.0, reverse: false },
  { rx: 20, ry: 13, dur: 5.0, reverse: true },
  { rx: 14, ry: 18, dur: 8.0, reverse: false },
];

/* Approximate a closed ellipse with 4 cubic bezier segments */
function makeEllipsePath(rx: number, ry: number, reverse: boolean): string {
  const k = 0.5522847498;
  const kx = rx * k;
  const ky = ry * k;
  if (reverse) {
    return `M0,${-ry} C${-kx},${-ry} ${-rx},${-ky} ${-rx},0 C${-rx},${ky} ${-kx},${ry} 0,${ry} C${kx},${ry} ${rx},${ky} ${rx},0 C${rx},${-ky} ${kx},${-ry} 0,${-ry}Z`;
  }
  return `M0,${-ry} C${kx},${-ry} ${rx},${-ky} ${rx},0 C${rx},${ky} ${kx},${ry} 0,${ry} C${-kx},${ry} ${-rx},${ky} ${-rx},0 C${-rx},${-ky} ${-kx},${-ry} 0,${-ry}Z`;
}

/* ── SVG Mini-Icon Components ── */
function IconWarehouse() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M-14,-4 L0,-14 L14,-4 L14,12 L-14,12 Z" />
      <path d="M-4,12 L-4,2 L4,2 L4,12" />
      <line x1="-9" y1="1" x2="-9" y2="6" />
      <line x1="9" y1="1" x2="9" y2="6" />
    </g>
  );
}

/* ── Main Component ── */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });
  const spotlightRef = useRef<HTMLDivElement>(null);
  const centerpieceRef = useRef<HTMLDivElement>(null);
  const heroVisibleRef = useRef(true);
  const infiniteAnimsRef = useRef<gsap.core.Tween[]>([]);
  const resumeCanvasRef = useRef<(() => void) | null>(null);
  const nodeVideoRefsRef = useRef<HTMLVideoElement[]>([]);

  /* ── Canvas: atmospheric perspective grid (background) ── */
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return () => {};

    let w = 0,
      h = 0,
      dpr = 1;
    const reduce = prefersReducedMotion();
    const coarse = isCoarsePointer();
    const cores =
      typeof navigator !== "undefined"
        ? (navigator.hardwareConcurrency ?? 8)
        : 8;
    const lowPower = cores <= 4;
    const quality = reduce ? 0.0 : lowPower || coarse ? 0.4 : 0.55;

    let rows = Math.round(12 * quality + 6);
    let cols = Math.round(8 * quality + 5);
    let pulseCount = Math.round(8 * quality + 4);
    let pulses: CanvasPulse[] = [];

    const rebuildPulses = () => {
      const half = Math.max(1, Math.floor(cols / 2));
      pulses = Array.from({ length: pulseCount }, () => ({
        lane: Math.floor(Math.random() * (cols + 1)) - half,
        t: Math.random(),
        speed: 0.05 + Math.random() * 0.1,
        size: 1 + Math.random() * 1.5,
        alpha: 0.1 + Math.random() * 0.25,
      }));
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rows = Math.round(12 * quality + 6);
      cols = Math.round(8 * quality + 5);
      pulseCount = Math.round(8 * quality + 4);
      rebuildPulses();
    };

    const draw = (now: number) => {
      /* Skip rendering when hero is scrolled off-screen */
      if (!heroVisibleRef.current) {
        rafRef.current = null;
        return;
      }
      const pr = pointerRef.current;
      pr.x = lerp(pr.x, pr.tx, 0.06);
      pr.y = lerp(pr.y, pr.ty, 0.06);
      const px = pr.active ? (pr.x / Math.max(w, 1) - 0.5) * 2 : 0;
      const py = pr.active ? (pr.y / Math.max(h, 1) - 0.5) * 2 : 0;

      ctx.clearRect(0, 0, w, h);
      const horizonY = h * 0.44 + py * h * 0.02;
      const centerX = w * 0.5 + px * w * 0.03;
      const topWidth = w * 0.06;
      const bottomWidth = w * 0.88;
      const bottomY = h + 50;
      const time = now * 0.001;
      const pulse = 0.5 + 0.5 * Math.sin(time * 0.35);
      const baseBlue = Math.round(55 + 18 * pulse);

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";

      for (let i = 0; i < rows; i++) {
        const t = i / Math.max(rows - 1, 1);
        const tt = t * t;
        const y = lerp(horizonY + 16, bottomY, tt);
        const halfW = lerp(topWidth * 0.5, bottomWidth * 0.5, t);
        const warp = Math.sin(time * 0.6 + t * 3.5) * (1 - t) * 5;
        ctx.strokeStyle = `rgba(57,136,234,${(0.03 + 0.02 * pulse) * (1 - t)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - halfW + warp * 0.25, y);
        ctx.lineTo(centerX + halfW + warp * 0.25, y);
        ctx.stroke();
      }

      const half = Math.max(1, Math.floor(cols / 2));
      for (let i = -half; i <= half; i++) {
        const n = i / Math.max(half, 1);
        ctx.strokeStyle = `rgba(57,136,234,${0.015 + 0.025 * (1 - Math.abs(n))})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX + n * topWidth * 0.5, horizonY);
        ctx.lineTo(centerX + n * bottomWidth * 0.5, bottomY);
        ctx.stroke();
      }

      for (const p of pulses) {
        p.t += p.speed * (1 / 60);
        if (p.t > 1.05) {
          p.t = -Math.random() * 0.2;
          p.lane = Math.floor(Math.random() * (cols + 1)) - half;
          p.speed = 0.05 + Math.random() * 0.1;
          p.size = 1 + Math.random() * 1.5;
          p.alpha = 0.1 + Math.random() * 0.25;
        }
        const ct = clamp(p.t, 0, 1);
        const n = p.lane / Math.max(half, 1);
        const x = lerp(
          centerX + n * topWidth * 0.5,
          centerX + n * bottomWidth * 0.5,
          ct,
        );
        const y = lerp(horizonY + 8, bottomY, ct * ct);
        ctx.fillStyle = `rgba(57,136,234,${p.alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    pointerRef.current.tx = window.innerWidth * 0.5;
    pointerRef.current.ty = window.innerHeight * 0.44;
    resize();
    rafRef.current = requestAnimationFrame(draw);

    /* Expose a resume callback so the visibility ScrollTrigger can restart the loop */
    resumeCanvasRef.current = () => {
      if (!rafRef.current && heroVisibleRef.current) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    const onResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resize();
      rafRef.current = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resumeCanvasRef.current = null;
    };
  }, []);

  /* ── Pointer tracking ── */
  useEffect(() => {
    const cleanupCanvas = initCanvas();
    const root = sectionRef.current;
    if (!root) return cleanupCanvas;
    const pr = pointerRef.current;
    const onMove = (e: PointerEvent) => {
      pr.active = true;
      pr.tx = e.clientX;
      pr.ty = e.clientY;
    };
    const onLeave = () => {
      pr.active = false;
      pr.tx = window.innerWidth * 0.5;
      pr.ty = window.innerHeight * 0.44;
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cleanupCanvas();
    };
  }, [initCanvas]);

  /* ── GSAP orchestration (useEffect defers to after first paint, reducing TBT) ── */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const reduce = prefersReducedMotion();
    const coarse = isCoarsePointer();
    const nativeCleanup: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /* ── Initial hidden states: headline words ── */
      gsap.set(q(".hero-kicker"), { autoAlpha: 0, y: 20, filter: "blur(8px)" });

      gsap.set(q(".hero-word-elastic .hero-char"), {
        autoAlpha: 0,
        y: 80,
        rotateX: -90,
        rotation: -15,
        transformOrigin: "50% 100%",
      });
      gsap.set(q(".hero-word-scramble"), { autoAlpha: 0, y: 30 });
      gsap.set(q(".hero-word-wave .hero-char"), {
        autoAlpha: 0,
        y: 60,
        rotateX: -60,
        transformOrigin: "50% 100%",
      });
      gsap.set(q(".hero-word-backflip"), {
        autoAlpha: 0,
        scale: 0.7,
        transformOrigin: "50% 50%",
      });
      gsap.set(q(".hero-word-scale .hero-char"), {
        autoAlpha: 0,
        scale: 0,
        filter: "blur(12px)",
        transformOrigin: "50% 50%",
      });
      gsap.set(q(".hero-word-slide .hero-char"), {
        autoAlpha: 0,
        x: 40,
        filter: "blur(10px)",
      });

      /* ── Initial states: accent shapes ── */
      gsap.set(q(".hero-accent-arc"), { strokeDashoffset: 200 });
      gsap.set(q(".hero-accent-tip"), {
        autoAlpha: 0,
        scale: 0,
        svgOrigin: "104 30",
      });
      gsap.set(q(".hero-speed-line"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(q(".hero-accent-route"), { autoAlpha: 0, y: 5 });

      /* ── Initial states: other elements ── */
      gsap.set(q(".hero-rule"), { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(q(".hero-sub"), { y: 24, filter: "blur(10px)" });
      gsap.set(q(".hero-cta"), { autoAlpha: 0, y: 16, scale: 0.97 });
      gsap.set(q(".scroll-indicator"), { autoAlpha: 0, y: -12 });

      /* ── Initial states: network ── */
      gsap.set(q(".net-hub"), {
        scale: 0,
        autoAlpha: 0,
        svgOrigin: `${CX} ${CY}`,
      });
      q(".net-node").forEach((el: Element) => {
        gsap.set(el, {
          scale: 0,
          autoAlpha: 0,
          transformOrigin: "center center",
        });
      });
      gsap.set(q(".net-conn"), { autoAlpha: 0 });
      gsap.set(q(".net-pulse"), { autoAlpha: 0 });

      if (spotlightRef.current) {
        gsap.set(spotlightRef.current, {
          x: window.innerWidth * 0.5,
          y: window.innerHeight * 0.38,
        });
      }

      /* ── Master entrance timeline ── */
      const tl = gsap.timeline({
        delay: 0.2,
        defaults: { ease: "power3.out" },
      });

      tl
        /* Kicker */
        .to(
          q(".hero-kicker"),
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7 },
          0.1,
        )

        /* "Flexible" — elastic bounce per char with slight rotation */
        .to(
          q(".hero-word-elastic .hero-char"),
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            rotation: 0,
            duration: reduce ? 0.4 : 0.85,
            stagger: reduce ? 0.02 : 0.028,
            ease: reduce ? "power2.out" : "elastic.out(1.1, 0.72)",
          },
          0.3,
        )

        /* "Fulfillment" — ribbon wave per char */
        .to(
          q(".hero-word-wave .hero-char"),
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: reduce ? 0.4 : 0.8,
            stagger: { each: reduce ? 0.02 : 0.032 },
            ease: "sine.out",
          },
          0.7,
        )

        /* SVG accent arc draws itself */
        .to(
          q(".hero-accent-arc"),
          {
            strokeDashoffset: 0,
            duration: reduce ? 0.3 : 1.2,
            ease: "power2.inOut",
          },
          0.9,
        )
        /* Speed lines stretch in */
        .to(
          q(".hero-speed-line"),
          {
            scaleX: 1,
            duration: reduce ? 0.3 : 0.6,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.95,
        )
        /* Accent rule */
        .to(
          q(".hero-rule"),
          { scaleX: 1, duration: 1.2, ease: "power4.inOut" },
          1.0,
        )
        /* Route fades in */
        .to(q(".hero-accent-route"), { autoAlpha: 1, y: 0, duration: 0.8 }, 1.0)
        /* Arrow tip pops in */
        .to(
          q(".hero-accent-tip"),
          {
            autoAlpha: 0.35,
            scale: 1,
            duration: 0.3,
            ease: "back.out(2)",
          },
          1.9,
        )

        /* "&" — fade + scale-in with drawSVG trigger */
        .to(
          q(".hero-word-backflip"),
          {
            autoAlpha: 1,
            scale: 1,
            duration: reduce ? 0.4 : 0.8,
            ease: reduce ? "power2.out" : "back.out(1.4)",
          },
          1.0,
        )

        /* "Global" — scale from 0 with overshoot */
        .to(
          q(".hero-word-scale .hero-char"),
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: reduce ? 0.3 : 0.7,
            stagger: reduce ? 0.02 : 0.035,
            ease: reduce ? "power2.out" : "back.out(2.5)",
          },
          1.1,
        )

        /* "Logistics" — horizontal slide from right with blur fade */
        .to(
          q(".hero-word-slide .hero-char"),
          {
            autoAlpha: 1,
            x: 0,
            filter: "blur(0px)",
            duration: reduce ? 0.3 : 0.7,
            stagger: reduce ? 0.02 : 0.025,
            ease: "power3.out",
          },
          1.3,
        )

        /* "Solutions" — fade in + scrambleText */
        .to(
          q(".hero-word-solutions"),
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          1.5,
        )

        /* Network hub appears first */
        .to(
          q(".net-hub"),
          {
            scale: 1,
            autoAlpha: 1,
            duration: reduce ? 0.3 : 0.7,
            ease: reduce ? "power2.out" : "back.out(1.4)",
          },
          1.2,
        )

        /* Network outer nodes radiate outward */
        .to(
          q(".net-node"),
          {
            scale: 1,
            autoAlpha: 1,
            duration: reduce ? 0.3 : 0.6,
            stagger: 0.08,
            ease: reduce ? "power2.out" : "back.out(1.6)",
          },
          1.4,
        )

        /* Connection lines fade in */
        .to(
          q(".net-conn"),
          {
            autoAlpha: 1,
            duration: reduce ? 0.3 : 0.6,
            stagger: 0.04,
          },
          1.6,
        )

        /* Pulse dots appear */
        .to(q(".net-pulse"), { autoAlpha: 0.85, duration: 0.4 }, 1.9)

        /* Subtext */
        .to(
          q(".hero-sub"),
          {
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
          },
          1.8,
        )

        /* CTA button */
        .to(
          q(".hero-cta"),
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 },
          2.0,
        )

        /* Scroll indicator */
        .to(q(".scroll-indicator"), { autoAlpha: 1, y: 0, duration: 0.6 }, 2.3);

      /* ── Infinite ambient loops (collected for visibility-gated pause/resume) ── */
      infiniteAnimsRef.current = [];
      if (!reduce) {
        infiniteAnimsRef.current.push(
          gsap.to(q(".net-conn"), {
            strokeDashoffset: "-=12",
            duration: 2,
            ease: "none",
            repeat: -1,
          }),
          gsap.to(q(".net-hub-glow"), {
            scale: 1.15,
            opacity: 0.9,
            duration: 2.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            svgOrigin: `${CX} ${CY}`,
          }),
          /* Per-node orbital "controlled chaos" — each video node drifts along
             a unique elliptical path around its base position while gently pulsing */
          ...gsap.utils.toArray<HTMLElement>(".net-node").flatMap((node, i) => {
            const orbit = nodeOrbits[i % nodeOrbits.length];
            return [
              gsap.to(node, {
                motionPath: {
                  path: makeEllipsePath(orbit.rx, orbit.ry, orbit.reverse),
                  autoRotate: false,
                },
                duration: orbit.dur,
                delay: i * -1.1,
                ease: "none",
                repeat: -1,
              }),
              gsap.to(node, {
                scale: 1.06,
                duration: 2.2 + i * 0.4,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: i * 0.5,
              }),
            ];
          }),
          gsap.to(q(".hero-speed-line"), {
            opacity: 0.12,
            duration: 2.5,
            stagger: 0.3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }),
          gsap.to(q(".scroll-indicator"), {
            y: 10,
            autoAlpha: 0.45,
            duration: 1.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }),
        );

        const motionPaths = q(".net-motion-path");
        q(".net-pulse").forEach((dot: Element, i: number) => {
          const pathEl = motionPaths[i % motionPaths.length];
          if (!pathEl) return;
          infiniteAnimsRef.current.push(
            gsap.to(dot, {
              motionPath: {
                path: pathEl as unknown as SVGPathElement,
                align: pathEl as unknown as SVGPathElement,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
              },
              duration: 3.5 + i * 0.8,
              delay: i * -1,
              ease: "none",
              repeat: -1,
            }),
          );
        });
      }

      /* ── Visibility-gated ScrollTrigger: pause canvas + infinite anims when hero is off-screen ── */
      const playNodeVideos = () => {
        if (!reduce) {
          nodeVideoRefsRef.current.forEach((v) => {
            void v.play().catch(() => {});
          });
        }
      };

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          playNodeVideos();
        },
        onLeave: () => {
          heroVisibleRef.current = false;
          infiniteAnimsRef.current.forEach((t) => t.pause());
          nodeVideoRefsRef.current.forEach((v) => v.pause());
        },
        onEnterBack: () => {
          heroVisibleRef.current = true;
          infiniteAnimsRef.current.forEach((t) => t.resume());
          resumeCanvasRef.current?.();
          playNodeVideos();
        },
      });

      /* Pause node videos if user prefers reduced motion; offset start times so loops don't sync */
      nodeVideoRefsRef.current.forEach((v, i) => {
        if (reduce) {
          v.pause();
        }
        try {
          v.currentTime = i * 1.4;
        } catch {
          /* some browsers reject early seeks */
        }
      });

      /* ── Cursor tilt on centerpiece (desktop only) ── */
      if (!reduce && !coarse && centerpieceRef.current) {
        gsap.set(centerpieceRef.current, {
          transformPerspective: 900,
          transformStyle: "preserve-3d",
        });
        const rotX = gsap.quickTo(centerpieceRef.current, "rotationX", {
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
        });
        const rotY = gsap.quickTo(centerpieceRef.current, "rotationY", {
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
        });

        const onMove = (e: PointerEvent) => {
          if (!centerpieceRef.current) return;
          const r = centerpieceRef.current.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          rotY(dx * 12);
          rotX(-dy * 10);
        };
        const onLeave = () => {
          gsap.to(centerpieceRef.current, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
          });
        };
        root.addEventListener("pointermove", onMove, { passive: true });
        root.addEventListener("pointerleave", onLeave, { passive: true });
        nativeCleanup.push(() => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        });
      }

      /* ── Spotlight follow (desktop only) ── */
      if (!reduce && !coarse && spotlightRef.current) {
        const spotX = gsap.quickTo(spotlightRef.current, "x", {
          duration: 0.8,
          ease: "power3.out",
          overwrite: true,
        });
        const spotY = gsap.quickTo(spotlightRef.current, "y", {
          duration: 0.8,
          ease: "power3.out",
          overwrite: true,
        });
        const onMove = (e: PointerEvent) => {
          spotX(e.clientX);
          spotY(e.clientY);
        };
        const onLeave = () => {
          spotX(window.innerWidth * 0.5);
          spotY(window.innerHeight * 0.38);
        };
        root.addEventListener("pointermove", onMove, { passive: true });
        root.addEventListener("pointerleave", onLeave, { passive: true });
        nativeCleanup.push(() => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        });

        /* Magnetic CTA */
        const magnets = q(".magnet") as HTMLElement[];
        magnets.forEach((el) => {
          const xTo = gsap.quickTo(el, "x", {
            duration: 0.32,
            ease: "power3.out",
            overwrite: true,
          });
          const yTo = gsap.quickTo(el, "y", {
            duration: 0.32,
            ease: "power3.out",
            overwrite: true,
          });
          const mMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
            yTo(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
          };
          const mLeave = () =>
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.6)",
            });
          el.addEventListener("pointermove", mMove);
          el.addEventListener("pointerleave", mLeave);
          nativeCleanup.push(() => {
            el.removeEventListener("pointermove", mMove);
            el.removeEventListener("pointerleave", mLeave);
          });
        });
      }

      /* ── Scroll parallax depth (lighter on mobile to reduce per-frame work) ── */
      const mm = gsap.matchMedia();
      mm.add("(pointer: coarse)", () => {
        gsap.fromTo(
          q(".hero-headline-wrap"),
          { yPercent: 0 },
          {
            yPercent: -4,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.fromTo(
          q(".hero-centerpiece-wrap"),
          { yPercent: 0, opacity: 1 },
          {
            yPercent: 3,
            opacity: 0.4,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      mm.add("(pointer: fine)", () => {
        gsap.fromTo(
          q(".hero-headline-wrap"),
          { yPercent: 0 },
          {
            yPercent: -12,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.fromTo(
          q(".hero-centerpiece-wrap"),
          { yPercent: 0, opacity: 1 },
          {
            yPercent: 8,
            opacity: 0.2,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => {
      nativeCleanup.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  /* Split a word into individually-animated character spans */
  const splitChars = (text: string, keyPrefix: string, accent = false) =>
    text.split("").map((char, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        className="hero-char inline-block"
        style={{
          transformStyle: "preserve-3d",
          whiteSpace: char === " " ? "pre" : undefined,
        }}
      >
        <span
          className={
            accent
              ? "inline-block bg-[linear-gradient(90deg,#1E40AF_0%,#2563EB_35%,#3B82F6_65%,#1E40AF_100%)] bg-clip-text text-transparent"
              : "inline-block text-[#1A1A2E]"
          }
        >
          {char === " " ? "\u00A0" : char}
        </span>
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#FAF8F5]"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_35%,rgba(57,136,234,0.06),transparent_55%),radial-gradient(600px_circle_at_80%_20%,rgba(37,99,235,0.04),transparent_55%),linear-gradient(180deg,#FAF8F5_0%,#F5F2EE_55%,#FAF8F5_100%)]" />

      {/* Canvas atmosphere */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />

      {/* Spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute left-0 top-0 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at center, rgba(57,136,234,0.08), rgba(37,99,235,0.03) 45%, transparent 72%)",
        }}
      />

      {/* Noise */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.04)_0px,rgba(0,0,0,0.04)_1px,transparent_2px,transparent_6px)]" />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_38%,rgba(0,0,0,0.08)_88%)]" />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-6 pb-28 pt-12 sm:pt-16 lg:pt-24 sm:px-10 lg:px-16 xl:max-w-[1100px]">
        {/* Kicker */}
        <div className="hero-kicker mb-3 text-center opacity-0 sm:mb-5 lg:mb-8">
          <span className="inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-[#1A1A2E]/40">
            From sourcing to shelf — fully managed
          </span>
        </div>

        {/* ── Headline with per-word personality animations ── */}
        <div
          className="hero-headline-wrap relative text-center"
          style={{ perspective: "1200px" }}
        >
          {/* Kinetic background layer (always looping, subtle + premium) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center motion-reduce:hidden"
          >
            <svg
              className="h-[300px] w-[340px] sm:h-[360px] sm:w-[520px]"
              viewBox="0 0 520 360"
              fill="none"
            >
              <defs>
                <radialGradient id="heroCoreGlow" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                  <stop offset="65%" stopColor="#2563EB" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="heroRingGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#3988EA" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
                </linearGradient>
                <filter
                  id="heroSoftBlur"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur stdDeviation="8" />
                </filter>
              </defs>

              <g transform="translate(260 178)">
                <circle
                  r="114"
                  fill="url(#heroCoreGlow)"
                  filter="url(#heroSoftBlur)"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;0.85;0.6"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </circle>

                <g>
                  <circle
                    r="128"
                    stroke="url(#heroRingGrad)"
                    strokeWidth="1"
                    strokeDasharray="4 9"
                    opacity="0.34"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0"
                      to="360"
                      dur="24s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  <circle
                    r="90"
                    stroke="#3B82F6"
                    strokeWidth="1"
                    strokeDasharray="2 10"
                    opacity="0.32"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="360"
                      to="0"
                      dur="16s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                <path
                  id="heroOrbitPath"
                  d="M-132 0 C-90 -70 90 -70 132 0 C90 70 -90 70 -132 0Z"
                  stroke="#3988EA"
                  strokeOpacity="0.15"
                  strokeWidth="0.8"
                  fill="none"
                  strokeDasharray="6 10"
                />

                <circle r="3" fill="#2563EB" opacity="0.8">
                  <animateMotion
                    dur="7.5s"
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href="#heroOrbitPath" />
                  </animateMotion>
                </circle>
                <circle r="2.4" fill="#3988EA" opacity="0.75">
                  <animateMotion
                    dur="5.8s"
                    repeatCount="indefinite"
                    rotate="auto-reverse"
                  >
                    <mpath href="#heroOrbitPath" />
                  </animateMotion>
                </circle>
              </g>
            </svg>
          </div>

          <h1 className="relative z-10 text-[2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[#1A1A2E] sm:text-[2.6rem] md:text-[3.4rem] lg:text-[4.4rem] xl:text-[5rem]">
            <span className="sr-only">
              Flexible, Fulfillment &amp; Global Logistics Solutions
            </span>

            <div aria-hidden className="space-y-1 md:space-y-2">
              {/* Line 1 */}
              <div className="block overflow-hidden">
                <span className="hero-word hero-word-elastic inline-block">
                  {splitChars("Flexible", "flex")}
                </span>
                <span className="inline-block">&nbsp;</span>

                <span className="inline-block">&nbsp;</span>
                <span className="hero-word hero-word-wave inline-block">
                  {splitChars("Fulfillment", "ful")}
                </span>
              </div>

              {/* Line 2 */}
              <div className="block overflow-hidden">
                <span
                  className="hero-word hero-word-backflip hero-amp-draw inline-block text-[1.15em]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <svg
                    viewBox="0 0 60 72"
                    className="inline-block h-[1em] w-auto align-baseline"
                    aria-hidden="true"
                  >
                    <text
                      x="50%"
                      y="90%"
                      textAnchor="middle"
                      className="hero-amp-text"
                      style={{
                        fontSize: "68px",
                        fontWeight: 600,
                        fill: "none",
                        stroke: "#1E40AF",
                        strokeWidth: 1.8,
                        strokeDasharray: 220,
                        strokeDashoffset: 220,
                      }}
                    >
                      &amp;
                    </text>
                  </svg>
                </span>
                <span className="inline-block">&nbsp;</span>

                <span className="hero-word hero-word-scale inline-block">
                  Gl<span className="hero-letter-o inline-block">o</span>bal
                </span>

                <span className="inline-block">&nbsp;</span>

                <span className="hero-word hero-word-slide inline-block">
                  Log<span className="hero-letter-i inline-block">i</span>stics
                </span>

                <span className="inline-block">&nbsp;</span>

                <span className="hero-word hero-word-scramble hero-word-solutions inline-block text-[#2563EB]">
                  S
                  <span
                    className="hero-letter-o inline-block"
                    style={{ animationDelay: "-1.2s" }}
                  >
                    o
                  </span>
                  lutions
                </span>
              </div>
            </div>
          </h1>

          {/* SVG accent: swooping arrow — desktop only */}
          <svg
            className="pointer-events-none absolute -right-4 top-[18%] hidden w-20 lg:block xl:-right-8 xl:w-24 motion-reduce:hidden"
            viewBox="0 0 120 80"
            fill="none"
          >
            <path
              className="hero-accent-arc"
              d="M10,60 Q55,5 105,30"
              stroke="#3988EA"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="200"
              strokeLinecap="round"
              opacity="0.5"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-220"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            <path
              className="hero-accent-tip"
              d="M98,25 L108,30 L100,36"
              stroke="#3988EA"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.5;0.2"
                dur="2.8s"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          {/* SVG accent: speed lines — desktop only */}
          <svg
            className="pointer-events-none absolute -left-4 top-[30%] hidden w-16 lg:block xl:-left-8 xl:w-20 motion-reduce:hidden"
            viewBox="0 0 100 50"
            fill="none"
          >
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;8 0;0 0"
                dur="2.6s"
                repeatCount="indefinite"
              />
              <line
                className="hero-speed-line"
                x1="5"
                y1="12"
                x2="80"
                y2="12"
                stroke="#3988EA"
                strokeWidth="1.5"
                opacity="0.4"
                strokeLinecap="round"
              />
              <line
                className="hero-speed-line"
                x1="15"
                y1="25"
                x2="60"
                y2="25"
                stroke="#124D95"
                strokeWidth="1"
                opacity="0.35"
                strokeLinecap="round"
              />
              <line
                className="hero-speed-line"
                x1="8"
                y1="38"
                x2="90"
                y2="38"
                stroke="#2563EB"
                strokeWidth="0.8"
                opacity="0.3"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* SVG accent: dotted route — all screen sizes */}
          <svg
            className="hero-accent-route pointer-events-none absolute -bottom-3 left-1/2 w-48 -translate-x-1/2 sm:w-64 motion-reduce:hidden"
            viewBox="0 0 300 20"
            fill="none"
          >
            <path
              id="heroRoutePath"
              d="M10,14 Q80,2 150,10 Q220,18 290,6"
              stroke="#3988EA"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4 6"
              opacity="0.35"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-80"
                dur="3.4s"
                repeatCount="indefinite"
              />
            </path>
            <circle r="2.2" fill="#3988EA" opacity="0.75">
              <animateMotion dur="3.4s" repeatCount="indefinite" rotate="auto">
                <mpath href="#heroRoutePath" />
              </animateMotion>
            </circle>
          </svg>

          <style jsx>{`
            .hero-letter-o {
              transform-origin: 50% 55%;
              animation: heroOMorph 3s ease-in-out infinite;
            }

            .hero-letter-i {
              transform-origin: 50% 100%;
              animation: heroIBounce 2.5s ease-in-out infinite;
            }

            @keyframes heroOMorph {
              0%,
              100% {
                transform: scaleX(1) scaleY(1);
              }
              50% {
                transform: scaleX(0.88) scaleY(1.12);
              }
            }

            @keyframes heroIBounce {
              0%,
              100% {
                transform: translateY(0) scale(1);
              }
              50% {
                transform: translateY(-3px) scale(1.05);
              }
            }

            .hero-amp-text {
              animation: heroAmpDraw 3s ease-in-out infinite;
            }

            @keyframes heroAmpDraw {
              0% {
                stroke-dashoffset: 220;
                fill: transparent;
              }
              45% {
                stroke-dashoffset: 0;
                fill: transparent;
              }
              60%,
              100% {
                stroke-dashoffset: 0;
                fill: #1e40af;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-letter-o,
              .hero-letter-i {
                animation: none;
              }
              .hero-amp-text {
                animation: none;
                stroke-dashoffset: 0;
                fill: #1e40af;
              }
            }
          `}</style>
        </div>

        {/* Swiss accent rule */}
        <div className="hero-rule mx-auto mt-6 h-[2px] w-full max-w-[400px] origin-center scale-x-0 bg-[linear-gradient(90deg,transparent,rgba(30,64,175,0.5)_20%,rgba(37,99,235,0.3)_80%,transparent)]" />

        {/* ── Network Blueprint Centerpiece ── */}
        <div className="hero-centerpiece-wrap mt-4 sm:mt-8 lg:mt-12">
          <div
            ref={centerpieceRef}
            className="relative mx-auto w-[370px] sm:w-[400px] lg:w-[500px]"
            style={{ willChange: "transform" }}
          >
            <svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-auto w-full"
              aria-hidden
            >
              <defs>
                <filter
                  id="net-glow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="3.5"
                    result="blur"
                  />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="net-hub-glow"
                  x="-100%"
                  y="-100%"
                  width="300%"
                  height="300%"
                >
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="7"
                    result="blur"
                  />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Invisible motion paths for pulse dot travel */}
                {allPaths.map((d, i) => (
                  <path
                    key={`mp-${i}`}
                    id={`net-mp-${i}`}
                    className="net-motion-path"
                    d={d}
                  />
                ))}
              </defs>

              {/* Connection lines: hub-to-outer */}
              {hubPaths.map((d, i) => (
                <path
                  key={`hc-${i}`}
                  className="net-conn"
                  d={d}
                  stroke={videoNodeData[i].color}
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="8 4"
                  opacity="0.55"
                  strokeLinecap="round"
                />
              ))}

              {/* Connection lines: cross-connections */}
              {crossPaths.map((d, i) => (
                <path
                  key={`cc-${i}`}
                  className="net-conn"
                  d={d}
                  stroke="rgba(57,136,234,0.5)"
                  strokeWidth="0.8"
                  fill="none"
                  strokeDasharray="6 6"
                  opacity="0.45"
                  strokeLinecap="round"
                />
              ))}

              {/* Hub node: warehouse (central, larger) */}
              <g className="net-hub" style={{ willChange: "transform" }}>
                <circle
                  className="net-hub-glow"
                  cx={CX}
                  cy={CY}
                  r={32}
                  fill="rgba(57,136,234,0.08)"
                  filter="url(#net-hub-glow)"
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={26}
                  fill="rgba(57,136,234,0.08)"
                  stroke="#3988EA"
                  strokeWidth="1"
                  opacity="0.8"
                />
                <g
                  transform={`translate(${CX},${CY})`}
                  stroke="#3988EA"
                  strokeWidth="1.4"
                  fill="none"
                >
                  <IconWarehouse />
                </g>
              </g>

              {/* Pulse dots — travel along connection paths */}
              {allPaths.map((_, i) => (
                <circle
                  key={`pulse-${i}`}
                  className="net-pulse"
                  r={i < 5 ? 3 : 2.5}
                  fill={
                    i % 3 === 0
                      ? "#3988EA"
                      : i % 3 === 1
                        ? "#2563EB"
                        : "#124D95"
                  }
                  opacity={0}
                  filter="url(#net-glow)"
                />
              ))}
            </svg>

            {/* Video porthole nodes — positioned to match outer SVG node coordinates */}
            {videoNodeData.map((vn, i) => (
              <div
                key={`vn-${i}`}
                className="net-node pointer-events-none absolute h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[96px] sm:w-[96px] lg:h-[110px] lg:w-[110px]"
                style={{
                  left: vn.left,
                  top: vn.top,
                  boxShadow: `0 0 12px 2px ${vn.color}55, inset 0 0 6px 1px ${vn.color}22`,
                  border: `1.5px solid ${vn.color}88`,
                }}
              >
                <video
                  ref={(el) => {
                    if (el) nodeVideoRefsRef.current[i] = el;
                  }}
                  className="h-full w-full rounded-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="none"
                >
                  <source src={vn.src} type="video/mp4" />
                </video>
                <div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle at center, transparent 50%, ${vn.color}18 100%)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Subtext */}
        <div className="mt-4 max-w-[600px] text-center sm:mt-6 lg:mt-10">
          <p className="hero-sub translate-y-6 text-[0.95rem] leading-relaxed text-[#4A4A5A] blur-[10px] sm:text-base md:text-[1.05rem]">
            We see logistics as more than a service. We act as an operational
            partner, working closely with our clients to improve processes,
            optimize supply chains and ensure reliable execution.
          </p>
        </div>

        {/* Single CTA */}
        <div className="mt-5 sm:mt-8">
          <Button
            size="lg"
            className="hero-cta magnet group relative opacity-0 overflow-hidden rounded-full bg-[linear-gradient(90deg,#1E40AF,#2563EB)] px-8 py-6 text-[15px] font-semibold text-white shadow-[0_24px_60px_rgba(30,64,175,0.25)] sm:px-10 sm:py-7"
            onClick={() => scrollToSection("#contact")}
          >
            <span className="relative z-10 flex items-center">
              Request a Logistics Assessment
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
            <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 text-[#1A1A2E]/40">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <div className="flex h-10 w-6 items-start justify-center overflow-hidden rounded-full border border-[#1A1A2E]/12 bg-[#1A1A2E]/3 pt-1.5 backdrop-blur-xl">
          <div className="h-2 w-1 rounded-full bg-[#3988EA]" />
        </div>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(to_top,rgba(18,77,149,1),transparent)]" />
    </section>
  );
}
