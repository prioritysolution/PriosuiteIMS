"use client";

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { UnitFormValues } from "@/containers/maintains/master/Hooks";
import { Unit } from "@/containers/maintains/master/masterSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";

interface CreateUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<UnitFormValues>;
  onSubmit: (data: UnitFormValues) => void;
  editingUnit?: Unit | null;
}

const unitTypeOptions = [
  { Id: "Mass", Option_Value: "Mass" },
  { Id: "Count", Option_Value: "Count" },
  { Id: "Volume", Option_Value: "Volume" },
  { Id: "Length", Option_Value: "Length" },
];

export function CreateUnitDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  editingUnit,
}: CreateUnitDialogProps) {
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (open) {
      if (editingUnit) {
        reset({
          unitname: editingUnit.name,
          unitsortname: editingUnit.code,
          // unittype: "Count",
        });
      } else {
        reset({
          unitname: "",
          unitsortname: "",
          // unittype: "",
        });
      }
    }
  }, [open, reset, editingUnit]);

  const onFormSubmit = (data: UnitFormValues) => {
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
            {editingUnit ? "Edit Unit" : "Create New Unit"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <InputField
            control={control}
            name="unitname"
            label="Unit Name"
            placeholder="e.g., Kilograms"
            isRequired
          />
          <InputField
            control={control}
            name="unitsortname"
            label="Symbol / Code"
            placeholder="e.g., KG"
            isRequired
            isUpper
          />
          {/* <DropdownField
            control={control}
            name="unittype"
            label="Unit Type"
            options={unitTypeOptions}
            isRequired
          /> */}
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
              {editingUnit ? "Update Unit" : "Save Unit"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

