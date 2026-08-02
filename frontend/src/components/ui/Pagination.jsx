import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/utils/cn";

/**
 * Numbered pagination control driven by server-provided meta.
 * @param {{page:number,totalPages:number,onChange:(p:number)=>void}} props
 */
export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null;

  // Build a compact page window around the current page.
  const pages = [];
  const window = 1;
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const btn =
    "flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        className={cn(btn, "hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40")}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              btn,
              p === page
                ? "bg-brand-600 text-white"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        className={cn(btn, "hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40")}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </nav>
  );
}
