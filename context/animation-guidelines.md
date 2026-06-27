# Character Animation & Blend Guidelines

## Animation Architecture
Each sign gesture or pose track must follow a standard structural sequence:
1. **Start Pose**: The initial position (usually transition from standard idle or preceding sign).
2. **Transition**: The motion pathway that the hands/arms take.
3. **End Pose**: The final holding position.

## Movement Quality
- **Natural Easing**: Use ease-in and ease-out curves. Avoid linear keyframe interpolation, which results in robotic movements.
- **Natural Timing**: Arms should move with weight and resistance, while fingers flex quickly and precisely.
- **No Jitters**: Ensure joints do not snap or skip frames during play loops.

## Coarticulation & Transition Blending
- **State Transition Engine**: Implement smooth transitions (SLERP for quaternions, LERP for positions) to blend between adjacent signs.
- **Blending Overlap**: Blend the ending armature states of sign A with the start state of sign B over a window of 0.2 to 0.3 seconds to simulate natural fluid transitions in sign spelling.

## Facial Expression Sync
- Synchronize skeletal actions with visemes/expressions (using morph target weights) to convey the non-manual grammatical components of sign language (such as eyebrow raises for questions).
