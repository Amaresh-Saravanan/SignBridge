import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, Ear } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import { useAuthStore } from '../../stores/authStore'
import { useAppStore } from '../../stores/appStore'
import { dialects } from '../../data/mockData'

export default function LoginForm({ onToggleMode }) {
  const navigate = useNavigate()
  const { signIn, isLoading } = useAuthStore()
  const setRole = useAppStore((s) => s.setRole)
  const setDialect = useAppStore((s) => s.setDialect)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRoleLocal] = useState('deaf')
  const [dialect, setDialectLocal] = useState('ISL')
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    if (!validate()) return

    const result = await signIn({ email, password, role })
    setRole(role)
    if (role === 'deaf') setDialect(dialect)

    if (result.success) {
      if (result.isFirstLogin) {
        navigate('/onboarding')
      } else {
        navigate('/hub')
      }
    } else {
      setAuthError(result.error || 'Invalid credentials')
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <h3 className="text-center text-[var(--color-text-primary)]">Welcome back</h3>

      {authError && (
        <div className="bg-[var(--color-error-tint)] border border-[var(--color-error-shade)] rounded-[var(--radius-sm)] px-4 py-3 text-sm text-[var(--color-error-shade)]">
          {authError}
        </div>
      )}

      <Input
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => validate()}
        error={errors.email}
        autoComplete="email"
      />

      <div className="flex flex-col">
        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validate()}
          error={errors.password}
          autoComplete="current-password"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onToggleMode('forgot')}
            className="mt-2 text-xs text-[var(--color-accent)] hover:underline transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <div>
        <label className="text-auth-label text-[var(--color-text-secondary)] font-semibold block mb-3">Communication style</label>
        <div className="grid grid-cols-2 gap-4 w-full select-none">
          <button
            type="button"
            onClick={() => setRoleLocal('deaf')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[var(--radius-default)] border transition-all cursor-pointer min-h-[92px] ${
              role === 'deaf'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-card text-[var(--color-accent)] font-bold'
                : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Hand size={18} />
            <span className="text-xs">Deaf / Signer</span>
            {role === 'deaf' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => setRoleLocal('hearing')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[var(--radius-default)] border transition-all cursor-pointer min-h-[92px] ${
              role === 'hearing'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-card text-[var(--color-accent)] font-bold'
                : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Ear size={18} />
            <span className="text-xs">Hearing / Speaker</span>
            {role === 'hearing' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-0.5" />}
          </button>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)] mt-2 leading-relaxed">
          We tailor the workspace experience based on whether you are primarily signing or speaking.
        </p>
      </div>
 
      <AnimatePresence>
        {role === 'deaf' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden flex flex-col gap-1"
          >
            <Dropdown
              label="Sign language dialect"
              options={dialects}
              value={dialect}
              onChange={setDialectLocal}
              searchable
            />
            <p className="text-[11px] text-[var(--color-text-secondary)] mt-1 leading-relaxed">
              You can change your sign language dialect preference anytime in settings.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
 
      <Button type="submit" variant="primary" loading={isLoading} className="w-full mt-2">
        {isLoading ? 'Logging in…' : 'Log in'}
      </Button>

      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-caption text-[var(--color-text-disabled)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      <p className="text-center text-sm text-[var(--color-text-secondary)]">
        New here?{' '}
        <button
          type="button"
          onClick={() => onToggleMode('signup')}
          className="text-[var(--color-accent)] hover:underline transition-colors cursor-pointer"
        >
          Create an account
        </button>
      </p>
    </motion.form>
  )
}
