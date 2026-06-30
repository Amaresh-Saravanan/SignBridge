# 3D Avatar System - Technical Design Plan (TDP)

## Document Overview

This document provides a comprehensive technical design for building and enhancing the 3D avatar system for the SignBridge project. It covers architecture, data structures, implementation strategies, and integration points.

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│          SignBridge Application Layer               │
├─────────────────────────────────────────────────────┤
│  UI Layer (React Components)                        │
│  ├─ AvatarDisplay Component                         │
│  ├─ AvatarControls Component                        │
│  └─ CustomizationPanel Component                    │
├─────────────────────────────────────────────────────┤
│  Avatar System Layer                                │
│  ├─ Avatar Renderer (React Three Fiber)             │
│  ├─ Animation Controller                            │
│  ├─ Gesture Manager                                 │
│  ├─ Pose Blender                                    │
│  └─ State Management (Zustand)                      │
├─────────────────────────────────────────────────────┤
│  Data Layer                                         │
│  ├─ Gesture Database (islAnimationMap.js)           │
│  ├─ Avatar Config (colors, dimensions)              │
│  └─ LocalStorage Cache                              │
├─────────────────────────────────────────────────────┤
│  Three.js / WebGL                                   │
└─────────────────────────────────────────────────────┘
```

### 1.2 Component Hierarchy

```
AvatarContainer (Page/View)
├─ AvatarDisplay
│  └─ Canvas (React Three Fiber)
│     └─ RealisticAvatar (3D Model)
│        ├─ Head Group
│        │  ├─ Face Mesh
│        │  ├─ Eyebrows
│        │  ├─ Eyes
│        │  ├─ Mouth
│        │  └─ Hair
│        ├─ Torso Group
│        │  ├─ Chest Mesh
│        │  ├─ Spine
│        │  └─ Arms (Left/Right)
│        │     ├─ Shoulder
│        │     ├─ Upper Arm
│        │     ├─ Elbow
│        │     ├─ Forearm
│        │     ├─ Wrist
│        │     ├─ Hand
│        │     └─ Fingers (5 per hand)
│        └─ Legs
├─ AvatarControls
│  ├─ PlayButton
│  ├─ PauseButton
│  ├─ SpeedSlider
│  ├─ TimelineDisplay
│  └─ RepeatButton
└─ CustomizationPanel
   ├─ SkinColorPicker
   ├─ ClothingColorPicker
   ├─ HairColorPicker
   └─ CameraAngleSelector
```

---

## 2. Core Module Design

### 2.1 Avatar Model (RealisticAvatar Component)

**Purpose**: Render the 3D avatar with proper skeletal structure

**Key Responsibilities**:
- Create and manage 3D geometry (head, body, limbs, fingers)
- Expose skeletal references for animation system
- Apply materials and textures
- Handle shadow casting and lighting

**Structure**:
```javascript
// Current: src/components/three/RealisticAvatar.jsx
// Props:
// - skinColor: hex color
// - bodyColor: hex color
// - pantsColor: hex color
// - hairColor: hex color
// Exposed via useImperativeHandle:
// - hips, spine, chest, neck, head (body joints)
// - leftShoulder, leftElbow, leftWrist, leftHand (arm chains)
// - rightShoulder, rightElbow, rightWrist, rightHand (arm chains)
// - leftFingers/rightFingers (finger articulation arrays)
// - face properties (eyebrows, mouth)
```

**Enhancement Opportunities**:
- [ ] Add LOD (Level of Detail) system for mobile
- [ ] Implement morphing targets for facial expressions
- [ ] Add clothing as separate mesh groups for better customization
- [ ] Support blend shapes for mouth shapes (phonemes)

### 2.2 Animation System

**Purpose**: Apply keyframe animations and pose blending

**Components**:

#### A. Gesture Pose Manager (`islAnimationMap.js`)
- Stores quaternion-based poses for each gesture
- Maps text to animation poses
- Returns facial expression states
- Supports sentence-level markers (questions, negations, etc.)

```javascript
// Current structure:
GLOSS_POSES = {
  HELLO: {
    rightShoulder: { quaternion: [...] },
    rightElbow: { quaternion: [...] },
    rightWrist: { quaternion: [...] },
    rightFingers: [
      { knuckle_quaternion, mid_quaternion, tip_quaternion },
      // ... 5 fingers total
    ],
    face: {
      leftEyebrow: { rotation: [...] },
      rightEyebrow: { rotation: [...] },
      mouth: { rotation: [...] }
    }
  },
  // ... 30+ more gestures
}

// Functions:
- getPoseForGloss(gloss): returns pose object
- getAvailableGlosses(): returns array of gesture names
- getNMMForSentenceType(type): returns non-manual markers
```

**Enhancement Needed**:
- [ ] Add animation curves/easing (keyframe interpolation)
- [ ] Add gesture duration metadata
- [ ] Add transition poses between gestures
- [ ] Support gesture variations (regional differences)

#### B. Animation Controller
**Purpose**: Execute animations on the avatar

**Responsibilities**:
- Interpolate between poses using quaternion SLERP
- Handle gesture timing and sequencing
- Manage playback state (playing, paused, stopped)
- Apply easing functions

**New Component to Create**:
```javascript
// File: src/lib/animationController.js

class AnimationController {
  constructor(avatarRef, gestureDatabase) {
    this.avatarRef = avatarRef
    this.gestureDb = gestureDatabase
    this.currentAnimation = null
    this.playbackState = 'stopped' // playing, paused, stopped
    this.playbackSpeed = 1.0
    this.currentFrame = 0
    this.totalFrames = 0
    this.frameRate = 60
  }

  // Core methods
  playGesture(gloss, duration = 1000)
  playSequence(glosses, durations)
  pause()
  resume()
  stop()
  setPlaybackSpeed(speed)
  
  // Internal methods
  interpolatePose(startPose, endPose, progress)
  applyPoseToAvatar(pose)
  updateFrame(deltaTime)
}
```

#### C. Pose Blender (`poseBlender.js`)
**Current**: Already exists, blends multiple poses

**Enhancements Needed**:
- [ ] Add inverse kinematics for natural arm positioning
- [ ] Support blend weights for smooth transitions
- [ ] Add constraint satisfaction for hand positions
- [ ] Optimize quaternion interpolation

### 2.3 State Management (Zustand Store)

**Purpose**: Manage avatar state globally

**File**: `src/stores/avatarStore.js` (new)

```javascript
const useAvatarStore = create((set) => ({
  // Avatar Configuration
  avatarConfig: {
    skinColor: '#ffd2b1',
    bodyColor: '#5ba0d0',
    pantsColor: '#203884',
    hairColor: '#422a14',
  },
  updateAvatarConfig: (config) => set((state) => ({
    avatarConfig: { ...state.avatarConfig, ...config }
  })),

  // Animation State
  animationState: {
    currentGloss: null,
    queue: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackSpeed: 1.0,
  },
  setAnimationState: (state) => set({ animationState: state }),

  // UI State
  showControls: true,
  cameraAngle: 'front', // front, 3q, side
  highContrast: false,
  
  // Methods
  playGesture: (gloss) => {},
  stopAnimation: () => {},
  toggleHighContrast: () => set((state) => ({
    highContrast: !state.highContrast
  })),
}))
```

---

## 3. Data Flow & Interactions

### 3.1 Gesture Playback Flow

```
User Input (text)
    ↓
NLP Parser / Tokenizer
    ↓
Convert to Glosses (array of sign names)
    ↓
AvatarStore.playSequence(glosses)
    ↓
AnimationController.playSequence()
    ↓
For each gloss:
  - Get pose from GLOSS_POSES
  - Calculate interpolation curve
  - For each frame:
    - Calculate current pose (slerp interpolation)
    - Apply pose to avatar skeleton
    - Render frame
    ↓
Animation Complete
```

### 3.2 Customization Flow

```
User selects color (e.g., skin tone)
    ↓
ColorPicker onChange event
    ↓
useAvatarStore.updateAvatarConfig({ skinColor: newColor })
    ↓
Zustand triggers re-render
    ↓
RealisticAvatar receives new prop
    ↓
Mesh materials update color
    ↓
Three.js re-renders scene
```

### 3.3 Playback Control Flow

```
User clicks Play
    ↓
AvatarControls.onPlayClick()
    ↓
AnimationController.play()
    ↓
AnimationLoop (requestAnimationFrame):
  - Calculate elapsed time
  - Update frame based on deltaTime
  - Apply pose interpolation
  - Render frame
    ↓
User clicks Pause
    ↓
AnimationController.pause()
    ↓
AnimationLoop stops updating frame position
```

---

## 4. Implementation Details

### 4.1 Quaternion-Based Pose System

**Why Quaternions?**
- Avoid gimbal lock (unlike Euler angles)
- Smooth interpolation (SLERP - Spherical Linear Interpolation)
- Compact representation (4 values instead of 9 for matrices)

**Implementation**:
```javascript
// SLERP (Spherical Linear Interpolation)
function slerp(qa, qb, t) {
  // Quaternion linear interpolation
  // qa: start quaternion [x, y, z, w]
  // qb: end quaternion [x, y, z, w]
  // t: progress (0.0 to 1.0)
  
  const dotProduct = qa[0]*qb[0] + qa[1]*qb[1] + qa[2]*qb[2] + qa[3]*qb[3]
  
  if (dotProduct < 0) {
    qb = [-qb[0], -qb[1], -qb[2], -qb[3]]
  }
  
  // Clamp to avoid numerical errors
  let safeProduct = Math.max(-1, Math.min(1, dotProduct))
  const theta = Math.acos(safeProduct)
  const sinTheta = Math.sin(theta)
  
  if (sinTheta < 0.001) return qa // Fallback to linear interpolation
  
  const scale1 = Math.sin((1 - t) * theta) / sinTheta
  const scale2 = Math.sin(t * theta) / sinTheta
  
  return [
    scale1 * qa[0] + scale2 * qb[0],
    scale1 * qa[1] + scale2 * qb[1],
    scale1 * qa[2] + scale2 * qb[2],
    scale1 * qa[3] + scale2 * qb[3],
  ]
}

// Apply quaternion to Three.js object
const quat = new THREE.Quaternion(...quaternionArray)
bone.quaternion.copy(quat)
```

### 4.2 Animation Keyframing

**Gesture Duration Strategy**:
- Most gestures: 800-1200ms
- Quick gestures (YES, NO): 600ms
- Slow gestures (SCHOOL): 1500ms
- Transitions between gestures: 200-300ms

**Easing Functions**:
```javascript
const EasingFunctions = {
  linear: (t) => t,
  easeInOut: (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => t * t * t,
}

// Apply easing to gesture animation
function interpolateFrame(startPose, endPose, progress, easing = 'easeInOut') {
  const easedProgress = EasingFunctions[easing](progress)
  return blendPoses(startPose, endPose, easedProgress)
}
```

### 4.3 Performance Optimization Strategies

#### A. Gesture Caching
```javascript
class GestureCache {
  constructor() {
    this.cache = new Map()
  }
  
  getOrCreate(gloss, duration, easing) {
    const key = `${gloss}_${duration}_${easing}`
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    
    // Pre-compute interpolated keyframes
    const keyframes = this.computeKeyframes(gloss, duration, easing)
    this.cache.set(key, keyframes)
    return keyframes
  }
  
  computeKeyframes(gloss, duration, easing) {
    const fps = 60
    const frameCount = Math.ceil(duration / 1000 * fps)
    const keyframes = []
    
    const startPose = getPoseForGloss(gloss)
    const endPose = getRestPose()
    
    for (let i = 0; i < frameCount; i++) {
      const progress = i / frameCount
      const easedProgress = EasingFunctions[easing](progress)
      const frame = interpolatePose(startPose, endPose, easedProgress)
      keyframes.push(frame)
    }
    
    return keyframes
  }
}
```

#### B. Level of Detail (LOD)
```javascript
// Reduce geometry complexity on mobile
const shouldUseLOD = isMobileDevice()

if (shouldUseLOD) {
  // Use lower polygon count for fingers
  const fingerGeometry = new THREE.CylinderGeometry(radius, radius, length, 8) // 8 segments
} else {
  const fingerGeometry = new THREE.CylinderGeometry(radius, radius, length, 16) // 16 segments
}
```

#### C. Memory Management
```javascript
class AvatarRenderer {
  dispose() {
    // Clean up Three.js resources
    this.geometry.dispose()
    this.materials.forEach(m => m.dispose())
    this.textures.forEach(t => t.dispose())
    this.renderer.dispose()
  }
}

// Call on component unmount
useEffect(() => {
  return () => avatarRenderer.dispose()
}, [])
```

---

## 5. File Structure & Organization

### Proposed Directory Layout
```
signbridge/
├── src/
│   ├── components/
│   │   ├── three/
│   │   │   ├── RealisticAvatar.jsx (existing)
│   │   │   ├── AvatarDisplay.jsx (new)
│   │   │   ├── AvatarScene.jsx (new - Canvas wrapper)
│   │   │   └── AvatarEnvironment.jsx (new - lighting, background)
│   │   ├── avatar-ui/
│   │   │   ├── AvatarControls.jsx (new)
│   │   │   ├── CustomizationPanel.jsx (new)
│   │   │   ├── TimelineDisplay.jsx (new)
│   │   │   └── SpeedControl.jsx (new)
│   │   └── ...existing components
│   ├── lib/
│   │   ├── islAnimationMap.js (existing)
│   │   ├── poseBlender.js (existing)
│   │   ├── animationController.js (new)
│   │   ├── quaternionUtils.js (new)
│   │   ├── easingFunctions.js (new)
│   │   └── gestureCache.js (new)
│   ├── stores/
│   │   ├── appStore.js (existing)
│   │   ├── avatarStore.js (new)
│   │   └── ...existing stores
│   ├── hooks/
│   │   ├── useAvatarAnimation.js (new)
│   │   ├── useAvatarCustomization.js (new)
│   │   └── ...existing hooks
│   └── pages/
│       ├── Hub.jsx (integrate avatar)
│       └── ...existing pages
└── ...project root files
```

---

## 6. Key Implementation Components

### 6.1 AvatarDisplay Component (New)

```javascript
// src/components/three/AvatarDisplay.jsx
import { Canvas } from '@react-three/fiber'
import { RealisticAvatar } from './RealisticAvatar'
import { useAvatarStore } from '@/stores/avatarStore'

export function AvatarDisplay() {
  const avatarConfig = useAvatarStore(state => state.avatarConfig)
  const avatarRef = useRef()

  return (
    <div className="avatar-display-container">
      <Canvas
        camera={{ position: [0, 0.5, 1.5], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={1} />
        <RealisticAvatar
          ref={avatarRef}
          {...avatarConfig}
        />
      </Canvas>
    </div>
  )
}
```

### 6.2 AnimationController Hook (New)

```javascript
// src/hooks/useAvatarAnimation.js
import { useRef, useCallback, useEffect } from 'react'
import { AnimationController } from '@/lib/animationController'

export function useAvatarAnimation(avatarRef) {
  const controllerRef = useRef(null)

  useEffect(() => {
    if (!avatarRef.current) return
    controllerRef.current = new AnimationController(avatarRef.current)
  }, [])

  const playGesture = useCallback((gloss) => {
    controllerRef.current?.playGesture(gloss)
  }, [])

  const playSequence = useCallback((glosses) => {
    controllerRef.current?.playSequence(glosses)
  }, [])

  return {
    playGesture,
    playSequence,
    pause: () => controllerRef.current?.pause(),
    resume: () => controllerRef.current?.resume(),
    stop: () => controllerRef.current?.stop(),
  }
}
```

### 6.3 AvatarControls Component (New)

```javascript
// src/components/avatar-ui/AvatarControls.jsx
export function AvatarControls({ onPlay, onPause, onStop, currentTime, duration }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)

  const handlePlayClick = () => {
    setIsPlaying(true)
    onPlay()
  }

  const handlePauseClick = () => {
    setIsPlaying(false)
    onPause()
  }

  return (
    <div className="avatar-controls">
      <button onClick={handlePlayClick} disabled={isPlaying}>
        ▶ Play
      </button>
      <button onClick={handlePauseClick} disabled={!isPlaying}>
        ⏸ Pause
      </button>
      <button onClick={onStop}>⏹ Stop</button>
      
      <div className="timeline">
        <div className="progress-bar">
          <div 
            className="progress" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>

      <div className="speed-control">
        <label>Speed:</label>
        <select value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))}>
          <option value={0.5}>0.5x</option>
          <option value={1.0}>1.0x</option>
          <option value={1.5}>1.5x</option>
          <option value={2.0}>2.0x</option>
        </select>
      </div>
    </div>
  )
}
```

---

## 7. Integration Points

### 7.1 With NLP/Text Processing
```javascript
// In Hub page or converter component
const userText = "Hello, how are you?"

// 1. Convert text to glosses (sign language words)
const glosses = nlpService.textToGlosses(userText)
// Output: ['HELLO', 'HOW', 'YOU']

// 2. Play animation sequence
useAvatarAnimation.playSequence(glosses)
```

### 7.2 With Authentication & User Preferences
```javascript
// Store user's avatar customization preferences
// On login, load from database
useEffect(() => {
  if (user) {
    avatarStore.updateAvatarConfig(user.avatarPreferences)
  }
}, [user])

// Save when user changes settings
const handleColorChange = (color) => {
  avatarStore.updateAvatarConfig({ skinColor: color })
  
  // Save to backend
  api.updateUserSettings({ avatarPreferences: avatarStore.getState().avatarConfig })
}
```

### 7.3 With Analytics
```javascript
// Track gesture views and user engagement
function trackGestureView(gloss) {
  analytics.logEvent('gesture_viewed', {
    gloss,
    timestamp: Date.now(),
    userId: currentUser.id,
  })
}

// Call when gesture completes
const handleGestureComplete = (gloss) => {
  trackGestureView(gloss)
}
```

---

## 8. Testing Strategy

### 8.1 Unit Tests
- Quaternion interpolation functions
- Pose blending logic
- Easing function calculations
- Gesture database lookups

### 8.2 Component Tests
- RealisticAvatar rendering
- AvatarControls interactions
- CustomizationPanel color changes
- Animation state updates

### 8.3 Integration Tests
- End-to-end gesture playback
- Sequence animation flow
- State persistence
- Customization persistence

### 8.4 Performance Tests
- Frame rate monitoring
- Memory profiling
- Load time benchmarks
- Mobile device testing

```javascript
// Example test structure
describe('AnimationController', () => {
  it('should interpolate between poses smoothly', () => {
    const controller = new AnimationController(avatarRef)
    const startPose = { /* ... */ }
    const endPose = { /* ... */ }
    
    const frame1 = controller.interpolatePose(startPose, endPose, 0.5)
    expect(frame1).toBeDefined()
    expect(frame1.quaternion).toBeDefined()
  })
})
```

---

## 9. Browser & Device Support

### Desktop Support
- Chrome 90+ (Primary)
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support
- iOS Safari 14+
- Chrome for Android 90+
- Samsung Internet 14+
- Firefox for Android 88+

### Fallback Strategy
```javascript
// Detect WebGL support
function hasWebGLSupport() {
  const canvas = document.createElement('canvas')
  return !!(
    window.WebGLRenderingContext &&
    (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  )
}

// Show warning if not supported
if (!hasWebGLSupport()) {
  return <WebGLNotSupportedMessage />
}
```

---

## 10. Future Enhancements (Post-MVP)

### Phase 2+
- [ ] **Gesture Recording**: Allow users to record and save custom gestures
- [ ] **Multi-Avatar Mode**: Show multiple signers for dialogue
- [ ] **Sign Variation Display**: Show regional ISL variations
- [ ] **Lip-Sync**: Animate mouth shapes matching speech
- [ ] **Hand Pose Input**: Read pose from webcam using ML.js or TensorFlow
- [ ] **Advanced Blending**: Natural IK-based arm positioning
- [ ] **Character Selection**: Multiple avatar models/styles
- [ ] **Clothes/Accessories**: Full wardrobe customization
- [ ] **Environment Customization**: Different backgrounds and lighting
- [ ] **Replay Recording**: Record and save gesture sequences

---

## 11. Known Limitations & Challenges

### Current Limitations
1. **Hand Articulation**: Complex multi-finger movements difficult to capture
2. **Body Movement**: Limited torso and hip movement in current rig
3. **Performance**: Finger articulation on mobile still demanding
4. **Animation Curves**: Linear interpolation between keyframes lacks organic feel

### Technical Challenges
1. **Quaternion Gimbal Lock**: Requires careful interpolation strategy
2. **Hand Placement**: IK (Inverse Kinematics) not yet implemented
3. **Performance on Mobile**: WebGL context switches are expensive
4. **Gesture Variations**: Regional ISL differences not yet captured

### Proposed Solutions
- Implement IK solver for natural arm positioning
- Use pre-computed keyframe cache to reduce calculations
- Implement gesture variation metadata system
- Add morph targets for complex finger shapes

---

## 12. Success Criteria

The implementation will be considered successful when:

1. ✅ Avatar renders smoothly (60 FPS desktop, 30 FPS mobile)
2. ✅ 30+ ISL gestures animate correctly
3. ✅ Gesture sequences play without visual jank
4. ✅ Non-manual markers display at correct times
5. ✅ Customization persists across sessions
6. ✅ Loads in < 2 seconds
7. ✅ User testing shows > 4.5/5 satisfaction
8. ✅ Achieves WebAIM accessibility score > 90
9. ✅ Works on 95%+ of target browsers/devices
10. ✅ Memory usage < 100MB

---

## 13. Timeline

| Phase | Duration | Deliverables |
|-------|----------|---------------|
| Phase 1: Foundation | 4 weeks | Animation controller, gesture caching, performance optimization |
| Phase 2: Features | 4 weeks | Gesture sequencing, NMMs, customization |
| Phase 3: Polish | 4 weeks | Accessibility, mobile optimization, testing |
| Phase 4: Advanced | Ongoing | Recording, multi-avatar, variations |

---

## 14. Appendix: Technical Reference

### A. Quaternion Representation
- Format: [x, y, z, w]
- w is scalar, [x, y, z] is vector component
- Example: `[0, 0, 0.707, 0.707]` = 90° rotation around Z axis

### B. Three.js Integration
```javascript
// Convert quaternion array to Three.js Quaternion
const quat = new THREE.Quaternion(x, y, z, w)

// Apply to bone
bone.quaternion.copy(quat)

// Interpolate
bone.quaternion.slerpQuaternions(qa, qb, t)
```

### C. Useful Links
- Three.js Documentation: https://threejs.org/docs/
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber/
- ISL Resources: https://www.islu.org/
- WebGL Best Practices: https://www.khronos.org/webgl/

