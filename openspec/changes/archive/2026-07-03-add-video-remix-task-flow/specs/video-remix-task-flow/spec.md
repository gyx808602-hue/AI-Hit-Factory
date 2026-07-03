## ADDED Requirements

### Requirement: Video remix task entry creates a persistent task
The system SHALL treat the 爆款视频改编入口页 as a task creation entry and MUST create a persistent video remix task before users continue into full editing and generation flow.

#### Scenario: User creates a video remix task from the entry page
- **WHEN** a signed-in user submits the basic task entry action from the 爆款视频改编入口页
- **THEN** the frontend creates a video remix task through `POST /customer/aigc/video-remix-tasks` and routes the user to the created task detail page using the returned local task `id`

#### Scenario: Task creation fails
- **WHEN** the create task request fails
- **THEN** the frontend MUST keep the user on the entry page and show an actionable error state instead of navigating to a nonexistent task detail page

### Requirement: Video remix task list page
The system SHALL provide a dedicated video remix task list page for querying, filtering, re-entering, and deleting video remix tasks.

#### Scenario: User queries task list
- **WHEN** the user opens the 追爆任务列表页
- **THEN** the frontend loads paged task data from `GET /customer/aigc/video-remix-tasks` and renders task name, status, progress, result summary, and update time

#### Scenario: User filters task list
- **WHEN** the user applies keyword or status filters
- **THEN** the frontend re-queries the task list with matching request parameters and renders the filtered result set

#### Scenario: User deletes a task
- **WHEN** the user confirms deletion for a task
- **THEN** the frontend calls `DELETE /customer/aigc/video-remix-tasks/{id}` and updates the list state after deletion succeeds

### Requirement: Video remix task detail draft persistence
The system SHALL provide a task detail page that can restore saved task data and MUST persist the editable video remix form as server-side task state.

#### Scenario: User opens an existing task detail page
- **WHEN** the user enters `/viral-remix/tasks/:taskId`
- **THEN** the frontend loads task detail from `GET /customer/aigc/video-remix-tasks/{id}` and restores both task status fields and saved `form` fields into the page

#### Scenario: User saves the remix form
- **WHEN** the user submits the detail form save action
- **THEN** the frontend calls `PUT /customer/aigc/video-remix-tasks/{id}/form` with the mapped task form payload and updates the local detail view with the latest server response

### Requirement: Video remix task generation actions
The system SHALL support the server-defined action flow for prompt checking, prompt generation, video generation, and status refresh on a persisted video remix task.

#### Scenario: User checks prompt
- **WHEN** the user triggers prompt checking for a task
- **THEN** the frontend calls `POST /customer/aigc/video-remix-tasks/{id}/check-prompt` and displays the returned prompt check result on the same task detail page

#### Scenario: User generates prompt
- **WHEN** the user triggers prompt generation for a task
- **THEN** the frontend calls `POST /customer/aigc/video-remix-tasks/{id}/generate-prompt` and updates generated prompt, prompt provider, prompt model, prompt timestamps, and prompt check fields from the latest task response

#### Scenario: User generates video
- **WHEN** the user triggers video generation for a task
- **THEN** the frontend calls `POST /customer/aigc/video-remix-tasks/{id}/generate-video` and keeps the task detail page synchronized with the returned latest task state

#### Scenario: User refreshes task status
- **WHEN** the user triggers manual refresh for a task
- **THEN** the frontend calls `GET /customer/aigc/video-remix-tasks/{id}/refresh` and updates status, progress, error reason, prompt state, and result state from the refreshed response

### Requirement: Video remix result and failure rendering
The system SHALL render task progress, generated result, and failure information directly from persisted task state rather than local-only UI assumptions.

#### Scenario: Task succeeds
- **WHEN** the task detail response contains generated result fields such as `videoUrl`, `coverUrl`, or `duration`
- **THEN** the frontend displays the generated video result area using those returned fields

#### Scenario: Task fails
- **WHEN** the task detail response contains failure state and `errReason`
- **THEN** the frontend MUST display the failure reason and keep the task available for later refresh or re-entry

### Requirement: Video remix route integration
The system SHALL integrate video remix task pages into the existing static route registry and dynamic route mapping model.

#### Scenario: Route registry includes new pages
- **WHEN** the frontend registers 爆款视频改编任务相关页面
- **THEN** the route registry MUST define explicit route keys for the task list page and the task detail page instead of relying on ad hoc unregistered routes

#### Scenario: Detail page stays out of main menu
- **WHEN** the task detail page is registered
- **THEN** the frontend MUST mark the detail route as hidden from the primary menu while preserving direct navigation support
