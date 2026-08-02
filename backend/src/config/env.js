import dotenv from "dotenv";
dotenv.config();

/**
 * Centralized, validated environment configuration.
 * Any code needing an env value imports from here (single source of truth).
 */
const required = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "5000", 10),
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  mongoUri: process.env.MONGO_URI,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
  },
  cookieSecret: process.env.COOKIE_SECRET || "cookie_secret",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    enabled: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "Portfolio <no-reply@portfolio.dev>",
    enabled: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
  },
  adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL || "admin@portfolio.dev",

  seed: {
    adminName: process.env.SEED_ADMIN_NAME || "Site Admin",
    adminEmail: process.env.SEED_ADMIN_EMAIL || "admin@portfolio.dev",
    adminPassword: process.env.SEED_ADMIN_PASSWORD || "Admin@12345",
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "300", 10),
  },
};

export function validateEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length && env.isProd) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
  return missing;
}

export default env;
