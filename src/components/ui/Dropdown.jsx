import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  searchable = false,
  placeholder = 'Select...',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const filtered = searchable
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const selected = options.find(o => o.value === value)

  return (
    <div className={`flex flex-col gap-2 ${className}`} ref={ref}>
      {label && (
        <label className="text-auth-label text-[var(--color-text-secondary)]">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-left text-base transition-all duration-200 cursor-pointer hover:border-[var(--color-text-disabled)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(201,138,62,0.15)] outline-none min-h-[48px]"
      >
        <span className={selected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-disabled)]'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={18} className={`text-[var(--color-text-secondary)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-default)] shadow-dropdown overflow-hidden">
            {searchable && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border)]">
                <Search size={16} className="text-[var(--color-text-disabled)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] outline-none"
                  autoFocus
                />
              </div>
            )}
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); setSearch('') }}
                  className="flex items-center justify-between w-full px-4 py-3 text-base text-left hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                >
                  <span className="text-[var(--color-text-primary)]">{option.label}</span>
                  {value === option.value && <Check size={16} className="text-[var(--color-accent)]" />}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-[var(--color-text-disabled)]">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
