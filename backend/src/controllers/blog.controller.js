import createFactory from "../services/factory.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import { fileToAsset } from "../middlewares/upload.js";
import Blog from "../models/Blog.js";

const factory = createFactory(Blog, {
  entity: "Blog post",
  searchFields: ["title", "excerpt", "tags"],
  populate: "author",
});

export const getPosts = factory.getAll;
export const createPost = catchAsync(async (req, res) => {
  const post = await Blog.create({ ...req.body, author: req.user._id });
  sendResponse(res, 201, post, "Blog post created");
});
export const updatePost = factory.updateOne;
export const deletePost = factory.deleteOne;

/** GET /blog/:id - public read by slug or id; increments views. */
export const getPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const filter = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { slug: id };
  const post = await Blog.findOneAndUpdate(filter, { $inc: { views: 1 } }, { new: true })
    .populate("author", "name avatar");
  if (!post) throw ApiError.notFound("Blog post not found");
  sendResponse(res, 200, post, "Blog post fetched");
});

/** POST /blog/:id/cover - upload cover image. */
export const uploadPostCover = catchAsync(async (req, res) => {
  const post = await Blog.findById(req.params.id);
  if (!post) throw ApiError.notFound("Blog post not found");
  if (req.file) post.coverImage = fileToAsset(req.file);
  await post.save();
  sendResponse(res, 200, post, "Cover uploaded");
});
