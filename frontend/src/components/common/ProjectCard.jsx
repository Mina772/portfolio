import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiEye } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import { resolveAsset, truncate } from "@/utils/helpers";
import { fadeInUp } from "@/animations/variants";

/** Reusable project card used in grids across the site. */
export default function ProjectCard({ project }) {
  return (
    <motion.article
      variants={fadeInUp}
      className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <Link to={`/projects/${project.slug}`} className="relative block overflow-hidden">
        <img
          src={resolveAsset(project.coverImage, "https://picsum.photos/seed/proj/800/500")}
          alt={project.title}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {project.featured && (
          <span className="absolute left-3 top-3">
            <Badge tone="amber">Featured</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge tone="brand">{project.category}</Badge>
          {typeof project.views === "number" && (
            <span className="ml-auto flex items-center gap-1 text-xs text-slate-400">
              <FiEye size={13} /> {project.views}
            </span>
          )}
        </div>
        <Link to={`/projects/${project.slug}`}>
          <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-brand-600">
            {project.title}
          </h3>
        </Link>
        <p className="mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
          {truncate(project.tagline || project.description, 110)}
        </p>

        {project.techStack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-500"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <Link
            to={`/projects/${project.slug}`}
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            View details
          </Link>
          <div className="ml-auto flex gap-2 text-slate-400">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-brand-600">
                <FiGithub size={18} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Live demo" className="hover:text-brand-600">
                <FiExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
