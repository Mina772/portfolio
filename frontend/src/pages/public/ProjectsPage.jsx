import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "@/components/common/SEO";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/common/ProjectCard";
import { CardSkeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { useGetProjectsQuery } from "@/api/services/portfolioApi";
import { PROJECT_CATEGORIES } from "@/constants";
import { staggerContainer } from "@/animations/variants";
import { cn } from "@/utils/cn";

/** Full paginated, searchable and filterable projects listing page. */
export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data, isFetching } = useGetProjectsQuery({
    page,
    limit: 9,
    search: search || undefined,
    ...(category !== "all" ? { category } : {}),
  });
  const projects = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container-app pt-28 pb-20">
      <SEO title="Projects" description="Explore my portfolio of web and software projects." path="/projects" />
      <SectionHeading eyebrow="Portfolio" title="All Projects" />

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search projects…"
          className="input-field max-w-xs"
        />
        <div className="flex flex-wrap justify-center gap-2">
          {["all", ...PROJECT_CATEGORIES].map((f) => (
            <button
              key={f}
              onClick={() => {
                setCategory(f);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
                category === f
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isFetching
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : projects.map((p) => <ProjectCard key={p._id} project={p} />)}
      </motion.div>

      {!isFetching && projects.length === 0 && (
        <div className="mt-10">
          <EmptyState title="No projects found" message="Try a different search or category." />
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="mt-12">
          <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
