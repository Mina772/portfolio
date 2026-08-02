import { forwardRef } from "react";
import { cn } from "@/utils/cn";

/** Labeled text input wired for react-hook-form via forwardRef. */
export const Input = forwardRef(function Input(
  { label, error, className, wrapperClassName, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className={cn("w-full", wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn("input-field", error && "border-red-500 focus:ring-red-500/30", className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

/** Labeled textarea. */
export const Textarea = forwardRef(function Textarea(
  { label, error, className, id, rows = 4, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={cn("input-field resize-y", error && "border-red-500", className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

/** Labeled select. */
export const Select = forwardRef(function Select(
  { label, error, className, id, children, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <select
        id={inputId}
        ref={ref}
        className={cn("input-field", error && "border-red-500", className)}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
