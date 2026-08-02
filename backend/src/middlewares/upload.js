import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED = /jpeg|jpg|png|webp|gif|svg|avif/;

/** Reject anything that is not an approved image type. */
function fileFilter(req, file, cb) {
  const extOk = ALLOWED.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = ALLOWED.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(ApiError.badRequest("Only image files (jpg, png, webp, gif, svg, avif) are allowed."));
}

/** Cloudinary storage used when credentials are configured. */
const cloudStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

/** Local disk storage fallback for development / self-hosting. */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: env.cloudinary.enabled ? cloudStorage : diskStorage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

/**
 * Normalize a multer file (cloud or disk) into a { url, publicId } pair.
 */
export const fileToAsset = (file) => {
  if (!file) return null;
  if (env.cloudinary.enabled) {
    return { url: file.path, publicId: file.filename };
  }
  return { url: `/uploads/${file.filename}`, publicId: file.filename };
};

export default upload;
