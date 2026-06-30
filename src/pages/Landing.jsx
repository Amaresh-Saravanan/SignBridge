import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import LandingAvatar from '../components/landing/LandingAvatar'
import { useAuthStore } from '../stores/authStore'



export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const handleCTA = () => navigate(isAuthenticated ? '/hub' : '/auth')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 999,
            border: '1px solid rgba(99,102,241,0.5)',
            background: 'rgba(99,102,241,0.1)',
            fontSize: 13,
            fontWeight: 600,
            color: '#a5b4fc',
            marginBottom: 24,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', animation: 'pulse 2s ease-in-out infinite' }} />
          3D Avatar System
        </motion.div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 64px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          marginBottom: 20,
        }}>
          Perfect Your 3D Avatar
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Express Realistically
          </span>
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '18px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.6)',
          marginBottom: 32,
          maxWidth: 600,
          margin: '0 auto 32px',
        }}>
          Build a photorealistic 3D avatar that performs Indian Sign Language gestures with smooth animations and emotional expression.
        </p>

        {/* CTA Button */}
        <motion.button
          onClick={handleCTA}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 36px',
            borderRadius: 12,
            border: 'none',
            fontSize: 16,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#ffffff',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(99,102,241,0.3)',
          }}
        >
          Enter Avatar Studio
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  )
}
