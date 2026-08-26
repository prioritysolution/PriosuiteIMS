"use client";

import React from "react";
import { Plus, Edit } from "lucide-react";
import { Unit } from "@/containers/maintains/master/masterSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface UnitTabProps {
  units: Unit[];
  loading: boolean;
  onAddUnitClick: () => void;
  onEditUnitClick: (unit: Unit) => void;
}

export function UnitTab({
  units,
  loading,
  onAddUnitClick,
  onEditUnitClick,
}: UnitTabProps) {
  // console.log("units", units);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Units Directory</h3>
        <button
          onClick={onAddUnitClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="size-4" />
          Add Unit
        </button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-sm min-w-[500px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Unit Name
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Symbol / Code
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoader colSpan={3} label="Loading units…" />
            ) : (
              units.map((unit) => (
                <tr
                  key={unit.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {unit.name}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-700">
                    {unit.code}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onEditUnitClick(unit)}
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

