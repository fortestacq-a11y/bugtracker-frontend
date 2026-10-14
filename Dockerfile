# syntax=docker/dockerfile:1
#
# BugTracker Web — React 18 + Vite 6 + Tailwind 3
# Multi-stage: Node builds the bundle, nginx serves it and reverse-proxies /api.
#
# Build from THIS directory (the build context is the frontend root):
#   podman build -t <user>/bugtracker-web:latest .
#
# With podman, add `--format docker` (scripts/docker-build.sh does this for you) so
# the HEALTHCHECK survives — podman's default OCI format drops it.
#
# Why nginx proxies /api instead of the bundle calling the API directly:
# src/api/client.js uses relative '/api/...' paths. That is what makes the Vite dev
# proxy work (vite.config.js -> localhost:8080), and keeping the same relative path in
# production means ONE code path in the client. Reproducing that proxy in nginx is what
# keeps this true — and it also means the browser never makes a cross-origin request, so
# the API's CORS config is not load-bearing in production.

# ── Stage 1: build the bundle ───────────────────────────────────────────────
FROM docker.io/library/node:22-alpine AS build

WORKDIR /app

# package-lock.json is committed, so `npm ci` is reproducible and installs exactly the
# versions that were tested. It needs both files present to run at all.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci

COPY . .

# `vite build` is the whole build step. No env vars are injected at build time on
# purpose: the client talks to a relative /api path, so the same bundle works against
# any backend hostname with no rebuild.
ENV NODE_ENV=production
RUN npm run build

# Fail the image build rather than shipping a container that serves nothing.
RUN test -f dist/index.html || (echo "dist/index.html missing — vite build produced nothing" && exit 1)

# ── Stage 2: serve ──────────────────────────────────────────────────────────
FROM docker.io/library/nginx:1.27-alpine

# The official entrypoint runs envsubst over /etc/nginx/templates/*.template before
# nginx starts, which is how the API upstream stays configurable per deployment.
# PORT is a real default, not a placeholder: Railway injects its own PORT at runtime
# (which overrides this ENV) and routes traffic to whatever it says. Locally and in
# compose nothing overrides it, so nginx stays on 80.
ENV PORT=80 \
    API_UPSTREAM=http://backend:8080 \
    NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template \
    NGINX_ENVSUBST_FILTER="^(API_|PORT)"

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1 hits nginx without leaving the container's network namespace.
# Uses ${PORT} rather than a literal so this still checks the right port when a PaaS
# reassigns it.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/" || exit 1

STOPSIGNAL SIGQUIT