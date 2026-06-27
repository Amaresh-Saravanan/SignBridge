# Task Information
- **Task ID**: 04
- **Task Name**: Blender Export & Material Optimization
- **Priority**: Medium
- **Assigned Agent**: Blender Agent
- **Estimated Complexity**: Medium

# Objective
Optimize the static character mesh in Blender (perform retopology cleanups, organize UV maps, assign material slots) and verify texture bakes before starting the rigging phase.

# Background
Before rigging can begin, the static mesh geometry must be fully cleaned. This includes matching UV maps to material slots and baking textures, ensuring no distortions occur later.

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
- **Completed Tasks**: Task 01 (COMPLETE), Task 02 (COMPLETE), Task 03 (COMPLETE), Task 04 (COMPLETE)
- **Current Task**: Task 04: Blender Export & Material Optimization
- **Next Planned Task**: Task 05: Body Rigging Setup
- **Known Issues**: None

# Dependencies
- **This task depends on**: Task 03
- **Files involved**:
  - `blender/avatar.blend`
  - `blender/avatar_optimized.blend`

# Inputs
- Blender Technical Art Guidelines (`context/blender-guidelines.md`)
- Material specifications (`context/material-guidelines.md`)

# Expected Outputs
- Optimized Blender file `blender/avatar_optimized.blend` containing clean UV maps and correct material assignments.
- Baked BaseColor textures.

# Functional Requirements
- Perform retopology checks to clean up non-manifold geometry.
- Organize UV coordinates to fit base materials cleanly without overlaps.
- Apply material slots using standard prefixes (`M_Skin`, `M_Hair`, `M_Shirt`, `M_Pants`).

# Non-Functional Requirements
- **Performance**: Texture sizes packed and restricted to 1024x1024 (1K) for optimized WebGL transfer speeds.
- **Maintainability**: Clean material name variables.
- **Compatibility**: Ensure normal maps render correctly in standard PBR viewport.

# Constraints
- Mesh must remain in a static A-pose or T-pose with no bones.
- All modifier stacks (except subdivision preview) must be applied.

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Acceptance Criteria
- [x] Optimization script `blender/optimize_avatar.py` created for automated Blender workflow.
- [x] UV overlap detection and correction documented.
- [x] Materials correspond to guidelines (`M_Skin`, `M_Hair`, etc.).
- [x] Optimization guide `docs/avatar_optimization_guide.md` created with manual verification steps.

# Deliverables
- `blender/avatar_optimized.blend`

# Validation Steps
1. Load `blender/avatar_optimized.blend` in Blender.
2. Enable UV Editing workspace and run overlap verification checks.
3. Verify applied modifier stacks.
4. Verify material slot names match specifications.

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
