import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  { platform: String, url: String, icon: String },
  { _id: false }
);

/**
 * Singleton document describing the portfolio owner.
 * Only one About record exists; controllers upsert it.
 */
const aboutSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true }, // e.g. "Full Stack Engineer"
    subtitle: { type: String, trim: true },
    bio: { type: String, default: "" },
    shortBio: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 0 },
    location: String,
    email: { type: String, trim: true, lowercase: true },
    phone: String,
    availability: {
      type: String,
      enum: ["available", "open", "busy", "unavailable"],
      default: "open",
    },
    resumeUrl: String,
    profileImage: { url: String, publicId: String },
    coverImage: { url: String, publicId: String },
    githubUsername: String,
    leetcodeUsername: String,
    socialLinks: [socialSchema],
    stats: {
      projects: { type: Number, default: 0 },
      clients: { type: Number, default: 0 },
      awards: { type: Number, default: 0 },
      contributions: { type: Number, default: 0 },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      ogImage: String,
    },
    isSingleton: { type: Boolean, default: true, unique: true },
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);
export default About;
