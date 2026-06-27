import { AlertTriangle } from 'lucide-react'

export default function AdminMobileNotice() {
  return (
    <div className="lg:hidden w-full bg-[var(--color-warning-tint)] border border-[var(--color-warning-shade)]/30 text-[var(--color-warning-shade)] rounded-[var(--radius-default)] p-4 mb-6 text-sm flex items-start gap-2 max-w-[1140px] mx-auto">
      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
      <p>
        <strong>Best viewed on a larger screen.</strong> This admin tool is designed for desktop use.
      </p>
    </div>
  )
}
