'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

gsap.registerPlugin(ScrollTrigger)

const contactInfo = [
  { icon: Building2, label: 'Company', value: 'SACA Logistics (Saca Experts SRL)' },
  { icon: MapPin, label: 'Address', value: 'Bucharest, Romania' },
  { icon: Phone, label: 'Phone', value: '+40 XXX XXX XXX' },
  { icon: Mail, label: 'Email', value: 'contact@sacalogistics.com' },
  { icon: Clock, label: 'Hours', value: 'Mon - Fri: 8:00 - 18:00' },
]

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Badge entrance
      gsap.fromTo(
        '.contact-badge',
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.contact-title',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Title words animation
      gsap.fromTo(
        '.contact-title-word',
        { opacity: 0, y: 50, rotateX: -30 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-title',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Subtitle reveal
      gsap.fromTo(
        '.contact-subtitle',
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-title',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Form 3D entrance
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -60, rotateY: 5 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Form fields stagger
      gsap.fromTo(
        '.form-field',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Contact info card 3D entrance
      gsap.fromTo(
        '.contact-info-card',
        { opacity: 0, x: 60, rotateY: -5 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Contact info items cascade
      gsap.fromTo(
        '.contact-info-item',
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Background shapes floating
      gsap.to('.contact-bg-shape-1', {
        y: -30,
        x: 20,
        rotation: 10,
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.to('.contact-bg-shape-2', {
        y: 25,
        x: -15,
        rotation: -8,
        duration: 10,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormState({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: '',
      })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-28 lg:py-36 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="contact-bg-shape-1 absolute top-20 right-20 w-[400px] h-[400px] bg-[#3988EA]/5 rounded-full blur-[100px]" />
        <div className="contact-bg-shape-2 absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#124D95]/5 rounded-full blur-[120px]" />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(#124D95 1px, transparent 1px),
              linear-gradient(90deg, #124D95 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="contact-title max-w-4xl mx-auto text-center mb-20" style={{ perspective: '1000px' }}>
          <span className="contact-badge inline-flex items-center gap-2 bg-[#3988EA]/10 text-[#3988EA] px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-[#3988EA]/20">
            <Sparkles className="w-4 h-4" />
            Get in Touch
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#124D95] mb-8 leading-tight">
            <span className="contact-title-word inline-block">Request</span>{' '}
            <span className="contact-title-word inline-block">a</span>{' '}
            <span className="contact-title-word inline-block text-[#3988EA]">Logistics</span>{' '}
            <span className="contact-title-word inline-block text-[#3988EA]">Assessment</span>
          </h2>
          
          <p className="contact-subtitle text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Ready to optimize your supply chain? Speak with our operations experts 
            to discover how we can support your logistics needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16" style={{ perspective: '1000px' }}>
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form 
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl shadow-black/5 border border-gray-100 relative overflow-hidden"
            >
              {/* Form decorative element */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#3988EA]/5 to-transparent" />
              
              {isSubmitted ? (
                <div className="text-center py-16 relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#124D95] mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {"We've received your request and will get back to you within 24 hours."}
                  </p>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-field">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'transform scale-[1.02]' : ''}`}>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#3988EA] focus:ring-4 focus:ring-[#3988EA]/10 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white"
                          placeholder="John Doe"
                        />
                        {focusedField === 'name' && (
                          <div className="absolute inset-0 rounded-xl bg-[#3988EA]/5 -z-10 blur-xl" />
                        )}
                      </div>
                    </div>
                    <div className="form-field">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#3988EA] focus:ring-4 focus:ring-[#3988EA]/10 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="form-field">
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('company')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#3988EA] focus:ring-4 focus:ring-[#3988EA]/10 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white"
                        placeholder="Company Inc."
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#3988EA] focus:ring-4 focus:ring-[#3988EA]/10 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white"
                        placeholder="+40 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="form-field mb-6">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formState.service}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('service')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#3988EA] focus:ring-4 focus:ring-[#3988EA]/10 outline-none transition-all duration-300 bg-gray-50/50 focus:bg-white cursor-pointer"
                    >
                      <option value="">Select a service</option>
                      <option value="3pl">3PL & Retail Logistics</option>
                      <option value="fulfillment">Fulfillment Solutions</option>
                      <option value="workforce">Workforce Flexibility</option>
                      <option value="value-added">Value Added Services</option>
                      <option value="global">Global Import/Export</option>
                      <option value="ecommerce">E-Commerce Enablement</option>
                    </select>
                  </div>

                  <div className="form-field mb-8">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#3988EA] focus:ring-4 focus:ring-[#3988EA]/10 outline-none transition-all duration-300 resize-none bg-gray-50/50 focus:bg-white"
                      placeholder="Tell us about your logistics needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-field w-full group relative bg-gradient-to-r from-[#3988EA] to-[#124D95] hover:from-[#2a6fc7] hover:to-[#0e3d73] text-white font-semibold py-5 rounded-xl transition-all duration-500 hover:shadow-xl hover:shadow-[#3988EA]/30 disabled:opacity-70 overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        Request Assessment
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info lg:col-span-2 flex flex-col justify-center">
            <div className="contact-info-card relative bg-gradient-to-br from-[#124D95] via-[#0e3d73] to-[#0a2d4d] rounded-3xl p-8 lg:p-10 text-white overflow-hidden">
              {/* Card background pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />
              
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3988EA]/30 rounded-full blur-[60px]" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div 
                      key={info.label}
                      className="contact-info-item flex items-start gap-4 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#3988EA] group-hover:scale-110 transition-all duration-300">
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-white/50 mb-1">{info.label}</p>
                        <p className="font-medium group-hover:text-[#3988EA] transition-colors">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="mt-10 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full group bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-[#124D95] font-semibold py-4 rounded-xl transition-all duration-300 hover:border-white"
                  >
                    <Phone className="mr-2 w-5 h-5 transition-transform group-hover:rotate-12" />
                    Call Us Directly
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full group bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-[#124D95] font-semibold py-4 rounded-xl transition-all duration-300 hover:border-white"
                  >
                    <Mail className="mr-2 w-5 h-5 transition-transform group-hover:scale-110" />
                    Send an Email
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3988EA]/5 via-transparent to-[#124D95]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-sm text-gray-600 mb-2 relative z-10">Trusted by leading brands in</p>
              <p className="font-bold text-[#124D95] text-lg relative z-10">Retail • FMCG • E-Commerce</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
