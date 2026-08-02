import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";
import User from "../models/User.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshCookieOptions,
} from "../utils/token.js";

/** Issue an access token + set the refresh cookie for a user. */
function issueTokens(res, user) {
  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const refreshToken = signRefreshToken({
    id: user._id,
    tokenVersion: user.tokenVersion ?? 0,
  });
  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
  return accessToken;
}

/**
 * POST /auth/register
 * Guarded: only allowed to create the very first admin, or by an existing admin.
 */
export const register = catchAsync(async (req, res) => {
  const userCount = await User.countDocuments();
  const isFirstUser = userCount === 0;
  const requesterIsAdmin = req.user?.role === "admin";

  if (!isFirstUser && !requesterIsAdmin) {
    throw ApiError.forbidden("Registration is restricted to administrators.");
  }

  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw ApiError.conflict("An account with this email already exists.");

  const user = await User.create({
    name,
    email,
    password,
    role: isFirstUser ? "admin" : role || "editor",
  });

  const accessToken = issueTokens(res, user);
  sendResponse(res, 201, { user: user.toSafeJSON(), accessToken }, "Account created");
});

/** POST /auth/login */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password +tokenVersion");
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid email or password.");
  }
  if (!user.isActive) throw ApiError.forbidden("This account has been deactivated.");

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = issueTokens(res, user);
  sendResponse(res, 200, { user: user.toSafeJSON(), accessToken }, "Logged in");
});

/** POST /auth/refresh - rotate access token using the refresh cookie. */
export const refresh = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized("No refresh token provided.");

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token.");
  }

  const user = await User.findById(decoded.id).select("+tokenVersion");
  if (!user || !user.isActive) throw ApiError.unauthorized("User no longer valid.");
  if ((user.tokenVersion ?? 0) !== decoded.tokenVersion) {
    throw ApiError.unauthorized("Session expired. Please log in again.");
  }

  const accessToken = issueTokens(res, user);
  sendResponse(res, 200, { user: user.toSafeJSON(), accessToken }, "Token refreshed");
});

/** POST /auth/logout - clear the refresh cookie. */
export const logout = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken", { ...refreshCookieOptions(), maxAge: 0 });
  sendResponse(res, 200, null, "Logged out");
});

/** POST /auth/logout-all - invalidate every refresh token for this user. */
export const logoutAll = catchAsync(async (req, res) => {
  req.user.tokenVersion = (req.user.tokenVersion ?? 0) + 1;
  await req.user.save({ validateBeforeSave: false });
  res.clearCookie("refreshToken", { ...refreshCookieOptions(), maxAge: 0 });
  sendResponse(res, 200, null, "Logged out of all sessions");
});

/** GET /auth/me */
export const getMe = catchAsync(async (req, res) => {
  sendResponse(res, 200, req.user.toSafeJSON(), "Current user");
});

/** PATCH /auth/me - update profile fields (name, avatar). */
export const updateMe = catchAsync(async (req, res) => {
  const allowed = ["name", "avatar"];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) req.user[k] = req.body[k];
  });
  await req.user.save();
  sendResponse(res, 200, req.user.toSafeJSON(), "Profile updated");
});

/** PATCH /auth/password - change password and invalidate other sessions. */
export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password +tokenVersion");
  if (!(await user.comparePassword(currentPassword))) {
    throw ApiError.badRequest("Current password is incorrect.");
  }
  user.password = newPassword;
  user.tokenVersion = (user.tokenVersion ?? 0) + 1; // force re-login elsewhere
  await user.save();

  const accessToken = issueTokens(res, user);
  sendResponse(res, 200, { accessToken }, "Password updated");
});
