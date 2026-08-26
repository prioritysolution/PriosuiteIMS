"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { WarehouseFormValues } from "@/containers/maintains/master/Hooks";
import { Warehouse } from "@/containers/maintains/master/masterSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";

interface CreateWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<WarehouseFormValues>;
  onSubmit: (data: WarehouseFormValues) => void;
  editingWarehouse?: Warehouse | null;
}

export function CreateWarehouseDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  editingWarehouse,
}: CreateWarehouseDialogProps) {
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (open) {
      if (editingWarehouse) {
        reset({
          WareHouseName: editingWarehouse.name,
          WareHouseAddress: editingWarehouse.address || "",
        });
      } else {
        reset({ WareHouseName: "", WareHouseAddress: "" });
      }
    }
  }, [open, reset, editingWarehouse]);

  const onFormSubmit = (data: WarehouseFormValues) => {
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
            {editingWarehouse ? "Edit Warehouse" : "Create New Warehouse"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <InputField
            control={control}
            name="WareHouseName"
            label="Warehouse Name"
            placeholder="e.g., Main Warehouse, Transit Store"
            isRequired
          />
          <TextareaField
            control={control}
            name="WareHouseAddress"
            label="Address"
            placeholder="e.g., 123 Main St, City"
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
              {editingWarehouse ? "Update Warehouse" : "Save Warehouse"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

