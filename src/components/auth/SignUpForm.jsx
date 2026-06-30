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

export default function SignUpForm({ onToggleMode }) {
  const navigate = useNavigate()
  const { signUp, isLoading } = useAuthStore()
  const setRole = useAppStore((s) => s.setRole)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRoleLocal] = useState('deaf')
  const [dialect, setDialect] = useState('ISL')
  const [errors, setErrors] = useState({})

  const getPasswordStrength = () => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  }

  const strengthColors = ['var(--color-error)', 'var(--color-error)', 'var(--color-warning)', 'var(--color-success)', 'var(--color-success)']

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'At least 8 characters'
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await signUp({ name, email, password, role, dialect })
    setRole(role)
    if (result.success) {
      navigate('/hub')
    }
  }

  const strength = getPasswordStrength()

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <h3 className="h3 font-display text-center text-text-primary">Create your account</h3>

      <Input
        id="signup-name"
        label="Full name"
        type="text"
        placeholder="Your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoComplete="name"
      />

      <Input
        id="signup-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />

      <div>
        <Input
          id="signup-password"
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        {password && (
          <div className="flex gap-1 mt-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: i < strength ? strengthColors[strength] : 'var(--color-border)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Input
        id="signup-confirm"
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

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
              onChange={setDialect}
              searchable
            />
            <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
              You can change your sign language dialect preference anytime in settings.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
 
      <Button type="submit" variant="primary" loading={isLoading} className="w-full mt-2">
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onToggleMode('login')}
          className="text-accent hover:underline transition-colors cursor-pointer"
        >
          Log in
        </button>
      </p>
    </motion.form>
  )
}
