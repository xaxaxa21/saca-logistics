"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  Plane,
  Ship,
  Truck,
  ArrowRight,
  Globe,
  FileCheck,
  MapPin,
  Anchor,
  Train, // Added Train icon from lucide-react
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const transportModes = [
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
  {
    icon: Train,
    label: "Rail Freight",
    stat: "Eco Transit",
    color: "#49C472",
  },
];

export function GlobalLogisticsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".global-badge",
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
          },
        },
      );

      gsap.fromTo(
        ".global-title-word",
        { opacity: 0, y: 50, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        ".global-description",
        { opacity: 0, y: 30, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
          },
        },
      );

      gsap.fromTo(
        ".transport-mode",
        { opacity: 0, x: -40, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".transport-modes",
            start: "top 85%",
          },
        },
      );

      gsap.fromTo(
        ".global-cta",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".transport-modes",
            start: "top 80%",
          },
        },
      );

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9, rotateY: 10 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        },
      );

      gsap.fromTo(
        ".floating-stat",
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 70%",
          },
        },
      );

      gsap.to(".floating-stat-1", {
        y: -15,
        rotation: 2,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".floating-stat-2", {
        y: -10,
        rotation: -2,
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      });

      gsap.to(".transport-icon", {
        y: -8,
        duration: 2,
        ease: "sine.inOut",
        stagger: { each: 0.3, repeat: -1, yoyo: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="global"
      className="relative py-28 lg:py-36 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070"
          alt="Global shipping"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/98 via-[#124D95]/95 to-[#124D95]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/50 via-transparent to-[#0a1628]/30" />

        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#3988EA]/20 blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#F5A623]/10 blur-[100px] animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div ref={contentRef}>
            <span className="global-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/20">
              <Anchor className="w-4 h-4 text-[#F5A623]" />
              SBA Logistic Partnership
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              <span className="global-title-word inline-block">Global</span>{" "}
              <span className="global-title-word inline-block">Reach.</span>{" "}
              <span className="global-title-word inline-block text-[#3988EA]">
                Local
              </span>{" "}
              <span className="global-title-word inline-block text-[#3988EA]">
                Execution.
              </span>
            </h2>

            <p className="global-description text-lg lg:text-xl text-white/80 mb-10 leading-relaxed">
              Through our sister company SBA Logistic, we manage your supply
              chain end-to-end from worldwide import/export to final market
              placement.
            </p>

            {/* Transport Modes */}
            <div className="transport-modes flex flex-wrap gap-4 mb-10">
              {transportModes.map((mode) => (
                <div
                  key={mode.label}
                  className="transport-mode flex items-center gap-4 bg-white/[0.08] backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/15 hover:bg-white/15 transition-all duration-500"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${mode.color}20` }}
                  >
                    <mode.icon
                      className="transport-icon w-6 h-6"
                      style={{ color: mode.color }}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{mode.label}</p>
                    <p className="text-white/50 text-sm">{mode.stat}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button className="global-cta bg-[#F5A623] text-white px-10 py-6 rounded-full">
              Explore Global Solutions
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative">
            <Image
              src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800"
              alt="Logistics"
              width={800}
              height={600}
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
