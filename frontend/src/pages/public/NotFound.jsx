import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import SEO from "@/components/common/SEO";

/** Friendly 404 page. */
export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <SEO title="404 — Not Found" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-8xl font-bold gradient-text">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you're looking for doesn't exist or was moved.</p>
        <Button as={Link} to="/" size="lg" className="mt-8">
          Back home
        </Button>
      </motion.div>
    </div>
  );
}
