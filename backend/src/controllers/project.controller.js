import createFactory from "../services/factory.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { fileToAsset } from "../middlewares/upload.js";
import Project from "../models/Project.js";

const factory = createFactory(Project, {
  entity: "Project",
  searchFields: ["title", "tagline", "description", "tags"],
});

export const getProjects = factory.getAll;
export const createProject = factory.createOne;
export const updateProject = factory.updateOne;
export const deleteProject = factory.deleteOne;

/** GET /projects/:id - public read that also increments the view counter. */
export const getProject = catchAsync(async (req, res) => {
  const { id } = req.params;
  const filter = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { slug: id };
  const doc = await Project.findOneAndUpdate(filter, { $inc: { views: 1 } }, { new: true });
  if (!doc) throw ApiError.notFound("Project not found");
  sendResponse(res, 200, doc, "Project fetched");
});

/** GET /projects/featured - lightweight list for the landing page. */
export const getFeaturedProjects = catchAsync(async (req, res) => {
  const docs = await Project.find({ featured: true, status: "published" })
    .sort("order -createdAt")
    .limit(6);
  sendResponse(res, 200, docs, "Featured projects");
});

/**
 * POST /projects/:id/images - attach uploaded cover + gallery assets.
 * Cover replaces existing; gallery entries are appended.
 */
export const uploadProjectImages = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound("Project not found");

  if (req.files?.cover?.[0]) {
    project.coverImage = fileToAsset(req.files.cover[0]);
  }
  if (req.files?.gallery?.length) {
    project.gallery.push(...req.files.gallery.map(fileToAsset));
  }
  await project.save();
  sendResponse(res, 200, project, "Project images uploaded");
});
