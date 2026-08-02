import { motion } from "framer-motion";
import { FiBriefcase } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { useGetExperiencesQuery } from "@/api/services/portfolioApi";
import { formatDateRange } from "@/utils/helpers";
import { fadeInUp, viewportOnce } from "@/animations/variants";

/** Vertical timeline of professional experience. */
export default function Experience() {
  const { data } = useGetExperiencesQuery({ sort: "-startDate", limit: 50 });
  const items = data?.data || [];
  if (!items.length) return null;

  return (
    <section id="experience" className="section">
      <div className="container-app">
        <SectionHeading eyebrow="Career" title="Work Experience" />

        <div className="relative mt-14 mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-slate-200 dark:bg-slate-800 sm:left-1/2" />

          {items.map((exp, i) => (
            <motion.div
              key={exp._id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className={`relative mb-10 flex flex-col gap-4 sm:flex-row ${
                i % 2 === 0 ? "sm:flex-row-reverse" : ""
              }`}
            >
              <div className="hidden flex-1 sm:block" />
              <div className="absolute left-4 top-1 z-10 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-brand-600 text-white shadow-glow sm:left-1/2">
                <FiBriefcase size={14} />
              </div>
              <div className="flex-1 pl-12 sm:pl-0">
                <div className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <Badge tone="gray">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium text-brand-600">{exp.company}</p>
                  {exp.location && <p className="text-xs text-slate-400">{exp.location}</p>}
                  {exp.description && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {exp.description}
                    </p>
                  )}
                  {exp.responsibilities?.length > 0 && (
                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-500 dark:text-slate-400">
                      {exp.responsibilities.slice(0, 3).map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => (
                        <Badge key={t} tone="brand">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
