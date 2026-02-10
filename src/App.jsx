import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Shield, Lock, Zap, Globe, ChevronRight, Menu, X } from 'lucide-react'

// Utility for class merging
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

// Custom Cursor Component - The "Scanner"
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const springConfig = { stiffness: 100, damping: 20, mass: 0.5 }
  const cursorX = useSpring(0, springConfig)
  const cursorY = useSpring(0, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    // Track hovering on interactive elements
    const handleElementHover = (e) => {
      const target = e.target
      if (target.closest('a, button, [data-cursor-hover]')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousemove', handleElementHover)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    document.body.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousemove', handleElementHover)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [cursorX, cursorY])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main cursor ring */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            style={{
              x: cursorX,
              y: cursorY,
            }}
          >
            <motion.div
              className="relative -translate-x-1/2 -translate-y-1/2"
              animate={{
                width: isHovering ? 80 : 40,
                height: isHovering ? 80 : 40,
                opacity: isHovering ? 0.8 : 0.5,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className={cn(
                "absolute inset-0 rounded-full border transition-all duration-300",
                isHovering ? "border-burned bg-burned/10" : "border-titanium/50"
              )} />

              {/* Refraction lens effect */}
              <div className="absolute inset-0 rounded-full backdrop-blur-[2px] bg-gradient-to-br from-white/10 to-transparent" />

              {/* Center dot */}
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200",
                isHovering ? "w-1 h-1 bg-burned" : "w-0.5 h-0.5 bg-titanium"
              )} />
            </motion.div>
          </motion.div>

          {/* Trailing particles */}
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              x: useSpring(position.x, { stiffness: 50, damping: 30 }),
              y: useSpring(position.y, { stiffness: 50, damping: 30 }),
            }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-burned/30 blur-sm" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Protoplasmic Mercury Monolith Component
const MercuryMonolith = ({ mousePosition }) => {
  const ref = useRef(null)
  const [localMouse, setLocalMouse] = useState({ x: 0, y: 0 })

  const springConfig = { stiffness: 100, damping: 20 }
  const rotateX = useSpring(0, springConfig)
  const rotateY = useSpring(0, springConfig)
  const scale = useSpring(1, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / (rect.width / 2)
      const deltaY = (e.clientY - centerY) / (rect.height / 2)

      setLocalMouse({ x: deltaX, y: deltaY })
      rotateY.set(deltaX * 15)
      rotateX.set(-deltaY * 15)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [rotateX, rotateY])

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-lg aspect-[3/4] mx-auto perspective-1000"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Main monolith body */}
      <div className="absolute inset-0 rounded-sm overflow-hidden iridescent-border">
        {/* Base metal texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-gunmetal via-graphite to-black" />

        {/* Anisotropic reflection layer */}
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            background: `linear-gradient(
              ${135 + localMouse.x * 30}deg,
              rgba(226, 226, 226, 0.15) 0%,
              rgba(18, 18, 18, 0) 30%,
              rgba(226, 226, 226, 0.1) 50%,
              rgba(18, 18, 18, 0) 70%,
              rgba(226, 226, 226, 0.05) 100%
            )`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />

        {/* Liquid distortion layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at ${50 + localMouse.x * 20}% ${50 + localMouse.y * 20}%,
              rgba(255, 77, 0, 0.15) 0%,
              transparent 50%
            )`,
            filter: 'blur(40px)',
          }}
        />

        {/* Brushed metal grain overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-titanium/40 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Surface imperfections */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Edge highlights */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-titanium/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-burned/20 to-transparent" />
      </div>

      {/* Shadow layer */}
      <motion.div
        className="absolute -inset-4 -z-10 rounded-sm bg-black/50 blur-3xl"
        style={{
          scale: 0.9,
        }}
        animate={{
          scale: [0.9, 0.95, 0.9],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  )
}

// Navigation Component
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Private Banking', href: '#private' },
    { name: 'Wealth Management', href: '#wealth' },
    { name: 'Infrastructure', href: '#infrastructure' },
    { name: 'Access', href: '#access' },
  ]

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "py-4" : "py-6"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          isScrolled ? "glass-morphism" : "bg-transparent"
        )} />

        <nav className="relative container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="relative z-10 flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-10 h-10 border border-titanium/20 flex items-center justify-center">
              <div className="absolute inset-0 bg-burned/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-titanium font-bold text-lg tracking-tighter">AX</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-titanium font-semibold tracking-tight text-sm">AXIS</span>
              <span className="text-burned font-bold tracking-tight text-sm">_ULTRA</span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-micro text-titanium/60 hover:text-titanium transition-colors duration-300 relative group"
                whileHover={{ y: -2 }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-burned group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <motion.button
              className="px-6 py-3 border border-titanium/20 text-micro text-titanium hover:bg-titanium hover:text-graphite transition-all duration-300 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">REQUEST ACCESS</span>
              <div className="absolute inset-0 bg-burned transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden relative z-10 w-10 h-10 flex items-center justify-center text-titanium"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-graphite/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-light text-titanium hover:text-burned transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button
                className="mt-8 px-8 py-4 bg-burned text-graphite font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                REQUEST ACCESS
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hero Section
const HeroSection = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-graphite">
        {/* Far background - blurred technical schematics */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,77,0,0.1)_0%,_transparent_50%)]" />
          <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(226,226,226,0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 lg:px-12"
        style={{ y, opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-micro text-burned block mb-6">PRIVATE NEOBANK</span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-titanium block">TITANIUM</span>
              <span className="text-titanium/40 block">GRADE</span>
              <span className="text-shimmer">BANKING</span>
            </motion.h1>

            <motion.p
              className="text-titanium/60 text-lg lg:text-xl max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed font-light"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Financial infrastructure engineered for the 0.1%.
              Uncompromising security meets liquid asset velocity.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="group px-8 py-4 bg-burned text-graphite font-semibold tracking-tight flex items-center justify-center gap-2 hover:bg-titanium transition-colors duration-300">
                INITIATE ONBOARDING
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-titanium/20 text-titanium font-medium hover:border-titanium/40 transition-colors duration-300">
                VIEW DOSSIER
              </button>
            </motion.div>

            {/* Technical specs */}
            <motion.div
              className="mt-16 pt-8 border-t border-titanium/10 flex justify-center lg:justify-start gap-8 sm:gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div>
                <div className="text-micro text-titanium/40 mb-1">ASSETS UNDER</div>
                <div className="text-titanium font-semibold text-lg mono-text">$4.2B+</div>
              </div>
              <div>
                <div className="text-micro text-titanium/40 mb-1">CLIENTELE</div>
                <div className="text-titanium font-semibold text-lg mono-text">847</div>
              </div>
              <div>
                <div className="text-micro text-titanium/40 mb-1">UPTIME</div>
                <div className="text-titanium font-semibold text-lg mono-text">99.99%</div>
              </div>
            </motion.div>
          </div>

          {/* Monolith */}
          <div className="order-1 lg:order-2">
            <MercuryMonolith />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-micro text-titanium/40">SCROLL</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-titanium/40 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}

// Features Section with Anti-Grid Layout
const FeaturesSection = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50])
  const y3 = useTransform(scrollYProgress, [0, 1], [150, -150])

  const features = [
    {
      icon: Shield,
      title: 'ARMORED CUSTODY',
      description: 'Military-grade encryption with distributed cold storage. Your assets protected by quantum-resistant algorithms.',
      stat: '256-BIT',
      detail: 'AES ENCRYPTION',
    },
    {
      icon: Zap,
      title: 'VELOCITY ENGINE',
      description: 'Sub-millisecond transaction execution across 40+ jurisdictions. Liquidity moves at the speed of thought.',
      stat: '0.4MS',
      detail: 'LATENCY',
    },
    {
      icon: Globe,
      title: 'GLOBAL ARBITRAGE',
      description: 'AI-powered routing across 120+ exchanges. Capture alpha in the gaps between markets.',
      stat: '120+',
      detail: 'MARKETS',
    },
    {
      icon: Lock,
      title: 'ZERO-KNOWLEDGE',
      description: 'Privacy-preserving compliance. Verify without revealing. Your wealth, your business.',
      stat: '100%',
      detail: 'PRIVATE',
    },
  ]

  return (
    <section
      ref={containerRef}
      id="infrastructure"
      className="relative py-32 lg:py-48 overflow-hidden"
    >
      {/* Section header */}
      <div className="container mx-auto px-6 lg:px-12 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-micro text-burned block mb-4">INFRASTRUCTURE</span>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter text-titanium mb-6">
            ENGINEERED FOR<br />
            <span className="text-titanium/30">EXTREMES</span>
          </h2>
        </motion.div>
      </div>

      {/* Anti-grid layout */}
      <div className="container mx-auto px-6 lg:px-12">
        <div className="relative space-y-8 lg:space-y-0 lg:h-[800px]">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className={cn(
                "lg:absolute lg:w-80 p-8 border border-titanium/10 bg-gunmetal/30 backdrop-blur-sm iridescent-border group hover:border-burned/30 transition-colors duration-500",
                i === 0 && "lg:top-0 lg:left-0",
                i === 1 && "lg:top-20 lg:right-20",
                i === 2 && "lg:top-60 lg:left-40",
                i === 3 && "lg:bottom-20 lg:right-40",
              )}
              style={{
                y: i % 2 === 0 ? y1 : y2,
              }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              {/* Icon */}
              <div className="w-12 h-12 border border-titanium/20 flex items-center justify-center mb-6 group-hover:border-burned/50 transition-colors duration-300">
                <feature.icon size={20} className="text-titanium/60 group-hover:text-burned transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold tracking-tight text-titanium mb-3 group-hover:text-shimmer transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-titanium/50 text-sm leading-relaxed mb-6 font-light">
                {feature.description}
              </p>

              {/* Stats */}
              <div className="pt-4 border-t border-titanium/10">
                <div className="text-2xl font-bold text-burned mono-text">{feature.stat}</div>
                <div className="text-micro text-titanium/40">{feature.detail}</div>
              </div>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-burned group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Technical Specs Section (Watch Engraving Style)
const SpecsSection = () => {
  const specs = [
    { label: 'COMPLIANCE', value: 'SOC 2 TYPE II', sub: 'CERTIFIED' },
    { label: 'INSURANCE', value: '$250M', sub: 'LLOYDS OF LONDON' },
    { label: 'JURISDICTIONS', value: '40+', sub: 'GLOBAL' },
    { label: 'API UPTIME', value: '99.99%', sub: 'SLA GUARANTEED' },
    { label: 'COLD STORAGE', value: '98%', sub: 'OFFLINE' },
    { label: 'AUDIT FREQUENCY', value: '24/7', sub: 'REAL-TIME' },
  ]

  return (
    <section className="relative py-32 bg-gunmetal/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-micro text-burned block mb-4">SPECIFICATIONS</span>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-titanium mb-6">
              MECHANICAL<br />PERFECTION
            </h2>
            <p className="text-titanium/60 text-lg leading-relaxed font-light mb-8">
              Every component machined to aerospace tolerances.
              Our infrastructure undergoes continuous stress-testing
              equivalent to 10 years of market volatility.
            </p>

            <div className="flex items-center gap-4">
              <div className="w-16 h-px bg-burned" />
              <span className="text-micro text-titanium/40">PRECISION ENGINEERED</span>
            </div>
          </motion.div>

          {/* Right - Specs grid */}
          <div className="grid grid-cols-2 gap-px bg-titanium/10 border border-titanium/10">
            {specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                className="bg-graphite p-6 lg:p-8 group hover:bg-gunmetal transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-micro text-titanium/40 mb-2 group-hover:text-burned transition-colors duration-300">
                  {spec.label}
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-titanium tracking-tight mb-1">
                  {spec.value}
                </div>
                <div className="text-micro text-titanium/30">
                  {spec.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Access/CTA Section
const AccessSection = () => {
  return (
    <section id="access" className="relative py-32 lg:py-48 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-graphite via-gunmetal to-graphite" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-burned/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-micro text-burned block mb-6">MEMBERSHIP</span>
          <h2 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-titanium mb-8">
            ACCESS IS<br />
            <span className="text-titanium/20">EXCLUSIVE</span>
          </h2>
          <p className="text-titanium/60 text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            We accept fewer than 5% of applications.
            Our vetting process ensures a community of exceptional individuals
            with shared standards of excellence.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <button className="group px-10 py-5 bg-burned text-graphite font-bold tracking-tight flex items-center justify-center gap-3 hover:bg-titanium transition-all duration-300 text-lg">
            BEGIN APPLICATION
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-5 border border-titanium/20 text-titanium font-medium hover:bg-titanium/5 transition-all duration-300">
            SCHEDULE CONSULTATION
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-20 pt-10 border-t border-titanium/10 flex flex-wrap justify-center gap-8 lg:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-micro text-titanium/40 mb-2">REGULATED BY</div>
            <div className="text-titanium font-semibold">FCA • SEC • MAS</div>
          </div>
          <div className="text-center">
            <div className="text-micro text-titanium/40 mb-2">AUDITED BY</div>
            <div className="text-titanium font-semibold">DELOITTE • PWC</div>
          </div>
          <div className="text-center">
            <div className="text-micro text-titanium/40 mb-2">INSURED VIA</div>
            <div className="text-titanium font-semibold">LLOYDS OF LONDON</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="relative bg-gunmetal border-t border-titanium/10">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-titanium/20 flex items-center justify-center">
                <span className="text-titanium font-bold text-lg tracking-tighter">AX</span>
              </div>
              <div>
                <span className="text-titanium font-semibold tracking-tight">AXIS</span>
                <span className="text-burned font-bold tracking-tight">_ULTRA</span>
              </div>
            </div>
            <p className="text-titanium/50 text-sm leading-relaxed max-w-sm font-light">
              Private neobank serving ultra-high-net-worth individuals and family offices.
              Titanium-grade infrastructure for generational wealth.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-micro text-titanium/40 mb-4">PLATFORM</div>
            <ul className="space-y-3">
              {['Private Banking', 'Wealth Management', 'Trading', 'Custody', 'API'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-titanium/70 hover:text-titanium text-sm transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-micro text-titanium/40 mb-4">LEGAL</div>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Compliance', 'Disclosures', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-titanium/70 hover:text-titanium text-sm transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-titanium/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-micro text-titanium/30">
            © 2024 AXIS_ULTRA. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-micro text-titanium/30">LONDON</span>
            <span className="text-micro text-titanium/30">SINGAPORE</span>
            <span className="text-micro text-titanium/30">DUBAI</span>
            <span className="text-micro text-titanium/30">NEW YORK</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="relative bg-graphite min-h-screen overflow-x-hidden">
      <CustomCursor />
      <Navigation />

      <main>
        <HeroSection />
        <FeaturesSection />
        <SpecsSection />
        <AccessSection />
      </main>

      <Footer />
    </div>
  )
}

export default App