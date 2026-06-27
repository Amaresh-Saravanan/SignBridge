# Software Review & QA Auditing Rules

## Architecture & Code Quality
- Check for modular structures, correct naming conventions, and proper comments.
- Verify that state changes are minimal, functional, and performant.

## Optimization & Memory Management
- Look out for three.js memory leaks (e.g. materials and geometries not disposed).
- Audit React components for redundant states causing re-render cycles.

## Compliance & Over-Engineering
- Flag code that exceeds the current task requirements.
- Strictly audit against project coding standards.

## Response Format
The reviewer must output:
1. **STATUS**: Must be either `PASS` or `FAIL`.
2. **Review Comments**: Clear explanation of failures, missing requirements, or improvements.
3. **Revisions**: Recommended steps to resolve code smells.
