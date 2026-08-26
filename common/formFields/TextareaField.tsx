"use client";

// import { Textarea } from "@nextui-org/react";
import { FieldValues, Control, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  variant?: "bordered" | "underlined" | "flat" | "faded";
  labelPlacement?: "inside" | "outside" | "outside-left";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
  maxRows?: number;
  description?: string;
  isRequired?: boolean;
}

const TextareaField = <T extends FieldValues>({
  control,
  name,
  label,
  size = "lg",
  radius = "sm",
  variant = "bordered",
  labelPlacement = "outside",
  placeholder,
  className,
  disabled = false,
  rows = 3,
  maxRows = 8,
  description,
  isRequired = false,
}: InputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState?.error;

        return (
          <FormItem className="flex flex-col w-full gap-1.5">
            {label && (
              <FormLabel
                className={cn(
                  "text-xs sm:text-sm font-semibold text-slate-600 pb-1",
                  disabled && "opacity-100"
                )}
              >
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className={cn(
                  // Base border, background, dimensions and transition styles
                  "w-full min-h-[80px] sm:min-h-[96px] rounded-lg border bg-white shadow-none transition-colors duration-200",
                  "text-sm sm:text-base text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed",
                  // Focus ring and border styles
                  "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:ring-offset-0",
                  // Radius dynamic styles
                  radius === "none" && "rounded-none",
                  radius === "sm" && "rounded-sm",
                  radius === "md" && "rounded-md",
                  radius === "lg" && "rounded-lg",
                  radius === "full" && "rounded-full",
                  // Variant dynamic styles
                  variant === "underlined" && "border-t-0 border-l-0 border-r-0 rounded-none px-0",
                  variant === "flat" && "border-none bg-slate-100",
                  variant === "faded" && "bg-slate-50 border-slate-200",
                  variant === "bordered" && "border-slate-200",
                  // Error border and ring styles
                  hasError
                    ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-100 focus-visible:ring-2"
                    : "",
                  // Disabled state styles
                  disabled && "cursor-not-allowed bg-muted/80 opacity-100",
                  className
                )}
                {...field}
              />
            </FormControl>
            {description && !hasError && (
              <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
            <FormMessage className="text-xs text-red-500 mt-1 font-medium" />
          </FormItem>
        );
      }}
    />
  );
};

export default TextareaField;
