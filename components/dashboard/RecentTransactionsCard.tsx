"use client";

import { ChevronRight, Clock } from "lucide-react";
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
import type { TransactionItem, TransactionType } from "./types";

interface RecentTransactionsCardProps {
  transactions?: TransactionItem[];
  onViewAll?: () => void;
}

export const defaultTransactions: TransactionItem[] = [
  { type: "Purchase", item: "Rice 25kg Bag", qty: 100, date: "14 Aug" },
  { type: "Purchase", item: "Sugar 1kg Pack", qty: 200, date: "14 Aug" },
  { type: "Sales", item: "Tea 500g", qty: 50, date: "14 Aug" },
  { type: "Issue", item: "Cooking Oil 1L", qty: 25, date: "14 Aug" },
  { type: "Purchase", item: "Detergent 1kg", qty: 150, date: "14 Aug" },
];

const TYPE_STYLES: Record<TransactionType, string> = {
  Purchase: "bg-emerald-50 text-emerald-600",
  Sales: "bg-red-50 text-red-500",
  Issue: "bg-orange-50 text-orange-500",
};

export function RecentTransactionsCard({
  transactions = defaultTransactions,
  onViewAll,
}: RecentTransactionsCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none ring-0 h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 min-w-0">
          <Clock className="h-4 w-4 shrink-0 text-blue-500" />
          <span className="truncate">Recent Transactions</span>
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
        <Table className="min-w-[380px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="pl-6 text-xs font-medium text-slate-400">
                Type
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400">
                Item
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-400">
                Qty
              </TableHead>
              <TableHead className="pr-6 text-xs font-medium text-slate-400">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, idx) => (
              <TableRow
                key={`${tx.item}-${idx}`}
                className="hover:bg-slate-50/60 border-slate-100"
              >
                <TableCell className="pl-6">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      TYPE_STYLES[tx.type],
                    )}
                  >
                    {tx.type}
                  </span>
                </TableCell>
                <TableCell className="text-slate-700">{tx.item}</TableCell>
                <TableCell className="text-slate-500">{tx.qty}</TableCell>
                <TableCell className="pr-6 text-slate-500">{tx.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
