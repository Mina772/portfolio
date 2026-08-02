import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Run a set of express-validator chains, then aggregate any failures
 * into a single 400 ApiError with field-level detail.
 * @param {Array} validations - express-validator chains.
 */
export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((v) => v.run(req)));
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path || e.param,
    message: e.msg,
  }));
  return next(ApiError.badRequest("Validation failed.", errors));
};

export default validate;
