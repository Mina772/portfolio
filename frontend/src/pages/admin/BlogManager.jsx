import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetAdminPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "@/api/services/portfolioApi";
import { CONTENT_STATUS } from "@/constants";
import { formatDate } from "@/utils/helpers";

const statusTone = { published: "success", draft: "warning", archived: "muted" };

export default function BlogManager() {
  return (
    <ResourceManager
      title="Post"
      subtitle="Write and manage your blog articles (Markdown supported)."
      hooks={{
        useList: useGetAdminPostsQuery,
        useCreate: useCreatePostMutation,
        useUpdate: useUpdatePostMutation,
        useRemove: useDeletePostMutation,
      }}
      listParams={{ limit: 50, sort: "-createdAt" }}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category", badge: () => "brand" },
        { key: "status", label: "Status", badge: (v) => statusTone[v] || "muted" },
        { key: "createdAt", label: "Created", render: (i) => formatDate(i.createdAt) },
      ]}
      fields={[
        { name: "title", label: "Title", full: true, placeholder: "Scaling Node.js in production" },
        { name: "excerpt", label: "Excerpt", type: "textarea", full: true, rows: 2 },
        { name: "content", label: "Content (Markdown)", type: "textarea", rows: 12, full: true },
        { name: "category", label: "Category", placeholder: "engineering" },
        { name: "status", label: "Status", type: "select", options: CONTENT_STATUS, default: "draft" },
        { name: "coverImage", label: "Cover image URL", type: "image", full: true, placeholder: "https://…" },
        { name: "tags", label: "Tags", type: "array", full: true, help: "Comma separated" },
        { name: "featured", label: "Featured", type: "checkbox" },
      ]}
    />
  );
}
