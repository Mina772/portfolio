import { Router } from "express";
import * as ctrl from "../controllers/experience.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { idParamRule } from "../validators/common.validator.js";

const router = Router();

router.get("/", ctrl.getExperiences);
router.get("/:id", ctrl.getExperience);

router.use(protect, authorize("admin", "editor"));
router.post("/", ctrl.createExperience);
router.patch("/:id", validate(idParamRule), ctrl.updateExperience);
router.delete("/:id", validate(idParamRule), ctrl.deleteExperience);

export default router;
