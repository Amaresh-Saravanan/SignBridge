import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const navLinks = [
  { label: 'Home',        to: '/' },
  { label: 'Features',    to: '/#features' },
  { label: 'Translation', to: '/hub' },
  { label: 'About',       to: '/about' },
  { label: 'Contact',     to: '/about#contact' },
]

export default function LandingNav() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleCTA = () => {
    navigate(isAuthenticated ? '/hub' : '/auth')
    setMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '1100px',
          zIndex: 100,
          background: scrolled
            ? 'rgba(10, 12, 20, 0.82)'
            : 'rgba(10, 12, 20, 0.55)',
          border: '1px solid rgba(99, 102, 241, 0.18)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.12)'
            : '0 4px 20px rgba(0,0,0,0.25)',
          transition: 'background 0.3s, box-shadow 0.3s',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 select-none"
          aria-label="SignBridge home"
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              boxShadow: '0 0 14px rgba(99,102,241,0.5)',
            }}
          >
            🤟
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SignBridge
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? '#a5b4fc' : 'rgba(255,255,255,0.72)',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  position: 'relative',
                }}
                className="nav-link-underline hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            id="nav-cta-btn"
            onClick={handleCTA}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              boxShadow: '0 0 18px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
            }}
            className="hidden md:flex hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"
            aria-label="Start Translating"
          >
            Start Translating
            <span aria-hidden="true">→</span>
          </button>

          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              top: 84,
              left: 16,
              right: 16,
              zIndex: 99,
              background: 'rgba(10, 12, 24, 0.96)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 14,
              backdropFilter: 'blur(20px)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleCTA}
              style={{
                marginTop: 4,
                padding: '12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
              }}
            >
              Start Translating →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
