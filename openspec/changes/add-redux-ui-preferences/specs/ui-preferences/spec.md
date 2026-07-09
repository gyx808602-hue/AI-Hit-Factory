## ADDED Requirements

### Requirement: Redux Toolkit UI preferences store

The system SHALL use Redux Toolkit to store client-side UI preferences for global theme values and page layout preferences.

#### Scenario: App initializes UI preferences

- **WHEN** the application starts
- **THEN** the Redux store MUST include a `uiPreferences` state slice
- **AND** the slice MUST provide default values matching the current hardcoded dark workspace theme and sidebar layout

#### Scenario: Service data remains outside Redux

- **WHEN** a page needs API-returned business data
- **THEN** the implementation MUST continue using the existing API Client and React Query patterns
- **AND** the `uiPreferences` slice MUST NOT store server list, detail, or mutation response data

### Requirement: Overall theme controls Ant Design and CSS variables

The system SHALL derive both Ant Design theme tokens and application CSS custom properties from Redux theme state.

#### Scenario: Theme state provides primary color

- **WHEN** the Redux theme primary color is read by the app shell
- **THEN** Ant Design `colorPrimary` MUST use that value
- **AND** the document root MUST expose a matching brand CSS variable for custom layout styles

#### Scenario: Theme state provides surface colors

- **WHEN** the Redux theme surface colors are read by the app shell
- **THEN** CSS custom properties such as `--app-bg`, `--sidebar-bg`, `--card-bg`, `--muted-bg`, and `--line-subtle` MUST be synchronized from Redux
- **AND** Ant Design background tokens MUST be derived from the same semantic values

#### Scenario: Theme state provides text colors

- **WHEN** the Redux theme text colors are read by the app shell
- **THEN** CSS custom properties such as `--text-primary`, `--text-secondary`, and `--text-muted` MUST be synchronized from Redux
- **AND** existing text styles that reference those variables MUST continue to render without component-level rewrites

### Requirement: Theme defaults preserve current visual appearance

The system MUST preserve the current visual appearance when no theme changes have been dispatched.

#### Scenario: Default theme renders workspace

- **WHEN** the application renders with the default Redux UI preferences state
- **THEN** the Ant Design token values MUST match the previous hardcoded values in `App.tsx`
- **AND** the CSS variable values MUST match the previous defaults in `styles.css`

### Requirement: Redux-backed sidebar layout preference

The system SHALL store the dashboard sidebar collapsed state in Redux instead of component-local state.

#### Scenario: User toggles sidebar

- **WHEN** the user activates the sidebar collapse control
- **THEN** the app MUST dispatch a Redux action to toggle `sidebarCollapsed`
- **AND** the sidebar width, labels, and tooltip behavior MUST update from Redux state

#### Scenario: Other components read sidebar state

- **WHEN** another component or future settings entry reads the layout preference
- **THEN** it MUST be able to select `sidebarCollapsed` from the Redux store without reaching into `DashboardLayout`

### Requirement: Typed Redux access

The system SHALL provide typed Redux hooks or equivalent typed helpers for app components.

#### Scenario: Component dispatches UI action

- **WHEN** a TypeScript component dispatches a UI preferences action
- **THEN** it MUST use the app typed dispatch helper or a type-safe equivalent
- **AND** selector usage MUST be typed against the app `RootState`

### Requirement: Theme side effects are isolated

The system SHALL isolate DOM CSS variable synchronization in a small hook or component.

#### Scenario: Theme values change

- **WHEN** Redux theme values change
- **THEN** only the theme synchronization hook or component SHOULD write CSS custom properties to `document.documentElement`
- **AND** page components MUST NOT directly mutate document root styles

#### Scenario: Test or non-browser environment renders app code

- **WHEN** the synchronization logic runs without a browser document
- **THEN** it MUST avoid throwing runtime errors
