import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAppStore } from '../../stores/appStore'
import { RealisticAvatar } from './RealisticAvatar'
import { PoseBlender, createIdlePose } from '../../lib/poseBlender'
import { getPoseForGloss, getNMMForSentenceType } from '../../lib/islAnimationMap'

const BLEND_DURATION = 0.25
const GLOSS_HOLD_TIME = 0.8
const GLOSS_HOLD_MIN = 0.6
const GLOSS_HOLD_MAX = 1.2

const blender = new PoseBlender()
blender.defaultDuration = BLEND_DURATION

export default function HubAvatar() {
  const avatarRef = useRef()
  const lightRef = useRef()

  const isProcessing = useAppStore((s) => s.isProcessing)
  const currentGloss = useAppStore((s) => s.currentGloss)
  const glossQueue = useAppStore((s) => s.glossQueue)
  const sentenceType = useAppStore((s) => s.sentenceType)
  const dequeueGloss = useAppStore((s) => s.dequeueGloss)
  const setIsAnimating = useAppStore((s) => s.setIsAnimating)
  const setCurrentGloss = useAppStore((s) => s.setCurrentGloss)

  const blendState = useRef({
    fromPose: createIdlePose(),
    toPose: createIdlePose(),
    elapsed: 0,
    duration: BLEND_DURATION,
    phase: 'idle',
    holdTimer: 0,
    holdDuration: GLOSS_HOLD_TIME,
    nmmApplied: false,
    lastGloss: null
  })

  const skinToneIndex = useAppStore((s) => s.skinTone)
  const outfitColorIndex = useAppStore((s) => s.outfitColor)
  const skinColor = ['#F5D0A9', '#E0B896', '#C69C7B', '#A67C5B', '#8B6340', '#5C3D2E'][skinToneIndex] || '#E0B896'
  const bodyColor = ['#3FD6C0', '#7C8CFF', '#F87171', '#FBBF24'][outfitColorIndex] || '#3FD6C0'

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const rig = avatarRef.current
    const bs = blendState.current

    if (!rig) return

    if (bs.phase === 'blending') {
      bs.elapsed += state.clock.getDelta()
      const progress = Math.min(bs.elapsed / bs.duration, 1)
      const eased = blender.easeInOutCubic(progress)

      blender.blendPose(rig, bs.fromPose, bs.toPose, eased)

      if (progress >= 1) {
        bs.phase = 'holding'
        bs.holdTimer = 0
      }
    } else if (bs.phase === 'holding') {
      bs.holdTimer += state.clock.getDelta()

      if (bs.holdTimer >= bs.holdDuration) {
        bs.phase = 'returning'
        bs.fromPose = extractCurrentPose(rig)
        bs.toPose = createIdlePose()
        bs.elapsed = 0
        bs.duration = BLEND_DURATION
        bs.nmmApplied = false
      }
    } else if (bs.phase === 'returning') {
      bs.elapsed += state.clock.getDelta()
      const progress = Math.min(bs.elapsed / bs.duration, 1)
      const eased = blender.easeInOutCubic(progress)

      blender.blendPose(rig, bs.fromPose, bs.toPose, eased)

      if (progress >= 1) {
        bs.phase = 'idle'
        setIsAnimating(false)
        setCurrentGloss(null)

        if (glossQueue.length > 0) {
          dequeueGloss()
        }
      }
    } else {
      applyIdleMotion(rig, t)
    }

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

  useEffect(() => {
    if (currentGloss && avatarRef.current && blendState.current.phase === 'idle') {
      const pose = getPoseForGloss(currentGloss)
      if (!pose) return

      const rig = avatarRef.current
      const bs = blendState.current

      bs.fromPose = extractCurrentPose(rig)
      bs.toPose = { ...pose }

      if (sentenceType && !bs.nmmApplied) {
        const nmm = getNMMForSentenceType(sentenceType)
        if (nmm) {
          bs.toPose = { ...bs.toPose, ...nmm }
          bs.nmmApplied = true
        }
      }

      bs.elapsed = 0
      bs.duration = BLEND_DURATION
      bs.holdDuration = GLOSS_HOLD_MIN + Math.random() * (GLOSS_HOLD_MAX - GLOSS_HOLD_MIN)
      bs.phase = 'blending'
      bs.lastGloss = currentGloss

      setIsAnimating(true)
    }
  }, [currentGloss, sentenceType, dequeueGloss, setIsAnimating, setCurrentGloss])

  useEffect(() => {
    if (glossQueue.length > 0 && !currentGloss && blendState.current.phase === 'idle') {
      dequeueGloss()
    }
  }, [glossQueue, currentGloss, dequeueGloss])

  return (
    <>
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

function extractCurrentPose(rig) {
  const tempQ = new THREE.Quaternion()
  const pose = {}

  const boneKeys = [
    'hips', 'spine', 'chest', 'neck', 'head',
    'leftShoulder', 'leftUpperArm', 'leftElbow', 'leftForearm', 'leftWrist', 'leftHand',
    'rightShoulder', 'rightUpperArm', 'rightElbow', 'rightForearm', 'rightWrist', 'rightHand'
  ]

  boneKeys.forEach((key) => {
    const bone = rig[key]
    if (!bone) return
    tempQ.copy(bone.quaternion)
    pose[key] = {
      quaternion: [tempQ.x, tempQ.y, tempQ.z, tempQ.w],
      position: [bone.position.x, bone.position.y, bone.position.z]
    }
  })

  ;['leftFingers', 'rightFingers'].forEach((handKey) => {
    const fingers = rig[handKey]
    if (!fingers) return
    pose[handKey] = fingers.map((finger) => {
      const result = {}
      ;['knuckle', 'mid', 'tip'].forEach((jk) => {
        const bone = finger[jk]
        if (bone) {
          tempQ.copy(bone.quaternion)
          result[jk + '_quaternion'] = [tempQ.x, tempQ.y, tempQ.z, tempQ.w]
        }
      })
      return result
    })
  })

  pose.face = {
    leftEyebrow: rig.leftEyebrow ? { rotation: [rig.leftEyebrow.rotation.x, rig.leftEyebrow.rotation.y, rig.leftEyebrow.rotation.z] } : { rotation: [0, 0, 0] },
    rightEyebrow: rig.rightEyebrow ? { rotation: [rig.rightEyebrow.rotation.x, rig.rightEyebrow.rotation.y, rig.rightEyebrow.rotation.z] } : { rotation: [0, 0, 0] },
    mouth: rig.mouth ? { rotation: [rig.mouth.rotation.x, rig.mouth.rotation.y, rig.mouth.rotation.z] } : { rotation: [0, 0, 0] }
  }

  return pose
}

function applyIdleMotion(rig, t) {
  if (rig.hips) {
    rig.hips.position.y = 0.8 + Math.sin(t * 1.5) * 0.005
  }
  if (rig.head) {
    rig.head.rotation.z = Math.sin(t * 0.5) * 0.02
    rig.head.rotation.x = Math.sin(t * 0.8) * 0.01
  }
  if (rig.leftShoulder) rig.leftShoulder.rotation.set(0.1, 0, -0.15 + Math.sin(t) * 0.02)
  if (rig.rightShoulder) rig.rightShoulder.rotation.set(0.1, 0, 0.15 - Math.sin(t) * 0.02)
  if (rig.leftElbow) rig.leftElbow.rotation.set(-0.15, 0, 0)
  if (rig.rightElbow) rig.rightElbow.rotation.set(-0.15, 0, 0)
  if (rig.leftWrist) rig.leftWrist.rotation.set(0, 0, 0)
  if (rig.rightWrist) rig.rightWrist.rotation.set(0, 0, 0)

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
