import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import HubAvatar from '../components/three/HubAvatar'
import { useAppStore } from '../stores/appStore'

const GESTURES = [
  'HELLO', 'THANK_YOU', 'PLEASE', 'YES', 'NO',
  'HELP', 'WATER', 'FOOD', 'HOME', 'SCHOOL',
  'DOCTOR', 'GOOD', 'BAD', 'I', 'YOU',
  'NOT', 'WHERE', 'NOW', 'TOMORROW', 'YESTERDAY',
  'EAT', 'GO'
]

const SKIN_TONES = [
  { label: 'Light',      index: 0 },
  { label: 'Medium',     index: 1 },
  { label: 'Tan',        index: 2 },
  { label: 'Brown',      index: 3 },
  { label: 'Deep',       index: 4 },
  { label: 'Dark',       index: 5 },
]

const OUTFIT_COLORS = [
  { label: 'Teal',   index: 0 },
  { label: 'Blue',   index: 1 },
  { label: 'Red',    index: 2 },
  { label: 'Yellow', index: 3 },
]

export default function Hub() {
  const [activeGesture, setActiveGesture] = useState(null)
  const [sentence, setSentence] = useState('')

  const enqueueGlosses   = useAppStore((s) => s.enqueueGlosses)
  const clearGlossQueue  = useAppStore((s) => s.clearGlossQueue)
  const currentGloss     = useAppStore((s) => s.currentGloss)
  const isAnimating      = useAppStore((s) => s.isAnimating)
  const skinTone         = useAppStore((s) => s.skinTone)
  const outfitColor      = useAppStore((s) => s.outfitColor)
  const setSkinTone      = useAppStore((s) => s.setSkinTone)
  const setOutfitColor   = useAppStore((s) => s.setOutfitColor)

  const playGesture = (gloss) => {
    clearGlossQueue()
    setActiveGesture(gloss)
    enqueueGlosses([gloss])
  }

  const playSentence = () => {
    const glosses = sentence.trim().toUpperCase().split(/\s+/).filter(Boolean)
    if (!glosses.length) return
    clearGlossQueue()
    setActiveGesture(null)
    enqueueGlosses(glosses)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#0A0C10', color: '#F7F4EF', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>

      {/* 3D Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 0.1, 3.2], fov: 35 }} style={{ width: '100%', height: '100%' }}>
          <color attach="background" args={['#0A0C10']} />
          <ambientLight intensity={0.9} />
          <hemisphereLight intensity={0.7} groundColor="#08090c" />
          <directionalLight position={[4, 6, 4]} intensity={1.6} />
          <directionalLight position={[-3, 4, 2]} intensity={0.5} color="#89a9ff" />
          <HubAvatar />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
        </Canvas>

        {/* Status badge */}
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, backgroundColor: 'rgba(10,12,16,0.8)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isAnimating ? '#4CAF82' : '#4B5563', display: 'inline-block', transition: 'background 0.3s' }} />
          <span style={{ fontSize: 12, color: isAnimating ? '#4CAF82' : '#9CA3AF' }}>
            {isAnimating ? `Signing: ${currentGloss}` : 'Idle'}
          </span>
        </div>

        {/* Orbit hint */}
        <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: '#4B5563' }}>
          Drag to orbit · Scroll to zoom
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 280, borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F7F4EF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avatar Dev Tools</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Sentence tester */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Sentence Test</div>
            <textarea
              placeholder="Type glosses e.g. HELLO YOU GOOD"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); playSentence() } }}
              rows={2}
              style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#F7F4EF', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={playSentence}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', backgroundColor: '#C98A3E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Play
              </button>
              <button
                onClick={() => { clearGlossQueue(); setActiveGesture(null); setSentence('') }}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}
              >
                Stop
              </button>
            </div>
          </div>

          {/* Gesture library */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Gestures ({GESTURES.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {GESTURES.map((g) => (
                <button
                  key={g}
                  onClick={() => playGesture(g)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 8,
                    border: `1px solid ${activeGesture === g && isAnimating ? '#C98A3E' : 'rgba(255,255,255,0.08)'}`,
                    backgroundColor: activeGesture === g && isAnimating ? 'rgba(201,138,62,0.15)' : 'rgba(255,255,255,0.03)',
                    color: activeGesture === g && isAnimating ? '#C98A3E' : '#F7F4EF',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Skin tone */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Skin Tone</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {SKIN_TONES.map((s) => (
                <button
                  key={s.index}
                  onClick={() => setSkinTone(s.index)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: `1px solid ${skinTone === s.index ? '#C98A3E' : 'rgba(255,255,255,0.08)'}`,
                    backgroundColor: skinTone === s.index ? 'rgba(201,138,62,0.15)' : 'rgba(255,255,255,0.03)',
                    color: skinTone === s.index ? '#C98A3E' : '#9CA3AF',
                    fontSize: 11,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit color */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Outfit Color</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {OUTFIT_COLORS.map((o) => (
                <button
                  key={o.index}
                  onClick={() => setOutfitColor(o.index)}
                  style={{
                    padding: '6px 4px',
                    borderRadius: 8,
                    border: `1px solid ${outfitColor === o.index ? '#C98A3E' : 'rgba(255,255,255,0.08)'}`,
                    backgroundColor: outfitColor === o.index ? 'rgba(201,138,62,0.15)' : 'rgba(255,255,255,0.03)',
                    color: outfitColor === o.index ? '#C98A3E' : '#9CA3AF',
                    fontSize: 11,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
