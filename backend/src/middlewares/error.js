import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import logger from "../utils/logger.js";

/** Convert known Mongoose/JWT errors into a consistent ApiError. */
function normalizeError(err) {
  if (err instanceof ApiError) return err;

  if (err.name === "CastError") {
    return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return ApiError.conflict(`Duplicate value for field "${field}".`);
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return ApiError.badRequest("Validation failed.", errors);
  }
  if (err.name === "JsonWebTokenError") {
    return ApiError.unauthorized("Invalid token.");
  }
  if (err.name === "TokenExpiredError") {
    return ApiError.unauthorized("Token expired.");
  }
  if (err.name === "MulterError") {
    return ApiError.badRequest(`Upload error: ${err.message}`);
  }
  return new ApiError(err.statusCode || 500, err.message || "Internal server error");
}

/** Centralized Express error handler. Must have 4 args to be recognized. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const error = normalizeError(err);

  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${error.message}\n${err.stack || ""}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${error.statusCode} ${error.message}`);
  }

  const body = {
    success: false,
    message: error.message,
    ...(error.errors?.length ? { errors: error.errors } : {}),
  };
  if (!env.isProd) body.stack = err.stack;

  res.status(error.statusCode || 500).json(body);
}

export default errorHandler;
