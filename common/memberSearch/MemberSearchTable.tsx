"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";
import type { MemberSearchItem } from "./types";

interface MemberSearchTableProps {
  loading: boolean;
  data: MemberSearchItem[];
  handleSelectData: (item: MemberSearchItem) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  lastPage: number;
}

export function MemberSearchTable({
  loading,
  data,
  handleSelectData,
  currentPage,
  setCurrentPage,
  lastPage,
}: MemberSearchTableProps) {
  return (
    <div className="w-full mt-3 space-y-3">
      <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-sm min-w-[640px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-3 sm:px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                CIF No.
              </th>
              <th className="px-3 sm:px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 sm:px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                Relation
              </th>
              <th className="px-3 sm:px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                Address
              </th>
              <th className="px-3 sm:px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center w-24">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoader colSpan={5} label="Searching members…" />
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500 text-sm"
                >
                  No members found. Try another name.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.Id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-3 font-mono text-xs text-slate-700">
                    {item.CIF_No}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-800 font-medium whitespace-normal max-w-[180px]">
                    {item.Full_Name}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-600 text-xs hidden sm:table-cell whitespace-normal max-w-[140px]">
                    {item.Relation_Name || "—"}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-500 text-xs hidden md:table-cell whitespace-normal max-w-[180px]">
                    {item.Address || "—"}
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleSelectData(item)}
                      className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#00264D] text-white hover:bg-[#00264D]/90 transition-colors cursor-pointer"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {lastPage > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
          <span>
            Page {currentPage} of {lastPage}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={cn(
                "px-3 py-1.5 rounded-md border border-slate-200 transition-colors",
                currentPage <= 1
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
              )}
            >
              Prev
            </button>
            <button
              type="button"
              disabled={currentPage >= lastPage}
              onClick={() =>
                setCurrentPage(Math.min(lastPage, currentPage + 1))
              }
              className={cn(
                "px-3 py-1.5 rounded-md border border-slate-200 transition-colors",
                currentPage >= lastPage
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-50 cursor-pointer",
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberSearchTable;
