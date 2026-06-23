import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Placeholder 3D avatar for the landing page demo.
 * A geometric humanoid figure that performs a simple waving animation loop.
 * Replace with real .glb model + useGLTF/useAnimations when ISL clips are ready.
 */
export default function AvatarDemo() {
  const groupRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()
  const headRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Breathing: subtle body scale pulse
    if (groupRef.current) {
      groupRef.current.scale.y = 1 + Math.sin(t * 2.5) * 0.008
    }

    // Waving: right arm oscillates
    if (rightArmRef.current) {
      const wave = Math.sin(t * 3) * 0.4
      rightArmRef.current.rotation.z = -1.2 + wave
    }

    // Left arm subtle sway
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.8 + Math.sin(t * 1.5) * 0.1
    }

    // Head gentle tilt
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.2) * 0.06
      headRef.current.rotation.x = Math.sin(t * 0.8) * 0.04
    }
  })

  const skinColor = '#E0B896'
  const bodyColor = '#3FD6C0'
  const darkColor = '#1F2024'

  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {/* Head */}
      <group ref={headRef} position={[0, 1.85, 0]}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.1, 0.05, 0.26]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.26]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
        {/* Smile */}
        <mesh position={[0, -0.08, 0.27]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.3, 0.7, 8, 16]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} />
      </mesh>

      {/* Right arm (waving) */}
      <group position={[0.45, 1.3, 0]}>
        <group ref={rightArmRef} rotation={[0, 0, -1.2]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Left arm */}
      <group position={[-0.45, 1.3, 0]}>
        <group ref={leftArmRef} rotation={[0, 0, 0.8]}>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Legs */}
      <mesh position={[-0.15, 0.05, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color={darkColor} roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.05, 0]}>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color={darkColor} roughness={0.5} />
      </mesh>
    </group>
  )
}
