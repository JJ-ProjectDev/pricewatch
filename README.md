# PriceWatch

PriceWatch is a portfolio-focused retail intelligence platform. Iteration 5
adds user watchlists and auth UI: httpOnly cookie-based JWT authentication,
login and register pages, protected routes, watchlist endpoints, a watchlist
page, and watch/unwatch functionality on product pages. Business features
such as scraping, notifications, cloud deployment, and extra microservices
are intentionally not implemented yet.

## Services

- `services/web`: React + TypeScript + Vite frontend
- `services/api-gateway`: NestJS API gateway with `GET /health`, `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `GET /products`, `GET /products/:id`, `GET /watchlist`, `POST /watchlist/:productId`, and `DELETE /watchlist/:productId`
- `postgres`: PostgreSQL database
- `redis`: Redis cache
- `rabbitmq`: RabbitMQ broker with the management UI

## Environment Variables

All variables have defaults in `.env.example`. Copy it to `.env` to override locally.

| Variable          | Description                            | Default                          |
| ----------------- | -------------------------------------- | -------------------------------- |
| POSTGRES_HOST     | PostgreSQL host                        | postgres                         |
| POSTGRES_PORT     | PostgreSQL port                        | 5432                             |
| POSTGRES_USER     | PostgreSQL username                    | pricewatch                       |
| POSTGRES_PASSWORD | PostgreSQL password                    | pricewatch                       |
| POSTGRES_DB       | PostgreSQL database name               | pricewatch                       |
| DATABASE_URL      | Prisma connection string               | constructed from above           |
| REDIS_HOST        | Redis host                             | redis                            |
| REDIS_PORT        | Redis port                             | 6379                             |
| RABBITMQ_URL      | RabbitMQ connection URL                | amqp://guest:guest@rabbitmq:5672 |
| JWT_SECRET        | Secret key used to sign JWTs           | changeme                         |
| JWT_EXPIRES_IN    | How long a JWT stays valid             | 3600s                            |
| VITE_API_URL      | Base URL for the frontend Axios client | http://localhost:3000            |

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

GET /health returns a small JSON response confirming that the API gateway is running.

## Registration Endpoint

POST /auth/register accepts a JSON body and creates a new user in PostgreSQL.
Request body: { "displayName": "johndoe", "email": "john@example.com", "password": "securepassword" }
Validation rules:

- displayName — required, 3 to 12 characters
- email — required, must be a valid email address
- password — required, 10 to 25 characters
  Success response 201 Created: { "id": "clx...", "email": "...", "displayName": "...", "createdAt": "...", "updatedAt": "..." }
  Error responses: 400 Bad Request, 409 Conflict

## Login Endpoint

POST /auth/login validates credentials and sets an httpOnly cookie containing the JWT.
Request body: { "email": "john@example.com", "password": "securepassword" }
Success response 200 OK: { "user": { "id": "clx...", "email": "...", "displayName": "..." } }
Sets cookie: access_token (httpOnly, not accessible via JavaScript)
Error responses: 400 Bad Request, 401 Unauthorized

## Logout Endpoint

POST /auth/logout clears the authentication cookie.
No request body required.
Success response 200 OK

## Profile Endpoint

GET /auth/me returns the authenticated user's profile.
Requires a valid access_token cookie (set automatically by the browser after login).
Success response 200 OK: { "id": "clx...", "email": "...", "displayName": "..." }
Error response: 401 Unauthorized

## Products Endpoint

GET /products returns all products in the catalogue.
Success response 200 OK: [{ "id": "clx...", "name": "...", "description": "...", "imageUrl": "...", "createdAt": "..." }]
Returns an empty array if no products exist.

## Product Detail Endpoint

GET /products/:id returns a single product by id.
Success response 200 OK: { "id": "clx...", "name": "...", "description": "...", "imageUrl": "...", "createdAt": "..." }
Error response: 404 Not Found

## Watchlist Endpoints

All watchlist endpoints require a valid access_token cookie.

GET /watchlist returns all products on the authenticated user's watchlist.
Success response 200 OK: [{ "id": "clx...", "name": "...", "description": "...", "imageUrl": "...", "createdAt": "..." }]
Returns an empty array if the user has no watched products.

POST /watchlist/:productId adds a product to the authenticated user's watchlist.
Success response 201 Created: { "id": "clx...", "userId": "...", "productId": "...", "createdAt": "..." }
Error responses: 404 Not Found (product does not exist), 409 Conflict (already watching)

DELETE /watchlist/:productId removes a product from the authenticated user's watchlist.
Success response 200 OK
Error response: 404 Not Found (not on watchlist)

## Iteration 2 Scope

Implemented: Prisma ORM, User entity, Registration DTO, Password hashing,
POST /auth/register, Registration tests, Documentation

## Iteration 3 Scope

Implemented: POST /auth/login, GET /auth/me, Login DTO, Passport local
strategy, Passport JWT strategy, JWT signing with @nestjs/jwt, protected
route guard, Authentication tests, Documentation

## Iteration 4 Scope
Implemented: Product entity, Prisma migration, seed data, GET /products,
GET /products/:id, product endpoint tests, React Router v6, Tailwind CSS,
shadcn/ui, Axios API client, page structure and routing, layout and navbar,
product listing page, product detail page, Documentation

## Iteration 5 Scope
Implemented: httpOnly cookie-based JWT auth, POST /auth/logout, Watchlist
entity and migration, GET /watchlist, POST /watchlist/:productId,
DELETE /watchlist/:productId, watchlist endpoint tests, AuthContext,
login page, register page, protected routes, WatchlistContext,
Watch/Unwatch button, watchlist page, navbar auth states, Documentation
