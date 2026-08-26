"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { SubCategoryFormValues } from "@/containers/maintains/master/Hooks";
import {
  Category,
  SubCategory,
} from "@/containers/maintains/master/masterSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";

interface CreateSubCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<SubCategoryFormValues>;
  onSubmit: (data: SubCategoryFormValues) => void;
  categories: Category[];
  editingSubCategory?: SubCategory | null;
}

export function CreateSubCategoryDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  categories,
  editingSubCategory,
}: CreateSubCategoryDialogProps) {
  const { handleSubmit, control, reset } = form;

  // Map categories to the shape DropdownField expects (needs an "Id" field)
  const categoryOptions = categories.map((c) => ({
    Id: c.id,
    Option_Value: c.name,
  }));

  console.log("categories", categories);
  console.log("categoryOptions", categoryOptions);

  useEffect(() => {
    if (open) {
      if (editingSubCategory) {
        reset({
          SubCatagoryName: editingSubCategory.name,
          categoryId: editingSubCategory.categoryId,
        });
      } else {
        reset({ SubCatagoryName: "", categoryId: "" });
      }
    }
  }, [open, reset, editingSubCategory]);

  const onFormSubmit = (data: SubCategoryFormValues) => {
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
            {editingSubCategory
              ? "Edit Sub Category"
              : "Create New Sub Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <InputField
            control={control}
            name="SubCatagoryName"
            label="Sub Category Name"
            placeholder="e.g., Mobiles, Laptops"
            isRequired
          />
          <DropdownField
            control={control}
            label="Category"
            name="categoryId"
            options={categoryOptions}
            optionLabelKey="Option_Value"
            optionValueKey="Id"
            // placeholder="Select Category"
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
              {editingSubCategory ? "Update Sub Category" : "Save Sub Category"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

