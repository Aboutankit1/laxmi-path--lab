import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas-light text-center dark:bg-canvas-dark">
      <p className="font-display text-6xl font-bold text-ink-800 dark:text-ink-100">404</p>
      <p className="text-ink-500 dark:text-ink-400">The page you're looking for doesn't exist.</p>
      <Link to="/"><Button>Back to Dashboard</Button></Link>
    </div>
  );
}
