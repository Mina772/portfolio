import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetEducationsQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "@/api/services/portfolioApi";
import { formatDateRange } from "@/utils/helpers";

export default function EducationManager() {
  return (
    <ResourceManager
      title="Education"
      subtitle="Manage your academic background."
      hooks={{
        useList: useGetEducationsQuery,
        useCreate: useCreateEducationMutation,
        useUpdate: useUpdateEducationMutation,
        useRemove: useDeleteEducationMutation,
      }}
      columns={[
        { key: "degree", label: "Degree" },
        { key: "institution", label: "Institution" },
        { key: "period", label: "Period", render: (i) => formatDateRange(i.startDate, i.endDate, i.current) },
      ]}
      fields={[
        { name: "degree", label: "Degree", placeholder: "B.Sc. Computer Science" },
        { name: "institution", label: "Institution", placeholder: "Technical University" },
        { name: "field", label: "Field of study", placeholder: "Software Engineering" },
        { name: "grade", label: "Grade", placeholder: "First Class Honours" },
        { name: "location", label: "Location" },
        { name: "startDate", label: "Start date", type: "date" },
        { name: "endDate", label: "End date", type: "date" },
        { name: "current", label: "Currently studying", type: "checkbox" },
        { name: "description", label: "Description", type: "textarea", full: true },
        { name: "activities", label: "Activities", type: "array", full: true, help: "Comma separated" },
        { name: "order", label: "Order", type: "number", default: 0 },
      ]}
    />
  );
}
