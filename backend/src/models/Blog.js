import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true, maxlength: 160 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, maxlength: 300 },
    content: { type: String, required: [true, "Content is required"] }, // markdown
    coverImage: { url: String, publicId: String, alt: String },
    category: { type: String, default: "general", index: true, lowercase: true, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    featured: { type: Boolean, default: false },
    readTime: { type: Number, default: 1 }, // minutes
    views: { type: Number, default: 0 },
    publishedAt: Date,
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", excerpt: "text", tags: "text" });
blogSchema.index({ status: 1, publishedAt: -1 });

/** Generate a unique slug and estimate read time from content length. */
blogSchema.pre("save", async function preSave(next) {
  if (this.isModified("content")) {
    const words = this.content.trim().split(/\s+/).length;
    this.readTime = Math.max(1, Math.round(words / 200));
  }
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.isModified("title") || !this.slug) {
    const base = slugify(this.title, { lower: true, strict: true });
    let slug = base;
    let n = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await mongoose.models.Blog.exists({ slug, _id: { $ne: this._id } })) {
      slug = `${base}-${n++}`;
    }
    this.slug = slug;
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
