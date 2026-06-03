# PriceWatch

PriceWatch is a portfolio-focused retail intelligence platform. Iteration 1 is a working development foundation only: React frontend, NestJS API gateway, PostgreSQL, Redis, RabbitMQ, Docker Compose, and CI.

Business features such as authentication, products, watchlists, alerts, scraping, notifications, cloud deployment, and extra microservices are intentionally not implemented yet.

## Services

- `services/web`: React + TypeScript + Vite frontend
- `services/api-gateway`: NestJS API gateway with `GET /health`
- `postgres`: PostgreSQL database
- `redis`: Redis cache
- `rabbitmq`: RabbitMQ broker with the management UI

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
