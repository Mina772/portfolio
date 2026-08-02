import { Router } from "express";
import * as ctrl from "../controllers/about.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router();

// ---- Public ----
router.get("/", ctrl.getAbout);
router.get("/stats", ctrl.getAboutStats);

// ---- Admin ----
router.use(protect, authorize("admin", "editor"));
router.put("/", ctrl.upsertAbout);
router.post(
  "/images",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  ctrl.uploadAboutImages
);

export default router;
