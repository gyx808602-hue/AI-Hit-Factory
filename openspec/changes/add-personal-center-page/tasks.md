## 1. Context Review

- [ ] 1.1 Read `openspec/config.yaml`, `openspec/project.md`, and all artifacts under `openspec/changes/add-personal-center-page/`.
- [ ] 1.2 Review `src/app/router/routeTypes.ts`, `src/app/router/routeRegistry.tsx`, `src/app/router/dynamicRoutes.ts`, and related router tests.
- [ ] 1.3 Review current page/layout patterns in `src/shared/components/PageShell.tsx` and representative pages such as `src/pages/DashboardPage.tsx`.
- [ ] 1.4 Confirm whether existing API exports in `src/api/index.ts` need a new account module export or a system user module extension.

## 2. Account Contract and Mock Data

- [ ] 2.1 Create account domain types for `PersonalCenterOverview`, profile, points, usage breakdown, security preferences, and invitation reward.
- [ ] 2.2 Add masking helpers for email and phone display, with tests covering normal, empty, short, and already-masked inputs.
- [ ] 2.3 Add account API Client functions `getPersonalCenterOverview()` and `updateGenerationReminder(enabled)`, keeping endpoint paths centralized.
- [ ] 2.4 Add React Query hooks for reading personal center overview and updating generation reminder state.
- [ ] 2.5 Provide temporary Mock data or an adapter returning `PersonalCenterOverview` while backend fields are not ready, including invite code and reward rule placeholders.

## 3. Routing and Menu Integration

- [ ] 3.1 Add `account.personalCenter` to `RouteKey`.
- [ ] 3.2 Register the personal center route in `routeRegistry` with auth required, cache enabled, icon metadata, and a reserved permission code.
- [ ] 3.3 Ensure dynamic route building can include or exclude the personal center menu based on backend menu data.
- [ ] 3.4 Add or update router tests to verify `account.personalCenter` resolves through the static registry and is hidden when absent from dynamic menu data.

## 4. Personal Center Page

- [ ] 4.1 Create `src/pages/PersonalCenterPage.tsx` as the route-level composition page.
- [ ] 4.2 Implement the top profile summary card with avatar, display name, organization name, membership or verification label, joined time, account ID, and edit entry.
- [ ] 4.3 Implement the points overview card with balance, unit, reset or validity hint, and recharge entry state.
- [ ] 4.4 Implement the usage statistics card with monthly used points, comparison trend, and breakdown progress rows.
- [ ] 4.5 Implement the security and preferences panel with masked email, masked phone, password update row, and generation reminder switch.
- [ ] 4.6 Implement the invitation reward card with invite code, copy button, inviter reward points, and friend benefit hint.
- [ ] 4.7 Add loading, error with retry, empty breakdown, invitation unavailable, and optional-field fallback states.
- [ ] 4.8 Keep page-specific cards in the account feature or page-local scope; do not promote them to `shared/components` unless a real second reuse appears.

## 5. Interaction Behavior

- [ ] 5.1 Wire the generation reminder switch to the mutation hook and show pending/disabled state while submitting.
- [ ] 5.2 Make edit profile, recharge, phone binding, and password rows use explicit placeholder behavior when real flows are not available.
- [ ] 5.3 Ensure sensitive values are masked before display even if the Mock/API returns raw email or phone.
- [ ] 5.4 Wire invitation copy behavior through the Clipboard API or a tested fallback, and show success/failure feedback.
- [ ] 5.5 Verify responsive layout: desktop top row contains profile and points cards; lower right stacks security panel and invitation card; narrow viewport stacks all cards vertically.

## 6. Tests

- [ ] 6.1 Add page tests for normal personal center rendering with complete Mock data.
- [ ] 6.2 Add tests for missing optional fields and empty usage breakdown fallback.
- [ ] 6.3 Add tests for loading and error states, including retry action visibility.
- [ ] 6.4 Add tests for email and phone masking in the security panel.
- [ ] 6.5 Add tests for generation reminder switch mutation and pending state.
- [ ] 6.6 Add tests for invitation reward rendering, disabled invitation state, and copy invite code feedback.
- [ ] 6.7 Add route registry/dynamic route tests for `account.personalCenter`.

## 7. Verification

- [ ] 7.1 Run targeted tests for personal center page, account helpers/hooks, and router integration.
- [ ] 7.2 Run `npm run typecheck`.
- [ ] 7.3 Run `cmd /c openspec validate add-personal-center-page --strict` or the project-supported OpenSpec validation command.
- [ ] 7.4 Update `doc/progress.md` with completed implementation steps, current judgment, next step, and verification result.
