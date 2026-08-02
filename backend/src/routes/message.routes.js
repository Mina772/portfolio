import { Router } from "express";
import * as ctrl from "../controllers/message.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { contactLimiter } from "../middlewares/rateLimiter.js";
import { messageRules, idParamRule } from "../validators/common.validator.js";

const router = Router();

// ---- Public: submit a contact message ----
router.post("/", contactLimiter, validate(messageRules), ctrl.createMessage);

// ---- Admin inbox ----
router.use(protect, authorize("admin", "editor"));
router.get("/", ctrl.getMessages);
router.get("/:id", validate(idParamRule), ctrl.getMessage);
router.patch("/:id/status", validate(idParamRule), ctrl.updateMessageStatus);
router.delete("/:id", validate(idParamRule), ctrl.deleteMessage);

export default router;
