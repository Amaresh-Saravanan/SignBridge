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
      ? 'bg-accent-lavender-tint border border-accent-lavender-shade/20'
      : 'bg-accent-mint-tint border border-accent-mint-shade/20'

  return (
    <div className={`inline-flex bg-surface-elevated rounded-default p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`relative px-5 py-2.5 rounded-sm text-sm font-medium cursor-pointer transition-colors duration-150 z-10 min-h-11 ${
            value === option.value
              ? 'text-text-primary'
              : 'text-text-secondary hover:text-text-primary'
           }`}
        >
          {value === option.value && (
            <motion.div
              layoutId={layoutId}
              className={`absolute inset-0 rounded-sm ${highlightClass}`}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center gap-1.5">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
