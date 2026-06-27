import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { ArrowLeft, User, Languages, LayoutGrid } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import Dropdown from '../components/ui/Dropdown'
import HubAvatar from '../components/three/HubAvatar'

import { useAppStore } from '../stores/appStore'
import { useToastStore } from '../stores/toastStore'
import { skinTones, outfitColors, contextPresets, dialects } from '../data/mockData'

export default function Settings() {
  const navigate = useNavigate()
  const addToast = useToastStore((s) => s.addToast)
  const [saving, setSaving] = useState(false)
  const [avatarTone, setAvatarTone] = useState('friendly') // Mock settings tone state

  const dialect = useAppStore((s) => s.dialect)
  const setDialect = useAppStore((s) => s.setDialect)
  const contextPreset = useAppStore((s) => s.contextPreset)
  const setContextPreset = useAppStore((s) => s.setContextPreset)
  const skinTone = useAppStore((s) => s.skinTone)
  const setSkinTone = useAppStore((s) => s.setSkinTone)
  const outfitColor = useAppStore((s) => s.outfitColor)
  const setOutfitColor = useAppStore((s) => s.setOutfitColor)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    addToast({ type: 'success', message: 'Settings saved' })
    navigate('/hub')
  }

  return (
    <PageWrapper className="relative min-h-screen text-[var(--color-text-primary)] animated-bg pb-28">
      <div className="max-w-[800px] mx-auto px-6 md:px-12 py-16 flex flex-col gap-10">
        <button
          type="button"
          onClick={() => navigate('/hub')}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer outline-none group"
          aria-label="Go back to Hub"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Hub
        </button>

        <div className="flex flex-col gap-2">
          <h1 className="h1 font-display">Settings</h1>
          <p className="text-body text-[var(--color-text-secondary)]">Manage your language translation settings and avatar preferences</p>
        </div>

        {/* Section 1: Language */}
        <section className="flex flex-col gap-5 p-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-card">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
            <Languages size={18} className="text-[var(--color-accent)]" />
            <h2 className="h3 font-display">Language settings</h2>
          </div>
          <div className="flex flex-col gap-2">
            <Dropdown
              label="Sign language dialect"
              options={dialects}
              value={dialect}
              onChange={setDialect}
              searchable
            />
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mt-1">
              Choose the regional sign language variant you want the avatar to use when translating.
            </p>
          </div>
        </section>

        {/* Section 2: Context Presets */}
        <section className="flex flex-col gap-5 p-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-card">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
            <LayoutGrid size={18} className="text-[var(--color-accent)]" />
            <h2 className="h3 font-display">Context vocabulary</h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Select a vocabulary context to optimize translation recognition and dictionary accuracy for specific settings.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contextPresets.filter((p) => ['everyday', 'medical'].includes(p.id)).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setContextPreset(preset.id)}
                  className={`p-4 rounded-[var(--radius-default)] border text-left transition-all cursor-pointer min-h-[72px] ${
                    contextPreset === preset.id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] shadow-card'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className="text-body font-semibold block mb-1 text-[var(--color-text-primary)]">{preset.name}</span>
                  <span className="text-caption text-[var(--color-text-secondary)] leading-normal">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Avatar Customization */}
        <section className="flex flex-col gap-5 p-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-card">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]">
            <User size={18} className="text-[var(--color-accent)]" />
            <h2 className="h3 font-display">Avatar customization</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-6">
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Customize the signing avatar&apos;s physical appearance and presentation style to suit your visual preference.
              </p>

              <div className="flex flex-col gap-2.5">
                <label className="text-auth-label text-[var(--color-text-secondary)] font-semibold">Skin tone</label>
                <div className="flex gap-2.5 flex-wrap">
                  {skinTones.map((tone, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSkinTone(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer min-h-[32px] min-w-[32px] ${
                        skinTone === idx
                          ? 'border-[var(--color-accent)] scale-110 shadow-card'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: tone }}
                      aria-label={`Skin tone ${idx + 1}`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">Adjust skin tone styling for visual clarity.</p>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-auth-label text-[var(--color-text-secondary)] font-semibold">Outfit color</label>
                <div className="flex gap-2.5 flex-wrap">
                  {outfitColors.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setOutfitColor(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer min-h-[32px] min-w-[32px] ${
                        outfitColor === idx
                          ? 'border-[var(--color-accent)] scale-110 shadow-card'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Outfit color ${idx + 1}`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)]">Choose outfit clothing colors to personalize the avatar.</p>
              </div>

              <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--color-border)]">
                <label className="text-auth-label text-[var(--color-text-secondary)] font-semibold">Expression style</label>
                <div className="grid grid-cols-2 gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setAvatarTone('friendly')}
                    className={`py-2 px-3 text-xs font-semibold rounded-[var(--radius-sm)] border transition-all cursor-pointer min-h-[40px] ${
                      avatarTone === 'friendly'
                        ? 'bg-[var(--color-accent-soft)] border-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]'
                    }`}
                  >
                    😊 Warm &amp; Friendly
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarTone('neutral')}
                    className={`py-2 px-3 text-xs font-semibold rounded-[var(--radius-sm)] border transition-all cursor-pointer min-h-[40px] ${
                      avatarTone === 'neutral'
                        ? 'bg-[var(--color-accent-soft)] border-[var(--color-accent)] text-[var(--color-accent)]'
                        : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]'
                    }`}
                  >
                    😐 Neutral &amp; Clear
                  </button>
                </div>
                <p className="text-[11px] text-[var(--color-text-secondary)] leading-normal mt-1">
                  Warm &amp; Friendly tone adjusts facial animations to be more approachable and encouraging during translations.
                </p>
              </div>
            </div>

            <div className="h-64 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden relative shadow-card">
              <span className="absolute top-3 left-3 z-10 text-caption text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)]">Live preview</span>
              <Canvas camera={{ position: [0, 0.4, 1.4], fov: 40 }} className="w-full h-full">
                <ambientLight intensity={0.8} />
                <directionalLight position={[2, 5, 2]} intensity={1.5} />
                <HubAvatar />
              </Canvas>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] p-4 shadow-elevated z-30">
        <div className="max-w-[800px] mx-auto px-6">
          <Button variant="primary" loading={saving} onClick={handleSave} className="w-full">
            {saving ? 'Saving settings…' : 'Save settings'}
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}
