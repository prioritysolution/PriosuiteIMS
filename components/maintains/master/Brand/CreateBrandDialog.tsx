"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { BrandFormValues } from "@/containers/maintains/master/Hooks";
import { Brand } from "@/containers/maintains/master/masterSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";

interface CreateBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<BrandFormValues>;
  onSubmit: (data: BrandFormValues) => void;
  editingBrand?: Brand | null;
}

export function CreateBrandDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  editingBrand,
}: CreateBrandDialogProps) {
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (open) {
      if (editingBrand) {
        reset({ ProductBrand: editingBrand.name });
      } else {
        reset({ ProductBrand: "" });
      }
    }
  }, [open, reset, editingBrand]);

  const onFormSubmit = (data: BrandFormValues) => {
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
            {editingBrand ? "Edit Brand" : "Create New Brand"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <InputField
            control={control}
            name="ProductBrand"
            label="Product Brand"
            placeholder="e.g., Apple, Samsung"
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
              {editingBrand ? "Update Brand" : "Save Brand"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

