import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: {
    base: 'bg-[var(--color-accent)] text-[var(--color-bg-base)] font-semibold',
    hover: 'hover:brightness-105 shadow-card hover:shadow-elevated',
  },
  secondary: {
    base: 'bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)] font-medium',
    hover: 'hover:bg-[var(--color-accent-soft)] hover:shadow-card',
  },
  ghost: {
    base: 'bg-transparent text-[var(--color-text-secondary)] font-medium',
    hover: 'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-accent-soft)]',
  },
  destructive: {
    base: 'bg-[var(--color-error)] text-white font-medium',
    hover: 'hover:brightness-105 shadow-card',
  },
}

export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const v = variants[variant] || variants.primary

  if (disabled || loading) {
    return (
      <button
        type={type}
        disabled
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-default)] text-base cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-disabled)] transition-none min-h-[44px] ${className}`}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-default)] text-base cursor-pointer transition-all duration-150 min-h-[44px] ${v.base} ${v.hover} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  )
}
