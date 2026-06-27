# Coding Standards & Guidelines

## General Principles
- **No Over-Engineering**: Adhere strictly to project requirements. Avoid introducing unnecessary abstractions, helper libraries, or complex designs before they are needed.
- **Maintainability & Readability**: Keep files focused, name variables descriptively, and write modular functions.
- **Type Safety**: Use TypeScript definitions where applicable to prevent runtime type errors.

## React Frontend Standards
1. **Component Design**:
   - Write functional, reusable, and single-responsibility components.
   - Separate UI presentation from business logic hooks.
2. **State Management**:
   - Keep page-level states in standard React hooks (`useState`, `useRef`).
   - Use Zustand stores (`src/stores/`) only for global application states like auth session, overall translation player state, and toast notices.
3. **Styling**:
   - Use Tailwind CSS alongside utility-first CSS in Vite.
   - Maintain a unified color palette and design token values defined in the global CSS configuration.

## Three.js & WebGL Performance Standards
1. **Resource Disposal**:
   - Dispose of geometries, materials, and textures when components unmount to prevent browser memory leaks.
   - Reuse materials and geometries where possible rather than re-creating them inside loops.
2. **Render Loop Optimization**:
   - Limit state modifications or complex math operations inside the R3F `useFrame` hook.
   - Use refs instead of component state to modify rotation or positions on frames.
3. **Canvas Settings**:
   - Set optimal device pixel ratios and keep shadow map allocations minimal to ensure smooth 60 FPS rendering on mobile devices.
