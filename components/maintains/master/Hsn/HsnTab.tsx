"use client";

import React from "react";
import { Plus, Edit } from "lucide-react";
import { Hsn } from "@/containers/maintains/master/masterSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface HsnTabProps {
  hsnList: Hsn[];
  loading: boolean;
  onAddHsnClick: () => void;
  onEditHsnClick: (hsn: Hsn) => void;
}

export function HsnTab({
  hsnList,
  loading,
  onAddHsnClick,
  onEditHsnClick,
}: HsnTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">HSN Directory</h3>
        <button
          onClick={onAddHsnClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="size-4" />
          Add HSN
        </button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-sm min-w-[700px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                HSN Description
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                HSN Code
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                CGST Rate
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                SGST Rate
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                IGST Rate
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoader colSpan={6} label="Loading HSN records…" />
            ) : hsnList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-4 text-center text-slate-400">
                  No HSN records found
                </td>
              </tr>
            ) : (
              hsnList.map((hsn) => (
                <tr
                  key={hsn.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {hsn.description}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{hsn.code}</td>
                  <td className="px-5 py-3.5 text-right text-slate-700">
                    {hsn.cgstRate}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-700">
                    {hsn.sgstRate}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-700">
                    {hsn.igstRate}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onEditHsnClick(hsn)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer transition-colors"
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" className="bg-slate-100" />
      </ScrollArea>
    </div>
  );
}
