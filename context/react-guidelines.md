# React & Three.js Frontend Guidelines

## Component Architecture
- Separate UI layouts from Three.js canvases.
- Keep R3F components inside `src/components/three/` and UI controls in `src/components/ui/` or the pages layout.
- Use Zustand selectors carefully to avoid triggering full page re-renders.

## Three.js / React Three Fiber (R3F) Integration
- Wrap R3F canvases in error boundaries and responsive parent containers.
- Use `useFrame` only for direct ref modifications (like bone rotation adjustments).
- Load models using `@react-three/drei`'s `useGLTF` hooks, enabling asset caching.
- Dispose of materials, geometries, and textures explicitly inside `useEffect` unmount calls.

## Styling & Theme Control
- Use utility-first Tailwind classes matching design system guidelines.
- Support smooth transitions between pages and loading skeleton states.
