import { motion } from "framer-motion";
import * as Fa6 from "react-icons/fa6";
import { FiCheck } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetServicesQuery } from "@/api/services/portfolioApi";
import { fadeInUp, staggerContainer, viewportOnce } from "@/animations/variants";

/** Services / offerings grid. */
export default function Services() {
  const { data } = useGetServicesQuery({ sort: "order" });
  const services = data?.data || [];
  if (!services.length) return null;

  return (
    <section id="services" className="section bg-slate-50 dark:bg-slate-900/40">
      <div className="container-app">
        <SectionHeading
          eyebrow="Services"
          title="What I can do for you"
          subtitle="End-to-end product development, from idea to production."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => {
            const Icon = Fa6[s.icon] || Fa6.FaCode;
            return (
              <motion.div
                key={s._id}
                variants={fadeInUp}
                className="card group relative overflow-hidden p-7 transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <span
                  className="mb-5 grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg"
                  style={{ background: s.color || "#6366f1" }}
                >
                  <Icon size={24} />
                </span>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.description}</p>

                {s.features?.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <FiCheck className="text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                )}

                {s.price && (
                  <p className="mt-6 text-sm font-semibold text-brand-600">{s.price}</p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
