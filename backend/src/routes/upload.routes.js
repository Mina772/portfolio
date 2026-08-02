import { Router } from "express";
import * as ctrl from "../controllers/upload.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.use(protect, authorize("admin", "editor"));
router.post("/", upload.single("file"), ctrl.uploadSingle);
router.post("/multiple", upload.array("files", 12), ctrl.uploadMultiple);

export default router;
