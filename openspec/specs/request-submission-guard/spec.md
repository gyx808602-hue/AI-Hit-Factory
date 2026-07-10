## Purpose

Define the frontend submission guard behavior for user-triggered React Query mutation actions, so rapid repeated clicks do not create duplicate business requests while React Query retry and request-layer auth refresh remain separate internal recovery mechanisms.

## Requirements

### Requirement: Guard duplicate mutation triggers

The system SHALL prevent the same user-triggered mutation action from invoking its business request more than once while the first invocation is still pending.

#### Scenario: Rapid repeated create clicks

- **WHEN** a user rapidly triggers the same create action multiple times before the first mutation settles
- **THEN** the system MUST call the create mutation business function only once

#### Scenario: Rapid repeated delete confirmations

- **WHEN** a user rapidly confirms the same delete action multiple times before the first mutation settles
- **THEN** the system MUST call the delete mutation business function only once

### Requirement: Allow user retry after settlement

The system SHALL release the submission guard after the guarded mutation settles, regardless of success or failure.

#### Scenario: Failed mutation can be submitted again

- **WHEN** a guarded mutation fails and then the user triggers the same action again
- **THEN** the system MUST allow the second user-triggered mutation attempt

#### Scenario: Successful mutation can be submitted again for a new action

- **WHEN** a guarded mutation succeeds and the user later triggers the action again with new valid input
- **THEN** the system MUST allow the new mutation attempt

### Requirement: Keep retry and auth refresh semantics separate

The system SHALL treat React Query failure retry and request-layer auth refresh replay as internal behavior of a single user-triggered mutation, not as duplicate user submissions.

#### Scenario: React Query retry is not blocked as duplicate click

- **WHEN** a mutation is configured to retry after a failed request
- **THEN** the submission guard MUST NOT classify React Query retry attempts as separate duplicate user clicks

#### Scenario: Auth refresh replay is not blocked as duplicate click

- **WHEN** the request layer refreshes an expired access token and replays the original request
- **THEN** the submission guard MUST NOT block that replay as a duplicate user submission

### Requirement: Preserve loading feedback

The system SHALL keep visible loading or disabled feedback for guarded mutation actions.

#### Scenario: Guarded button shows pending state

- **WHEN** a guarded mutation action is pending
- **THEN** the related button or trigger MUST expose loading or disabled feedback to the user
