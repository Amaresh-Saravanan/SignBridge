# ISL Armature Specification

## Summary

This document defines the complete bone hierarchy, naming conventions, rotation limits, and IK configurations for the SignBridge avatar body rig. It serves as the official reference for hand rigging (Task 06) and animation implementation (Task 07).

---

## Bone Naming Convention

All bone names follow the **Three.js `mixamorig`** nomenclature to ensure seamless integration with `SkinnedMesh` and `AnimationMixer`.

---

## Body Bone Hierarchy

### Spine Chain

| Bone Name | Parent | Head Position | Tail Position | Purpose |
|-----------|--------|---------------|---------------|---------|
| `mixamorigHips` | ROOT | (0, 0, 1.0) | (0, 0, 1.15) | Root bone, center of mass |
| `mixamorigSpine` | Hips | (0, 0, 1.15) | (0, 0, 1.35) | Lower spine |
| `mixamorigSpine1` | Spine | (0, 0, 1.35) | (0, 0, 1.50) | Mid spine |
| `mixamorigSpine2` | Spine1 | (0, 0, 1.50) | (0, 0, 1.60) | Upper spine / chest |

### Neck & Head

| Bone Name | Parent | Head Position | Tail Position | Purpose |
|-----------|--------|---------------|---------------|---------|
| `mixamorigNeck` | Spine2 | (0, 0, 1.60) | (0, 0, 1.72) | Neck joint |
| `mixamorigHead` | Neck | (0, 0, 1.72) | (0, 0, 1.90) | Head / skull |

### Left Arm Chain

| Bone Name | Parent | Head Position | Tail Position | Purpose |
|-----------|--------|---------------|---------------|---------|
| `mixamorigLeftShoulder` | Spine2 | (0.08, 0, 1.58) | (0.18, 0, 1.58) | Clavicle |
| `mixamorigLeftArm` | LeftShoulder | (0.18, 0, 1.58) | (0.40, 0, 1.58) | Upper arm |
| `mixamorigLeftForeArm` | LeftArm | (0.40, 0, 1.58) | (0.60, 0, 1.58) | Forearm |
| `mixamorigLeftHand` | LeftForeArm | (0.60, 0, 1.58) | (0.68, 0, 1.58) | Wrist |

### Right Arm Chain

| Bone Name | Parent | Head Position | Tail Position | Purpose |
|-----------|--------|---------------|---------------|---------|
| `mixamorigRightShoulder` | Spine2 | (-0.08, 0, 1.58) | (-0.18, 0, 1.58) | Clavicle |
| `mixamorigRightArm` | RightShoulder | (-0.18, 0, 1.58) | (-0.40, 0, 1.58) | Upper arm |
| `mixamorigRightForeArm` | RightArm | (-0.40, 0, 1.58) | (-0.60, 0, 1.58) | Forearm |
| `mixamorigRightHand` | RightForeArm | (-0.60, 0, 1.58) | (-0.68, 0, 1.58) | Wrist |

### Left Leg Chain

| Bone Name | Parent | Head Position | Tail Position | Purpose |
|-----------|--------|---------------|---------------|---------|
| `mixamorigLeftUpLeg` | Hips | (0.10, 0, 1.0) | (0.10, 0, 0.55) | Thigh |
| `mixamorigLeftLeg` | LeftUpLeg | (0.10, 0, 0.55) | (0.10, 0, 0.10) | Shin |
| `mixamorigLeftFoot` | LeftLeg | (0.10, 0, 0.10) | (0.10, -0.12, 0) | Ankle |
| `mixamorigLeftToeBase` | LeftFoot | (0.10, -0.12, 0) | (0.10, -0.20, 0) | Toes |

### Right Leg Chain

| Bone Name | Parent | Head Position | Tail Position | Purpose |
|-----------|--------|---------------|---------------|---------|
| `mixamorigRightUpLeg` | Hips | (-0.10, 0, 1.0) | (-0.10, 0, 0.55) | Thigh |
| `mixamorigRightLeg` | RightUpLeg | (-0.10, 0, 0.55) | (-0.10, 0, 0.10) | Shin |
| `mixamorigRightFoot` | RightLeg | (-0.10, 0, 0.10) | (-0.10, -0.12, 0) | Ankle |
| `mixamorigRightToeBase` | RightFoot | (-0.10, -0.12, 0) | (-0.10, -0.20, 0) | Toes |

---

## Rotation Limits

All rotation limits are in **degrees** and use **XYZ Euler** rotation mode.

### Spine Rotation Limits

| Bone | Min (X, Y, Z) | Max (X, Y, Z) | Notes |
|------|---------------|---------------|-------|
| `mixamorigSpine` | (-10, 0, -5) | (30, 0, 5) | Forward/backward lean |
| `mixamorigSpine1` | (-10, 0, -5) | (25, 0, 5) | Mid-back flexibility |
| `mixamorigSpine2` | (-10, 0, -5) | (20, 0, 5) | Upper back flexibility |

### Neck & Head Rotation Limits

| Bone | Min (X, Y, Z) | Max (X, Y, Z) | Notes |
|------|---------------|---------------|-------|
| `mixamorigNeck` | (-30, -40, -10) | (30, 40, 10) | Full head turn range |
| `mixamorigHead` | (-30, -40, -15) | (30, 40, 15) | Nod and shake |

### Left Arm Rotation Limits

| Bone | Min (X, Y, Z) | Max (X, Y, Z) | Notes |
|------|---------------|---------------|-------|
| `mixamorigLeftShoulder` | (-90, -40, -90) | (90, 40, 90) | Shoulder raise/lower |
| `mixamorigLeftArm` | (-180, 0, -90) | (180, 0, 90) | Full arm rotation |
| `mixamorigLeftForeArm` | (-150, 0, 0) | (0, 0, 0) | Elbow bend only |
| `mixamorigLeftHand` | (-80, -20, -30) | (80, 20, 30) | Wrist flex/extend |

### Right Arm Rotation Limits

| Bone | Min (X, Y, Z) | Max (X, Y, Z) | Notes |
|------|---------------|---------------|-------|
| `mixamorigRightShoulder` | (-90, -40, -90) | (90, 40, 90) | Shoulder raise/lower |
| `mixamorigRightArm` | (-180, 0, -90) | (180, 0, 90) | Full arm rotation |
| `mixamorigRightForeArm` | (-150, 0, 0) | (0, 0, 0) | Elbow bend only |
| `mixamorigRightHand` | (-80, -20, -30) | (80, 20, 30) | Wrist flex/extend |

### Leg Rotation Limits

| Bone | Min (X, Y, Z) | Max (X, Y, Z) | Notes |
|------|---------------|---------------|-------|
| `mixamorigLeftUpLeg` | (-120, 0, -30) | (40, 0, 30) | Hip flex/extend |
| `mixamorigLeftLeg` | (-150, 0, 0) | (0, 0, 0) | Knee bend only |
| `mixamorigLeftFoot` | (-50, -20, -10) | (80, 20, 10) | Ankle flex |
| `mixamorigRightUpLeg` | (-120, 0, -30) | (40, 0, 30) | Hip flex/extend |
| `mixamorigRightLeg` | (-150, 0, 0) | (0, 0, 0) | Knee bend only |
| `mixamorigRightFoot` | (-50, -20, -10) | (80, 20, 10) | Ankle flex |

---

## IK Constraints

### Left Arm IK

| Property | Value |
|----------|-------|
| Target Bone | `mixamorigLeftForeArm` |
| IK Target | `mixamorigLeftHand` |
| Chain Count | 2 (ForeArm + Arm) |
| Purpose | Elbow positioning for signing |

### Right Arm IK

| Property | Value |
|----------|-------|
| Target Bone | `mixamorigRightForeArm` |
| IK Target | `mixamorigRightHand` |
| Chain Count | 2 (ForeArm + Arm) |
| Purpose | Elbow positioning for signing |

---

## Bone Count Summary

| Category | Count |
|----------|-------|
| Spine Chain | 4 |
| Neck & Head | 2 |
| Left Arm | 4 |
| Right Arm | 4 |
| Left Leg | 4 |
| Right Leg | 4 |
| Left Hand (fingers) | 15 |
| Right Hand (fingers) | 15 |
| **Total Body** | **22** |
| **Total Hand** | **30** |
| **Grand Total** | **52** |

---

## Hand Bone Hierarchy

### Finger Naming Convention

Format: `mixamorig{Side}Hand{Finger}{Joint}`

- **Side**: `Left` or `Right`
- **Finger**: `Thumb`, `Index`, `Middle`, `Ring`, `Little`
- **Joint**: `1` (Proximal), `2` (Middle), `3` (Distal)

### Left Hand Bones

| Bone Name | Parent | Joint Type | Length |
|-----------|--------|------------|--------|
| `mixamorigLeftHandThumb1` | LeftHand | Proximal | 0.035m |
| `mixamorigLeftHandThumb2` | Thumb1 | Middle | 0.025m |
| `mixamorigLeftHandThumb3` | Thumb2 | Distal | 0.020m |
| `mixamorigLeftHandIndex1` | LeftHand | Proximal | 0.035m |
| `mixamorigLeftHandIndex2` | Index1 | Middle | 0.025m |
| `mixamorigLeftHandIndex3` | Index2 | Distal | 0.020m |
| `mixamorigLeftHandMiddle1` | LeftHand | Proximal | 0.035m |
| `mixamorigLeftHandMiddle2` | Middle1 | Middle | 0.025m |
| `mixamorigLeftHandMiddle3` | Middle2 | Distal | 0.020m |
| `mixamorigLeftHandRing1` | LeftHand | Proximal | 0.035m |
| `mixamorigLeftHandRing2` | Ring1 | Middle | 0.025m |
| `mixamorigLeftHandRing3` | Ring2 | Distal | 0.020m |
| `mixamorigLeftHandLittle1` | LeftHand | Proximal | 0.035m |
| `mixamorigLeftHandLittle2` | Little1 | Middle | 0.025m |
| `mixamorigLeftHandLittle3` | Little2 | Distal | 0.020m |

### Right Hand Bones

| Bone Name | Parent | Joint Type | Length |
|-----------|--------|------------|--------|
| `mixamorigRightHandThumb1` | RightHand | Proximal | 0.035m |
| `mixamorigRightHandThumb2` | Thumb1 | Middle | 0.025m |
| `mixamorigRightHandThumb3` | Thumb2 | Distal | 0.020m |
| `mixamorigRightHandIndex1` | RightHand | Proximal | 0.035m |
| `mixamorigRightHandIndex2` | Index1 | Middle | 0.025m |
| `mixamorigRightHandIndex3` | Index2 | Distal | 0.020m |
| `mixamorigRightHandMiddle1` | RightHand | Proximal | 0.035m |
| `mixamorigRightHandMiddle2` | Middle1 | Middle | 0.025m |
| `mixamorigRightHandMiddle3` | Middle2 | Distal | 0.020m |
| `mixamorigRightHandRing1` | RightHand | Proximal | 0.035m |
| `mixamorigRightHandRing2` | Ring1 | Middle | 0.025m |
| `mixamorigRightHandRing3` | Ring2 | Distal | 0.020m |
| `mixamorigRightHandLittle1` | RightHand | Proximal | 0.035m |
| `mixamorigRightHandLittle2` | Little1 | Middle | 0.025m |
| `mixamorigRightHandLittle3` | Little2 | Distal | 0.020m |

### Finger Rotation Limits (Degrees)

#### Standard Fingers (Index, Middle, Ring, Little)

| Joint | Min (X, Y, Z) | Max (X, Y, Z) |
|-------|---------------|---------------|
| Proximal (1) | (-20, 0, -15) | (90, 0, 15) |
| Middle (2) | (-10, 0, -10) | (110, 0, 10) |
| Distal (3) | (-10, 0, -10) | (120, 0, 10) |

#### Thumb

| Joint | Min (X, Y, Z) | Max (X, Y, Z) |
|-------|---------------|---------------|
| Proximal (1) | (-30, -20, -40) | (60, 20, 40) |
| Middle (2) | (-20, 0, -10) | (90, 0, 10) |
| Distal (3) | (-10, 0, -10) | (100, 0, 10) |

---

## ISL Gesture Requirements

### Key Arm Positions

| Gesture | Left Arm | Right Arm | Head |
|---------|----------|-----------|------|
| HELLO | Raised, wave motion | At side | Forward |
| THANK-YOU | Hand from chin forward | At side | Slight nod |
| PLEASE | Palm on chest, circular | At side | Neutral |
| HELP | Fist on palm, lift | Support | Neutral |
| WHERE | Open palms, shrug | Open palms, shrug | Tilt |

### Arm Reach Requirements

| Target | Arm Position | Max Reach |
|--------|-------------|-----------|
| Mouth | Forearm to face | 0.60m from shoulder |
| Forehead | Upper arm raised | 0.55m from shoulder |
| Chest | Forearm to chest | 0.40m from shoulder |
| Opposite shoulder | Cross-body reach | 0.80m from origin |

---

## Three.js Integration

### SkinnedMesh Setup

```javascript
// Load GLB and access skinned mesh
const { scene } = await useGLTF('/models/avatar.glb')
const mesh = scene.getObjectByName('SK_Body')

// Access skeleton
const skeleton = mesh.skeleton
const bones = skeleton.bones

// Find specific bone
const headBone = bones.find(b => b.name === 'mixamorigHead')
```

### AnimationMixer Setup

```javascript
import { AnimationMixer } from 'three'

const mixer = new AnimationMixer(gltf.scene)
const clip = THREE.AnimationClip.findByName(gltf.animations, 'ISL_HELLO')
const action = mixer.clipAction(clip)
action.play()
```

---

## Validation Checklist

- [x] All 22 body bones created with correct hierarchy
- [x] All 30 hand bones created (15 per hand)
- [x] Bone names match Three.js `mixamorig` convention
- [x] Rotation limits set for all movable bones
- [x] IK constraints configured for both forearms
- [x] Mesh parented to armature with automatic weights
- [x] Weight painting smoothed for clean deformation
- [x] Arms can reach mouth, forehead, and chest
- [x] GLB export script included
- [x] Spec document saved as `docs/isl_armature_spec.md`
