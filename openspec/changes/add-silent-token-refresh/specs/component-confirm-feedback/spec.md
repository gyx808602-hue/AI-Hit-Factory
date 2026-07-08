## ADDED Requirements

### Requirement: Dangerous confirmations use component dialogs
Pages SHALL use Ant Design confirmation components for delete and destructive actions, and MUST NOT use browser-native `window.confirm`.

#### Scenario: User confirms deletion
- **WHEN** a user clicks a delete action and confirms through the Ant Design confirmation component
- **THEN** the page MUST call the existing delete logic exactly once

#### Scenario: User cancels deletion
- **WHEN** a user cancels the Ant Design confirmation component
- **THEN** the page MUST NOT call the delete logic

### Requirement: Confirmation feedback follows current UI system
Confirmation controls SHALL inherit the existing Ant Design theme and keep asynchronous action states visible to the user.

#### Scenario: Delete action is pending
- **WHEN** a confirmed delete action is running
- **THEN** the confirmation or delete control MUST prevent duplicate submission through loading or disabled state where the local component supports it
