import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Certificate title is required"], trim: true },
    organization: { type: String, required: true, trim: true },
    credentialId: String,
    credentialUrl: String,
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    image: { url: String, publicId: String },
    skills: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

certificateSchema.index({ issueDate: -1 });

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
