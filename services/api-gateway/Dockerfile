FROM node:24-alpine

WORKDIR /repo

RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/api-gateway/package.json services/api-gateway/package.json
RUN pnpm install --filter @pricewatch/api-gateway --frozen-lockfile

COPY services/api-gateway services/api-gateway

WORKDIR /repo/services/api-gateway
EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
