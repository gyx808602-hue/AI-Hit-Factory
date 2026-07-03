## 1. Project Setup

- [ ] 1.1 Confirm React scaffold choice: Vite + React + TypeScript is the default unless the team requests Next.js or another framework.
- [ ] 1.2 Initialize the frontend project structure and keep source code under a clear app directory.
- [ ] 1.3 Add routing, linting, formatting, and TypeScript configuration.
- [ ] 1.4 Define environment configuration for Mock API and future backend API base URL.

## 2. Design Input

- [ ] 2.1 Use Figma MCP to scan the provided account-system page nodes.
- [ ] 2.2 Map Figma frames to the PRD page list: login/register, phone binding, profile, real-name auth, enterprise certification, enterprise workspace, members, points usage, agreement signing, permission modal.
- [ ] 2.3 Identify missing Figma pages and create implementation placeholders using the same design system style.
- [ ] 2.4 Extract reusable UI patterns: form layout, verification-code input, upload field, status badge, table, modal, empty state, and workspace summary card.

## 3. Domain Model and API Contract

- [ ] 3.1 Create TypeScript types for user, account status, real-name auth, enterprise, enterprise member, points account, agreement, permission result, and operation log context.
- [ ] 3.2 Implement a centralized API Client interface for auth, account profile, real-name auth, enterprise application, enterprise members, points usage, and agreement signing.
- [ ] 3.3 Add Mock API data that covers personal user, real-name user, enterprise admin, creator, observer, unbound WeChat user, frozen user, and rejected certification states.
- [ ] 3.4 Add a small permission utility that evaluates identity, role, certification, account status, points status, and agreement status.

## 4. Account Pages

- [ ] 4.1 Implement phone/password login, phone/SMS login, registration, and password reset pages.
- [ ] 4.2 Implement WeChat phone-binding page for PC scan and mini-program authorization result states.
- [ ] 4.3 Implement personal center page with phone, WeChat binding, identity type, account status, certification status, enterprise status, and agreement records.
- [ ] 4.4 Implement real-name authentication page with submission, pending, approved, rejected, and frozen states.

## 5. Enterprise Pages

- [ ] 5.1 Implement enterprise certification application page with required fields, upload placeholders, contact phone verification, and agreement confirmation.
- [ ] 5.2 Implement enterprise workspace home with enterprise information, points balance, member count, recent tasks, material entry, digital-human entry, and usage entry.
- [ ] 5.3 Implement member management page with create member, role assignment, stop member, and role-limited access states.
- [ ] 5.4 Implement points usage page with balance summary, member usage records, task/function type, cost, result status, refund status, and time filters.

## 6. Compliance and Permission UX

- [ ] 6.1 Implement agreement signing modal/page for registration, first AI generation, enterprise certification, high-risk真人素材, and digital-human scenes.
- [ ] 6.2 Implement permission interception modal for未实名、未签署、企业未认证、角色无权限、账号冻结、风控限制 and points unavailable states.
- [ ] 6.3 Ensure high-risk features display the required guidance copy from the PRD.
- [ ] 6.4 Ensure sensitive information such as ID card number is masked in all user-facing displays.

## 7. Verification

- [ ] 7.1 Run TypeScript checks and linting.
- [ ] 7.2 Run unit tests for permission utility and API Client mock state transitions.
- [ ] 7.3 Use browser verification to test login, WeChat binding, real-name submission, enterprise certification, member management, points usage, agreement signing, and permission interception flows.
- [ ] 7.4 Compare implemented pages against Figma MCP screenshots and fix layout mismatches.
- [ ] 7.5 Run `openspec status --change add-account-system-react-pages` and confirm the change is apply-ready.
