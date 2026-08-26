"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import getCookieData from "../../../utils/getCookieData";
import masterAPI from "./masterAPI";
import {
  fetchUnitsThunk,
  createUnitThunk,
  updateUnitThunk,
  fetchBrandsThunk,
  createBrandThunk,
  updateBrandThunk,
  fetchCategoriesThunk,
  createCategoryThunk,
  updateCategoryThunk,
  fetchSubCategoriesThunk,
  createSubCategoryThunk,
  updateSubCategoryThunk,
  fetchItemsThunk,
  createItemThunk,
  updateItemThunk,
  fetchWarehousesThunk,
  createWarehouseThunk,
  updateWarehouseThunk,
  fetchHsnThunk,
  createHsnThunk,
  updateHsnThunk,
  Item,
} from "./masterSlice";

// --- Types ---
export type UnitFormValues = {
  unitname: string;
  unitsortname: string;
};

export type BrandFormValues = {
  ProductBrand: string;
};

export type CategoryFormValues = {
  CategoryName: string;
};

export type SubCategoryFormValues = {
  SubCatagoryName: string;
  categoryId: string;
};

export type WarehouseFormValues = {
  WareHouseName: string;
  WareHouseAddress?: string;
};

export type HsnFormValues = {
  hsnDescription: string;
  hsnCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
};

export type MasterDropdownOption = {
  Id: string;
  Option_Value: string;
};

/** Exclude units already picked in other unit dropdowns (keep current value visible). */
export function filterExclusiveUnitOptions(
  unitOptions: MasterDropdownOption[],
  selectedUnitIds: (string | number | undefined | null)[],
  currentValue?: string | number | null,
): MasterDropdownOption[] {
  const current =
    currentValue !== null &&
    currentValue !== undefined &&
    currentValue !== ""
      ? String(currentValue)
      : "";

  const taken = new Set(
    selectedUnitIds
      .filter((id) => id !== null && id !== undefined && id !== "")
      .map((id) => String(id))
      .filter((id) => id !== current),
  );

  return unitOptions.filter((opt) => !taken.has(String(opt.Id)));
}

/** Stock unit dropdown: only units chosen in base / conversion unit fields. */
export function buildStockUnitOptions(
  unitOptions: MasterDropdownOption[],
  selectedUnitIds: (string | number | undefined | null)[],
): MasterDropdownOption[] {
  const uniqueIds = [
    ...new Set(
      selectedUnitIds
        .filter((id) => id !== null && id !== undefined && id !== "")
        .map((id) => String(id)),
    ),
  ];
  return unitOptions.filter((opt) => uniqueIds.includes(String(opt.Id)));
}

export type MasterTab =
  | "Unit"
  | "Brand"
  | "Category"
  | "Sub Category"
  | "Item"
  | "Warehouse"
  | "HSN";

// --- Yup Schemas ---
const unitSchema = yup.object().shape({
  unitname: yup.string().required("Unit Name is required"),
  unitsortname: yup.string().required("Unit Symbol/Code is required"),
});

const brandSchema = yup.object().shape({
  ProductBrand: yup.string().required("Brand Name is required"),
});

const categorySchema = yup.object().shape({
  CategoryName: yup.string().required("Category Name is required"),
});

const subCategorySchema = yup.object().shape({
  SubCatagoryName: yup.string().required("Sub Category Name is required"),
  categoryId: yup.string().required("Category is required"),
});

const warehouseSchema = yup.object().shape({
  WareHouseName: yup.string().required("Warehouse Name is required"),
  WareHouseAddress: yup.string(),
});

const hsnSchema = yup.object().shape({
  hsnDescription: yup.string().required("HSN Description is required"),
  hsnCode: yup.string().required("HSN Code is required"),
  cgstRate: yup
    .number()
    .typeError("CGST Rate must be a number")
    .required("CGST Rate is required"),
  sgstRate: yup
    .number()
    .typeError("SGST Rate must be a number")
    .required("SGST Rate is required"),
  igstRate: yup
    .number()
    .typeError("IGST Rate must be a number")
    .required("IGST Rate is required"),
});

const itemSchema = yup.object().shape({
  itemName: yup.string().required("Item Name is required"),
  selectBrand: yup.string().required("Brand is required"),
  selectCategory: yup.string().required("Category is required"),
  selectSubCategory: yup.string().required("Sub Category is required"),
  selectHsn: yup.string().required("HSN is required"),
  hsnCode: yup.string().required("HSN Code is required"),
  cgst: yup
    .number()
    .typeError("CGST must be a number")
    .required("CGST is required"),
  sgst: yup
    .number()
    .typeError("SGST must be a number")
    .required("SGST is required"),
  igst: yup
    .number()
    .typeError("IGST must be a number")
    .required("IGST is required"),
  selectpurchaseGL: yup.string().required("Purchase GL is required"),
  selectsaleGL: yup.string().required("Sale GL is required"),
  baseUnitValue: yup
    .number()
    .typeError("Base unit value must be a number")
    .required("Base unit value is required"),
  selectBaseUnit: yup.string().required("Base unit is required"),
  conversion1Value: yup
    .number()
    .typeError("Conversion #1 value must be a number")
    .required("Conversion #1 value is required"),
  selectUnit1: yup.string().required("Unit 1 is required"),
  conversion2Value: yup
    .number()
    .nullable()
    .transform((value, original) =>
      original === "" || original === null || original === undefined
        ? null
        : value,
    )
    .default(null),
  selectUnit2: yup.string().default(""),
  conversion3Value: yup
    .number()
    .nullable()
    .transform((value, original) =>
      original === "" || original === null || original === undefined
        ? null
        : value,
    )
    .default(null),
  selectUnit3: yup.string().default(""),
  selectStockUnit: yup.string().required("Stock Unit is required"),
});

const extractDetails = (res: any): any[] => {
  if (!res) return [];
  if (Array.isArray(res.details)) return res.details;
  if (res.data && Array.isArray(res.data.details)) return res.data.details;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res)) return res;
  return [];
};

export function useMaster() {
  const dispatch = useAppDispatch();
  const {
    units,
    brands,
    categories,
    subCategories,
    items,
    warehouses,
    hsnList,
    loading,
  } = useAppSelector((state) => state.master);

  const [activeTab, setActiveTab] = useState<MasterTab>("Unit");
  const [itemCatwiseSubCategories, setItemCatwiseSubCategories] = useState<
    MasterDropdownOption[]
  >([]);
  const [purchaseGlOptions, setPurchaseGlOptions] = useState<
    MasterDropdownOption[]
  >([]);
  const [saleGlOptions, setSaleGlOptions] = useState<MasterDropdownOption[]>(
    [],
  );
  const [loadingItemSubCategories, setLoadingItemSubCategories] =
    useState(false);
  const [loadingItemLedgers, setLoadingItemLedgers] = useState(false);

  const unitForm = useForm<UnitFormValues>({
    resolver: yupResolver(unitSchema),
    defaultValues: { unitname: "", unitsortname: "" },
  });

  const brandForm = useForm<BrandFormValues>({
    resolver: yupResolver(brandSchema),
    defaultValues: { ProductBrand: "" },
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema),
    defaultValues: { CategoryName: "" },
  });

  const subCategoryForm = useForm<SubCategoryFormValues>({
    resolver: yupResolver(subCategorySchema),
    defaultValues: { SubCatagoryName: "", categoryId: "" },
  });

  const itemForm = useForm<Omit<Item, "id" | "status">>({
    resolver: yupResolver(itemSchema) as Resolver<Omit<Item, "id" | "status">>,
    defaultValues: {
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
    },
  });

  const warehouseForm = useForm<WarehouseFormValues>({
    resolver: yupResolver(warehouseSchema),
    defaultValues: { WareHouseName: "" },
  });

  const hsnForm = useForm<HsnFormValues>({
    resolver: yupResolver(hsnSchema),
    defaultValues: {
      hsnDescription: "",
      hsnCode: "",
      cgstRate: 0,
      sgstRate: 0,
      igstRate: 0,
    },
  });

  const selectedItemCategoryId = useWatch({
    control: itemForm.control,
    name: "selectCategory",
  });

  const selectedItemHsnId = useWatch({
    control: itemForm.control,
    name: "selectHsn",
  });

  const itemHsnOptions = useMemo(
    () =>
      hsnList.map((h) => ({
        Id: h.id,
        Option_Value: `${h.description} (${h.code})`,
      })),
    [hsnList],
  );

  // Auto-fill HSN code + GST rates when Select HSN changes (GetItemGSTHSN data)
  useEffect(() => {
    if (!selectedItemHsnId) {
      itemForm.setValue("hsnCode", "");
      itemForm.setValue("cgst", 0);
      itemForm.setValue("sgst", 0);
      itemForm.setValue("igst", 0);
      return;
    }

    const hsn = hsnList.find(
      (h) => String(h.id) === String(selectedItemHsnId),
    );
    if (!hsn) return;

    itemForm.setValue("hsnCode", hsn.code, { shouldValidate: true });
    itemForm.setValue("cgst", hsn.cgstRate, { shouldValidate: true });
    itemForm.setValue("sgst", hsn.sgstRate, { shouldValidate: true });
    itemForm.setValue(
      "igst",
      hsn.igstRate || hsn.cgstRate + hsn.sgstRate,
      { shouldValidate: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemHsnId, hsnList]);

  useEffect(() => {
    dispatch(fetchUnitsThunk());
    dispatch(fetchBrandsThunk());
    dispatch(fetchCategoriesThunk());
    dispatch(fetchSubCategoriesThunk());
    dispatch(fetchItemsThunk());
    dispatch(fetchWarehousesThunk());
    dispatch(fetchHsnThunk());
  }, [dispatch]);

  // Purchase + Sale GL ledgers for Item form
  useEffect(() => {
    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    if (!orgId) return;

    let cancelled = false;
    setLoadingItemLedgers(true);

    Promise.all([
      masterAPI.fetchPurchaseLedgers(orgId),
      masterAPI.fetchSaleLedgers(orgId),
    ])
      .then(([purchaseRes, saleRes]) => {
        if (cancelled) return;

        setPurchaseGlOptions(
          extractDetails(purchaseRes).map((row: any) => ({
            Id: String(row.Id ?? row.id ?? ""),
            Option_Value: row.Ledger_Name || row.ledger_name || "",
          })),
        );

        setSaleGlOptions(
          extractDetails(saleRes).map((row: any) => ({
            Id: String(row.Id ?? row.id ?? ""),
            Option_Value: row.Ledger_Name || row.ledger_name || "",
          })),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setPurchaseGlOptions([]);
          setSaleGlOptions([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingItemLedgers(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Category-wise sub categories for Item form (GetItemCatwiseSubCat)
  const prevItemCategoryRef = useRef("");

  useEffect(() => {
    const catId = selectedItemCategoryId
      ? String(selectedItemCategoryId)
      : "";

    if (
      prevItemCategoryRef.current &&
      prevItemCategoryRef.current !== catId
    ) {
      itemForm.setValue("selectSubCategory", "");
    }
    prevItemCategoryRef.current = catId;

    if (!catId) {
      setItemCatwiseSubCategories([]);
      return;
    }

    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    if (!orgId) return;

    let cancelled = false;
    setLoadingItemSubCategories(true);

    masterAPI
      .fetchCatwiseSubCategories(orgId, catId)
      .then((res) => {
        if (cancelled) return;
        setItemCatwiseSubCategories(
          extractDetails(res).map((row: any) => ({
            Id: String(row.Id ?? row.id ?? row.sub_id ?? ""),
            Option_Value: row.sub_Cat_Name || row.cat_name || row.name || "",
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setItemCatwiseSubCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingItemSubCategories(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemCategoryId]);

  const handleCreateUnit = (data: UnitFormValues) => {
    dispatch(createUnitThunk({ name: data.unitname, code: data.unitsortname }))
      .unwrap()
      .then(() => {
        dispatch(fetchUnitsThunk());
        unitForm.reset();
      });
  };

  const handleUpdateUnit = (id: string, data: UnitFormValues) => {
    dispatch(
      updateUnitThunk({
        id,
        name: data.unitname,
        code: data.unitsortname,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchUnitsThunk());
        unitForm.reset();
      });
  };

  const handleCreateBrand = (data: BrandFormValues) => {
    dispatch(createBrandThunk({ name: data.ProductBrand }))
      .unwrap()
      .then(() => {
        dispatch(fetchBrandsThunk());
        brandForm.reset();
      });
  };

  const handleUpdateBrand = (id: string, data: BrandFormValues) => {
    dispatch(
      updateBrandThunk({
        id,
        name: data.ProductBrand,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchBrandsThunk());
        brandForm.reset();
      });
  };

  const handleCreateCategory = (data: CategoryFormValues) => {
    dispatch(createCategoryThunk({ name: data.CategoryName }))
      .unwrap()
      .then(() => {
        dispatch(fetchCategoriesThunk());
        categoryForm.reset();
      });
  };

  const handleUpdateCategory = (id: string, data: CategoryFormValues) => {
    dispatch(updateCategoryThunk({ id, name: data.CategoryName }))
      .unwrap()
      .then(() => {
        dispatch(fetchCategoriesThunk());
        categoryForm.reset();
      });
  };

  const handleCreateSubCategory = (data: SubCategoryFormValues) => {
    dispatch(
      createSubCategoryThunk({
        name: data.SubCatagoryName,
        categoryId: String(data.categoryId),
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchSubCategoriesThunk());
        subCategoryForm.reset();
      });
  };

  const handleUpdateSubCategory = (id: string, data: SubCategoryFormValues) => {
    dispatch(
      updateSubCategoryThunk({
        id,
        name: data.SubCatagoryName,
        categoryId: String(data.categoryId),
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchSubCategoriesThunk());
        subCategoryForm.reset();
      });
  };

  const handleCreateItem = (data: Omit<Item, "id" | "status">) => {
    dispatch(createItemThunk(data))
      .unwrap()
      .then(() => {
        dispatch(fetchItemsThunk());
        itemForm.reset();
        setItemCatwiseSubCategories([]);
      });
  };

  const handleUpdateItem = (id: string, data: Omit<Item, "id" | "status">) => {
    dispatch(updateItemThunk({ id, ...data, status: "Active" }))
      .unwrap()
      .then(() => {
        dispatch(fetchItemsThunk());
        itemForm.reset();
        setItemCatwiseSubCategories([]);
      });
  };

  const handleCreateWarehouse = (data: WarehouseFormValues) => {
    dispatch(
      createWarehouseThunk({
        name: data.WareHouseName,
        address: data.WareHouseAddress,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchWarehousesThunk());
        warehouseForm.reset();
      });
  };

  const handleUpdateWarehouse = (id: string, data: WarehouseFormValues) => {
    dispatch(
      updateWarehouseThunk({
        id,
        name: data.WareHouseName,
        address: data.WareHouseAddress,
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchWarehousesThunk());
        warehouseForm.reset();
      });
  };

  const handleCreateHsn = (data: HsnFormValues) => {
    dispatch(
      createHsnThunk({
        description: data.hsnDescription,
        code: data.hsnCode,
        cgstRate: Number(data.cgstRate),
        sgstRate: Number(data.sgstRate),
        igstRate: Number(data.igstRate),
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchHsnThunk());
        hsnForm.reset();
      });
  };

  const handleUpdateHsn = (id: string, data: HsnFormValues) => {
    dispatch(
      updateHsnThunk({
        id,
        description: data.hsnDescription,
        code: data.hsnCode,
        cgstRate: Number(data.cgstRate),
        sgstRate: Number(data.sgstRate),
        igstRate: Number(data.igstRate),
      }),
    )
      .unwrap()
      .then(() => {
        dispatch(fetchHsnThunk());
        hsnForm.reset();
      });
  };

  return {
    units,
    brands,
    categories,
    subCategories,
    items,
    warehouses,
    hsnList,
    itemCatwiseSubCategories,
    purchaseGlOptions,
    saleGlOptions,
    itemHsnOptions,
    loadingItemSubCategories,
    loadingItemLedgers,
    loadingItemHsn: loading && hsnList.length === 0,
    loading,
    activeTab,
    setActiveTab,
    unitForm,
    brandForm,
    categoryForm,
    subCategoryForm,
    itemForm,
    warehouseForm,
    hsnForm,
    handleCreateUnit,
    handleUpdateUnit,
    handleCreateBrand,
    handleUpdateBrand,
    handleCreateCategory,
    handleUpdateCategory,
    handleCreateSubCategory,
    handleUpdateSubCategory,
    handleCreateItem,
    handleUpdateItem,
    handleCreateWarehouse,
    handleUpdateWarehouse,
    handleCreateHsn,
    handleUpdateHsn,
  };
}
