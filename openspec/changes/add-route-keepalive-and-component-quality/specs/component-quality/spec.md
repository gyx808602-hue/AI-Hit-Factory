## ADDED Requirements

### Requirement: Page Files Stay At Route Composition Level
The system SHALL keep page files focused on route-level composition, state coordination, hooks invocation, and final layout assembly.

#### Scenario: Page delegates stable UI sections
- **WHEN** a page contains stable sections such as filters, metric summaries, list panels, upload preview grids, or detail drawers
- **THEN** those sections MUST be eligible for feature-level extraction when extraction lowers reading cost without changing behavior

#### Scenario: Page does not hide business flow inside generic UI
- **WHEN** a page coordinates API hooks, mutations, navigation, route params, or permission-sensitive behavior
- **THEN** that flow MUST remain visible at the page or feature container boundary and MUST NOT be buried in a vague shared wrapper

### Requirement: Feature Components Declare Responsibility
The system SHALL add concise Chinese responsibility notes to feature component modules when the file owns non-trivial business UI.

#### Scenario: Feature component file explains its boundary
- **WHEN** a feature component module contains multiple exported business components or domain-specific mapping logic
- **THEN** the module MUST include a short Chinese note explaining what it owns, what the page still owns, and why it remains under `features/<module>`

#### Scenario: Comments explain why, not obvious assignments
- **WHEN** adding comments to component code
- **THEN** comments MUST explain boundaries, trade-offs, or non-obvious behavior and MUST NOT narrate simple assignments

### Requirement: Shared Components Require Proven Reuse
The system SHALL promote a component to `shared/components` only after it has stable reuse across at least two real feature scenarios and no domain dependency.

#### Scenario: Domain-specific component stays in feature
- **WHEN** a component depends on digital human, points, text-image-video, video remix, or other domain fields and copy
- **THEN** it MUST stay in the corresponding `features/<module>` area

#### Scenario: Stable generic component can move to shared
- **WHEN** a component is reused by at least two feature modules and only depends on generic UI props
- **THEN** it MAY be moved to `shared/components` with focused tests and clear props

### Requirement: Component Extraction Avoids Over-Wrapping
The system SHALL avoid creating wrapper components that add no stable behavior, no clear business meaning, and no meaningful reduction in page complexity.

#### Scenario: One-off simple JSX remains local
- **WHEN** a JSX block is simple, used once, and does not hide complex interaction
- **THEN** it MUST remain local instead of being extracted only to reduce line count

#### Scenario: Extracted component has clear name
- **WHEN** a UI block is extracted
- **THEN** its component name MUST describe a business responsibility such as `DigitalHumanFilters`, `PointsUsageRecordsPanel`, or `VideoRemixStepActions`

### Requirement: Component Complexity Is Audited In Batches
The system SHALL audit oversized pages and feature component files in small batches before changing them.

#### Scenario: Oversized file is reviewed before edits
- **WHEN** a page or feature component file is large enough to make responsibilities hard to understand
- **THEN** the implementation MUST first identify the mixed responsibilities and choose a small extraction target before editing

#### Scenario: Verification follows each optimization batch
- **WHEN** a component quality batch is completed
- **THEN** targeted tests, typecheck, and progress documentation MUST be updated before starting the next batch

### Requirement: UI Components Prefer Ant Design For Primary Controls
The system SHALL use Ant Design components for primary form controls, buttons, uploads, tables, pagination, modal/drawer interactions, loading, empty, and error states where Ant Design fits the interaction.

#### Scenario: Primary interaction uses Ant Design
- **WHEN** a user-facing interaction is a standard button, input, select, table, upload, modal, drawer, confirmation, empty state, or loading state
- **THEN** the implementation MUST prefer the corresponding Ant Design component instead of raw HTML controls

#### Scenario: Tailwind remains layout-focused
- **WHEN** applying TailwindCSS in component optimization
- **THEN** Tailwind MUST primarily control layout, spacing, responsive grids, and outer containers rather than replacing Ant Design interaction behavior
