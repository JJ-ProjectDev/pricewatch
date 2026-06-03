# Iteration 1 Review

## Objectives

Iteration 1 created the local development foundation for PriceWatch.

The goal was to establish a working monorepo with a React frontend, NestJS API gateway, Docker Compose infrastructure, environment documentation, README guidance, CI workflow, and a health endpoint.

Business functionality was intentionally excluded.

## Files Created

- `.dockerignore`
- `.env.example`
- `.github/workflows/ci.yml`
- `.gitignore`
- `README.md`
- `docker-compose.yml`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `services/web/Dockerfile`
- `services/web/index.html`
- `services/web/package.json`
- `services/web/src/main.tsx`
- `services/web/src/styles.css`
- `services/web/src/vite-env.d.ts`
- `services/web/tsconfig.json`
- `services/web/vite.config.ts`
- `services/api-gateway/Dockerfile`
- `services/api-gateway/nest-cli.json`
- `services/api-gateway/package.json`
- `services/api-gateway/src/app.module.ts`
- `services/api-gateway/src/health.controller.ts`
- `services/api-gateway/src/main.ts`
- `services/api-gateway/tsconfig.build.json`
- `services/api-gateway/tsconfig.json`

## Architecture Decisions

- Used pnpm workspaces for monorepo package management.
- Kept only two application services for Iteration 1: `web` and `api-gateway`.
- Used Docker Compose as the local orchestration layer.
- Added PostgreSQL, Redis, and RabbitMQ as infrastructure containers only.
- Exposed `GET /health` from the API gateway as the first operational endpoint.
- Kept frontend content minimal and foundation-focused.
- Avoided authentication, domain models, extra microservices, scraping, notifications, and cloud deployment.
- Used GitHub Actions to run install, build, and test commands through pnpm.

## Testing Performed

- Ran `pnpm install --frozen-lockfile`.
- Ran `pnpm build`.
- Ran `pnpm test`.
- Ran `docker compose config`.
- Ran `docker compose build web api-gateway`.
- Ran `docker compose up -d`.
- Verified `GET http://localhost:3000/health`.
- Verified the frontend responded with HTTP `200` at `http://localhost:5173`.
- Confirmed PostgreSQL, Redis, and RabbitMQ reported healthy in Docker Compose.
- Stopped the stack with `docker compose down`.

## Known Issues

- No application-level database, cache, or message broker integration exists yet.
- Tests are placeholder-level for Iteration 1.
- The API health endpoint only confirms the gateway process is running.
- Docker Compose uses development-oriented containers and commands.

## Technical Debt

- Add real unit and integration tests once service behavior exists.
- Add structured configuration validation for environment variables.
- Add API request logging and operational middleware when endpoints expand.
- Consider separate development and production Dockerfiles as the system matures.
- Add health checks that verify downstream dependencies when the API begins using them.

## Recommendations

- Keep Iteration 2 narrowly scoped before adding more services.
- Add domain features only after the foundation remains stable in CI and Docker.
- Introduce database migrations before creating persistent business data.
- Add contract tests as service boundaries become meaningful.
- Continue documenting each iteration with review notes like this one.
