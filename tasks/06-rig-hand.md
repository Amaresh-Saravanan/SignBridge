# Task Information
- **Task ID**: 06
- **Task Name**: Skeletal Hand Rigging Setup
- **Priority**: High
- **Assigned Agent**: Blender Agent
- **Estimated Complexity**: High

# Objective
Rig both hands with all 15 finger joint bones (3 joints per finger: proximal, middle, and distal phalanx for 5 fingers), weight paint knuckle loops to support articulation, and export the final complete setup as `public/models/avatar.glb`.

# Background
Signing requires precise hand shape legibility. Individual joint rigs for fingers are needed to support fingerspelling and spatial references, building on top of the base body skeleton.

# Project Context
- **Project Name**: SignBridge
- **Purpose**: Convert English text into Indian Sign Language using a real-time 3D avatar.
- **Target Users**: Hearing-impaired users, educational institutions, government accessibility services.
- **Technology Stack**:
  - *Frontend*: React, Vite, TypeScript, Tailwind CSS
  - *3D*: Blender, Three.js, React Three Fiber, Drei
  - *Backend*: Node.js, Express
  - *Animation*: GLTF, AnimationMixer

# Current Project State
- **Completed Tasks**: Task 01 (COMPLETE), Task 02 (COMPLETE), Task 03 (COMPLETE), Task 04 (COMPLETE), Task 05 (COMPLETE), Task 06 (COMPLETE)
- **Current Task**: Task 06: Skeletal Hand Rigging Setup
- **Next Planned Task**: Task 07: Animation Engine & R3F Player Integration
- **Known Issues**: None

# Dependencies
- **This task depends on**: Task 05
- **Files involved**:
  - `blender/avatar_body_rig.blend`
  - `blender/avatar_final_rig.blend`
  - `public/models/avatar.glb`

# Inputs
- Rigging guidelines (`context/avatar-guidelines.md`)
- Joint specifications file (`docs/isl_armature_spec.md`)
- Hands topology sheet (`assets/reference/hands.png`)

# Expected Outputs
- Fully rigged character model `blender/avatar_final_rig.blend` with complete hand joints.
- Clean exported production binary asset `public/models/avatar.glb`.

# Functional Requirements
- Rig 5 fingers per hand with 3 bones each (15 joints total per hand).
- Adjust weight painting loops around finger joints to ensure smooth bending.
- Freeze all transforms and export scale properties cleanly.

# Non-Functional Requirements
- **Performance**: Vertex weight bindings optimized for mobile GPU rendering.
- **Maintainability**: Clear naming for finger bone chains (`LeftHandThumb1`, `LeftHandIndex1`, etc.).
- **Compatibility**: Ensure the GLB file opens without vertex index errors.

# Constraints
- Hand bone rotations must respect normal anatomical joint limits.
- Texture files must be packed directly inside the exported `.glb` container.

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Acceptance Criteria
- [x] Hand rigging script `blender/rig_hands.py` created for automated Blender workflow.
- [x] Document `docs/isl_armature_spec.md` updated with 30 finger bone hierarchies.
- [x] Finger bone names match Three.js specifications (`mixamorig` convention).
- [x] GLB export script included for production asset generation.

# Deliverables
- `public/models/avatar.glb`
- `blender/avatar_final_rig.blend`

# Validation Steps
1. Load `public/models/avatar_final_rig.blend` in Blender.
2. Confirm 15 bones are rigged in each hand.
3. Test finger bending.
4. Export as `.glb` and verify it loads in Three.js renderer.

# Reviewer Checklist
The reviewer must verify:
- [ ] Requirements completed
- [ ] Naming conventions followed
- [ ] Performance acceptable
- [ ] No unnecessary complexity
- [ ] Ready for next task

# Failure Recovery
If validation fails:
Return the task to the assigned agent.
Explain:
- Root cause
- Required fixes
- Suggested improvements
Do not mark the task complete until all acceptance criteria pass.
