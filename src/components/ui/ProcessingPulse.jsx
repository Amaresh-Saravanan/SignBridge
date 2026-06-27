export default function ProcessingPulse({ active, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {active && (
        <div
          className="absolute inset-0 rounded-[inherit] processing-pulse pointer-events-none z-10"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  )
}
