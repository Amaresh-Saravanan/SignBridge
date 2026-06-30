# SignBridge — 3D Avatar Technical Design Plan (TDP)
**Last Updated:** July 1, 2026 | **Phase:** 1 — Foundation

---

## Reference Images (Read These First)

```
assets/reference/
├── front.png   → Cartoon 3D avatar, front view with proportions
├── side.png    → Side profile — arm rest position, body depth
├── style.png   → Top-down view — shoulder/head width ratio
└── hands.png   → Hand model sheet — MCP/PIP/DIP joints, topology
```

**Style verdict:** Stylized cartoon 3D (Pixar-adjacent). Rounded, friendly, compact proportions. NOT hyper-realistic.

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────┐
│              Hub.jsx (Page)                      │
│  ┌──────────────────┐  ┌────────────────────┐   │
│  │   Canvas (R3F)   │  │  Dev Test Panel    │   │
│  │  ┌────────────┐  │  │  - Gesture buttons │   │
│  │  │ HubAvatar  │  │  │  - Sentence input  │   │
│  │  │            │  │  │  - Skin/outfit     │   │
│  │  │ Realistic  │  │  │  - Status badge    │   │
│  │  │ Avatar     │  │  └────────────────────┘   │
│  │  └────────────┘  │                            │
│  │  OrbitControls   │                            │
│  └──────────────────┘                            │
├──────────────────────────────────────────────────┤
│              State Layer                         │
│  appStore.js — glossQueue, currentGloss,         │
│                skinTone, outfitColor,            │
│                isAnimating, sentenceType         │
├──────────────────────────────────────────────────┤
│              Animation Layer                     │
│  HubAvatar.jsx     — orchestrates per-frame loop │
│  poseBlender.js    — SLERP quaternion blending   │
│  islAnimationMap.js — 22+ gesture pose database │
├──────────────────────────────────────────────────┤
│              Geometry Layer                      │
│  RealisticAvatar.jsx — procedural 3D model       │
│                        (no .glb file)            │
│  Three.js primitives: SphereGeometry,            │
│  CylinderGeometry, BoxGeometry                   │
└──────────────────────────────────────────────────┘
```

---

## 2. File Map

### Existing Files (Do Not Break)

| File | Purpose | Status |
|------|---------|--------|
| `src/components/three/RealisticAvatar.jsx` | Procedural 3D avatar geometry + rig | ✅ Working |
| `src/components/three/HubAvatar.jsx` | Animation loop + pose state machine | ✅ Working |
| `src/lib/islAnimationMap.js` | 22 gesture poses as quaternions | ✅ Working |
| `src/lib/poseBlender.js` | SLERP blending between poses | ✅ Working |
| `src/stores/appStore.js` | Global gesture queue + avatar state | ✅ Working |
| `src/pages/Hub.jsx` | Dev workspace UI + Canvas | ✅ Working |
| `src/pages/Landing.jsx` | Homepage | ✅ Working |
| `src/App.jsx` | Routing (/ → Landing, /hub → Hub) | ✅ Working |

### Files to Create (Phase 2+)

| File | Purpose | Priority |
|------|---------|----------|
| `src/lib/quaternionUtils.js` | Helper functions for quaternion math | HIGH |
| `src/lib/easingFunctions.js` | Easing curves (easeInOutCubic, etc.) | HIGH |
| `src/lib/gestureCache.js` | Pre-compute animation frames for speed | MEDIUM |
| `src/hooks/useAvatarAnimation.js` | React hook wrapping animation state | MEDIUM |

---

## 3. RealisticAvatar — Geometry Specification

### Based on `assets/reference/front.png` and `side.png`

All units are in Three.js world units. Avatar total height ≈ 2.4 units.

```
AVATAR PROPORTIONS (from reference)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Head:        radius 0.28,  center at y=1.5
  Neck:        radius 0.10,  y=1.15 to 1.25
  Torso:       width 0.38,   y=0.55 to 1.15
  Hips:        width 0.32,   y=0.30 to 0.60
  Upper arm:   length 0.28,  radius 0.07
  Forearm:     length 0.25,  radius 0.06
  Hand/palm:   width 0.12,   length 0.10
  Upper leg:   length 0.35,  radius 0.09
  Lower leg:   length 0.32,  radius 0.07
  Foot:        length 0.14,  radius 0.05
```

### Hand Geometry (Critical — from `hands.png`)

Reference shows: **Stylized cartoon hand, 4 fingers + thumb, 3 joints each (MCP, PIP, DIP)**

```javascript
// Per finger: 3 bone segments
// MCP = MetaCarpoPhalangeal (knuckle)  — base of finger
// PIP = Proximal InterPhalangeal       — mid joint
// DIP = Distal InterPhalangeal         — tip joint

// Finger dimensions (approximate from reference)
FINGER_SEGMENTS = {
  thumb:  { mcp: 0.06, pip: 0.05, dip: 0.04, radius: 0.025 },
  index:  { mcp: 0.07, pip: 0.06, dip: 0.04, radius: 0.022 },
  middle: { mcp: 0.08, pip: 0.065,dip: 0.045,radius: 0.022 },
  ring:   { mcp: 0.07, pip: 0.06, dip: 0.04, radius: 0.020 },
  pinky:  { mcp: 0.055,pip: 0.04, dip: 0.03, radius: 0.018 },
}

// Thumb offset from palm: ~45° palmar abduction
// Finger spread in rest pose: slight fan (0° to 5° between fingers)
```

### useImperativeHandle Exposed API

`RealisticAvatar` exposes these refs for animation:

```javascript
// Body skeleton
ref.hips         // THREE.Group — root, controls whole body position
ref.spine        // THREE.Group
ref.chest        // THREE.Group
ref.neck         // THREE.Group
ref.head         // THREE.Group

// Left arm chain
ref.leftShoulder   // THREE.Group
ref.leftUpperArm   // THREE.Group
ref.leftElbow      // THREE.Group
ref.leftForearm    // THREE.Group
ref.leftWrist      // THREE.Group
ref.leftHand       // THREE.Group

// Right arm chain (mirror)
ref.rightShoulder, ref.rightUpperArm, ref.rightElbow,
ref.rightForearm,  ref.rightWrist,    ref.rightHand

// Finger arrays: each contains { knuckle, mid, tip, isThumb }
ref.leftFingers    // Array[5]
ref.rightFingers   // Array[5]

// Face
ref.leftEyebrow    // THREE.Mesh — rotation.z for raise/lower
ref.rightEyebrow   // THREE.Mesh
ref.mouth          // THREE.Mesh — rotation.x for open/close
```

---

## 4. HubAvatar — Animation State Machine

```
States: idle → blending → holding → returning → idle

idle:
  - applyIdleMotion() runs each frame
  - Watches glossQueue for next gesture

blending (250ms):
  - SLERP from fromPose → toPose
  - easeInOutCubic applied
  - On complete → holding

holding (600–1200ms):
  - Avatar frozen at gesture peak
  - Duration varies per gloss (random jitter ±300ms for natural feel)
  - On complete → returning

returning (250ms):
  - SLERP from current pose → idlePose
  - On complete → idle
  - Triggers next gloss from queue if any

NMM injection:
  - When sentenceType is set, inject into toPose before blending
  - 'yes_no_question' → eyebrows raised
  - 'negation' → head shake added
```

### Key Constants

```javascript
BLEND_DURATION   = 0.25   // seconds — transition speed
GLOSS_HOLD_MIN   = 0.6    // seconds — minimum hold time
GLOSS_HOLD_MAX   = 1.2    // seconds — maximum hold time
```

---

## 5. Gesture Pose Format

All poses stored in `src/lib/islAnimationMap.js`:

```javascript
// Quaternion format: [x, y, z, w]
// identity (no rotation) = [0, 0, 0, 1]

HELLO: {
  // Arm joints
  rightShoulder: { quaternion: [x, y, z, w], position: [x, y, z] },
  rightUpperArm: { quaternion: [...] },
  rightElbow:    { quaternion: [...] },
  rightForearm:  { quaternion: [...] },
  rightWrist:    { quaternion: [...] },
  rightHand:     { quaternion: [...] },

  // Fingers: array of 5, each with knuckle/mid/tip
  rightFingers: [
    { knuckle_quaternion: [...], mid_quaternion: [...], tip_quaternion: [...] },
    // × 5 fingers (thumb, index, middle, ring, pinky)
  ],

  // Non-manual markers
  face: {
    leftEyebrow:  { rotation: [x, y, z] },  // Euler rotation
    rightEyebrow: { rotation: [x, y, z] },
    mouth:        { rotation: [x, y, z] },
  }
}
```

### Available Gestures (22 total)

```
HELLO, THANK_YOU, PLEASE, YES, NO, HELP, WATER, FOOD,
HOME, SCHOOL, DOCTOR, GOOD, BAD, I, YOU, NOT, WHERE,
NOW, TOMORROW, YESTERDAY, EAT, GO
```

---

## 6. SLERP Quaternion Blending

```javascript
// In poseBlender.js — this is how animation works

// For each bone in the pose:
blendPose(rig, fromPose, toPose, t) {
  for (const key of BONE_KEYS) {
    const from = fromPose[key]
    const to   = toPose[key]
    if (!from || !to || !rig[key]) continue

    // SLERP quaternion
    const q = new THREE.Quaternion(...from.quaternion)
    q.slerp(new THREE.Quaternion(...to.quaternion), t)
    rig[key].quaternion.copy(q)

    // LERP position
    rig[key].position.lerpVectors(
      new THREE.Vector3(...from.position),
      new THREE.Vector3(...to.position),
      t
    )
  }

  // Blend fingers
  blendFingers(rig.leftFingers,  fromPose.leftFingers,  toPose.leftFingers,  t)
  blendFingers(rig.rightFingers, fromPose.rightFingers, toPose.rightFingers, t)
}

// Easing applied BEFORE passing t:
easeInOutCubic(t) {
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2
}
```

---

## 7. Skin & Outfit Color System

```javascript
// In HubAvatar.jsx — maps index → hex color
SKIN_COLORS = [
  '#F5D0A9',  // 0: Light
  '#E0B896',  // 1: Medium (default — matches reference)
  '#C69C7B',  // 2: Tan
  '#A67C5B',  // 3: Brown
  '#8B6340',  // 4: Deep
  '#5C3D2E',  // 5: Dark
]

BODY_COLORS = [
  '#3FD6C0',  // 0: Teal (default — matches reference)
  '#7C8CFF',  // 1: Blue
  '#F87171',  // 2: Red
  '#FBBF24',  // 3: Yellow
]

// appStore stores index (not hex)
// HubAvatar reads index → maps to hex → passes to RealisticAvatar
```

---

## 8. Lighting Setup

```javascript
// Current lighting in Hub.jsx (matches reference model lighting)
<ambientLight intensity={0.9} />
<hemisphereLight intensity={0.7} groundColor="#08090c" />
<directionalLight position={[4, 6, 4]} intensity={1.6} />          // Key light
<directionalLight position={[-3, 4, 2]} intensity={0.5} color="#89a9ff" /> // Fill light (blue tint)
```

The blue-tinted fill light creates the soft shadow on the left side of the face, matching the reference image.

---

## 9. What to Build Next (Phase 2 Tasks)

### Task 1: Improve Hand Geometry in RealisticAvatar.jsx
**Current problem:** Fingers are too simple — single cylinder per finger  
**Fix:** Add MCP + PIP + DIP as separate bone groups per finger (3 joints each, matching `hands.png`)

```javascript
// Replace current finger creation:
function createFinger(scene, options) {
  const group = new THREE.Group()

  const mcp = new THREE.Mesh(fingerGeo, mat) // knuckle
  const pip = new THREE.Mesh(fingerGeo, mat) // mid
  const dip = new THREE.Mesh(fingerGeo, mat) // tip

  mcp.add(pip)   // pip is child of mcp
  pip.add(dip)   // dip is child of pip
  group.add(mcp)

  return { group, knuckle: mcp, mid: pip, tip: dip }
}
```

### Task 2: Add Face Bones (Eyebrows + Mouth)
```javascript
// In RealisticAvatar.jsx face group
const leftEyebrow  = new THREE.Mesh(eyebrowGeo, hairMat)
const rightEyebrow = new THREE.Mesh(eyebrowGeo, hairMat)
const mouth        = new THREE.Mesh(mouthGeo, mouthMat)

// Expose via useImperativeHandle
handle.leftEyebrow  = leftEyebrow
handle.rightEyebrow = rightEyebrow
handle.mouth        = mouth
```

### Task 3: Add More Gestures to islAnimationMap.js
Priority additions (50 total target):
```
FAMILY, FRIEND, WORK, STUDY, SLEEP, WAKE, COME, GO_HOME,
MOTHER, FATHER, SISTER, BROTHER, LOVE, HAPPY, SAD, ANGRY,
WANT, NEED, HAVE, GIVE, TAKE, SEE, HEAR, SPEAK, UNDERSTAND,
NUMBER_1 through NUMBER_10, ALPHABET_A through ALPHABET_Z
```

### Task 4: Speed Control in Dev Panel
```javascript
// Add to appStore.js
playbackSpeed: 1.0,
setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

// Use in HubAvatar.jsx
bs.duration = BLEND_DURATION / playbackSpeed
bs.holdDuration = (GLOSS_HOLD_MIN + jitter) / playbackSpeed
```

---

## 10. Performance Budget

| Resource | Budget | Current | Status |
|----------|--------|---------|--------|
| Avatar geometry (MB) | < 5 MB | ~2 MB | ✅ OK |
| Gesture DB (KB) | < 500 KB | ~80 KB | ✅ OK |
| Total memory (MB) | < 80 MB | ~45 MB | ✅ OK |
| Frame time budget | 16ms (60fps) | ~12ms | ✅ OK |
| Finger bones per hand | 15 (5×3) | 5 (1 per finger) | 🔴 Needs fix |
| Gesture count | 100+ | 22 | 🔴 Needs expansion |

---

## 11. Known Issues & Fixes

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Fingers look blocky | Single cylinder per finger, no joints | Add MCP/PIP/DIP segments |
| No facial expressions yet | Eyebrow/mouth refs not in RealisticAvatar | Add face bones to rig |
| NMMs injected but not visible | Face refs return undefined | Fix after face bones added |
| Only 22 gestures | Limited pose data | Add 30+ more to islAnimationMap.js |
| No speed control in UI | Not wired to playbackSpeed | Add slider to Hub dev panel |

---

## 12. Testing Checklist

### Per Gesture (run for all 22)
- [ ] Gesture plays without console errors
- [ ] Hand shape is recognizable as the intended ISL sign
- [ ] Returns to idle without snapping
- [ ] FPS stays ≥ 55 during animation

### Per Feature
- [ ] Sentence queue signs multiple words in order
- [ ] Skin tone changes apply immediately
- [ ] Outfit color changes apply immediately
- [ ] Orbit controls work (drag = rotate, scroll = zoom)
- [ ] Status badge shows correct current gloss

### Performance
- [ ] Chrome DevTools: average frame time < 16ms
- [ ] Memory: heap snapshot < 80 MB
- [ ] No memory leaks after 10+ gesture plays
