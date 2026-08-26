"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useAppSelector } from "@/store/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import { MapItemRateFormValues } from "@/containers/maintains/map-item-rate/MapItemRateType";

interface CreateMappingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<MapItemRateFormValues>;
  onSubmit: (data: MapItemRateFormValues) => void;
}

export function CreateMappingDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
}: CreateMappingDialogProps) {
  const { handleSubmit, control, reset } = form;

  const { items, units } = useAppSelector((state) => state.master);

  useEffect(() => {
    if (open) {
      reset({
        selectItem: "",
        selectUnit: "",
        rate: 0,
      });
    }
  }, [open, reset]);

  const itemOptions =
    items.length > 0
      ? items.map((it) => ({ Id: it.itemName, Option_Value: it.itemName }))
      : [
          { Id: "Aluminium Alloy Beam", Option_Value: "Aluminium Alloy Beam" },
          { Id: "Premium Grade Lubricant", Option_Value: "Premium Grade Lubricant" },
          { Id: "Micro-Processor Unit", Option_Value: "Micro-Processor Unit" },
        ];

  const unitOptions =
    units.length > 0
      ? units.map((u) => ({ Id: u.name, Option_Value: u.name }))
      : [
          { Id: "Meters", Option_Value: "Meters" },
          { Id: "Liters", Option_Value: "Liters" },
          { Id: "Pieces", Option_Value: "Pieces" },
        ];

  const onFormSubmit = (data: MapItemRateFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="bg-white border border-slate-200 text-slate-900 sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
            Create New Mapping
          </DialogTitle>
          <div className="text-xs text-slate-500">
            Assign a specific rate to an inventory item
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <DropdownField
            control={control}
            name="selectItem"
            label="Select Item"
            options={itemOptions}
            searchPlaceholder="Search and choose a stock item..."
            isRequired
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownField
              control={control}
              name="selectUnit"
              label="Select Unit"
              options={unitOptions}
              searchPlaceholder="UoM"
              isRequired
            />
            <InputField
              control={control}
              name="rate"
              label="Rate (Currency)"
              placeholder="$ 0.00"
              type="number"
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
              className="w-full sm:w-auto sm:min-w-[140px] py-2.5 px-5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg font-bold transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              Confirm Mapping
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
