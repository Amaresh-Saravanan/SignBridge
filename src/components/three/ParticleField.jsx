import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 600 }) {
  const meshA = useRef()
  const meshB = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  // Track mouse for parallax
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const handleMouse = (e) => {
        mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', handleMouse)
      return () => window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  // Layer A — teal particles drifting upward
  const positionsA = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  // Layer B — indigo particles drifting diagonally
  const positionsB = useMemo(() => {
    const halfCount = Math.floor(count / 2)
    const arr = new Float32Array(halfCount * 3)
    for (let i = 0; i < halfCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    // Mouse parallax (±2°)
    const tiltX = mouse.current.y * 0.035
    const tiltY = mouse.current.x * 0.035

    if (meshA.current) {
      meshA.current.rotation.x = tiltX
      meshA.current.rotation.y = tiltY
      // Slow upward drift
      const posArr = meshA.current.geometry.attributes.position.array
      for (let i = 1; i < posArr.length; i += 3) {
        posArr[i] += delta * 0.08
        if (posArr[i] > 10) posArr[i] = -10
      }
      meshA.current.geometry.attributes.position.needsUpdate = true
    }

    if (meshB.current) {
      meshB.current.rotation.x = tiltX * 0.8
      meshB.current.rotation.y = tiltY * 0.8
      // Diagonal drift
      const posArr = meshB.current.geometry.attributes.position.array
      for (let i = 0; i < posArr.length; i += 3) {
        posArr[i] += delta * 0.04
        posArr[i + 1] += delta * 0.06
        if (posArr[i] > 10) posArr[i] = -10
        if (posArr[i + 1] > 10) posArr[i + 1] = -10
      }
      meshB.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <points ref={meshA}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positionsA}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color={new THREE.Color(0.247, 0.839, 0.753)}
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <points ref={meshB}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={Math.floor(count / 2)}
            array={positionsB}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={new THREE.Color(0.486, 0.549, 1.0)}
          transparent
          opacity={0.25}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </>
  )
}
