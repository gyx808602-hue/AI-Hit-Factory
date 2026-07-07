## 1. Baseline Audit And Scope Confirmation

- [x] 1.1 Read `AGENTS.md`, `openspec/config.yaml`, `openspec/project.md`, and all artifacts in `openspec/changes/add-route-keepalive-and-component-quality/`.
- [x] 1.2 Read `doc/2026-07-07-page-component-cache-progress.md` and `doc/2026-07-07-project-structure-review-progress.md` to reuse prior cache and component boundary decisions.
- [x] 1.3 Inspect `src/app/App.tsx`, `src/app/layouts/DashboardLayout.tsx`, `src/app/router/routeRegistry.tsx`, `src/app/router/dynamicRoutes.ts`, and `src/app/router/routeTypes.ts`.
- [x] 1.4 Record current large page/component line counts for `src/pages/**/*.tsx` and `src/features/**/*components*.tsx`.
- [x] 1.5 Confirm this change does not introduce new dependencies, new backend APIs, or new global state libraries.

## 2. Route KeepAlive Tests

- [x] 2.1 Add a focused test component that records mount counts for a cache-enabled route and a cache-disabled route.
- [x] 2.2 Add a test proving `meta.cache: true` keeps the page instance alive when navigating away and back.
- [x] 2.3 Add a test proving `meta.cache: false` routes unmount normally and do not preserve stale local state.
- [x] 2.4 Add a test proving cache matching uses runtime `availableRoutes` metadata, including dynamic route `keepAlive` mapping.
- [x] 2.5 Add a test proving logout or auth context reset clears protected page caches.

## 3. Route KeepAlive Implementation

- [x] 3.1 Add a lightweight keep-alive outlet module under `src/app/router`, using `useOutlet`, `useLocation`, and runtime route matching.
- [x] 3.2 Use `route.key` as the cache key and `route.meta.cache` as the cache switch.
- [x] 3.3 Hide inactive cached pages with stable layout styles while keeping them mounted.
- [x] 3.4 Expose cache clearing helpers for removing one route key and clearing all route caches, without implementing full tagsView UI.
- [x] 3.5 Refactor protected route rendering in `App.tsx` into a layout route structure that renders `DashboardLayout` plus the keep-alive outlet.
- [x] 3.6 Keep public routes, login redirect, 403, 404, route guard logic, active menu highlighting, and dynamic menu loading behavior unchanged.
- [x] 3.7 Clear cached protected pages when the user logs out or when available route identity changes materially.

## 4. Component Quality Baseline

- [x] 4.1 Scan current page and feature components for files that remain hard to understand after the previous structure split.
- [x] 4.2 Classify each candidate issue as one of: missing component description, too many responsibilities, repeated UI pattern, native control, excessive props, or misplaced shared/feature boundary.
- [x] 4.3 Choose the first small optimization batch, limited to at most two pages or feature modules.
- [x] 4.4 Confirm no one-off business component is promoted to `shared/components` without proven reuse.

## 5. Component Description And Boundary Notes

- [x] 5.1 Add concise Chinese file-level responsibility notes to `src/features/digital-human/components.tsx`.
- [x] 5.2 Add concise Chinese file-level responsibility notes to `src/features/digital-human/audio/components.tsx`.
- [x] 5.3 Add concise Chinese file-level responsibility notes to `src/features/digital-human/video/components/listComponents.tsx`.
- [x] 5.4 Add concise Chinese file-level responsibility notes to `src/features/points/components.tsx`.
- [x] 5.5 Add concise Chinese file-level responsibility notes to `src/features/text-image-video/components.tsx`.
- [x] 5.6 Add concise Chinese file-level responsibility notes to `src/features/video-remix/components/detailComponents.tsx`.
- [x] 5.7 Ensure comments explain ownership and Why, not obvious assignments.

## 6. First Component Quality Optimization Batch

- [x] 6.1 Select one high-value page or feature module from the baseline audit, prioritizing readability and user-facing quality.
- [x] 6.2 Add or preserve targeted tests for that module before editing.
- [x] 6.3 Extract only stable sections such as filters, list panels, upload preview, status mapping, or detail drawers.
- [x] 6.4 Keep API calls, React Query hooks, route params, mutations, and permission-sensitive flow in the page/container boundary.
- [x] 6.5 Prefer Ant Design controls for primary interactions and Tailwind for layout only.
- [x] 6.6 Re-run targeted tests for the optimized module.

## 7. Verification

- [x] 7.1 Run route keep-alive targeted tests.
- [x] 7.2 Run targeted tests for every component quality batch changed.
- [x] 7.3 Run `cmd /c npm run typecheck`.
- [x] 7.4 Run `cmd /c openspec validate add-route-keepalive-and-component-quality --strict`.
- [x] 7.5 Update `doc/2026-07-07-page-component-cache-progress.md` or a new专题 progress document with completed work, current judgment, next step, and verification result.
- [x] 7.6 Update `doc/progress.md` when safe to append without damaging existing encoding; otherwise record why the专题 document is used.
