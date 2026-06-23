import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageWrapper from '../components/layout/PageWrapper'
import BlobBackground from '../components/ui/BlobBackground'
import LoginForm from '../components/auth/LoginForm'
import SignUpForm from '../components/auth/SignUpForm'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'

export default function Auth() {
  const [mode, setMode] = useState('login')

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] flex items-center justify-center py-6 px-4 md:px-6">
      <BlobBackground className="absolute inset-0 pointer-events-none" />
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative z-10 w-full max-w-[420px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-default)] p-6 md:p-8 shadow-card overflow-hidden"
      >
        <div className="flex flex-col items-center gap-2 mb-6 md:mb-8">
          <h2 className="h2 font-display tracking-tight">SignBridge</h2>
          <p className="text-caption text-[var(--color-text-secondary)] font-medium">Bidirectional sign language translation</p>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' && <LoginForm key="login" onToggleMode={setMode} />}
          {mode === 'signup' && <SignUpForm key="signup" onToggleMode={setMode} />}
          {mode === 'forgot' && <ForgotPasswordForm key="forgot" onToggleMode={setMode} />}
        </AnimatePresence>
      </motion.div>
    </PageWrapper>
  )
}
