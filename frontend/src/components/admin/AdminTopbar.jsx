import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiMenu, FiLogOut, FiExternalLink } from "react-icons/fi";
import ThemeToggle from "@/components/common/ThemeToggle";
import { selectCurrentUser } from "@/store/slices/authSlice";
import { useLogoutMutation } from "@/api/services/authApi";

/** Admin top bar with menu toggle, profile and logout. */
export default function AdminTopbar({ onMenu }) {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* ignore network error, we still clear locally */
    }
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenu}
        className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex"
        >
          <FiExternalLink size={16} /> View site
        </a>
        <ThemeToggle />
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 sm:flex">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">{user?.name}</div>
            <div className="text-xs text-slate-400">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="grid h-10 w-10 place-items-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          aria-label="Logout"
          title="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </header>
  );
}
