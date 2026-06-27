# Backend & Translation API Guidelines

## Codebase Architecture
- Use Node.js and Express to build modular, route-controlled backend APIs.
- Separate route parameters, controllers, and service handlers clearly.

## Input Validation & Security
- Use validation middleware (e.g. Zod or Joi schemas) to check body params.
- Escape outputs and handle exceptions gracefully with standard HTTP error codes.
- Guard private routes (like admin portals) with JSON Web Tokens (JWT) or secure session parameters.

## Translation Pipeline
- Implement the translation service to convert sentences to sequential sign language tokens (glosses).
- Cache common phrase mappings to speed up response times.
