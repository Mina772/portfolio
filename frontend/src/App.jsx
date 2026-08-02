import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import AppRoutes from "@/routes/AppRoutes";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useTheme } from "@/hooks/useTheme";
import { useLazyGetMeQuery } from "@/api/services/authApi";
import { selectToken } from "@/store/slices/authSlice";

/**
 * Root application component.
 * - Initializes the theme (light/dark).
 * - Bootstraps the current user session when an access token is present.
 * - Wires global providers: routing, SEO head, and toast notifications.
 */
export default function App() {
  const { theme } = useTheme();
  const token = useSelector(selectToken);
  const [fetchMe] = useLazyGetMeQuery();

  // Restore the session on first load if a token exists in storage.
  useEffect(() => {
    if (token) fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            className:
              "!bg-white dark:!bg-slate-800 !text-slate-800 dark:!text-slate-100 !shadow-lg !rounded-xl",
            style: { border: "1px solid rgba(148,163,184,0.2)" },
          }}
          theme={theme}
        />
      </BrowserRouter>
    </HelmetProvider>
  );
}
