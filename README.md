# MS To Do – Custom UI + Microsoft Graph

A vibrant Microsoft To Do experience with an animated, glassy UI. Tasks stay in Microsoft To Do (via Graph API) while the app stores only minimal user/JWT mapping and audit logs in PostgreSQL.

## Highlights

- Animated, colorful frontend (Vite + React + Tailwind) with glassmorphism.
- Microsoft auth (MSAL popup). Password rules are enforced by Microsoft; the app never handles your password.
- Task lists and tasks read/write directly to Microsoft To Do via the backend.
- Backend: Node/Express, JWT auth, PostgreSQL for app users + activity logs.
- Dockerized frontend, backend, and Postgres for quick start.

## Architecture at a glance

1. User signs in with Microsoft via MSAL popup; backend exchanges and links account.
2. Backend issues a short-lived app JWT for protecting its API routes.
3. Task CRUD calls go to the backend, which proxies to Microsoft Graph with the stored MS access token.

## Quick start (Docker)

```bash
docker-compose up --build
```

Then open:
- Frontend: http://localhost:5173
- Backend health: http://localhost:5000/health

## Manual setup (without Docker)

Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend
```bash
cd backend
npm install
npm run dev
```

PostgreSQL
- Create a database (default name: `ms_todo_app`).
- Ensure credentials match the env vars below.

## Environment variables

Backend (`backend/.env`)
- `DB_HOST=postgres`
- `DB_PORT=5432`
- `DB_NAME=ms_todo_app`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `JWT_SECRET=your_jwt_secret`
- `MS_CLIENT_ID=your_aad_app_id`
- `MS_CLIENT_SECRET=your_aad_app_secret`
- `MS_TENANT_ID=common` (or your tenant id)
- `MS_REDIRECT_URI=http://localhost:5173`

Frontend (`frontend/.env`)
- `VITE_API_BASE_URL=http://localhost:5000/api`
- `VITE_MSAL_CLIENT_ID=your_aad_app_id`
- `VITE_MSAL_TENANT_ID=common` (or your tenant id)

## Useful scripts

Frontend
- `npm run dev` – start Vite dev server.
- `npm run build` – production build.

Backend
- `npm run dev` – start API with nodemon.
- `npm test` – run tests (if present).

## Notes on security

- Passwords never pass through this app; Microsoft handles authentication. The app only stores JWT + user linkage and logs in PostgreSQL.
- Set a strong `JWT_SECRET` and rotate regularly.
- Prefer `common` for multi-tenant; set your tenant ID for single-tenant setups.

## Troubleshooting

- 401s to the backend: ensure `JWT_SECRET` matches and MSAL client IDs/tenant IDs align between frontend and backend.
- CORS errors: confirm `VITE_API_BASE_URL` and backend CORS settings.
- Graph errors: verify your Azure AD app has Microsoft Graph `Tasks.ReadWrite` delegated permissions and admin consent is granted.
