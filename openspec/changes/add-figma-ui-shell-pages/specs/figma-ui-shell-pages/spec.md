## ADDED Requirements

### Requirement: Frontend project scaffold
The system SHALL provide a Vite + React + TypeScript frontend project for the AI-Hit-Factory UI.

#### Scenario: Project starts locally
- **WHEN** the developer installs dependencies and starts the frontend dev server
- **THEN** the system displays the AI-Hit-Factory application shell without runtime errors

#### Scenario: Project builds successfully
- **WHEN** the developer runs the production build command
- **THEN** the system completes TypeScript compilation and Vite build successfully

### Requirement: Ant Design and TailwindCSS UI foundation
The system SHALL use Ant Design for complex UI components and TailwindCSS for page layout and visual spacing.

#### Scenario: Theme is applied
- **WHEN** the application renders any first-phase page
- **THEN** the page uses the configured dark theme, brand colors, typography, spacing, and component tokens consistently

#### Scenario: Complex controls use Ant Design
- **WHEN** a page needs forms, tables, uploads, steps, tabs, modals, drawers, empty states, or skeleton states
- **THEN** the implementation uses Ant Design components unless a documented page-specific reason exists

### Requirement: Application shell and navigation
The system SHALL provide an application shell with sidebar navigation, topbar, content area, and collapsible navigation behavior.

#### Scenario: User navigates between pages
- **WHEN** the user selects a sidebar navigation item
- **THEN** the system displays the corresponding page and visually marks the active navigation item

#### Scenario: User collapses sidebar
- **WHEN** the user toggles the sidebar collapse control
- **THEN** the system reduces the sidebar width while preserving icon navigation and page content usability

### Requirement: Static route registry
The system SHALL maintain a static route registry that maps route keys to page components and route metadata.

#### Scenario: Route registry renders known route
- **WHEN** a known route key is selected from the navigation configuration
- **THEN** the system renders the mapped React page component

#### Scenario: Future permission menu can filter routes
- **WHEN** a future backend menu provides route keys and permission codes
- **THEN** the frontend can filter the static route registry without dynamically importing arbitrary backend-provided component paths

### Requirement: Browser window compatibility
The system SHALL remain usable across common desktop browser window sizes and provide graceful fallback for narrower windows.

#### Scenario: Common desktop windows render correctly
- **WHEN** the application is viewed at `1280x720`, `1366x768`, `1440x900`, `1536x864`, or `1920x1080`
- **THEN** the system displays the application shell and first-phase pages without blank screens, incoherent overlap, clipped primary actions, or unintended page-level horizontal overflow

#### Scenario: Compact desktop width is usable
- **WHEN** the application is viewed between `1024px` and `1279px` wide
- **THEN** the system preserves navigation access, content scrolling, and table/card usability through compact layout, collapsible sidebar, or controlled horizontal scrolling

#### Scenario: Narrow window fallback is safe
- **WHEN** the application is viewed below `1024px` wide
- **THEN** the system does not need to provide full mobile parity but MUST avoid blank screens, uncloseable dialogs, inaccessible primary actions, and destructive layout overlap

#### Scenario: Short window height is usable
- **WHEN** the application is viewed at `720px` height
- **THEN** headers, side navigation, modals, and page content remain operable through appropriate internal scrolling and max-height constraints

### Requirement: Dashboard page
The system SHALL provide a dashboard page matching the Figma workflow overview.

#### Scenario: User opens dashboard
- **WHEN** the user opens the dashboard route
- **THEN** the system displays summary metrics, quick action entries, and recent generation tasks

#### Scenario: User starts from quick action
- **WHEN** the user clicks a quick action card
- **THEN** the system navigates to the corresponding feature page

### Requirement: Product video generation page
The system SHALL provide a product video generation page with a multi-step mock workflow.

#### Scenario: User completes product video steps
- **WHEN** the user progresses through product information, selling points, script, and generation mode steps
- **THEN** the system displays each step state and allows the user to reach a mock video result

#### Scenario: User views generated product video result
- **WHEN** mock generation completes
- **THEN** the system displays a result preview, title, narration, publish copy, tags, and result actions

### Requirement: Image-to-video page
The system SHALL provide an image/text-to-video page matching the Figma demo workflow.

#### Scenario: User switches input mode
- **WHEN** the user chooses text, image, or mixed input mode
- **THEN** the system displays the relevant input controls for that mode

#### Scenario: User generates image-to-video demo
- **WHEN** the user starts generation from the image-to-video page
- **THEN** the system shows generating state and then displays a mock video preview with result actions

### Requirement: Viral remix page
The system SHALL provide a viral remix page for upload, structure analysis, remix mode selection, and mock generation.

#### Scenario: User uploads viral video
- **WHEN** the user uploads or selects the mock viral video entry
- **THEN** the system displays analysis progress and then shows structured analysis results

#### Scenario: User changes remix mode
- **WHEN** the user selects replace-person, replace-product, or imitate mode
- **THEN** the system displays the configuration controls for the selected mode

### Requirement: Digital humans page
The system SHALL provide a digital human management page with list, search, filter, add modal, and local state actions.

#### Scenario: User filters digital humans
- **WHEN** the user searches by name or filters by status
- **THEN** the system updates the displayed digital human cards according to the filter

#### Scenario: User adds digital human
- **WHEN** the user completes the add digital human modal
- **THEN** the system adds the new digital human to the local list and closes the modal

### Requirement: Task records page
The system SHALL provide a task records page with summary metrics, filters, status display, and result actions.

#### Scenario: User filters task records
- **WHEN** the user searches, filters by task type, or filters by status
- **THEN** the system updates the task list according to the selected criteria

#### Scenario: Task status controls available actions
- **WHEN** a task is success, failed, processing, queued, or cancelled
- **THEN** the system displays actions and status indicators appropriate to that task state

### Requirement: Asset library page
The system SHALL provide an asset library page with type filters, search, upload entry, card grid, and media actions.

#### Scenario: User filters assets
- **WHEN** the user selects an asset type or enters a search keyword
- **THEN** the system displays only matching assets

#### Scenario: User views media card actions
- **WHEN** the user hovers or focuses an asset card
- **THEN** the system displays relevant preview, download, or delete actions without layout shift

### Requirement: Mock data boundaries
The system SHALL keep first-phase UI data in centralized mock structures and avoid hard-coding repeated mock data across unrelated pages.

#### Scenario: Page reads mock data
- **WHEN** a page displays tasks, assets, dashboard metrics, or digital humans
- **THEN** the data comes from a typed mock data module or feature-local typed source

### Requirement: Verification coverage
The system SHALL include verification steps for type safety, build success, and browser-level UI smoke checks.

#### Scenario: Developer verifies implementation
- **WHEN** implementation is complete
- **THEN** the developer can run typecheck/build and inspect the pages in a browser without blank screens, broken navigation, or obvious layout overlap

#### Scenario: Window matrix verification
- **WHEN** implementation is complete
- **THEN** the developer verifies the application at the required desktop window matrix and records or fixes any layout overflow, overlap, clipped action, or modal height issue
