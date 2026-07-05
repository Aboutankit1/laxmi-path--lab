import React from "react";
import clsx from "clsx";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-xl2 border border-ink-100 bg-white/90 shadow-soft backdrop-blur dark:border-ink-800 dark:bg-ink-900/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
