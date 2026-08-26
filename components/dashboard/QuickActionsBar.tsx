"use client";

import {
  Database,
  FileText,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QuickAction } from "./types";

const ICON_MAP = {
  cart: ShoppingCart,
  truck: Truck,
  package: Package,
  report: FileText,
  database: Database,
} as const;

const TONE_STYLES: Record<QuickAction["tone"], string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-violet-50 text-violet-600",
  amber: "bg-teal-50 text-teal-600",
  teal: "bg-slate-100 text-slate-700",
};

export const defaultQuickActions: QuickAction[] = [
  {
    label: "Purchase Entry",
    description: "Add stock from supplier",
    icon: "cart",
    tone: "blue",
  },
  {
    label: "Sales / Issue",
    description: "Dispatch stock",
    icon: "truck",
    tone: "green",
  },
  {
    label: "Stock Adjustment",
    description: "Update inventory",
    icon: "package",
    tone: "purple",
  },
  {
    label: "Stock Report",
    description: "View detailed report",
    icon: "report",
    tone: "amber",
  },
  {
    label: "Item Master",
    description: "Manage products",
    icon: "database",
    tone: "teal",
  },
];

interface QuickActionsBarProps {
  actions?: QuickAction[];
  onActionClick?: (action: QuickAction) => void;
}

export function QuickActionsBar({
  actions = defaultQuickActions,
  onActionClick,
}: QuickActionsBarProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {actions.map((action) => {
        const Icon = ICON_MAP[action.icon];
        return (
          <Card
            key={action.label}
            role="button"
            tabIndex={0}
            onClick={() => onActionClick?.(action)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActionClick?.(action);
              }
            }}
            className="flex cursor-pointer flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-none ring-0 transition-colors hover:bg-slate-50"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                TONE_STYLES[action.tone],
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold text-slate-800 truncate">
                {action.label}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {action.description}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
