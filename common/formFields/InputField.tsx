"use client";

import { useState, useEffect, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { FieldValues, Control, Path, RegisterOptions } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  disabled?: boolean;
  hint?: string;
  rules?: RegisterOptions<T, Path<T>>;
  isUpper?: boolean;
  isRequired?: boolean;
  isBlurUpdate?: boolean;
}

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  className,
  endContent,
  startContent,
  disabled = false,
  hint,
  rules,
  isUpper = false,
  isRequired = false,
  isBlurUpdate = false,
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState("");

  const isPassword = type === "password";
  const isNumeric = type === "number";
  const inputType = isPassword && showPassword ? "text" : isNumeric ? "text" : type;

  const isAllowedNumericValue = (value: string) =>
    value === "" || /^-?\d*\.?\d*$/.test(value);

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState?.error;

        useEffect(() => {
          if (isBlurUpdate) {
            setLocalValue(field.value ?? "");
          }
        }, [field.value, isBlurUpdate]);

        return (
          <FormItem className="flex flex-col w-full gap-1.5">
            {label && (
              <FormLabel className="text-sm font-medium text-slate-700">
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div
                className={cn(
                  "flex items-center w-full rounded-md border bg-white h-10",
                  "transition-all duration-150",
                  "focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-0 focus-within:border-primary",
                  hasError
                    ? "border-destructive focus-within:ring-destructive/30"
                    : "border-slate-200",
                  disabled && "cursor-not-allowed bg-slate-50",
                  startContent || endContent ? "gap-2" : "",
                  className,
                )}
              >
                {startContent && (
                  <div className="shrink-0 text-slate-400 pl-3">
                    {startContent}
                  </div>
                )}

                {/* ✅ KEY FIX: Input is fully transparent — no border, no bg, no shadow, no ring */}
                <Input
                  value={isBlurUpdate ? localValue : field.value ?? ""}
                  type={inputType}
                  inputMode={isNumeric ? "decimal" : undefined}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn(
                    startContent || endContent ? "flex-1 min-w-0" : "w-full",
                    "h-full p-0",
                    !startContent && "pl-3",
                    !endContent && "pr-3",
                    "border-0 border-none",
                    "bg-transparent",
                    "shadow-none",
                    "outline-none",
                    "ring-0 ring-offset-0",
                    "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                    "text-sm text-slate-800 placeholder:text-slate-400",
                    "disabled:cursor-not-allowed disabled:opacity-100",
                  )}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isNumeric && !isAllowedNumericValue(value)) return;
                    if (isBlurUpdate) {
                      const nextValue = isUpper ? value.toUpperCase() : value;
                      setLocalValue(nextValue);
                    } else {
                      field.onChange(isUpper ? value.toUpperCase() : value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!isNumeric) return;
                    if (["e", "E", "+", ","].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={() => {
                    if (isBlurUpdate) {
                      field.onChange(localValue);
                    }
                    field.onBlur();
                  }}
                />

                {endContent && (
                  <div className="shrink-0 text-slate-400 pr-3">
                    {endContent}
                  </div>
                )}

                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer shrink-0 text-slate-400 hover:text-slate-700 transition-colors px-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </FormControl>

            {hint && !hasError && (
              <p className="text-xs text-slate-400">{hint}</p>
            )}

            <FormMessage className="text-xs text-destructive" />
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;
