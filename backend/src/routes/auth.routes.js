import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { optionalAuth } from "../middlewares/auth.js";
import {
  registerRules,
  loginRules,
  changePasswordRules,
} from "../validators/auth.validator.js";

const router = Router();

// optionalAuth allows an existing admin to create additional editors,
// while still permitting the very first bootstrap registration.
router.post("/register", authLimiter, optionalAuth, validate(registerRules), authController.register);
router.post("/login", authLimiter, validate(loginRules), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.use(protect); // everything below requires a valid access token
router.get("/me", authController.getMe);
router.patch("/me", authController.updateMe);
router.patch("/password", validate(changePasswordRules), authController.changePassword);
router.post("/logout-all", authController.logoutAll);

export default router;
