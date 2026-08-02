import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: [true, "Company is required"], trim: true },
    position: { type: String, required: [true, "Position is required"], trim: true },
    location: String,
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      default: "full-time",
    },
    companyLogo: { url: String, publicId: String },
    companyUrl: String,
    startDate: { type: Date, required: true },
    endDate: Date, // null => current
    current: { type: Boolean, default: false },
    description: String,
    responsibilities: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ startDate: -1 });

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
