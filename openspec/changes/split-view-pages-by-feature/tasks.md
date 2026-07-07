## 1. Baseline Audit And Scope Confirmation

- [x] 1.1 Read `AGENTS.md`, `openspec/config.yaml`, `openspec/project.md`, and all artifacts in `openspec/changes/split-view-pages-by-feature/` before implementation.
- [x] 1.2 Record page complexity baseline with `Get-ChildItem -File src\pages\*.tsx | Select-Object Name,@{Name='Lines';Expression={(Get-Content -LiteralPath $_.FullName).Count}} | Sort-Object Lines -Descending`.
- [x] 1.3 For the top large pages, identify responsibilities currently mixed in each file: route composition, query/mutation, form state, modal UI, list/card rendering, upload preview, status mapping, and local utilities.
- [x] 1.4 Confirm overlap with `optimize-ui-component-consistency`; this change handles file/function decomposition, while UI component consistency remains responsible for Ant Design replacement and visual interaction consistency.

## 2. Decomposition Rules And Target Structure

- [x] 2.1 Define `src/pages` target domain folders: `auth`, `workspace`, `content`, `digital-human`, `points`, and `system`.
- [x] 2.2 Map every current `src/pages/*Page.tsx` and related page test to a target domain folder before moving files.
- [x] 2.3 Define the internal decomposition batch order after page folder migration, prioritizing `VideoRemixTaskDetailPage.tsx`, `DigitalHumanVideoTasksPage.tsx`, `CustomisedAudiosPage.tsx`, and `DigitalHumansPage.tsx`.
- [x] 2.4 For each target page, decide exact feature destination paths before editing, such as `src/features/video-remix/components/*` or `src/features/digital-human/audio/components/*`.
- [x] 2.5 Avoid creating empty directories; create a directory only when the first real component/test file is added.
- [x] 2.6 Do not promote components to `shared` unless at least two real feature scenarios reuse them and the component has no domain dependency.

## 3. Pages Folder Domain Migration

- [x] 3.1 Move auth/system/workspace pages into domain folders, for example `LoginPage.tsx` -> `src/pages/auth/LoginPage.tsx`, `ForbiddenPage.tsx` and `NotFoundPage.tsx` -> `src/pages/system/`.
- [x] 3.2 Move content generation pages into `src/pages/content/`, including product video, viral remix, video remix task pages, image/video, and text-image-video task pages.
- [x] 3.3 Move digital human pages into `src/pages/digital-human/`, including digital humans, detail, customised audios, digital human video task list, and detail pages.
- [x] 3.4 Move points pages into `src/pages/points/`.
- [x] 3.5 Update `src/app/router/routeRegistry.tsx` lazy import paths without changing route `path`, `key`, `meta`, `cache`, `activeMenuKey`, or permission behavior.
- [x] 3.6 Update page test locations or imports so tests remain close to their moved page files.
- [x] 3.7 Run route registry and basic page import tests after migration.

## 4. Test Baseline Before Internal Code Movement

- [x] 4.1 Add or preserve regression tests for `VideoRemixTaskDetailPage.tsx` covering step navigation, upload trigger, preview removal, save, prompt generation, and video generation actions.
- [x] 4.2 Add or preserve regression tests for list pages covering filter, refresh, pagination, empty state, delete/confirm flow, and status display.
- [x] 4.3 Keep user-facing text queries, accessible names, and necessary `data-testid` stable so tests verify behavior instead of implementation details.

## 5. Page-by-Page Internal Decomposition

- [x] 5.1 Decompose `VideoRemixTaskDetailPage.tsx`: extract step navigation, upload trigger, asset preview grid, video preview card, and step action bar into `src/features/video-remix/components`.
- [x] 5.2 Keep `VideoRemixTaskDetailPage.tsx` responsible for route params, page-level query/mutation hooks, draft persistence, payload mapping coordination, and final section composition.
- [x] 5.3 Decompose `DigitalHumanVideoTasksPage.tsx`: extract task filters, metric summary, task card/list section, pagination shell, and empty/error/loading state into `src/features/digital-human-video/components` where appropriate.
- [x] 5.4 Decompose `CustomisedAudiosPage.tsx`: move audio form modal, upload trigger, audio card/list section, form values/validation/payload mapping, and status metadata into `src/features/digital-human/audio`.
- [x] 5.5 Decompose `DigitalHumansPage.tsx`: move create modal, local upload preview, digital human card/list section, filter controls, form/status helpers into `src/features/digital-human`.
- [x] 5.6 Decompose `PointsUsageStatisticsPage.tsx` only after the first four pages are stable; move statistics filters, metric summary, and usage list/table pieces into `src/features/points`.
- [x] 5.7 Decompose `ImageVideoPage.tsx` and related task pages only after confirming text-image-video feature boundaries and existing tests.

## 6. Import, Naming, And Cleanup

- [x] 6.1 Use clear component names that describe business responsibility, such as `AudioFormModal`, `DigitalHumanCardGrid`, `VideoRemixStepActions`, not vague names like `BasePanel`.
- [x] 6.2 Keep relative imports readable and avoid circular imports between page and feature modules.
- [x] 6.3 Remove page-local helper functions only after their feature replacements are imported and covered by tests.
- [x] 6.4 Update tests and snapshots/imports to follow moved files without changing expected user behavior.

## 7. Verification And Documentation

- [x] 7.1 Run targeted tests for every changed page and extracted feature component.
- [x] 7.2 Run `npm run typecheck`.
- [x] 7.3 Run `cmd /c openspec validate split-view-pages-by-feature --strict`.
- [x] 7.4 Record completed work, current judgment, next step, and verification result in `doc/progress.md` after each implementation batch.
- [x] 7.5 Before requesting archive, confirm no page was split into excessive wrappers and no one-off business component was incorrectly promoted to `shared`.
