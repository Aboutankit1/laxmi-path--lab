import React from "react";

export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-100 dark:border-ink-800">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:bg-ink-800/60 dark:text-ink-400">
      <tr>{children}</tr>
    </thead>
  );
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-ink-100 dark:divide-ink-800">{children}</tbody>;
}

export function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

export function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-ink-800 dark:text-ink-200 ${className}`}>{children}</td>;
}

export function Tr({ children, ...props }) {
  return (
    <tr className="transition-colors hover:bg-ink-50/70 dark:hover:bg-ink-800/40" {...props}>
      {children}
    </tr>
  );
}
