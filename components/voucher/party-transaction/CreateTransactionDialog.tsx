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
import TextareaField from "@/common/formFields/TextareaField";
import RadioField from "@/common/formFields/RadioField";
import { PartyTransactionFormValues } from "@/containers/voucher/party-transaction/PartyTransactionType";
import { formatDateForApi } from "@/utils/dateHelpers";

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<PartyTransactionFormValues>;
  onSubmit: (data: PartyTransactionFormValues) => void;
}

const voucherTypeOptions = [
  { Id: "Receipt", Option_Value: "Receipt Voucher" },
  { Id: "Payment", Option_Value: "Payment Voucher" },
  { Id: "Journal", Option_Value: "Journal Voucher" },
];

const typeOptions = [
  { Id: "Debit", Option_Value: "Debit (Dr)" },
  { Id: "Credit", Option_Value: "Credit (Cr)" },
];

const sectionOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Bank/Cheque", label: "Bank/Cheque" },
  { value: "S/B", label: "S/B" },
  { value: "G/L", label: "G/L" },
];

export function CreateTransactionDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
}: CreateTransactionDialogProps) {
  const { handleSubmit, control, reset } = form;

  const { data: parties } = useAppSelector((state) => state.party);

  useEffect(() => {
    if (open) {
      reset({
        voucherDate: formatDateForApi(new Date()),
        vouvherNo: "REF/" + new Date().getFullYear() + "/" + Math.floor(1000 + Math.random() * 9000),
        selectVoucherType: "Receipt",
        selectType: "Credit",
        selectParty: "",
        narration: "",
        amount: 0,
        voucherSection: "Cash",
      });
    }
  }, [open, reset]);

  const partyOptions =
    parties.length > 0
      ? parties.map((p) => ({ Id: p.name, Option_Value: p.name }))
      : [
          { Id: "Apex Manufacturing Ltd.", Option_Value: "Apex Manufacturing Ltd." },
          { Id: "Skyline Infrastructure", Option_Value: "Skyline Infrastructure" },
          { Id: "Global Distribution Co.", Option_Value: "Global Distribution Co." },
          { Id: "Blue Echo Enterprises", Option_Value: "Blue Echo Enterprises" },
          { Id: "Techno Softwares", Option_Value: "Techno Softwares" },
        ];

  const onFormSubmit = (data: PartyTransactionFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="bg-slate-900 border border-slate-800 text-white sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-white flex items-center gap-2">
            New Party Transaction
          </DialogTitle>
          <div className="text-xs text-slate-400">
            Record a new ledger and party transaction entry
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          {/* Section 1: Voucher Entry Details */}
          <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/40 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-800/60">
              Voucher Entry
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                control={control}
                name="voucherDate"
                label="Transaction Date"
                type="date"
                isRequired
              />
              <InputField
                control={control}
                name="vouvherNo"
                label="Reference No"
                placeholder="e.g. BILL/2024/001"
                isRequired
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DropdownField
                control={control}
                name="selectVoucherType"
                label="Voucher Type"
                options={voucherTypeOptions}
                isRequired
              />
              <DropdownField
                control={control}
                name="selectType"
                label="Transaction Type (Dr/Cr)"
                options={typeOptions}
                isRequired
              />
            </div>

            <DropdownField
              control={control}
              name="selectParty"
              label="Select Party"
              options={partyOptions}
              searchPlaceholder="Search or select a party..."
              isRequired
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-1">
                <InputField
                  control={control}
                  name="amount"
                  label="Transaction Amount (₹)"
                  placeholder="0.00"
                  type="number"
                  isRequired
                />
              </div>
              <div className="sm:col-span-2">
                <TextareaField
                  control={control}
                  name="narration"
                  label="Narration"
                  placeholder="Add specific notes about this settlement..."
                  rows={2}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-lg min-h-[60px]"
                  isRequired
                />
              </div>
            </div>
          </div>

          {/* Section 2: Voucher Section Account Type */}
          <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/40 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-800/60">
              Voucher Section
            </h4>
            <div className="py-1">
              <RadioField
                control={control}
                name="voucherSection"
                label="Account Type / Section"
                options={sectionOptions}
                orientation="horizontal"
                isRequired
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto sm:min-w-[120px] py-2.5 px-5 border border-slate-800/80 rounded-lg font-bold text-slate-300 hover:bg-slate-850 transition-colors text-xs sm:text-sm cursor-pointer"
            >
              Discard
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[140px] py-2.5 px-5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg font-bold transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
