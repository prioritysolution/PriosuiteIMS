"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { HsnFormValues } from "@/containers/maintains/master/Hooks";
import { Hsn } from "@/containers/maintains/master/masterSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";

interface CreateHsnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<HsnFormValues>;
  onSubmit: (data: HsnFormValues) => void;
  editingHsn?: Hsn | null;
}

export function CreateHsnDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  editingHsn,
}: CreateHsnDialogProps) {
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (open) {
      if (editingHsn) {
        reset({
          hsnDescription: editingHsn.description,
          hsnCode: editingHsn.code,
          cgstRate: editingHsn.cgstRate,
          sgstRate: editingHsn.sgstRate,
          igstRate: editingHsn.igstRate,
        });
      } else {
        reset({
          hsnDescription: "",
          hsnCode: "",
          cgstRate: 0,
          sgstRate: 0,
          igstRate: 0,
        });
      }
    }
  }, [open, reset, editingHsn]);

  const onFormSubmit = (data: HsnFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="bg-white border border-slate-200 text-slate-900 sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-slate-800">
            {editingHsn ? "Edit HSN" : "Create New HSN"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <InputField
            control={control}
            name="hsnDescription"
            label="HSN Description"
            placeholder="e.g., Electronic goods"
            isRequired
          />
          <InputField
            control={control}
            name="hsnCode"
            label="HSN Code"
            placeholder="e.g., 8517"
            isRequired
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InputField
              control={control}
              name="cgstRate"
              label="CGST Rate"
              type="number"
              placeholder="0"
              isRequired
            />
            <InputField
              control={control}
              name="sgstRate"
              label="SGST Rate"
              type="number"
              placeholder="0"
              isRequired
            />
            <InputField
              control={control}
              name="igstRate"
              label="IGST Rate"
              type="number"
              placeholder="0"
              isRequired
            />
          </div>
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
              {editingHsn ? "Update HSN" : "Save HSN"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
