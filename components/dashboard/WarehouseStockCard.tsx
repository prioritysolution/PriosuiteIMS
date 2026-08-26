"use client";

import { ChevronRight, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { WarehouseStockRow } from "./types";

interface WarehouseStockCardProps {
  rows?: WarehouseStockRow[];
  onViewAll?: () => void;
}

export const defaultWarehouseRows: WarehouseStockRow[] = [
  { branch: "Main Store", items: 482, value: "₹5,62,400" },
  { branch: "Branch A", items: 276, value: "₹3,21,700" },
  { branch: "Branch B", items: 312, value: "₹3,64,200" },
  { branch: "Godown", items: 178, value: "₹2,17,300" },
  { branch: "Total", items: 1248, value: "₹12,48,500", isTotal: true },
];

export function WarehouseStockCard({
  rows = defaultWarehouseRows,
  onViewAll,
}: WarehouseStockCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none ring-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 min-w-0">
          <Home className="h-4 w-4 shrink-0 text-emerald-500" />
          <span className="truncate">Warehouse Stock</span>
        </CardTitle>
        <button
          type="button"
          onClick={onViewAll}
          className="flex shrink-0 items-center gap-0.5 text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          View All
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </CardHeader>

      <CardContent className="px-0 pt-0 overflow-x-auto">
        <Table className="min-w-[300px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="pl-6 text-xs font-medium text-slate-400">
                Branch / Warehouse
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400">
                Items
              </TableHead>
              <TableHead className="pr-6 text-xs font-medium text-slate-400">
                Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.branch}
                className={cn(
                  "border-slate-100 hover:bg-slate-50/60",
                  row.isTotal && "hover:bg-transparent",
                )}
              >
                <TableCell
                  className={cn(
                    "pl-6",
                    row.isTotal
                      ? "font-bold text-slate-900"
                      : "font-medium text-slate-700",
                  )}
                >
                  {row.branch}
                </TableCell>
                <TableCell
                  className={cn(
                    row.isTotal
                      ? "font-bold text-slate-900"
                      : "text-slate-500",
                  )}
                >
                  {row.items.toLocaleString("en-IN")}
                </TableCell>
                <TableCell
                  className={cn(
                    "pr-6",
                    row.isTotal
                      ? "font-bold text-slate-900"
                      : "text-slate-500",
                  )}
                >
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
