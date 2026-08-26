"use client";

import React from "react";
import { Plus, Save } from "lucide-react";
import { Form } from "@/components/ui/form";
import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { DatePicker } from "@/common/formFields/DatePickerField";
import { ChalanReceiveViewProps } from "@/containers/chalan_receive/ChalanReceiveType";
import { ItemRecordsTable } from "./ItemRecordsTable";
import SuccessMessage from "@/common/dialog/SuccessMessage";

const ChalanReceiveComponent = ({
  items,
  partyOptions,
  warehouseOptions,
  itemOptions,
  unitOptions,
  loadingParties,
  loadingWarehouses,
  loadingItems,
  loadingUnits,
  saving,
  onAddItem,
  onDeleteItem,
  onSaveRecord,
  form,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
}: ChalanReceiveViewProps) => {
  const { control, watch } = form;
  const selectedItem = watch("selectedItem");

  return (
    <Form {...form}>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Chalan Receive
          </h2>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <DatePicker
              control={control}
              name="chalanDate"
              label="Chalan Date"
              isRequired
              disabled
              allowClear={false}
            />
            <InputField
              control={control}
              name="refChalanNo"
              label="Reference Chalan No"
              placeholder="Enter reference chalan no"
              isRequired
            />
            <DropdownField
              control={control}
              name="selectParty"
              label="Select Party"
              options={partyOptions}
              loading={loadingParties}
              isRequired
            />
            <DropdownField
              control={control}
              name="selectWarehouse"
              label="Select Warehouse"
              options={warehouseOptions}
              loading={loadingWarehouses}
              isRequired
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm bg-white space-y-5">
          <h3 className="text-md font-bold text-slate-800">Add Item</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto] gap-4 sm:gap-5 items-end">
            <DropdownField
              control={control}
              name="selectedItem"
              label="Select Item"
              options={itemOptions}
              loading={loadingItems}
              searchPlaceholder="Search item..."
            />
            <InputField
              control={control}
              name="Quantity"
              label="Quantity"
              type="number"
            />
            <DropdownField
              control={control}
              name="selectUnit"
              label="Select Unit"
              options={unitOptions}
              loading={loadingUnits}
              disabled={!selectedItem}
            />
            <button
              type="button"
              onClick={onAddItem}
              className="w-full lg:w-auto lg:min-w-[140px] h-11 px-5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg font-bold transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="size-4" />
              ADD ITEM
            </button>
          </div>

          <ItemRecordsTable items={items} onDeleteItem={onDeleteItem} />

          <div className="flex justify-end pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onSaveRecord}
              disabled={items.length === 0 || saving}
              className="w-full sm:w-auto sm:min-w-[160px] py-2.5 px-8 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg font-bold transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="size-4" />
              {saving ? "Saving..." : "SAVE"}
            </button>
          </div>
        </div>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </Form>
  );
};

export default ChalanReceiveComponent;
