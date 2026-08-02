import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import Badge from "@/components/ui/Badge";
import { useGetEducationsQuery, useGetCertificatesQuery } from "@/api/services/portfolioApi";
import { formatDateRange, resolveAsset } from "@/utils/helpers";
import { fadeInUp, staggerContainer, viewportOnce } from "@/animations/variants";

/** Education history plus a compact certificates grid. */
export default function Education() {
  const { data: eduData } = useGetEducationsQuery({ sort: "-startDate" });
  const { data: certData } = useGetCertificatesQuery({ sort: "-issueDate", limit: 8 });
  const education = eduData?.data || [];
  const certs = certData?.data || [];

  if (!education.length && !certs.length) return null;

  return (
    <section id="education" className="section bg-slate-50 dark:bg-slate-900/40">
      <div className="container-app grid gap-12 lg:grid-cols-2">
        {education.length > 0 && (
          <div>
            <SectionHeading eyebrow="Education" title="Academic Background" align="left" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-8 space-y-5"
            >
              {education.map((edu) => (
                <motion.div key={edu._id} variants={fadeInUp} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-sm font-medium text-brand-600">{edu.institution}</p>
                      {edu.field && <p className="text-xs text-slate-400">{edu.field}</p>}
                    </div>
                    <Badge tone="gray">{formatDateRange(edu.startDate, edu.endDate, edu.current)}</Badge>
                  </div>
                  {edu.description && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {edu.description}
                    </p>
                  )}
                  {edu.grade && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">{edu.grade}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {certs.length > 0 && (
          <div>
            <SectionHeading eyebrow="Certificates" title="Certifications" align="left" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              {certs.map((c) => (
                <motion.a
                  key={c._id}
                  variants={fadeInUp}
                  href={c.credentialUrl || "#"}
                  target={c.credentialUrl ? "_blank" : undefined}
                  rel="noreferrer"
                  className="card group overflow-hidden p-4 transition-shadow hover:shadow-glow"
                >
                  <div className="mb-3 flex items-center gap-3">
                    {c.image?.url ? (
                      <img
                        src={resolveAsset(c.image)}
                        alt={c.title}
                        className="h-10 w-10 rounded-lg object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-100 text-amber-600">
                        <FiAward />
                      </span>
                    )}
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold">{c.title}</h4>
                      <p className="truncate text-xs text-slate-400">{c.organization}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
