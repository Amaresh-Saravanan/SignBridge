# Task Information
- **Task ID**: 10
- **Task Name**: Frontend-Backend Integration
- **Priority**: High
- **Assigned Agent**: React Agent
- **Estimated Complexity**: Low

# Objective
Wire the Hub page to call the backend translation API and enqueue glosses for the animation engine.

# Background
The backend API (Task 08) is running but the frontend (Hub.jsx) doesn't call it yet. This task connects them.

# Dependencies
- **This task depends on**: 07, 08
- **Files involved**:
  - `src/pages/Hub.jsx`
  - `src/stores/appStore.js`

# Acceptance Criteria
- [x] Hub calls POST /api/translate on speech/text input
- [x] Gloss response is enqueued in appStore
- [x] Avatar plays animations from queued glosses
- [x] Error handling for API failures

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Deliverables
- Updated `src/pages/Hub.jsx`
- `output/task10/notes.txt`
