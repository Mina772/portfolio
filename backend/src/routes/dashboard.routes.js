import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

router.use(protect, authorize("admin", "editor"));
router.get("/stats", getDashboardStats);

export default router;
