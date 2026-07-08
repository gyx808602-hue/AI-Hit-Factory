## ADDED Requirements

### Requirement: Access token refresh and request replay
The request layer SHALL call `POST /v1/auth/refresh` with the `refreshToken` parameter when a protected request fails because the access token is invalid, and it MUST replay the original protected request after refresh succeeds.

#### Scenario: Refresh succeeds and original request is replayed
- **WHEN** a protected request receives access-token-invalid code `A0230`
- **THEN** the system MUST refresh the token pair and retry the original request with the new access token

#### Scenario: Original request is not replayed forever
- **WHEN** a retried request receives access-token-invalid code `A0230` again
- **THEN** the system MUST stop retrying and trigger the normal authentication-expired flow

### Requirement: Concurrent expired requests share one refresh
The request layer SHALL ensure that multiple protected requests failing with access-token-invalid during the same refresh window wait for one shared refresh result.

#### Scenario: Multiple requests expire together
- **WHEN** two or more protected requests receive access-token-invalid before refresh completes
- **THEN** the system MUST send only one refresh request and replay all waiting requests after refresh succeeds

### Requirement: Refresh failure does not replay requests
The request layer SHALL reject waiting requests without replaying them when refresh fails or refresh token is invalid.

#### Scenario: Refresh token is invalid
- **WHEN** the refresh request fails with refresh-token-invalid code `A0231`
- **THEN** the system MUST clear authentication state through the existing expired-session flow and MUST NOT replay waiting protected requests

#### Scenario: Refresh request has no available refresh token
- **WHEN** access token is invalid and no refresh token exists in storage
- **THEN** the system MUST trigger the existing expired-session flow and MUST NOT call the refresh endpoint
