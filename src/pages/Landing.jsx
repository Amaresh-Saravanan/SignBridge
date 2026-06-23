import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { ArrowRight, Mic, Languages, Repeat2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import BlobBackground from '../components/ui/BlobBackground'
import AvatarDemo from '../components/three/AvatarDemo'
import Button from '../components/ui/Button'
import WaveformMotif from '../components/ui/WaveformMotif'
import { useAuthStore } from '../stores/authStore'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  const steps = [
    {
      icon: Mic,
      title: 'Speak or Type',
      description: 'A hearing user speaks or types a sentence in their everyday language.',
    },
    {
      icon: Languages,
      title: 'Avatar Translates',
      description: 'SignBridge immediately translates the words, and the 3D avatar signs it in Indian Sign Language.',
    },
    {
      icon: Repeat2,
      title: 'Sign Back to Speech',
      description: 'A Deaf user signs into the camera, and their gestures are translated back into spoken speech and text.',
    },
  ]

  const handleCTA = () => {
    navigate(isAuthenticated ? '/hub' : '/auth')
  }

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] overflow-x-hidden">
      <BlobBackground className="min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-36">
          {/* Hero as Mirrored Split-Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[60vh] mb-24">
            
            {/* Left Panel: Narrative & Call to Action */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-elevated p-8 md:p-12 flex flex-col justify-center gap-8 text-left"
            >
              {/* Subtle eyeball signature motif */}
              <motion.div
                variants={itemVariants}
                className="flex items-center self-start gap-3 px-3 py-1.5 rounded-full bg-[var(--color-accent-soft)] border border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]"
              >
                <WaveformMotif state="listening" size={16} />
                <span>Bidirectional ISL Translation</span>
              </motion.div>
 
              <motion.h1 variants={itemVariants} className="h1 leading-tight tracking-tight">
                A direct bridge between spoken words and sign language.
              </motion.h1>
 
              <motion.p
                variants={itemVariants}
                className="text-body text-[var(--color-text-secondary)] leading-relaxed"
              >
                SignBridge translates spoken conversations into Indian Sign Language via an interactive 3D avatar, and uses lightweight camera gestures to translate signs back into text and voice. Designed to make Deaf and hearing interactions direct, private, and equal.
              </motion.p>
 
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto pt-2">
                <Button variant="primary" onClick={handleCTA} className="group flex items-center justify-center gap-2">
                  Start translating
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
                <button
                  type="button"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[var(--color-accent)] hover:underline text-body font-semibold transition-all cursor-pointer min-h-[44px] flex items-center justify-center sm:justify-start"
                >
                  How it works
                </button>
              </motion.div>
            </motion.div>
 
            {/* Right Panel: 3D Avatar Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-elevated overflow-hidden relative min-h-[360px] md:min-h-[480px] flex flex-col"
            >
              <div className="absolute top-4 left-4 z-20 pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-text-secondary)] bg-[var(--color-bg-base)] px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)]">
                  Avatar preview
                </span>
              </div>
              <div className="w-full h-full flex-1">
                <Canvas camera={{ position: [0, 0, 3], fov: 45 }} className="w-full h-full">
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[5, 10, 5]} intensity={1.5} />
                  <pointLight position={[-5, 5, -5]} intensity={0.5} />
                  <AvatarDemo />
                </Canvas>
              </div>
            </motion.div>
          </div>
 
          {/* 3-step row */}
          <section id="how-it-works" className="pt-24 border-t border-[var(--color-border)]">
            <div className="flex flex-col gap-3 mb-16 max-w-[580px]">
              <h2 className="h2 font-display">A simple, bidirectional loop</h2>
              <p className="text-body text-[var(--color-text-secondary)]">How SignBridge connects hearing and signing users in a seamless conversation.</p>
            </div>
 
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr"
            >
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="flex flex-col justify-start gap-5 p-8 rounded-[var(--radius-default)] bg-[var(--color-surface)] shadow-card border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all duration-300 min-h-[260px]"
                  >
                    <div className="w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-accent)]">
                        {i === 0 ? 'First' : i === 1 ? 'Translation' : 'Response'}
                      </span>
                      <h3 className="h3 font-display">{step.title}</h3>
                    </div>
                    <p className="text-body text-[var(--color-text-secondary)] leading-relaxed flex-1">{step.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>
        </div>
      </BlobBackground>
    </PageWrapper>
  )
}
