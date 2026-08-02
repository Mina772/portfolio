import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * Sign a short-lived access token used for API authorization.
 * @param {object} payload - Minimal claims (id, role).
 */
export const signAccessToken = (payload) =>
  jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpires });

/**
 * Sign a long-lived refresh token stored in an httpOnly cookie.
 * @param {object} payload - Minimal claims (id, tokenVersion).
 */
export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpires });

export const verifyAccessToken = (token) => jwt.verify(token, env.jwt.accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, env.jwt.refreshSecret);

/** Convert a JWT-style duration string (e.g. "7d", "15m") into milliseconds. */
export const durationToMs = (str) => {
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) return 0;
  const value = parseInt(match[1], 10);
  const unit = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[match[2]];
  return value * unit;
};

/** Cookie options for the refresh token, hardened for production. */
export const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? "none" : "lax",
  maxAge: durationToMs(env.jwt.refreshExpires),
  path: "/",
});
