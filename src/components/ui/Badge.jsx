const styles = {
  deaf: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20',
  hearing: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20',
  mapped: 'bg-[var(--color-success-tint)] text-[var(--color-success-shade)] border-[var(--color-success-shade)]/25',
  missing: 'bg-[var(--color-warning-tint)] text-[var(--color-warning-shade)] border-[var(--color-warning-shade)]/25',
  warning: 'bg-[var(--color-warning-tint)] text-[var(--color-warning-shade)] border-[var(--color-warning-shade)]/25',
  teal: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[var(--color-accent)]/20',
}

const defaultLabels = {
  deaf: 'Deaf',
  hearing: 'Hearing',
}

export default function Badge({ role, variant, children, className = '' }) {
  const key = role || variant || 'deaf'
  const style = styles[key] || styles.deaf
  const label = children || defaultLabels[role] || key

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-[var(--radius-sm)] text-xs font-semibold border ${style} ${className}`}>
      {label}
    </span>
  )
}
