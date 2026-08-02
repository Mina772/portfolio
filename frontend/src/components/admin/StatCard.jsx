import { motion } from "framer-motion";
import * as Fa from "react-icons/fa";
import { compactNumber } from "@/utils/helpers";

/** KPI card for the dashboard grid. */
export default function StatCard({ label, value, icon = "FaChartBar", tone = "#6366f1", hint }) {
  const Icon = Fa[icon] || Fa.FaChartBar;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center gap-4 p-5"
    >
      <span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white"
        style={{ background: tone }}
      >
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <div className="font-display text-2xl font-bold">{compactNumber(value || 0)}</div>
        <div className="truncate text-sm text-slate-500">{label}</div>
        {hint && <div className="text-xs text-slate-400">{hint}</div>}
      </div>
    </motion.div>
  );
}
