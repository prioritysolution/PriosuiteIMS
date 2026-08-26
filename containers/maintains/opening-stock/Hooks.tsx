"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import getCookieData from "../../../utils/getCookieData";
import { formatDateForApi } from "../../../utils/dateHelpers";
import {
  addStockItem,
  deleteStockItem,
  clearStockItems,
} from "./OpeningStockSlice";
import { OpeningStockFormValues } from "./OpeningStockType";
import {
  extractDetails,
  mapItemwiseUnit,
  mapOpeningStockItem,
  mapOpeningStockWarehouse,
  openingStockAPI,
  type OpeningStockItemOption,
  type OpeningStockUnitOption,
  type OpeningStockWarehouseOption,
} from "./OpeningStockApi";

const getFinStartDate = () =>
  getCookieData<string>("priosuite_Ims_fin_start_date") || "";

const schema = yup.object().shape({
  stockDate: yup.string().required("Stock Date is required"),
  selectWarehouse: yup.string().required("Warehouse is required"),
  selectedItem: yup.string().default(""),
  selectUnit: yup.string().default(""),
  Quantity: yup
    .mixed()
    .transform((value) => (value === "" || value == null ? "" : value)),
  Rate: yup
    .mixed()
    .transform((value) => (value === "" || value == null ? "" : value)),
});

export function useOpeningStock() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.openingStock);

  const [availableItems, setAvailableItems] = useState<OpeningStockItemOption[]>(
    [],
  );
  const [itemwiseUnits, setItemwiseUnits] = useState<OpeningStockUnitOption[]>(
    [],
  );
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [warehouses, setWarehouses] = useState<OpeningStockWarehouseOption[]>(
    [],
  );
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const prevSelectedItemRef = useRef("");

  const form = useForm<OpeningStockFormValues>({
    resolver: yupResolver(schema) as never,
    defaultValues: {
      stockDate: getFinStartDate(),
      selectWarehouse: "",
      selectedItem: "",
      selectUnit: "",
      Quantity: "",
      Rate: "",
    },
  });

  useEffect(() => {
    const finStartDate = getFinStartDate();
    if (finStartDate) {
      form.setValue("stockDate", finStartDate);
    }
  }, [form]);

  const selectedItemId = form.watch("selectedItem");

  useEffect(() => {
    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    if (!orgId) return;

    let cancelled = false;
    setLoadingItems(true);

    openingStockAPI
      .fetchItems(orgId)
      .then((res) => {
        if (cancelled) return;
        setAvailableItems(
          extractDetails(res).map((row) =>
            mapOpeningStockItem(row as Record<string, unknown>),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setAvailableItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingItems(false);
      });

    setLoadingWarehouses(true);
    openingStockAPI
      .fetchWarehouses(orgId)
      .then((res) => {
        if (cancelled) return;
        setWarehouses(
          extractDetails(res).map((row) =>
            mapOpeningStockWarehouse(row as Record<string, unknown>),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setWarehouses([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingWarehouses(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      prevSelectedItemRef.current &&
      prevSelectedItemRef.current !== selectedItemId
    ) {
      form.setValue("selectUnit", "");
    }
    prevSelectedItemRef.current = selectedItemId;

    if (!selectedItemId) {
      setItemwiseUnits([]);
      return;
    }

    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    if (!orgId) return;

    let cancelled = false;
    setLoadingUnits(true);

    openingStockAPI
      .fetchItemwiseUnits(orgId, String(selectedItemId))
      .then((res) => {
        if (cancelled) return;
        setItemwiseUnits(
          extractDetails(res).map((row) =>
            mapItemwiseUnit(row as Record<string, unknown>),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setItemwiseUnits([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingUnits(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedItemId, form]);

  const itemOptions = availableItems.map((item) => ({
    Id: item.id,
    Option_Value: `${item.name} (HSN Code: ${item.hsnCode})`
  }));

  const unitOptions = itemwiseUnits.map((unit) => ({
    Id: unit.id,
    Option_Value: unit.shortName,
  }));

  const warehouseOptions = warehouses.map((warehouse) => ({
    Id: warehouse.id,
    Option_Value: warehouse.name,
  }));

  const onAddItem = async () => {
    const data = form.getValues();
    const quantity = Number(data.Quantity);
    const rate = Number(data.Rate);
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
    if (!rate || Number.isNaN(rate) || rate <= 0) {
      form.setError("Rate", {
        type: "required",
        message: "Rate must be positive",
      });
      isValidItem = false;
    }
    if (!isValidItem) return;

    const selectedItemId = String(data.selectedItem);
    const selectedUnitId = String(data.selectUnit);
    const itemObj = availableItems.find(
      (item) => String(item.id) === selectedItemId,
    );
    const unitObj = itemwiseUnits.find(
      (unit) => String(unit.id) === selectedUnitId,
    );
    const itemOption = itemOptions.find(
      (opt) => String(opt.Id) === selectedItemId,
    );
    const unitOption = unitOptions.find(
      (opt) => String(opt.Id) === selectedUnitId,
    );

    dispatch(
      addStockItem({
        itemId: selectedItemId,
        unitId: selectedUnitId,
        itemName: itemObj?.name || itemOption?.Option_Value || selectedItemId,
        hsnCode: itemObj?.hsnCode ?? "",
        brandName: itemObj?.brandName ?? "",
        categoryName: itemObj?.categoryName ?? "",
        subCategoryName: itemObj?.subCategoryName ?? "",
        quantity,
        unit: unitObj?.shortName || unitOption?.Option_Value || selectedUnitId,
        rate,
      }),
    );

    form.setValue("selectedItem", "");
    form.setValue("Quantity", "");
    form.setValue("selectUnit", "");
    form.setValue("Rate", "");
  };

  const onDeleteItem = (id: string) => {
    dispatch(deleteStockItem(id));
  };

  const onSaveRecord = async () => {
    const isValidForm = await form.trigger(["stockDate", "selectWarehouse"]);
    if (!isValidForm) return;
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
    const payload = {
      open_date: formatDateForApi(values.stockDate),
      whare_id: values.selectWarehouse,
      branch_id: branchId,
      item_data: items.map((item) => ({
        item_id: item.itemId,
        unit_val: Number(item.quantity),
        item_rate: Number(item.rate),
        item_unit: item.unitId,
      })),
      org_id: orgId,
    };

    try {
      setSaving(true);
      const res = (await openingStockAPI.pushOpeningStock(payload)) as Record<
        string,
        unknown
      >;
      const message =
        (typeof res?.details === "string" && res.details) ||
        (typeof res?.message === "string" && res.message) ||
        "Opening stock saved successfully";
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      dispatch(clearStockItems());
      form.setValue("selectWarehouse", "");
      form.setValue("selectedItem", "");
      form.setValue("Quantity", "");
      form.setValue("selectUnit", "");
      form.setValue("Rate", "");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save opening stock",
      );
    } finally {
      setSaving(false);
    }
  };

  const onDiscardDraft = () => {
    if (confirm("Are you sure you want to discard this draft?")) {
      dispatch(clearStockItems());
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage("");
  };

  return {
    items,
    loading,
    itemOptions,
    unitOptions,
    loadingItems,
    loadingUnits,
    warehouseOptions,
    loadingWarehouses,
    saving,
    onAddItem,
    onDeleteItem,
    onSaveRecord,
    onDiscardDraft,
    form,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
  };
}
