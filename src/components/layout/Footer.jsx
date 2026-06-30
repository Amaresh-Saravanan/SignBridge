import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] h-14 flex items-center justify-center">
      <div className="flex items-center gap-4 text-caption text-[var(--color-text-secondary)]">
        <span>© 2026 SignBridge</span>
        <span className="text-[var(--color-border)]">·</span>
        <Link to="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
        <span className="text-[var(--color-border)]">·</span>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text-primary)] transition-colors">GitHub</a>
      </div>
    </footer>
  )
}
