import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";
import SEO from "@/components/common/SEO";
import StatCard from "@/components/admin/StatCard";
import Badge from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { useGetDashboardStatsQuery } from "@/api/services/portfolioApi";
import { formatDate } from "@/utils/helpers";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444", "#64748b"];

/** Admin analytics dashboard with KPIs and charts. */
export default function Dashboard() {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data;

  if (isLoading || !stats) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const { kpis, charts, recent } = stats;

  const cards = [
    { label: "Projects", value: kpis.totalProjects, icon: "FaFolderOpen", tone: "#6366f1", hint: `${kpis.publishedProjects} published` },
    { label: "Project Views", value: kpis.projectViews, icon: "FaEye", tone: "#8b5cf6" },
    { label: "Blog Posts", value: kpis.totalPosts, icon: "FaBlog", tone: "#ec4899", hint: `${kpis.publishedPosts} published` },
    { label: "Skills", value: kpis.totalSkills, icon: "FaCode", tone: "#10b981" },
    { label: "Certificates", value: kpis.totalCertificates, icon: "FaCertificate", tone: "#f59e0b" },
    { label: "Experience", value: kpis.totalExperience, icon: "FaBriefcase", tone: "#06b6d4" },
    { label: "Unread Messages", value: kpis.unreadMessages, icon: "FaEnvelope", tone: "#ef4444", hint: `${kpis.totalMessages} total` },
    { label: "Post Views", value: kpis.postViews, icon: "FaChartLine", tone: "#64748b" },
  ];

  return (
    <div className="space-y-8">
      <SEO title="Dashboard" />
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your portfolio performance.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-semibold">Projects by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.projectsByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold">Skills Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.skillsByCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(e) => e.category}
                >
                  {charts.skillsByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-semibold">Messages (last 6 months)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.messagesTimeline}>
              <defs>
                <linearGradient id="msgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#msgGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent Messages</h3>
            <Link to="/admin/messages" className="text-sm text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.messages.length === 0 && <p className="text-sm text-slate-400">No messages yet.</p>}
            {recent.messages.map((m) => (
              <div key={m._id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.subject}</p>
                  <p className="truncate text-xs text-slate-400">{m.name} · {m.email}</p>
                </div>
                <Badge tone={m.status === "unread" ? "red" : "gray"}>{m.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent Projects</h3>
            <Link to="/admin/projects" className="text-sm text-brand-600 hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recent.projects.length === 0 && <p className="text-sm text-slate-400">No projects yet.</p>}
            {recent.projects.map((p) => (
              <div key={p._id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-slate-400">{formatDate(p.createdAt)} · {p.views} views</p>
                </div>
                <div className="flex gap-1.5">
                  {p.featured && <Badge tone="amber">Featured</Badge>}
                  <Badge tone={p.status === "published" ? "green" : "gray"}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
