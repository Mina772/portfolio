import { Router } from "express";
import * as ctrl from "../controllers/service.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { publicFilter } from "../middlewares/publicFilter.js";
import { idParamRule } from "../validators/common.validator.js";

const router = Router();

router.get("/", publicFilter({ isActive: true }), ctrl.getServices);
router.get("/:id", ctrl.getService);

router.use(protect, authorize("admin", "editor"));
router.post("/", ctrl.createService);
router.patch("/:id", validate(idParamRule), ctrl.updateService);
router.delete("/:id", validate(idParamRule), ctrl.deleteService);

export default router;
