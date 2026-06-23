import { motion } from 'framer-motion'

export default function SegmentedControl({
  options,
  value,
  onChange,
  layoutId = 'segment-highlight',
  className = '',
  accent = 'mint',
}) {
  const highlightClass =
    accent === 'lavender'
      ? 'bg-[var(--color-accent-lavender-tint)] border border-[var(--color-accent-lavender-shade)]/20'
      : 'bg-[var(--color-accent-mint-tint)] border border-[var(--color-accent-mint-shade)]/20'

  return (
    <div className={`inline-flex bg-[var(--color-surface-elevated)] rounded-[var(--radius-default)] p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`relative px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium cursor-pointer transition-colors duration-150 z-10 min-h-[44px] ${
            value === option.value
              ? 'text-[var(--color-text-primary)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          {value === option.value && (
            <motion.div
              layoutId={layoutId}
              className={`absolute inset-0 rounded-[var(--radius-sm)] ${highlightClass}`}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-1.5">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
