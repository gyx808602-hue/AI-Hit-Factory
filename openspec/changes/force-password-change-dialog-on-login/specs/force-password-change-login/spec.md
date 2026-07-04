## ADDED Requirements

### Requirement: Trigger forced password change dialog

The system SHALL detect login business errors with `code === "C10001"` and open a forced password change dialog on the login page instead of navigating to any protected route.

#### Scenario: Login requires forced password change

- **WHEN** the user submits the login form and the login API returns business code `C10001` with token data
- **THEN** the login page MUST keep the user on `/login`
- **THEN** the login page MUST open a forced password change dialog
- **THEN** the system MUST NOT navigate to the original redirect path

#### Scenario: C10001 response lacks usable token

- **WHEN** the login API returns business code `C10001` without a usable `accessToken`
- **THEN** the system MUST NOT open the forced password change dialog
- **THEN** the login page MUST treat the response as a login failure and refresh the captcha

### Requirement: Forced password change request contract

The system SHALL submit forced password changes to `POST /auth/password` with `oldPassword`, `newPassword`, and `confirmPassword` in the request body.

#### Scenario: Submit forced password change

- **WHEN** the user submits the forced password change dialog
- **THEN** the API client MUST call `POST /auth/password`
- **THEN** the request body MUST include `oldPassword`, `newPassword`, and `confirmPassword`
- **THEN** the request body MUST NOT include username, phone, captcha, or redirect fields

### Requirement: Forced password change must use token authentication

The system SHALL use the token returned by the `C10001` login response as the authentication context for `/auth/password`.

#### Scenario: Password change carries login response token

- **WHEN** the login API returns `C10001` with token data and the user submits the password change dialog
- **THEN** the `/auth/password` request MUST include `Authorization: Bearer <accessToken>`
- **THEN** the `/auth/password` request MUST NOT use the `no-auth` header marker

### Requirement: Password change dialog validation

The forced password change dialog SHALL require old password, new password, and matching confirmation before submission.

#### Scenario: Required fields are missing

- **WHEN** the user submits the dialog without filling all password fields
- **THEN** the system MUST show field validation errors
- **THEN** the system MUST NOT call `/auth/password`

#### Scenario: Confirm password does not match

- **WHEN** the user enters a `confirmPassword` different from `newPassword`
- **THEN** the system MUST show a mismatch validation error
- **THEN** the system MUST NOT call `/auth/password`

### Requirement: Successful forced password change returns user to login

After `/auth/password` succeeds, the system SHALL clear local authentication state, close the dialog, and tell the user to log in again.

#### Scenario: Password change succeeds

- **WHEN** `/auth/password` returns a successful business response
- **THEN** the system MUST clear local access token, refresh token, and current user information
- **THEN** the system MUST close the forced password change dialog
- **THEN** the system MUST show a success message telling the user to log in again
- **THEN** the login form MUST remain available for a new login attempt

### Requirement: Existing login behavior remains intact

The system SHALL preserve normal successful login behavior and normal login failure behavior outside the `C10001` branch.

#### Scenario: Normal login succeeds

- **WHEN** the login API returns a successful token response without `C10001`
- **THEN** the system MUST store the token pair
- **THEN** the system MUST navigate to the redirect path or default home route

#### Scenario: Login fails for non-C10001 reason

- **WHEN** the login API fails with a business code other than `C10001`
- **THEN** the system MUST NOT open the forced password change dialog
- **THEN** the system MUST refresh the captcha using the existing login failure flow
