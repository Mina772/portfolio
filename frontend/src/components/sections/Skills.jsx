import { useMemo } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useGetSkillsQuery } from "@/api/services/portfolioApi";
import { capitalize } from "@/utils/helpers";
import { fadeInUp, staggerContainer, viewportOnce } from "@/animations/variants";

const CATEGORY_LABELS = {
  language: "Languages",
  framework: "Frameworks",
  library: "Libraries",
  database: "Databases",
  cloud: "Cloud",
  devops: "DevOps",
  tool: "Tools",
  soft: "Soft Skills",
};

/** Skills section grouped by category with animated proficiency bars. */
export default function Skills() {
  const { data, isLoading } = useGetSkillsQuery({ sort: "order", limit: 100 });
  const skills = data?.data || [];

  const grouped = useMemo(() => {
    return skills.reduce((acc, s) => {
      (acc[s.category] ||= []).push(s);
      return acc;
    }, {});
  }, [skills]);

  return (
    <section id="skills" className="section bg-slate-50 dark:bg-slate-900/40">
      <div className="container-app">
        <SectionHeading
          eyebrow="Skills"
          title="Technologies I work with"
          subtitle="A snapshot of the tools and platforms I use to ship production software."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}

          {Object.entries(grouped).map(([category, items]) => (
            <motion.div
              key={category}
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="card p-6"
            >
              <h3 className="mb-5 font-display text-lg font-semibold">
                {CATEGORY_LABELS[category] || capitalize(category)}
              </h3>
              <div className="space-y-4">
                {items.map((skill, i) => (
                  <motion.div key={skill._id} variants={fadeInUp}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    {i < items.length - 1 && (
                      <div
                        className="mt-4 h-px w-full opacity-40"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${skill.color || "#6366f1"}, transparent)`,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
