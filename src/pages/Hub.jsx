import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/ui/Button'
import HubAvatar from '../components/three/HubAvatar'
import { useAvatarStore } from '../stores/avatarStore'

const CAMERA_ANGLES = ['front', '3/4', 'side']
const CAMERA_POSITIONS = {
  front: [0, 0, 3.2],
  '3/4': [1.5, 0.5, 2.5],
  side: [3, 0, 0]
}

const ISL_GESTURES = ['HELLO', 'GOODBYE', 'THANK_YOU', 'YES', 'NO']
const SKIN_TONES = ['light', 'medium', 'dark']

export default function Hub() {
  const [selectedGesture, setSelectedGesture] = useState('HELLO')
  const [cameraAngleIdx, setCameraAngleIdx] = useState(0)
  const { skinTone, setSkinTone } = useAvatarStore()

  const currentCamera = CAMERA_ANGLES[cameraAngleIdx]
  const cameraPos = CAMERA_POSITIONS[currentCamera]

  const rotateCamera = (direction) => {
    setCameraAngleIdx((prev) =>
      direction === 'next'
        ? (prev + 1) % CAMERA_ANGLES.length
        : (prev - 1 + CAMERA_ANGLES.length) % CAMERA_ANGLES.length
    )
  }

  return (
    <PageWrapper className="min-h-screen bg-bg-base text-text-primary flex flex-col">

      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">3D Avatar Developer Workspace</h1>
        <span className="text-sm text-text-secondary">Camera: {currentCamera}</span>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex gap-4 p-4">

        {/* 3D Canvas - Full Left Side */}
        <div className="flex-1 bg-surface border border-border rounded-lg overflow-hidden">
          <Canvas camera={{ position: cameraPos, fov: 40 }} className="w-full h-full">
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <pointLight position={[-5, 5, -5]} intensity={0.5} />
            <HubAvatar gesture={selectedGesture} />
          </Canvas>
        </div>

        {/* Right Control Panel */}
        <div className="w-80 bg-surface border border-border rounded-lg p-6 flex flex-col gap-6 overflow-y-auto">

          {/* Camera Controls */}
          <div>
            <h3 className="font-semibold mb-3 text-text-primary">Camera Angle</h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => rotateCamera('prev')}
                className="px-3"
              >
                <ChevronLeft size={18} />
              </Button>
              <div className="flex-1 flex items-center justify-center bg-bg-elevated rounded border border-border py-2">
                <span className="text-sm font-medium">{currentCamera}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => rotateCamera('next')}
                className="px-3"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>

          {/* Gesture Selector */}
          <div>
            <h3 className="font-semibold mb-3 text-text-primary">Test Gesture</h3>
            <div className="flex flex-col gap-2">
              {ISL_GESTURES.map((gesture) => (
                <Button
                  key={gesture}
                  variant={selectedGesture === gesture ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedGesture(gesture)}
                  className="w-full text-sm"
                >
                  {gesture}
                </Button>
              ))}
            </div>
          </div>

          {/* Avatar Appearance */}
          <div>
            <h3 className="font-semibold mb-3 text-text-primary">Skin Tone</h3>
            <div className="flex gap-2">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSkinTone(tone)}
                  className={`flex-1 py-2 rounded text-sm font-medium transition-all border ${
                    skinTone === tone
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-border bg-bg-elevated text-text-secondary hover:border-accent'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-bg-elevated border border-border rounded p-3">
            <h4 className="text-xs font-semibold text-text-secondary uppercase mb-2">Dev Info</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Use this workspace to test 3D avatar gestures, camera angles, and customization options.
            </p>
          </div>

        </div>
      </div>
    </PageWrapper>
  )
}
