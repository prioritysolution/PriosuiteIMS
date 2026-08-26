"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockMovementPoint } from "./types";

interface StockMovementChartProps {
  data?: StockMovementPoint[];
}

export const defaultStockMovementData: StockMovementPoint[] = [
  { date: "08 Aug", inward: 480, outward: 175 },
  { date: "09 Aug", inward: 560, outward: 210 },
  { date: "10 Aug", inward: 530, outward: 205 },
  { date: "11 Aug", inward: 700, outward: 250 },
  { date: "12 Aug", inward: 860, outward: 340 },
  { date: "13 Aug", inward: 690, outward: 240 },
  { date: "14 Aug", inward: 500, outward: 230 },
];

function ChartLegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-500">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-slate-700">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function StockMovementChart({
  data = defaultStockMovementData,
}: StockMovementChartProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none ring-0 h-full">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Stock Movement Trend
        </CardTitle>
        <div className="flex items-center gap-4">
          <ChartLegendDot color="#16a34a" label="Inward" />
          <ChartLegendDot color="#2563eb" label="Outward" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-56 sm:h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                domain={[0, 1000]}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="inward"
                name="Inward"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="outward"
                name="Outward"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
