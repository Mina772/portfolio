import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} from "@/api/services/portfolioApi";
import { formatDateRange } from "@/utils/helpers";

export default function ExperienceManager() {
  return (
    <ResourceManager
      title="Experience"
      subtitle="Manage your professional work history."
      hooks={{
        useList: useGetExperiencesQuery,
        useCreate: useCreateExperienceMutation,
        useUpdate: useUpdateExperienceMutation,
        useRemove: useDeleteExperienceMutation,
      }}
      columns={[
        { key: "position", label: "Position" },
        { key: "company", label: "Company" },
        { key: "period", label: "Period", render: (i) => formatDateRange(i.startDate, i.endDate, i.current) },
      ]}
      fields={[
        { name: "position", label: "Position", placeholder: "Senior Engineer" },
        { name: "company", label: "Company", placeholder: "Acme Inc." },
        { name: "location", label: "Location", placeholder: "Remote" },
        {
          name: "employmentType",
          label: "Type",
          type: "select",
          options: ["full-time", "part-time", "contract", "freelance", "internship"],
        },
        { name: "startDate", label: "Start date", type: "date" },
        { name: "endDate", label: "End date", type: "date" },
        { name: "current", label: "Current role", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea", full: true },
        { name: "responsibilities", label: "Responsibilities", type: "array", full: true, help: "Comma or newline separated" },
        { name: "achievements", label: "Achievements", type: "array", full: true, help: "Comma or newline separated" },
        { name: "technologies", label: "Technologies", type: "array", full: true, help: "Comma separated" },
        { name: "order", label: "Order", type: "number", default: 0 },
      ]}
    />
  );
}
