import createFactory from "../services/factory.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import Message from "../models/Message.js";
import env from "../config/env.js";
import { sendEmail, contactNotificationTemplate } from "../utils/email.js";
import logger from "../utils/logger.js";

const factory = createFactory(Message, {
  entity: "Message",
  searchFields: ["name", "email", "subject", "message"],
});

export const getMessages = factory.getAll;
export const getMessage = factory.getOne;
export const deleteMessage = factory.deleteOne;

/** POST /messages - public contact form submission. */
export const createMessage = catchAsync(async (req, res) => {
  const message = await Message.create({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Fire-and-forget notification; failure must not block the user.
  sendEmail({
    to: env.adminNotifyEmail,
    subject: `New message: ${message.subject}`,
    html: contactNotificationTemplate(message),
  }).catch((err) => logger.error(`Contact email failed: ${err.message}`));

  sendResponse(res, 201, { id: message._id }, "Message sent successfully");
});

/** PATCH /messages/:id/status - update read/replied/archived status. */
export const updateMessageStatus = catchAsync(async (req, res) => {
  const allowed = ["unread", "read", "replied", "archived"];
  const { status, isStarred } = req.body;
  const update = {};
  if (status) {
    if (!allowed.includes(status)) throw ApiError.badRequest("Invalid status value.");
    update.status = status;
  }
  if (typeof isStarred === "boolean") update.isStarred = isStarred;

  const message = await Message.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!message) throw ApiError.notFound("Message not found");
  sendResponse(res, 200, message, "Message updated");
});
