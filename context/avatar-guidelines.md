# 3D Avatar Specifications & Design Guidelines

## Visual Style
- **Cartoon-Style Aesthetic**: Friendly, stylized appearance with clear, simplified features to make expressions and poses highly legible.
- **Color Palette**: Use solid, high-contrast colors for clothing, skin, and hair to ensure clarity in lighting configurations.

## Proportions and Articulation
- **Realistic Proportions**: Keep arms, shoulders, and chest dimensions aligned with standard human bodies.
- **Signing Ergonomics**: Ensure arms are long enough to easily reach the mouth, forehead, and chest without colliding with the mesh or creating unnatural deformations.

## Topology & Polycount
- **Edge Flow**: Focus loops around articulation joints (shoulders, elbows, wrists, and every finger knuckle) to prevent volume loss during bending.
- **Facial Loops**: Optimize facial topology around the eyes and mouth to support smooth viseme (mouth shape) deformations.
- **Polycount Budget**: Maintain a maximum budget of **50,000 vertices** for the entire mesh to allow fast loading and rendering in mobile web browsers.

## Rigging & Bone Naming Conventions
- **Rigify/Metarig standard**: Follow a humanoid armature with correct bone parenting hierarchy.
- **Finger Joints**: All five fingers must be fully rigged with three bones each (proximal, middle, distal phalanx) to support finger-spelling.
- **Bone Names**: Standardize bone names to map seamlessly to Three.js `SkinnedMesh` and WebGL animation player setups.
