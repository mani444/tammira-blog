# Tammira Blog (Backend + Mobile)

Full‑stack blog assessment. Backend is a Node.js API (Express + MongoDB + Mongoose). Mobile app (React Native CLI) will consume these endpoints.

## Quick Start
- Prereqs: Node 18+, Docker. Copy `.env.example` → `.env`.
- Install deps: `npm install`
- Start MongoDB: `npm run dev:db`
- Seed sample data: `npm run seed`
- Start API (watch): `npm run dev:server`
- Health: `GET http://localhost:4000/api/health`

## Key Scripts (root)
- `dev:db`: start MongoDB via Docker
- `dev:server`: run backend (apps/server) in watch mode
- `dev:api`: run DB + API together (concurrently)
- `dev:all:ios` / `dev:all:android`: DB + API + mobile packager (mobile app to be added)
- `seed`: seed users and blogs
- `typecheck` / `lint` / `test`: backend TypeScript, lint, and unit tests

## API Endpoints
- List blogs: `GET /api/blogs?page=1&limit=10`
  - Filter by tags: `GET /api/blogs?tags=tech,javascript` (matches blogs containing all tags)
  - Response: `{ data, page, limit, total }` with blog items shaped as required
- Update blog: `PUT /api/blogs/:id`
  - Body (example): `{ "title": "Updated Title", "tags": ["tech", "node"] }`
  - Slug updates automatically when title changes; duplicate slug → 400

## Notes
- Database: `SampleBlogs` (see `.env`).
- Android emulator uses `http://10.0.2.2:<PORT>`; iOS simulator can use `http://localhost:<PORT>`.
- Postman: import `docs/TammiraBlog.postman_collection.json` and set `baseUrl` to `http://localhost:4000`.
