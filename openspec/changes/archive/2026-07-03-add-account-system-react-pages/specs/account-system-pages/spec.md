## ADDED Requirements

### Requirement: Login and registration pages
The system SHALL provide React pages for手机号密码登录、手机号验证码登录、注册、找回密码 and user agreement confirmation.

#### Scenario: User registers with phone number
- **WHEN** a new user submits phone number, SMS code, password, confirm password, and accepts user agreement plus privacy policy
- **THEN** the system creates a personal account state and routes the user to the workspace or onboarding entry

#### Scenario: User resets password
- **WHEN** a user submits phone number, valid SMS code, and a new password
- **THEN** the system updates the credential state and allows password login with the new password

### Requirement: WeChat login requires phone binding
The system SHALL treat WeChat identity as a third-party binding and MUST require phone binding before core platform features are available.

#### Scenario: WeChat login without bound phone
- **WHEN** a PC scan login or mini-program authorization returns a WeChat identity without a bound phone number
- **THEN** the system routes the user to the phone binding page and blocks core workspace usage

#### Scenario: WeChat login with bound phone
- **WHEN** a WeChat identity maps to an existing phone account
- **THEN** the system signs in the existing account and preserves the unified account state across PC and mini-program flows

### Requirement: Account profile and identity state
The system SHALL show account profile information including phone number, WeChat binding status, account status, identity type, real-name status, enterprise status, and agreement records.

#### Scenario: User views profile
- **WHEN** a signed-in user opens the personal center
- **THEN** the system displays account identity, verification state, binding state, and available next actions

### Requirement: Real-name authentication
The system SHALL provide a real-name authentication page for personal users and track states: 未认证、认证中、已认证、认证失败、已冻结.

#### Scenario: User submits real-name authentication
- **WHEN** a user submits real name, ID information or third-party verification result, phone consistency confirmation, and required authorization agreement
- **THEN** the system records an authentication submission and displays the pending state

#### Scenario: Authentication fails
- **WHEN** authentication is rejected
- **THEN** the system displays the failure reason and allows resubmission when the account is not frozen

### Requirement: Enterprise certification application
The system SHALL provide a PC-first enterprise certification application page for enterprise name, credit code, license material, legal person information, contact information, industry, and category.

#### Scenario: User submits enterprise certification
- **WHEN** a personal account submits complete enterprise certification materials and contact phone verification
- **THEN** the system creates an enterprise application with 待审核 status

#### Scenario: Enterprise certification rejected
- **WHEN** the backend rejects an enterprise application
- **THEN** the frontend displays the rejection reason and allows the applicant to revise and resubmit

### Requirement: Enterprise workspace
The system SHALL create and display an enterprise workspace after enterprise certification passes.

#### Scenario: Enterprise admin enters workspace
- **WHEN** enterprise certification status is 审核通过
- **THEN** the system displays enterprise information, points balance, member count, recent tasks, material entry, digital human entry, and usage entry

### Requirement: Enterprise member management
The system SHALL allow enterprise administrators to create, role-assign, stop, and view enterprise subaccounts.

#### Scenario: Admin creates member
- **WHEN** an enterprise admin submits member name, phone number, and role
- **THEN** the system creates a member record and displays the member as 正常 or pending notification state

#### Scenario: Creator attempts member administration
- **WHEN** a creator role opens member management
- **THEN** the system denies the action and shows a permission interception message

### Requirement: Points account and usage records
The system SHALL display personal or enterprise points balance and usage records, including operator, enterprise, task, function type, cost, result status, refund status, and time.

#### Scenario: Enterprise member views usage
- **WHEN** an enterprise member opens points usage
- **THEN** the system displays records according to role scope and marks enterprise points as the charged account

### Requirement: Agreement signing
The system SHALL require scene-specific agreement signing before registration, first AI generation, enterprise certification, and high-risk真人素材 or digital-human features.

#### Scenario: High-risk feature requires agreement
- **WHEN** a user opens真人换人物、上传真人数字人 or爆款真人视频改编 without the required agreement
- **THEN** the system shows a forced agreement signing page or modal before allowing the feature

#### Scenario: Agreement signed
- **WHEN** a user signs an agreement
- **THEN** the system records agreement ID, version, user ID, enterprise ID when applicable, signed time, IP, device information, and content snapshot reference

### Requirement: Permission interception
The system SHALL intercept unavailable features based on identity type, account status, real-name state, enterprise state, role, points status, and agreement state.

#### Scenario: Non-real-name user opens high-risk feature
- **WHEN** a personal user without real-name authentication opens真人爆款视频改编
- **THEN** the system blocks the feature and displays guidance to complete real-name authentication and sign肖像权及素材授权承诺书

#### Scenario: Frozen account attempts generation
- **WHEN** a frozen or risk-limited account attempts to create generation content
- **THEN** the system blocks the action and displays the account status reason when available

### Requirement: Admin review contract
The system SHALL reserve frontend contracts for backend management of user status, enterprise review, real-name review, agreement management, points management, operation logs, and risk control.

#### Scenario: Review result reflected in frontend
- **WHEN** backend review status changes to approved, rejected, frozen, or unfrozen
- **THEN** the user-facing pages refresh status, available actions, and rejection or freeze reasons

### Requirement: Operation log awareness
The system SHALL treat key actions as auditable events and expose operation result states in user or admin-facing contracts.

#### Scenario: Key action submitted
- **WHEN** a user registers, logs in, submits certification, signs agreement, uploads material, creates digital human, generates video, downloads video, or changes member status
- **THEN** the API contract includes enough context for backend operation logging: user, enterprise, action type, target, result, IP/device source, and timestamp
