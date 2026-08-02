/**
 * Tiny className combiner (no external deps).
 * Filters falsy values and joins with spaces.
 * @param {...(string|false|null|undefined)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default cn;
