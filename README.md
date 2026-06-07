# PriceWatch

PriceWatch is a portfolio-focused retail intelligence platform. Iteration 2
adds database-backed user registration: Prisma ORM, a User entity, a
registration endpoint, DTO validation, password hashing, and tests.
Business features such as login, JWT authentication, products, watchlists,
alerts, scraping, notifications, cloud deployment, and extra microservices
are intentionally not implemented yet.

## Services

- `services/web`: React + TypeScript + Vite frontend
- `services/api-gateway`: NestJS API gateway with `GET /health` and `POST /auth/register`
- `postgres`: PostgreSQL database
- `redis`: Redis cache
- `rabbitmq`: RabbitMQ broker with the management UI

## Environment Variables

All variables have defaults in `.env.example`. Copy it to `.env` to override locally.

| Variable | Description | Default |
|---|---|---|
| POSTGRES_HOST | PostgreSQL host | postgres |
| POSTGRES_PORT | PostgreSQL port | 5432 |
| POSTGRES_USER | PostgreSQL username | pricewatch |
| POSTGRES_PASSWORD | PostgreSQL password | pricewatch |
| POSTGRES_DB | PostgreSQL database name | pricewatch |
| DATABASE_URL | Prisma connection string | constructed from above |
| REDIS_HOST | Redis host | redis |
| REDIS_PORT | Redis port | 6379 |
| RABBITMQ_URL | RabbitMQ connection URL | amqp://guest:guest@rabbitmq:5672 |

## Prerequisites

- Node.js 24 LTS
- pnpm
- Docker Desktop or Docker Engine with Docker Compose

## Local Development

Copy the example environment file if you want to override defaults:

```bash
cp .env.example .env
```

Start the full local environment:

```bash
docker compose up
```

Useful URLs:

- Frontend: http://localhost:5173
- API health: http://localhost:3000/health
- RabbitMQ management: http://localhost:15672

Default RabbitMQ credentials are defined in `.env.example`.

## Running Without Docker

Install workspace dependencies:

```bash
pnpm install
```

Run the frontend:

```bash
pnpm dev:web
```

Run the API gateway:

```bash
pnpm dev:api
```

Build all workspaces:

```bash
pnpm build
```

Run tests where present:

```bash
pnpm test
```

## Health Endpoint

`GET /health` returns a small JSON response confirming that the API gateway is running.

Example response:

```json
{
  "status": "ok",
  "service": "api-gateway"
}
```

## Registration Endpoint

`POST /auth/register` accepts a JSON body and creates a new user in PostgreSQL.

Request body:
```json
{
  "displayName": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Validation rules:
- `displayName` — required, 3 to 12 characters
- `email` — required, must be a valid email address
- `password` — required, 10 to 25 characters

Success response `201 Created`:
```json
{
  "id": "clx...",
  "email": "john@example.com",
  "displayName": "johndoe",
  "createdAt": "2026-06-05T14:00:00.000Z",
  "updatedAt": "2026-06-05T14:00:00.000Z"
}
```

Error responses:
- `400 Bad Request` — validation failed
- `409 Conflict` — email already registered

## Iteration 1 Scope

Implemented:

- Monorepo workspace structure
- React + TypeScript + Vite frontend
- NestJS API gateway
- Docker Compose with PostgreSQL, Redis, and RabbitMQ
- `.env.example`
- GitHub Actions CI workflow
- API `GET /health` endpoint

Not implemented in Iteration 1:

- Authentication
- Products
- Watchlists
- Alerts
- Scraping
- Notifications
- AWS deployment
- Additional microservices

## Iteration 2 Scope

Implemented:
- Prisma ORM integration
- User entity and database schema
- Registration DTO with class-validator
- Password hashing service using bcrypt
- POST /auth/register endpoint
- Registration tests with Jest and Supertest
- Documentation updates

Not implemented yet:
- Login
- JWT authentication
- Products
- Watchlists
- Alerts
- Scraping
- Notifications
- AWS deployment
- Additional microservices
