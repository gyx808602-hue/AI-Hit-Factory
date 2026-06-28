# Text Image Video Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add create-page copy generation, unify image upload interaction, and improve processing-state polling for text-image-video tasks.

**Architecture:** Keep the existing text-image-video task flow intact, extend the create form with `topic + prompt`, centralize mapping logic in the feature layer, and use React Query polling only while tasks are still processing. Keep the prompt-generation call boundary isolated so a real backend endpoint can be wired in later without rewriting the page flow.

**Tech Stack:** React 19, TypeScript, Ant Design, TanStack React Query, Vitest, Testing Library

---

### Task 1: Extend text-image-video form mapping

**Files:**
- Modify: `src/features/text-image-video/form.ts`
- Test: `src/features/text-image-video/form.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions for:
- default values include `topic`
- create payload still only submits trimmed `prompt`, `model`, `imageUrls`

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/text-image-video/form.test.ts`

- [ ] **Step 3: Write minimal implementation**

Extend `TextImageVideoFormValues` and default values with `topic`, while preserving existing payload mapping.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/text-image-video/form.test.ts`

### Task 2: Add create-page failing tests for topic, copy generation, and upload flow

**Files:**
- Modify: `src/pages/ImageVideoPage.test.tsx`
- Potentially modify: `src/api/customer/text-image-video/index.test.ts`

- [ ] **Step 1: Write the failing tests**

Cover:
- topic field renders
- clicking `AI 生成文案` fills prompt
- mixed/image mode requires image before generation
- creating a task submits edited prompt and uploaded image URLs

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ImageVideoPage.test.tsx`

- [ ] **Step 3: Implement only enough API and helper surface to support the page**

Add the prompt-generation call boundary and any small helper types needed by the tests.

- [ ] **Step 4: Run test to verify it still fails for UI reasons only**

Run: `npx vitest run src/pages/ImageVideoPage.test.tsx`

### Task 3: Implement create-page topic/prompt flow and upload interaction

**Files:**
- Modify: `src/pages/ImageVideoPage.tsx`
- Modify: `src/features/text-image-video/form.ts`
- Modify: `src/api/customer/text-image-video/index.ts`
- Modify: `src/api/customer/text-image-video/types.ts`
- Test: `src/pages/ImageVideoPage.test.tsx`
- Test: `src/api/customer/text-image-video/index.test.ts`

- [ ] **Step 1: Implement prompt-generation boundary**

Add a dedicated function for prompt generation. If the backend endpoint is unavailable, return a clear error or controlled fallback result through this boundary rather than mixing logic directly into JSX.

- [ ] **Step 2: Replace manual image upload input with Upload-based interaction**

Use `antd Upload` and keep upload-success and remove behavior consistent with the video-remix flow.

- [ ] **Step 3: Add topic + prompt editing flow**

Keep `prompt` editable after generation and submit the edited value during task creation.

- [ ] **Step 4: Run focused tests**

Run: `npx vitest run src/features/text-image-video/form.test.ts src/api/customer/text-image-video/index.test.ts src/pages/ImageVideoPage.test.tsx`

### Task 4: Add polling tests for detail and list pages

**Files:**
- Modify: `src/pages/TextImageVideoTaskDetailPage.test.tsx`
- Modify: `src/pages/TextImageVideoTasksPage.test.tsx`

- [ ] **Step 1: Write failing polling tests**

Cover:
- detail query polls while status is processing
- detail query stops polling on success/failure
- list query polls when at least one task is processing

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/TextImageVideoTasksPage.test.tsx`

### Task 5: Implement polling and progress display refinement

**Files:**
- Modify: `src/pages/TextImageVideoTaskDetailPage.tsx`
- Modify: `src/pages/TextImageVideoTasksPage.tsx`
- Potentially modify: `src/features/text-image-video/status.ts`
- Test: `src/pages/TextImageVideoTaskDetailPage.test.tsx`
- Test: `src/pages/TextImageVideoTasksPage.test.tsx`

- [ ] **Step 1: Add detail-page polling**

Use `refetchInterval` only while the task is still processing.

- [ ] **Step 2: Add list-page polling**

Only keep polling while the current list contains processing tasks.

- [ ] **Step 3: Refine progress presentation**

Make progress visibility clearer without restructuring the whole page.

- [ ] **Step 4: Run focused tests**

Run: `npx vitest run src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/TextImageVideoTasksPage.test.tsx`

### Task 6: Verify, document, and summarize

**Files:**
- Modify: `doc/2026-06-28-text-image-video-optimization-progress.md`

- [ ] **Step 1: Run the relevant verification suite**

Run: `npx vitest run src/features/text-image-video/form.test.ts src/api/customer/text-image-video/index.test.ts src/pages/ImageVideoPage.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/TextImageVideoTasksPage.test.tsx`

- [ ] **Step 2: Run type checking**

Run: `npm run typecheck`

- [ ] **Step 3: Update progress documentation**

Record what was implemented, what remains constrained by backend contracts, and the exact verification results.
