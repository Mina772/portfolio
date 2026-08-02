import mongoose from "mongoose";
import slugify from "slugify";

const assetSchema = new mongoose.Schema(
  { url: String, publicId: String, alt: String },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 140,
    },
    slug: { type: String, unique: true, index: true },
    tagline: { type: String, trim: true, maxlength: 200 },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    content: { type: String, default: "" }, // long-form markdown
    coverImage: assetSchema,
    gallery: [assetSchema],
    techStack: [{ type: String, trim: true }],
    features: [{ type: String, trim: true }],
    challenges: [{ type: String, trim: true }],
    solutions: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ["web", "mobile", "backend", "fullstack", "ai", "devops", "design", "other"],
      default: "web",
      index: true,
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    startedAt: Date,
    completedAt: Date,
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
  },
  { timestamps: true }
);

projectSchema.index({ title: "text", description: "text", tags: "text" });
projectSchema.index({ featured: -1, order: 1, createdAt: -1 });

/** Auto-generate a unique, URL-safe slug from the title. */
projectSchema.pre("save", async function genSlug(next) {
  if (!this.isModified("title") && this.slug) return next();
  let base = slugify(this.title, { lower: true, strict: true });
  let slug = base;
  let n = 1;
  // Ensure uniqueness without clobbering the current document.
  // eslint-disable-next-line no-await-in-loop
  while (await mongoose.models.Project.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${n++}`;
  }
  this.slug = slug;
  next();
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
