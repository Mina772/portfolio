import Spinner from "@/components/ui/Spinner";

/** Full-viewport loader used as a Suspense fallback. */
export default function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4 text-brand-600">
        <Spinner size={40} />
        <p className="text-sm font-medium text-slate-500">Loading…</p>
      </div>
    </div>
  );
}
