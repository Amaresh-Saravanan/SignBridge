export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    card: 'h-32 w-full',
    avatar: 'h-64 w-full',
    row: 'h-12 w-full',
    circle: 'h-10 w-10 rounded-full',
  }

  return (
    <div
      className={`skeleton ${variants[variant] || variants.text} ${className}`}
      aria-hidden="true"
    />
  )
}
