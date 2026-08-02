import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import SEO from "@/components/common/SEO";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLoginMutation } from "@/api/services/authApi";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { getErrorMessage } from "@/utils/helpers";

const schema = yup.object({
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required"),
});

/** Admin login page with redirect-back support. */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading }] = useLoginMutation();
  const from = location.state?.from?.pathname || "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  const onSubmit = async (values) => {
    try {
      await login(values).unwrap();
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid credentials"));
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-50 px-4 dark:bg-slate-950">
      <SEO title="Admin Login" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-10 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"
        >
          <FiArrowLeft /> Back to site
        </Link>
        <div className="card p-8">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-glow">
              <FiLock size={22} />
            </span>
            <h1 className="font-display text-2xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="admin@portfolio.dev"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <Button type="submit" size="lg" loading={isLoading} className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-6 rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-center text-xs text-slate-500">
            Demo credentials are printed by the seed script (npm run seed).
          </p>
        </div>
      </motion.div>
    </div>
  );
}
