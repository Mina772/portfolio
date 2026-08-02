import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/animations/variants";

/** Consistent, animated heading used at the top of each landing section. */
export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`max-w-2xl ${alignment}`}
    >
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-brand-100 dark:bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </motion.div>
  );
}
