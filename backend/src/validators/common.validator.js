import { body, param } from "express-validator";

/** Reusable Mongo ObjectId param validator. */
export const idParamRule = [
  param("id").matches(/^[0-9a-fA-F]{24}$/).withMessage("Invalid resource id"),
];

export const messageRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  body("subject").trim().isLength({ min: 2, max: 160 }).withMessage("Subject is required"),
  body("message").trim().isLength({ min: 10, max: 5000 }).withMessage("Message is too short"),
];

export const skillRules = [
  body("name").trim().notEmpty().withMessage("Skill name is required"),
  body("category")
    .optional()
    .isIn(["language", "framework", "library", "database", "cloud", "devops", "tool", "soft"]),
  body("level").optional().isInt({ min: 0, max: 100 }),
];

export const blogRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 160 }),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("status").optional().isIn(["draft", "published", "archived"]),
];
