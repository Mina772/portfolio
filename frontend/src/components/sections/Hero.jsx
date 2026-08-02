import { motion } from "framer-motion";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import * as Fa6 from "react-icons/fa6";
import Button from "@/components/ui/Button";
import { useGetAboutQuery } from "@/api/services/portfolioApi";
import { resolveAsset, compactNumber } from "@/utils/helpers";
import { fadeInUp, staggerContainer } from "@/animations/variants";

/** Above-the-fold hero with animated intro, CTA and profile card. */
export default function Hero() {
  const { data } = useGetAboutQuery();
  const about = data?.data || {};
  const stats = about.stats || {};

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-36"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-600/20" />
        <div className="absolute right-1/4 top-40 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark [background-size:40px_40px] opacity-40" />
      </div>

      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 px-4 py-1.5 text-sm font-medium backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {about.availability === "unavailable"
              ? "Currently unavailable"
              : "Available for new projects"}
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
          >
            Hi, I'm <span className="gradient-text">{about.name || "a Developer"}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-3 text-xl font-semibold text-slate-600 dark:text-slate-300"
          >
            {about.title || "Full Stack Engineer"}
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-xl text-balance text-base text-slate-500 dark:text-slate-400"
          >
            {about.subtitle || about.shortBio ||
              "I design and build performant, accessible and delightful web applications end to end."}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => scrollTo("#projects")}>
              View my work <FiArrowRight />
            </Button>
            {about.resumeUrl && (
              <Button
                as="a"
                href={about.resumeUrl}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                size="lg"
              >
                <FiDownload /> Resume
              </Button>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex gap-8">
            {[
              { label: "Projects", value: stats.projects },
              { label: "Clients", value: stats.clients },
              { label: "Experience", value: about.yearsOfExperience, suffix: "+ yrs" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold">
                  {compactNumber(s.value || 0)}
                  {s.suffix || "+"}
                </div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand-500 to-purple-500 opacity-20 blur-2xl" />
          <div className="relative animate-float overflow-hidden rounded-[2rem] border border-white/40 dark:border-white/10 shadow-glow">
            <img
              src={resolveAsset(about.profileImage, "https://i.pravatar.cc/500?img=13")}
              alt={about.name || "Profile"}
              className="aspect-[4/5] w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {(about.socialLinks || []).slice(0, 4).map((s) => {
              const Icon = Fa6[s.icon] || Fa6.FaLink;
              return (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.platform}
                  className="grid h-11 w-11 place-items-center rounded-xl glass text-slate-700 dark:text-white shadow-card hover:text-brand-600"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
