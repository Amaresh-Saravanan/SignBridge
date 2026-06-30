import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Accessibility, Zap, Users, Globe } from 'lucide-react'

const features = [
  {
    icon: <Users size={28} />,
    title: 'Photorealistic Avatar',
    description: '100+ articulated bones for authentic hand shapes, body movement, and facial expressions.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Smooth Animations',
    description: 'Quaternion-based SLERP interpolation for natural, fluid motion without jank.',
  },
  {
    icon: <Accessibility size={28} />,
    title: 'Accessibility First',
    description: 'WCAG 2.1 AA compliant. Built for deaf and hard-of-hearing users.',
  },
  {
    icon: <Globe size={28} />,
    title: 'Sign Language Ready',
    description: '30+ ISL gestures with expandable database. Designed for global localization.',
  },
]

const stats = [
  { value: '100+', label: 'Articulated Bones' },
  { value: '30+', label: 'ISL Gestures' },
  { value: '60 FPS', label: 'Desktop Performance' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0C10', color: '#F7F4EF', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>SignBridge</span>
        <a
          href="https://github.com/Amaresh-Saravanan/SignBridge"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none' }}
        >
          GitHub
        </a>
      </nav>

      {/* Hero */}
      <section style={{ width: '100%', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '6px 16px', borderRadius: 999, border: '1px solid rgba(201,138,62,0.4)', backgroundColor: 'rgba(201,138,62,0.08)' }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#C98A3E', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#C98A3E' }}>3D Avatar System · ISL</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 20, color: '#F7F4EF', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Break Communication<br />
            <span style={{ background: 'linear-gradient(135deg, #C98A3E, #e8b06a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Barriers with Sign Language
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 18, lineHeight: 1.7, color: '#9CA3AF', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}
          >
            A photorealistic 3D avatar that brings Indian Sign Language to life with smooth animations, realistic gestures, and accessibility-first design.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.button
              onClick={() => navigate('/hub')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, #C98A3E, #e0a855)', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 24px rgba(201,138,62,0.3)' }}
            >
              Enter Avatar Studio <ArrowRight size={18} />
            </motion.button>
            <a
              href="https://github.com/Amaresh-Saravanan/SignBridge"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', fontSize: 15, fontWeight: 600, color: '#F7F4EF', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              View on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ width: '100%', padding: '80px 32px', backgroundColor: 'rgba(22,27,34,0.5)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#F7F4EF', marginBottom: 12, fontFamily: 'Inter, system-ui, sans-serif' }}>Why SignBridge?</h2>
            <p style={{ fontSize: 16, color: '#9CA3AF', maxWidth: 480, margin: '0 auto' }}>Built with accessibility at the core. Designed for the deaf and hard-of-hearing community.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0A0C10' }}
              >
                <div style={{ color: '#C98A3E', marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#F7F4EF', marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ width: '100%', padding: '80px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: '#C98A3E', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#9CA3AF' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ width: '100%', padding: '80px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#F7F4EF', marginBottom: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>Ready to Build?</h2>
          <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 40, lineHeight: 1.7 }}>
            Start developing realistic 3D avatars for sign language. Simple, powerful, and accessible.
          </p>
          <motion.button
            onClick={() => navigate('/hub')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 36px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, #C98A3E, #e0a855)', color: '#fff', cursor: 'pointer', boxShadow: '0 8px 24px rgba(201,138,62,0.3)' }}
          >
            Enter Avatar Studio <ArrowRight size={18} />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F7F4EF', marginBottom: 8 }}>SignBridge</div>
            <p style={{ fontSize: 13, color: '#9CA3AF', maxWidth: 240, lineHeight: 1.6 }}>Making sign language accessible to everyone through cutting-edge 3D technology.</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#F7F4EF', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://github.com/Amaresh-Saravanan/SignBridge" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>GitHub</a>
              <a href="mailto:amareshsaravanan2617@gmail.com" style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 960, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#4B5563' }}>© 2026 SignBridge. Built for accessibility.</span>
          <span style={{ fontSize: 12, color: '#4B5563' }}>Made with ❤️ for the deaf community</span>
        </div>
      </footer>

    </div>
  )
}
