# 3D Avatar Material Guidelines

This document outlines the material specifications, shaders, texture resolutions, and naming conventions for the SignBridge 3D avatar to ensure optimized rendering and visual quality.

## Shader & Visual Parameters
To maintain a high-quality stylized aesthetic, use a **Physically Based Rendering (PBR)** workflow. Adjust roughness and metalness values to avoid highly reflective surfaces that distract from signing gestures.

---

## Component Specifications

### 1. Skin (`M_Skin`)
- **Base Color**: Soft peach/neutral tone matching the reference concept.
- **Roughness**: `0.7` to `0.8` (completely matte to avoid glossy highlights on nose, cheeks, or forehead).
- **Subsurface Scattering (SSS)**: Keep SSS values minimal to prevent rendering overhead in Three.js, but configure a warm color tint (e.g. pale pink) on thin parts like fingers and ear lobes.

### 2. Hair (`M_Hair`)
- **Base Color**: Dark brown solid shade.
- **Roughness**: `0.9` (fully dry/matte visual properties).
- **Metalness**: `0.0`
- **Anisotropy**: Disabled (unnecessary for low-poly cartoon hairstyles).

### 3. Clothes
- **Shirt (`M_Shirt`)**:
  - **Base Color**: Light blue (`#64B5F6` matching reference).
  - **Roughness**: `0.85` (simulates cloth fabric).
- **Pants (`M_Pants`)**:
  - **Base Color**: Navy blue (`#1A237E`).
  - **Roughness**: `0.9` (dense fabric style).

### 4. Shoes (`M_Shoes`)
- Note: The base reference character is barefoot. If shoes or sandals are added:
  - **Base Color**: Solid dark/rubber grey.
  - **Roughness**: `0.6` (slightly denser plastic/rubber look).

---

## Texture Resolution Budget
- **Principal Body Diffuse**: `2048x2048` (2K) maximum during modeling/baking.
- **WebGL Delivery Resolution**: Optimized down to `1024x1024` (1K) diffuse maps for desktop and `512x512` for mobile rendering limits to ensure quick network loading.
- **Maps Used**: Keep to a single BaseColor (Diffuse) map and a Normal map. Avoid AO, Metallic, or Roughness maps; define these values globally inside the shader variables to save bandwidth.

---

## Material Naming Conventions
Always prefix materials to align with the WebGL loader naming structures:
- `M_Skin`
- `M_Hair`
- `M_Shirt`
- `M_Pants`
- `M_Shoes`
- `M_Eyes` (if separate refractive mesh is used)
