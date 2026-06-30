# SignBridge — Avatar Build Tracker
**Started:** July 1, 2026 | **Target:** Photorealistic ISL signing avatar matching `assets/reference/`

---

## Reference Model Summary

| Image | What It Shows |
|-------|--------------|
| `front.png` | Cartoon 3D avatar — rounded head, blue top, navy shorts, arms slightly out |
| `side.png` | Side depth — body is compact/chubby, arm rests slightly forward |
| `style.png` | Top view — wide head, arms at ~30° from sides |
| `hands.png` | Hand topology — MCP/PIP/DIP joints, stylized 4 fingers + thumb |

**Target aesthetic:** Pixar-style cartoon 3D. Friendly, round, not hyper-realistic.

---

## Overall Progress

```
Phase 1 — Foundation       ████████████████████ 85%  ✅ Nearly Done
Phase 2 — Hands & Face     ░░░░░░░░░░░░░░░░░░░░  0%  🔴 Not Started
Phase 3 — Expand Gestures  ░░░░░░░░░░░░░░░░░░░░  0%  🔴 Not Started
Phase 4 — Polish & Deploy  ░░░░░░░░░░░░░░░░░░░░  0%  🔴 Not Started
```

---

## Phase 1 — Foundation ✅ 85% Complete

### ✅ Completed Tasks

| Task | File | Date | Notes |
|------|------|------|-------|
| Project cleanup (removed 73 legacy files) | Various | Jun 30 | agents/, orchestrator/, workflows/ etc removed |
| Simplified routing (/ + /hub only) | App.jsx | Jun 30 | Auth removed |
| Avatar renders in Canvas | HubAvatar.jsx | Before Jun 30 | Working |
| Idle animation (breathing, head sway) | HubAvatar.jsx | Before Jun 30 | applyIdleMotion() |
| 22 ISL gesture poses | islAnimationMap.js | Before Jun 30 | SLERP quaternions |
| SLERP pose blending | poseBlender.js | Before Jun 30 | easeInOutCubic |
| Gesture queue (multi-word sentences) | appStore.js | Before Jun 30 | enqueueGlosses() |
| Skin tone (6 options) | appStore.js | Jun 30 | Index-based |
| Outfit color (4 options) | appStore.js | Jun 30 | Index-based |
| Dev test panel (/hub) | Hub.jsx | Jul 1 | All 22 gestures, sentence input, orbit |
| Orbit camera controls | Hub.jsx | Jul 1 | OrbitControls from drei |
| Professional homepage | Landing.jsx | Jul 1 | Features, stats, CTAs |
| README updated | README.md | Jun 30 | Comprehensive docs |
| PRD updated (reference-aware) | 3D_AVATAR_PRD.md | Jul 1 | ✅ This session |
| TDP updated (reference-aware) | 3D_AVATAR_TDP.md | Jul 1 | ✅ This session |
| Build tracker created | AVATAR_BUILD_TRACKER.md | Jul 1 | ✅ This session |

### 🔄 Remaining Phase 1 Tasks

| Task | File | Effort | Notes |
|------|------|--------|-------|
| Fix homepage alignment/CSS issue | Landing.jsx | 1hr | Inline styles bypass Tailwind conflicts |
| Commit & push all pending docs | git | 15min | PRD, TDP, tracker |

---

## Phase 2 — Hands & Face 🔴 Not Started

**Goal:** Match the hand model in `assets/reference/hands.png` exactly. Add facial expressions.

### 2A — Hand Geometry Improvement

**Problem:** Current fingers = single cylinder per finger. Reference shows 3 joints per finger (MCP, PIP, DIP).

**Tasks:**

| # | Task | File | Effort | Status |
|---|------|------|--------|--------|
| 2A-1 | Replace single-cylinder fingers with 3-segment (MCP+PIP+DIP) per finger | RealisticAvatar.jsx | 3hr | 🔴 TODO |
| 2A-2 | Add sphere caps at each joint for rounded cartoon look | RealisticAvatar.jsx | 1hr | 🔴 TODO |
| 2A-3 | Adjust finger proportions to match `hands.png` reference | RealisticAvatar.jsx | 1hr | 🔴 TODO |
| 2A-4 | Fix thumb angle (45° palmar abduction from palm) | RealisticAvatar.jsx | 1hr | 🔴 TODO |
| 2A-5 | Verify all 5 fingers expose knuckle/mid/tip refs in useImperativeHandle | RealisticAvatar.jsx | 30min | 🔴 TODO |
| 2A-6 | Test all 22 gestures with new finger rig — check hand shapes | Hub.jsx dev panel | 2hr | 🔴 TODO |

### 2B — Facial Expression System

**Problem:** NMMs (eyebrow movement, head tilt) are computed but face refs don't exist yet.

| # | Task | File | Effort | Status |
|---|------|------|--------|--------|
| 2B-1 | Add eyebrow meshes to head group in RealisticAvatar | RealisticAvatar.jsx | 1hr | 🔴 TODO |
| 2B-2 | Add mouth mesh to head group | RealisticAvatar.jsx | 45min | 🔴 TODO |
| 2B-3 | Expose leftEyebrow, rightEyebrow, mouth via useImperativeHandle | RealisticAvatar.jsx | 30min | 🔴 TODO |
| 2B-4 | Test NMM injection in HubAvatar (sentenceType → eyebrow raise) | HubAvatar.jsx | 1hr | 🔴 TODO |
| 2B-5 | Add face NMM data to existing 22 gesture poses | islAnimationMap.js | 2hr | 🔴 TODO |

### 2C — Dev Panel Improvements

| # | Task | File | Effort | Status |
|---|------|------|--------|--------|
| 2C-1 | Add speed control slider (0.5x / 1x / 1.5x / 2x) | Hub.jsx | 45min | 🔴 TODO |
| 2C-2 | Wire speed to playbackSpeed in appStore | appStore.js | 30min | 🔴 TODO |
| 2C-3 | Add "NMM Test" section (trigger question/negation NMMs) | Hub.jsx | 1hr | 🔴 TODO |
| 2C-4 | Show gesture hold duration info | Hub.jsx | 30min | 🔴 TODO |

---

## Phase 3 — Expand Gestures 🔴 Not Started

**Goal:** 22 gestures → 100+ gestures for real-world ISL coverage.

### Priority Gesture Groups

| Group | Gestures | Count | Status |
|-------|---------|-------|--------|
| ✅ Core (current) | HELLO, THANK_YOU, PLEASE, YES, NO, HELP, WATER, FOOD, HOME, SCHOOL, DOCTOR, GOOD, BAD, I, YOU, NOT, WHERE, NOW, TOMORROW, YESTERDAY, EAT, GO | 22 | ✅ Done |
| Family | MOTHER, FATHER, SISTER, BROTHER, FAMILY, FRIEND, BABY | 7 | 🔴 TODO |
| Emotions | HAPPY, SAD, ANGRY, SCARED, LOVE, HATE, SURPRISED | 7 | 🔴 TODO |
| Actions | COME, SLEEP, WAKE, STUDY, WORK, PLAY, RUN, WALK, SIT, STAND | 10 | 🔴 TODO |
| Questions | WHO, WHAT, WHEN, HOW, WHY, HOW_MANY | 6 | 🔴 TODO |
| Numbers | ONE through TEN | 10 | 🔴 TODO |
| Alphabet | A through Z | 26 | 🔴 TODO |
| Objects | PHONE, BOOK, CHAIR, TABLE, CAR, MONEY | 6 | 🔴 TODO |
| Time | MORNING, AFTERNOON, NIGHT, WEEK, MONTH, YEAR | 6 | 🔴 TODO |

**Total target: 100 gestures**

### Adding a Gesture — Template

```javascript
// In src/lib/islAnimationMap.js

NEW_GESTURE: {
  // Right arm (most ISL gestures are right-dominant)
  rightShoulder: { quaternion: [0, 0, 0, 1], position: [0.2, 0.8, 0] },
  rightUpperArm: { quaternion: [0, 0, 0, 1], position: [0, 0, 0] },
  rightElbow:    { quaternion: [0, 0, 0, 1], position: [0, -0.28, 0] },
  rightForearm:  { quaternion: [0, 0, 0, 1], position: [0, 0, 0] },
  rightWrist:    { quaternion: [0, 0, 0, 1], position: [0, -0.25, 0] },
  rightHand:     { quaternion: [0, 0, 0, 1], position: [0, 0, 0] },

  // Left arm (if two-handed sign)
  leftShoulder: { quaternion: [0, 0, 0, 1], position: [-0.2, 0.8, 0] },
  // ... etc

  // Right fingers (array of 5)
  rightFingers: [
    // thumb
    { knuckle_quaternion: [0, 0, 0, 1], mid_quaternion: [0, 0, 0, 1], tip_quaternion: [0, 0, 0, 1] },
    // index
    { knuckle_quaternion: [0, 0, 0, 1], mid_quaternion: [0, 0, 0, 1], tip_quaternion: [0, 0, 0, 1] },
    // middle
    { knuckle_quaternion: [0, 0, 0, 1], mid_quaternion: [0, 0, 0, 1], tip_quaternion: [0, 0, 0, 1] },
    // ring
    { knuckle_quaternion: [0, 0, 0, 1], mid_quaternion: [0, 0, 0, 1], tip_quaternion: [0, 0, 0, 1] },
    // pinky
    { knuckle_quaternion: [0, 0, 0, 1], mid_quaternion: [0, 0, 0, 1], tip_quaternion: [0, 0, 0, 1] },
  ],

  // Face / NMMs
  face: {
    leftEyebrow:  { rotation: [0, 0, 0] },
    rightEyebrow: { rotation: [0, 0, 0] },
    mouth:        { rotation: [0, 0, 0] },
  },
},
```

---

## Phase 4 — Polish & Deploy 🔴 Not Started

| # | Task | Effort | Status |
|---|------|--------|--------|
| 4-1 | Mobile performance testing (LOD for low-end devices) | 3hr | 🔴 TODO |
| 4-2 | Accessibility panel (captions, high contrast toggle) | 2hr | 🔴 TODO |
| 4-3 | Vercel deployment | 1hr | 🔴 TODO |
| 4-4 | Cross-browser testing (Chrome, Firefox, Safari) | 2hr | 🔴 TODO |
| 4-5 | Performance audit (Lighthouse, DevTools) | 1hr | 🔴 TODO |
| 4-6 | User testing with ISL community feedback | Ongoing | 🔴 TODO |

---

## Decisions Log

| Date | Decision | Why |
|------|----------|-----|
| Jun 30 | Use procedural geometry (no .glb file) for MVP | No Blender dependency, easier to iterate |
| Jun 30 | Quaternion SLERP for animation | Avoids gimbal lock, smooth interpolation |
| Jun 30 | Remove auth entirely | Focus on avatar, not user management |
| Jun 30 | Zustand for state | Simple, minimal boilerplate |
| Jul 1 | Inline styles for Landing.jsx | Global Tailwind/CSS causing layout conflicts |
| Jul 1 | Style = Pixar-adjacent cartoon (confirmed by reference images) | Reference shows rounded, friendly, NOT hyper-realistic |
| Jul 1 | Hand joints = MCP/PIP/DIP per finger | Confirmed by `hands.png` topology diagram |

---

## Known Issues

| Issue | Severity | Phase | Notes |
|-------|----------|-------|-------|
| Fingers lack MCP/PIP/DIP joints | HIGH | Phase 2A | Single cylinder per finger is too simple |
| No facial expressions visible | HIGH | Phase 2B | Face refs not exposed in rig yet |
| Homepage text alignment broken | MEDIUM | Phase 1 | Tailwind CSS conflict — using inline styles as fix |
| Only 22 gestures | MEDIUM | Phase 3 | Need 100+ for real coverage |
| No speed control in dev panel | LOW | Phase 2C | playbackSpeed store exists, not wired to UI yet |

---

## Next Immediate Action

**TODAY:** Start Phase 2A — Improve hand geometry in `RealisticAvatar.jsx`

1. Open: `src/components/three/RealisticAvatar.jsx`
2. Find: the `createFinger()` function (or equivalent finger creation code)
3. Replace: single-cylinder fingers → 3-segment (MCP + PIP + DIP) per finger
4. Reference: `assets/reference/hands.png` — match the joint proportions
5. Test: open `/hub`, trigger HELLO gesture, orbit camera to inspect hand detail
