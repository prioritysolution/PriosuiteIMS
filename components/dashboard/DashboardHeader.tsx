"use client";

import { Building2, CalendarDays, ChevronDown, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  dateRangeLabel?: string;
  branchLabel?: string;
  onDateRangeClick?: () => void;
  onBranchClick?: () => void;
}

export function DashboardHeader({
  dateRangeLabel = "14 Aug 2026 – 14 Aug 2026",
  branchLabel = "All Branches",
  onDateRangeClick,
  onBranchClick,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-x-3 gap-y-0.5 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <span className="text-sm text-slate-400 truncate">
            Inventory Overview &amp; Stock Insights
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
        <Button
          variant="outline"
          onClick={onDateRangeClick}
          className="h-10 w-full sm:w-auto justify-start gap-2 rounded-xl border-slate-200 bg-white px-3 font-normal text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
        >
          <CalendarDays className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-sm truncate">{dateRangeLabel}</span>
        </Button>

        <Button
          variant="outline"
          onClick={onBranchClick}
          className="h-10 w-full sm:w-auto justify-between gap-2 rounded-xl border-slate-200 bg-white px-3 font-normal text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-sm truncate">{branchLabel}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
