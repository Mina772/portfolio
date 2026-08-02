import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Fa from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { ADMIN_NAV } from "@/constants";
import { cn } from "@/utils/cn";

/** Collapsible admin sidebar navigation (responsive drawer on mobile). */
export default function AdminSidebar({ open, onClose }) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5">
        <span className="font-display text-lg font-bold">
          <span className="gradient-text">Admin</span> Panel
        </span>
        <button onClick={onClose} className="lg:hidden" aria-label="Close menu">
          <FiX />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {ADMIN_NAV.map((item) => {
          const Icon = Fa[item.icon] || Fa.FaCircle;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-600 text-white shadow-glow"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )
              }
            >
              <Icon size={16} /> {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
