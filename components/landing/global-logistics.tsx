'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { 
  Plane, 
  Ship, 
  Truck, 
  ArrowRight,
  Globe,
  FileCheck,
  MapPin,
  Anchor
} from 'lucide-react'
import { Button } from '@/components/ui/button'

gsap.registerPlugin(ScrollTrigger)

const logisticsSteps = [
  {
    icon: Globe,
    title: 'International Transport',
    description: 'Air, sea and road freight from any origin to final destination',
    color: '#3988EA',
  },
  {
    icon: FileCheck,
    title: 'Warehousing & Fulfillment',
    description: 'Storage, processing and order fulfillment in Romania',
    color: '#F5A623',
  },
  {
    icon: MapPin,
    title: 'Market Placement',
    description: 'Last-mile delivery and retail distribution',
    color: '#3988EA',
  },
]

const transportModes = [
  { icon: Ship, label: 'Sea Freight', stat: 'Global Coverage', color: '#3988EA' },
  { icon: Plane, label: 'Air Freight', stat: 'Express Delivery', color: '#F5A623' },
  { icon: Truck, label: 'Road Transport', stat: 'EU Network', color: '#124D95' },
]

export function GlobalLogisticsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge entrance
      gsap.fromTo(
        '.global-badge',
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Title words animation
      gsap.fromTo(
        '.global-title-word',
        { opacity: 0, y: 50, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Description reveal
      gsap.fromTo(
        '.global-description',
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Transport modes cascade
      gsap.fromTo(
        '.transport-mode',
        { opacity: 0, x: -40, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.transport-modes',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // CTA button
      gsap.fromTo(
        '.global-cta',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.transport-modes',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Image entrance with 3D effect
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9, rotateY: 10 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Floating stat cards
      gsap.fromTo(
        '.floating-stat',
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Continuous floating animation for stat cards
      gsap.to('.floating-stat-1', {
        y: -15,
        rotation: 2,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.to('.floating-stat-2', {
        y: -10,
        rotation: -2,
        duration: 3.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.5,
      })

      // Transport icon floating
      gsap.to('.transport-icon', {
        y: -8,
        duration: 2,
        ease: 'sine.inOut',
        stagger: { each: 0.3, repeat: -1, yoyo: true },
      })

      // Logistics steps animation
      gsap.fromTo(
        '.logistics-step',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.logistics-steps',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Connection lines drawing
      gsap.fromTo(
        '.connection-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.logistics-steps',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

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
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#3988EA]/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#F5A623]/10 blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
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

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight" style={{ perspective: '1000px' }}>
              <span className="global-title-word inline-block">Global</span>{' '}
              <span className="global-title-word inline-block">Reach.</span>{' '}
              <span className="global-title-word inline-block text-[#3988EA]">Local</span>{' '}
              <span className="global-title-word inline-block text-[#3988EA]">Execution.</span>
            </h2>

            <p className="global-description text-lg lg:text-xl text-white/80 mb-10 leading-relaxed">
              Through our sister company SBA Logistic, we manage your supply chain end-to-end 
              from worldwide import/export to final market placement. One partner for your 
              entire logistics journey.
            </p>

            {/* Transport Modes */}
            <div className="transport-modes flex flex-wrap gap-4 mb-10">
              {transportModes.map((mode) => (
                <div
                  key={mode.label}
                  className="transport-mode group flex items-center gap-4 bg-white/[0.08] backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/15 hover:bg-white/15 hover:border-white/30 transition-all duration-500 cursor-pointer"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `${mode.color}20` }}
                  >
                    <mode.icon className="transport-icon w-6 h-6" style={{ color: mode.color }} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{mode.label}</p>
                    <p className="text-white/50 text-sm">{mode.stat}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="global-cta group relative bg-gradient-to-r from-[#F5A623] to-[#E09612] hover:from-[#E09612] hover:to-[#F5A623] text-white font-semibold px-10 py-7 rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-[#F5A623]/30 overflow-hidden"
              onClick={() => {
                const element = document.querySelector('#contact')
                if (element) element.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Global Solutions
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Button>
          </div>

          {/* Image with floating cards */}
          <div ref={imageRef} className="relative" style={{ perspective: '1000px' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
              <Image
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=800"
                alt="Global logistics operations"
                width={800}
                height={600}
                className="w-full h-auto transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent" />
              
              {/* Image overlay pattern */}
              <div 
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '20px 20px',
                }}
              />
            </div>

            {/* Floating stat card 1 */}
            <div className="floating-stat floating-stat-1 absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3988EA] to-[#124D95] flex items-center justify-center shadow-lg shadow-[#3988EA]/30">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#124D95]">50+</p>
                  <p className="text-sm text-gray-600">Countries Served</p>
                </div>
              </div>
            </div>

            {/* Floating stat card 2 */}
            <div className="floating-stat floating-stat-2 absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-5 z-10">
              <div className="flex items-center gap-3">
                <Ship className="w-8 h-8 text-[#3988EA]" />
                <div>
                  <p className="text-xl font-bold text-[#124D95]">End-to-End</p>
                  <p className="text-xs text-gray-600">Supply Chain</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#3988EA]/20 rounded-3xl blur-2xl -z-10" />
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#F5A623]/20 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>

        {/* Logistics Steps */}
        <div className="logistics-steps mt-24 lg:mt-32">
          <div className="text-center mb-14">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {"Let's Build Your Supply Chain"} – <span className="text-[#3988EA]">Properly.</span>
            </h3>
            <p className="text-white/60">Any product. Any stage. Any market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-0.5 -translate-y-1/2 z-0">
              <div className="connection-line absolute left-0 w-1/2 h-full bg-gradient-to-r from-[#3988EA]/50 to-[#F5A623]/50 origin-left" />
              <div className="connection-line absolute right-0 w-1/2 h-full bg-gradient-to-r from-[#F5A623]/50 to-[#3988EA]/50 origin-left" style={{ transitionDelay: '0.3s' }} />
            </div>
            
            {logisticsSteps.map((step, index) => (
              <div
                key={step.title}
                className="logistics-step relative group"
              >
                <div className="relative bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-3xl p-10 text-center hover:bg-white/[0.12] hover:border-white/25 transition-all duration-500 overflow-hidden">
                  {/* Step number badge */}
                  <div 
                    className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
                    style={{ 
                      background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}CC 100%)`,
                      boxShadow: `0 4px 20px ${step.color}40`,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div 
                    className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}25 0%, ${step.color}10 100%)`,
                    }}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                  
                  {/* Hover glow */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    style={{
                      background: `radial-gradient(circle at center, ${step.color}10 0%, transparent 70%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
