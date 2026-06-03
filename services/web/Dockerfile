FROM node:24-alpine

WORKDIR /repo

RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/web/package.json services/web/package.json
RUN pnpm install --filter @pricewatch/web --frozen-lockfile

COPY services/web services/web

WORKDIR /repo/services/web
EXPOSE 5173

CMD ["pnpm", "run", "dev"]
