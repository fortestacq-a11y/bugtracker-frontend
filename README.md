# BugTracker — Web

React single-page app for the BugTracker: login/register, projects, a filterable
issue board, issue detail, member management and a stats dashboard.

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Icons | lucide-react |
| Runtime | Node 22 |
| Production server | nginx 1.27-alpine |

The backend is a separate Spring Boot service that lives in its own repository.
This repo contains only the frontend.

## Quick start

```bash
npm ci        # package-lock.json is committed, so this is reproducible
npm run dev   # http://localhost:5173
```

The backend must be running on `http://localhost:8080` for login and data to work.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR on port 5173 |
| `npm run build` | Production bundle into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

## How it talks to the API

`src/api/client.js` calls **relative `/api/...` paths only** — there is no API base
URL and nothing is injected at build time. That single decision is what keeps the
same bundle working in every environment:

| Environment | Who resolves `/api` |
|---|---|
| `npm run dev` | Vite dev proxy → `http://localhost:8080` (`vite.config.js`) |
| Production (container) | nginx reverse proxy → `$API_UPSTREAM` (`nginx.conf.template`) |
| Static hosting | Your platform's rewrite rule |

Because the browser only ever makes same-origin requests, the API's CORS config is
not load-bearing in production, and moving the backend to a different hostname needs
no rebuild — just set `API_UPSTREAM`.

Auth tokens are stored in `localStorage` under `bugtracker_jwt_token` (with the
cached user under `bugtracker_user_info`). The fetch wrapper injects the
`Authorization: Bearer` header, and on any `401` it clears the stored token and
emits an auth event that `AuthContext` turns into a redirect to the login screen.

## Docker

The `Dockerfile` is a multi-stage build: Node compiles the bundle, then nginx
serves it and reverse-proxies `/api`.

```bash
podman build --format docker -t bugtracker-web:latest .
docker run --rm -p 5173:80 \
  -e API_UPSTREAM=http://<backend-host>:8080 \
  bugtracker-web:latest
```

`--format docker` matters with podman — its default OCI output format drops the
`HEALTHCHECK`, so the image would come up without a readiness signal.

### Container environment variables

| Variable | Default | Purpose |
|---|---|---|
| `API_UPSTREAM` | `http://backend:8080` | Where nginx proxies `/api` |
| `PORT` | `80` | Listen port. PaaS providers such as Railway inject their own at runtime and route to it. |

Both are substituted into `nginx.conf.template` by the nginx image's entrypoint at
container start, not at image build time.

The build fails loudly if `dist/index.html` is missing, rather than shipping a
container that serves nothing.

## Layout

```
src/
  api/client.js          fetch wrapper: auth header, 401 handling, error mapping
  context/AuthContext.jsx  session state, login/logout, user switching
  components/            Navbar, Toast, Badges, FilterBar
  features/issues/       board, list, card, detail drawer, create/edit modal
  features/projects/     project modal, member manager
  features/stats/        stats dashboard
  hooks/                 data fetching for issues, projects, members, toasts
  pages/                 Login, Register
```
