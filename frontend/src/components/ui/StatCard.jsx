import React from "react";
import Card from "./Card";
import clsx from "clsx";

export default function StatCard({ label, value, icon, accent = "ink", sub }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500 dark:text-ink-400">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">{value}</p>
          {sub && <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{sub}</p>}
        </div>
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-lg text-lg",
            accent === "clay" ? "bg-clay-100 text-clay-600 dark:bg-clay-900/40" : "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300"
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
