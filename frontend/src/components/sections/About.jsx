import { motion } from "framer-motion";
import { FiMapPin, FiMail, FiPhone, FiCheckCircle } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { useGetAboutQuery } from "@/api/services/portfolioApi";
import { resolveAsset } from "@/utils/helpers";
import { fadeInUp, slideInLeft, slideInRight, viewportOnce } from "@/animations/variants";

/** "About Me" section with biography, quick facts and highlights. */
export default function About() {
  const { data } = useGetAboutQuery();
  const about = data?.data || {};

  const facts = [
    { icon: FiMapPin, label: "Location", value: about.location },
    { icon: FiMail, label: "Email", value: about.email },
    { icon: FiPhone, label: "Phone", value: about.phone },
  ].filter((f) => f.value);

  return (
    <section id="about" className="section">
      <div className="container-app">
        <SectionHeading eyebrow="About" title="Get to know me" />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-card">
              <img
                src={resolveAsset(about.coverImage || about.profileImage, "https://picsum.photos/seed/about/800/600")}
                alt="About"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>
            {about.yearsOfExperience > 0 && (
              <div className="absolute -bottom-6 -right-4 rounded-2xl bg-brand-600 px-6 py-4 text-white shadow-glow">
                <div className="font-display text-3xl font-bold">{about.yearsOfExperience}+</div>
                <div className="text-xs uppercase tracking-wide">Years exp.</div>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <h3 className="font-display text-2xl font-bold">
              {about.title || "Full Stack Engineer"}
            </h3>
            <p className="mt-4 whitespace-pre-line text-slate-500 dark:text-slate-400">
              {about.bio || about.shortBio}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 dark:bg-brand-500/15 text-brand-600">
                    <f.icon />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-400">{f.label}</div>
                    <div className="truncate text-sm font-medium">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {["Clean architecture", "Pixel-perfect UI", "Performance first", "Great communication"].map(
                (item) => (
                  <motion.li
                    key={item}
                    variants={fadeInUp}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                  >
                    <FiCheckCircle className="text-emerald-500" /> {item}
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
