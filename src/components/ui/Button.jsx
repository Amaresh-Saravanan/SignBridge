import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: {
    base: 'bg-gradient-to-b from-[var(--color-accent)] to-[#b57a34] text-[var(--color-bg-base)] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_14px_rgba(201,138,62,0.25)] border border-[#a87130]',
    hover: 'hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_20px_rgba(201,138,62,0.4)]',
  },
  secondary: {
    base: 'bg-[rgba(201,138,62,0.05)] text-[var(--color-accent)] border border-[rgba(201,138,62,0.3)] font-medium backdrop-blur-md',
    hover: 'hover:bg-[rgba(201,138,62,0.12)] hover:border-[var(--color-accent)] hover:shadow-[0_4px_14px_rgba(201,138,62,0.15)]',
  },
  ghost: {
    base: 'bg-transparent text-[var(--color-text-secondary)] font-medium',
    hover: 'hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.05)]',
  },
  destructive: {
    base: 'bg-gradient-to-b from-[var(--color-error)] to-[#d4453a] text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_14px_rgba(232,88,77,0.25)] border border-[#c13d32]',
    hover: 'hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_20px_rgba(232,88,77,0.4)]',
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
        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-disabled)] transition-none min-h-[44px] ${className}`}
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
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base cursor-pointer transition-all duration-150 min-h-[44px] ${v.base} ${v.hover} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  )
}
