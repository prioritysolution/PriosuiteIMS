"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface TableLoaderProps {
  colSpan: number;
  label?: string;
  className?: string;
  /** Use darker styles for dark-themed tables */
  tone?: "light" | "dark";
}

export function TableLoader({
  colSpan,
  label = "Loading…",
  className,
  tone = "light",
}: TableLoaderProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className={cn(
          "px-5 py-10 text-center",
          tone === "dark" ? "text-slate-400" : "text-slate-500",
          className,
        )}
      >
        <div className="inline-flex flex-col items-center gap-3">
          <Spinner
            className={cn(
              "size-6",
              tone === "dark" ? "text-primary" : "text-primary",
            )}
          />
          <span className="text-sm font-medium">{label}</span>
        </div>
      </td>
    </tr>
  );
}
