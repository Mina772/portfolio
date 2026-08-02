import { Router } from "express";
import * as ctrl from "../controllers/certificate.controller.js";
import { protect, authorize } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { idParamRule } from "../validators/common.validator.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/", ctrl.getCertificates);
router.get("/:id", ctrl.getCertificate);

router.use(protect, authorize("admin", "editor"));
router.post("/", ctrl.createCertificate);
router.patch("/:id", validate(idParamRule), ctrl.updateCertificate);
router.delete("/:id", validate(idParamRule), ctrl.deleteCertificate);
router.post("/:id/image", upload.single("image"), ctrl.uploadCertificateImage);

export default router;
