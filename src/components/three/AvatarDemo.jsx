import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RealisticAvatar } from './RealisticAvatar'

/**
 * Placeholder 3D avatar for the landing page demo.
 * A realistic humanoid figure that performs a simple waving animation loop.
 */
export default function AvatarDemo() {
  const avatarRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const rig = avatarRef.current

    if (rig) {
      // Breathing: subtle hip position animation
      if (rig.hips) {
        rig.hips.position.y = 0.8 + Math.sin(t * 2.5) * 0.005
      }

      // Waving: right shoulder oscillates
      if (rig.rightShoulder) {
        const wave = Math.sin(t * 3) * 0.4
        rig.rightShoulder.rotation.z = 0.8 + wave
        rig.rightShoulder.rotation.x = -0.2
      }

      // Left arm subtle sway
      if (rig.leftShoulder) {
        rig.leftShoulder.rotation.set(0.1, 0, -0.15 + Math.sin(t * 1.5) * 0.05)
      }
      if (rig.leftElbow) {
        rig.leftElbow.rotation.set(-0.15, 0, 0)
      }

      // Head gentle tilt
      if (rig.head) {
        rig.head.rotation.z = Math.sin(t * 1.2) * 0.06
        rig.head.rotation.x = Math.sin(t * 0.8) * 0.04
      }

      // Fingers: relaxed curl except waving hand which is open/slightly spread
      ;[rig.leftFingers, rig.rightFingers].forEach((fingers, isRight) => {
        if (!fingers) return
        fingers.forEach((f) => {
          if (f.isThumb) {
            const ry = f.knuckle.position.x > 0 ? 0.4 : -0.4
            const rz = f.knuckle.position.x > 0 ? 0.5 : -0.5
            if (f.knuckle) f.knuckle.rotation.set(0.3, ry, rz)
          } else {
            // Curled slightly for left, flat for right (waving)
            const curlVal = isRight ? 0.1 : 0.6
            if (f.knuckle) f.knuckle.rotation.set(curlVal, 0, 0)
          }
          if (f.mid) f.mid.rotation.set(0.1, 0, 0)
          if (f.tip) f.tip.rotation.set(0.1, 0, 0)
        })
      })
    }
  })

  const skinColor = '#E0B896'
  const bodyColor = '#3FD6C0'

  return (
    <group position={[0, -1.2, 0]}>
      <RealisticAvatar 
        ref={avatarRef} 
        skinColor={skinColor} 
        bodyColor={bodyColor} 
      />
    </group>
  )
}

