# SignBridge — 3D Avatar PRD
**Last Updated:** July 1, 2026 | **Phase:** 1 — Foundation | **Status:** 🟡 In Progress

---

## Reference Model (Source of Truth)

The avatar is based on the reference images in `assets/reference/`:

| View | File | Key Observations |
|------|------|-----------------|
| Front | `front.png` | Rounded cartoon style, big head, compact torso, arms slightly out |
| Side | `side.png` | Slight belly curve, arms rest forward, no sharp edges |
| Top | `style.png` | Wide shoulder-to-head ratio, arms at ~30° from body |
| Hands | `hands.png` | Stylized hand, MCP/PIP/DIP joints clearly visible, 4 fingers + thumb |

### Visual Style: Stylized Cartoon 3D (Pixar-adjacent)
- **NOT** hyper-realistic — intentionally rounded, friendly, approachable
- **Head:** Oversized relative to body (~1:2.5 head-to-body ratio)
- **Body:** Compact, slightly chubby proportions, no sharp angles
- **Hands:** Slightly large relative to body for sign language clarity
- **Face:** Dot eyes, minimal nose, simple smile — expressive but simple
- **Clothing:** Blue long-sleeve top, dark navy shorts — clean and neutral
- **Skin:** Warm medium tone (#E0B896) as the default

---

## 1. Product Vision

### What We Are Building
A stylized 3D cartoon avatar (matching the reference model exactly) that performs Indian Sign Language (ISL) gestures in real-time — built in React Three Fiber using procedural geometry (no .glb file needed for MVP).

### Who It's For
| User | Goal |
|------|------|
| Deaf / Hard-of-Hearing | Understand sign language translations visually |
| ISL Learners | Study correct hand shapes and body posture |
| Developers | Test and expand the gesture database |

### Core Promise
> A friendly 3D avatar that signs ISL gestures smoothly, accurately, and accessibly — matching the reference model in proportions and style.

---

## 2. User Stories

### US1 — Gesture Playback
**As a** user, **I want** to click a word and **see** the avatar sign it  
**Acceptance:**
- Avatar moves from idle → gesture → idle smoothly
- Hand shapes match ISL standards
- Completes in 0.8–1.5 seconds per gesture
- No stuttering or jank (60 FPS desktop)

### US2 — Sentence Signing
**As a** user, **I want** to type a sentence and **see** the full sequence signed  
**Acceptance:**
- Signs chain naturally with 200–300ms transition between words
- Sentence-level NMMs applied (eyebrows for questions, head shake for negation)
- Can pause mid-sentence

### US3 — Avatar Customization
**As a** user, **I want** to change the avatar's skin tone and outfit  
**Acceptance:**
- 6 skin tones available (matching reference palette)
- 4 outfit colors
- Updates instantly, no reload
- Persists in session

### US4 — Developer Gesture Testing
**As a** developer, **I want** a test panel to trigger any gesture and inspect the result  
**Acceptance:**
- All 22+ gesture buttons visible
- Active gesture highlighted
- Sentence input field for multi-word testing
- Status badge shows current signing state

### US5 — Clarity for Low Vision
**As a** user with low vision, **I want** to slow down animations and zoom  
**Acceptance:**
- 0.5x speed option
- Orbit controls to zoom/rotate
- High contrast background toggle
- Captions beneath avatar showing current gloss

---

## 3. Feature Scope

### Phase 1 (NOW — Foundation) ✅ / 🔄
| Feature | Status | Notes |
|---------|--------|-------|
| Avatar renders in canvas | ✅ Done | HubAvatar + RealisticAvatar working |
| Idle breathing animation | ✅ Done | applyIdleMotion() in HubAvatar |
| 22 ISL gesture poses | ✅ Done | islAnimationMap.js |
| Gesture playback (single) | ✅ Done | SLERP blend via PoseBlender |
| Sentence queue system | ✅ Done | glossQueue in appStore |
| Dev test panel in /hub | ✅ Done | All 22 gestures, skin/outfit controls |
| Orbit camera controls | ✅ Done | OrbitControls from drei |
| Skin tone (6 options) | ✅ Done | appStore.skinTone |
| Outfit color (4 options) | ✅ Done | appStore.outfitColor |
| Homepage | ✅ Done | Landing.jsx |

### Phase 2 (NEXT — Hands & Face)
| Feature | Status | Priority |
|---------|--------|----------|
| Improved hand geometry | 🔴 Not started | CRITICAL |
| Individual finger bones (MCP/PIP/DIP per finger) | 🔴 Not started | CRITICAL |
| Non-manual markers (eyebrows, mouth) | 🔴 Not started | HIGH |
| Facial expression sync with gestures | 🔴 Not started | HIGH |
| Speed control slider in dev panel | 🔴 Not started | MEDIUM |
| Gesture duration metadata | 🔴 Not started | MEDIUM |

### Phase 3 — Expand & Polish
| Feature | Status | Priority |
|---------|--------|----------|
| 50+ more ISL gestures | 🔴 Not started | HIGH |
| Mobile performance (LOD) | 🔴 Not started | HIGH |
| Accessibility panel (captions, contrast) | 🔴 Not started | MEDIUM |
| Deployed live demo | 🔴 Not started | MEDIUM |

---

## 4. Avatar Geometry Specification

### Based on Reference Images (`assets/reference/`)

#### Head
- Large, round sphere — radius ~0.28 units
- Slight vertical squish (scaleY 0.95)
- Face features: dot eyes, small nose bump, curved mouth
- Brown hair cap on top (hemisphere)
- Ears: small sphere stubs on sides

#### Body/Torso
- Rounded cylinder, slightly tapered — wider at chest, narrower at waist
- Height ~0.55 units, radius ~0.18 at chest
- Slight belly protrusion (sphere merge or scale)
- Blue top color, dark navy bottom

#### Arms
- Upper arm: tapered cylinder, length ~0.28
- Forearm: tapered cylinder, length ~0.25
- Rest pose: arms slightly out from body (~20-25° shoulder abduction)
- Slight elbow bend in idle pose

#### Hands (Critical — based on `hands.png`)
- Stylized cartoon hand — NOT hyper-realistic
- Palm: rounded box/sphere merge
- 4 fingers + thumb, each with **3 joints**: MCP → PIP → DIP
- Joints labeled in reference: MCP (knuckle), PIP (mid), DIP (tip)
- Fingers slightly chunky/rounded — cylinder with sphere caps
- Thumb offset at ~45° from palm

#### Legs
- Short, compact — roughly same length as torso
- Slightly tapered at ankles
- Dark navy shorts/pants to mid-thigh

---

## 5. Animation Requirements

### Idle Pose
- Subtle breathing (hips bob ±0.005 units, 1.5Hz)
- Slight head sway (rotation.z ±0.02, 0.5Hz)
- Arms relaxed at sides (~20° shoulder abduction)
- Fingers slightly curled (not fully open, not fist)

### Gesture Playback
- **Blend in:** 250ms from idle → gesture pose (easeInOutCubic)
- **Hold:** 600–1200ms at peak pose
- **Blend out:** 250ms from gesture → idle
- **Total per gesture:** ~1100–1700ms
- **Between gestures in sentence:** 150ms crossfade (no full return to idle)

### Non-Manual Markers (NMMs)
- **Yes/No question:** Eyebrows raised
- **Wh- question:** Eyebrows lowered/furrowed
- **Negation:** Head shake (rotation.y oscillation)
- **Affirmation:** Slight nod (rotation.x dip)

---

## 6. Performance Requirements

| Target | Desktop | Mobile |
|--------|---------|--------|
| Frame rate | 60 FPS | 30 FPS |
| Memory | < 80 MB | < 60 MB |
| Load time | < 1.5s | < 3s |
| Gesture latency | < 50ms | < 100ms |

---

## 7. Out of Scope (MVP)

- Loading external .glb/.gltf models (all geometry is procedural)
- Lip sync
- Webcam pose detection
- Physics (hair/cloth)
- Real-time voice input
- Multi-avatar dialogue
- Backend/API for translations

---

## 8. Acceptance Criteria

The 3D avatar is ready when:

1. ☐ Visually matches reference model (`assets/reference/front.png`) within ~85% similarity
2. ☐ 22+ ISL gestures play correctly with smooth SLERP
3. ☐ Sentence queue signs multiple words without breaking
4. ☐ Hands show clear finger articulation (MCP/PIP/DIP visible)
5. ☐ NMMs (eyebrows) respond to sentence type
6. ☐ 60 FPS maintained during gesture playback
7. ☐ Skin tone and outfit update in real-time
8. ☐ Orbit controls let developer inspect from all angles
9. ☐ Dev test panel lets developer trigger any gesture
10. ☐ Works on Chrome, Firefox, Safari desktop
