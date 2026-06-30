import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import Button from '../ui/Button'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, signOut } = useAuthStore()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-[100] bg-[var(--color-bg-base)] border-b border-[var(--color-border)] h-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
        {/* Wordmark */}
        <Link to="/" className="text-xl font-bold tracking-wide font-display text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors">
          SignBridge
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated ? (
            <>
              <Link
                to="/hub"
                className={`nav-link-underline text-sm transition-colors ${isActive('/hub') ? 'text-[var(--color-text-primary)] font-medium' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
              >
                Avatar Studio
              </Link>
              <button
                onClick={() => { signOut(); navigate('/') }}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <Button
              variant="primary"
              className="!py-2 !px-5 !text-sm"
              onClick={() => navigate('/auth')}
            >
              Start
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6 flex flex-col gap-4 z-[99]">
          {isAuthenticated ? (
            <>
              <Link to="/hub" onClick={() => setMobileOpen(false)} className="text-base text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Avatar Studio</Link>
              <button onClick={() => { signOut(); navigate('/'); setMobileOpen(false) }} className="text-base text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer">Sign out</button>
            </>
          ) : (
            <Button variant="primary" className="w-full" onClick={() => { navigate('/auth'); setMobileOpen(false) }}>
              Start
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}
