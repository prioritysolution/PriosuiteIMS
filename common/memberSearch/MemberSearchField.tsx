"use client";

import React, { useEffect, useState } from "react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import getCookieData from "@/utils/getCookieData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetchMemberById, fetchMembersByName } from "./MemberSearchApi";
import { MemberSearchTable } from "./MemberSearchTable";
import {
  MEMBER_TYPE_OPTIONS,
  type MemberSearchItem,
  type MemberTypeValue,
} from "./types";

interface MemberSearchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
  showNextButton?: boolean;
  nextLoading?: boolean;
  enableRadio?: MemberTypeValue | "";
  onMemberSelect?: (member: MemberSearchItem) => void;
  onMemberDataLoaded?: (data: Record<string, any> | null) => void;
  onNext?: (memberNo: string) => void | Promise<void>;
}

export function MemberSearchField<T extends FieldValues>({
  control,
  name,
  label = "CIF / REF No.",
  placeholder = "Enter CIF / member no.",
  isRequired = false,
  disabled = false,
  className,
  showNextButton = true,
  nextLoading: nextLoadingProp,
  enableRadio = "",
  onMemberSelect,
  onMemberDataLoaded,
  onNext,
}: MemberSearchFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [selectedRadio, setSelectedRadio] = useState<MemberTypeValue>("1");
  const [members, setMembers] = useState<MemberSearchItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState("");
  const [internalNextLoading, setInternalNextLoading] = useState(false);

  const nextLoading = nextLoadingProp ?? internalNextLoading;

  const getOrgId = () => getCookieData<string>("priosuite_Ims_orgId") || "";

  useEffect(() => {
    if (enableRadio) {
      setSelectedRadio(enableRadio);
    }
  }, [enableRadio]);

  const resetDialogState = () => {
    setSearchName("");
    setMembers([]);
    setCurrentPage(1);
    setLastPage(1);
    setHasSearched(false);
    setActiveKeyword("");
    setSearchLoading(false);
  };

  const searchMembers = async (
    page: number,
    keyword: string,
    type: MemberTypeValue = selectedRadio,
  ) => {
    const orgId = getOrgId();
    if (!orgId) {
      toast.error("Organisation not found");
      return;
    }

    const trimmed = keyword.trim();
    if (!trimmed) {
      toast.error("Please enter name");
      return;
    }

    setSearchLoading(true);
    try {
      const result = await fetchMembersByName(orgId, page, trimmed, type);
      setMembers(result.data ?? []);
      setLastPage(Number(result.last_page) || 1);
      setCurrentPage(page);
      setActiveKeyword(trimmed);
      setHasSearched(true);
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      toast.error(
        typeof apiMessage === "string" && apiMessage.trim()
          ? apiMessage
          : "Failed to search members",
      );
      setMembers([]);
      setLastPage(1);
    } finally {
      setSearchLoading(false);
    }
  };

  // No auto-search on dialog open — only Search button / pagination / type change

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetDialogState();
    }
  };

  const handleSearchMember = () => {
    searchMembers(1, searchName);
  };

  const handleRadioChange = (value: string) => {
    const nextType = value as MemberTypeValue;
    setSelectedRadio(nextType);

    if (hasSearched && activeKeyword) {
      searchMembers(1, activeKeyword, nextType);
    } else {
      setMembers([]);
      setCurrentPage(1);
      setLastPage(1);
      setHasSearched(false);
    }
  };

  const handleSelectClick = async (item: MemberSearchItem) => {
    // API GetMemberData uses mem_no = CIF_No; form partyName shows Full_Name
    const memberNo = String(item.CIF_No || "").trim();
    field.onChange(item.Full_Name || memberNo);
    onMemberSelect?.(item);
    handleDialogOpenChange(false);

    if (memberNo) {
      await handleNext(memberNo);
    }
  };

  const handleNext = async (memberNoOverride?: string) => {
    const memberNo = String(memberNoOverride ?? field.value ?? "").trim();
    if (!memberNo) {
      toast.error("Please enter or select a CIF / member no.");
      return;
    }

    const orgId = getOrgId();
    if (!orgId) {
      toast.error("Organisation not found");
      return;
    }

    if (onNext) {
      await onNext(memberNo);
      return;
    }

    setInternalNextLoading(true);
    try {
      const data = await fetchMemberById(orgId, memberNo);
      if (!data) {
        toast.error("Member data not found");
        onMemberDataLoaded?.(null);
        return;
      }
      onMemberDataLoaded?.(data);
      toast.success("Member details loaded");
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;
      toast.error(
        typeof apiMessage === "string" && apiMessage.trim()
          ? apiMessage
          : "Failed to load member details",
      );
      onMemberDataLoaded?.(null);
    } finally {
      setInternalNextLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (!activeKeyword) return;
    searchMembers(page, activeKeyword);
  };

  const activeTypeLabel =
    MEMBER_TYPE_OPTIONS.find((item) => item.value === selectedRadio)?.label ||
    "Member Name";

  return (
    <div className={cn("w-full min-w-0", className)}>
      <FormItem className="flex flex-col w-full min-w-0 gap-1.5">
        {label && (
          <FormLabel className="text-sm font-medium text-slate-700">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full min-w-0">
          <FormControl className="w-full min-w-0 flex-1 block">
            <div className="relative w-full min-w-0">
              <Input
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  "w-full min-w-0 h-11 pr-10 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400",
                  "focus-visible:border-[#00264D] focus-visible:ring-2 focus-visible:ring-[#00264D]/20",
                  error &&
                    "border-destructive focus-visible:ring-destructive/20",
                  disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
                )}
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() => setDialogOpen(true)}
                className="absolute right-0 top-0 h-11 w-10 flex items-center justify-center text-slate-500 hover:text-[#00264D] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Search members"
              >
                <IoSearch className="text-lg" />
              </button>
            </div>
          </FormControl>

          {/* Next button commented out — Select in search table runs the same API/logic */}
          {/* {showNextButton && (
            <Button
              type="button"
              disabled={disabled || nextLoading}
              onClick={() => handleNext()}
              className="h-11 px-6 w-full sm:w-auto shrink-0 bg-[#00264D] hover:bg-[#00264D]/90 text-white cursor-pointer"
            >
              {nextLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Next"
              )}
            </Button>
          )} */}
        </div>

        {error?.message && (
          <FormMessage className="text-xs text-destructive">
            {error.message}
          </FormMessage>
        )}
      </FormItem>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="bg-white border border-slate-200 text-slate-900 gap-0 p-0 overflow-hidden w-[calc(100%-0.75rem)] max-w-[calc(100%-0.75rem)] sm:w-[96vw] sm:max-w-5xl lg:max-w-6xl max-h-[92vh] rounded-xl shadow-xl flex flex-col"
        >
          <DialogHeader className="shrink-0 px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 text-left space-y-1">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-800">
                  Search Members
                </DialogTitle>
                <p className="text-xs sm:text-sm text-slate-500 font-normal">
                  Choose member type, enter a name, then search and select
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDialogOpenChange(false)}
                className="shrink-0 size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4">
            <RadioGroup
              value={selectedRadio}
              onValueChange={handleRadioChange}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-5"
            >
              {MEMBER_TYPE_OPTIONS.map((item) => (
                <div className="flex items-center gap-2" key={item.value}>
                  <RadioGroupItem
                    value={item.value}
                    id={`member-type-${item.value}`}
                    disabled={!!enableRadio && item.value !== enableRadio}
                    className="border-slate-300 data-checked:border-[#00264D] data-checked:bg-[#00264D]"
                  />
                  <Label
                    htmlFor={`member-type-${item.value}`}
                    className="text-xs sm:text-sm text-slate-700 cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-3">
              <div className="w-full space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">
                  {activeTypeLabel}
                </Label>
                <Input
                  autoComplete="off"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchMember();
                    }
                  }}
                  placeholder="Search by member name"
                  className="h-11 bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:border-[#00264D] focus-visible:ring-2 focus-visible:ring-[#00264D]/20"
                />
              </div>
              <Button
                type="button"
                onClick={handleSearchMember}
                disabled={searchLoading}
                className="h-11 px-8 w-full sm:w-auto shrink-0 bg-[#00264D] hover:bg-[#00264D]/90 text-white cursor-pointer"
              >
                {searchLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {!hasSearched && !searchLoading ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                Enter a member name and click Search to view results
              </div>
            ) : (
              <MemberSearchTable
                loading={searchLoading}
                data={members}
                handleSelectData={handleSelectClick}
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
                lastPage={lastPage}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MemberSearchField;
