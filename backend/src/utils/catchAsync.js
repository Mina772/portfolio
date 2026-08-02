/**
 * Wraps an async Express handler and forwards rejected promises to next().
 * Eliminates repetitive try/catch blocks across controllers.
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function} Express handler.
 */
const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default catchAsync;
