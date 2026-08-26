"use client";

import React from "react";
import { Edit2 } from "lucide-react";
import { Party } from "@/containers/maintains/party-master/PartyMasterSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface PartyRecordsTableProps {
  parties: Party[];
  loading: boolean;
  onEdit?: (party: Party) => void;
}

export function PartyRecordsTable({
  parties,
  loading,
  onEdit,
}: PartyRecordsTableProps) {
  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absVal = Math.abs(amount);
    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absVal);

    return isNegative ? `₹ (${formatted})` : `₹ ${formatted}`;
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse text-sm min-w-[800px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Party Name
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-36">
              Type
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-44">
              Contact
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">
              GSTIN
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-44">
              Opening Bal.
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <TableLoader colSpan={6} label="Loading parties…" />
          ) : parties.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-500 font-medium">
                No parties registered yet. Click "Create New Party" to add one.
              </td>
            </tr>
          ) : (
            parties.map((party) => {
              const firstLetter = (party.name || "?").charAt(0).toUpperCase();

              return (
                <tr key={party.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                        {firstLetter}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-primary transition-colors whitespace-normal max-w-[200px]">
                          {party.name || "—"}
                        </div>
                        {party.code ? (
                          <div className="text-[11px] text-slate-400 font-mono">
                            Code: {party.code}
                          </div>
                        ) : null}
                        {party.address ? (
                          <div className="text-[11px] text-slate-400 whitespace-normal max-w-[220px] truncate">
                            {party.address}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        String(party.type).toLowerCase().includes("credit")
                          ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {party.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 font-medium font-mono text-xs">
                    {party.mobile || "—"}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-xs">
                    {party.gstin || "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-slate-800">
                    {formatCurrency(party.openingBalance)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onEdit?.(party)}
                        className="text-slate-400 hover:text-primary p-1 rounded hover:bg-primary/10 transition-all cursor-pointer"
                        aria-label={`Edit ${party.name || "party"}`}
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" className="bg-slate-100" />
    </ScrollArea>
  );
}
