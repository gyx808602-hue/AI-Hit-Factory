## 1. Baseline And Scope

- [x] 1.1 Read `AGENTS.md`, `openspec/project.md`, this change's `proposal.md`, `design.md`, and `specs/ui-preferences/spec.md` before implementation.
- [x] 1.2 Confirm current theme and layout hardcoded sources in `src/app/App.tsx`, `src/app/styles.css`, and `src/app/layouts/DashboardLayout.tsx`.
- [x] 1.3 Confirm Redux Toolkit and React Redux are not already installed before adding dependencies.

## 2. Redux Toolkit Foundation

- [x] 2.1 Install `@reduxjs/toolkit` and `react-redux`.
- [x] 2.2 Add `src/app/store.ts` with the app store and exported `RootState` / `AppDispatch` types.
- [x] 2.3 Add typed Redux hooks, such as `src/app/hooks.ts`.
- [x] 2.4 Wrap the existing app tree with React Redux `Provider` in `src/app/main.tsx` while preserving React Query and Router behavior.

## 3. UI Preferences Slice

- [x] 3.1 Add `src/features/ui-preferences/slice.ts` with default theme palette, surface, text, and layout preferences copied from the current hardcoded values.
- [x] 3.2 Add actions for setting theme colors, resetting theme, setting sidebar collapsed, and toggling sidebar collapsed.
- [x] 3.3 Add selectors for raw theme state, Ant Design theme config, CSS variable map, and sidebar collapsed.
- [x] 3.4 Add reducer and selector tests covering default values and actions.

## 4. Theme Integration

- [x] 4.1 Refactor `src/app/App.tsx` so `ConfigProvider.theme` is derived from Redux selectors instead of hardcoded token literals.
- [x] 4.2 Add a small theme CSS variable sync hook or component that writes Redux theme values to `document.documentElement.style`.
- [x] 4.3 Replace custom hardcoded brand colors in layout gradients or active menu styles with CSS variables where appropriate.
- [x] 4.4 Keep the existing visual appearance unchanged after migration.

## 5. Layout Integration

- [x] 5.1 Refactor `src/app/layouts/DashboardLayout.tsx` to read `sidebarCollapsed` from Redux.
- [x] 5.2 Replace local `useState` toggle with `toggleSidebarCollapsed()` dispatch.
- [x] 5.3 Preserve current collapsed width, expanded width, menu title tooltip, and accessibility labels.
- [x] 5.4 Add or adjust layout tests for Redux-backed collapse behavior.

## 6. Verification

- [x] 6.1 Run targeted tests for `ui-preferences`, `App`, and `DashboardLayout`.
- [x] 6.2 Run `npm run typecheck`.
- [x] 6.3 Run `cmd /c openspec validate add-redux-ui-preferences --strict`.
- [x] 6.4 Update `doc/progress.md` with completed work, current judgment, next step, and verification result.
