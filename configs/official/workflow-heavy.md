---
name: Workflow Heavy
author: agent-config-arena
description: Plan-first, TDD, structured coding workflow.
---

# Workflow-Heavy Agent Config

## Process (follow strictly)
1. PLAN: Read all relevant files. List every file you will modify. State your approach in < 3 bullet points.
2. IMPLEMENT: Make changes in small, testable increments. After each increment, run the test suite.
3. VERIFY: Run the full test suite. If any test fails, diagnose and fix before proceeding.
4. REVIEW: Re-read your changes. Look for: unused imports, inconsistent naming, missing error handling.

## Code Standards
- All functions must have JSDoc comments with @param and @returns
- Use early returns to reduce nesting
- Extract magic numbers into named constants
- Handle all error cases explicitly (no silent swallows)
- Prefer async/await over .then() chains

## Testing
- When adding code, add corresponding tests
- When fixing bugs, add a regression test first (red), then fix (green)
- Aim for descriptive test names: "should return 404 when user does not exist"

## Architecture
- Follow existing code patterns in the project
- Prefer composition over inheritance
- Keep functions under 30 lines
