import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    subject: { type: String, required: [true, "Subject is required"], trim: true, maxlength: 160 },
    message: { type: String, required: [true, "Message is required"], maxlength: 5000 },
    phone: String,
    company: String,
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
      index: true,
    },
    isStarred: { type: Boolean, default: false },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

messageSchema.index({ status: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
