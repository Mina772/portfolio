import { body } from "express-validator";

export const createProjectRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 140 }),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .optional()
    .isIn(["web", "mobile", "backend", "fullstack", "ai", "devops", "design", "other"]),
  body("status").optional().isIn(["draft", "published", "archived"]),
  body("githubUrl").optional({ values: "falsy" }).isURL().withMessage("Invalid GitHub URL"),
  body("liveUrl").optional({ values: "falsy" }).isURL().withMessage("Invalid live URL"),
  body("techStack").optional().isArray(),
  body("featured").optional().isBoolean(),
];

export const updateProjectRules = [
  body("title").optional().trim().isLength({ min: 1, max: 140 }),
  body("category")
    .optional()
    .isIn(["web", "mobile", "backend", "fullstack", "ai", "devops", "design", "other"]),
  body("status").optional().isIn(["draft", "published", "archived"]),
  body("githubUrl").optional({ values: "falsy" }).isURL(),
  body("liveUrl").optional({ values: "falsy" }).isURL(),
];
