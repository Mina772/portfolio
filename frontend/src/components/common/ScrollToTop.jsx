import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to the top of the page on route change (ignores hash anchors). */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
}
