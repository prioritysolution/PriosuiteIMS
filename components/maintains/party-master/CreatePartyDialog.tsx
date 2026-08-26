"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Loader2, Pencil, UserPlus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import TextareaField from "@/common/formFields/TextareaField";
import { MemberSearchField } from "@/common/memberSearch";
import type { MemberSearchItem } from "@/common/memberSearch";
import type { PartyTypeOption } from "@/containers/maintains/party-master/PartyMasterApi";
import { PartyMasterFormValues } from "@/containers/maintains/party-master/PartyMasterType";

interface CreatePartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<PartyMasterFormValues>;
  onSubmit: (data: PartyMasterFormValues) => Promise<void>;
  nextLoading: boolean;
  saving?: boolean;
  isEditMode?: boolean;
  partyTypes: PartyTypeOption[];
  partyTypesLoading?: boolean;
  handleMemberSelect: (member: MemberSearchItem) => void;
  handleNext: (memberNo: string) => Promise<void>;
}

export function CreatePartyDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  nextLoading,
  saving = false,
  isEditMode = false,
  partyTypes,
  partyTypesLoading = false,
  handleMemberSelect,
  handleNext,
}: CreatePartyDialogProps) {
  const { handleSubmit, control } = form;

  const onFormSubmit = async (data: PartyMasterFormValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {
      // Keep dialog open on failure; toast is handled in hook
    }
  };

  return (
    <Dialog open={open} >
      <DialogContent
        showCloseButton={false}
        className="bg-white border border-slate-200 text-slate-900 gap-0 p-0 overflow-hidden w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] sm:w-[95vw] sm:max-w-4xl lg:max-w-5xl max-h-[92vh] sm:max-h-[90vh] rounded-xl shadow-xl flex flex-col"
      >
        <DialogHeader className="shrink-0 px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#00264D]/10 text-[#00264D]">
                {isEditMode ? (
                  <Pencil className="size-5" />
                ) : (
                  <UserPlus className="size-5" />
                )}
              </div>
              <div className="min-w-0 text-left space-y-1">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-800">
                  {isEditMode ? "Edit Party" : "Create New Party"}
                </DialogTitle>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                  {isEditMode
                    ? "Update trading party details and save changes"
                    : "Search member by CIF, load details, then save trading party"}
                </p>
              </div>
            </div>
           
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-5">
            <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Member Lookup
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="w-full min-w-0">
                  <DropdownField
                    control={control}
                    name="selectPartyType"
                    label="Party Type"
                    options={partyTypes}
                    loading={partyTypesLoading}
                    isRequired
                  />
                </div>
                <div className="w-full min-w-0">
                  <MemberSearchField
                    control={control}
                    name="partyName"
                    label="Party Name"
                    placeholder="Search member to load party name"
                    isRequired
                    showNextButton={false}
                    nextLoading={nextLoading}
                    onMemberSelect={handleMemberSelect}
                    onNext={handleNext}
                    className="w-full"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Party Details
              </h3>

              <TextareaField
                control={control}
                name="address"
                label="Business Address"
                placeholder="Full Registered Address..."
                className="rounded-lg"
                isRequired
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField
                  control={control}
                  name="partyMobile"
                  label="Party Mobile"
                  placeholder="Mobile number"
                  
                />
                <InputField
                  control={control}
                  name="partyGSTIN"
                  label="Party GSTIN"
                  placeholder="27XXXXX0000X1Z5"
                  isUpper
                />
                <InputField
                  control={control}
                  name="openingBalance"
                  label="Opening Balance (₹)"
                  placeholder="0.00"
                  type="number"
                />
              </div>
            </section>
          </div>

        

          <div className="shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 px-4 py-4 sm:px-6 border-t border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="w-full sm:w-auto sm:min-w-[120px] py-2.5 px-5 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto sm:min-w-[140px] py-2.5 px-5 bg-[#00264D] hover:bg-[#00264D]/90 text-white rounded-lg font-bold transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : isEditMode ? (
                "Update Party"
              ) : (
                "Save Party Record"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
