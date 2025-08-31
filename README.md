# Tammira Blog (Backend + Mobile)

Full‑stack blog application: Node.js API (Express + MongoDB + Mongoose) and a React Native CLI mobile app.

## Run It
- Prereqs: Node 18+, Docker. Copy `.env.example` → `.env`. Then `npm install`.
- Android (DB + API + Metro + App): `npm run dev:all:android`
- iOS (DB + API + Metro + App): `npm run dev:all:ios`
- Backend only (DB + API): `npm run dev:api`
- Seed sample data: `npm run seed`

## Backend (API)
- List blogs with pagination: `GET /api/blogs?page=1&limit=10`
- Filter by tags (comma-separated): `GET /api/blogs?tags=tech,javascript`
- Update blog by ID: `PUT /api/blogs/:id` (slug auto-updates when title changes)
- Response shape includes title, sub_title, content, slug, tags, created_date, modified_date, and author object.

## Mobile (React Native)
- Blog list screen shows title, subtitle, and author details.
- Pagination (infinite scroll) with pull‑to‑refresh.
- Filter by tags (chip toggles).
- Search (client-side) across title, subtitle, content, tags, and author.
- API base URL is configurable via `apps/mobile/app.json` (`extra.apiBaseUrl` or `extra.apiPort`), with platform defaults (Android: `10.0.2.2`, iOS: `localhost`).

## Notes
- Health check: `GET http://localhost:4000/api/health`
- Database: `SampleBlogs` (see `.env.example`).
- Postman collection: `docs/TammiraBlog.postman_collection.json` (set `baseUrl` to `http://localhost:4000`).
