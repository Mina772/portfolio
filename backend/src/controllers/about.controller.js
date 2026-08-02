import catchAsync from "../utils/catchAsync.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { fileToAsset } from "../middlewares/upload.js";
import About from "../models/About.js";
import Project from "../models/Project.js";

/** GET /about - the singleton profile (auto-created empty if missing). */
export const getAbout = catchAsync(async (req, res) => {
  let about = await About.findOne({ isSingleton: true });
  if (!about) about = await About.create({ name: "Portfolio Owner", isSingleton: true });
  sendResponse(res, 200, about, "About fetched");
});

/** PUT /about - upsert the singleton profile. */
export const upsertAbout = catchAsync(async (req, res) => {
  const payload = { ...req.body, isSingleton: true };
  const about = await About.findOneAndUpdate({ isSingleton: true }, payload, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  sendResponse(res, 200, about, "About updated");
});

/** POST /about/images - update profile and/or cover image. */
export const uploadAboutImages = catchAsync(async (req, res) => {
  const about = (await About.findOne({ isSingleton: true })) ||
    (await About.create({ name: "Portfolio Owner", isSingleton: true }));
  if (req.files?.profileImage?.[0]) about.profileImage = fileToAsset(req.files.profileImage[0]);
  if (req.files?.coverImage?.[0]) about.coverImage = fileToAsset(req.files.coverImage[0]);
  await about.save();
  sendResponse(res, 200, about, "About images uploaded");
});

/** GET /about/stats - recompute live counters for the hero section. */
export const getAboutStats = catchAsync(async (req, res) => {
  const projects = await Project.countDocuments({ status: "published" });
  sendResponse(res, 200, { projects }, "Stats");
});
