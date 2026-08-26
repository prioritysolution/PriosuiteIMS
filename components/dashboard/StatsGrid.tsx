import {
  AlertTriangle,
  Boxes,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatCardData } from "./types";

const ICON_MAP = {
  boxes: Boxes,
  warehouse: Warehouse,
  alert: AlertTriangle,
  package: Package,
  cart: ShoppingCart,
} as const;

const TONE_STYLES: Record<
  StatCardData["tone"],
  { bg: string; iconBg: string; iconColor: string; label: string }
> = {
  blue: {
    bg: "bg-blue-50/80 border-blue-100",
    iconBg: "bg-blue-500",
    iconColor: "text-white",
    label: "text-blue-800",
  },
  green: {
    bg: "bg-emerald-50/80 border-emerald-100",
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    label: "text-emerald-800",
  },
  amber: {
    bg: "bg-amber-50/80 border-amber-100",
    iconBg: "bg-amber-500",
    iconColor: "text-white",
    label: "text-amber-800",
  },
  purple: {
    bg: "bg-violet-50/80 border-violet-100",
    iconBg: "bg-violet-500",
    iconColor: "text-white",
    label: "text-violet-800",
  },
  teal: {
    bg: "bg-teal-50/80 border-teal-100",
    iconBg: "bg-teal-500",
    iconColor: "text-white",
    label: "text-teal-800",
  },
};

function StatCard({ label, value, change, trend, icon, tone }: StatCardData) {
  const Icon = ICON_MAP[icon];
  const styles = TONE_STYLES[tone];
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <Card
      className={cn(
        "flex min-w-[200px] flex-col gap-4 rounded-2xl border p-4 sm:p-5 shadow-none ring-0",
        styles.bg,
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            styles.iconBg,
          )}
        >
          <Icon className={cn("h-[18px] w-[18px]", styles.iconColor)} />
        </div>
        <span className={cn("text-sm font-medium leading-tight", styles.label)}>
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === "up" ? "text-emerald-600" : "text-red-500",
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          <span>
            {change} <span className="text-slate-400 font-normal">vs. last month</span>
          </span>
        </div>
      </div>
    </Card>
  );
}

interface StatsGridProps {
  stats: StatCardData[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <>
      {/* Mobile / tablet: horizontal scroll to keep 5 cards readable */}
      <div className="xl:hidden -mx-1 overflow-x-auto pb-1">
        <div className="flex gap-3 px-1 min-w-max sm:grid sm:min-w-0 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      {/* Desktop: equal 5-column row */}
      <div className="hidden xl:grid xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </>
  );
}

export const defaultStats: StatCardData[] = [
  {
    label: "Total Items",
    value: "1,248",
    change: "6.2%",
    trend: "up",
    icon: "boxes",
    tone: "blue",
  },
  {
    label: "In Stock Value",
    value: "₹12,48,500",
    change: "8.4%",
    trend: "up",
    icon: "warehouse",
    tone: "green",
  },
  {
    label: "Low Stock Items",
    value: "14",
    change: "22.2%",
    trend: "down",
    icon: "alert",
    tone: "amber",
  },
  {
    label: "Pending Purchase",
    value: "32",
    change: "12.5%",
    trend: "up",
    icon: "package",
    tone: "purple",
  },
  {
    label: "Pending Sales",
    value: "18",
    change: "18.2%",
    trend: "down",
    icon: "cart",
    tone: "teal",
  },
];
