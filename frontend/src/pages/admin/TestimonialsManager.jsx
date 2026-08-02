import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} from "@/api/services/portfolioApi";

export default function TestimonialsManager() {
  return (
    <ResourceManager
      title="Testimonial"
      subtitle="Manage client and colleague testimonials."
      hooks={{
        useList: useGetTestimonialsQuery,
        useCreate: useCreateTestimonialMutation,
        useUpdate: useUpdateTestimonialMutation,
        useRemove: useDeleteTestimonialMutation,
      }}
      columns={[
        { key: "name", label: "Name" },
        { key: "company", label: "Company" },
        { key: "rating", label: "Rating", render: (i) => "★".repeat(i.rating || 0) },
      ]}
      fields={[
        { name: "name", label: "Name", placeholder: "Jane Doe" },
        { name: "role", label: "Role", placeholder: "CTO" },
        { name: "company", label: "Company", placeholder: "Acme Inc." },
        { name: "quote", label: "Quote", type: "textarea", full: true },
        { name: "avatar", label: "Avatar URL", type: "image", full: true, placeholder: "https://…" },
        { name: "rating", label: "Rating (1-5)", type: "number", default: 5 },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "isApproved", label: "Approved", type: "checkbox", default: true },
        { name: "order", label: "Order", type: "number", default: 0 },
      ]}
    />
  );
}
