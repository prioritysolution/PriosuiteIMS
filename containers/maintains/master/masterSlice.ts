import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import masterAPI from "./masterAPI";
import getCookieData from "../../../utils/getCookieData";
import toast from "react-hot-toast";

export interface Unit {
  id: string;
  name: string;
  code: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Warehouse {
  id: string;
  name: string;
  address?: string;
}

export interface Hsn {
  id: string;
  description: string;
  code: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
}

export interface Item {
  id: string;
  itemName: string;
  selectBrand: string;
  selectCategory: string;
  selectSubCategory: string;
  brandName?: string;
  categoryName?: string;
  subCategoryName?: string;
  selectHsn: string;
  hsnCode: string;
  cgst: number;
  sgst: number;
  igst: number;
  selectpurchaseGL: string;
  selectsaleGL: string;
  baseUnitValue: number;
  selectBaseUnit: string;
  conversion1Value: number;
  selectUnit1: string;
  conversion2Value: number | null;
  selectUnit2: string;
  conversion3Value: number | null;
  selectUnit3: string;
  selectStockUnit: string;
  stockCovRate?: number;
  status: string;
}



interface MasterState {
  units: Unit[];
  brands: Brand[];
  categories: Category[];
  subCategories: SubCategory[];
  items: Item[];
  warehouses: Warehouse[];
  hsnList: Hsn[];
  loading: boolean;
  error: string | null;
}

const initialState: MasterState = {
  units: [],
  brands: [],
  categories: [],
  subCategories: [],
  items: [],
  warehouses: [],
  hsnList: [],
  loading: false,
  error: null,
};

// Helper function to extract data from API response wrapper
const handleResponse = (response: any) => {
  if (
    response &&
    typeof response === "object" &&
    (response.status === "success" ||
      response.status === "Success" ||
      response.message === "Data Found" ||
      response.message === "Success")
  ) {
    return response.data !== undefined ? response.data : response;
  }
  return response;
};

// --- Thunks ---

export const fetchUnitsThunk = createAsyncThunk(
  "master/fetchUnits",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.fetchUnits(orgId);
      let rawUnits = handleResponse(res);

      // If the response contains a 'details' array, use it
      if (rawUnits && rawUnits.details && Array.isArray(rawUnits.details)) {
        rawUnits = rawUnits.details;
      }

      const unitsArray = Array.isArray(rawUnits) ? rawUnits : [];
      return unitsArray.map((u: any) => ({
        id: String(u.unit_id || u.id || u.Id || ""),
        name: u.unit_name || u.name || u.Unit_Name || "",
        code: u.short_name || u.code || u.Unit_Short_Name || "",
      })) as Unit[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch units");
    }
  },
);

export const createUnitThunk = createAsyncThunk(
  "master/createUnit",
  async (unit: Omit<Unit, "id">, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.createUnit(unit, orgId);
      const u = handleResponse(res);
      console.log("handleResponse=", u);

      if (u.message === "Success") {
        toast.success(u.details);
      }
      return {
        id: String(u?.unit_id || u?.id || ""),
        name: u?.unit_name || u?.name || unit.name,
        code: u?.short_name || u?.code || unit.code,
      } as Unit;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create unit");
    }
  },
);

export const updateUnitThunk = createAsyncThunk(
  "master/updateUnit",
  async (unit: Unit, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.updateUnit(unit, orgId);
      const u = handleResponse(res);
      return {
        id: String(u?.unit_id || u?.id || unit.id),
        name: u?.unit_name || u?.name || unit.name,
        code: u?.short_name || u?.code || unit.code,
      } as Unit;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update unit");
    }
  },
);

export const fetchBrandsThunk = createAsyncThunk(
  "master/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.fetchBrands(orgId);
      let rawBrands = handleResponse(res);

      if (rawBrands && rawBrands.details && Array.isArray(rawBrands.details)) {
        rawBrands = rawBrands.details;
      }

      const brandsArray = Array.isArray(rawBrands) ? rawBrands : [];
      return brandsArray.map((b: any) => ({
        id: String(b.brand_id || b.id || b.Id || ""),
        name: b.brand_name || b.name || b.Brand_Name || b.Brand_name || "",
      })) as Brand[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch brands");
    }
  },
);

export const createBrandThunk = createAsyncThunk(
  "master/createBrand",
  async (brand: Omit<Brand, "id">, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.createBrand(brand, orgId);
      const b = handleResponse(res);

      if (b.message === "Success") {
        toast.success(b.details);
      }
      return {
        id: String(b?.brand_id || b?.id || ""),
        name: b?.brand_name || b?.name || brand.name,
      } as Brand;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create brand");
    }
  },
);

export const updateBrandThunk = createAsyncThunk(
  "master/updateBrand",
  async (brand: Brand, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.updateBrand(brand, orgId);
      const b = handleResponse(res);

      if (b.message === "Success") {
        toast.success(b.details);
      }
      return {
        id: String(b?.brand_id || b?.id || brand.id),
        name: b?.brand_name || b?.name || brand.name,
      } as Brand;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update brand");
    }
  },
);

export const fetchCategoriesThunk = createAsyncThunk(
  "master/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.fetchCategories(orgId);
      let raw = handleResponse(res);
      if (raw && raw.details && Array.isArray(raw.details)) raw = raw.details;
      const arr = Array.isArray(raw) ? raw : [];
      return arr.map((c: any) => ({
        id: String(c.cat_id || c.id || c.Id || ""),
        name: c.cat_name || c.name || c.Type_Name || "",
      })) as Category[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  },
);

export const createCategoryThunk = createAsyncThunk(
  "master/createCategory",
  async (category: Omit<Category, "id">, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.createCategory(category, orgId);
      const c = handleResponse(res);
      if (c.message === "Success") toast.success(c.details);
      return {
        id: String(c?.cat_id || c?.id || ""),
        name: c?.cat_name || c?.name || category.name,
      } as Category;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create category");
    }
  },
);

export const updateCategoryThunk = createAsyncThunk(
  "master/updateCategory",
  async (category: Category, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.updateCategory(category, orgId);
      const c = handleResponse(res);
      if (c.message === "Success") toast.success(c.details);
      return {
        id: String(c?.cat_id || c?.id || category.id),
        name: c?.cat_name || c?.name || category.name,
      } as Category;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update category");
    }
  },
);

export const fetchSubCategoriesThunk = createAsyncThunk(
  "master/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.fetchSubCategories(orgId);
      let raw = handleResponse(res);
      if (raw && raw.details && Array.isArray(raw.details)) raw = raw.details;
      const arr = Array.isArray(raw) ? raw : [];
      return arr.map((s: any) => ({
        id: String(s.sub_id || s.id || s.Id || ""),
        name: s.cat_name || s.name || s.sub_Cat_Name || "",
        categoryId: String(s.cat_id || s.categoryId || s.Type_Id || ""),
      })) as SubCategory[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch sub-categories");
    }
  },
);

export const createSubCategoryThunk = createAsyncThunk(
  "master/createSubCategory",
  async (subCategory: Omit<SubCategory, "id">, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.createSubCategory(subCategory, orgId);
      const s = handleResponse(res);
      if (s.message === "Success") toast.success(s.details);
      return {
        id: String(s?.sub_id || s?.id || ""),
        name: s?.cat_name || s?.name || subCategory.name,
        categoryId: String(s?.cat_id || subCategory.categoryId),
      } as SubCategory;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create sub-category");
    }
  },
);

export const updateSubCategoryThunk = createAsyncThunk(
  "master/updateSubCategory",
  async (subCategory: SubCategory, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.updateSubCategory(subCategory, orgId);
      const s = handleResponse(res);
      if (s.message === "Success") toast.success(s.details);
      return {
        id: String(s?.sub_id || s?.id || subCategory.id),
        name: s?.cat_name || s?.name || subCategory.name,
        categoryId: String(s?.cat_id || subCategory.categoryId),
      } as SubCategory;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update sub-category");
    }
  },
);

const mapItem = (row: any, hsnList: Hsn[] = []): Item => {
  const hsnId = String(
    row.Item_hsn ?? row.item_hsn ?? row.hsn_id ?? row.selectHsn ?? "",
  );
  const matchedHsn = hsnList.find((h) => String(h.id) === hsnId);

  return {
    id: String(row.Id ?? row.item_id ?? row.id ?? ""),
    itemName: row.Item_Name ?? row.item_name ?? row.itemName ?? "",
    selectBrand: String(
      row.Item_Brand ?? row.item_brand ?? row.brand_id ?? row.selectBrand ?? "",
    ),
    selectCategory: String(
      row.Item_cat ?? row.item_cat ?? row.cat_id ?? row.selectCategory ?? "",
    ),
    selectSubCategory: String(
      row.Item_Sub_Cat ??
        row.item_sub_cat ??
        row.sub_id ??
        row.selectSubCategory ??
        "",
    ),
    brandName: row.Brand_name ?? row.brand_name ?? "",
    categoryName: row.Cat_Name ?? row.cat_name ?? "",
    subCategoryName: row.sub_Cat_Name ?? row.sub_cat_name ?? "",
    selectHsn: hsnId,
    hsnCode:
      row.Hsn_Code ??
      row.hsn_code ??
      row.hsnCode ??
      matchedHsn?.code ??
      "",
    cgst: Number(row.cgst ?? row.CGST_Rate ?? matchedHsn?.cgstRate ?? 0),
    sgst: Number(
      row.sgst ?? row.SGST_Rtae ?? row.SGST_Rate ?? matchedHsn?.sgstRate ?? 0,
    ),
    igst: Number(row.igst ?? row.IGST_Rate ?? matchedHsn?.igstRate ?? 0),
    selectpurchaseGL: String(
      row.Item_Pur_Gl ??
        row.item_pur_ledg ??
        row.pur_ledg_id ??
        row.selectpurchaseGL ??
        "",
    ),
    selectsaleGL: String(
      row.Item_Sal_Gl ??
        row.item_sale_ledg ??
        row.sale_ledg_id ??
        row.selectsaleGL ??
        "",
    ),
    baseUnitValue: Number(
      row.Item_Base_Val ?? row.item_base_val ?? row.baseUnitValue ?? 1,
    ),
    selectBaseUnit: String(
      row.Item_Base_Unit ??
        row.item_base_uint ??
        row.item_base_unit ??
        row.selectBaseUnit ??
        "",
    ),
    conversion1Value: Number(
      row.Item_Conver_1_val ??
        row.item_con1_val ??
        row.conversion1Value ??
        1,
    ),
    selectUnit1: String(
      row.Item_Conver1_unit ?? row.item_con1_unit ?? row.selectUnit1 ?? "",
    ),
    conversion2Value:
      row.Item_conver_2_val != null && row.Item_conver_2_val !== ""
        ? Number(row.Item_conver_2_val)
        : row.item_con2_val != null && row.item_con2_val !== ""
          ? Number(row.item_con2_val)
          : row.conversion2Value != null
            ? Number(row.conversion2Value)
            : null,
    selectUnit2: String(
      row.Item_Conver2_Unit ?? row.item_con2_unit ?? row.selectUnit2 ?? "",
    ),
    conversion3Value:
      row.Item_Conver_3_Val != null && row.Item_Conver_3_Val !== ""
        ? Number(row.Item_Conver_3_Val)
        : row.item_con3_val != null && row.item_con3_val !== ""
          ? Number(row.item_con3_val)
          : row.conversion3Value != null
            ? Number(row.conversion3Value)
            : null,
    selectUnit3: String(
      row.Item_Conver3_unit ?? row.item_con3_unit ?? row.selectUnit3 ?? "",
    ),
    selectStockUnit: String(
      row.Item_Stock_Unit ?? row.item_stock_unit ?? row.selectStockUnit ?? "",
    ),
    stockCovRate: Number(row.Item_Stock_Cov_Rate ?? row.item_stock_val ?? 0),
    status: row.status ?? row.Status ?? "Active",
  };
};

export const fetchItemsThunk = createAsyncThunk(
  "master/fetchItems",
  async (_, { rejectWithValue, getState }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.fetchItems(orgId);
      const payload = res as Record<string, any>;
      const rows = Array.isArray(payload?.details)
        ? payload.details
        : Array.isArray(payload?.data?.details)
          ? payload.data.details
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];
      const hsnList = (getState() as { master: { hsnList: Hsn[] } }).master
        .hsnList;
      return rows.map((row: any) => mapItem(row, hsnList)) as Item[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch items");
    }
  },
);

export const createItemThunk = createAsyncThunk(
  "master/createItem",
  async (item: Omit<Item, "id" | "status">, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.createItem(item, orgId);
      const data = res as Record<string, any>;
      const message =
        typeof data?.details === "string"
          ? data.details
          : data?.message;
      if (message) toast.success(message);
      return item;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create item");
    }
  },
);

export const updateItemThunk = createAsyncThunk(
  "master/updateItem",
  async (item: Item, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.updateItem(item, orgId);
      const data = res as Record<string, any>;
      const message =
        typeof data?.details === "string"
          ? data.details
          : data?.message;
      if (message) toast.success(message);
      return item;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update item");
    }
  },
);

export const fetchWarehousesThunk = createAsyncThunk(
  "master/fetchWarehouses",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.fetchWarehouses(orgId);
      let raw = handleResponse(res);
      if (raw && raw.details && Array.isArray(raw.details)) raw = raw.details;
      const arr = Array.isArray(raw) ? raw : [];
      return arr.map((w: any) => ({
        id: String(w.whare_id || w.id || w.Id || ""),
        name: w.whare_name || w.name || w.wharehouse_Name || "",
        address: w.whare_address || w.address || w.Address || "",
      })) as Warehouse[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch warehouses");
    }
  },
);

export const createWarehouseThunk = createAsyncThunk(
  "master/createWarehouse",
  async (warehouse: Omit<Warehouse, "id">, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.createWarehouse(warehouse, orgId);
      const w = handleResponse(res);
      if (w.message === "Success") toast.success(w.details);
      return {
        id: String(w?.whare_id || w?.id || ""),
        name: w?.whare_name || w?.name || warehouse.name,
        address: w?.whare_address || warehouse.address || "",
      } as Warehouse;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create warehouse");
    }
  },
);

export const updateWarehouseThunk = createAsyncThunk(
  "master/updateWarehouse",
  async (warehouse: Warehouse, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.updateWarehouse(warehouse, orgId);
      const w = handleResponse(res);
      if (w.message === "Success") toast.success(w.details);
      return {
        id: String(w?.whare_id || w?.id || warehouse.id),
        name: w?.whare_name || w?.name || warehouse.name,
        address: w?.whare_address || warehouse.address || "",
      } as Warehouse;
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update warehouse");
    }
  },
);

const mapHsn = (h: any, fallback?: Partial<Hsn>): Hsn => ({
  id: String(h?.Id || h?.hsn_id || h?.id || fallback?.id || ""),
  description:
    h?.Hsn_Description ||
    h?.hsn_desc ||
    h?.HSN_Desc ||
    h?.description ||
    fallback?.description ||
    "",
  code:
    h?.Hsn_Code ||
    h?.hsn_code ||
    h?.HSN_Code ||
    h?.code ||
    fallback?.code ||
    "",
  cgstRate: Number(
    h?.CGST_Rate ?? h?.cgst_rate ?? h?.cgstRate ?? fallback?.cgstRate ?? 0,
  ),
  // API returns typo key SGST_Rtae
  sgstRate: Number(
    h?.SGST_Rtae ??
      h?.SGST_Rate ??
      h?.sgst_rate ??
      h?.sgstRate ??
      fallback?.sgstRate ??
      0,
  ),
  igstRate: Number(
    h?.IGST_Rate ?? h?.igst_rate ?? h?.igstRate ?? fallback?.igstRate ?? 0,
  ),
});

export const fetchHsnThunk = createAsyncThunk(
  "master/fetchHsn",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.fetchHsnList(orgId);
      let raw = handleResponse(res);
      if (raw && raw.details && Array.isArray(raw.details)) raw = raw.details;
      const arr = Array.isArray(raw) ? raw : [];
      return arr.map((h: any) => mapHsn(h)) as Hsn[];
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch HSN list");
    }
  },
);

export const createHsnThunk = createAsyncThunk(
  "master/createHsn",
  async (hsn: Omit<Hsn, "id">, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.createHsn(hsn, orgId);
      const h = handleResponse(res);
      if (h.message === "Success") toast.success(h.details);
      return mapHsn(h, hsn);
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to create HSN");
    }
  },
);

export const updateHsnThunk = createAsyncThunk(
  "master/updateHsn",
  async (hsn: Hsn, { rejectWithValue }) => {
    try {
      const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
      const res = await masterAPI.updateHsn(hsn, orgId);
      const h = handleResponse(res);
      if (h.message === "Success") toast.success(h.details);
      return mapHsn(h, hsn);
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to update HSN");
    }
  },
);

const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Units
      .addCase(fetchUnitsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchUnitsThunk.fulfilled,
        (state, action: PayloadAction<Unit[]>) => {
          state.loading = false;
          state.units = action.payload || [];
        },
      )
      .addCase(fetchUnitsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Brands
      .addCase(fetchBrandsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchBrandsThunk.fulfilled,
        (state, action: PayloadAction<Brand[]>) => {
          state.loading = false;
          state.brands = action.payload || [];
        },
      )
      .addCase(fetchBrandsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Categories
      .addCase(fetchCategoriesThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchCategoriesThunk.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch SubCategories
      .addCase(fetchSubCategoriesThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchSubCategoriesThunk.fulfilled, (state, action: PayloadAction<SubCategory[]>) => {
        state.loading = false;
        state.subCategories = action.payload || [];
      })
      .addCase(fetchSubCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Items
      .addCase(fetchItemsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsThunk.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Warehouses
      .addCase(fetchWarehousesThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchWarehousesThunk.fulfilled, (state, action: PayloadAction<Warehouse[]>) => {
        state.loading = false;
        state.warehouses = action.payload || [];
      })
      .addCase(fetchWarehousesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch HSN
      .addCase(fetchHsnThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchHsnThunk.fulfilled,
        (state, action: PayloadAction<Hsn[]>) => {
          state.loading = false;
          state.hsnList = action.payload || [];
        },
      )
      .addCase(fetchHsnThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default masterSlice.reducer;
