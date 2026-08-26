"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Voucher } from "@/containers/voucher/vouchers/vouchersSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface VoucherRecordsTableProps {
  vouchers: Voucher[];
  loading?: boolean;
  onDeleteVoucher: (id: string) => void;
}

export function VoucherRecordsTable({
  vouchers,
  loading = false,
  onDeleteVoucher,
}: VoucherRecordsTableProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-800/80 bg-slate-900/40">
      <table className="w-full text-left border-collapse text-sm min-w-[850px]">
        <thead className="bg-slate-900/85 border-b border-slate-800/80">
          <tr>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-16">
              SL
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">
              Date
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-44">
              Voucher No
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">
              Type
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Party / Ledger
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-36">
              Amount
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-32">
              Status
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center w-28">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {loading ? (
            <TableLoader colSpan={8} label="Loading vouchers…" tone="dark" />
          ) : vouchers.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-5 py-8 text-center text-slate-500 font-medium">
                No voucher records found. Click "Create New Voucher" to add one.
              </td>
            </tr>
          ) : (
            vouchers.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-900/50 transition-colors group">
                <td className="px-5 py-4 font-mono text-xs text-slate-500 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="px-5 py-4 text-slate-300 font-medium text-xs font-mono">
                  {item.date}
                </td>
                <td className="px-5 py-4 font-mono font-bold text-slate-200">
                  {item.voucherNo}
                </td>
                <td className="px-5 py-4 text-slate-300 font-semibold">
                  {item.type}
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-white group-hover:text-primary transition-colors whitespace-normal max-w-[200px]">
                    {item.ledgerName}
                  </div>
                  {item.narration && (
                    <div className="text-xs text-slate-500 mt-0.5 whitespace-normal max-w-[200px] truncate">
                      {item.narration}
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-right font-mono font-bold text-secondary text-base">
                  {formatAmount(item.amount)}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "Processed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-all cursor-pointer">
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteVoucher(item.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/20 transition-all cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" className="bg-slate-900/80" />
    </ScrollArea>
  );
}
