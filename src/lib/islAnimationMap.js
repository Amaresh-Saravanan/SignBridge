import * as THREE from 'three'

const _euler = new THREE.Euler()
const _quat = new THREE.Quaternion()

function qFromEuler(x, y, z) {
  _euler.set(x, y, z)
  _quat.setFromEuler(_euler)
  return [_quat.x, _quat.y, _quat.z, _quat.w]
}

const GLOSS_POSES = {
  HELLO: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.8) },
    rightElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0.3, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  THANK_YOU: {
    rightShoulder: { quaternion: qFromEuler(0.4, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.8, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.4, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.2, 0.3, 0.2), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  PLEASE: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.4) },
    rightElbow: { quaternion: qFromEuler(-0.7, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.3, 0, 0) },
    rightHand: { quaternion: qFromEuler(0, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.15, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.15, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.15, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.15, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.15, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  YES: {
    head: { quaternion: qFromEuler(0.15, 0, 0) },
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  NO: {
    head: { quaternion: qFromEuler(0, 0.25, 0) },
    rightShoulder: { quaternion: qFromEuler(0.2, 0, -0.3) },
    rightElbow: { quaternion: qFromEuler(-0.5, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.1, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0, 0, 0), mid_quaternion: qFromEuler(0, 0, 0), tip_quaternion: qFromEuler(0, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0, 0, 0), mid_quaternion: qFromEuler(0, 0, 0), tip_quaternion: qFromEuler(0, 0, 0) },
      { knuckle_quaternion: qFromEuler(0, 0, 0), mid_quaternion: qFromEuler(0, 0, 0), tip_quaternion: qFromEuler(0, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [-0.1, 0, 0] },
      rightEyebrow: { rotation: [-0.1, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  HELP: {
    leftShoulder: { quaternion: qFromEuler(0.3, 0, 0.4) },
    leftElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    leftWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.4) },
    rightElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    leftFingers: [
      { knuckle_quaternion: qFromEuler(0.6, 0, 0), mid_quaternion: qFromEuler(0.5, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.6, 0, 0), mid_quaternion: qFromEuler(0.5, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.6, 0, 0), mid_quaternion: qFromEuler(0.5, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.6, 0, 0), mid_quaternion: qFromEuler(0.5, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.6, 0, 0), mid_quaternion: qFromEuler(0.5, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) }
    ],
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [-0.15, 0, 0] },
      rightEyebrow: { rotation: [-0.15, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  WATER: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.7, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.3, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0.2), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  FOOD: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.4) },
    rightElbow: { quaternion: qFromEuler(-0.8, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.4, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.3, 0.1, 0.1), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  HOME: {
    rightShoulder: { quaternion: qFromEuler(0.4, 0, -0.6) },
    rightElbow: { quaternion: qFromEuler(-0.9, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.3, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  SCHOOL: {
    leftShoulder: { quaternion: qFromEuler(0.3, 0, 0.4) },
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.4) },
    leftElbow: { quaternion: qFromEuler(-0.5, 0, 0) },
    rightElbow: { quaternion: qFromEuler(-0.5, 0, 0) },
    leftFingers: [
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) }
    ],
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  DOCTOR: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.7, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.3, 0.2, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  GOOD: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.6, 0, 0), mid_quaternion: qFromEuler(0.5, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0.1, 0, 0] },
      rightEyebrow: { rotation: [0.1, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  BAD: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [-0.15, 0, 0] },
      rightEyebrow: { rotation: [-0.15, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  I: {
    rightShoulder: { quaternion: qFromEuler(0.2, 0, -0.3) },
    rightElbow: { quaternion: qFromEuler(-0.5, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  YOU: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.4, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.1, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  NOT: {
    head: { quaternion: qFromEuler(0, -0.3, 0) },
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.5, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [-0.15, 0, 0] },
      rightEyebrow: { rotation: [-0.15, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  WHERE: {
    head: { quaternion: qFromEuler(-0.1, 0.2, 0) },
    leftShoulder: { quaternion: qFromEuler(0.3, 0, 0.5) },
    leftElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    leftWrist: { quaternion: qFromEuler(0.2, 0.3, 0) },
    leftFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [-0.2, 0, 0] },
      rightEyebrow: { rotation: [-0.2, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  NOW: {
    head: { quaternion: qFromEuler(0.1, 0, 0) },
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.4) },
    rightElbow: { quaternion: qFromEuler(-0.5, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.3, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  TOMORROW: {
    head: { quaternion: qFromEuler(0, 0, -0.15) },
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  YESTERDAY: {
    head: { quaternion: qFromEuler(0, 0, 0.15) },
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.6, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.2, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  EAT: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.4) },
    rightElbow: { quaternion: qFromEuler(-0.8, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.4, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.3, 0.1, 0.1), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.3, 0, 0), mid_quaternion: qFromEuler(0.3, 0, 0), tip_quaternion: qFromEuler(0.2, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  },

  GO: {
    rightShoulder: { quaternion: qFromEuler(0.3, 0, -0.5) },
    rightElbow: { quaternion: qFromEuler(-0.4, 0, 0) },
    rightWrist: { quaternion: qFromEuler(0.1, 0, 0) },
    rightFingers: [
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.8, 0, 0), mid_quaternion: qFromEuler(0.6, 0, 0), tip_quaternion: qFromEuler(0.4, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) },
      { knuckle_quaternion: qFromEuler(0.1, 0, 0), mid_quaternion: qFromEuler(0.1, 0, 0), tip_quaternion: qFromEuler(0.1, 0, 0) }
    ],
    face: {
      leftEyebrow: { rotation: [0, 0, 0] },
      rightEyebrow: { rotation: [0, 0, 0] },
      mouth: { rotation: [0, 0, 0] }
    }
  }
}

export function getPoseForGloss(gloss) {
  const normalized = gloss.toUpperCase().replace(/[^A-Z_]/g, '')
  return GLOSS_POSES[normalized] || null
}

export function getAvailableGlosses() {
  return Object.keys(GLOSS_POSES)
}

export function getNMMForSentenceType(sentenceType) {
  switch (sentenceType) {
    case 'yes_no_question':
      return {
        leftEyebrow: { rotation: [0.25, 0, 0] },
        rightEyebrow: { rotation: [0.25, 0, 0] },
        head: { quaternion: qFromEuler(-0.1, 0, 0) }
      }
    case 'wh_question':
      return {
        leftEyebrow: { rotation: [-0.2, 0, 0] },
        rightEyebrow: { rotation: [-0.2, 0, 0] },
        head: { quaternion: qFromEuler(0, 0.15, 0) }
      }
    case 'negation':
      return {
        head: { quaternion: qFromEuler(0, -0.3, 0) },
        leftEyebrow: { rotation: [-0.15, 0, 0] },
        rightEyebrow: { rotation: [-0.15, 0, 0] }
      }
    case 'affirmation':
      return {
        head: { quaternion: qFromEuler(0.15, 0, 0) }
      }
    default:
      return null
  }
}
