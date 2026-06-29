
# Iteration 3 Review

## Objectives

Iteration 3 built the login and JWT authentication system on top of the
user registration foundation from Iteration 2.

The goal was to allow a registered user to log in, receive a signed JWT
access token, and use that token to access protected routes.

Business functionality beyond authentication was intentionally excluded.

---

## Files Created

- `services/api-gateway/src/auth/auth.types.ts`
- `services/api-gateway/src/auth/auth.controller.ts` (updated)
- `services/api-gateway/src/auth/auth.module.ts` (updated)
- `services/api-gateway/src/auth/auth.service.ts` (updated)
- `services/api-gateway/src/auth/jwt.config.ts`
- `services/api-gateway/src/auth/jwt.strategy.ts`
- `services/api-gateway/src/auth/jwt-auth.guard.ts`
- `services/api-gateway/src/auth/jwt-auth.guard.spec.ts`
- `services/api-gateway/src/auth/local.strategy.ts`
- `services/api-gateway/src/auth/local-auth.guard.ts`
- `services/api-gateway/src/auth/local-auth.guard.spec.ts`
- `services/api-gateway/src/auth/login.dto.ts`
- `services/api-gateway/src/auth/password-hashing.service.ts` (updated)

---

## Architecture Decisions

- Used `@nestjs/passport` with `passport-local` for login credential
  validation and `passport-jwt` for JWT token verification. This is the
  idiomatic NestJS approach and integrates cleanly with Guards and
  Strategies.
- JWT configuration is environment-driven via `jwt.config.ts`. Secrets
  never live in code.
- The JWT payload contains `sub` (user id), `email`, and `displayName`.
  This avoids a database lookup on every authenticated request.
- A `SafeUser` interface was defined for cases where `createdAt` is
  needed. `AuthenticatedUser` is the leaner type attached to `request.user`
  after JWT validation.
- `LoginResponse` returns both an `accessToken` and the authenticated
  user object so the frontend can store user details without an extra
  request.
- JWT expiry is set to `15m` in the development environment. This is
  intentionally short and reflects real-world security practice. Refresh
  tokens are noted as technical debt.
- `JwtModule.registerAsync` with `useFactory` was used so the module
  reads secrets at runtime rather than at import time, keeping
  configuration consistent with the environment-driven approach used
  elsewhere.
- Guards (`JwtAuthGuard`, `LocalAuthGuard`) are thin wrappers around the
  Passport strategies, following the NestJS convention for reusable route
  protection.

---

## Auth Flow

```
POST /auth/login
      ↓
LocalAuthGuard
      ↓
LocalStrategy.validate(email, password)
      ↓
AuthService.validateUser(email, password)
      ↓
bcrypt.compare(password, passwordHash)
      ↓
Returns AuthenticatedUser (no passwordHash)
      ↓
AuthService.login(user)
      ↓
JwtService.sign({ sub, email, displayName })
      ↓
Returns LoginResponse { accessToken, user }



GET /auth/me (protected)
      ↓
JwtAuthGuard
      ↓
JwtStrategy.validate(payload)
      ↓
Attaches AuthenticatedUser to request.user
      ↓
Returns { id, email, displayName }
```

---

## Database Changes

No new database migrations in Iteration 3. The existing User table from
Iteration 2 was sufficient. Prisma was used only for user lookup during
login credential validation.

---

## New Environment Variables

| Variable           | Description                               | Default                                 |
| ------------------ | ----------------------------------------- | --------------------------------------- |
| `JWT_SECRET`     | Secret used to sign and verify JWT tokens | `pricewatch_dev_jwt_secret_change_me` |
| `JWT_EXPIRES_IN` | JWT token expiry duration                 | `15m`                                 |

---

## Testing

- Successful login returns `accessToken` and user object
- Invalid password returns `401 Unauthorized`
- Non-existent email returns `401 Unauthorized`
- Missing fields returns `400 Bad Request`
- `GET /auth/me` with valid token returns user profile
- `GET /auth/me` without token returns `401 Unauthorized`
- Tests use Jest and Supertest
- `JwtAuthGuard` and `LocalAuthGuard` unit tested

---

## Known Issues

- `GET /auth/me` does not return `createdAt` — the JWT payload contains
  only `id`, `email`, and `displayName`. A database lookup would be
  required to include `createdAt`.
- No refresh token mechanism exists. The access token expires after `15m`
  and the user must log in again.

---

## Technical Debt

- Implement refresh tokens and a `POST /auth/refresh` endpoint.
- Add `createdAt` to `GET /auth/me` either via a database lookup or by
  including it in the JWT payload.
- Add token blacklisting or a revocation strategy for logout.
- Consider separating auth logic into its own microservice as the system
  grows.
- Add role-based access control (RBAC) when user roles become relevant.
- Review JWT expiry for production — `15m` is appropriate but should be
  configurable per environment.

---

## Next Steps

- Iteration 4: Product catalogue — product entity, seed data, and
  `GET /products` and `GET /products/:id` endpoints in the api-gateway.
- Iteration 4: Frontend setup — React Router, Tailwind CSS, shadcn/ui,
  Axios API client, and page structure for the web service.
- From Iteration 4 onwards the team splits: backend owns the product
  and scraper services, frontend owns the React application.

