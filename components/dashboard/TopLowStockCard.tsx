"use client";

import { AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LowStockItem } from "./types";

interface TopLowStockCardProps {
  items?: LowStockItem[];
  onViewAll?: () => void;
}

export const defaultLowStockItems: LowStockItem[] = [
  { name: "Rice 25kg Bag", sku: "RI1001", stock: 6, reorderLevel: 20 },
  { name: "Sugar 1kg Pack", sku: "SG1002", stock: 8, reorderLevel: 25 },
  { name: "Tea 500g", sku: "TE1003", stock: 10, reorderLevel: 30 },
  { name: "Cooking Oil 1L", sku: "CO1004", stock: 12, reorderLevel: 40 },
  { name: "Detergent 1kg", sku: "DE1005", stock: 14, reorderLevel: 50 },
];

export function TopLowStockCard({
  items = defaultLowStockItems,
  onViewAll,
}: TopLowStockCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none ring-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 min-w-0">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
          <span className="truncate">Top Low Stock Items</span>
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
        <Table className="min-w-[400px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="pl-6 text-xs font-medium text-slate-400">
                Item Name
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400">
                SKU
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400">
                Stock
              </TableHead>
              <TableHead className="pr-6 text-xs font-medium text-slate-400">
                Reorder Level
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.sku} className="hover:bg-slate-50/60 border-slate-100">
                <TableCell className="pl-6 font-medium text-slate-700">
                  {item.name}
                </TableCell>
                <TableCell className="text-slate-500">{item.sku}</TableCell>
                <TableCell>
                  <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-semibold text-red-500">
                    {item.stock}
                  </span>
                </TableCell>
                <TableCell className="pr-6 text-slate-500">
                  {item.reorderLevel}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
