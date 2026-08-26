import api from "../../../utils/apiConfig";
import endPoints from "../../../utils/endPoints";

export type OpeningStockItemOption = {
  id: string;
  name: string;
  categoryId: string;
  subCategoryId: string;
  brandId: string;
  hsnId: string;
  saleGlId: string;
  purchaseGlId: string;
  baseValue: number;
  baseUnitId: string;
  conversion1Value: number;
  conversion1UnitId: string;
  conversion2Value: number;
  conversion2UnitId: string;
  conversion3Value: number;
  conversion3UnitId: string;
  stockUnitId: string;
  stockCovRate: number;
  brandName: string;
  categoryName: string;
  subCategoryName: string;
  hsnCode: string;
};

export type OpeningStockUnitOption = {
  id: string;
  shortName: string;
};

export type OpeningStockWarehouseOption = {
  id: string;
  name: string;
  address: string;
};

export const extractDetails = (res: unknown): Record<string, unknown>[] => {
  if (!res || typeof res !== "object") return [];
  const data = res as Record<string, unknown>;
  if (Array.isArray(data.details)) return data.details;
  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;
    if (Array.isArray(nested.details)) return nested.details;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(res)) return res as Record<string, unknown>[];
  return [];
};

export const mapOpeningStockItem = (
  row: Record<string, unknown>,
): OpeningStockItemOption => ({
  id: String(row.Id ?? row.item_id ?? row.id ?? ""),
  name: String(row.Item_Name ?? row.item_name ?? row.itemName ?? ""),
  categoryId: String(row.Item_cat ?? row.item_cat ?? row.cat_id ?? ""),
  subCategoryId: String(
    row.Item_Sub_Cat ?? row.item_sub_cat ?? row.sub_id ?? "",
  ),
  brandId: String(row.Item_Brand ?? row.item_brand ?? row.brand_id ?? ""),
  hsnId: String(row.Item_hsn ?? row.item_hsn ?? row.hsn_id ?? ""),
  saleGlId: String(
    row.Item_Sal_Gl ?? row.item_sale_ledg ?? row.sale_ledg_id ?? "",
  ),
  purchaseGlId: String(
    row.Item_Pur_Gl ?? row.item_pur_ledg ?? row.pur_ledg_id ?? "",
  ),
  baseValue: Number(row.Item_Base_Val ?? row.item_base_val ?? 0),
  baseUnitId: String(row.Item_Base_Unit ?? row.item_base_uint ?? ""),
  conversion1Value: Number(
    row.Item_Conver_1_val ?? row.item_con1_val ?? row.Item_Conver1_val ?? 0,
  ),
  conversion1UnitId: String(
    row.Item_Conver1_unit ?? row.item_con1_unit ?? row.Item_Conver_1_unit ?? "",
  ),
  conversion2Value: Number(
    row.Item_conver_2_val ?? row.item_con2_val ?? row.Item_Conver_2_val ?? 0,
  ),
  conversion2UnitId: String(
    row.Item_Conver2_Unit ?? row.item_con2_unit ?? row.Item_Conver2_unit ?? "",
  ),
  conversion3Value: Number(
    row.Item_Conver_3_Val ?? row.item_con3_val ?? row.Item_Conver_3_val ?? 0,
  ),
  conversion3UnitId: String(
    row.Item_Conver3_unit ?? row.item_con3_unit ?? row.Item_Conver3_Unit ?? "",
  ),
  stockUnitId: String(row.Item_Stock_Unit ?? row.item_stock_unit ?? ""),
  stockCovRate: Number(
    row.Item_Stock_Cov_Rate ?? row.item_stock_val ?? row.item_stock_cov_rate ?? 0,
  ),
  brandName: String(row.Brand_name ?? row.brand_name ?? ""),
  categoryName: String(row.Cat_Name ?? row.cat_name ?? ""),
  subCategoryName: String(row.sub_Cat_Name ?? row.sub_cat_name ?? ""),
  hsnCode: String(row.Hsn_Code ?? row.hsn_code ?? row.hsnCode ?? ""),
});

export const mapItemwiseUnit = (
  row: Record<string, unknown>,
): OpeningStockUnitOption => ({
  id: String(row.Id ?? row.id ?? row.unit_id ?? ""),
  shortName: String(
    row.Unit_Short_Name ?? row.unit_short_name ?? row.short_name ?? "",
  ),
});

export const mapOpeningStockWarehouse = (
  row: Record<string, unknown>,
): OpeningStockWarehouseOption => ({
  id: String(row.Id ?? row.id ?? row.whare_id ?? ""),
  name: String(
    row.wharehouse_Name ?? row.whare_name ?? row.name ?? "",
  ),
  address: String(row.Address ?? row.address ?? row.whare_address ?? ""),
});

export type OpeningStockSavePayload = {
  open_date: string;
  whare_id: string | number;
  branch_id: string | number;
  item_data: Array<{
    item_id: string | number;
    unit_val: number;
    item_rate: number;
    item_unit: string | number;
  }>;
  org_id: string;
};

export const openingStockAPI = {
  fetchItems: async (orgId: string) => {
    return await api.get(endPoints.getItem(orgId));
  },
  fetchItemwiseUnits: async (orgId: string, itemId: string) => {
    return await api.get(endPoints.getItemwiseUnit(orgId, itemId));
  },
  fetchWarehouses: async (orgId: string) => {
    return await api.get(endPoints.getWarehouse(orgId));
  },
  pushOpeningStock: async (payload: OpeningStockSavePayload) => {
    return await api.post(endPoints.pushItemOpeningStock, payload);
  },
};
