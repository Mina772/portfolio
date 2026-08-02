import { Router } from "express";
import * as ctrl from "../controllers/skill.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { skillRules, idParamRule } from "../validators/common.validator.js";

const router = Router();

router.get("/", ctrl.getSkills);
router.get("/:id", ctrl.getSkill);

router.use(protect, authorize("admin", "editor"));
router.post("/", validate(skillRules), ctrl.createSkill);
router.patch("/:id", validate(idParamRule), ctrl.updateSkill);
router.delete("/:id", validate(idParamRule), ctrl.deleteSkill);

export default router;
