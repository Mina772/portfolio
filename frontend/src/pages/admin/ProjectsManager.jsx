import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetAdminProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/api/services/portfolioApi";
import { PROJECT_CATEGORIES, CONTENT_STATUS } from "@/constants";

const statusTone = { published: "success", draft: "warning", archived: "muted" };

export default function ProjectsManager() {
  return (
    <ResourceManager
      title="Project"
      subtitle="Create, edit, and organize your portfolio projects."
      hooks={{
        useList: useGetAdminProjectsQuery,
        useCreate: useCreateProjectMutation,
        useUpdate: useUpdateProjectMutation,
        useRemove: useDeleteProjectMutation,
      }}
      listParams={{ limit: 50, sort: "-createdAt" }}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category", badge: () => "brand" },
        { key: "status", label: "Status", badge: (v) => statusTone[v] || "muted" },
        { key: "featured", label: "Featured", badge: (v) => (v ? "success" : "muted") },
      ]}
      fields={[
        { name: "title", label: "Title", full: true, placeholder: "Awesome SaaS Platform" },
        { name: "tagline", label: "Tagline", full: true, placeholder: "One-line summary" },
        { name: "description", label: "Short description", type: "textarea", full: true },
        { name: "content", label: "Case study (Markdown)", type: "textarea", rows: 8, full: true },
        { name: "category", label: "Category", type: "select", options: PROJECT_CATEGORIES },
        { name: "status", label: "Status", type: "select", options: CONTENT_STATUS, default: "published" },
        { name: "coverImage", label: "Cover image URL", type: "image", full: true, placeholder: "https://…" },
        { name: "techStack", label: "Tech stack", type: "array", full: true, help: "Comma separated" },
        { name: "features", label: "Features", type: "array", full: true, help: "Comma or newline separated" },
        { name: "challenges", label: "Challenges", type: "array", full: true },
        { name: "solutions", label: "Solutions", type: "array", full: true },
        { name: "tags", label: "Tags", type: "array", full: true, help: "Comma separated" },
        { name: "githubUrl", label: "GitHub URL", type: "url" },
        { name: "liveUrl", label: "Live demo URL", type: "url" },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "order", label: "Order", type: "number", default: 0 },
      ]}
    />
  );
}
