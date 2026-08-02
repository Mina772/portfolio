/**
 * Idempotent database seeder.
 * Usage: `npm run seed`  (add `--fresh` to wipe collections first)
 *
 * Creates a sample admin account and realistic demo content so the
 * platform is immediately explorable after installation.
 */
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import env from "../config/env.js";
import logger from "../utils/logger.js";

import User from "../models/User.js";
import About from "../models/About.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import Education from "../models/Education.js";
import Certificate from "../models/Certificate.js";
import Service from "../models/Service.js";
import Testimonial from "../models/Testimonial.js";
import Blog from "../models/Blog.js";

const fresh = process.argv.includes("--fresh");

const skills = [
  { name: "JavaScript", category: "language", level: 95, color: "#f7df1e", featured: true },
  { name: "TypeScript", category: "language", level: 88, color: "#3178c6" },
  { name: "Python", category: "language", level: 82, color: "#3776ab" },
  { name: "React", category: "framework", level: 94, color: "#61dafb", featured: true },
  { name: "Node.js", category: "framework", level: 92, color: "#339933", featured: true },
  { name: "Express", category: "framework", level: 90, color: "#000000" },
  { name: "Next.js", category: "framework", level: 85, color: "#000000" },
  { name: "Redux Toolkit", category: "library", level: 88, color: "#764abc" },
  { name: "TailwindCSS", category: "library", level: 93, color: "#06b6d4", featured: true },
  { name: "MongoDB", category: "database", level: 89, color: "#47a248", featured: true },
  { name: "PostgreSQL", category: "database", level: 80, color: "#4169e1" },
  { name: "Redis", category: "database", level: 75, color: "#dc382d" },
  { name: "AWS", category: "cloud", level: 78, color: "#ff9900" },
  { name: "Docker", category: "devops", level: 82, color: "#2496ed" },
  { name: "GitHub Actions", category: "devops", level: 80, color: "#2088ff" },
  { name: "Git", category: "tool", level: 92, color: "#f05032" },
  { name: "Figma", category: "tool", level: 76, color: "#f24e1e" },
  { name: "Problem Solving", category: "soft", level: 95, color: "#6366f1" },
];

const projects = [
  {
    title: "Nova Commerce Platform",
    tagline: "Headless commerce with real-time inventory",
    description:
      "A production-grade headless e-commerce platform supporting multi-vendor catalogs, Stripe payments, and real-time inventory synchronization.",
    content:
      "## Overview\nNova Commerce is a scalable, event-driven commerce backend...\n\n## Highlights\n- Multi-vendor marketplace\n- Real-time inventory via WebSockets\n- Stripe Connect payouts",
    coverImage: { url: "https://picsum.photos/seed/nova/1200/700", alt: "Nova Commerce" },
    techStack: ["React", "Node.js", "MongoDB", "Redis", "Stripe", "Docker"],
    features: ["Multi-vendor catalog", "Stripe payments", "Real-time inventory", "Admin analytics"],
    challenges: ["Consistent inventory under concurrency", "Sub-200ms search"],
    solutions: ["Optimistic locking + Redis", "Denormalized search index"],
    category: "fullstack",
    tags: ["ecommerce", "stripe", "realtime"],
    githubUrl: "https://github.com/example/nova-commerce",
    liveUrl: "https://nova-commerce.example.com",
    status: "published",
    featured: true,
    order: 1,
  },
  {
    title: "Pulse Analytics Dashboard",
    tagline: "Self-serve product analytics",
    description:
      "A self-serve analytics dashboard with funnels, cohorts and retention charts backed by a columnar event store.",
    coverImage: { url: "https://picsum.photos/seed/pulse/1200/700", alt: "Pulse Analytics" },
    techStack: ["React", "Recharts", "Node.js", "PostgreSQL"],
    features: ["Funnels", "Cohort retention", "Custom dashboards"],
    category: "web",
    tags: ["analytics", "charts", "dashboard"],
    githubUrl: "https://github.com/example/pulse",
    liveUrl: "https://pulse.example.com",
    status: "published",
    featured: true,
    order: 2,
  },
  {
    title: "Atlas Task Manager",
    tagline: "Collaborative kanban with offline sync",
    description:
      "A collaborative task manager featuring drag-and-drop kanban boards, offline-first sync and granular permissions.",
    coverImage: { url: "https://picsum.photos/seed/atlas/1200/700", alt: "Atlas Tasks" },
    techStack: ["React", "Redux Toolkit", "Express", "MongoDB"],
    features: ["Kanban boards", "Offline sync", "Role-based sharing"],
    category: "fullstack",
    tags: ["productivity", "kanban"],
    githubUrl: "https://github.com/example/atlas",
    status: "published",
    featured: true,
    order: 3,
  },
  {
    title: "Sentinel API Gateway",
    tagline: "Rate-limited gateway with JWT auth",
    description:
      "A lightweight API gateway providing JWT verification, request shaping, rate limiting and observability.",
    coverImage: { url: "https://picsum.photos/seed/sentinel/1200/700", alt: "Sentinel Gateway" },
    techStack: ["Node.js", "Express", "Redis", "Docker"],
    category: "backend",
    tags: ["gateway", "security"],
    githubUrl: "https://github.com/example/sentinel",
    status: "published",
    featured: false,
    order: 4,
  },
];

const experiences = [
  {
    company: "Vertex Labs",
    position: "Senior Full Stack Engineer",
    location: "Remote",
    employmentType: "full-time",
    startDate: new Date("2022-03-01"),
    current: true,
    description: "Leading the platform team building customer-facing SaaS products.",
    responsibilities: [
      "Architected a multi-tenant SaaS backend serving 50k+ MAU",
      "Mentored 4 engineers and drove code-review culture",
    ],
    achievements: ["Cut p95 API latency by 60%", "Shipped SSO adopted by top 3 clients"],
    technologies: ["React", "Node.js", "MongoDB", "AWS"],
    order: 1,
  },
  {
    company: "Brightwave Studio",
    position: "Full Stack Developer",
    location: "Berlin, DE",
    employmentType: "full-time",
    startDate: new Date("2019-06-01"),
    endDate: new Date("2022-02-01"),
    description: "Delivered client web platforms across e-commerce and fintech.",
    responsibilities: ["Built 12+ client web apps", "Owned CI/CD pipelines"],
    technologies: ["React", "Express", "PostgreSQL", "Docker"],
    order: 2,
  },
];

const education = [
  {
    institution: "Technical University",
    degree: "B.Sc. Computer Science",
    field: "Software Engineering",
    grade: "First Class Honours",
    startDate: new Date("2015-09-01"),
    endDate: new Date("2019-06-01"),
    description: "Focused on distributed systems, algorithms and human-computer interaction.",
    activities: ["ACM chapter lead", "Hackathon mentor"],
    order: 1,
  },
];

const certificates = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    organization: "Amazon Web Services",
    credentialId: "AWS-SAA-2023-001",
    credentialUrl: "https://aws.amazon.com/verification",
    issueDate: new Date("2023-05-10"),
    image: { url: "https://picsum.photos/seed/aws/600/400" },
    skills: ["AWS", "Cloud Architecture"],
    featured: true,
    order: 1,
  },
  {
    title: "MongoDB Certified Developer",
    organization: "MongoDB University",
    credentialId: "MDB-DEV-2022-045",
    issueDate: new Date("2022-11-02"),
    image: { url: "https://picsum.photos/seed/mongo/600/400" },
    skills: ["MongoDB", "Data Modeling"],
    order: 2,
  },
];

const services = [
  {
    title: "Full Stack Web Development",
    description: "End-to-end web applications built with the MERN stack, from design to deployment.",
    icon: "FaLaptopCode",
    features: ["Responsive UI", "REST & real-time APIs", "Cloud deployment"],
    price: "From $2,500",
    color: "#6366f1",
    order: 1,
  },
  {
    title: "API Design & Backend",
    description: "Robust, secure and well-documented REST APIs with authentication and testing.",
    icon: "FaServer",
    features: ["JWT auth", "Rate limiting", "OpenAPI docs"],
    price: "From $1,500",
    color: "#10b981",
    order: 2,
  },
  {
    title: "Performance & DevOps",
    description: "CI/CD pipelines, containerization and performance tuning for production systems.",
    icon: "FaRocket",
    features: ["Docker", "CI/CD", "Monitoring"],
    price: "From $1,200",
    color: "#f59e0b",
    order: 3,
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CTO",
    company: "Vertex Labs",
    quote:
      "One of the most reliable engineers I've worked with. Delivered a complex platform ahead of schedule and raised the whole team's bar.",
    rating: 5,
    featured: true,
    order: 1,
  },
  {
    name: "David Chen",
    role: "Product Lead",
    company: "Brightwave Studio",
    quote:
      "Exceptional attention to detail and UX. Our conversion rates jumped after the rebuild.",
    rating: 5,
    featured: true,
    order: 2,
  },
];

const posts = [
  {
    title: "Designing a Scalable MERN Architecture",
    excerpt: "Practical patterns for structuring a production MERN application that scales.",
    content:
      "# Designing a Scalable MERN Architecture\n\nWhen your side project turns into a product, structure matters...\n\n## Layered structure\nControllers, services, models...\n\n## Caching\nUse Redis for hot paths.",
    category: "architecture",
    tags: ["mern", "architecture", "node"],
    status: "published",
    featured: true,
    coverImage: { url: "https://picsum.photos/seed/blog1/1200/700" },
  },
  {
    title: "Authentication with JWT and Refresh Tokens",
    excerpt: "A secure, battle-tested approach to session management in Express.",
    content:
      "# JWT + Refresh Tokens\n\nAccess tokens are short-lived, refresh tokens live in httpOnly cookies...",
    category: "security",
    tags: ["jwt", "auth", "security"],
    status: "published",
    coverImage: { url: "https://picsum.photos/seed/blog2/1200/700" },
  },
];

async function run() {
  await connectDB();
  logger.info(`Seeding database${fresh ? " (fresh)" : ""}...`);

  if (fresh) {
    await Promise.all([
      User.deleteMany({}),
      About.deleteMany({}),
      Project.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Certificate.deleteMany({}),
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
      Blog.deleteMany({}),
    ]);
    logger.info("Collections cleared");
  }

  // --- Admin user ---
  let admin = await User.findOne({ email: env.seed.adminEmail });
  if (!admin) {
    admin = await User.create({
      name: env.seed.adminName,
      email: env.seed.adminEmail,
      password: env.seed.adminPassword,
      role: "admin",
    });
    logger.info(`Admin created: ${admin.email} / ${env.seed.adminPassword}`);
  } else {
    logger.info(`Admin already exists: ${admin.email}`);
  }

  // --- About (singleton) ---
  await About.findOneAndUpdate(
    { isSingleton: true },
    {
      isSingleton: true,
      name: "Jordan Rivers",
      title: "Senior Full Stack Engineer",
      subtitle: "I build performant, delightful web products.",
      shortBio:
        "Full stack engineer specializing in the MERN stack, obsessed with clean architecture and great UX.",
      bio: "I'm a full stack engineer with 6+ years of experience designing and shipping scalable web applications. I love turning complex problems into elegant, maintainable solutions and mentoring teams along the way.",
      yearsOfExperience: 6,
      location: "Remote / Worldwide",
      email: "hello@jordanrivers.dev",
      phone: "+1 (555) 012-3456",
      availability: "open",
      resumeUrl: "/resume.pdf",
      profileImage: { url: "https://i.pravatar.cc/400?img=13" },
      coverImage: { url: "https://picsum.photos/seed/cover/1600/500" },
      githubUsername: "jordanrivers",
      leetcodeUsername: "jordanrivers",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/jordanrivers", icon: "FaGithub" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/jordanrivers", icon: "FaLinkedin" },
        { platform: "Twitter", url: "https://twitter.com/jordanrivers", icon: "FaXTwitter" },
        { platform: "Dribbble", url: "https://dribbble.com/jordanrivers", icon: "FaDribbble" },
      ],
      stats: { projects: 42, clients: 28, awards: 6, contributions: 1840 },
      seo: {
        metaTitle: "Jordan Rivers — Senior Full Stack Engineer",
        metaDescription: "Portfolio of Jordan Rivers, a senior full stack MERN engineer.",
        keywords: ["full stack", "mern", "react", "node"],
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // --- Content collections (upsert by natural key to stay idempotent) ---
  const upsertMany = async (Model, items, keyFn) => {
    for (const item of items) {
      // eslint-disable-next-line no-await-in-loop
      await Model.findOneAndUpdate(keyFn(item), item, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
  };

  await upsertMany(Skill, skills, (s) => ({ name: s.name }));
  await upsertMany(Experience, experiences, (e) => ({ company: e.company, position: e.position }));
  await upsertMany(Education, education, (e) => ({ institution: e.institution, degree: e.degree }));
  await upsertMany(Certificate, certificates, (c) => ({ title: c.title }));
  await upsertMany(Service, services, (s) => ({ title: s.title }));
  await upsertMany(Testimonial, testimonials, (t) => ({ name: t.name, company: t.company }));

  // Projects & posts use pre-save hooks (slug), so create if absent.
  for (const p of projects) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await Project.findOne({ title: p.title }))) await Project.create(p);
  }
  for (const post of posts) {
    // eslint-disable-next-line no-await-in-loop
    if (!(await Blog.findOne({ title: post.title })))
      await Blog.create({ ...post, author: admin._id });
  }

  logger.info("✅ Seed complete");
  await disconnectDB();
  await mongoose.connection.close();
  process.exit(0);
}

run().catch((err) => {
  logger.error(`Seed failed: ${err.message}\n${err.stack}`);
  process.exit(1);
});
