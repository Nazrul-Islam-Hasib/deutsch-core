# syntax=docker/dockerfile:1

# ---------- base: Node + OpenSSL (Prisma needs it) ----------
FROM node:22-bookworm-slim AS base
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ---------- deps: all dependencies (incl. dev) ----------
# prisma/ must exist before `npm ci` because package.json has
# "postinstall": "prisma generate".
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---------- build: compile TypeScript ----------
FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- migrate: one-off job target (needs the prisma CLI) ----------
# Used by docker compose ("migrate" service) and later as an ECS one-off task:
#   prisma migrate deploy applies the SQL files in prisma/migrations.
FROM deps AS migrate
CMD ["npx", "prisma", "migrate", "deploy"]

# ---------- runtime: small production image ----------
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000
COPY package.json package-lock.json ./
# Production deps only; skip postinstall (prisma CLI is a devDependency).
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
# The generated Prisma client comes from the build stage.
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# tsconfig has rootDir "./src", so the entry is dist/index.js (same as "start").
CMD ["node", "dist/index.js"]
