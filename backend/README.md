# Portfolio Platform — Backend API

Express + MongoDB REST API powering the Portfolio Platform. ESM modules, layered
architecture, JWT auth with refresh-token rotation, and a generic CRUD factory.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start the production server |
| `npm run seed` | Seed admin + sample content (`--fresh` wipes first) |
| `npm test` | Run Jest + Supertest integration tests |

## Quick start

```bash
cp .env.example .env   # edit secrets + MONGO_URI
npm install
npm run seed
npm run dev            # http://localhost:5000/api/v1
```

## Architecture

```
request → route → validator (express-validator) → middleware (auth/upload)
        → controller (thin) → service / model (Mongoose) → ApiResponse
errors  → centralized error middleware → JSON envelope
```

- **`utils/features.js`** — `APIFeatures` builds Mongoose queries from
  `search`, `filter`, `sort`, `fields`, `page`, `limit`.
- **`services/factory.service.js`** — `createFactory(Model)` returns generic
  `getAll / getOne / createOne / updateOne / deleteOne` handlers.
- **`middlewares/publicFilter.js`** — forces `status: published` on public reads;
  admin uses `/admin/all` routes to see drafts.
- **`utils/token.js`** — signs access/refresh tokens and sets secure cookies.

## Response envelope

```json
{ "success": true, "message": "...", "data": {}, "meta": { "page": 1, "total": 0, "totalPages": 0 } }
```

## Health check

`GET /api/v1/health` → `{ "success": true, "message": "API healthy" }`

See the root [`README.md`](../README.md) for the full API reference and the
[`DEPLOYMENT.md`](../DEPLOYMENT.md) guide.
