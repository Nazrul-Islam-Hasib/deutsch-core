# syntax=docker/dockerfile:1

# ---------- build: Vite production build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# VITE_API_URL is baked in at build time. "/api" = same-origin; nginx proxies
# /api/* to the backend. Must not be empty (src/config/api.ts falls back to the
# Vercel URL when the value is falsy).
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- runtime: nginx serves the SPA and proxies the API ----------
FROM nginx:1.27-alpine AS runtime
# Files in /etc/nginx/templates/*.template are run through envsubst at start.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV BACKEND_HOST=backend \
    BACKEND_PORT=3000
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/nginx-health || exit 1
