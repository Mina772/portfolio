# Portfolio Platform — Full-Stack MERN

A production-grade, full-stack **portfolio + content management platform** built
with the **MERN** stack (MongoDB, Express, React 19, Node.js) in **plain
JavaScript** (no TypeScript). It ships a polished public portfolio site and a
complete admin dashboard to manage every piece of content — projects, about,
skills, experience, education, certificates, services, testimonials, a blog CMS,
and a contact inbox.

<p align="center">
  <img src="frontend/public/favicon.svg" width="72" alt="logo" />
</p>

---

## ✨ Features

### Public site
- Animated landing page — hero, about, skills, experience, education, projects,
  services, testimonials, contact (Framer Motion micro-interactions).
- Projects listing with search / category filter + rich project detail pages.
- Blog list + article pages with Markdown rendering and read-time.
- Full SEO: meta tags, Open Graph, Twitter cards, canonical URLs, `robots.txt`,
  `sitemap.xml`, JSON-LD structured data via `react-helmet-async`.
- Dark / light mode with persisted preference, skeleton loaders, lazy-loaded
  routes and code splitting.

### Admin dashboard
- JWT auth with **refresh-token rotation** (httpOnly cookies) and role-based
  access control.
- Analytics dashboard with Recharts (content stats, message activity).
- Full CRUD for every resource with searchable, paginated, sortable tables,
  schema-driven forms, image URL / upload support, and optimistic cache
  invalidation via RTK Query.
- Contact inbox with read/replied/archive statuses and master–detail reader.
- Account settings: profile update + password change.

### Backend API
- Clean layered architecture: routes → validators → controllers → services →
  models, with a generic CRUD factory to eliminate duplication.
- Pagination, filtering, full-text search, sorting, field selection.
- Security: Helmet, CORS allow-list, rate limiting, mongo-sanitize, XSS
  protection, bcrypt hashing, secure cookies, express-validator.
- Cloudinary image uploads with graceful **local-disk fallback**.
- Winston logging, centralized error handling, graceful shutdown, health check.

---

## 🧱 Tech stack

| Layer     | Technologies |
|-----------|--------------|
| Frontend  | React 19, Vite, React Router, Redux Toolkit, RTK Query, Axios, TailwindCSS, Framer Motion, React Hook Form, Yup, React Helmet Async, React Hot Toast, React Icons, Recharts |
| Backend   | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer, Cloudinary, Helmet, CORS, Morgan, Compression, Cookie Parser, express-rate-limit, express-validator, Winston, Nodemailer |
| Tooling   | ESLint, Nodemon, Jest + Supertest, Docker, Docker Compose |

---

## 📁 Project structure

```
portfolio-platform/
├── backend/
│   ├── src/
│   │   ├── config/         # env, db connection, cloudinary
│   │   ├── controllers/    # request handlers (thin)
│   │   ├── database/       # seed script
│   │   ├── middlewares/    # auth, error, upload, rate-limit, validate…
│   │   ├── models/         # Mongoose schemas (11 models)
│   │   ├── routes/         # Express routers mounted under /api/v1
│   │   ├── services/       # generic CRUD factory + business logic
│   │   ├── utils/          # logger, ApiError, tokens, APIFeatures, email…
│   │   ├── validators/     # express-validator chains
│   │   ├── app.js          # express app (middleware pipeline)
│   │   └── server.js       # bootstrap + graceful shutdown
│   ├── tests/              # Jest + Supertest integration tests
│   ├── uploads/            # local upload fallback (gitignored)
│   ├── logs/               # winston logs (gitignored)
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/             # favicon, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── animations/     # Framer Motion variants
│   │   ├── api/            # RTK Query apiSlice + service endpoints
│   │   ├── components/     # ui / common / sections / admin
│   │   ├── constants/      # nav, categories, storage keys
│   │   ├── hooks/          # useTheme…
│   │   ├── layouts/        # PublicLayout, AdminLayout
│   │   ├── pages/          # public/ + admin/
│   │   ├── routes/         # AppRoutes + ProtectedRoute
│   │   ├── store/          # redux store + slices
│   │   ├── styles/         # tailwind entry
│   │   ├── utils/          # helpers, cn
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── package.json
├── docker-compose.yml
├── DEPLOYMENT.md
└── README.md
```

---

## 🚀 Getting started (local)

### Prerequisites
- Node.js **18+**
- MongoDB running locally, or a **MongoDB Atlas** connection string
- (Optional) Cloudinary account for cloud image hosting

### 1. Clone & install

```bash
# Backend
cd backend
cp .env.example .env      # then edit values
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Seed the database (creates the admin account + sample content)

```bash
cd backend
npm run seed            # add --fresh to wipe & reseed
```

### 3. Run the apps

```bash
# Terminal 1 — API on http://localhost:5000
cd backend && npm run dev

# Terminal 2 — Web on http://localhost:5173
cd frontend && npm run dev
```

Visit **http://localhost:5173** for the site and
**http://localhost:5173/admin/login** for the dashboard.

### 🔑 Default admin account (from seed)

| Email                  | Password       |
|------------------------|----------------|
| `admin@portfolio.dev`  | `Admin@12345`  |

> Change these via `SEED_ADMIN_*` env vars before seeding in any real
> environment, and rotate the password immediately after first login.

---

## 🔧 Environment variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | `development` / `production` / `test` | `development` |
| `PORT` | API port | `5000` |
| `API_PREFIX` | Mount prefix for the API | `/api/v1` |
| `CLIENT_URL` | Allowed CORS origin (frontend URL) | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | local instance |
| `JWT_ACCESS_SECRET` | Access-token signing secret | — (required) |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret | — (required) |
| `JWT_ACCESS_EXPIRES` | Access-token TTL | `15m` |
| `JWT_REFRESH_EXPIRES` | Refresh-token TTL | `7d` |
| `COOKIE_SECRET` | Cookie signing secret | — |
| `CLOUDINARY_*` | Cloud image hosting (optional) | falls back to disk |
| `SMTP_*` / `ADMIN_NOTIFY_EMAIL` | Contact email notifications (optional) | disabled if unset |
| `SEED_ADMIN_*` | Seed admin credentials | see table above |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Rate limiter config | `900000` / `300` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Base API URL (proxied in dev) | `/api/v1` |
| `VITE_SITE_URL` | Public site URL for SEO tags | `http://localhost:5173` |

---

## 📡 API reference

Base URL: `http://localhost:5000/api/v1`. Response envelope:

```json
{ "success": true, "message": "…", "data": { }, "meta": { "page": 1, "totalPages": 5, "total": 42 } }
```

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/login` · `POST /auth/logout` · `POST /auth/refresh` · `GET /auth/me` · `PATCH /auth/me` · `PATCH /auth/password` |
| Projects | `GET /projects` · `GET /projects/featured` · `GET /projects/:id` · `GET /projects/admin/all`* · `POST /projects`* · `PATCH /projects/:id`* · `DELETE /projects/:id`* · `POST /projects/:id/images`* |
| About | `GET /about` · `PUT /about`* · `POST /about/images`* |
| Skills | `GET /skills` · `POST /skills`* · `PATCH /skills/:id`* · `DELETE /skills/:id`* |
| Experience | `GET /experiences` · `POST /experiences`* · `PATCH /experiences/:id`* · `DELETE /experiences/:id`* |
| Education | `GET /education` · `POST /education`* · `PATCH /education/:id`* · `DELETE /education/:id`* |
| Certificates | `GET /certificates` · `POST /certificates`* · `PATCH /certificates/:id`* · `DELETE /certificates/:id`* |
| Services | `GET /services` · `POST /services`* · `PATCH /services/:id`* · `DELETE /services/:id`* |
| Testimonials | `GET /testimonials` · `POST /testimonials`* · `PATCH /testimonials/:id`* · `DELETE /testimonials/:id`* |
| Blog | `GET /blog` · `GET /blog/:id` · `GET /blog/admin/all`* · `POST /blog`* · `PATCH /blog/:id`* · `DELETE /blog/:id`* |
| Messages | `POST /messages` · `GET /messages`* · `PATCH /messages/:id/status`* · `DELETE /messages/:id`* |
| Dashboard | `GET /dashboard/stats`* |
| Uploads | `POST /upload`* |
| Health | `GET /health` |

`*` = requires a valid admin access token (`Authorization: Bearer <token>`).

**Query params** (list endpoints): `page`, `limit`, `sort` (e.g. `-createdAt`),
`search`, `fields`, plus any model field for filtering
(`?category=web&featured=true`).

---

## 🧪 Testing

```bash
cd backend
npm test           # Jest + Supertest integration tests
```

The suite covers auth flows and representative CRUD endpoints. Set a dedicated
`MONGO_URI` test database (or use an in-memory server) before running.

---

## 🐳 Docker

Spin up MongoDB + API together:

```bash
docker-compose up --build
```

See [`docker-compose.yml`](docker-compose.yml). The frontend is best deployed to
a static host (Vercel) — see below.

---

## ☁️ Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step guides:
- **Frontend → Vercel**
- **Backend → Render / Railway**
- **Database → MongoDB Atlas**
- **Images → Cloudinary**

---

## 🔒 Security notes

- Rotate `JWT_*` and `COOKIE_SECRET` to strong random values in production.
- Refresh tokens are httpOnly, `secure` + `sameSite` in production.
- CORS is locked to `CLIENT_URL`; add extra origins there if needed.
- `tokenVersion` on the user model enables "log out everywhere".
- Rate limiting and input validation are enabled on every mutation route.

---

## 📄 License

MIT — free to use for your own portfolio. Attribution appreciated but not
required.
