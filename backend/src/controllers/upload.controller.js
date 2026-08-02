import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { fileToAsset } from "../middlewares/upload.js";

/** POST /upload - generic single image upload used by rich editors/pickers. */
export const uploadSingle = catchAsync(async (req, res) => {
  if (!req.file) throw ApiError.badRequest("No file provided.");
  sendResponse(res, 201, fileToAsset(req.file), "File uploaded");
});

/** POST /upload/multiple - batch upload up to N images. */
export const uploadMultiple = catchAsync(async (req, res) => {
  if (!req.files?.length) throw ApiError.badRequest("No files provided.");
  sendResponse(res, 201, req.files.map(fileToAsset), "Files uploaded");
});
