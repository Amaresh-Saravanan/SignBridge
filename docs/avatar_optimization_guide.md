# Avatar Optimization Guide

## Summary

This document provides step-by-step instructions for optimizing the SignBridge avatar mesh in Blender. It includes an automation script and manual verification steps to ensure the mesh is ready for rigging (Task 05).

---

## Prerequisites

- Blender 3.6+ installed
- `blender/avatar.blend` from Task 03
- Script: `blender/optimize_avatar.py`

---

## Automated Optimization

### Step 1: Run the Optimization Script

1. Open `blender/avatar.blend` in Blender
2. Switch to **Scripting** workspace
3. Click **Open** and navigate to `blender/optimize_avatar.py`
4. Click **Run Script** (or press Alt+P)
5. Check the console output for verification messages

The script performs 8 operations:
1. Apply all modifiers (except Subdivision Surface)
2. Clean non-manifold geometry
3. Merge duplicate vertices (0.001m threshold)
4. Fix normals (consistent outward-facing)
5. Check UV overlaps
6. Create/update PBR materials
7. Freeze all transforms
8. Report vertex counts

### Step 2: Save Optimized File

1. Go to **File > Save As**
2. Navigate to `blender/` directory
3. Save as `avatar_optimized.blend`

---

## Manual Verification

### UV Overlap Check

1. Switch to **UV Editing** workspace
2. Select each mesh object
3. In UV Editor, go to **Select > All**
4. Go to **Select > Select Overlap**
5. If any UVs are selected, they overlap — fix manually

### Material Verification

1. Open **Properties > Material** tab
2. Verify each required material slot exists:
   - Slot 0: `M_Skin` (roughness 0.75)
   - Slot 1: `M_Hair` (roughness 0.9)
   - Slot 2: `M_Shirt` (roughness 0.85)
   - Slot 3: `M_Pants` (roughness 0.9)
   - Slot 4: `M_Eyes` (roughness 0.3)
   - Slot 5: `M_EyeIris` (roughness 0.4)
3. If the avatar includes footwear, verify optional `M_Shoes` (roughness 0.6)

### Vertex Count Check

1. Select each mesh object
2. Open **Properties > Object Data** tab
3. Verify vertex counts within budget:

| Component | Max Vertices |
|-----------|-------------|
| Head/Face | 8,000 |
| Hands (both) | 12,000 |
| Torso | 10,000 |
| Arms (both) | 8,000 |
| Legs (both) | 8,000 |
| Clothing | 4,000 |
| **Total** | **50,000** |

### Transform Verification

1. Select each mesh object
2. Open **Properties > Object Transform**
3. Verify:
   - Location: (0, 0, 0)
   - Rotation: (0, 0, 0)
   - Scale: (1, 1, 1)

---

## Texture Baking (Optional)

If texture baking is required:

1. Ensure UV map is clean (no overlaps)
2. Switch to **Render Properties > Bake**
3. Set Bake Type to **Diffuse**
4. Check **Clear Image** before baking
5. Click **Bake**
6. Save baked texture to `textures/avatar_diffuse.png`
7. Resize to 1024x1024 for WebGL delivery

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Non-manifold edges persist | Select edges in Edit mode > Mesh > Clean Up > Delete Loose |
| UV overlaps after cleanup | Manually adjust UV islands in UV Editing workspace |
| Material slots missing | Run `create_materials()` and `assign_material_slots()` from the script |
| Vertex count over budget | Use Decimate modifier to reduce polygon count |
| Normals flipped | Select all faces > Mesh > Normals > Recalculate Outside |

---

## Acceptance Criteria

After optimization, verify:

- [x] All modifiers applied (except Subdivision Surface)
- [x] Non-manifold geometry cleaned
- [x] Duplicate vertices merged (0.001m threshold)
- [x] Normals consistent (outward-facing)
- [x] UV map has zero overlapping islands
- [x] Required material slots created with correct PBR values
- [x] All transforms frozen (location 0, rotation 0, scale 1)
- [x] Total vertex count under 50,000

---

## Deliverable

- `blender/avatar_optimized.blend` — Optimized mesh ready for rigging
