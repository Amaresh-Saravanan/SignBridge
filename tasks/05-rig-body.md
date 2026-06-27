# Task Information
- **Task ID**: 05
- **Task Name**: Body Rigging & Armature Setup
- **Priority**: High
- **Assigned Agent**: Blender Agent
- **Estimated Complexity**: High

# Objective
Create the primary humanoid skeletal armature (shoulders, arms, spine, neck, head), configure Inverse Kinematics (IK) constraints, apply weight painting to joints, and document the final naming specifications in `docs/isl_armature_spec.md`.

# Background
Body rigging establishes the skeleton required to move the torso, neck, and arms during signing. Setting up these coordinates first allows us to output the official mapping specs file (`docs/isl_armature_spec.md`) that subsequent hand rigging and animation systems rely on.

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
- **Completed Tasks**: Task 01 (COMPLETE), Task 02 (COMPLETE), Task 03 (COMPLETE), Task 04 (COMPLETE), Task 05 (COMPLETE)
- **Current Task**: Task 05: Body Rigging & Armature Setup
- **Next Planned Task**: Task 06: Hand Rigging Setup
- **Known Issues**: None

# Dependencies
- **This task depends on**: Task 04
- **Files involved**:
  - `blender/avatar_optimized.blend`
  - `docs/isl_armature_spec.md`

# Inputs
- Rigging guidelines (`context/avatar-guidelines.md`)
- Blender context reference (`context/blender-guidelines.md`)

# Expected Outputs
- A rigged Blender file `blender/avatar_body_rig.blend` (without final finger bones details).
- The official joint hierarchy reference file `docs/isl_armature_spec.md` detailing bone names and rotation limits.

# Functional Requirements
- Build a bipedal skeleton covering Spine, Neck, Head, Shoulders, Upper Arms, Forearms, and Wrists.
- Set up IK (Inverse Kinematics) targets for elbows and wrists to speed up arm placement.
- Paint skin weights around joints to ensure smooth deformations without volume loss.
- Document bone names inside the spec sheet.

# Non-Functional Requirements
- **Performance**: Keeps bone counts minimal to ensure fast GPU skinning inside WebGL.
- **Maintainability**: Clean bone grouping (e.g. Spine, Left Arm, Right Arm).
- **Compatibility**: Align bone rotations with Three.js WebGL coordinate mappings.

# Constraints
- Bone names must use standard Three.js nomenclature (e.g. `mixamorigLeftArm`, `mixamorigLeftForeArm`).
- Rig scales must be applied to prevent coordinate skewing during export.

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Acceptance Criteria
- [x] Rigging script `blender/rig_body.py` created for automated Blender workflow.
- [x] Document `docs/isl_armature_spec.md` is populated with bone hierarchies and saved.
- [x] Bone names match Three.js specifications (`mixamorig` convention).
- [x] Rotation limits and IK constraints documented for all body joints.

# Deliverables
- `blender/avatar_body_rig.blend`
- `docs/isl_armature_spec.md`

# Validation Steps
1. Load `blender/avatar_body_rig.blend` in Blender.
2. Enter Pose Mode and test arm rotations (shoulder, elbow, wrist).
3. Check for correct weight paint boundaries on mesh.
4. Verify that `docs/isl_armature_spec.md` lists all active body bones.

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
