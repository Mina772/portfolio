# Deployment Guide

This guide walks through deploying the Portfolio Platform to production:

- **Database** → MongoDB Atlas
- **Images** → Cloudinary (optional)
- **Backend API** → Render or Railway
- **Frontend** → Vercel

---

## 1. MongoDB Atlas

1. Create a free cluster at <https://www.mongodb.com/atlas>.
2. **Database Access** → add a user with a strong password.
3. **Network Access** → allow your backend host's IP, or `0.0.0.0/0` for
   managed platforms (Render/Railway rotate IPs).
4. **Connect → Drivers** → copy the connection string, e.g.:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio_platform?retryWrites=true&w=majority
   ```
5. Use this as `MONGO_URI`.

---

## 2. Cloudinary (optional but recommended)

1. Sign up at <https://cloudinary.com>.
2. From the dashboard copy **Cloud name**, **API Key**, **API Secret**.
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
4. If omitted, uploads fall back to the backend's local `uploads/` folder
   (fine for demos, not for horizontally-scaled/ephemeral hosts).

---

## 3. Backend → Render

1. Push the repo to GitHub.
2. Render → **New → Web Service** → connect the repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/v1/health`
4. Add environment variables (from `backend/.env.example`):
   - `NODE_ENV=production`
   - `PORT=10000` (Render provides `PORT`; the app reads it automatically)
   - `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_SECRET`
   - `CLIENT_URL=https://your-frontend.vercel.app`
   - `CLOUDINARY_*`, `SMTP_*` as needed
   - `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
5. Deploy. Once live, seed the database from the Render **Shell**:
   ```bash
   npm run seed
   ```

### Backend → Railway (alternative)

1. Railway → **New Project → Deploy from GitHub repo**.
2. **Settings → Root Directory:** `backend`.
3. **Start Command:** `npm start`.
4. Add the same environment variables under **Variables**.
5. Add a **MongoDB** plugin or use Atlas; set `MONGO_URI` accordingly.
6. Run `npm run seed` from the Railway shell after first deploy.

> **Cookies across domains:** since the API and web app are on different
> domains, refresh cookies use `SameSite=None; Secure` in production (already
> handled in `utils/token.js` when `NODE_ENV=production`). Ensure both are on
> HTTPS.

---

## 4. Frontend → Vercel

1. Vercel → **Add New → Project** → import the repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Environment variables:
   - `VITE_API_URL=https://your-backend.onrender.com/api/v1`
   - `VITE_SITE_URL=https://your-frontend.vercel.app`
4. Deploy. `vercel.json` already provides SPA rewrites + asset caching.

> After the frontend URL is known, update the backend's `CLIENT_URL` to match
> (CORS + cookie origin) and redeploy the backend.

---

## 5. Post-deploy checklist

- [ ] `GET https://your-backend/api/v1/health` returns `{ success: true }`.
- [ ] Database seeded; admin login works at `/admin/login`.
- [ ] **Change the seeded admin password** immediately.
- [ ] Image upload works (or falls back to disk) from the admin panel.
- [ ] Contact form submits and appears in the admin inbox.
- [ ] `robots.txt` and `sitemap.xml` reachable; update the domain inside them.
- [ ] Rotate `JWT_*` / `COOKIE_SECRET` to strong random values.
- [ ] Restrict Atlas Network Access as tightly as your host allows.

---

## 6. Updating content

All content is managed from the **admin dashboard** — no redeploys needed for
content changes. Redeploy only when code changes.
