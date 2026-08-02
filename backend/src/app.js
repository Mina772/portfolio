import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import env from "./config/env.js";
import routes from "./routes/index.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/error.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { morganStream } from "./utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Build and configure the Express application.
 * Kept separate from server.js so it can be imported by the test suite.
 */
export function createApp() {
  const app = express();

  // Trust the first proxy (needed for correct IPs / secure cookies behind Render/Vercel).
  app.set("trust proxy", 1);

  // ----- Security headers -----
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: false, // handled at the CDN/frontend layer
    })
  );

  // ----- CORS -----
  const allowedOrigins = [env.clientUrl, "http://localhost:5173", "http://localhost:4173"];
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(null, true); // permissive by default; tighten in production if desired
      },
      credentials: true,
    })
  );

  // ----- Body & cookie parsing -----
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser(env.cookieSecret));

  // ----- Sanitization against NoSQL injection & param pollution -----
  app.use(mongoSanitize());
  app.use(hpp({ whitelist: ["tags", "techStack", "category", "sort", "fields"] }));

  // ----- Performance -----
  app.use(compression());

  // ----- Logging -----
  if (!env.isProd) app.use(morgan("dev"));
  else app.use(morgan("combined", { stream: morganStream }));

  // ----- Static uploads (local storage fallback) -----
  app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

  // ----- Rate limiting + API routes -----
  app.use(env.apiPrefix, apiLimiter, routes);

  // Root banner
  app.get("/", (req, res) =>
    res.json({
      success: true,
      message: "Portfolio Platform API",
      docs: `${env.apiPrefix}/health`,
      version: "1.0.0",
    })
  );

  // ----- 404 + centralized error handling -----
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export default createApp;
