import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-100 bg-bg-base border-b border-border h-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="text-xl font-bold tracking-wide font-display text-text-primary hover:text-accent transition-colors">
          SignBridge
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/hub"
            className={`nav-link-underline text-sm transition-colors ${isActive('/hub') ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Avatar Studio
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-surface border-b border-border p-6 flex flex-col gap-4 z-99">
          <Link to="/hub" onClick={() => setMobileOpen(false)} className="text-base text-text-secondary hover:text-text-primary">Avatar Studio</Link>
        </div>
      )}
    </nav>
  )
}
