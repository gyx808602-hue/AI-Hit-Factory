## 1. Context Review

- [ ] 1.1 Read `openspec/config.yaml`, `openspec/project.md`, and all artifacts under `openspec/changes/add-personal-center-page/`.
- [ ] 1.2 Review the supplemented `proposal.md` and confirm the implementation priority: complete the personal center page first, then adapt real backend interfaces after fields are confirmed.
- [ ] 1.3 Review `src/app/router/routeTypes.ts`, `src/app/router/routeRegistry.tsx`, `src/app/router/dynamicRoutes.ts`, and related route tests.
- [ ] 1.4 Review `src/app/layouts/DashboardLayout.tsx` to confirm where the personal center entry should be placed: user dropdown, sidebar bottom entry, or the closest existing navigation pattern.
- [ ] 1.5 Review current page/layout patterns in `src/shared/components/PageShell.tsx` and representative pages such as `src/pages/DashboardPage.tsx`.
- [ ] 1.6 Confirm whether API exports should use a new account domain module or extend an existing system user module, while avoiding page-level URL concatenation.

## 2. Account View Model and Mock Contract

- [ ] 2.1 Create account domain types for `PersonalCenterOverview`, including profile, points, usage breakdown, security preferences, and invitation reward fields.
- [ ] 2.2 Add placeholder fields for future backend mapping: invite code, invite link, invite reward points, friend benefit hint, recharge availability, and reminder preference state.
- [ ] 2.3 Add email and phone masking helpers, with tests covering normal, empty, short, malformed, and already-masked inputs.
- [ ] 2.4 Add account API Client functions `getPersonalCenterOverview()` and `updateGenerationReminder(enabled)`, keeping endpoint paths centralized and replaceable.
- [ ] 2.5 Add React Query hooks for reading personal center overview and updating generation reminder state.
- [ ] 2.6 Provide temporary Mock data or an adapter returning `PersonalCenterOverview` while backend fields are not ready.
- [ ] 2.7 Keep the page consuming only `PersonalCenterOverview`; do not let JSX depend directly on guessed backend field names.

## 3. Routing and Entry Integration

- [ ] 3.1 Add `account.personalCenter` to `RouteKey`.
- [ ] 3.2 Register the personal center route in `routeRegistry` with `requiresAuth: true`, `cache: true`, icon metadata, and reserved permission code `account:personal-center:view`.
- [ ] 3.3 Ensure dynamic route building can include or exclude the personal center menu based on backend menu data.
- [ ] 3.4 Add a personal center navigation entry according to the existing layout pattern: preferred user dropdown entry if already available, otherwise sidebar bottom icon/button entry.
- [ ] 3.5 Ensure the personal center entry navigates to the registered route without breaking existing sidebar active state, settings entry, or help/support entry.
- [ ] 3.6 Add or update tests verifying `account.personalCenter` resolves through the static registry and is hidden when absent from dynamic menu data.
- [ ] 3.7 Add or update layout/navigation tests for the personal center jump entry.

## 4. Personal Center Page Layout

- [ ] 4.1 Create `src/pages/PersonalCenterPage.tsx` as the route-level composition page.
- [ ] 4.2 Implement the top profile summary card with avatar, display name, organization name, membership or verification label, joined time, account ID, and edit profile entry.
- [ ] 4.3 Implement the points overview card with balance, unit, reset or validity hint, progress accent, and recharge entry state.
- [ ] 4.4 Implement the usage statistics card with monthly used points, comparison trend, and video/audio/script breakdown progress rows.
- [ ] 4.5 Implement the security and preferences panel with masked email, masked phone, password update row, and generation reminder switch.
- [ ] 4.6 Implement the invitation reward card with invite code, copy button, inviter reward points, and friend benefit hint.
- [ ] 4.7 Match the supplied dark SaaS visual style while reusing the existing app tokens, spacing style, `PageShell`, and icon library.
- [ ] 4.8 Keep page-specific cards in the account feature or page-local scope; do not promote them to `shared/components` unless a real second reuse appears.

## 5. Page States and Interactions

- [ ] 5.1 Add loading state using skeleton or stable placeholders for the profile, points, usage, security, and invitation sections.
- [ ] 5.2 Add error state with retry action when the overview query fails.
- [ ] 5.3 Add optional-field fallbacks for missing avatar, organization name, membership label, joined time, usage breakdown, invite code, and reward hints.
- [ ] 5.4 Wire the generation reminder switch to the mutation hook and show pending/disabled state while submitting.
- [ ] 5.5 Make edit profile, recharge, phone binding, and password rows use explicit placeholder behavior when real flows are not available.
- [ ] 5.6 Wire invitation copy behavior through the Clipboard API or a tested fallback, and show success/failure feedback.
- [ ] 5.7 Ensure sensitive values are masked before display even if the Mock/API returns raw email or phone.
- [ ] 5.8 Verify responsive layout: desktop top row contains profile and points cards; lower right stacks security panel and invitation card; narrow viewport stacks all cards vertically.

## 6. Backend Placeholder Boundary

- [ ] 6.1 Keep real backend integration out of scope until endpoint paths and response fields are confirmed.
- [ ] 6.2 Add comments or adapter naming that clearly marks Mock/placeholder mapping as temporary contract glue, not final backend semantics.
- [ ] 6.3 Ensure later real API integration can be completed by changing the API adapter layer without rewriting the page components.
- [ ] 6.4 Do not implement invitation attribution, reward settlement, payment recharge, edit profile submission, phone binding, or password change backend flows in this change.

## 7. Tests

- [ ] 7.1 Add page tests for normal personal center rendering with complete Mock data.
- [ ] 7.2 Add tests for missing optional fields and empty usage breakdown fallback.
- [ ] 7.3 Add tests for loading and error states, including retry action visibility.
- [ ] 7.4 Add tests for email and phone masking in the security panel.
- [ ] 7.5 Add tests for generation reminder switch mutation and pending state.
- [ ] 7.6 Add tests for invitation reward rendering, disabled invitation state, and copy invite code success/failure feedback.
- [ ] 7.7 Add route registry and dynamic route tests for `account.personalCenter`.
- [ ] 7.8 Add navigation entry tests for the chosen personal center jump entry.
- [ ] 7.9 Add responsive/layout smoke coverage where the current test stack supports it; otherwise document manual viewport verification steps.

## 8. Verification and Documentation

- [ ] 8.1 Run targeted tests for personal center page, account helpers/hooks, route integration, and navigation entry.
- [ ] 8.2 Run `npm run typecheck`.
- [ ] 8.3 Run `cmd /c openspec validate add-personal-center-page --strict`.
- [ ] 8.4 Update `doc/progress.md` with completed implementation steps, current judgment, next step, and verification result.
- [ ] 8.5 If frontend verification reveals unrelated historical failures, record exact failing files and keep personal center targeted test results separate.
