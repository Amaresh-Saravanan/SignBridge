import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../../stores/appStore'
import { RealisticAvatar } from './RealisticAvatar'

/**
 * Hub avatar — realistic humanoid that reacts to app state.
 * Idle: breathing and subtle sways. Processing: orbiting light. Signing: active gestures.
 */
export default function HubAvatar() {
  const avatarRef = useRef()
  const lightRef = useRef()

  const isProcessing = useAppStore((s) => s.isProcessing)
  const isSigning = useAppStore((s) => s.isSigning)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const rig = avatarRef.current

    if (rig) {
      // Breathing & subtle spine motion
      if (rig.hips) {
        rig.hips.position.y = 0.8 + Math.sin(t * 1.5) * 0.005
      }
      if (rig.head) {
        rig.head.rotation.z = Math.sin(t * 0.5) * 0.02
        rig.head.rotation.x = Math.sin(t * 0.8) * 0.01
      }

      if (isSigning) {
        // Signing animation — active arms and fingers movements
        if (rig.rightShoulder) {
          rig.rightShoulder.rotation.z = 0.5 + Math.sin(t * 4) * 0.6
          rig.rightShoulder.rotation.x = Math.sin(t * 3) * 0.3
        }
        if (rig.leftShoulder) {
          rig.leftShoulder.rotation.z = -0.5 - Math.sin(t * 3.5 + 1) * 0.5
          rig.leftShoulder.rotation.x = Math.sin(t * 2.5 + 0.5) * 0.3
        }
        if (rig.rightElbow) rig.rightElbow.rotation.set(-0.5 + Math.sin(t * 3) * 0.2, 0, 0)
        if (rig.leftElbow) rig.leftElbow.rotation.set(-0.5 + Math.sin(t * 3.2) * 0.2, 0, 0)

        // Dynamic finger articulation during signing
        ;[rig.leftFingers, rig.rightFingers].forEach((fingers) => {
          if (!fingers) return
          fingers.forEach((f, idx) => {
            const amt = 1.0 + Math.sin(t * 5 + idx) * 0.4
            if (f.knuckle) f.knuckle.rotation.x = amt * 0.5
            if (f.mid) f.mid.rotation.x = amt * 0.6
            if (f.tip) f.tip.rotation.x = amt * 0.45
          })
        })
      } else {
        // Idle pose with subtle breathing sways
        if (rig.leftShoulder) rig.leftShoulder.rotation.set(0.1, 0, -0.15 + Math.sin(t) * 0.02)
        if (rig.rightShoulder) rig.rightShoulder.rotation.set(0.1, 0, 0.15 - Math.sin(t) * 0.02)
        if (rig.leftElbow) rig.leftElbow.rotation.set(-0.15, 0, 0)
        if (rig.rightElbow) rig.rightElbow.rotation.set(-0.15, 0, 0)
        if (rig.leftWrist) rig.leftWrist.rotation.set(0, 0, 0)
        if (rig.rightWrist) rig.rightWrist.rotation.set(0, 0, 0)

        // Reset fingers to neutral / slight curve
        ;[rig.leftFingers, rig.rightFingers].forEach((fingers) => {
          if (!fingers) return
          fingers.forEach((f) => {
            if (f.isThumb) {
              const ry = f.knuckle.position.x > 0 ? 0.4 : -0.4
              const rz = f.knuckle.position.x > 0 ? 0.5 : -0.5
              if (f.knuckle) f.knuckle.rotation.set(0.3, ry, rz)
            } else {
              if (f.knuckle) f.knuckle.rotation.set(0.1, 0, 0)
            }
            if (f.mid) f.mid.rotation.set(0.1, 0, 0)
            if (f.tip) f.tip.rotation.set(0.1, 0, 0)
          })
        })
      }
    }

    // Processing light orbit
    if (lightRef.current) {
      if (isProcessing) {
        lightRef.current.visible = true
        lightRef.current.position.x = Math.cos(t * 3) * 1.5
        lightRef.current.position.z = Math.sin(t * 3) * 1.5
        lightRef.current.position.y = 0.5
      } else {
        lightRef.current.visible = false
      }
    }
  })

  const skinToneIndex = useAppStore((s) => s.skinTone)
  const outfitColorIndex = useAppStore((s) => s.outfitColor)

  const skinColor = ['#F5D0A9', '#E0B896', '#C69C7B', '#A67C5B', '#8B6340', '#5C3D2E'][skinToneIndex] || '#E0B896'
  const bodyColor = ['#3FD6C0', '#7C8CFF', '#F87171', '#FBBF24'][outfitColorIndex] || '#3FD6C0'

  return (
    <>
      {/* Orbiting point light for processing state */}
      <pointLight ref={lightRef} color="#3FD6C0" intensity={3} distance={5} visible={false} />

      <group position={[0, -1.2, 0]}>
        <RealisticAvatar 
          ref={avatarRef} 
          skinColor={skinColor} 
          bodyColor={bodyColor} 
        />
      </group>
    </>
  )
}

