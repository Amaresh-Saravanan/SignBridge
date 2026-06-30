const styles = {
  deaf: 'bg-accent-soft text-accent border-accent/20',
  hearing: 'bg-accent-soft text-accent border-accent/20',
  mapped: 'bg-success-tint text-success-shade border-success-shade/25',
  missing: 'bg-warning-tint text-warning-shade border-warning-shade/25',
  warning: 'bg-warning-tint text-warning-shade border-warning-shade/25',
  teal: 'bg-accent-soft text-accent border-accent/20',
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
    <span className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold border ${style} ${className}`}>
      {label}
    </span>
  )
}
