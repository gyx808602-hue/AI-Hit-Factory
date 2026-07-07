## 1. Baseline Audit And Guardrails

- [ ] 1.1 Read `AGENTS.md`, `openspec/project.md`, this change's `proposal.md`, `design.md`, and `specs/ui-component-consistency/spec.md` before implementation.
- [ ] 1.2 Run `rg -n '<button|<input|<select|<textarea|<table|role=\"button\"|cursor-pointer' src/pages src/shared src/features` and record the remaining native primary interaction targets.
- [ ] 1.3 Run `Get-ChildItem src/pages -Filter *.tsx | Select-Object Name,@{Name='Lines';Expression={(Get-Content $_.FullName | Measure-Object -Line).Lines}} | Sort-Object Lines -Descending` to confirm page complexity baseline.
- [ ] 1.4 Confirm no new UI dependency is needed; continue using Ant Design, Tailwind and lucide-react only.

## 2. Shared Lightweight Components

- [ ] 2.1 Add focused tests for a reusable Ant Design based upload trigger/field that preserves `beforeUpload`, loading feedback, accepted file types, `data-testid`, and API Client driven upload.
- [ ] 2.2 Implement the upload trigger/field in `src/shared/components` only if it is reused by at least two pages; otherwise place it in the relevant feature/page module.
- [ ] 2.3 Add a lightweight delete confirmation button or helper based on Ant Design `Popconfirm`/`Button`, covering danger styling, loading, confirm text, cancel text, and accessible name.
- [ ] 2.4 Add or refine an async state display helper only if it reduces repeated loading/empty/error blocks across at least two list pages.

## 3. Native Control Replacement

- [ ] 3.1 Replace user-facing native `button` usage in `DashboardPage.tsx` with Ant Design `Button`, preserving navigation/actions and visual hierarchy.
- [ ] 3.2 Replace user-facing native `button` usage in `AssetLibraryPage.tsx` with Ant Design `Button`; keep `aria-label` for icon-only actions.
- [ ] 3.3 Replace user-facing native file input patterns in `ViralRemixPage.tsx`, `ProductVideoPage.tsx`, `DigitalHumansPage.tsx`, and `CustomisedAudiosPage.tsx` with Ant Design `Upload` or the approved upload wrapper where behavior matches.
- [ ] 3.4 Replace `window.confirm` delete flows in digital human and customised audio list pages with Ant Design confirmation UI while keeping delete mutation behavior unchanged.

## 4. Repeated List And Card Patterns

- [ ] 4.1 Compare `DigitalHumansPage.tsx`, `CustomisedAudiosPage.tsx`, and `DigitalHumanVideoTasksPage.tsx` for repeated metric, filter, card grid, empty state, and pagination layout.
- [ ] 4.2 Extract only stable repeated shell pieces, such as card grid pagination container or async list state, without forcing card content into a generic configuration object.
- [ ] 4.3 Ensure each list page keeps loading, empty, error, pagination, refresh, delete, and status display behavior covered by tests.

## 5. Video Remix Detail Page Decomposition

- [ ] 5.1 Add regression tests for current `VideoRemixTaskDetailPage.tsx` step navigation, upload triggers, material preview removal, save action, prompt generation, and video generation buttons before extraction.
- [ ] 5.2 Extract pure UI components from `VideoRemixTaskDetailPage.tsx`, starting with `StepNavigation`, `StepActions`, `UploadTrigger`, `AssetPreviewGrid`, and `VideoPreviewCard`.
- [ ] 5.3 Keep React Query keys, API calls, form mapping, draft persistence, mutation behavior, and route params in the page/container layer.
- [ ] 5.4 Re-run detail page tests after each extraction batch to confirm behavior did not change.

## 6. Verification

- [ ] 6.1 Run targeted tests for changed pages and shared components.
- [ ] 6.2 Run `npm run typecheck`.
- [ ] 6.3 Run `cmd /c openspec validate optimize-ui-component-consistency --strict`.
- [ ] 6.4 Update `doc/progress.md` with completed work, current judgment, next step, and verification result.
