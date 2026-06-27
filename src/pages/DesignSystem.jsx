import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'

export default function DesignSystem() {
  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg py-12 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-16">
        
        <header className="flex flex-col gap-2">
          <h1 className="h1 font-display">Design System</h1>
          <p className="text-[var(--color-text-secondary)] text-lg">Single source of truth for SignBridge components.</p>
        </header>

        {/* Buttons */}
        <section className="flex flex-col gap-6">
          <h2 className="h3 font-display border-b border-[var(--color-border)] pb-2">Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-caption text-[var(--color-text-secondary)]">Primary</span>
              <Button variant="primary">Primary Action</Button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-caption text-[var(--color-text-secondary)]">Secondary</span>
              <Button variant="secondary">Secondary Action</Button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-caption text-[var(--color-text-secondary)]">Ghost</span>
              <Button variant="ghost">Ghost Action</Button>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-caption text-[var(--color-text-secondary)]">Destructive</span>
              <Button variant="destructive">Delete Item</Button>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="flex flex-col gap-6">
          <h2 className="h3 font-display border-b border-[var(--color-border)] pb-2">Typography</h2>
          <div className="flex flex-col gap-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 shadow-card">
            <div className="flex justify-between items-end border-b border-[var(--color-border)]/50 pb-4">
              <h1 className="h1 font-display">Heading 1</h1>
              <span className="text-caption text-[var(--color-text-disabled)] font-mono">Fraunces 40px</span>
            </div>
            <div className="flex justify-between items-end border-b border-[var(--color-border)]/50 pb-4">
              <h2 className="h2 font-display">Heading 2</h2>
              <span className="text-caption text-[var(--color-text-disabled)] font-mono">Fraunces 28px</span>
            </div>
            <div className="flex justify-between items-end border-b border-[var(--color-border)]/50 pb-4">
              <h3 className="h3 font-display">Heading 3</h3>
              <span className="text-caption text-[var(--color-text-disabled)] font-mono">Fraunces 20px</span>
            </div>
            <div className="flex justify-between items-end border-b border-[var(--color-border)]/50 pb-4">
              <p className="text-body">Body Text (Inter)</p>
              <span className="text-caption text-[var(--color-text-disabled)] font-mono">Inter 16px</span>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-caption">Caption Text</p>
              <span className="text-caption text-[var(--color-text-disabled)] font-mono">Inter 13px</span>
            </div>
          </div>
        </section>

        {/* Cards & Surfaces */}
        <section className="flex flex-col gap-6">
          <h2 className="h3 font-display border-b border-[var(--color-border)] pb-2">Surfaces & Glassmorphism</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 shadow-card h-48 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--color-accent)] opacity-10" />
              <div className="relative z-10 text-center">
                <p className="font-medium text-lg">Surface Base</p>
                <p className="text-caption text-[var(--color-text-secondary)]">--radius-lg (24px)</p>
              </div>
            </div>
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-inner)] p-6 shadow-elevated h-48 flex items-center justify-center">
              <div className="text-center">
                <p className="font-medium text-lg">Surface Elevated</p>
                <p className="text-caption text-[var(--color-text-secondary)]">--radius-inner (16px)</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  )
}
