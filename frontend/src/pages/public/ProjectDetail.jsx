import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { FiArrowLeft, FiGithub, FiExternalLink, FiCheckCircle } from "react-icons/fi";
import SEO from "@/components/common/SEO";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PageLoader from "@/components/common/PageLoader";
import EmptyState from "@/components/ui/EmptyState";
import { useGetProjectQuery } from "@/api/services/portfolioApi";
import { resolveAsset } from "@/utils/helpers";

/** Rich project detail page with gallery, markdown content and metadata. */
export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetProjectQuery(slug);
  const project = data?.data;

  if (isLoading) return <PageLoader />;
  if (isError || !project)
    return (
      <div className="container-app pt-32 pb-20">
        <EmptyState
          title="Project not found"
          message="This project may have been moved or removed."
          action={
            <Button as={Link} to="/projects">
              Back to projects
            </Button>
          }
        />
      </div>
    );

  const Section = ({ title, items, tone = "brand" }) =>
    items?.length ? (
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold">{title}</h3>
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
              <FiCheckCircle className={`mt-0.5 shrink-0 ${tone === "brand" ? "text-brand-500" : "text-emerald-500"}`} />
              {it}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <article className="pt-24 pb-20">
      <SEO
        title={project.seo?.metaTitle || project.title}
        description={project.seo?.metaDescription || project.tagline || project.description}
        image={resolveAsset(project.coverImage)}
        type="article"
        path={`/projects/${project.slug}`}
      />

      <div className="container-app">
        <Button as={Link} to="/projects" variant="ghost" size="sm" className="mb-6">
          <FiArrowLeft /> Back to projects
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{project.category}</Badge>
            {project.featured && <Badge tone="amber">Featured</Badge>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{project.title}</h1>
          {project.tagline && (
            <p className="mt-3 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              {project.tagline}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button as="a" href={project.liveUrl} target="_blank" rel="noreferrer">
                <FiExternalLink /> Live demo
              </Button>
            )}
            {project.githubUrl && (
              <Button as="a" href={project.githubUrl} target="_blank" rel="noreferrer" variant="outline">
                <FiGithub /> Source code
              </Button>
            )}
          </div>
        </motion.div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card">
          <img
            src={resolveAsset(project.coverImage, "https://picsum.photos/seed/detail/1200/700")}
            alt={project.title}
            className="w-full object-cover"
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="lead text-slate-600 dark:text-slate-300">{project.description}</p>
              {project.content && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
              )}
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Section title="Key Features" items={project.features} />
              <Section title="Challenges" items={project.challenges} />
              <Section title="Solutions" items={project.solutions} tone="emerald" />
            </div>

            {project.gallery?.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-4 font-display text-lg font-semibold">Gallery</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((g, i) => (
                    <img
                      key={i}
                      src={resolveAsset(g)}
                      alt={`${project.title} screenshot ${i + 1}`}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h3 className="mb-4 font-display font-semibold">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {(project.techStack || []).map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {project.tags?.length > 0 && (
              <div className="card p-6">
                <h3 className="mb-4 font-display font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <Badge key={t} tone="gray">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}
