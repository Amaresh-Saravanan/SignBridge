# Task Information
- **Task ID**: 03
- **Task Name**: Avatar Design & Modeling
- **Priority**: Medium
- **Assigned Agent**: Avatar Designer
- **Estimated Complexity**: High

# Objective
Design and model a cartoon-style humanoid character mesh in Blender. The model must have realistic human body proportions and a clean low-polygon topology optimized for real-time web rendering.

# Background
The avatar is the visual center of SignBridge. A stylized cartoon appearance makes visual gestures friendlier and clearer. At this stage, focus is entirely on the visual mesh design, shape, and proportions before any armature rig is added.

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
- **Completed Tasks**: Task 01 (COMPLETE), Task 02 (COMPLETE), Task 03 (COMPLETE)
- **Current Task**: Task 03: Avatar Design & Modeling
- **Next Planned Task**: Task 04: Blender Export Optimization
- **Known Issues**: None

# Dependencies
- **This task depends on**: None
- **Files involved**:
  - `blender/avatar.blend`
  - `docs/avatar_specs.md`

# Inputs
- 3D Avatar Design Guidelines (`context/avatar-guidelines.md`)
- Material specifications (`context/material-guidelines.md`)

# Expected Outputs
- A Blender character mesh file `blender/avatar.blend` with unrigged geometry.
- A documentation file `docs/avatar_specs.md` summarizing dimensions, styling, and polycount.

# Functional Requirements
- Stylized, professional cartoon appearance with clear facial details (eyes, nose, mouth).
- Body dimensions calibrated so hands can reach the chest, neck, and face.
- Vertices distributed to support smooth visual shape changes.

# Non-Functional Requirements
- **Performance**: Polygon budget strictly under **50,000 vertices** partitioned as:
    - Head: 8,000 vertices
    - Hands: 12,000 vertices
    - Body: 10,000 vertices
    - Legs: 8,000 vertices
    - Arms: 8,000 vertices
    - Accessories: 4,000 vertices
- **Maintainability**: Labeled mesh parts and slot indices.
- **Compatibility**: Standard metric units configured.

# Constraints
- Mesh must be modeled in a static T-pose or A-pose with no armature.
- Textures and materials should follow naming structures.

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Acceptance Criteria
- [x] Character specifications documentation `docs/avatar_specs.md` is created and saved.
- [x] Polycount budget is defined with proper sub-component allocation.
- [x] Body proportions are specified for signing ergonomics.

# Deliverables
- `blender/avatar.blend`
- `docs/avatar_specs.md`

# Validation Steps
1. Load `blender/avatar.blend` in Blender.
2. Confirm the model is in a static T-pose or A-pose with no bone structure.
3. Check the mesh statistics to confirm vertex budget is met.
4. Render a front preview image.

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
