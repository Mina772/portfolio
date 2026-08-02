import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import PageLoader from "@/components/common/PageLoader";

// ---- Public pages (eager: Home; lazy: the rest for code splitting) ----
import Home from "@/pages/public/Home";
const ProjectsPage = lazy(() => import("@/pages/public/ProjectsPage"));
const ProjectDetail = lazy(() => import("@/pages/public/ProjectDetail"));
const BlogList = lazy(() => import("@/pages/public/BlogList"));
const BlogDetail = lazy(() => import("@/pages/public/BlogDetail"));
const NotFound = lazy(() => import("@/pages/public/NotFound"));

// ---- Admin pages (all lazy) ----
const Login = lazy(() => import("@/pages/admin/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const ProjectsManager = lazy(() => import("@/pages/admin/ProjectsManager"));
const AboutManager = lazy(() => import("@/pages/admin/AboutManager"));
const SkillsManager = lazy(() => import("@/pages/admin/SkillsManager"));
const ExperienceManager = lazy(() => import("@/pages/admin/ExperienceManager"));
const EducationManager = lazy(() => import("@/pages/admin/EducationManager"));
const CertificatesManager = lazy(() => import("@/pages/admin/CertificatesManager"));
const ServicesManager = lazy(() => import("@/pages/admin/ServicesManager"));
const TestimonialsManager = lazy(() => import("@/pages/admin/TestimonialsManager"));
const BlogManager = lazy(() => import("@/pages/admin/BlogManager"));
const MessagesManager = lazy(() => import("@/pages/admin/MessagesManager"));
const Settings = lazy(() => import("@/pages/admin/Settings"));

/** Application route tree: public site, admin auth, and guarded admin dashboard. */
export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Guarded admin dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="experience" element={<ExperienceManager />} />
            <Route path="education" element={<EducationManager />} />
            <Route path="certificates" element={<CertificatesManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
