import { Canvas } from '@react-three/fiber'

import HubAvatar from '../components/three/HubAvatar'

export default function Hub() {
  return (
    <div className="h-screen w-full bg-bg-base">
      <Canvas camera={{ position: [0, 0.1, 3.2], fov: 35 }} className="h-full w-full">
        <color attach="background" args={['#0A0C10']} />
        <ambientLight intensity={0.9} />
        <hemisphereLight intensity={0.7} groundColor="#08090c" />
        <directionalLight position={[4, 6, 4]} intensity={1.6} />
        <directionalLight position={[-3, 4, 2]} intensity={0.5} color="#89a9ff" />
        <HubAvatar />
      </Canvas>
    </div>
  )
}
