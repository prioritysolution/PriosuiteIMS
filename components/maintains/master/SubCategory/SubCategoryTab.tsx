"use client";

import React from "react";
import { Plus, Edit } from "lucide-react";
import { Category, SubCategory } from "@/containers/maintains/master/masterSlice";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableLoader } from "@/common/loader/TableLoader";

interface SubCategoryTabProps {
  subCategories: SubCategory[];
  categories: Category[];
  loading: boolean;
  onAddSubCategoryClick: () => void;
  onEditSubCategoryClick: (subCategory: SubCategory) => void;
  
}

export function SubCategoryTab({ subCategories, categories, loading, onAddSubCategoryClick, onEditSubCategoryClick,  }: SubCategoryTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Sub Categories Directory</h3>
        <button
          onClick={onAddSubCategoryClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="size-4" />
          Add Sub Category
        </button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-sm min-w-[500px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sub Category Name
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableLoader colSpan={3} label="Loading sub-categories…" />
            ) : subCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-4 text-center text-slate-400">
                  No sub-categories found
                </td>
              </tr>
            ) : (
              subCategories.map((subCategory) => (
                <tr key={subCategory.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{subCategory.name}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">
                    {categories.find(c => c.id === String(subCategory.categoryId))?.name || "-"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onEditSubCategoryClick(subCategory)}
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

