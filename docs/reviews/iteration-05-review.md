# Iteration 5 Review

## Objectives

Iteration 5 introduced authenticated watchlists as the first PriceWatch
feature spanning the React frontend, NestJS API gateway, and PostgreSQL
database.

The iteration aimed to let a user:

- register and log in through the web application;
- remain authenticated through an HTTP-only JWT cookie;
- access protected frontend routes;
- add and remove products from a personal watchlist;
- view every product on that watchlist; and
- log out through the API and frontend navigation.

All planned Iteration 5 issues from #69 to #83 are closed. Feature delivery,
endpoint testing, README updates, and the initial iteration review were merged
through PRs #84 to #100.

---

## Delivered Work

| Issue | Pull request | Area | Outcome |
| --- | --- | --- | --- |
| [#69](https://github.com/JJ-ProjectDev/pricewatch/issues/69) | [#93](https://github.com/JJ-ProjectDev/pricewatch/pull/93) | Auth/security | Moved JWT transport from a response body and Bearer header to an HTTP-only cookie; added logout. |
| [#70](https://github.com/JJ-ProjectDev/pricewatch/issues/70) | [#94](https://github.com/JJ-ProjectDev/pricewatch/pull/94) | Database | Added the Watchlist model, migration, relations, indexes, and uniqueness rule. |
| [#71](https://github.com/JJ-ProjectDev/pricewatch/issues/71) | [#95](https://github.com/JJ-ProjectDev/pricewatch/pull/95) | Backend | Added `POST /watchlist/:productId`. |
| [#72](https://github.com/JJ-ProjectDev/pricewatch/issues/72) | [#96](https://github.com/JJ-ProjectDev/pricewatch/pull/96) | Backend | Added `DELETE /watchlist/:productId`. |
| [#73](https://github.com/JJ-ProjectDev/pricewatch/issues/73) | [#97](https://github.com/JJ-ProjectDev/pricewatch/pull/97) | Backend | Added `GET /watchlist`. |
| [#74](https://github.com/JJ-ProjectDev/pricewatch/issues/74) | [#98](https://github.com/JJ-ProjectDev/pricewatch/pull/98) | Testing | Completed Jest/Supertest coverage for every watchlist endpoint. |
| [#75](https://github.com/JJ-ProjectDev/pricewatch/issues/75) | [#85](https://github.com/JJ-ProjectDev/pricewatch/pull/85) | Frontend | Added `AuthContext` and startup session restoration. |
| [#76](https://github.com/JJ-ProjectDev/pricewatch/issues/76) | [#86](https://github.com/JJ-ProjectDev/pricewatch/pull/86) | Frontend | Added the login page. |
| [#77](https://github.com/JJ-ProjectDev/pricewatch/issues/77) | [#87](https://github.com/JJ-ProjectDev/pricewatch/pull/87) | Frontend | Added registration followed by automatic login. |
| [#78](https://github.com/JJ-ProjectDev/pricewatch/issues/78) | [#88](https://github.com/JJ-ProjectDev/pricewatch/pull/88) | Frontend | Added protected route handling. |
| [#79](https://github.com/JJ-ProjectDev/pricewatch/issues/79) | [#90](https://github.com/JJ-ProjectDev/pricewatch/pull/90) | Frontend | Added watch/unwatch controls and shared watchlist identifiers. |
| [#80](https://github.com/JJ-ProjectDev/pricewatch/issues/80) | [#91](https://github.com/JJ-ProjectDev/pricewatch/pull/91) | Frontend | Added the protected watchlist page. |
| [#81](https://github.com/JJ-ProjectDev/pricewatch/issues/81) | [#92](https://github.com/JJ-ProjectDev/pricewatch/pull/92) | Frontend | Made the navbar respond to authentication state. |
| [#82](https://github.com/JJ-ProjectDev/pricewatch/issues/82) | [#99](https://github.com/JJ-ProjectDev/pricewatch/pull/99) | Documentation | Updated the README for Iteration 5 authentication, routes, and watchlists. |
| [#83](https://github.com/JJ-ProjectDev/pricewatch/issues/83) | [#100](https://github.com/JJ-ProjectDev/pricewatch/pull/100) | Documentation | Added the initial Iteration 5 review. |

[PR #84](https://github.com/JJ-ProjectDev/pricewatch/pull/84) was not linked to
an Iteration 5 issue, but it added `withCredentials: true` to the shared Axios
client immediately before the labelled work. This is required for the browser
to send the authentication cookie and is therefore included in this review.

---

## Key Files

### Backend files created

- `services/api-gateway/prisma/migrations/20260827174058_add_watchlist/migration.sql`
- `services/api-gateway/src/auth/auth-cookie.config.ts`
- `services/api-gateway/src/auth/auth-cookie.config.spec.ts`
- `services/api-gateway/src/watchlist/dto/watchlist-response.dto.ts`
- `services/api-gateway/src/watchlist/watchlist.controller.ts`
- `services/api-gateway/src/watchlist/watchlist.module.ts`
- `services/api-gateway/src/watchlist/watchlist.service.ts`
- `services/api-gateway/src/watchlist/watchlist.service.spec.ts`
- `services/api-gateway/src/watchlist/watchlist.integration-spec.ts`

### Frontend files created

- `services/web/src/contexts/AuthContext.tsx`
- `services/web/src/contexts/WatchlistContext.tsx`
- `services/web/src/components/auth/ProtectedRoute.tsx`
- `services/web/src/components/watchlist/WatchButton.tsx`
- `services/web/src/pages/LoginPage.tsx`
- `services/web/src/pages/RegisterPage.tsx`
- `services/web/src/pages/WatchlistPage.tsx`

### Important files updated

- `services/api-gateway/src/auth/auth.controller.ts`
- `services/api-gateway/src/auth/jwt.strategy.ts`
- `services/api-gateway/src/auth/dto/login-response.dto.ts`
- `services/api-gateway/src/main.ts`
- `services/api-gateway/src/swagger.ts`
- `services/api-gateway/prisma/schema.prisma`
- `services/web/src/App.tsx`
- `services/web/src/main.tsx`
- `services/web/src/lib/api.ts`
- `services/web/src/components/layout/Navbar.tsx`
- `services/web/src/pages/ProductsPage.tsx`
- `services/web/src/pages/ProductDetailPage.tsx`

There is no `watchlist.controller.spec.ts`. Watchlist behaviour is tested by
the service unit suite and the HTTP integration suite listed above.

---

## Architecture Decisions

### Cookie-based JWT transport

The API remains stateless: the access token is still a signed JWT, and no
server-side session store was introduced. The transport changed from a token
returned to application code to an HTTP-only cookie managed by the browser.

The cookie uses:

- the name `access_token`;
- `HttpOnly` to prevent frontend JavaScript from reading it;
- `SameSite=Lax` to reduce cross-site request exposure;
- `Secure` when `NODE_ENV=production`; and
- `Path=/` so it is available to API routes.

Password hashing continues to use Argon2id through `PasswordHashingService`.

The browser-to-database request path is:

```text
React application
    |
    | Axios request with credentials
    v
NestJS API gateway
    |
    | cookie-parser exposes access_token
    v
Passport JWT strategy and JwtAuthGuard
    |
    | verified payload becomes request.user
    v
WatchlistController -> WatchlistService -> Prisma -> PostgreSQL
```

The API enables credentialed CORS for the configured `WEB_ORIGIN`, and the
frontend Axios instance enables `withCredentials`. Browser cookie
authentication would fail if either side were omitted.

### Server-authoritative identity

Every watchlist operation gets the user identifier from the verified
`request.user` object. Request bodies never select watchlist ownership. Tests
prove that a forged `userId` is ignored and that one user cannot delete or
list another user's entries.

Client-side `ProtectedRoute` improves navigation and user experience, but it
is not a security boundary. The API's `JwtAuthGuard` remains the authoritative
protection on every watchlist endpoint and `GET /auth/me`.

### Database-enforced watchlist integrity

The database owns the rule that one user may watch a given product only once.
The compound uniqueness constraint on `(userId, productId)` remains correct
under concurrent requests in a way that an application-only pre-check would
not.

The service translates known Prisma failures into HTTP behaviour:

- `P2002` becomes `409 Conflict` when adding a duplicate product; and
- `P2025` becomes `404 Not Found` when deleting a missing user/product pair.

Unexpected persistence errors are re-thrown instead of being hidden behind an
incorrect client response.

### Explicit API response boundaries

`WatchlistResponseDto` exposes only watchlist entry fields. Listing a
watchlist reuses `ProductResponseDto`, so its output matches `GET /products`
and does not expose internal product fields such as `searchTerm` or
`updatedAt`.

### Frontend context boundaries

`AuthContext` owns the current user, login, logout, initial `GET /auth/me`
restoration, and the derived `isAuthenticated` value.

`WatchlistContext` owns the set of watched product identifiers and the shared
watch/unwatch mutation. A `Set<string>` provides constant-time membership
checks for product buttons without duplicating full product objects in the
context.

The context updates its identifier set locally after a successful API
response.

---

## Database Changes

Migration
`services/api-gateway/prisma/migrations/20260827174058_add_watchlist/migration.sql`
adds the `watchlists` table.

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | String/CUID | Primary key for the watchlist entry. |
| `userId` | String/UUID reference | Identifies the owning user. |
| `productId` | String/CUID reference | Identifies the watched product. |
| `createdAt` | DateTime | Records when the product was added. |

Database constraints and indexes:

- primary key on `id`;
- compound unique index on `(userId, productId)`;
- supporting index on `productId`;
- foreign key from `userId` to `users.id`;
- foreign key from `productId` to `products.id`; and
- cascading deletion for both relations.

The `User` and `Product` Prisma models now expose their corresponding
`Watchlist[]` relations. Cascades prevent orphaned entries when a user or
product is removed.

---

## Auth Changes

| Operation | Iteration 4 behaviour | Iteration 5 behaviour |
| --- | --- | --- |
| `POST /auth/login` | Returned the JWT to the client. | Sets `access_token` as an HTTP-only cookie and returns only the safe user. |
| `POST /auth/logout` | Did not exist. | Clears the authentication cookie and returns `200`. |
| `GET /auth/me` | Read a Bearer token. | Reads and verifies the JWT from the cookie. |
| Frontend API calls | Did not include credentials. | Shared Axios client sends credentials. |
| CORS | Origin was configured without credentials. | Allows credentials for `WEB_ORIGIN`. |

`cookie-parser` was added to the API gateway and is registered before route
handling. The Passport JWT strategy uses a dedicated cookie extractor rather
than `ExtractJwt.fromAuthHeaderAsBearerToken()`.

The login response DTO no longer contains an access-token property, so the
OpenAPI contract matches the runtime response. Swagger defines a reusable
cookie-authentication scheme for protected operations.

Iteration 5 added this environment variable:

| Variable | Purpose | Development default |
| --- | --- | --- |
| `WEB_ORIGIN` | Permitted frontend origin for credentialed CORS. | `http://localhost:5173` |

The frontend variable `VITE_API_URL` already existed and remains the Axios base
URL configuration.

---

## Watchlist API

| Endpoint | Success | Error behaviour |
| --- | --- | --- |
| `POST /watchlist/:productId` | `201` with the created watchlist entry. | `401` unauthenticated, `404` missing product, `409` duplicate entry. |
| `DELETE /watchlist/:productId` | `200` with the deleted watchlist entry. | `401` unauthenticated, `404` missing entry for that user/product pair. |
| `GET /watchlist` | `200` with watched products in watchlist insertion order. | `401` unauthenticated; an empty watchlist returns `[]`. |

The controller, service, DTO, module, Swagger declarations, unit tests, and
integration tests are grouped under `services/api-gateway/src/watchlist`.

---

## Frontend Changes

### Authentication state and pages

- `AuthProvider` wraps the application and restores a session with
  `GET /auth/me` on startup.
- `login(email, password)` calls the cookie-based login endpoint and stores
  the returned safe user in memory.
- `logout()` clears the server cookie and local user state.
- `/login` handles invalid credentials and redirects successful users to
  `/watchlist`.
- `/register` creates an account, automatically logs the user in, and then
  redirects to `/watchlist`.
- Authenticated users are redirected away from login and registration pages.

### Protected navigation

- `ProtectedRoute` waits for initial auth restoration, redirects anonymous
  users to `/login`, and renders authenticated child routes through `Outlet`.
- `/watchlist` is nested beneath `ProtectedRoute`.
- The navbar shows login/register links to anonymous users.
- Authenticated users see their display name, a watchlist link, and logout.

### Watchlist interaction

- `WatchlistContext` loads watched product IDs after authentication.
- `WatchButton` is hidden for anonymous users and toggles between Watch and
  Unwatch for authenticated users.
- `WatchButton` disables itself and shows `Loading` while its mutation is in
  flight.
- Watch controls appear on product cards and product details.
- `/watchlist` fetches watched products, displays product cards, and provides
  loading, error, and empty states.

---

## Testing

### Backend automated tests

The API gateway contains 14 Jest suites covering authentication, guards,
strategies, cookie configuration, password hashing, database lifecycle,
products, and watchlists.

The final feature verification completed successfully:

- focused watchlist integration suite: 12 of 12 tests passed;
- complete API suite: 14 suites and 70 tests passed;
- monorepo build: passed; and
- Prisma migrations and seed completed against PostgreSQL.

The watchlist integration suite boots the real Nest application, logs in with
a Supertest cookie-retaining agent, uses PostgreSQL, verifies persisted state,
and cleans up data scoped to dedicated test users. It covers:

- successful POST, DELETE, and GET requests;
- duplicate and missing-resource responses;
- an empty watchlist;
- unauthenticated access to every endpoint;
- forged ownership input; and
- cross-user list/delete isolation.

The latest main-branch workflow after the initial Iteration 5 review also
completed successfully:
[GitHub Actions run 33966924525](https://github.com/JJ-ProjectDev/pricewatch/actions/runs/33966924525).

### Frontend automated tests

No frontend test framework or frontend test files are configured. The web
workspace's test command still prints `No frontend tests configured for
Iteration 1`. Frontend verification therefore consists of the TypeScript/Vite
production build and CI build, not automated component or browser-flow tests.

---

## Known Issues

- The README now documents Iteration 5 authentication and watchlist routes,
  but its environment table still omits `WEB_ORIGIN` and shows defaults that
  differ from `.env.example` for JWT expiry, JWT secret, and RabbitMQ
  credentials. Issue #82 is closed, but its environment-table verification
  criterion needs a follow-up correction.
- The login and registration forms do not render visible submit buttons.
  Submission may depend on implicit keyboard form submission, which is not a
  complete or accessible user flow.
- `WatchlistPage` stores fetched products separately from the identifier set
  in `WatchlistContext`. Unwatching updates the context set but does not remove
  the product card until the page is refreshed.
- Product cards contain `WatchButton` inside a navigation link. Stopping event
  propagation does not cancel the link's default navigation, and nesting an
  interactive button inside an anchor is invalid interactive markup.
- The navbar stores a logout error message but never renders it, so logout
  failures are invisible to the user.
- Registration and automatic login are two separate requests. If registration
  succeeds but login fails, the account exists while the UI remains logged
  out; retrying registration then returns a conflict.
- Existing README and Iteration 4 review text contains visibly mis-decoded dash
  and arrow characters.

[Issue #89](https://github.com/JJ-ProjectDev/pricewatch/issues/89) was closed
after `WatchlistContext` had already been introduced. The remaining separation
between context identifiers and page-level product data is the concrete state
synchronisation problem to address.

---

## Technical Debt

- Add frontend unit/component tests for `AuthContext`, `ProtectedRoute`,
  `WatchButton`, and the authentication forms, plus browser-level coverage for
  register, login, watch, unwatch, and logout.
- Replace the web workspace's placeholder Iteration 1 test script with a real
  test command.
- Fix the API gateway's `test:integration` package script, which currently
  invokes itself recursively instead of selecting integration suites.
- Move the deprecated `package.json#prisma` seed configuration to a Prisma
  configuration file before upgrading to Prisma 7.
- Consolidate watchlist products and identifiers behind one state boundary so
  all pages update immediately after mutations. Use functional state updates
  to make rapid toggles safe from stale closures.
- Add accessible, styled form controls and visible pending/error feedback to
  login, registration, watchlist, and navbar interactions.
- Separate card navigation from watch/unwatch actions to avoid nested
  interactive elements.
- Review explicit CSRF protection before expanding deployment origins or
  supporting cross-site clients. `SameSite=Lax` is a useful baseline but should
  be part of a documented threat model rather than the only long-term control.
- Consider aligning cookie lifetime attributes with `JWT_EXPIRES_IN` for clear
  browser behaviour, even though an expired JWT is already rejected by the
  server.
- Add pagination before product catalogues or watchlists become large.

---

## Next Steps

Before or alongside Iteration 6:

1. Correct the remaining README environment-table discrepancies.
2. Resolve the watchlist page/context synchronisation and nested interaction
   issues.
3. Add frontend test tooling and automate the main authentication/watchlist
   user journey.
4. Fix the recursive integration-test script and migrate Prisma seed
   configuration.
5. Complete an accessibility and interaction pass on forms, product cards,
   watchlist controls, and navbar errors.

The Iteration 6 backend sequence is now represented by:

1. [#101 Scraper Service Scaffold](https://github.com/JJ-ProjectDev/pricewatch/issues/101)
2. [#102 Listing Entity and Database Schema](https://github.com/JJ-ProjectDev/pricewatch/issues/102)
3. [#103 RabbitMQ Price Queue Setup](https://github.com/JJ-ProjectDev/pricewatch/issues/103)
4. [#104 Mock Price Fetcher](https://github.com/JJ-ProjectDev/pricewatch/issues/104)
5. [#105 GET /products/:id Listings Endpoint](https://github.com/JJ-ProjectDev/pricewatch/issues/105)
6. [#106 Scraper Service Tests](https://github.com/JJ-ProjectDev/pricewatch/issues/106)

---

## Outcome

Iteration 5 establishes a complete vertical watchlist slice: React UI,
cookie-based authentication, guarded NestJS endpoints, Prisma relations,
PostgreSQL integrity rules, and database-backed integration tests.

All planned Iteration 5 issues are closed, and the latest `main` branch passes
CI. The core backend behaviours are implemented and verified. The remaining
work is primarily frontend testing and interaction polish, state
synchronisation, documentation consistency, and build-configuration cleanup.
