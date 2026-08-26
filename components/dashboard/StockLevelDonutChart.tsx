"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockLevelSlice } from "./types";

interface StockLevelDonutChartProps {
  data?: StockLevelSlice[];
  total?: number;
}

export const defaultStockLevelData: StockLevelSlice[] = [
  { label: "In Stock", value: 78, count: 972, color: "#16a34a" },
  { label: "Low Stock", value: 6, count: 14, color: "#f59e0b" },
  { label: "Out of Stock", value: 4, count: 50, color: "#ef4444" },
  { label: "Others", value: 12, count: 212, color: "#2563eb" },
];

export function StockLevelDonutChart({
  data = defaultStockLevelData,
  total = 1248,
}: StockLevelDonutChartProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none ring-0 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">
          Stock Level Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-around xl:justify-between pt-2">
        <div className="relative h-44 w-44 sm:h-52 sm:w-52 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={3}
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">
              {total.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-slate-400">Items</span>
          </div>
        </div>

        <ul className="flex w-full max-w-xs flex-col gap-3">
          {data.map((slice) => (
            <li key={slice.label} className="flex items-center gap-2.5 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-slate-600">
                {slice.label} – {slice.value}% ({slice.count})
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
