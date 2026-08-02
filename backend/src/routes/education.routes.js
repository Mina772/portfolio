import { Router } from "express";
import * as ctrl from "../controllers/education.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { idParamRule } from "../validators/common.validator.js";

const router = Router();

router.get("/", ctrl.getEducations);
router.get("/:id", ctrl.getEducation);

router.use(protect, authorize("admin", "editor"));
router.post("/", ctrl.createEducation);
router.patch("/:id", validate(idParamRule), ctrl.updateEducation);
router.delete("/:id", validate(idParamRule), ctrl.deleteEducation);

export default router;
