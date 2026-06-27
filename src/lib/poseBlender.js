import * as THREE from 'three'

const _q1 = new THREE.Quaternion()
const _q2 = new THREE.Quaternion()
const _v1 = new THREE.Vector3()
const _v2 = new THREE.Vector3()

export class PoseBlender {
  constructor() {
    this.transitions = new Map()
    this.defaultDuration = 0.25
  }

  setTransitionDuration(boneName, duration) {
    this.transitions.set(boneName, duration)
  }

  getDuration(boneName) {
    return this.transitions.get(boneName) || this.defaultDuration
  }

  slerpQuaternion(out, a, b, t) {
    out.copy(a).slerp(b, t)
    return out
  }

  lerpVector3(out, a, b, t) {
    out.copy(a).lerp(b, t)
    return out
  }

  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  computeBlendFactor(elapsed, duration) {
    const raw = Math.min(elapsed / duration, 1)
    return this.easeInOutCubic(raw)
  }

  blendPose(rig, fromPose, toPose, progress) {
    if (!rig) return

    const boneKeys = [
      'hips', 'spine', 'chest', 'neck', 'head',
      'leftShoulder', 'leftUpperArm', 'leftElbow', 'leftForearm', 'leftWrist', 'leftHand',
      'rightShoulder', 'rightUpperArm', 'rightElbow', 'rightForearm', 'rightWrist', 'rightHand'
    ]

    boneKeys.forEach((key) => {
      const bone = rig[key]
      if (!bone) return

      const from = fromPose?.[key]
      const to = toPose?.[key]
      if (!from || !to) return

      if (from.quaternion && to.quaternion) {
        _q1.fromArray(from.quaternion)
        _q2.fromArray(to.quaternion)
        bone.quaternion.slerp(_q2, progress)
      }

      if (from.position && to.position) {
        _v1.fromArray(from.position)
        _v2.fromArray(to.position)
        bone.position.lerp(_v2, progress)
      }
    })

    this.blendFingers(rig, fromPose, toPose, progress)
    this.blendFace(rig, fromPose, toPose, progress)
  }

  blendFingers(rig, fromPose, toPose, progress) {
    const hands = ['leftFingers', 'rightFingers']
    hands.forEach((handKey) => {
      const fingers = rig[handKey]
      if (!fingers) return

      const fromFingers = fromPose?.[handKey]
      const toFingers = toPose?.[handKey]

      fingers.forEach((finger, i) => {
        const fromF = fromFingers?.[i]
        const toF = toFingers?.[i]
        if (!fromF || !toF) return

        const jointKeys = ['knuckle', 'mid', 'tip']
        jointKeys.forEach((jk) => {
          const bone = finger[jk]
          if (!bone) return

          const fromQ = fromF[jk + '_quaternion']
          const toQ = toF[jk + '_quaternion']
          if (fromQ && toQ) {
            _q1.fromArray(fromQ)
            _q2.fromArray(toQ)
            bone.quaternion.slerp(_q2, progress)
          }
        })
      })
    })
  }

  blendFace(rig, fromPose, toPose, progress) {
    const faceParts = ['leftEyebrow', 'rightEyebrow', 'mouth']
    faceParts.forEach((key) => {
      const bone = rig[key]
      if (!bone) return

      const from = fromPose?.face?.[key]
      const to = toPose?.face?.[key]
      if (!from || !to) return

      if (from.rotation && to.rotation) {
        _v1.fromArray(from.rotation)
        _v2.fromArray(to.rotation)
        bone.rotation.lerp(_v2, progress)
      }
    })
  }
}

export function createIdlePose() {
  return {
    hips: { position: [0, 0.8, 0], quaternion: [0, 0, 0, 1] },
    spine: { quaternion: [0, 0, 0, 1] },
    chest: { quaternion: [0, 0, 0, 1] },
    neck: { quaternion: [0, 0, 0, 1] },
    head: { quaternion: [0, 0, 0, 1] },
    leftShoulder: { quaternion: [0.1, 0, -0.15, 1] },
    leftUpperArm: { quaternion: [0, 0, 0, 1] },
    leftElbow: { quaternion: [-0.15, 0, 0, 1] },
    leftForearm: { quaternion: [0, 0, 0, 1] },
    leftWrist: { quaternion: [0, 0, 0, 1] },
    leftHand: { quaternion: [0, 0, 0, 1] },
    rightShoulder: { quaternion: [0.1, 0, 0.15, 1] },
    rightUpperArm: { quaternion: [0, 0, 0, 1] },
    rightElbow: { quaternion: [-0.15, 0, 0, 1] },
    rightForearm: { quaternion: [0, 0, 0, 1] },
    rightWrist: { quaternion: [0, 0, 0, 1] },
    rightHand: { quaternion: [0, 0, 0, 1] },
    leftFingers: Array(5).fill(null).map(() => ({
      knuckle_quaternion: [0, 0, 0, 1],
      mid_quaternion: [0, 0, 0, 1],
      tip_quaternion: [0, 0, 0, 1]
    })),
    rightFingers: Array(5).fill(null).map(() => ({
      knuckle_quaternion: [0, 0, 0, 1],
      mid_quaternion: [0, 0, 0, 1],
      tip_quaternion: [0, 0, 0, 1]
    })),
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  }
}
