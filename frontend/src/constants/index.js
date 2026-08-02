/** Base API URL, driven by env with a sensible dev default. */
export const API_URL = import.meta.env.VITE_API_URL || "/api/v1";
export const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";

/** Public navigation links (anchor sections on the home page). */
export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

/** Admin sidebar navigation. */
export const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin", icon: "FaChartPie", end: true },
  { label: "Projects", to: "/admin/projects", icon: "FaFolderOpen" },
  { label: "About", to: "/admin/about", icon: "FaUser" },
  { label: "Skills", to: "/admin/skills", icon: "FaCode" },
  { label: "Experience", to: "/admin/experience", icon: "FaBriefcase" },
  { label: "Education", to: "/admin/education", icon: "FaGraduationCap" },
  { label: "Certificates", to: "/admin/certificates", icon: "FaCertificate" },
  { label: "Services", to: "/admin/services", icon: "FaConciergeBell" },
  { label: "Testimonials", to: "/admin/testimonials", icon: "FaQuoteRight" },
  { label: "Blog", to: "/admin/blog", icon: "FaBlog" },
  { label: "Messages", to: "/admin/messages", icon: "FaEnvelope" },
  { label: "Settings", to: "/admin/settings", icon: "FaCog" },
];

export const PROJECT_CATEGORIES = [
  "web",
  "mobile",
  "backend",
  "fullstack",
  "ai",
  "devops",
  "design",
  "other",
];

export const SKILL_CATEGORIES = [
  "language",
  "framework",
  "library",
  "database",
  "cloud",
  "devops",
  "tool",
  "soft",
];

export const CONTENT_STATUS = ["draft", "published", "archived"];

/** localStorage keys. */
export const STORAGE_KEYS = {
  token: "pp_access_token",
  theme: "pp_theme",
};
