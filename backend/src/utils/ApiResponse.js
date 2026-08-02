/**
 * Standardized success envelope so the frontend can rely on a consistent shape.
 * @example res.json(new ApiResponse(200, data, "Fetched").toJSON())
 */
export default class ApiResponse {
  constructor(statusCode = 200, data = null, message = "Success", meta = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  toJSON() {
    const body = {
      success: this.success,
      message: this.message,
      data: this.data,
    };
    if (this.meta) body.meta = this.meta;
    return body;
  }
}

/** Helper to send a response in one line. */
export const sendResponse = (res, statusCode, data, message, meta) =>
  res.status(statusCode).json(new ApiResponse(statusCode, data, message, meta).toJSON());
