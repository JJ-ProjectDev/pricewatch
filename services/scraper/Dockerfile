FROM node:24-alpine

WORKDIR /repo

RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY services/scraper/package.json services/scraper/package.json
RUN pnpm install --filter @pricewatch/scraper --frozen-lockfile

COPY services/scraper services/scraper

WORKDIR /repo/services/scraper

EXPOSE 3001

CMD ["pnpm", "run", "start:dev"]
