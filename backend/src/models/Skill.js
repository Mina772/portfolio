import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Skill name is required"], trim: true },
    category: {
      type: String,
      enum: [
        "language",
        "framework",
        "library",
        "database",
        "cloud",
        "devops",
        "tool",
        "soft",
      ],
      default: "tool",
      index: true,
    },
    level: {
      type: Number,
      min: [0, "Level cannot be below 0"],
      max: [100, "Level cannot exceed 100"],
      default: 70,
    },
    icon: String, // icon name or image URL
    color: { type: String, default: "#6366f1" },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, order: 1 });

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
