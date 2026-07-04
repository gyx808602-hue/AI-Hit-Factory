## ADDED Requirements

### Requirement: Personal center route access
The system SHALL provide a logged-in personal center page through a static frontend route key named `account.personalCenter`.

#### Scenario: User opens personal center from dynamic route
- **WHEN** the dynamic menu contains `account.personalCenter`
- **THEN** the frontend MUST resolve it through the local route registry to the personal center page component
- **AND** the page MUST require authentication

#### Scenario: Backend does not provide the personal center menu
- **WHEN** the dynamic menu does not contain `account.personalCenter`
- **THEN** the personal center menu entry MUST NOT be shown in the sidebar

### Requirement: Personal profile summary
The system SHALL display a profile summary card containing avatar, display name, organization name, membership or verification label, joined time, account ID, and an edit profile entry.

#### Scenario: Profile data is complete
- **WHEN** the overview API returns all profile fields
- **THEN** the page MUST render the profile summary using the returned values
- **AND** the edit profile entry MUST be visible

#### Scenario: Profile data has missing optional fields
- **WHEN** avatar, organization name, membership label, or joined time is missing
- **THEN** the page MUST render stable fallback content without layout collapse

### Requirement: Points overview
The system SHALL display a points overview card containing current balance, point unit, optional reset or validity hint, and a recharge entry.

#### Scenario: Points data is available
- **WHEN** the overview API returns point balance information
- **THEN** the page MUST display the formatted balance and point unit
- **AND** the recharge entry MUST follow the returned `rechargeEnabled` state

#### Scenario: Recharge is not enabled
- **WHEN** `rechargeEnabled` is false
- **THEN** the recharge entry MUST be disabled or show a clear unavailable state

### Requirement: Usage statistics summary
The system SHALL display monthly usage statistics including used points, comparison text, comparison trend, and usage breakdown percentages.

#### Scenario: Usage breakdown is returned
- **WHEN** the overview API returns video, audio, script, or other usage breakdown items
- **THEN** the page MUST render each item with label, percentage, and visual progress
- **AND** the sum of displayed percentages MUST NOT break the card layout when values are imperfect

#### Scenario: Usage statistics are empty
- **WHEN** the overview API returns no usage breakdown
- **THEN** the page MUST render an empty statistics fallback instead of hiding the entire personal center

### Requirement: Security and preferences panel
The system SHALL display security and preference rows for email, phone binding, password update, and generation reminder.

#### Scenario: Security data is returned
- **WHEN** the overview API returns email, phone, password update time, and reminder state
- **THEN** the page MUST render the rows in a consistent panel layout
- **AND** email and phone MUST be displayed in a masked form

#### Scenario: User toggles generation reminder
- **WHEN** the user changes the generation reminder switch
- **THEN** the frontend MUST call the preference update API through a React Query mutation
- **AND** the switch MUST show a submitting or disabled state while the request is pending

### Requirement: Invitation reward card
The system SHALL display an invitation reward card containing invite code, copy action, inviter reward rule, and friend benefit hint.

#### Scenario: Invitation data is enabled
- **WHEN** the overview API returns enabled invitation data
- **THEN** the page MUST render the invite code and copy invite code action
- **AND** the page MUST render inviter reward points and friend benefit hint from the returned data

#### Scenario: User copies invite code
- **WHEN** the user clicks the copy invite code action
- **THEN** the frontend MUST copy the invite code or invite link to the clipboard
- **AND** the page MUST show success or failure feedback for the copy result

#### Scenario: Invitation data is disabled
- **WHEN** invitation data is disabled or invite code is missing
- **THEN** the invitation reward card MUST render a stable unavailable state
- **AND** the page MUST NOT show a broken copy action

### Requirement: Interface contract placeholder
The system MUST define a frontend `PersonalCenterOverview` contract and access it through API Client and React Query hooks, even before real backend fields are available.

#### Scenario: Backend interface is not ready
- **WHEN** the real backend endpoint is unavailable or fields are undecided
- **THEN** the implementation MUST provide Mock data or an adapter returning `PersonalCenterOverview`
- **AND** the page MUST NOT directly hardcode API URLs or backend-shaped fields in JSX

#### Scenario: Backend fields change later
- **WHEN** backend fields differ from the placeholder contract
- **THEN** only the API adapter layer MUST need field mapping changes
- **AND** the page component MUST continue to consume `PersonalCenterOverview`

### Requirement: Page states
The system SHALL provide loading, error, empty, and normal states for the personal center page.

#### Scenario: Overview query is loading
- **WHEN** the personal center overview query is pending
- **THEN** the page MUST show skeleton or loading placeholders for the main cards

#### Scenario: Overview query fails
- **WHEN** the personal center overview query fails
- **THEN** the page MUST show an error feedback area with a retry action

### Requirement: Visual layout reference
The system SHALL use the supplied reference image as layout guidance while preserving the existing application design system.

#### Scenario: Desktop viewport renders personal center
- **WHEN** the page is rendered on a desktop viewport
- **THEN** the profile card and points card MUST appear in the top row
- **AND** the usage statistics card and security preferences panel MUST appear below with responsive spacing

#### Scenario: Narrow viewport renders personal center
- **WHEN** the page is rendered on a narrow viewport
- **THEN** all cards MUST stack vertically
- **AND** text and controls MUST NOT overlap or overflow their containers
