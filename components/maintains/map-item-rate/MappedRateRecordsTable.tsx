"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { MappedRate } from "@/containers/maintains/map-item-rate/MapItemRateSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface MappedRateRecordsTableProps {
  mappings: MappedRate[];
  loading?: boolean;
  onDeleteMapping: (id: string) => void;
}

export function MappedRateRecordsTable({
  mappings,
  loading = false,
  onDeleteMapping,
}: MappedRateRecordsTableProps) {
  const formatRate = (rate: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rate);
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse text-sm min-w-[750px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">
              SL
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Item Name & Specification
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">
              Unit
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-40">
              Base Rate
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-44">
              Last Updated
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <TableLoader colSpan={6} label="Loading mapped rates…" />
          ) : mappings.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-500 font-medium">
                No inventory item rates mapped yet. Click "Create New Mapping" to add one.
              </td>
            </tr>
          ) : (
            mappings.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-5 py-4 font-mono text-xs text-slate-500 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-800 group-hover:text-primary transition-colors whitespace-normal max-w-[250px]">
                    {item.itemName}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    SKU: {item.sku} | {item.specification}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-bold uppercase tracking-wider">
                    {item.unit}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-mono font-bold text-slate-800 text-base">
                  {formatRate(item.rate)}
                </td>
                <td className="px-5 py-4 text-slate-500 font-medium text-xs">
                  {item.lastUpdated}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button className="text-slate-400 hover:text-primary p-1 rounded hover:bg-primary/10 transition-all cursor-pointer">
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMapping(item.id)}
                      className="text-rose-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50 transition-all cursor-pointer"
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
      <ScrollBar orientation="horizontal" className="bg-slate-100" />
    </ScrollArea>
  );
}
