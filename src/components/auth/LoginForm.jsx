import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Hand, Ear } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import { useAuthStore } from '../../stores/authStore'
import { useAppStore } from '../../stores/appStore'

const dialects = ['ISL', 'ASL', 'BSL']

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
      navigate('/hub')
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
      <h3 className="h3 font-display text-center text-text-primary">Welcome back</h3>

      {authError && (
        <div role="alert" className="bg-error-tint border border-error-shade rounded-sm px-4 py-3 text-sm text-error-shade">
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
            className="mt-2 text-xs text-accent hover:underline transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
      </div>

      <div>
        <label className="text-auth-label text-text-secondary font-semibold block mb-3">Communication style</label>
        <div className="grid grid-cols-2 gap-4 w-full select-none">
          <button
            type="button"
            onClick={() => setRoleLocal('deaf')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-default border transition-all cursor-pointer min-h-23 ${
              role === 'deaf'
                ? 'border-accent bg-accent-soft shadow-card text-accent font-bold'
                : 'border-border bg-surface-elevated hover:border-text-secondary text-text-secondary hover:text-text-primary'
            }`}
          >
            <Hand size={18} />
            <span className="text-xs">Deaf / Signer</span>
            {role === 'deaf' && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => setRoleLocal('hearing')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-default border transition-all cursor-pointer min-h-23 ${
              role === 'hearing'
                ? 'border-accent bg-accent-soft shadow-card text-accent font-bold'
                : 'border-border bg-surface-elevated hover:border-text-secondary text-text-secondary hover:text-text-primary'
            }`}
          >
            <Ear size={18} />
            <span className="text-xs">Hearing / Speaker</span>
            {role === 'hearing' && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />}
          </button>
        </div>
        <p className="text-[11px] text-text-secondary mt-2 leading-relaxed">
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
            <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
              You can change your sign language dialect preference anytime in settings.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
 
      <Button type="submit" variant="primary" loading={isLoading} className="w-full mt-2">
        {isLoading ? 'Logging in…' : 'Log in'}
      </Button>

      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-caption text-text-disabled">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <p className="text-center text-sm text-text-secondary">
        New here?{' '}
        <button
          type="button"
          onClick={() => onToggleMode('signup')}
          className="text-accent hover:underline transition-colors cursor-pointer"
        >
          Create an account
        </button>
      </p>
    </motion.form>
  )
}
