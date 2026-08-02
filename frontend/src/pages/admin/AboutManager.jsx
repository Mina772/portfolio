import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetAboutQuery, useUpdateAboutMutation } from "@/api/services/portfolioApi";
import { Input, Textarea, Select } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import SectionHeading from "@/components/ui/SectionHeading";
import { FiPlus, FiTrash2 } from "react-icons/fi";

/** Editor for the singleton "About" document that powers the hero + about sections. */
export default function AboutManager() {
  const { data, isLoading } = useGetAboutQuery();
  const [updateAbout, { isLoading: saving }] = useUpdateAboutMutation();
  const about = data?.data || {};

  const { register, handleSubmit, control, reset } = useForm({ values: normalize(about) });
  const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      yearsOfExperience: Number(values.yearsOfExperience) || 0,
      profileImage: values.profileImageUrl ? { url: values.profileImageUrl } : about.profileImage,
      coverImage: values.coverImageUrl ? { url: values.coverImageUrl } : about.coverImage,
      stats: {
        projects: Number(values.statProjects) || 0,
        clients: Number(values.statClients) || 0,
        awards: Number(values.statAwards) || 0,
        contributions: Number(values.statContributions) || 0,
      },
    };
    delete payload.profileImageUrl;
    delete payload.coverImageUrl;
    try {
      await updateAbout(payload).unwrap();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <SectionHeading eyebrow="Profile" title="About / Bio" subtitle="Content shown on the landing hero and about section." align="left" />

      <Card title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" {...register("name")} />
          <Input label="Title" {...register("title")} placeholder="Full Stack Engineer" />
          <Input label="Subtitle" wrapperClassName="sm:col-span-2" {...register("subtitle")} />
          <div className="sm:col-span-2">
            <Textarea label="Short bio" rows={2} {...register("shortBio")} />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Biography" rows={6} {...register("bio")} />
          </div>
        </div>
      </Card>

      <Card title="Contact & availability">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Email" type="email" {...register("email")} />
          <Input label="Phone" {...register("phone")} />
          <Input label="Location" {...register("location")} />
          <Input label="Years of experience" type="number" {...register("yearsOfExperience")} />
          <Select label="Availability" {...register("availability")}>
            <option value="available">Available</option>
            <option value="open">Open to offers</option>
            <option value="busy">Busy</option>
            <option value="unavailable">Unavailable</option>
          </Select>
          <Input label="Resume URL" {...register("resumeUrl")} />
          <Input label="GitHub username" {...register("githubUsername")} />
          <Input label="LeetCode username" {...register("leetcodeUsername")} />
        </div>
      </Card>

      <Card title="Media">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Profile image URL" {...register("profileImageUrl")} placeholder="https://…" />
          <Input label="Cover image URL" {...register("coverImageUrl")} placeholder="https://…" />
        </div>
      </Card>

      <Card title="Stats">
        <div className="grid gap-4 sm:grid-cols-4">
          <Input label="Projects" type="number" {...register("statProjects")} />
          <Input label="Clients" type="number" {...register("statClients")} />
          <Input label="Awards" type="number" {...register("statAwards")} />
          <Input label="Contributions" type="number" {...register("statContributions")} />
        </div>
      </Card>

      <Card title="Social links">
        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr_1fr_auto]">
              <Input placeholder="Platform" {...register(`socialLinks.${idx}.platform`)} />
              <Input placeholder="URL" {...register(`socialLinks.${idx}.url`)} />
              <Input placeholder="Icon (FaGithub)" {...register(`socialLinks.${idx}.icon`)} />
              <Button type="button" variant="ghost" onClick={() => remove(idx)} aria-label="Remove">
                <FiTrash2 />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => append({ platform: "", url: "", icon: "" })}>
            <FiPlus className="mr-1" /> Add link
          </Button>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => reset(normalize(about))}>
          Reset
        </Button>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
      {children}
    </section>
  );
}

/** Flatten nested about doc into flat form fields. */
function normalize(about = {}) {
  return {
    name: about.name || "",
    title: about.title || "",
    subtitle: about.subtitle || "",
    shortBio: about.shortBio || "",
    bio: about.bio || "",
    email: about.email || "",
    phone: about.phone || "",
    location: about.location || "",
    yearsOfExperience: about.yearsOfExperience || 0,
    availability: about.availability || "open",
    resumeUrl: about.resumeUrl || "",
    githubUsername: about.githubUsername || "",
    leetcodeUsername: about.leetcodeUsername || "",
    profileImageUrl: about.profileImage?.url || "",
    coverImageUrl: about.coverImage?.url || "",
    statProjects: about.stats?.projects || 0,
    statClients: about.stats?.clients || 0,
    statAwards: about.stats?.awards || 0,
    statContributions: about.stats?.contributions || 0,
    socialLinks: about.socialLinks?.length ? about.socialLinks : [],
  };
}
