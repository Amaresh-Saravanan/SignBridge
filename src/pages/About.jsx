import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import BlobBackground from '../components/ui/BlobBackground'
import Button from '../components/ui/Button'

export default function About() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] py-24 px-6 md:px-12">
      <BlobBackground className="min-h-screen">
        <div className="max-w-[800px] mx-auto flex flex-col items-start gap-12">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer outline-none group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </motion.button>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-8 text-editorial w-full">
            <motion.div variants={itemVariants} className="flex items-center gap-2 text-[var(--color-accent)] opacity-60">
              <span className="w-8 h-px bg-[var(--color-accent)]" />
              <span className="text-xs uppercase tracking-wider font-semibold">Our mission</span>
            </motion.div>
 
            <motion.h1 variants={itemVariants} className="h1 leading-tight font-display">
              Bridging worlds through Indian Sign Language
            </motion.h1>
 
            <motion.p variants={itemVariants} className="text-body text-[var(--color-text-secondary)] leading-relaxed">
              We believe communication is a fundamental human right. Yet, for millions of Deaf and Hard of Hearing individuals in India, everyday interactions—at a pharmacy counter, in a classroom, or at a government office—often depend heavily on the availability of a physical sign language interpreter.
            </motion.p>
 
            <motion.p variants={itemVariants} className="text-body text-[var(--color-text-secondary)] leading-relaxed">
              This is the gap SignBridge seeks to bridge. Our mission is to democratize accessibility by providing an instant, bidirectional translation tool between spoken languages and Indian Sign Language (ISL). Through real-time 3D avatar animations and lightweight camera-based gesture recognition, we create a direct line of understanding between hearing and Deaf users.
            </motion.p>
 
            <motion.div
              variants={itemVariants}
              className="pl-8 border-l-2 border-[var(--color-accent)] my-6 flex flex-col gap-3 bg-[var(--color-accent-soft)] p-6 rounded-r-[var(--radius-default)] relative overflow-hidden"
            >
              <p className="text-xl italic font-display text-[var(--color-text-primary)] font-medium leading-relaxed">
                &ldquo;We envision a world where language is no longer a boundary to care, education, or basic human connection.&rdquo;
              </p>
              <span className="text-caption text-[var(--color-text-secondary)] font-bold tracking-wider uppercase">— The SignBridge Team</span>
            </motion.div>
 
            <motion.p variants={itemVariants} className="text-body text-[var(--color-text-secondary)] leading-relaxed">
              Our design is guided by humanness and accessibility. We want to remove the friction of heavy hardware or constant internet-dependent streaming. SignBridge is built to run smoothly in standard web browsers, empowering users with immediate, private, and dignity-preserving translations.
            </motion.p>
 
            <motion.p variants={itemVariants} className="text-body text-[var(--color-text-secondary)] leading-relaxed">
              As an open accessibility initiative, this platform proves that the translation loop can be closed end-to-end. We hope to inspire developers, healthcare workers, and public advocates to build a digital ecosystem that excludes no one.
            </motion.p>
 
            <motion.div variants={itemVariants} className="pt-8 border-t border-[var(--color-border)] w-full">
              <Button variant="primary" onClick={() => navigate('/auth')}>
                Start translating
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </BlobBackground>
    </PageWrapper>
  )
}
