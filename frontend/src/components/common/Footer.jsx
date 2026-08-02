import { Link } from "react-router-dom";
import * as Fa6 from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { NAV_LINKS } from "@/constants";
import { useGetAboutQuery } from "@/api/services/portfolioApi";

/** Site footer with dynamic social links and quick navigation. */
export default function Footer() {
  const { data } = useGetAboutQuery();
  const about = data?.data;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div className="container-app grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="font-display text-2xl font-bold">
            <span className="gradient-text">Port</span>folio
          </Link>
          <p className="mt-4 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {about?.shortBio ||
              "Full stack engineer crafting performant, delightful digital products."}
          </p>
          <div className="mt-5 flex gap-2">
            {(about?.socialLinks || []).map((s) => {
              const Icon = Fa6[s.icon] || Fa6.FaLink;
              return (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.platform}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.slice(0, 5).map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-slate-500 hover:text-brand-600">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Get in touch
          </h4>
          <ul className="space-y-2 text-sm text-slate-500">
            {about?.email && (
              <li>
                <a href={`mailto:${about.email}`} className="hover:text-brand-600">
                  {about.email}
                </a>
              </li>
            )}
            {about?.location && <li>{about.location}</li>}
            <li>
              <Link to="/admin/login" className="hover:text-brand-600">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <p>© {year} {about?.name || "Portfolio"}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <FaHeart className="text-red-500" /> using the MERN stack
          </p>
        </div>
      </div>
    </footer>
  );
}
