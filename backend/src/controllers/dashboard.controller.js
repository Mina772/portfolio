import catchAsync from "../utils/catchAsync.js";
import { sendResponse } from "../utils/ApiResponse.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Message from "../models/Message.js";
import Blog from "../models/Blog.js";
import Certificate from "../models/Certificate.js";
import Experience from "../models/Experience.js";

/**
 * GET /dashboard/stats
 * Aggregated KPIs, time-series and breakdowns for the admin analytics dashboard.
 */
export const getDashboardStats = catchAsync(async (req, res) => {
  const [
    totalProjects,
    publishedProjects,
    featuredProjects,
    totalSkills,
    totalPosts,
    publishedPosts,
    totalCertificates,
    totalExperience,
    unreadMessages,
    totalMessages,
    projectViewsAgg,
    postViewsAgg,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: "published" }),
    Project.countDocuments({ featured: true }),
    Skill.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Certificate.countDocuments(),
    Experience.countDocuments(),
    Message.countDocuments({ status: "unread" }),
    Message.countDocuments(),
    Project.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
  ]);

  // Projects grouped by category for the pie/bar chart.
  const projectsByCategory = await Project.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, category: "$_id", count: 1 } },
  ]);

  // Skills grouped by category.
  const skillsByCategory = await Skill.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 }, avgLevel: { $avg: "$level" } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, category: "$_id", count: 1, avgLevel: { $round: ["$avgLevel", 0] } } },
  ]);

  // Messages received per month over the last 6 months.
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  const messagesTimeline = await Message.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
    {
      $project: {
        _id: 0,
        label: {
          $concat: [{ $toString: "$_id.y" }, "-", { $toString: "$_id.m" }],
        },
        count: 1,
      },
    },
  ]);

  const recentMessages = await Message.find()
    .sort("-createdAt")
    .limit(5)
    .select("name email subject status createdAt");
  const recentProjects = await Project.find()
    .sort("-createdAt")
    .limit(5)
    .select("title status featured views createdAt");

  sendResponse(
    res,
    200,
    {
      kpis: {
        totalProjects,
        publishedProjects,
        featuredProjects,
        totalSkills,
        totalPosts,
        publishedPosts,
        totalCertificates,
        totalExperience,
        unreadMessages,
        totalMessages,
        projectViews: projectViewsAgg[0]?.total || 0,
        postViews: postViewsAgg[0]?.total || 0,
      },
      charts: { projectsByCategory, skillsByCategory, messagesTimeline },
      recent: { messages: recentMessages, projects: recentProjects },
    },
    "Dashboard statistics"
  );
});
