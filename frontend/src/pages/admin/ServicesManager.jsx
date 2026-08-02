import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "@/api/services/portfolioApi";

export default function ServicesManager() {
  return (
    <ResourceManager
      title="Service"
      subtitle="Manage the services you offer to clients."
      hooks={{
        useList: useGetServicesQuery,
        useCreate: useCreateServiceMutation,
        useUpdate: useUpdateServiceMutation,
        useRemove: useDeleteServiceMutation,
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "price", label: "Price" },
        { key: "isActive", label: "Active", badge: (v) => (v ? "success" : "muted") },
      ]}
      fields={[
        { name: "title", label: "Title", placeholder: "Web Development" },
        { name: "price", label: "Price", placeholder: "From $500" },
        { name: "description", label: "Description", type: "textarea", full: true },
        { name: "features", label: "Features", type: "array", full: true, help: "Comma or newline separated" },
        { name: "icon", label: "Icon (name or URL)", placeholder: "FaCode" },
        { name: "color", label: "Color", type: "color", default: "#6366f1" },
        { name: "order", label: "Order", type: "number", default: 0 },
        { name: "isActive", label: "Active", type: "checkbox", default: true },
      ]}
    />
  );
}
