import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyAccessToken } from "../utils/token.js";
import User from "../models/User.js";

/**
 * Authenticate the request via Bearer access token.
 * Attaches the sanitized user document to req.user.
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) throw ApiError.unauthorized("Authentication required. Please log in.");

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired token.");
  }

  const user = await User.findById(decoded.id).select("+tokenVersion");
  if (!user) throw ApiError.unauthorized("The user for this token no longer exists.");
  if (!user.isActive) throw ApiError.forbidden("This account has been deactivated.");

  req.user = user;
  next();
});

/**
 * Restrict a route to one or more roles.
 * @param  {...string} roles - Allowed roles (e.g. "admin").
 */
export const authorize = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action.");
    }
    next();
  });

/**
 * Optional auth: attaches req.user if a valid token is present but never blocks.
 * Useful for endpoints that personalize output for logged-in admins.
 */
export const optionalAuth = catchAsync(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ")
    ? header.split(" ")[1]
    : req.cookies?.accessToken;
  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    } catch {
      /* ignore invalid optional token */
    }
  }
  next();
});
