# Avatar Design Specifications

## Summary

This document defines the complete character specifications for the SignBridge 3D avatar. It covers visual design, body proportions, topology requirements, material assignments, and modeling guidelines optimized for ISL gesture animation and real-time WebGL rendering.

---

## Character Design Overview

### Visual Style
- **Aesthetic**: Professional cartoon-style with friendly, approachable appearance
- **Target**: Stylized humanoid with clear, simplified features for maximum legibility
- **Reference**: Similar to Pixar/Disney character proportions but optimized for sign language clarity

### Demographic
- **Age Range**: Young adult (25-35 years)
- **Gender**: Neutral/Androgynous (accessible to all users)
- **Skin Tone**: Medium warm tone (#E0B896) — configurable via settings
- **Hair**: Short, dark brown, professional style
- **Expression**: Neutral default with clear facial topology for expressions

---

## Body Proportions

### Height & Scale
- **Total Height**: 1.75 meters (Blender metric units)
- **Scale Factor**: 1.0 (no scaling needed for Three.js import)
- **Pose**: Static T-pose with arms at 90° from body

### Proportion Guide (Head Units)
| Body Part | Measurement | Notes |
|-----------|-------------|-------|
| Total Height | 7.5 heads | Standard cartoon proportion |
| Head | 1 head unit | Base measurement |
| Torso | 3 heads | Shoulder to hip |
| Arms | 3.5 heads | Shoulder to fingertips |
| Legs | 3.5 heads | Hip to feet |

### Signing Ergonomics
- **Arm Length**: Extended to reach mouth, forehead, and chest without mesh clipping
- **Shoulder Width**: 1.5 head units — allows natural signing range
- **Hand Size**: Slightly exaggerated (1.2x realistic) for gesture visibility
- **Finger Length**: Extended for clear finger-spelling readability

---

## Topology Specifications

### Polygon Budget (50,000 vertices max)

| Component | Vertex Count | Priority |
|-----------|-------------|----------|
| Head/Face | 8,000 | High — viseme morphing |
| Hands (both) | 12,000 | High — finger articulation |
| Torso | 10,000 | Medium — breathing movement |
| Arms (both) | 8,000 | High — signing gestures |
| Legs (both) | 8,000 | Low — minimal movement |
| Clothing/Accessories | 4,000 | Low — static elements |
| **Total** | **50,000** | — |

### Edge Loop Requirements

#### Face Topology
- **Eye Loops**: Circular loops around each eye (8-10 loops minimum)
- **Mouth Loops**: Concentric loops around lips for viseme morphing (6-8 loops)
- **Nose Bridge**: Connects eye and mouth loops naturally
- **Cheek Flow**: Diagonal loops from nose to ear for smile/frown deformation

#### Hand Topology
- **Knuckle Loops**: Double/triple loops at each finger joint
- **Palm Flow**: Radial loops from wrist to finger bases
- **Thumb Base**: Extra geometry for opposable thumb movement
- **Fingertip**: Simplified geometry (flat end for finger-spelling)

#### Joint Topology
- **Shoulders**: Extra loops for 90°+ arm raise
- **Elbows**: Double loops for 135° bend
- **Wrists**: Triple loops for hand rotation
- **Hips**: Reinforced for walking animation

---

## Material Specifications

### Material Slots

| Slot | Material Name | Base Color | Roughness | Metalness |
|------|--------------|------------|-----------|-----------|
| 0 | M_Skin | #E0B896 | 0.75 | 0.0 |
| 1 | M_Hair | #3E2723 | 0.9 | 0.0 |
| 2 | M_Shirt | #64B5F6 | 0.85 | 0.0 |
| 3 | M_Pants | #1A237E | 0.9 | 0.0 |
| 4 | M_Eyes | #FFFFFF | 0.3 | 0.1 |
| 5 | M_EyeIris | #4E342E | 0.4 | 0.0 |

### Texture Requirements
- **Diffuse Map**: 1024x1024 (1K) for WebGL delivery
- **Normal Map**: 1024x1024 for surface detail
- **UV Layout**: Non-overlapping islands, packed efficiently
- **Color Space**: sRGB for diffuse, Linear for normal

---

## Facial Features

### Eyes
- **Shape**: Large, rounded rectangles (cartoon style)
- **Size**: 15% of head width each
- **Spacing**: One eye-width apart
- **Eyebrows**: Separate mesh for NMM animation (raised/furrowed)

### Nose
- **Shape**: Simple, rounded triangle
- **Size**: Proportionate to face
- **Topology**: Clean loops for potential sneeze animation

### Mouth
- **Shape**: Neutral expression, slightly upturned corners
- **Size**: 40% of face width
- **Topology**: Concentric loops for viseme morphing
- **Visemes Required**: A, E, I, O, U, L, TH, F, M

### Ears
- **Shape**: Simplified cartoon ears
- **Size**: Proportionate, slightly smaller than realistic
- **Position**: Aligned with eye and nose level

---

## Clothing Design

### Shirt
- **Style**: Simple crew-neck t-shirt
- **Color**: Light blue (#64B5F6)
- **Fit**: Loose enough for arm movement, tight enough for clear silhouette
- **Topology**: Follows torso shape with slight draping at shoulders

### Pants
- **Style**: Straight-leg trousers
- **Color**: Navy blue (#1A237E)
- **Fit**: Standard fit, not too loose
- **Topology**: Follows leg shape with minimal draping

### Shoes
- **Note**: Character is barefoot for default design
- **Alternative**: Simple slip-on shoes if needed

---

## Modeling Guidelines

### Blender Setup
1. **Units**: Metric (meters)
2. **Scale**: 1.0 (no additional scaling)
3. **Origin**: Center of feet, ground plane at Z=0
4. **Pose**: T-pose (arms at 90°, palms facing down)

### Mesh Organization
1. **Separate Parts**: Head, Torso, Left Arm, Right Arm, Left Leg, Right Leg, Hands
2. **Naming Convention**: `SK_Body`, `SK_Head`, `SK_Arm_L`, `SK_Arm_R`, etc.
3. **Material Slots**: Assigned per component as listed above

### Quality Checks
1. **No Non-Manifold Geometry**: All edges connected properly
2. **No Overlapping Vertices**: Merge by distance (0.001m)
3. **Consistent Normals**: All faces pointing outward
4. **Clean UV Map**: No overlaps, minimal stretching
5. **Applied Transforms**: Location (0,0,0), Rotation (0,0,0), Scale (1,1,1)

---

## Export Specifications

### File Format
- **Primary**: Blender file (`blender/avatar.blend`)
- **Secondary**: GLTF/GLB for web delivery (Task 04)

### Export Settings
- **Apply Modifiers**: Yes (Mirror, Subdivision)
- **Include**: Selected Objects only
- **Path Mode**: Copy with textures embedded
- **Format**: GLB (binary GLTF)

---

## Validation Checklist

- [ ] Character mesh loads in Blender without errors
- [ ] Total vertex count under 50,000
- [ ] Sub-component allocation matches budget
- [ ] Model is in static T-pose
- [ ] No bone structure present (unrigged)
- [ ] Material slots correctly named and assigned
- [ ] UV map has no overlapping islands
- [ ] Body proportions support signing ergonomics
- [ ] Facial topology supports viseme morphing
- [ ] Hand topology supports finger articulation
