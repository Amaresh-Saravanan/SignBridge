import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border h-14 flex items-center justify-center">
      <div className="flex items-center gap-4 text-caption text-text-secondary">
        <span>© 2026 SignBridge</span>
        <span className="text-border">·</span>
        <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
        <span className="text-border">·</span>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
      </div>
    </footer>
  )
}
