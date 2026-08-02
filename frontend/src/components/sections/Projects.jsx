import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { CardSkeleton } from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/common/ProjectCard";
import { useGetProjectsQuery } from "@/api/services/portfolioApi";
import { PROJECT_CATEGORIES } from "@/constants";
import { staggerContainer, viewportOnce } from "@/animations/variants";
import { cn } from "@/utils/cn";

/** Featured projects grid with client-side category filtering. */
export default function Projects() {
  const [category, setCategory] = useState("all");
  const { data, isLoading } = useGetProjectsQuery({
    limit: 6,
    sort: "-featured,order,-createdAt",
    ...(category !== "all" ? { category } : {}),
  });
  const projects = data?.data || [];

  const filters = ["all", ...PROJECT_CATEGORIES];

  return (
    <section id="projects" className="section">
      <div className="container-app">
        <SectionHeading
          eyebrow="Portfolio"
          title="Featured Projects"
          subtitle="A selection of products I've designed, built and shipped."
        />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setCategory(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                category === f
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </motion.div>

        {!isLoading && projects.length === 0 && (
          <p className="mt-10 text-center text-slate-500">No projects in this category yet.</p>
        )}

        <div className="mt-12 text-center">
          <Button as={Link} to="/projects" variant="outline" size="lg">
            View all projects <FiArrowRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
