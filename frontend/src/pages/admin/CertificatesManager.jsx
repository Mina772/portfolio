import ResourceManager from "@/components/admin/ResourceManager";
import {
  useGetCertificatesQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
} from "@/api/services/portfolioApi";
import { formatDate } from "@/utils/helpers";

export default function CertificatesManager() {
  return (
    <ResourceManager
      title="Certificate"
      subtitle="Manage your certifications and credentials."
      hooks={{
        useList: useGetCertificatesQuery,
        useCreate: useCreateCertificateMutation,
        useUpdate: useUpdateCertificateMutation,
        useRemove: useDeleteCertificateMutation,
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "organization", label: "Organization" },
        { key: "issueDate", label: "Issued", render: (i) => formatDate(i.issueDate) },
      ]}
      fields={[
        { name: "title", label: "Title", full: true, placeholder: "AWS Certified Solutions Architect" },
        { name: "organization", label: "Organization", placeholder: "Amazon Web Services" },
        { name: "credentialId", label: "Credential ID" },
        { name: "credentialUrl", label: "Credential URL", type: "url", full: true },
        { name: "issueDate", label: "Issue date", type: "date" },
        { name: "expiryDate", label: "Expiry date", type: "date" },
        { name: "image", label: "Image URL", type: "image", full: true, placeholder: "https://…", help: "Paste an image URL or upload via the API" },
        { name: "skills", label: "Related skills", type: "array", full: true, help: "Comma separated" },
        { name: "featured", label: "Featured", type: "checkbox" },
        { name: "order", label: "Order", type: "number", default: 0 },
      ]}
    />
  );
}
