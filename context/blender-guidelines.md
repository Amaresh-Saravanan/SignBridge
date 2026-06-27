# Blender Technical Art Guidelines

## Character Mesh & Proportions
- Keep coordinates at metric standards.
- Build the base humanoid geometry in standard T-Pose or A-Pose.
- Calibrate arm spans to ensure hands can comfortably touch facial vertices without mesh clipping.

## Retopology & UV Maps
- Distribute edge loops evenly around joints (knuckles, wrists, elbows) to allow smooth vertex deformation.
- Group UV islands logically (e.g. skin, clothing, hair) and pack efficiently to maximize resolution.

## Rigging & Rigify Setup
- Use Metarig armature skeletons matching WebGL standards.
- Rig fingers with three joints per finger for fingerspelling precision.
- Paint vertex weights smoothly; check flex extremes to avoid self-penetration.

## GLTF/GLB Export Requirements
- Apply all visual modifiers (Mirror, Solidify, etc.) before export.
- Freeze all transforms (scale=1, rotation=0, position=0) for armature and mesh.
- Include custom shape keys (visemes) and check that bone weight assignments export cleanly.
