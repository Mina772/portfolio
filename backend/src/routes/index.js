import { Router } from "express";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import aboutRoutes from "./about.routes.js";
import skillRoutes from "./skill.routes.js";
import experienceRoutes from "./experience.routes.js";
import educationRoutes from "./education.routes.js";
import certificateRoutes from "./certificate.routes.js";
import serviceRoutes from "./service.routes.js";
import testimonialRoutes from "./testimonial.routes.js";
import blogRoutes from "./blog.routes.js";
import messageRoutes from "./message.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.get("/health", (req, res) =>
  res.json({ success: true, message: "API healthy", timestamp: new Date().toISOString() })
);

router.use("/auth", authRoutes);
router.use("/projects", projectRoutes);
router.use("/about", aboutRoutes);
router.use("/skills", skillRoutes);
router.use("/experiences", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/certificates", certificateRoutes);
router.use("/services", serviceRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/blog", blogRoutes);
router.use("/messages", messageRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);

export default router;
