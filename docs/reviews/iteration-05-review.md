
# Iteration 5 Review

## Objectives

Iteration 5 added user watchlists and the frontend auth UI, making
PriceWatch functional end to end for the first time.

The goals were: allow users to register and log in through the browser,
protect routes that require authentication, and let authenticated users
add and remove products from a personal watchlist.

This iteration also migrated JWT storage from a response body token to
an httpOnly cookie, improving security before any user-facing auth UI
was built.

---

## Files Created

### Backend

- `services/api-gateway/prisma/migrations/<timestamp>_add_watchlist/migration.sql`
- `services/api-gateway/src/watchlist/watchlist.module.ts`
- `services/api-gateway/src/watchlist/watchlist.service.ts`
- `services/api-gateway/src/watchlist/watchlist.controller.ts`
- `services/api-gateway/src/watchlist/watchlist.controller.spec.ts`

### Frontend

- `services/web/src/contexts/AuthContext.tsx`
- `services/web/src/contexts/WatchlistContext.tsx`
- `services/web/src/components/auth/ProtectedRoute.tsx`
- `services/web/src/components/watchlist/WatchButton.tsx`
- `services/web/src/pages/LoginPage.tsx`
- `services/web/src/pages/RegisterPage.tsx`
- `services/web/src/pages/WatchlistPage.tsx`

### Files Updated

- `services/api-gateway/src/auth/auth.controller.ts` — login now sets
  httpOnly cookie, logout endpoint added
- `services/api-gateway/src/auth/jwt.strategy.ts` — reads token from
  cookie instead of Authorization header
- `services/api-gateway/prisma/schema.prisma` — Watchlist model added,
  relations added to User and Product
- `services/web/src/App.tsx` — new routes and ProtectedRoute wrapper
- `services/web/src/components/layout/Navbar.tsx` — auth-aware states
- `services/web/src/pages/ProductsPage.tsx` — WatchButton added to cards
- `services/web/src/pages/ProductDetailPage.tsx` — WatchButton added
- `services/web/src/lib/api.ts` — withCredentials: true added

---

## Architecture Decisions

- JWT is now stored in an httpOnly cookie set by the server on login,
  rather than returned in the response body for the frontend to store.
  This prevents the token from being accessible via JavaScript and
  eliminates a class of XSS-based token theft. The Axios instance uses
  `withCredentials: true` so the browser sends the cookie automatically
  on every request.
- `POST /auth/logout` clears the cookie server-side. The frontend never
  had direct access to the token, so clearing it requires a server round
  trip rather than just deleting from localStorage.
- The JWT strategy was updated to extract the token from the cookie
  rather than the Authorization Bearer header. This is a breaking change
  to the previous iteration's auth flow and was handled as a planned
  migration in Issue #1.
- `AuthContext` calls `GET /auth/me` on app startup to restore the
  authenticated user from the cookie if it is still valid. This means
  a user who previously logged in will still be authenticated after a
  page refresh without needing to log in again.
- `WatchlistContext` stores watched product ids as a `Set<string>`
  rather than the full product objects. This keeps the context lean —
  the full product data already lives in the page-level fetch — and
  makes `has()` checks O(1) for the Watch button state.
- `WatchlistContext` depends on `AuthContext` via `useAuth()` and waits
  for `isLoading` to resolve before fetching. If the user is not
  authenticated it sets an empty Set and returns immediately. This
  prevents unnecessary API calls for unauthenticated users.
- `toggleWatch` in `WatchlistContext` performs an optimistic local state
  update immediately after the API call succeeds, without refetching
  the full watchlist. This keeps the Watch button state snappy.
- The Watchlist table uses a composite unique constraint on
  `[userId, productId]` to prevent duplicate entries at the database
  level. The endpoint returns 409 Conflict if a duplicate is attempted.
- Cascade deletes are configured on both foreign keys — deleting a user
  removes their watchlist entries, deleting a product removes all
  watchlist entries for that product.
- `ProtectedRoute` reads `isAuthenticated` from `AuthContext` and
  redirects to `/login` if false. It also waits for `isLoading` to
  resolve before making the redirect decision, preventing a flash
  redirect on page load while the auth state is being restored.

---

## Auth Flow

```
POST /auth/login
      ↓
LocalAuthGuard → LocalStrategy.validate()
      ↓
AuthService.validateUser(email, password)
      ↓
bcrypt.compare(password, passwordHash)
      ↓
JwtService.sign({ sub, email, displayName })
      ↓
Response sets httpOnly cookie: access_token
Returns { user: { id, email, displayName } }


Subsequent authenticated requests
      ↓
Browser sends access_token cookie automatically
      ↓
JwtAuthGuard → JwtStrategy.validate(payload)
      ↓
Attaches AuthenticatedUser to request.user


POST /auth/logout
      ↓
Server clears the access_token cookie
Returns 200 OK
```

---

## Frontend Auth Flow

```
App startup
      ↓
AuthProvider mounts → GET /auth/me
      ↓
Cookie valid → setUser(response.data) → isAuthenticated: true
Cookie invalid/missing → setUser(null) → isAuthenticated: false
      ↓
WatchlistProvider reads isAuthenticated
      ↓
Authenticated → GET /watchlist → setWatchlistIds(new Set(ids))
Not authenticated → setWatchlistIds(new Set())
```

---

## Database Changes

A new `watchlists` join table was added via a Prisma migration.

| Column        | Type          | Notes                                   |
| ------------- | ------------- | --------------------------------------- |
| `id`        | String (cuid) | Primary key                             |
| `userId`    | String        | Foreign key → users, cascade delete    |
| `productId` | String        | Foreign key → products, cascade delete |
| `createdAt` | DateTime      | Auto-set on create                      |

Constraints:

- Unique on `[userId, productId]` — a user cannot watch the same product twice
- Index on `productId` — for efficient lookups by product

Relations added to existing models:

- `User.watchlist Watchlist[]`
- `Product.watchlist Watchlist[]`

---

## New Environment Variables

None. All existing environment variables remain unchanged.

---

## Testing

- `POST /watchlist/:productId` adds a product and returns 201
- `POST /watchlist/:productId` returns 409 if product already on watchlist
- `POST /watchlist/:productId` returns 404 if product does not exist
- `DELETE /watchlist/:productId` removes a product and returns 200
- `DELETE /watchlist/:productId` returns 404 if entry does not exist
- `GET /watchlist` returns the user's watched products
- `GET /watchlist` returns empty array if no watched products
- All watchlist endpoints return 401 if no valid cookie is present
- Tests use Jest and Supertest

---

## Known Issues

- No loading state on the Watch button while the toggle API call is
  in flight. A rapid double-click can send duplicate requests.
- Register page calls `POST /auth/register` directly via Axios then
  calls `login()` from AuthContext as a second step. If the login call
  fails after a successful register the user is registered but not
  logged in and sees no clear error.
- The watchlist page fetches from `GET /watchlist` independently of
  `WatchlistContext`. If a product is unwatched from the watchlist page
  the card disappears from the grid but the context Set is not updated
  until the next mount.

---

## Technical Debt

- Add a debounce or disabled state to the Watch button during in-flight
  requests to prevent duplicate API calls.
- Unify the watchlist page data source with `WatchlistContext` so
  unwatch actions on the watchlist page update the context immediately.
- Add Google OAuth as an additional login method (planned for a future
  iteration).
- Add refresh token support — the access token has a short expiry and
  currently requires re-login when it expires.
- Add email verification on register.
- Consider storing `createdAt` in the JWT payload so `GET /auth/me`
  can return it without a database lookup.

---

## Next Steps

- Iteration 6: Scraper service — a separate NestJS microservice that
  uses each product's `searchTerm` to fetch live prices from the eBay
  API, publishing results to RabbitMQ for the api-gateway to consume
  and store in a new `Listing` table.
- Iteration 6: `Listing` table — links fetched prices to products by
  `productId`, enabling price history and the foundation for alerts.
- Iteration 7: Alerts — notify users via email when a watched product
  drops below a price threshold.
