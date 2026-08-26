"use client";

import React, { useEffect } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import { Switch } from "@/components/ui/switch";
import { UserMasterFormValues } from "@/containers/maintains/user-master/UserMasterType";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<UserMasterFormValues>;
  onSubmit: (data: UserMasterFormValues) => void;
}

const branchOptions = [
  { Id: "MAIN WAREHOUSE", Option_Value: "Main Warehouse" },
  { Id: "DOWNTOWN BRANCH", Option_Value: "Downtown Branch" },
  { Id: "WEST COAST HUB", Option_Value: "West Coast Hub" },
  { Id: "UNASSIGNED", Option_Value: "Unassigned" },
];

const roleOptions = [
  { Id: "Inventory Auditor", Option_Value: "Inventory Auditor" },
  { Id: "Branch Manager", Option_Value: "Branch Manager" },
  { Id: "Intern Accountant", Option_Value: "Intern Accountant" },
  { Id: "Logistics Admin", Option_Value: "Logistics Admin" },
];

export function CreateUserDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
}: CreateUserDialogProps) {
  const { handleSubmit, control, reset } = form;

  useEffect(() => {
    if (open) {
      reset({
        fullName: "",
        userName: "",
        userPassword: "",
        selectBranch: "MAIN WAREHOUSE",
        systemRole: "Inventory Auditor",
        initialStatus: true,
      });
    }
  }, [open, reset]);

  const onFormSubmit = (data: UserMasterFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="bg-white border border-slate-200 text-slate-900 sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
            User Create
          </DialogTitle>
          <div className="text-xs text-slate-500">
            Register a new staff member or user in the system
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              control={control}
              name="fullName"
              label="Full Name"
              placeholder="John Doe"
              isRequired
            />
            <InputField
              control={control}
              name="userName"
              label="Email Address"
              placeholder="john@priosuite.com"
              isRequired
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              control={control}
              name="userPassword"
              label="Password"
              type="password"
              placeholder="••••••••"
              isRequired
            />
            <DropdownField
              control={control}
              name="selectBranch"
              label="Select Branch"
              options={branchOptions}
              isRequired
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <DropdownField
              control={control}
              name="systemRole"
              label="System Role"
              options={roleOptions}
              isRequired
            />
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Initial Status
              </label>
              <div className="flex items-center gap-2.5 mt-2.5 h-10">
                <span className="text-xs text-slate-500 font-bold">Inactive</span>
                <Controller
                  control={control}
                  name="initialStatus"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span className="text-xs text-primary font-bold">Active</span>
              </div>
            </div>
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
              CREATE USER
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
