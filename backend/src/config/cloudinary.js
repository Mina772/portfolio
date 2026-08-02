import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";
import logger from "../utils/logger.js";

/**
 * Configure Cloudinary if credentials are supplied.
 * When disabled, the upload middleware transparently falls back to local disk.
 */
if (env.cloudinary.enabled) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
  logger.info("Cloudinary storage enabled");
} else {
  logger.warn("Cloudinary credentials not set - using local disk uploads");
}

export default cloudinary;
