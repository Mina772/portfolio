import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: [true, "Institution is required"], trim: true },
    degree: { type: String, required: [true, "Degree is required"], trim: true },
    field: { type: String, trim: true },
    grade: String,
    location: String,
    logo: { url: String, publicId: String },
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
    activities: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

educationSchema.index({ startDate: -1 });

const Education = mongoose.model("Education", educationSchema);
export default Education;
