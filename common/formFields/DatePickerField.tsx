"use client";

import * as React from "react";
import {
  format,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  formatDateForDisplay,
  normalizeLocalNoon,
  parseLocalDate,
} from "@/utils/dateHelpers";

// Utility to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

interface DatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  allowClear?: boolean;
  picker?: "date" | "month" | "year";
  isRequired?: boolean;
  disablePastAndFuture?: boolean;
  disableFuture?: boolean;
  disableBeforeStartDate?: boolean;
  showCurrentDate?: boolean;
  onChange?: (date: Date | null) => void;
  rules?: any;
  isManualInput?: boolean;
}

export function DatePicker<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select date",
  disabled = false,
  className,
  dateFormat = "dd-MM-yyyy",
  allowClear = true,
  picker = "date",
  isRequired = false,
  disablePastAndFuture = false,
  disableFuture = false,
  disableBeforeStartDate = false,
  showCurrentDate = false,
  onChange,
  rules,
  isManualInput = false,
}: DatePickerProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [startDateFromCookie, setStartDateFromCookie] =
    React.useState<Date | null>(null);
  const [inputValue, setInputValue] = React.useState("");

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: isRequired ? "This field is required" : false,
      ...rules,
    },
  });

  const formatDisplayValue = (value: unknown) => {
    if (!value) return "";
    if (dateFormat === "dd-MM-yyyy") return formatDateForDisplay(value);
    const d = parseLocalDate(value);
    return d ? format(d, dateFormat) : "";
  };

  // Load start date from cookie on mount
  React.useEffect(() => {
    const cookieVal = getCookie("PrioBankStartDate");
    if (cookieVal) {
      const d = parseLocalDate(cookieVal);
      if (d) {
        setStartDateFromCookie(startOfDay(d));
      }
    }
  }, []);

  // Handle showCurrentDate logic
  React.useEffect(() => {
    if (showCurrentDate && !field.value) {
      const today = normalizeLocalNoon(new Date());
      field.onChange(today);
    }
  }, [showCurrentDate, field.value, field.onChange]);

  // Sync inputValue with field.value
  React.useEffect(() => {
    setInputValue(formatDisplayValue(field.value));
  }, [field.value, dateFormat]);

  const date = parseLocalDate(field.value) ?? undefined;

  const handleSelect = (newDate?: Date) => {
    const finalDate = newDate ? normalizeLocalNoon(newDate) : null;
    field.onChange(finalDate);
    if (onChange) onChange(finalDate);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange(null);
    if (onChange) onChange(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow digits and handle dash insertion for dd-MM-yyyy
    const digits = value.replace(/\D/g, "");
    let formattedValue = "";

    if (digits.length > 0) {
      formattedValue += digits.substring(0, 2);
      if (digits.length >= 3) {
        formattedValue += "-" + digits.substring(2, 4);
        if (digits.length >= 5) {
          formattedValue += "-" + digits.substring(4, 8);
        }
      }
    }

    setInputValue(formattedValue);

    // Try to parse if we have a full string (dd-MM-yyyy is 10 chars)
    if (formattedValue.length === 10) {
      const parsedDate = parseLocalDate(formattedValue);
      if (parsedDate && !disabledDate(parsedDate)) {
        field.onChange(parsedDate);
        if (onChange) onChange(parsedDate);
      }
    }
  };

  const handleInputBlur = () => {
    setInputValue(formatDisplayValue(field.value));
  };

  const disabledDate = (d: Date) => {
    const today = startOfDay(new Date());
    const target = startOfDay(d);

    if (disableFuture && isAfter(target, today)) return true;
    if (
      disablePastAndFuture &&
      (isAfter(target, today) || isBefore(target, today))
    )
      return true;

    if (
      disableBeforeStartDate &&
      startDateFromCookie &&
      isBefore(target, startDateFromCookie)
    ) {
      return true;
    }

    return false;
  };

  const fieldTriggerClassName = cn(
    "w-full justify-between text-left font-normal h-11 px-3 relative transition-all duration-150 cursor-pointer",
    "bg-white! border-slate-200! text-slate-800! shadow-none",
    "hover:bg-slate-50! hover:text-slate-900!",
    "aria-expanded:bg-white! aria-expanded:text-slate-800!",
    "focus-visible:border-[#00264D]! focus-visible:ring-2 focus-visible:ring-[#00264D]/20!",
    error && "border-destructive! focus-visible:ring-destructive/20!",
    disabled && "cursor-not-allowed bg-slate-50! text-slate-400!",
    "disabled:opacity-100",
    className,
  );

  const fieldInputClassName = cn(
    "w-full pr-20 h-11 transition-all duration-150",
    "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400",
    "focus-visible:border-[#00264D] focus-visible:ring-2 focus-visible:ring-[#00264D]/20",
    error && "border-destructive focus-visible:ring-destructive/20",
    disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
    "disabled:opacity-100",
    className,
  );

  const calendarContent = (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleSelect}
      disabled={disabledDate}
      autoFocus
      className="bg-white text-slate-800 p-0"
    />
  );

  return (
    <div className="grid w-full gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700 px-1 flex items-center">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        {isManualInput ? (
          <PopoverAnchor render={<div className="relative group w-full" />}>
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={
                placeholder === "Select date" ? "DD-MM-YYYY" : placeholder
              }
              disabled={disabled}
              className={fieldInputClassName}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {allowClear && date && !disabled && (
                <div
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                >
                  <X className="h-3 w-3" />
                </div>
              )}
              <PopoverTrigger
                render={
                  <CalendarIcon className="h-4 w-4 text-slate-400 hover:text-slate-700 cursor-pointer" />
                }
              />
            </div>
          </PopoverAnchor>
        ) : (
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={fieldTriggerClassName}
                disabled={disabled}
                type="button"
              />
            }
          >
            <span className={cn("truncate", !date && "text-slate-400")}>
              {date ? formatDisplayValue(date) : placeholder}
            </span>
            <div className="flex items-center gap-2">
              {allowClear && date && !disabled && (
                <div
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={handleClear}
                >
                  <X className="h-3 w-3" />
                </div>
              )}
              <CalendarIcon className="h-4 w-4 text-slate-400" />
            </div>
          </PopoverTrigger>
        )}
        <PopoverContent
          className="w-auto p-0 shadow-xl border border-slate-200 bg-white text-slate-800 ring-0"
          align="start"
        >
          {calendarContent}
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-xs font-medium text-destructive px-1 animate-in fade-in slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
