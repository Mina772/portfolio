import { Router } from "express";
import * as ctrl from "../controllers/blog.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { publicFilter } from "../middlewares/publicFilter.js";
import { blogRules, idParamRule } from "../validators/common.validator.js";
import upload from "../middlewares/upload.js";

const router = Router();

// ---- Admin listing (all statuses) ----
router.get("/admin/all", protect, authorize("admin", "editor"), ctrl.getPosts);

// ---- Public ----
router.get("/", publicFilter({ status: "published" }), ctrl.getPosts);
router.get("/:id", ctrl.getPost);

// ---- Admin ----
router.use(protect, authorize("admin", "editor"));
router.post("/", validate(blogRules), ctrl.createPost);
router.patch("/:id", validate(idParamRule), ctrl.updatePost);
router.delete("/:id", validate(idParamRule), ctrl.deletePost);
router.post("/:id/cover", upload.single("cover"), ctrl.uploadPostCover);

export default router;
