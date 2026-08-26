"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import getCookieData from "../../utils/getCookieData";
import { formatDateForApi } from "../../utils/dateHelpers";
import { ChalanReceiveFormValues } from "./ChalanReceiveType";
import {
  addChalanItem,
  addChalanThunk,
  clearChalanUnits,
  deleteChalanItem,
  fetchChalanItemsThunk,
  fetchChalanItemwiseUnitsThunk,
  fetchChalanPartiesThunk,
  fetchChalanWarehousesThunk,
} from "./ChalanReceiveSlice";

const getBegDate = () => getCookieData<string>("priosuite_Ims_beg_date") || "";

const schema = yup.object().shape({
  chalanDate: yup.string().required("Chalan Date is required"),
  refChalanNo: yup.string().required("Reference Chalan No is required"),
  selectParty: yup.string().required("Please select a party"),
  selectWarehouse: yup.string().required("Please select a warehouse"),
  selectedItem: yup.string().default(""),
  Quantity: yup
    .mixed()
    .transform((value) => (value === "" || value == null ? "" : value)),
  selectUnit: yup.string().default(""),
});

export function useChalanReceive() {
  const dispatch = useAppDispatch();
  const {
    items,
    parties,
    warehouses,
    availableItems,
    itemwiseUnits,
    loadingParties,
    loadingWarehouses,
    loadingItems,
    loadingUnits,
    saving,
  } = useAppSelector((state) => state.chalanReceive);
  const prevSelectedItemRef = useRef("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const form = useForm<ChalanReceiveFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues: {
      chalanDate: getBegDate(),
      refChalanNo: "",
      selectParty: "",
      selectWarehouse: "",
      selectedItem: "",
      Quantity: "",
      selectUnit: "",
    },
  });

  const selectedItemId = form.watch("selectedItem");

  useEffect(() => {
    const begDate = getBegDate();
    if (begDate) {
      form.setValue("chalanDate", begDate);
    }
  }, [form]);

  useEffect(() => {
    dispatch(fetchChalanPartiesThunk());
    dispatch(fetchChalanWarehousesThunk());
    dispatch(fetchChalanItemsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (
      prevSelectedItemRef.current &&
      prevSelectedItemRef.current !== String(selectedItemId)
    ) {
      form.setValue("selectUnit", "");
    }
    prevSelectedItemRef.current = String(selectedItemId || "");

    if (!selectedItemId) {
      dispatch(clearChalanUnits());
      return;
    }

    dispatch(fetchChalanItemwiseUnitsThunk(String(selectedItemId)));
  }, [selectedItemId, dispatch, form]);

  const partyOptions = parties.map((party) => ({
    Id: party.id,
    Option_Value: party.name,
  }));

  const warehouseOptions = warehouses.map((warehouse) => ({
    Id: warehouse.id,
    Option_Value: warehouse.name,
  }));

  const itemOptions = availableItems.map((item) => ({
    Id: item.id,
    Option_Value: item.hsnCode
      ? `${item.name} (HSN Code: ${item.hsnCode})`
      : item.name,
  }));

  const unitOptions = itemwiseUnits.map((unit) => ({
    Id: unit.id,
    Option_Value: unit.shortName,
  }));

  const onAddItem = async () => {
    const data = form.getValues();
    const quantity = Number(data.Quantity);
    let isValidItem = true;

    if (!data.selectedItem) {
      form.setError("selectedItem", {
        type: "required",
        message: "Please select an item",
      });
      isValidItem = false;
    }
    if (!quantity || Number.isNaN(quantity) || quantity <= 0) {
      form.setError("Quantity", {
        type: "required",
        message: "Quantity must be positive",
      });
      isValidItem = false;
    }
    if (!data.selectUnit) {
      form.setError("selectUnit", {
        type: "required",
        message: "Please select a unit",
      });
      isValidItem = false;
    }
    if (!isValidItem) return;

    const selectedId = String(data.selectedItem);
    const selectedUnitId = String(data.selectUnit);
    const itemObj = availableItems.find(
      (item) => String(item.id) === selectedId,
    );
    const unitObj = itemwiseUnits.find(
      (unit) => String(unit.id) === selectedUnitId,
    );
    const itemOption = itemOptions.find(
      (opt) => String(opt.Id) === selectedId,
    );
    const unitOption = unitOptions.find(
      (opt) => String(opt.Id) === selectedUnitId,
    );

    dispatch(
      addChalanItem({
        itemId: selectedId,
        itemName: itemObj?.name || itemOption?.Option_Value || selectedId,
        quantity,
        unitId: selectedUnitId,
        unit: unitObj?.shortName || unitOption?.Option_Value || selectedUnitId,
      }),
    );

    form.setValue("selectedItem", "");
    form.setValue("Quantity", "");
    form.setValue("selectUnit", "");
  };

  const onDeleteItem = (id: string) => {
    dispatch(deleteChalanItem(id));
  };

  const onSaveRecord = async () => {
    const isValidHeader = await form.trigger([
      "chalanDate",
      "refChalanNo",
      "selectParty",
      "selectWarehouse",
    ]);
    if (!isValidHeader) return;
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    const branchId = getCookieData<string>("priosuite_Ims_userBranchId") || "";
    if (!orgId) {
      toast.error("Organisation not found");
      return;
    }

    const values = form.getValues();

    try {
      const res = (await dispatch(
        addChalanThunk({
          chalan_date: formatDateForApi(values.chalanDate),
          ref_chalan_no: values.refChalanNo,
          party_id: values.selectParty,
          whare_id: values.selectWarehouse,
          branch_id: branchId,
          item_data: items.map((item) => ({
            item_id: item.itemId,
            unit_val: Number(item.quantity),
            unit_id: item.unitId,
          })),
          org_id: orgId,
        }),
      ).unwrap()) as Record<string, unknown>;

      const message =
        (typeof res?.details === "string" && res.details) ||
        (typeof res?.message === "string" && res.message) ||
        "Chalan saved successfully";
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      form.setValue("refChalanNo", "");
      form.setValue("selectParty", "");
      form.setValue("selectWarehouse", "");
      form.setValue("selectedItem", "");
      form.setValue("Quantity", "");
      form.setValue("selectUnit", "");
    } catch (err: unknown) {
      toast.error(
        typeof err === "string" ? err : "Failed to save chalan",
      );
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage("");
  };

  return {
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
  };
}
