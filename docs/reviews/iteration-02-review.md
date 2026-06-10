# Iteration 02 Review - User Registration Foundation

## Status

Completed

---

## Objectives

Iteration 2 built the database-backed user registration foundation for PriceWatch.

The primary goal was to move beyond the Iteration 1 project scaffold and add persistent user registration through the API gateway.

Completed scope:

* PostgreSQL integration from the NestJS API gateway
* Prisma setup and generated client workflow
* User database schema and migration
* Isolated password hashing service
* `POST /auth/register`
* Request validation
* Duplicate email protection
* Safe registration responses that do not expose password hashes
* Automated tests for hashing and registration behavior
* Docker Compose verification against PostgreSQL

Out of scope:

* Login
* JWT authentication
* Refresh tokens
* User profile management
* Product catalogue
* Price tracking
* Watchlists
* Alerts
* Notifications
* AWS deployment
* Additional microservices

---

## Architecture Decisions

### ORM

**Decision:** Prisma

**Rationale:**

* Strong TypeScript support
* Good fit for NestJS service development
* Clear migration workflow
* Generated client gives type-safe database access
* Suitable for future schema growth

### Database

**Decision:** PostgreSQL

**Rationale:**

* Mature relational database
* Strong indexing and uniqueness support
* Works cleanly in Docker Compose
* Suitable for future product, watchlist, alert, and analytics data

### Password Hashing

**Decision:** Argon2id

**Rationale:**

* Modern password hashing algorithm
* Resistant to GPU-focused attacks
* Better production posture than general-purpose hashing
* Supports future login verification through a dedicated `verify()` method

### Validation

**Decision:** `class-validator`, `class-transformer`, and NestJS `ValidationPipe`

**Rationale:**

* Standard NestJS validation approach
* Keeps DTO validation declarative
* Produces consistent `400 Bad Request` responses for invalid registration input
* Prevents unknown request fields from flowing into application logic

### Service Boundaries

**Decision:** Keep hashing, persistence, and HTTP handling separated.

**Rationale:**

* `PasswordHashingService` owns password hashing and verification
* `AuthService` owns registration workflow and duplicate email handling
* `AuthController` owns the HTTP route
* `PrismaService` owns database lifecycle connection and shutdown

---

## Database Changes

### Tables Created

#### `users`

Fields:

```text
id
email
displayName
passwordHash
createdAt
updatedAt
```

### Constraints

* Primary key on `id`
* Unique constraint on `email`
* Required fields for `email`, `displayName`, and `passwordHash`
* Automatic `createdAt` default timestamp
* Automatic `updatedAt` update timestamp

### Relationships

None added in this iteration.

### Migrations

Added the initial user table migration:

```text
services/api-gateway/prisma/migrations/20260607170000_add_users/migration.sql
```

### Environment

Database connectivity uses `DATABASE_URL`.

Docker Compose passes the API gateway a PostgreSQL URL that points at the Compose `postgres` service. `.env.example` also includes a `LOCAL_DATABASE_URL` for local tooling that connects through `localhost`.

---

## Implementation Summary

### Features Added

* Prisma client generation for the API gateway
* Global NestJS database module
* Prisma service lifecycle connection with startup log
* Argon2id password hashing service
* User registration service
* Registration controller
* User table migration
* Duplicate email handling
* Global request validation

### Endpoint Added

```http
POST /auth/register
```

Expected request:

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "displayName": "Example User"
}
```

Successful response:

```json
{
  "id": "generated-id",
  "email": "user@example.com",
  "displayName": "Example User",
  "createdAt": "timestamp"
}
```

Failure responses:

* `400 Bad Request` for invalid registration input
* `409 Conflict` for duplicate email registration

The response intentionally does not include `passwordHash`.

---

## Testing

### Automated Tests Added

Password hashing tests:

* Hashes plaintext passwords
* Hash output is not equal to plaintext
* Hash output uses Argon2id
* Verifies the correct password
* Rejects an incorrect password

Registration service tests:

* Persists a registered user with a password hash
* Normalizes email before persistence
* Rejects duplicate email registration
* Does not return `passwordHash`

Registration controller tests:

* Successful registration returns `201 Created`
* Invalid registration input returns `400 Bad Request`
* Duplicate email returns `409 Conflict`
* Successful response excludes `passwordHash`

Database service tests:

* Connects during NestJS module initialization
* Disconnects during NestJS module shutdown

### Verification Commands

The following commands were run during implementation:

```bash
pnpm --filter @pricewatch/api-gateway run build
pnpm --filter @pricewatch/api-gateway run test
pnpm build
pnpm test
docker compose config
docker compose up -d --build api-gateway
docker compose logs api-gateway
docker compose down
```

### Manual Verification

Docker Compose verification confirmed:

* PostgreSQL became healthy before the API gateway started
* Prisma migration applied successfully
* API gateway logged `Connected to PostgreSQL`
* `GET /health` returned the expected health response
* `POST /auth/register` returned `201 Created`
* Duplicate registration returned `409 Conflict`
* Invalid registration input returned `400 Bad Request`
* Registered user was persisted in PostgreSQL
* Stored password value was an Argon2id hash
* Registration response did not include `passwordHash`

---

## Known Issues

No blocking runtime issues are known for the completed Iteration 2 scope.

Notes:

* The implementation PRs were intentionally stacked so each issue remained reviewable.
* Local build artifacts under `services/api-gateway/dist` can be rewritten by Docker bind mounts; if ownership changes, local rebuilds may require cleaning or restoring ownership of that untracked directory.
* Registration tests cover the acceptance path, duplicate email, invalid input, and password hash omission. A dedicated missing-password test can still be added as a small follow-up if Issue 6 needs exact one-to-one test naming.

---

## Technical Debt

* Add database-backed integration tests for registration once the test database strategy is formalized.
* Add structured environment validation for required variables such as `DATABASE_URL`.
* Add request logging and error observability before production deployment.
* Add authentication-specific response DTO conventions before login and JWT work begins.
* Consider a separate production Docker startup path instead of using development watch mode.

---

## Metrics

### Main Areas Changed

* API gateway package dependencies and scripts
* Prisma schema and migrations
* Database module and Prisma service
* Auth module, controller, service, DTO, and tests
* Docker build/startup generation flow
* Environment example documentation

### Tests Added

* Password hashing service tests
* Prisma service lifecycle tests
* Auth service registration tests
* Auth controller HTTP behavior tests

### Endpoints Added

```http
POST /auth/register
```

### Database Tables Added

```text
users
```

---

## Next Steps

### Iteration 03 - Authentication

Planned scope:

* Login endpoint
* Password verification during login
* JWT authentication
* Protected routes
* Current user endpoint
* Authentication guards

### Recommended Follow-Ups

* Add exact missing-password registration test coverage if tracked separately.
* Add integration test database setup.
* Document local Prisma commands in the README.
* Decide whether user email should be case-insensitive at the database level.

---

## Outcome

Iteration 2 successfully delivered the database-backed registration foundation for PriceWatch.

The system can now connect to PostgreSQL, create the user table through Prisma migrations, hash passwords with Argon2id, register users through `POST /auth/register`, reject duplicate emails, validate invalid input, and return safe user registration responses without exposing password hashes.
