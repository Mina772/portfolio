/** Format a date range for timelines, e.g. "Mar 2022 — Present". */
export function formatDateRange(start, end, current) {
  const opts = { month: "short", year: "numeric" };
  const s = start ? new Date(start).toLocaleDateString("en-US", opts) : "";
  const e = current || !end ? "Present" : new Date(end).toLocaleDateString("en-US", opts);
  return `${s} — ${e}`;
}

/** Format a single date, e.g. "May 10, 2023". */
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format a date with time, e.g. "May 10, 2023, 2:45 PM". */
export function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Resolve an asset URL (Cloudinary returns absolute; local returns relative). */
export function resolveAsset(asset, fallback = "") {
  if (!asset) return fallback;
  const url = typeof asset === "string" ? asset : asset.url;
  return url || fallback;
}

/** Truncate text to a max length adding an ellipsis. */
export function truncate(text = "", max = 120) {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** Turn a comma/newline separated string into a trimmed array. */
export function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return value
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

/** Extract a human-friendly error message from an RTK Query error. */
export function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.data?.message ||
    error?.data?.errors?.[0]?.message ||
    error?.error ||
    error?.message ||
    fallback
  );
}

/** Capitalize the first letter of a string. */
export const capitalize = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

/** Compact number formatter, e.g. 1840 -> "1.8k". */
export const compactNumber = (n = 0) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
