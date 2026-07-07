## ADDED Requirements

### Requirement: Pages directory shall be grouped by business domain

`src/pages` SHALL organize route page files by shallow business-domain directories instead of keeping all route pages flat at the root level.

#### Scenario: Moving flat page files into domain folders

- **GIVEN** route page files such as login, content generation, digital human, points, workspace, and system pages are currently stored directly under `src/pages`
- **WHEN** page organization is implemented
- **THEN** each page MUST be moved into a matching domain folder such as `auth`, `content`, `digital-human`, `points`, `workspace`, or `system`
- **AND** the route URL, route key, route meta, permission behavior, and menu highlight behavior MUST remain unchanged

### Requirement: Page files shall remain route-level composition units

`src/pages/**/*.tsx` page files SHALL primarily act as route-level composition units and SHALL NOT accumulate stable business sections, modal implementations, form mapping, status mapping, or repeated card/list rendering when those responsibilities can be assigned to a feature module.

#### Scenario: Extracting a page-owned business section

- **GIVEN** a page file contains a stable business section such as a filter bar, task card grid, form modal, upload preview, or step action bar
- **WHEN** the section has clear domain meaning or significantly increases page reading cost
- **THEN** the section MUST be extracted to the matching `src/features/<module>` area
- **AND** the page MUST keep only the props and callbacks needed to compose that section

### Requirement: Feature modules shall own domain-specific view functionality

Domain-specific view functionality SHALL be placed under the closest matching `src/features/<module>` module before considering `src/shared`.

#### Scenario: Audio page modal decomposition

- **GIVEN** `CustomisedAudiosPage.tsx` contains audio-specific create/edit modal, upload trigger, card rendering, and status mapping
- **WHEN** the page is decomposed
- **THEN** audio-specific components MUST be placed under `src/features/digital-human/audio`
- **AND** audio form values, validation, payload mapping, and status metadata MUST remain near the audio feature rather than in `src/shared`

### Requirement: Shared components shall only contain stable cross-feature UI

`src/shared/components` SHALL only receive components that are business-agnostic, stable, and reused by at least two real feature scenarios.

#### Scenario: Avoiding premature shared abstraction

- **GIVEN** a component is used by only one page or depends on domain-specific status, payload, API, or copywriting
- **WHEN** extracting page logic
- **THEN** the component MUST stay inside the relevant feature module or page-local scope
- **AND** it MUST NOT be promoted to `src/shared/components`

### Requirement: Decomposition shall preserve runtime behavior

Page decomposition SHALL preserve route paths, route meta, permission behavior, API Client contracts, React Query key semantics, mutation side effects, cache behavior, and user-visible workflows.

#### Scenario: Updating route registry imports after page movement

- **GIVEN** a page file is moved from `src/pages/FooPage.tsx` to `src/pages/<domain>/FooPage.tsx`
- **WHEN** `src/app/router/routeRegistry.tsx` lazy imports are updated
- **THEN** the imported component MUST be equivalent
- **AND** existing route paths and route metadata MUST NOT change
- **AND** route registry tests MUST pass

#### Scenario: Splitting a task detail page

- **GIVEN** `VideoRemixTaskDetailPage.tsx` is split into smaller components
- **WHEN** step navigation, upload, material preview, prompt generation, save, and video generation controls are extracted
- **THEN** existing route params, query/mutation hooks, payload mapping, draft persistence, and user-visible button behavior MUST remain equivalent
- **AND** targeted regression tests MUST pass after extraction

### Requirement: Decomposition shall be test-backed and measurable

Each decomposition batch SHALL include a measurable baseline, targeted tests, and verification commands.

#### Scenario: Completing a decomposition batch

- **GIVEN** a page or feature decomposition batch is implemented
- **WHEN** the batch is considered complete
- **THEN** the implementer MUST record the before/after page responsibility or line-count baseline
- **AND** run targeted tests for changed pages/components
- **AND** run `npm run typecheck` before marking the OpenSpec task complete
