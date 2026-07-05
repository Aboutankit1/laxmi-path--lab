import React, { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>}
    <input
      ref={ref}
      className={clsx(
        "focus-ring w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50",
        error && "border-red-400",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));
Input.displayName = "Input";
export default Input;
