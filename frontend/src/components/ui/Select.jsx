import React, { forwardRef } from "react";
import clsx from "clsx";

const Select = forwardRef(({ label, error, className, children, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">{label}</label>}
    <select
      ref={ref}
      className={clsx(
        "focus-ring w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50",
        error && "border-red-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));
Select.displayName = "Select";
export default Select;
