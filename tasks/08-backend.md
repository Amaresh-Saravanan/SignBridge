# Task Information
- **Task ID**: 08
- **Task Name**: ISL Translation API & Backend Setup
- **Priority**: High
- **Assigned Agent**: Backend Agent
- **Estimated Complexity**: Medium

# Objective
Build the Express/Node.js backend with an ISL Translation API that converts English text into ISL gloss sequences, following the grammar rules from Task 02.

# Background
The frontend animation engine (Task 07) can play gloss-based animations but needs a backend to translate English speech/text into ISL gloss tokens. This task creates the translation pipeline.

# Project Context
- **Project Name**: SignBridge
- **Purpose**: Convert English text into Indian Sign Language using a real-time 3D avatar.
- **Technology Stack**:
  - *Backend*: Node.js, Express
  - *Translation*: Custom ISL grammar engine
  - *Frontend Integration*: REST API consumed by React

# Dependencies
- **This task depends on**: 02
- **Files involved**:
  - `backend/` (new directory)
  - `backend/server.js`
  - `backend/routes/translate.js`
  - `backend/services/islTranslator.js`
  - `backend/middleware/validate.js`

# Inputs
- ISL Translation Spec (`docs/isl_translation_spec.md`)
- Backend Guidelines (`context/backend-guidelines.md`)

# Expected Outputs
- Express server with CORS support
- POST `/api/translate` endpoint
- English-to-ISL gloss translation service
- Input validation middleware
- Health check endpoint

# Functional Requirements
- Parse English sentences into token arrays
- Strip auxiliary words (is, am, are, the, a, etc.)
- Detect tense and prepend markers (YESTERDAY, TOMORROW, NOW)
- Rearrange S-V-O to S-O-V word order
- Apply NMM triggers for questions and negation
- Return structured gloss output

# Non-Functional Requirements
- **Performance**: Response time < 50ms for common phrases
- **Security**: Input sanitization, rate limiting
- **Error Handling**: Proper HTTP status codes
- **CORS**: Allow frontend origin

# Acceptance Criteria
- [x] Server starts without errors
- [x] POST /api/translate returns correct gloss sequences
- [x] Auxiliary words are stripped
- [x] Tense markers are applied
- [x] SOV rearrangement works
- [x] NMM triggers included in output

# Definition of Done
The task is complete only if:
- [x] Requirements implemented
- [x] Acceptance criteria satisfied
- [x] Reviewer approves
- [x] No blocking issues remain

# Deliverables
- `backend/package.json`
- `backend/server.js`
- `backend/routes/translate.js`
- `backend/services/islTranslator.js`
- `backend/middleware/validate.js`
