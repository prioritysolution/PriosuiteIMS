"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { PartyTransaction } from "@/containers/voucher/party-transaction/PartyTransactionSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface PartyTransactionRecordsTableProps {
  transactions: PartyTransaction[];
  loading?: boolean;
  onDeleteTransaction: (id: string) => void;
}

export function PartyTransactionRecordsTable({
  transactions,
  loading = false,
  onDeleteTransaction,
}: PartyTransactionRecordsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-800/80 bg-slate-900/40">
      <table className="w-full text-left border-collapse text-sm min-w-[950px]">
        <thead className="bg-slate-900/85 border-b border-slate-800/80">
          <tr>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">
              Date
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Party Name
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-48">
              Reference
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-36">
              Debit (₹)
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-36">
              Credit (₹)
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right w-44">
              Balance (₹)
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
            <TableLoader colSpan={8} label="Loading transactions…" tone="dark" />
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-5 py-8 text-center text-slate-500 font-medium">
                No transaction records registered. Click "Record Transaction" to add one.
              </td>
            </tr>
          ) : (
            transactions.map((item) => {
              const firstLetter = item.partyName.split(" ").map((n) => n.charAt(0)).join("").toUpperCase().slice(0, 2);

              return (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-colors group">
                  <td className="px-5 py-4 text-slate-300 font-medium text-xs font-mono">
                    {item.date}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-slate-850 border border-slate-800 flex items-center justify-center font-bold text-xs text-primary">
                        {firstLetter}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-primary transition-colors whitespace-normal max-w-[200px]">
                          {item.partyName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-200">
                    {item.reference}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-slate-300">
                    {item.debit !== null ? formatCurrency(item.debit) : "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-emerald-400">
                    {item.credit !== null ? formatCurrency(item.credit) : "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-slate-200">
                    {formatCurrency(item.balance)} <span className="text-[10px] text-slate-500 uppercase">{item.balanceType}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.status === "VERIFIED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.status === "PROCESSED"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : item.status === "DISPUTED"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-slate-800 text-slate-500 border border-slate-700/60"
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
                        onClick={() => onDeleteTransaction(item.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" className="bg-slate-900/80" />
    </ScrollArea>
  );
}
