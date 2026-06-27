import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Animated floating particle orbs around the avatar */
function ParticleOrbs() {
  const count = 60
  const mesh = useRef()

  const [positions, speeds, radii] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const rad = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      rad[i] = 1.2 + Math.random() * 1.4
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 2.5
      pos[i * 3] = Math.cos(angle) * rad[i]
      pos[i * 3 + 1] = height
      pos[i * 3 + 2] = Math.sin(angle) * rad[i]
      spd[i] = 0.2 + Math.random() * 0.5
    }
    return [pos, spd, rad]
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const positions = mesh.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const r = radii[i]
      const s = speeds[i]
      const baseAngle = (i / count) * Math.PI * 2
      const angle = baseAngle + t * s * 0.3
      const yOscillation = Math.sin(t * s + i) * 0.15
      positions[i * 3] = Math.cos(angle) * r
      positions[i * 3 + 1] = (positions[i * 3 + 1] || 0) + yOscillation * 0.01
      positions[i * 3 + 2] = Math.sin(angle) * r
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#7c3aed"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

/** Glowing ring orbiting around avatar */
function OrbitRing({ radius = 1.6, tilt = 0, speed = 0.4, color = '#6366f1' }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.z = t * speed
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2.5}
        transparent
        opacity={0.55}
      />
    </mesh>
  )
}

export default function LandingAvatar() {
  const groupRef = useRef()
  const rightArmRef = useRef()
  const leftArmRef = useRef()
  const headRef = useRef()
  const bodyRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Gentle float
    if (groupRef.current) {
      groupRef.current.position.y = -0.9 + Math.sin(t * 1.4) * 0.07
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12
    }

    // Breathing
    if (bodyRef.current) {
      bodyRef.current.scale.x = 1 + Math.sin(t * 2) * 0.015
      bodyRef.current.scale.z = 1 + Math.sin(t * 2) * 0.015
    }

    // Waving right arm
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -1.1 + Math.sin(t * 3) * 0.45
      rightArmRef.current.rotation.x = Math.sin(t * 2.5) * 0.15
    }

    // Left arm sway
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.9 + Math.sin(t * 1.5) * 0.12
    }

    // Head gentle nod
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.2) * 0.07
      headRef.current.rotation.x = Math.sin(t * 0.9) * 0.05
    }
  })

  const skinColor = '#e8c5a0'
  const bodyColor = '#6366f1'
  const accentColor = '#818cf8'
  const darkColor = '#1e1b4b'
  const pantColor = '#312e81'

  return (
    <group ref={groupRef} position={[0, -0.9, 0]}>
      {/* Particle ring effects */}
      <ParticleOrbs />
      <OrbitRing radius={1.55} tilt={0.2}  speed={0.35}  color="#6366f1" />
      <OrbitRing radius={1.85} tilt={-0.35} speed={-0.22} color="#a78bfa" />
      <OrbitRing radius={1.25} tilt={1.1}  speed={0.5}   color="#38bdf8" />

      {/* Head */}
      <group ref={headRef} position={[0, 2.0, 0]}>
        <mesh>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshStandardMaterial
            color={skinColor}
            roughness={0.45}
            metalness={0.05}
          />
        </mesh>
        {/* Eyes */}
        {[[-0.11, 0.07, 0.28], [0.11, 0.07, 0.28]].map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color={darkColor} emissive={accentColor} emissiveIntensity={0.5} />
          </mesh>
        ))}
        {/* Smile */}
        <mesh position={[0, -0.09, 0.29]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.065, 0.014, 8, 16, Math.PI]} />
          <meshStandardMaterial color={darkColor} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.18, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* Torso */}
      <group ref={bodyRef}>
        <mesh position={[0, 0.95, 0]}>
          <capsuleGeometry args={[0.32, 0.75, 8, 16]} />
          <meshStandardMaterial
            color={bodyColor}
            emissive={bodyColor}
            emissiveIntensity={0.15}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
        {/* Collar detail */}
        <mesh position={[0, 1.45, 0.28]}>
          <torusGeometry args={[0.18, 0.025, 8, 24, Math.PI]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Right arm (waving) */}
      <group position={[0.48, 1.38, 0]}>
        <group ref={rightArmRef} rotation={[0, 0, -1.1]}>
          <mesh position={[0, -0.28, 0]}>
            <capsuleGeometry args={[0.075, 0.38, 8, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Forearm */}
          <mesh position={[0, -0.62, 0]}>
            <capsuleGeometry args={[0.065, 0.3, 8, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.85, 0]}>
            <sphereGeometry args={[0.095, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Left arm */}
      <group position={[-0.48, 1.38, 0]}>
        <group ref={leftArmRef} rotation={[0, 0, 0.9]}>
          <mesh position={[0, -0.28, 0]}>
            <capsuleGeometry args={[0.075, 0.38, 8, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.62, 0]}>
            <capsuleGeometry args={[0.065, 0.3, 8, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.85, 0]}>
            <sphereGeometry args={[0.095, 16, 16]} />
            <meshStandardMaterial color={skinColor} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* Pants / Legs */}
      {[[-0.16, 0.1, 0], [0.16, 0.1, 0]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <capsuleGeometry args={[0.105, 0.55, 8, 16]} />
          <meshStandardMaterial color={pantColor} roughness={0.6} />
        </mesh>
      ))}

      {/* Shoes */}
      {[[-0.16, -0.28, 0.06], [0.16, -0.28, 0.06]].map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.18, 0.1, 0.28]} />
          <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.4} />
        </mesh>
      ))}

      {/* Ground glow disc */}
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55, 64]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.8}
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  )
}
