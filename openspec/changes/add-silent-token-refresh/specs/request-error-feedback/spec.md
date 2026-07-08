## ADDED Requirements

### Requirement: Request error notifications are deduplicated
The request layer SHALL deduplicate identical global error notifications within a short time window to avoid repeated popups from concurrent failures.

#### Scenario: Same message repeats quickly
- **WHEN** multiple requests fail with the same display message within the configured dedupe window
- **THEN** the system MUST show at most one global error notification for that message

#### Scenario: Different messages occur
- **WHEN** requests fail with different display messages
- **THEN** the system MUST allow each distinct message to be shown once

### Requirement: Pages do not duplicate request-layer errors
Pages SHALL NOT show a second generic interface error popup when the request layer has already emitted a global error notification.

#### Scenario: API mutation fails with a globally handled error
- **WHEN** a page catches an API error from the shared request client without using silent error mode
- **THEN** the page MUST restore local loading state but MUST NOT call `message.error` for the same interface error

#### Scenario: Page owns a local validation error
- **WHEN** an error is produced by local validation or by an API call using silent error mode
- **THEN** the page MAY show one page-specific component notification or form error
