# Task Information
- **Task ID**: 07
- **Task Name**: Animation Engine & R3F Player Integration
- **Priority**: High
- **Assigned Agent**: Animation Agent
- **Estimated Complexity**: High

# Objective
Develop skeletal sign language animations, implement a pose blending engine (interpolation), integrate the rigged GLTF model player inside a React Three Fiber canvas component, and connect the player state to live speech translation inputs.

# Background
This task is the final integration of the SignBridge system. It brings together the 3D model, the rigging skeletal hierarchies, the animation sequences, and the React UI layer to showcase a fully functional, speech-to-sign visual interface.

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
- **Completed Tasks**:
  - Task 01: Project Setup and R3F Canvas Verification
  - Task 02: Indian Sign Language Translation Research
  - Task 03: Avatar Design & Modeling
  - Task 04: Blender Export & Material Optimization
  - Task 05: Body Rigging & Armature Setup
  - Task 06: Skeletal Hand Rigging Setup
- **Current Task**: Task 07: Animation Engine & R3F Player Integration
- **Next Planned Task**: None
- **Known Issues**: None

# Dependencies
- **This task depends on**: Task 06 and Task 02
- **Files involved**:
  - `src/components/three/HubAvatar.jsx`
  - `src/components/three/RealisticAvatar.jsx`
  - `src/stores/appStore.js`
  - `src/hooks/useSpeechRecognition.js`

# Inputs
- Animation Guidelines Context (`context/animation-guidelines.md`)
- translation specs (`docs/isl_translation_spec.md`)
- Production rigged avatar asset (`public/models/avatar.glb`)

# Expected Outputs
- Fully integrated avatar canvas player `src/components/three/HubAvatar.jsx` playing idle and sign sequences.
- Pose blending interpolation hook/utility that eliminates frame jitters during transitions.
- Functional voice-to-sign pipeline using the browser speech recognition API.

# Functional Requirements
- Render the skinned avatar mesh cleanly inside the main app layout.
- Blend skeletal animations using `slerp` over a window of 0.2 to 0.3 seconds.
- Map text input glosses (e.g. hello, please, thank you) to play corresponding animation keys.
- Synchronize head tilts and visemes mouth morphs alongside hand movements.

# Non-Functional Requirements
- **Performance**: Frame rate must stay at 60 FPS with minimal GPU memory growth.
- **Maintainability**: Clear division of gesture play sequences from state stores.
- **Accessibility**: Support high-contrast borders and visual indicators during animation loops.

# Constraints
- Blender-exported shape key weights must be driven directly via R3F state bindings.
- Animating bones must respect skeletal boundaries to avoid self-clipping.

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Acceptance Criteria
- [x] Procedural character renders and animates inside the React canvas frame without crashes.
- [x] Character transitions seamlessly from idle pose to sign pose and back to idle.
- [x] Speech recognition transcript correctly fires corresponding gloss animations in sequence.
- [x] Verification tester reports a PASS status on multiple test viewports.

# Deliverables
- `src/components/three/HubAvatar.jsx` (MODIFIED)
- `src/components/three/RealisticAvatar.jsx` (UNCHANGED)
- `src/lib/poseBlender.js` (NEW)
- `src/lib/islAnimationMap.js` (NEW)
- `src/stores/appStore.js` (MODIFIED)

# Validation Steps
1. Start the React frontend application.
2. Navigate to the Hub translation view.
3. Click the speech-input micro icon, speak a registered word (e.g. "hello"), and check translation response.
4. Watch avatar animation: check if motion blends smoothly (slerp transition) without bone snappings.
5. Verify that viseme parameters shift to match the vocalized sound.

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
