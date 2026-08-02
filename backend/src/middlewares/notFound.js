import ApiError from "../utils/ApiError.js";

/** Catch-all for unmatched routes -> 404 handled by the error middleware. */
export default function notFound(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found.`));
}
