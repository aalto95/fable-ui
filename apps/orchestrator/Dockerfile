# SDUI orchestrator — build from monorepo root:
#   docker build -f apps/orchestrator/Dockerfile .
FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/fable-ui/package.json ./packages/fable-ui/
COPY apps/orchestrator/package.json ./apps/orchestrator/

RUN pnpm install --frozen-lockfile --filter fable-ui-orchestrator...

COPY packages/shared ./packages/shared
COPY packages/fable-ui ./packages/fable-ui
COPY apps/orchestrator ./apps/orchestrator

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR /app
CMD ["pnpm", "--filter", "fable-ui-orchestrator", "start"]
