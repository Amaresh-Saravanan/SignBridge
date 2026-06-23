export default function BlobBackground({ children, className = '' }) {
  return (
    <div className={`blob-bg ${className}`}>
      <div className="blob-peach" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
