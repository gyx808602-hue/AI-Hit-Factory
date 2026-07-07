## ADDED Requirements

### Requirement: Ant Design primary interactions

The system SHALL use Ant Design components for primary interactive controls in new or optimized pages when Ant Design provides an equivalent component.

#### Scenario: Replace native primary buttons

- **WHEN** a page contains a native `button` used for navigation, submit, delete, download, upload, or step switching
- **THEN** the optimized implementation SHALL use Ant Design `Button` or a lightweight wrapper based on Ant Design `Button`

#### Scenario: Replace native file input trigger

- **WHEN** a page exposes file upload as a user-facing interaction
- **THEN** the optimized implementation SHALL use Ant Design `Upload` or `Upload.Dragger` while preserving the project API Client upload flow

### Requirement: Lightweight reusable UI wrappers

The system SHALL introduce lightweight reusable UI wrappers only for stable combinations that appear in at least two real pages or encapsulate non-trivial interaction behavior.

#### Scenario: Upload wrapper qualifies for reuse

- **WHEN** two or more pages repeat `Upload` configuration with `beforeUpload`, hidden file input compatibility, upload loading, and uploaded result feedback
- **THEN** the implementation SHALL extract a focused upload wrapper in a feature or shared component location according to reuse scope

#### Scenario: Avoid wrapper without semantic value

- **WHEN** a proposed wrapper only renames an Ant Design component without adding stable behavior, business semantics, or repeated layout
- **THEN** the implementation MUST keep direct Ant Design usage instead of adding the wrapper

### Requirement: Consistent async feedback states

The system SHALL show consistent loading, empty, error, disabled, and success/failure feedback for list, upload, submit, refresh, generate, and delete interactions.

#### Scenario: Async submit prevents duplicate action

- **WHEN** a user triggers an async create, save, upload, generate, refresh, or delete action
- **THEN** the triggering control SHALL show loading or disabled state until the action settles

#### Scenario: List page exposes query states

- **WHEN** a page renders server-backed or mock-backed list data
- **THEN** the page SHALL render loading, empty, and error states using Ant Design feedback components or approved lightweight wrappers

### Requirement: Tailwind and UI/UX Pro Max boundaries

The system SHALL use Tailwind for layout and responsive composition while using UI/UX Pro Max only as an experience checklist.

#### Scenario: Preserve existing project theme

- **WHEN** UI/UX Pro Max recommends a new color palette, font pair, dark theme, or marketing-style layout
- **THEN** the implementation MUST NOT apply that recommendation unless a separate project-level visual redesign change is approved

#### Scenario: Apply experience checklist

- **WHEN** optimizing a page form, table, card grid, modal, drawer, upload area, or step flow
- **THEN** the implementation SHALL check labels, loading feedback, accessible names, responsive behavior, and duplicate-submission prevention

### Requirement: Large page component boundaries

The system SHALL reduce large page complexity by extracting stable local UI components without changing business data flow.

#### Scenario: Split pure UI sections

- **WHEN** a page file contains repeated or independently understandable UI sections such as step navigation, upload trigger, preview grid, status panel, or action footer
- **THEN** the implementation SHALL extract those sections into focused components while preserving existing API calls, hooks, mutation behavior, and route behavior

#### Scenario: Preserve tests during extraction

- **WHEN** a UI section is extracted from a page
- **THEN** existing tests SHALL continue to verify the same user-visible behavior and critical `data-testid` hooks SHALL be preserved where tests depend on them
