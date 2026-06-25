import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'

// Constants for materials
const baseProps = { roughness: 0.7, metalness: 0.0 }
const darkColor = '#1F2024'
const mouthBaseColor = '#8a5b4a'

export const RealisticAvatar = forwardRef(({ 
  skinColor = '#ffd2b1', 
  bodyColor = '#5ba0d0', 
  pantsColor = '#203884',
  hairColor = '#422a14'
}, ref) => {
  // Skeleton Refs
  const hipsRef = useRef()
  const spineRef = useRef()
  const chestRef = useRef()
  const neckRef = useRef()
  const headRef = useRef()
  const leftEyebrowRef = useRef()
  const rightEyebrowRef = useRef()
  const mouthRef = useRef()

  // Left Arm Refs
  const leftShoulderRef = useRef()
  const leftUpperArmRef = useRef()
  const leftElbowRef = useRef()
  const leftForearmRef = useRef()
  const leftWristRef = useRef()
  const leftHandRef = useRef()

  // Right Arm Refs
  const rightShoulderRef = useRef()
  const rightUpperArmRef = useRef()
  const rightElbowRef = useRef()
  const rightForearmRef = useRef()
  const rightWristRef = useRef()
  const rightHandRef = useRef()

  // Finger Refs definition helper
  const createFingerRefs = () => ({
    knuckle: useRef(),
    mid: useRef(),
    tip: useRef()
  })

  const fingerRefs = {
    left: {
      thumb: createFingerRefs(),
      index: createFingerRefs(),
      middle: createFingerRefs(),
      ring: createFingerRefs(),
      pinky: createFingerRefs()
    },
    right: {
      thumb: createFingerRefs(),
      index: createFingerRefs(),
      middle: createFingerRefs(),
      ring: createFingerRefs(),
      pinky: createFingerRefs()
    }
  }

  // Expose the rig structure exactly how animations.js expects it
  useImperativeHandle(ref, () => ({
    hips: hipsRef.current,
    spine: spineRef.current,
    chest: chestRef.current,
    neck: neckRef.current,
    head: headRef.current,
    leftEyebrow: leftEyebrowRef.current,
    rightEyebrow: rightEyebrowRef.current,
    mouth: mouthRef.current,

    leftShoulder: leftShoulderRef.current,
    leftUpperArm: leftUpperArmRef.current,
    leftElbow: leftElbowRef.current,
    leftForearm: leftForearmRef.current,
    leftWrist: leftWristRef.current,
    leftHand: leftHandRef.current,

    rightShoulder: rightShoulderRef.current,
    rightUpperArm: rightUpperArmRef.current,
    rightElbow: rightElbowRef.current,
    rightForearm: rightForearmRef.current,
    rightWrist: rightWristRef.current,
    rightHand: rightHandRef.current,

    leftFingers: Object.entries(fingerRefs.left).map(([name, refs]) => ({
      name,
      isThumb: name === 'thumb',
      knuckle: refs.knuckle.current,
      mid: refs.mid.current,
      tip: refs.tip.current
    })),
    rightFingers: Object.entries(fingerRefs.right).map(([name, refs]) => ({
      name,
      isThumb: name === 'thumb',
      knuckle: refs.knuckle.current,
      mid: refs.mid.current,
      tip: refs.tip.current
    }))
  }))

  // Finger configurations
  const knLen = 0.025
  const midLen = 0.02
  const tipLen = 0.015

  const getFingerConfigs = (side) => [
    { name: 'thumb',  xOff: side * 0.035, zOff: 0.015,  kL: 0.02,      mL: 0.018,      tL: 0.015,      rBase: 0.012, isThumb: true,  refs: fingerRefs[side === -1 ? 'left' : 'right'].thumb },
    { name: 'index',  xOff: side * 0.015, zOff: -0.035, kL: knLen,     mL: midLen,     tL: tipLen,     rBase: 0.01,  isThumb: false, refs: fingerRefs[side === -1 ? 'left' : 'right'].index },
    { name: 'middle', xOff: 0,            zOff: -0.035, kL: knLen*1.1, mL: midLen*1.1, tL: tipLen*1.1, rBase: 0.01,  isThumb: false, refs: fingerRefs[side === -1 ? 'left' : 'right'].middle },
    { name: 'ring',   xOff: -side * 0.015,zOff: -0.035, kL: knLen,     mL: midLen,     tL: tipLen,     rBase: 0.01,  isThumb: false, refs: fingerRefs[side === -1 ? 'left' : 'right'].ring },
    { name: 'pinky',  xOff: -side * 0.03, zOff: -0.03,  kL: knLen*0.8, mL: midLen*0.8, tL: tipLen*0.8, rBase: 0.009, isThumb: false, refs: fingerRefs[side === -1 ? 'left' : 'right'].pinky },
  ]

  // Helper component to render a single jointed finger
  const RenderFinger = ({ config, side }) => {
    const rA = config.rBase
    const rB = config.rBase * 0.9
    const rC = config.rBase * 0.8
    const rD = config.rBase * 0.7

    return (
      <group 
        ref={config.refs.knuckle}
        position={[config.xOff, config.isThumb ? -0.015 : -0.045, config.zOff]}
        rotation={config.isThumb ? [0.3, side * 0.4, side * 0.5] : [0, 0, 0]}
      >
        {/* Knuckle joint */}
        <mesh castShadow>
          <sphereGeometry args={[rA, 16, 16]} />
          <meshStandardMaterial color={skinColor} {...baseProps} />
        </mesh>
        {/* Knuckle bone */}
        <mesh castShadow position={[0, -config.kL / 2, 0]}>
          <cylinderGeometry args={[rA, rB, config.kL, 16]} />
          <meshStandardMaterial color={skinColor} {...baseProps} />
        </mesh>

        <group ref={config.refs.mid} position={[0, -config.kL, 0]}>
          {/* Mid joint */}
          <mesh castShadow>
            <sphereGeometry args={[rB, 16, 16]} />
            <meshStandardMaterial color={skinColor} {...baseProps} />
          </mesh>
          {/* Mid bone */}
          <mesh castShadow position={[0, -config.mL / 2, 0]}>
            <cylinderGeometry args={[rB, rC, config.mL, 16]} />
            <meshStandardMaterial color={skinColor} {...baseProps} />
          </mesh>

          <group ref={config.refs.tip} position={[0, -config.mL, 0]}>
            {/* Tip joint */}
            <mesh castShadow>
              <sphereGeometry args={[rC, 16, 16]} />
              <meshStandardMaterial color={skinColor} {...baseProps} />
            </mesh>
            {/* Tip bone */}
            <mesh castShadow position={[0, -config.tL / 2, 0]}>
              <cylinderGeometry args={[rC, rD, config.tL, 16]} />
              <meshStandardMaterial color={skinColor} {...baseProps} />
            </mesh>
            {/* Fingertip end */}
            <mesh castShadow position={[0, -config.tL, 0]}>
              <sphereGeometry args={[rD, 16, 16]} />
              <meshStandardMaterial color={skinColor} {...baseProps} />
            </mesh>
          </group>
        </group>
      </group>
    )
  }

  // Render a full arm assembly (left or right)
  const RenderArm = ({ side }) => {
    const isLeft = side === 'left'
    const s = isLeft ? -1 : 1
    const prefix = isLeft ? 'left' : 'right'

    const shoulderRef = isLeft ? leftShoulderRef : rightShoulderRef
    const upperArmRef = isLeft ? leftUpperArmRef : rightUpperArmRef
    const elbowRef = isLeft ? leftElbowRef : rightElbowRef
    const forearmRef = isLeft ? leftForearmRef : rightForearmRef
    const wristRef = isLeft ? leftWristRef : rightWristRef
    const handRef = isLeft ? leftHandRef : rightHandRef

    return (
      <group ref={shoulderRef} position={[s * 0.16, 0.24, 0]} rotation={[0.1, 0, s * 0.15]}>
        {/* Shoulder cap */}
        <mesh castShadow>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial color={bodyColor} {...baseProps} />
        </mesh>

        <group ref={upperArmRef}>
          {/* Upper Arm Cylinder */}
          <mesh castShadow position={[0, -0.09, 0]}>
            <cylinderGeometry args={[0.045, 0.035, 0.18, 24]} />
            <meshStandardMaterial color={bodyColor} {...baseProps} />
          </mesh>

          <group ref={elbowRef} position={[0, -0.18, 0]} rotation={[-0.15, 0, 0]}>
            {/* Elbow joint */}
            <mesh castShadow>
              <sphereGeometry args={[0.035, 24, 24]} />
              <meshStandardMaterial color={bodyColor} {...baseProps} />
            </mesh>

            <group ref={forearmRef}>
              {/* Forearm Cylinder */}
              <mesh castShadow position={[0, -0.09, 0]}>
                <cylinderGeometry args={[0.035, 0.028, 0.18, 24]} />
                <meshStandardMaterial color={bodyColor} {...baseProps} />
              </mesh>

              <group ref={wristRef} position={[0, -0.18, 0]}>
                {/* Wrist joint */}
                <mesh castShadow>
                  <sphereGeometry args={[0.028, 24, 24]} />
                  <meshStandardMaterial color={skinColor} {...baseProps} />
                </mesh>

                <group ref={handRef}>
                  {/* Palm */}
                  <mesh castShadow position={[0, -0.025, 0]} scale={[1, 0.8, 0.4]}>
                    <sphereGeometry args={[0.032, 24, 24]} />
                    <meshStandardMaterial color={skinColor} {...baseProps} />
                  </mesh>

                  {/* Articulated fingers */}
                  {getFingerConfigs(s).map((config) => (
                    <RenderFinger key={config.name} config={config} side={s} />
                  ))}
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    )
  }

  return (
    <group ref={hipsRef} position={[0, 0.8, 0]}>
      {/* Lower body (Pants) */}
      <mesh castShadow position={[0, -0.07, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.15, 32]} />
        <meshStandardMaterial color={pantsColor} {...baseProps} />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[-0.06, -0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.25, 32]} />
        <meshStandardMaterial color={pantsColor} {...baseProps} />
      </mesh>
      <mesh castShadow position={[0.06, -0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.045, 0.25, 32]} />
        <meshStandardMaterial color={pantsColor} {...baseProps} />
      </mesh>

      {/* Spine / Upper Body */}
      <group ref={spineRef}>
        <group ref={chestRef}>
          {/* Torso/Sweater */}
          <mesh castShadow position={[0, 0.12, 0]}>
            <capsuleGeometry args={[0.13, 0.18, 16, 32]} />
            <meshStandardMaterial color={bodyColor} {...baseProps} />
          </mesh>

          {/* Neck */}
          <group ref={neckRef} position={[0, 0.28, 0]}>
            <mesh castShadow position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.04, 0.045, 0.06, 32]} />
              <meshStandardMaterial color={skinColor} {...baseProps} />
            </mesh>

            {/* Head & Face */}
            <group ref={headRef} position={[0, 0.06, 0]}>
              {/* Head Base */}
              <mesh castShadow position={[0, 0.12, 0]} scale={[1.15, 1, 1.05]}>
                <sphereGeometry args={[0.14, 32, 32]} />
                <meshStandardMaterial color={skinColor} {...baseProps} />
              </mesh>

              {/* Ears */}
              <mesh castShadow position={[-0.16, 0.12, 0]} scale={[0.5, 1, 0.8]}>
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshStandardMaterial color={skinColor} {...baseProps} />
              </mesh>
              <mesh castShadow position={[0.16, 0.12, 0]} scale={[0.5, 1, 0.8]}>
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshStandardMaterial color={skinColor} {...baseProps} />
              </mesh>

              {/* Nose */}
              <mesh castShadow position={[0, 0.1, 0.145]} scale={[1, 0.8, 1]}>
                <sphereGeometry args={[0.015, 16, 16]} />
                <meshStandardMaterial color={skinColor} {...baseProps} />
              </mesh>

              {/* Eyes */}
              <mesh position={[-0.045, 0.13, 0.135]}>
                <sphereGeometry args={[0.012, 16, 16]} />
                <meshBasicMaterial color={darkColor} />
              </mesh>
              <mesh position={[0.045, 0.13, 0.135]}>
                <sphereGeometry args={[0.012, 16, 16]} />
                <meshBasicMaterial color={darkColor} />
              </mesh>

              {/* Eyebrows */}
              <mesh ref={leftEyebrowRef} position={[-0.045, 0.17, 0.13]} rotation={[0, 0, Math.PI / 2 + 0.1]}>
                <capsuleGeometry args={[0.008, 0.02, 8, 16]} />
                <meshStandardMaterial color={hairColor} {...baseProps} />
              </mesh>
              <mesh ref={rightEyebrowRef} position={[0.045, 0.17, 0.13]} rotation={[0, 0, Math.PI / 2 - 0.1]}>
                <capsuleGeometry args={[0.008, 0.02, 8, 16]} />
                <meshStandardMaterial color={hairColor} {...baseProps} />
              </mesh>

              {/* Mouth */}
              <mesh ref={mouthRef} position={[0, 0.065, 0.138]} rotation={[0.2, 0, Math.PI * 1.1]}>
                <torusGeometry args={[0.02, 0.004, 8, 16, Math.PI * 0.8]} />
                <meshBasicMaterial color={mouthBaseColor} />
              </mesh>

              {/* Hair */}
              <group>
                {/* Hair dome */}
                <mesh castShadow position={[0, 0.16, 0]} scale={[1.18, 0.9, 1.1]}>
                  <sphereGeometry args={[0.15, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                  <meshStandardMaterial color={hairColor} roughness={0.9} metalness={0.0} />
                </mesh>

                {/* Fringe / Bangs */}
                <mesh castShadow position={[-0.05, 0.24, 0.12]} rotation={[0.3, 0.2, 1.2]}>
                  <capsuleGeometry args={[0.02, 0.06, 8, 16]} />
                  <meshStandardMaterial color={hairColor} roughness={0.9} />
                </mesh>
                <mesh castShadow position={[0.0, 0.25, 0.13]} rotation={[0.3, 0, 1.57]}>
                  <capsuleGeometry args={[0.02, 0.06, 8, 16]} />
                  <meshStandardMaterial color={hairColor} roughness={0.9} />
                </mesh>
                <mesh castShadow position={[0.05, 0.24, 0.12]} rotation={[0.3, -0.2, -1.2]}>
                  <capsuleGeometry args={[0.02, 0.06, 8, 16]} />
                  <meshStandardMaterial color={hairColor} roughness={0.9} />
                </mesh>

                {/* Sideburns */}
                <mesh castShadow position={[-0.15, 0.15, 0.04]} rotation={[0, 0, 0.2]}>
                  <capsuleGeometry args={[0.015, 0.04, 8, 16]} />
                  <meshStandardMaterial color={hairColor} roughness={0.9} />
                </mesh>
                <mesh castShadow position={[0.15, 0.15, 0.04]} rotation={[0, 0, -0.2]}>
                  <capsuleGeometry args={[0.015, 0.04, 8, 16]} />
                  <meshStandardMaterial color={hairColor} roughness={0.9} />
                </mesh>
              </group>
            </group>
          </group>

          {/* Left and Right Arms */}
          <RenderArm side="left" />
          <RenderArm side="right" />
        </group>
      </group>
    </group>
  )
})

RealisticAvatar.displayName = 'RealisticAvatar'
