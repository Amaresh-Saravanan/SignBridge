import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useAuthStore } from '../../stores/authStore'

export default function ForgotPasswordForm({ onToggleMode }) {
  const { resetPassword, isLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address')
      return
    }
    const result = await resetPassword(email)
    if (result.success) {
      setSent(true)
    } else {
      setError(result.error || 'Failed to send reset link')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <h3 className="text-center text-[var(--color-text-primary)]">Reset your password</h3>

      {sent ? (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--color-success-tint)] border border-[var(--color-success)] rounded-[var(--radius-sm)] px-4 py-3 text-sm text-[var(--color-success)]">
            Check your inbox — a reset link is on its way.
          </div>
          <Button
            variant="secondary"
            onClick={() => { setSent(false); setEmail('') }}
            className="w-full"
          >
            Resend
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <p className="text-sm text-[var(--color-text-secondary)] text-center leading-relaxed">
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div className="bg-[var(--color-error-tint)] border border-[var(--color-error-shade)] rounded-[var(--radius-sm)] px-4 py-3 text-sm text-[var(--color-error-shade)]">
              {error}
            </div>
          )}

          <Input
            id="forgot-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Button type="submit" variant="primary" loading={isLoading} className="w-full mt-2">
            {isLoading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}

      <button
        type="button"
        onClick={() => onToggleMode('login')}
        className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer mx-auto mt-2"
      >
        <ArrowLeft size={16} />
        Back to login
      </button>
    </motion.div>
  )
}
