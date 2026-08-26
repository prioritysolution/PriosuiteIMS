"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { StockEntryItem } from "@/containers/maintains/opening-stock/OpeningStockSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface ItemRecordsTableProps {
  items: StockEntryItem[];
  loading?: boolean;
  onDeleteItem: (id: string) => void;
}

export function ItemRecordsTable({
  items,
  loading = false,
  onDeleteItem,
}: ItemRecordsTableProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

 

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 ">
      <table className="w-full text-left border-collapse text-sm min-w-[700px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">
              SL
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              ITEM
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              QUANTITY
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
              UNIT
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              RATE
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              TOTAL VALUE
            </th>
            <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-28">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <TableLoader colSpan={7} label="Loading stock items…" />
          ) : items.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-8 text-center text-slate-500 font-medium"
              >
                No stock items added yet. Select an item and click Add Item.
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-5 py-4 font-mono text-xs text-slate-500 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-800 group-hover:text-primary transition-colors whitespace-normal max-w-[220px]">
                    {item.itemName}
                  </div>
                </td>
                <td className="px-5 py-4 text-right font-bold font-mono text-slate-700">
                  {formatNumber(item.quantity)}
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                    {item.unit}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-mono text-slate-600">
                  {formatNumber(item.rate)}
                </td>
                <td className="px-5 py-4 text-right font-mono font-bold text-slate-800">
                  {formatNumber(item.totalValue)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      title="Remove"
                      className="text-rose-400 hover:text-rose-500 p-1.5 rounded hover:bg-rose-50 transition-all cursor-pointer"
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
