import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import {
  Globe, ArrowLeftRight, Smile, Camera, Languages, BarChart2,
  Play, ArrowRight, Zap, CheckCircle, ChevronRight,
} from 'lucide-react'

import LandingNav    from '../components/landing/LandingNav'
import LandingAvatar from '../components/landing/LandingAvatar'
import { useAuthStore } from '../stores/authStore'

// ─────────────────────────────────────────
// Data
// ─────────────────────────────────────────
const FEATURES = [
  {
    id: 'dialect',
    icon: Globe,
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.35)',
    title: 'Dialect Engine',
    description: 'Understands regional ISL dialects and adapts output for maximum clarity across diverse signing communities.',
  },
  {
    id: 'bidirectional',
    icon: ArrowLeftRight,
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.35)',
    title: 'Two-Way Translation',
    description: 'Seamlessly converts spoken audio to sign animations and sign gestures to readable captions — both directions in real time.',
  },
  {
    id: 'emotion',
    icon: Smile,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    title: 'Emotion-Aware Avatar',
    description: 'Our avatar reads emotional context and adds expressive facial cues, making communication feel natural and human.',
  },
  {
    id: 'camera',
    icon: Camera,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.35)',
    title: 'Real-Time Camera Recognition',
    description: 'MediaPipe-powered hand tracking recognises ISL signs from any webcam with 95%+ accuracy at 30 fps.',
  },
  {
    id: 'multilang',
    icon: Languages,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.35)',
    title: 'Multi-Language Support',
    description: 'Supports 10+ sign languages including ISL, ASL and BSL — translate across borders without missing a beat.',
  },
  {
    id: 'insights',
    icon: BarChart2,
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.35)',
    title: 'Accessibility Insights',
    description: 'Session analytics, confidence scores and vocabulary suggestions to track and improve communication skills.',
  },
]

const STATS = [
  { value: '95%',    label: 'Sign Recognition Accuracy', icon: '🎯' },
  { value: '<50ms',  label: 'Real-Time Processing',       icon: '⚡' },
  { value: '10+',    label: 'Sign Languages Supported',   icon: '🌐' },
  { value: '5,000+', label: 'Active Users',               icon: '👥' },
]

const DEMO_STEPS = [
  { id: 'camera',  icon: Camera,      label: 'Camera Input',    desc: 'Capture sign gestures via webcam',           color: '#6366f1' },
  { id: 'ai',      icon: Zap,         label: 'AI Processing',   desc: 'MediaPipe + neural net classify the signs',   color: '#8b5cf6' },
  { id: 'avatar',  icon: Smile,       label: '3D Avatar',       desc: 'Emotion-aware avatar renders the output',     color: '#06b6d4' },
  { id: 'caption', icon: CheckCircle, label: 'Live Captions',   desc: 'Real-time text output displayed instantly',   color: '#10b981' },
]

// ─────────────────────────────────────────
// Animated star field (memoised, stable positions)
// ─────────────────────────────────────────
function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top:  Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.45 + 0.08,
      delay: Math.random() * 4,
      dur:   Math.random() * 3 + 2,
    })),
  [])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {stars.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width:  s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#ffffff',
            opacity: s.opacity,
            animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Mouse-follow glow cursor
// ─────────────────────────────────────────
function MouseGlow() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 80, damping: 20 })
  const sy = useSpring(y, { stiffness: 80, damping: 20 })

  useEffect(() => {
    const onMove = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
        width: 480,
        height: 480,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}

// ─────────────────────────────────────────
// Feature card
// ─────────────────────────────────────────
function FeatureCard({ feat, index }) {
  const Icon = feat.icon
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      id={`feature-${feat.id}`}
      style={{
        position: 'relative',
        padding: '28px',
        borderRadius: 20,
        background: 'rgba(16, 18, 36, 0.65)',
        border: '1px solid rgba(99,102,241,0.14)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.3)',
        cursor: 'default',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
      className="feature-card"
    >
      {/* Gradient border top accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)`,
          borderRadius: '20px 20px 0 0',
        }}
      />

      {/* Corner glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${feat.glow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: `rgba(${feat.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.14)`,
          border: `1px solid rgba(${feat.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.28)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          boxShadow: `0 0 18px ${feat.glow}`,
        }}
      >
        <Icon size={22} color={feat.color} strokeWidth={1.8} />
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 10, letterSpacing: '-0.02em' }}>
        {feat.title}
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.52)' }}>
        {feat.description}
      </p>
    </motion.article>
  )
}

// ─────────────────────────────────────────
// Demo workflow step
// ─────────────────────────────────────────
function DemoStep({ step, index, active, onClick }) {
  const Icon = step.icon
  const isActive = active === index

  return (
    <motion.button
      id={`demo-step-${step.id}`}
      onClick={() => onClick(index)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 22px',
        borderRadius: 14,
        border: isActive
          ? `1px solid ${step.color}55`
          : '1px solid rgba(255,255,255,0.08)',
        background: isActive
          ? `rgba(${step.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.12)`
          : 'rgba(16,18,36,0.55)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'all 0.3s',
        backdropFilter: 'blur(12px)',
        boxShadow: isActive ? `0 0 24px rgba(${step.color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.2)` : 'none',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          flexShrink: 0,
          background: isActive
            ? step.color
            : 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s',
          boxShadow: isActive ? `0 0 16px ${step.color}88` : 'none',
        }}
      >
        <Icon size={20} color={isActive ? '#fff' : 'rgba(255,255,255,0.55)'} strokeWidth={1.8} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,0.75)', marginBottom: 3 }}>
          {step.label}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
          {step.desc}
        </div>
      </div>
    </motion.button>
  )
}

// ─────────────────────────────────────────
// Main Landing page
// ─────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [demoActive, setDemoActive] = useState(0)
  const heroRef = useRef()

  const handleCTA = () => navigate(isAuthenticated ? '/hub' : '/auth')

  // Auto-cycle demo steps
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoActive((p) => (p + 1) % DEMO_STEPS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  const sectionStyle = {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px',
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#080a14',
        overflowX: 'hidden',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Global background ───────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 55% at 65% 15%, rgba(99,102,241,0.13) 0%, transparent 65%),
            radial-gradient(ellipse 55% 45% at 20% 70%, rgba(139,92,246,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(6,182,212,0.06) 0%, transparent 55%),
            #080a14
          `,
        }}
      />

      {/* ── Aurora gradient bands ──────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: `
            linear-gradient(180deg,
              rgba(99,102,241,0.04) 0%,
              transparent 30%,
              transparent 70%,
              rgba(139,92,246,0.04) 100%
            )
          `,
          animation: 'auroraShift 12s ease-in-out infinite alternate',
        }}
      />

      <StarField />
      <MouseGlow />

      {/* ── NAVBAR ─────────────────────────── */}
      <LandingNav />

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="hero"
        aria-labelledby="hero-headline"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: 100,
          paddingBottom: 40,
        }}
      >
        <div style={{ ...sectionStyle }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
              gap: 48,
              alignItems: 'center',
              minHeight: 520,
            }}
            className="landing-hero-grid"
          >
            {/* ── Left copy ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: '1px solid rgba(99,102,241,0.35)',
                  background: 'rgba(99,102,241,0.1)',
                  width: 'fit-content',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#a5b4fc',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px #6366f1', animation: 'pulseDot 1.8s ease-in-out infinite' }} />
                AI-Powered Sign Language
              </motion.div>

              {/* Headline */}
              <h1
                id="hero-headline"
                style={{
                  fontSize: 'clamp(42px, 5.5vw, 74px)',
                  fontWeight: 800,
                  lineHeight: 1.04,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Break Every{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #38bdf8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Barrier.
                </span>
                <br />
                Speak With Your Hands.
              </h1>

              {/* Sub-copy */}
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.58)',
                  maxWidth: 460,
                  margin: 0,
                }}
              >
                Real-time AI-powered sign language translation enabling{' '}
                <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  seamless communication
                </strong>{' '}
                between deaf and hearing communities.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {/* Primary */}
                <motion.button
                  id="hero-cta-primary"
                  onClick={handleCTA}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(99,102,241,0.6)' }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Start Translating — open the translation app"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 28px',
                    borderRadius: 12,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    boxShadow: '0 0 28px rgba(99,102,241,0.45)',
                  }}
                >
                  Start Translating
                  <ArrowRight size={16} strokeWidth={2.5} />
                </motion.button>

                {/* Secondary */}
                <motion.button
                  id="hero-cta-secondary"
                  whileHover={{ scale: 1.03, borderColor: 'rgba(99,102,241,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Watch product demo"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 24px',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.14)',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.82)',
                    backdropFilter: 'blur(8px)',
                    transition: 'border-color 0.2s',
                  }}
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(99,102,241,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Play size={12} fill="currentColor" color="#a5b4fc" />
                  </span>
                  Watch Demo
                </motion.button>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
                <div style={{ display: 'flex' }}>
                  {['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: c,
                        border: '2px solid #080a14',
                        marginLeft: i > 0 ? -8 : 0,
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    >
                      {['S','A','M','K','R'][i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  Trusted by <strong style={{ color: 'rgba(255,255,255,0.75)' }}>5,000+</strong> users worldwide
                </span>
              </div>
            </motion.div>

            {/* ── Right: 3D Avatar ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ position: 'relative', minHeight: 460 }}
            >
              {/* Outer glow halo */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '-12%',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.12) 40%, transparent 75%)',
                  filter: 'blur(16px)',
                  animation: 'glowPulse 4s ease-in-out infinite alternate',
                }}
              />

              {/* Canvas */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 480,
                  borderRadius: 28,
                  overflow: 'hidden',
                  border: '1px solid rgba(99,102,241,0.15)',
                  background: 'radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.08) 0%, rgba(8,10,20,0.85) 70%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Canvas camera={{ position: [0, 0.3, 3.2], fov: 40 }}>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[3, 8, 5]} intensity={1.6} color="#ffffff" />
                  <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#818cf8" />
                  <pointLight position={[0, -2, 3]} intensity={0.5} color="#06b6d4" />
                  <pointLight position={[2, 3, 1]} intensity={0.4} color="#a78bfa" />
                  <LandingAvatar />
                </Canvas>

                {/* Floating badge: Live */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16,185,129,0.35)',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#34d399',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulseDot 1.5s ease-in-out infinite' }} />
                  Live
                </motion.div>

                {/* Floating badge: 95% */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  style={{
                    position: 'absolute',
                    bottom: 22,
                    left: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    borderRadius: 14,
                    background: 'rgba(8,10,20,0.82)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <span style={{ fontSize: 22 }}>🎯</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>95%</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Accuracy</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════ */}
      <section
        id="stats"
        aria-label="Key statistics"
        style={{ position: 'relative', zIndex: 2, padding: '64px 0' }}
      >
        <div style={sectionStyle}>
          {/* Divider line */}
          <div
            style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.35), transparent)',
              marginBottom: 56,
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
            className="stats-grid"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  textAlign: 'center',
                  padding: '28px 20px',
                  borderRadius: 18,
                  background: 'rgba(16,18,36,0.55)',
                  border: '1px solid rgba(99,102,241,0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 8 }}>{s.icon}</div>
                <div
                  style={{
                    fontSize: 'clamp(28px, 3.5vw, 42px)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════ */}
      <section
        id="features"
        aria-labelledby="features-heading"
        style={{ position: 'relative', zIndex: 2, padding: '80px 0' }}
      >
        <div style={sectionStyle}>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 999,
                border: '1px solid rgba(99,102,241,0.3)',
                background: 'rgba(99,102,241,0.08)',
                fontSize: 11,
                fontWeight: 700,
                color: '#a5b4fc',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 18,
              }}
            >
              <Zap size={12} color="#818cf8" /> Features
            </div>
            <h2
              id="features-heading"
              style={{
                fontSize: 'clamp(30px, 3.5vw, 46px)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Everything You Need to{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Communicate
              </span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
              Built from the ground up for accessibility, inclusivity and real-world performance.
            </p>
          </motion.div>

          {/* Cards grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
            }}
            className="features-grid"
          >
            {FEATURES.map((feat, i) => (
              <FeatureCard key={feat.id} feat={feat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DEMO WORKFLOW SECTION
      ══════════════════════════════════════ */}
      <section
        id="demo"
        aria-labelledby="demo-heading"
        style={{ position: 'relative', zIndex: 2, padding: '80px 0' }}
      >
        <div style={sectionStyle}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 52 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 14px',
                borderRadius: 999,
                border: '1px solid rgba(6,182,212,0.3)',
                background: 'rgba(6,182,212,0.08)',
                fontSize: 11,
                fontWeight: 700,
                color: '#67e8f9',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 18,
              }}
            >
              <Play size={12} color="#06b6d4" fill="#06b6d4" /> How It Works
            </div>
            <h2
              id="demo-heading"
              style={{
                fontSize: 'clamp(28px, 3vw, 42px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#fff',
                lineHeight: 1.1,
              }}
            >
              From Sign to Speech,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #67e8f9, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Instantly
              </span>
            </h2>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.3fr',
              gap: 32,
              alignItems: 'start',
            }}
            className="demo-grid"
          >
            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DEMO_STEPS.map((step, i) => (
                <DemoStep
                  key={step.id}
                  step={step}
                  index={i}
                  active={demoActive}
                  onClick={setDemoActive}
                />
              ))}
            </div>

            {/* Visualisation panel */}
            <motion.div
              key={demoActive}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                borderRadius: 22,
                border: `1px solid ${DEMO_STEPS[demoActive].color}33`,
                background: 'rgba(12,14,28,0.75)',
                backdropFilter: 'blur(16px)',
                padding: 32,
                minHeight: 280,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                boxShadow: `0 0 60px rgba(${DEMO_STEPS[demoActive].color.replace('#', '').match(/.{2}/g).map(h => parseInt(h, 16)).join(',')}, 0.12), 0 20px 40px rgba(0,0,0,0.35)`,
              }}
            >
              {/* Big icon */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 22,
                  background: `linear-gradient(135deg, ${DEMO_STEPS[demoActive].color}33, ${DEMO_STEPS[demoActive].color}11)`,
                  border: `1px solid ${DEMO_STEPS[demoActive].color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 40px ${DEMO_STEPS[demoActive].color}44`,
                }}
              >
                {(() => {
                  const Icon = DEMO_STEPS[demoActive].icon
                  return <Icon size={36} color={DEMO_STEPS[demoActive].color} strokeWidth={1.5} />
                })()}
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}
                >
                  {DEMO_STEPS[demoActive].label}
                </div>
                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  {DEMO_STEPS[demoActive].desc}
                </div>
              </div>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {DEMO_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDemoActive(i)}
                    aria-label={`Step ${i + 1}`}
                    style={{
                      width: i === demoActive ? 24 : 8,
                      height: 8,
                      borderRadius: 999,
                      border: 'none',
                      cursor: 'pointer',
                      background: i === demoActive ? DEMO_STEPS[i].color : 'rgba(255,255,255,0.18)',
                      transition: 'all 0.35s ease',
                      boxShadow: i === demoActive ? `0 0 10px ${DEMO_STEPS[i].color}` : 'none',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section
        id="cta-banner"
        aria-label="Call to action"
        style={{ position: 'relative', zIndex: 2, padding: '64px 0 100px' }}
      >
        <div style={sectionStyle}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              borderRadius: 28,
              padding: '64px 48px',
              textAlign: 'center',
              overflow: 'hidden',
              background: 'rgba(16, 18, 40, 0.7)',
              border: '1px solid rgba(99,102,241,0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Inner glow */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(99,102,241,0.15) 0%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#818cf8',
                marginBottom: 16,
              }}
            >
              Get Started Today — It's Free
            </div>

            <h2
              style={{
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: 18,
              }}
            >
              Ready to Bridge the Gap?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.65 }}>
              Join thousands breaking communication barriers with SignBridge.
              No credit card required — start translating in seconds.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                id="cta-banner-primary"
                onClick={handleCTA}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99,102,241,0.65)' }}
                whileTap={{ scale: 0.97 }}
                aria-label="Start Translating for free"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '15px 32px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 16,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  boxShadow: '0 0 28px rgba(99,102,241,0.4)',
                }}
              >
                Start Translating — Free
                <ChevronRight size={18} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Checkmarks */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                marginTop: 24,
                flexWrap: 'wrap',
              }}
            >
              {['No sign-up required', '95% accuracy', 'Open source'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  <CheckCircle size={14} color="#10b981" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer
        role="contentinfo"
        style={{
          position: 'relative',
          zIndex: 2,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.01em' }}>
          © {new Date().getFullYear()} SignBridge · Built for accessibility, powered by AI
        </div>
      </footer>
    </div>
  )
}
