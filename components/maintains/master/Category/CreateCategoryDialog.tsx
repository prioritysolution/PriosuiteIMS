"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { CategoryFormValues } from "@/containers/maintains/master/Hooks";
import { Category } from "@/containers/maintains/master/masterSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => void;
  editingCategory?: Category | null;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  editingCategory,
}: CreateCategoryDialogProps) {
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (open) {
      if (editingCategory) {
        reset({ CategoryName: editingCategory.name });
      } else {
        reset({ CategoryName: "" });
      }
    }
  }, [open, reset, editingCategory]);

  const onFormSubmit = (data: CategoryFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="bg-white border border-slate-200 text-slate-900"
      >
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-slate-800">
            {editingCategory ? "Edit Category" : "Create New Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <InputField
            control={control}
            name="CategoryName"
            label="Category Name"
            placeholder="e.g., Electronics, Groceries"
            isRequired
          />
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto sm:min-w-[120px] py-2.5 px-5 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[140px] py-2.5 px-5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg font-bold transition-all text-xs sm:text-sm cursor-pointer"
            >
              {editingCategory ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

