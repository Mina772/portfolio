import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Service title is required"], trim: true },
    description: { type: String, required: true },
    icon: String,
    features: [{ type: String, trim: true }],
    price: String, // e.g. "From $500"
    color: { type: String, default: "#6366f1" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
