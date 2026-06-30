import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({
  label,
  type = 'text',
  error,
  placeholder,
  value,
  onChange,
  onBlur,
  id,
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-auth-label text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-input bg-surface-elevated text-text-primary text-base placeholder:text-text-disabled border transition-all duration-200 outline-none ${
            error
              ? 'border-error'
              : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_rgba(201,138,62,0.15)]'
           } ${isPassword ? 'pr-12' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-error-shade">{error}</p>}
    </div>
  )
}
