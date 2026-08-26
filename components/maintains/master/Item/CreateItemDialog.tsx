"use client";

import React, { useEffect, useMemo } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import {
  Brand,
  Category,
  Unit,
  Item,
} from "@/containers/maintains/master/masterSlice";
import {
  MasterDropdownOption,
  filterExclusiveUnitOptions,
  buildStockUnitOptions,
} from "@/containers/maintains/master/Hooks";

interface CreateItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brands: Brand[];
  categories: Category[];
  units: Unit[];
  itemCatwiseSubCategories: MasterDropdownOption[];
  purchaseGlOptions: MasterDropdownOption[];
  saleGlOptions: MasterDropdownOption[];
  itemHsnOptions: MasterDropdownOption[];
  loadingItemSubCategories?: boolean;
  loadingItemLedgers?: boolean;
  loadingItemHsn?: boolean;
  form: UseFormReturn<Omit<Item, "id" | "status">>;
  onSubmit: (data: Omit<Item, "id" | "status">) => void;
  editingItem?: Item | null;
}

export function CreateItemDialog({
  open,
  onOpenChange,
  brands,
  categories,
  units,
  itemCatwiseSubCategories,
  purchaseGlOptions,
  saleGlOptions,
  itemHsnOptions,
  loadingItemSubCategories = false,
  loadingItemLedgers = false,
  loadingItemHsn = false,
  form,
  onSubmit,
  editingItem,
}: CreateItemDialogProps) {
  const { handleSubmit, control, reset, setValue } = form;

  const selectedCategoryId = useWatch({ control, name: "selectCategory" });
  // DropdownField may store numeric Ids as numbers — normalize to string for comparisons
  const selectBaseUnit = String(
    useWatch({ control, name: "selectBaseUnit" }) ?? "",
  );
  const selectUnit1 = String(useWatch({ control, name: "selectUnit1" }) ?? "");
  const selectUnit2 = String(useWatch({ control, name: "selectUnit2" }) ?? "");
  const selectUnit3 = String(useWatch({ control, name: "selectUnit3" }) ?? "");
  const selectStockUnit = String(
    useWatch({ control, name: "selectStockUnit" }) ?? "",
  );

  const selectedUnitIds = useMemo(
    () =>
      [selectBaseUnit, selectUnit1, selectUnit2, selectUnit3].filter(
        (id) => id !== "",
      ),
    [selectBaseUnit, selectUnit1, selectUnit2, selectUnit3],
  );

  useEffect(() => {
    if (open) {
      if (editingItem) {
        reset({
          itemName: editingItem.itemName,
          selectBrand: editingItem.selectBrand,
          selectCategory: editingItem.selectCategory,
          selectSubCategory: editingItem.selectSubCategory,
          selectHsn: editingItem.selectHsn,
          hsnCode: editingItem.hsnCode,
          cgst: editingItem.cgst,
          sgst: editingItem.sgst,
          igst: editingItem.igst,
          selectpurchaseGL: editingItem.selectpurchaseGL,
          selectsaleGL: editingItem.selectsaleGL,
          baseUnitValue: editingItem.baseUnitValue,
          selectBaseUnit: editingItem.selectBaseUnit,
          conversion1Value: editingItem.conversion1Value ?? 1,
          selectUnit1: editingItem.selectUnit1,
          conversion2Value: editingItem.conversion2Value,
          selectUnit2: editingItem.selectUnit2,
          conversion3Value: editingItem.conversion3Value,
          selectUnit3: editingItem.selectUnit3,
          selectStockUnit: editingItem.selectStockUnit,
        });
      } else {
        reset({
          itemName: "",
          selectBrand: "",
          selectCategory: "",
          selectSubCategory: "",
          selectHsn: "",
          hsnCode: "",
          cgst: 0,
          sgst: 0,
          igst: 0,
          selectpurchaseGL: "",
          selectsaleGL: "",
          baseUnitValue: 1,
          selectBaseUnit: "",
          conversion1Value: 1,
          selectUnit1: "",
          conversion2Value: null,
          selectUnit2: "",
          conversion3Value: null,
          selectUnit3: "",
          selectStockUnit: "",
        });
      }
    }
  }, [open, reset, editingItem]);

  // Keep conversion unit fields mutually exclusive with base / each other
  useEffect(() => {
    const reserved = new Set<string>();
    if (selectBaseUnit) reserved.add(selectBaseUnit);

    const fields: Array<{
      name: "selectUnit1" | "selectUnit2" | "selectUnit3";
      value: string;
    }> = [
      { name: "selectUnit1", value: selectUnit1 },
      { name: "selectUnit2", value: selectUnit2 },
      { name: "selectUnit3", value: selectUnit3 },
    ];

    for (const field of fields) {
      if (field.value && reserved.has(field.value)) {
        setValue(field.name, "");
      } else if (field.value) {
        reserved.add(field.value);
      }
    }
  }, [selectBaseUnit, selectUnit1, selectUnit2, selectUnit3, setValue]);

  // Stock unit must stay within currently selected units
  useEffect(() => {
    if (selectStockUnit && !selectedUnitIds.includes(selectStockUnit)) {
      setValue("selectStockUnit", "");
    }
  }, [selectedUnitIds, selectStockUnit, setValue]);

  const onFormSubmit = (data: Omit<Item, "id" | "status">) => {
    onSubmit(data);
    onOpenChange(false);
  };

  const brandOptions = brands.map((b) => ({
    Id: b.id || b.name,
    Option_Value: b.name,
  }));
  const categoryOptions = categories.map((c) => ({
    Id: c.id,
    Option_Value: c.name,
  }));
  const unitOptions = units.map((u) => ({
    Id: String(u.id || u.code),
    Option_Value: `${u.name} (${u.code})`,
  }));

  const baseUnitOptions = filterExclusiveUnitOptions(
    unitOptions,
    selectedUnitIds,
    selectBaseUnit,
  );
  const unit1Options = filterExclusiveUnitOptions(
    unitOptions,
    selectedUnitIds,
    selectUnit1,
  );
  const unit2Options = filterExclusiveUnitOptions(
    unitOptions,
    selectedUnitIds,
    selectUnit2,
  );
  const unit3Options = filterExclusiveUnitOptions(
    unitOptions,
    selectedUnitIds,
    selectUnit3,
  );
  const stockUnitOptions = buildStockUnitOptions(unitOptions, selectedUnitIds);

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="bg-white border border-slate-200 text-slate-900 w-[calc(100%-1rem)] max-w-[calc(100%-1rem)] sm:w-[95vw] sm:max-w-4xl lg:max-w-5xl overflow-y-auto max-h-[90vh]"
      >
        <DialogHeader>
          <DialogTitle className="text-md font-bold text-slate-800">
            {editingItem ? "Edit Item" : "Create New Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              control={control}
              name="itemName"
              label="Item Name"
              placeholder="e.g., iPhone 15"
              isRequired
            />
            <DropdownField
              control={control}
              name="selectBrand"
              label="Select Brand"
              options={brandOptions}
              isRequired
              isSearch
            />
            <DropdownField
              control={control}
              name="selectCategory"
              label="Select Category"
              options={categoryOptions}
              isRequired
              isSearch
            />
            <DropdownField
              control={control}
              name="selectSubCategory"
              label="Select Sub Category"
              options={itemCatwiseSubCategories}
              disabled={!selectedCategoryId}
              loading={loadingItemSubCategories}
              isRequired
              isSearch
            />
            <DropdownField
              control={control}
              name="selectHsn"
              label="Select HSN"
              options={itemHsnOptions}
              loading={loadingItemHsn}
              isRequired
              isSearch
            />
            <InputField
              control={control}
              name="hsnCode"
              label="HSN Code"
              placeholder="e.g., 85171300"
              disabled
              isRequired
            />
            <InputField
              control={control}
              name="cgst"
              label="CGST (%)"
              type="number"
              disabled
              isRequired
            />
            <InputField
              control={control}
              name="sgst"
              label="SGST (%)"
              type="number"
              disabled
              isRequired
            />
            <InputField
              control={control}
              name="igst"
              label="IGST (%) (CGST + SGST)"
              type="number"
              disabled
            />
            <DropdownField
              control={control}
              name="selectpurchaseGL"
              label="Purchase GL Account"
              options={purchaseGlOptions}
              loading={loadingItemLedgers}
              isRequired
              isSearch
            />
            <DropdownField
              control={control}
              name="selectsaleGL"
              label="Sale GL Account"
              options={saleGlOptions}
              loading={loadingItemLedgers}
              isRequired
              isSearch
            />
          </div>

          {/* Unit conversion section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <InputField
              control={control}
              name="baseUnitValue"
              label="Enter Base unit Value"
              type="number"
              isRequired
            />
            <DropdownField
              control={control}
              name="selectBaseUnit"
              label="Select Base Unit"
              options={baseUnitOptions}
              isRequired
              isSearch
            />
            <InputField
              control={control}
              name="conversion1Value"
              label="Enter Convertion#1 unit Value"
              type="number"
              isRequired
            />
            <DropdownField
              control={control}
              name="selectUnit1"
              label="Select Unit 1"
              options={unit1Options}
              isRequired
              isSearch
            />
            <InputField
              control={control}
              name="conversion2Value"
              label="Enter Convertion#2 unit Value"
              type="number"
            />
            <DropdownField
              control={control}
              name="selectUnit2"
              label="Select Unit 2"
              options={unit2Options}
              isSearch
            />
            <InputField
              control={control}
              name="conversion3Value"
              label="Enter Convertion#3 unit Value"
              type="number"
            />
            <DropdownField
              control={control}
              name="selectUnit3"
              label="Select Unit 3"
              options={unit3Options}
              isSearch
            />
            <DropdownField
              control={control}
              name="selectStockUnit"
              label="Select Stock Unit"
              options={stockUnitOptions}
              disabled={stockUnitOptions.length === 0}
              isRequired
              isSearch
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
              className="w-full sm:w-auto sm:min-w-[140px] py-2.5 px-5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg font-bold transition-all text-xs sm:text-sm cursor-pointer"
            >
              {editingItem ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
