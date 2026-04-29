# Файл: .agents/workflows/debug.md

# Automated Engine Debugging Workflow

**Description:** Activates when the user provides an error message, stack trace, or describes anomalous game behavior. Act as a Senior QA/Debug Engineer. Do not guess blindly.

## Step 1: Analysis and Classification
Analyze the provided logs or stack trace. Determine the failing layer: Frontend (React/Three.js), Backend (Node.js), State Logic (Zustand/Context), or Shaders (GLSL). Wait for user confirmation if the log is incomplete.

## Step 2: Contract and Dependency Check
Verify TypeScript interfaces. Check if the error is caused by accessing an object that has been garbage collected or a component that has been unmounted.

## Step 3: Hypothesis Generation (Chain of Thought)
Output 2-3 brief, technical hypotheses about the root cause of the bug. Ask the user to run `console.log` on specific variables if more context is needed to validate the hypothesis.

## Step 4: Safe Implementation
Propose the fixed code block. 
- **CRITICAL:** Do NOT rewrite the entire file. Provide only the modified function or block.
- Ensure the fix respects the Three.js object lifecycle (no memory leaks).
- Add brief comments explaining the "why" behind the fix.

## Step 5: Validation Strategy
Provide the user with specific manual testing steps or generate a unit test script to verify the isolated logic in the browser console.
