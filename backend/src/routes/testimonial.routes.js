import { Router } from "express";
import * as ctrl from "../controllers/testimonial.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { publicFilter } from "../middlewares/publicFilter.js";
import { idParamRule } from "../validators/common.validator.js";

const router = Router();

router.get("/", publicFilter({ isApproved: true }), ctrl.getTestimonials);
router.get("/:id", ctrl.getTestimonial);

router.use(protect, authorize("admin", "editor"));
router.post("/", ctrl.createTestimonial);
router.patch("/:id", validate(idParamRule), ctrl.updateTestimonial);
router.delete("/:id", validate(idParamRule), ctrl.deleteTestimonial);

export default router;
