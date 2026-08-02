import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-glow hover:shadow-lg",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
  outline:
    "border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
  ghost: "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  glass: "glass text-slate-800 dark:text-white hover:bg-white/80",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
  icon: "p-2.5",
};

/**
 * Polished, accessible button with variants, sizes and a loading state.
 */
const Button = forwardRef(function Button(
  {
    as: Comp = "button",
    variant = "primary",
    size = "md",
    className,
    loading = false,
    disabled,
    children,
    ...props
  },
  ref
) {
  return (
    <Comp
      ref={ref}
      className={cn("btn", VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </Comp>
  );
});

export default Button;
