"use client";

import React from "react";
import { Plus, Edit } from "lucide-react";
import { Item } from "@/containers/maintains/master/masterSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface ItemTabProps {
  items: Item[];
  loading: boolean;
  onAddItemClick: () => void;
  onEditItemClick: (item: Item) => void;
}

export function ItemTab({
  items,
  loading,
  onAddItemClick,
  onEditItemClick,
}: ItemTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Items Directory</h3>
        <button
          onClick={onAddItemClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="size-4" />
          Add Item
        </button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-sm min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sub Category
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                HSN Code
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                GST (%)
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoader colSpan={7} label="Loading items…" />
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-4 text-center text-slate-400">
                  No items found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {item.itemName}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {item.brandName || item.selectBrand}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {item.categoryName || item.selectCategory}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {item.subCategoryName || item.selectSubCategory}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-500">
                    {item.hsnCode}
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">
                    {item.igst > 0 ? `${item.igst}%` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onEditItemClick(item)}
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
