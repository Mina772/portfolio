import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa6";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetTestimonialsQuery } from "@/api/services/portfolioApi";
import { resolveAsset } from "@/utils/helpers";
import { fadeInUp, staggerContainer, viewportOnce } from "@/animations/variants";

/** Client testimonials grid. */
export default function Testimonials() {
  const { data } = useGetTestimonialsQuery({ sort: "order", limit: 6 });
  const items = data?.data || [];
  if (!items.length) return null;

  return (
    <section id="testimonials" className="section">
      <div className="container-app">
        <SectionHeading
          eyebrow="Testimonials"
          title="What people say"
          subtitle="Feedback from teams and clients I've collaborated with."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((t) => (
            <motion.blockquote key={t._id} variants={fadeInUp} className="card flex flex-col p-7">
              <FaQuoteLeft className="mb-4 text-2xl text-brand-500/40" />
              <p className="flex-1 text-sm text-slate-600 dark:text-slate-300">"{t.quote}"</p>
              <div className="mt-4 flex gap-0.5 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <img
                  src={resolveAsset(t.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=6366f1&color=fff`)}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-slate-400">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
