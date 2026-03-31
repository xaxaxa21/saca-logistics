"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  ArrowUpRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const footerLinks = {
  services: [
    { label: "3PL & Retail Logistics", href: "#services" },
    { label: "Fulfillment Solutions", href: "#services" },
    { label: "Workforce Flexibility", href: "#services" },
    { label: "Value Added Services", href: "#services" },
    { label: "Global Import/Export", href: "#global" },
  ],
  company: [
    { label: "About Us", href: "#why-us" },
    { label: "Our Team", href: "#why-us" },
    { label: "Infrastructure", href: "#infrastructure" },
    { label: "Careers", href: "#contact" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Logistics Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Logo and brand entrance
      gsap.fromTo(
        ".footer-brand",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Link columns stagger
      gsap.fromTo(
        ".footer-column",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Bottom bar slide in
      gsap.fromTo(
        ".footer-bottom",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, footerRef);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-b from-[#0a1628] to-[#071018] text-white overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient mesh */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#3988EA]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#124D95]/10 rounded-full blur-[120px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-20 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="footer-brand lg:col-span-2">
              <Link href="/" className="flex items-center gap-4 mb-8 group">
                <div className="relative w-16 h-16 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_trans-9QtDf9f8VqN0uSrRU2qmGBdv3uyoyp.png"
                    alt="SACA Logistics Logo"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                  {/* Logo glow */}
                  <div className="absolute inset-0 bg-[#3988EA]/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    <span className="text-[#3988EA]">SACA</span>{" "}
                    <span className="text-white">LOGISTICS</span>
                  </h2>
                  <p className="text-sm text-white/50">
                    Integrated 3PL & Supply Chain
                  </p>
                </div>
              </Link>

              <p className="text-white/60 leading-relaxed mb-8 max-w-sm">
                From sourcing to shelf – fully managed. We provide flexible 3PL,
                fulfillment & global logistics solutions for retail, FMCG and
                e-commerce.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <a
                  href="mailto:office@sacalogistics.com"
                  className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#3988EA]/20 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm">office@sacaexperts.ro</span>
                </a>
                <a
                  href="tel:+40 725 193 181"
                  className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#3988EA]/20 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm">+40 725 193 181</span>
                </a>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm">Bucharest, Romania</span>
                </div>
              </div>
            </div>

            {/* Services Links */}
            <div className="footer-column">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3988EA]" />
                Services
              </h3>
              <ul className="space-y-4">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="group flex items-center gap-2 text-sm text-white/60 hover:text-[#3988EA] transition-all duration-300"
                    >
                      <span className="w-0 h-px bg-[#3988EA] group-hover:w-3 transition-all duration-300" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} SACA Logistics (Saca Experts SRL).
            All rights reserved.
          </p>

          <div className="flex items-center gap-8">
            <Link
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3988EA] to-[#124D95] text-white shadow-lg hover:shadow-xl hover:shadow-[#3988EA]/30 transition-all duration-500 flex items-center justify-center z-50 group ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />

        {/* Button glow */}
        <div className="absolute inset-0 rounded-2xl bg-[#3988EA]/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </button>
    </footer>
  );
}
