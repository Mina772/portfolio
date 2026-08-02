import { Router } from "express";
import * as ctrl from "../controllers/project.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { publicFilter } from "../middlewares/publicFilter.js";
import upload from "../middlewares/upload.js";
import { createProjectRules, updateProjectRules } from "../validators/project.validator.js";
import { idParamRule } from "../validators/common.validator.js";

const router = Router();

// ---- Admin listing (all statuses) ----
router.get("/admin/all", protect, authorize("admin", "editor"), ctrl.getProjects);

// ---- Public ----
router.get("/featured", ctrl.getFeaturedProjects);
router.get("/", publicFilter({ status: "published" }), ctrl.getProjects);
router.get("/:id", ctrl.getProject);

// ---- Admin ----
router.use(protect, authorize("admin", "editor"));
router.post("/", validate(createProjectRules), ctrl.createProject);
router.patch("/:id", validate([...idParamRule, ...updateProjectRules]), ctrl.updateProject);
router.delete("/:id", validate(idParamRule), ctrl.deleteProject);
router.post(
  "/:id/images",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "gallery", maxCount: 12 },
  ]),
  ctrl.uploadProjectImages
);

export default router;
