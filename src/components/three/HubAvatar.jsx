import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../../stores/appStore'

/**
 * Hub avatar — placeholder geometric humanoid that reacts to app state.
 * Idle: breathing. Processing: orbiting light. Signing: more animated gestures.
 * Replace with real .glb model when ISL clips are ready.
 */
export default function HubAvatar() {
  const groupRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()
  const headRef = useRef()
  const lightRef = useRef()

  const isProcessing = useAppStore((s) => s.isProcessing)
  const isSigning = useAppStore((s) => s.isSigning)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Breathing
    if (groupRef.current) {
      groupRef.current.scale.y = 1 + Math.sin(t * 2.5) * 0.008
    }

    // Head
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.2) * 0.05
      headRef.current.rotation.x = Math.sin(t * 0.8) * 0.03
    }

    if (isSigning) {
      // Signing animation — more vigorous arm movements
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -0.8 + Math.sin(t * 4) * 0.6
        rightArmRef.current.rotation.x = Math.sin(t * 3) * 0.3
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.8 + Math.sin(t * 3.5 + 1) * 0.5
        leftArmRef.current.rotation.x = Math.sin(t * 2.5 + 0.5) * 0.3
      }
    } else {
      // Idle arms
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -0.15 + Math.sin(t * 1.5) * 0.05
        rightArmRef.current.rotation.x = 0
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = 0.15 + Math.sin(t * 1.5 + 1) * 0.05
        leftArmRef.current.rotation.x = 0
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
  const darkColor = '#1F2024'

  return (
    <>
      {/* Orbiting point light for processing state */}
      <pointLight ref={lightRef} color="#3FD6C0" intensity={3} distance={5} visible={false} />

      <group ref={groupRef} position={[0, -1.2, 0]}>
        {/* Head */}
        <group ref={headRef} position={[0, 1.85, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          <mesh position={[-0.1, 0.05, 0.26]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={darkColor} />
          </mesh>
          <mesh position={[0.1, 0.05, 0.26]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={darkColor} />
          </mesh>
          <mesh position={[0, -0.08, 0.27]}>
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

        {/* Right arm */}
        <group position={[0.45, 1.3, 0]}>
          <group ref={rightArmRef}>
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

        {/* Left arm */}
        <group position={[-0.45, 1.3, 0]}>
          <group ref={leftArmRef}>
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
    </>
  )
}
