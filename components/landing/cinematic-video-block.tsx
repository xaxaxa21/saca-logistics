"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WhyUsSection } from "@/components/landing/why-us";

gsap.registerPlugin(ScrollTrigger);

type CinematicVideoBlockProps = {
  src: string;
  poster?: string;
  className?: string;
  videoClassName?: string;
  overlayClassName?: string;
  label?: string;
  title?: string;
  description?: string;
  reveal?: boolean;
  allowAutoplayOnCoarse?: boolean;
  priority?: "hero" | "section";
};

/* Keeps playback lightweight by ensuring one visible video is actively playing. */
const activeVideoRegistry = new Set<HTMLVideoElement>();

function pauseOtherVideos(active: HTMLVideoElement) {
  activeVideoRegistry.forEach((video) => {
    if (video !== active) video.pause();
  });
}

export function CinematicVideoBlock({
  src,
  poster,
  className = "",
  videoClassName = "",
  overlayClassName = "",
  label,
  title,
  description,
  reveal = true,
  allowAutoplayOnCoarse = true,
  priority = "section",
}: CinematicVideoBlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const coarse = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  }, []);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !reveal) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { autoAlpha: 0, y: 24, filter: "blur(8px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [reveal]);

  useEffect(() => {
    const video = videoRef.current;
    const root = rootRef.current;
    if (!video || !root) return;

    activeVideoRegistry.add(video);
    // #region agent log
    video.addEventListener(
      "loadstart",
      () => {
        fetch(
          "http://127.0.0.1:7891/ingest/0a397575-a1e2-4bda-8517-bd1b0f845eae",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Debug-Session-Id": "aec0f5",
            },
            body: JSON.stringify({
              sessionId: "aec0f5",
              location: "cinematic-video-block.tsx:loadstart",
              message: "CinematicVideoBlock loadstart",
              data: { src, sinceNavStart: performance.now() },
              timestamp: Date.now(),
              hypothesisId: "H4",
            }),
          },
        ).catch(() => {});
      },
      { once: true },
    );
    // #endregion

    const canAutoplay = !reduceMotion && (!coarse || allowAutoplayOnCoarse);
    if (!canAutoplay) {
      video.pause();
      return () => {
        activeVideoRegistry.delete(video);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            pauseOtherVideos(videoRef.current);
            void videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        });
      },
      { threshold: coarse ? 0.55 : 0.4 },
    );
    observer.observe(root);

    const onVisibility = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
      activeVideoRegistry.delete(video);
    };
  }, [allowAutoplayOnCoarse, coarse, reduceMotion]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden ${className}`}
      data-video-priority={priority}
    >
      <video
        ref={videoRef}
        className={`h-full w-full object-cover ${videoClassName}`}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Optional tonal layer to preserve text readability above footage. */}
      {overlayClassName ? (
        <div
          className={`pointer-events-none absolute inset-0 ${overlayClassName}`}
        />
      ) : null}

      {label || title || description ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1120px]">
            {label ? (
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/65">
                {label}
              </p>
            ) : null}
            {title ? (
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl lg:text-3xl">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
