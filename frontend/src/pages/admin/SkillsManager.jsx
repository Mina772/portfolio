import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} from "@/api/services/portfolioApi";
import { SKILL_CATEGORIES } from "@/constants";

export default function SkillsManager() {
  return (
    <ResourceManager
      title="Skill"
      subtitle="Manage your technical and soft skills."
      hooks={{
        useList: useGetSkillsQuery,
        useCreate: useCreateSkillMutation,
        useUpdate: useUpdateSkillMutation,
        useRemove: useDeleteSkillMutation,
      }}
      listParams={{ limit: 100 }}
      columns={[
        { key: "name", label: "Name" },
        { key: "category", label: "Category", badge: () => "brand" },
        {
          key: "level",
          label: "Level",
          render: (i) => (
            <div className="flex items-center gap-2">
              <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${i.level}%` }} />
              </div>
            </div>
          ),
        },
      ]}
      fields={[
        { name: "name", label: "Skill name", placeholder: "React" },
        { name: "category", label: "Category", type: "select", options: SKILL_CATEGORIES },
        { name: "level", label: "Proficiency (0-100)", type: "number", default: 70 },
        { name: "color", label: "Color", type: "color", default: "#6366f1" },
        { name: "icon", label: "Icon (name or URL)", placeholder: "FaReact" },
        { name: "order", label: "Order", type: "number", default: 0 },
        { name: "featured", label: "Featured", type: "checkbox" },
      ]}
    />
  );
}
