# Task Information
- **Task ID**: 01
- **Task Name**: Project Setup and R3F Canvas Verification
- **Priority**: High
- **Assigned Agent**: React Agent
- **Estimated Complexity**: Low

# Objective
Establish the directory structure, install/verify all React Three Fiber (R3F) and Three.js dependencies, configure routing, and render a simple WebGL canvas component to ensure rendering runs without console errors.

# Background
Before integrating complex 3D human meshes or animations, the foundation (the React application shell, state managers, and the basic R3F Canvas player) must be verified and running.

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
- **Completed Tasks**: Task 01 (COMPLETE)
- **Current Task**: Task 01: Project Setup and R3F Canvas Verification
- **Next Planned Task**: Task 02: Indian Sign Language Research
- **Known Issues**: None

# Dependencies
- **This task depends on**: None
- **Files involved**:
  - `package.json`
  - `src/main.jsx`
  - `src/App.jsx`
  - `src/index.css`
  - `src/components/three/AvatarDemo.jsx`

# Inputs
- Shared coding standards context file (`context/coding-standards.md`)
- Shared tech stack reference context file (`context/tech-stack.md`)

# Expected Outputs
- A running React Vite development application shell.
- A functional R3F `<Canvas>` displaying a rotating test mesh (sanity box) in `src/components/three/AvatarDemo.jsx`.
- Working global navigation routing using `react-router-dom`.

# Functional Requirements
- Initialize routing for Landing page, Hub, Settings, History, and Onboarding.
- Implement responsive viewport styling with Tailwind CSS.
- Configure canvas with proper lighting (ambient and point lights) and a test mesh.

# Non-Functional Requirements
- **Performance**: Render loops must consistently achieve 60 FPS.
- **Maintainability**: Clear division between UI layout and canvas components.
- **Readability**: Code adheres strictly to formatting guidelines.
- **Accessibility**: ARIA labels on navigation buttons.
- **Compatibility**: Responsive layout testing across multiple viewport sizes.

# Constraints
- Must use React 19 and Three.js v0.184 as specified in `package.json`.
- No styling placeholders.

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Acceptance Criteria
- [x] Project starts successfully with no runtime errors.
- [x] The R3F Canvas renders the rotating test cube on the Hub page.
- [x] The console contains zero Three.js warnings or React render loop errors.
- [x] Zustand global appStore can trigger change in state without infinite loops.

# Deliverables
- `src/components/three/AvatarDemo.jsx`
- `src/pages/Hub.jsx`

# Validation Steps
1. Execute Vite dev server via command line.
2. Open local server port in browser.
3. Verify that the 3D rotating test box renders in the center of the canvas layout.
4. Check Chrome DevTools console for any warnings or errors.

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
