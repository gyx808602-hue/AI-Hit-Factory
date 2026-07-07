## ADDED Requirements

### Requirement: Route Meta Controls Page Instance Cache
The system SHALL use the current runtime route metadata to decide whether a page component instance is cached.

#### Scenario: Cache-enabled route keeps component instance
- **WHEN** a user visits a route whose matched route has `meta.cache: true`
- **THEN** the route outlet MUST preserve that page component instance when the user navigates to another protected route

#### Scenario: Cache-disabled route unmounts normally
- **WHEN** a user leaves a route whose matched route has `meta.cache: false` or no cache flag
- **THEN** the route outlet MUST allow that page component instance to unmount normally

### Requirement: Runtime Available Routes Drive Cache Matching
The system SHALL match cache behavior against the final runtime `availableRoutes`, not against only the static route registry.

#### Scenario: Dynamic menu controls route cache metadata
- **WHEN** dynamic menu data changes a route's cache metadata through the approved route mapping layer
- **THEN** the cache outlet MUST use the merged runtime route metadata for the current user

#### Scenario: Unauthorized routes cannot stay cached
- **WHEN** a route is no longer present in the current user's available routes
- **THEN** the cache outlet MUST NOT keep rendering that route's cached page instance

### Requirement: Route Key Identifies Cached Page Instance
The system SHALL use `route.key` as the stable cache key for cached page component instances.

#### Scenario: Cached page is restored by route key
- **WHEN** a user navigates away from and then back to a cache-enabled route with the same `route.key`
- **THEN** the same cached page instance MUST be displayed instead of creating a new instance

#### Scenario: Different route keys do not share cache
- **WHEN** two routes have different `route.key` values
- **THEN** they MUST NOT share the same cached page instance even if their path patterns are similar

### Requirement: Detail And Create Routes Are Not Cached By Default
The system SHALL keep detail pages, create pages, login pages, and error pages out of the page instance cache unless a future spec explicitly permits them.

#### Scenario: Detail route with dynamic id is not cached
- **WHEN** a user navigates from `/image-video/tasks/1` to another route and later opens `/image-video/tasks/2`
- **THEN** the detail page MUST mount normally and MUST NOT reuse a stale detail page instance from the previous id

#### Scenario: Create page does not preserve dirty form by route cache
- **WHEN** a user leaves a create page whose route has `meta.cache: false`
- **THEN** returning to that route MUST create a fresh page instance unless the page has a separate explicit draft feature

### Requirement: Cache Can Be Cleared By Lifecycle Events
The system SHALL provide a way to remove cached page instances by route key and to clear all cached instances.

#### Scenario: Logout clears cached pages
- **WHEN** the user logs out
- **THEN** all protected route page caches MUST be cleared

#### Scenario: Future tag close removes matching cache
- **WHEN** a future tagsView closes a tag for a cache-enabled route
- **THEN** the cache layer MUST be able to remove the cached instance for that route key

### Requirement: Page Cache Does Not Replace React Query Data Cache
The system SHALL keep server data freshness under React Query and SHALL NOT copy query results into page keep-alive state.

#### Scenario: Cached page still relies on query cache rules
- **WHEN** a cached page becomes visible again
- **THEN** the page MUST continue to use its existing React Query hooks and query invalidation behavior for server data freshness
