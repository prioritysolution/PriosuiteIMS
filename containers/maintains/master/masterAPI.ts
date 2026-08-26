import api from "../../../utils/apiConfig";
import endPoints from "../../../utils/endPoints";
import type { Item } from "./masterSlice";

export type TradingItemPayload = {
  item_name: string;
  item_cat: string;
  item_sub_cat: string;
  item_brand: string;
  item_hsn: string;
  item_sale_ledg: string;
  item_pur_ledg: string;
  item_base_val: number;
  item_base_uint: string;
  item_con1_val: number;
  item_con1_unit: string;
  item_stock_val: number;
  item_stock_unit: string;
  item_con2_val?: number | null;
  item_con2_unit?: string | null;
  item_con3_val?: number | null;
  item_con3_unit?: string | null;
  org_id: string;
  item_id?: string;
};

function resolveStockValue(item: Omit<Item, "id" | "status">): number {
  const stockUnit = String(item.selectStockUnit);
  if (stockUnit === String(item.selectBaseUnit)) {
    return Number(item.baseUnitValue);
  }
  if (stockUnit === String(item.selectUnit1)) {
    return Number(item.conversion1Value ?? 0);
  }
  if (stockUnit === String(item.selectUnit2)) {
    return Number(item.conversion2Value ?? 0);
  }
  if (stockUnit === String(item.selectUnit3)) {
    return Number(item.conversion3Value ?? 0);
  }
  return Number(item.baseUnitValue);
}

export function buildTradingItemPayload(
  item: Omit<Item, "id" | "status">,
  orgId: string,
  itemId?: string,
): TradingItemPayload {
  const payload: TradingItemPayload = {
    item_name: item.itemName,
    item_cat: String(item.selectCategory),
    item_sub_cat: String(item.selectSubCategory),
    item_brand: String(item.selectBrand),
    item_hsn: String(item.selectHsn),
    item_sale_ledg: String(item.selectsaleGL),
    item_pur_ledg: String(item.selectpurchaseGL),
    item_base_val: Number(item.baseUnitValue),
    item_base_uint: String(item.selectBaseUnit),
    item_con1_val: Number(item.conversion1Value ?? 0),
    item_con1_unit: String(item.selectUnit1),
    item_stock_val: resolveStockValue(item),
    item_stock_unit: String(item.selectStockUnit),
    org_id: orgId,
  };

  if (item.conversion2Value != null && item.selectUnit2) {
    payload.item_con2_val = Number(item.conversion2Value);
    payload.item_con2_unit = String(item.selectUnit2);
  }

  if (item.conversion3Value != null && item.selectUnit3) {
    payload.item_con3_val = Number(item.conversion3Value);
    payload.item_con3_unit = String(item.selectUnit3);
  }

  if (itemId) {
    payload.item_id = itemId;
  }

  return payload;
}

export const masterAPI = {
  fetchUnits: async (orgId: string) => {
    return await api.get(endPoints.getUnit(orgId));
  },
  createUnit: async (unit: { name: string; code: string }, orgId: string) => {
    return await api.post(endPoints.addUnit, {
      unit_name: unit.name,
      short_name: unit.code,
      org_id: orgId,
    });
  },
  updateUnit: async (
    unit: { id: string; name: string; code: string },
    orgId: string,
  ) => {
    return await api.put(endPoints.updateUnit, {
      unit_id: unit.id,
      unit_name: unit.name,
      short_name: unit.code,
      org_id: orgId,
    });
  },

  fetchBrands: async (orgId: string) => {
    return await api.get(endPoints.getBrand(orgId));
  },
  createBrand: async (brand: { name: string }, orgId: string) => {
    return await api.post(endPoints.addBrand, {
      brand_name: brand.name,
      org_id: orgId,
    });
  },
  updateBrand: async (brand: { id: string; name: string }, orgId: string) => {
    return await api.put(endPoints.updateBrand, {
      brand_id: brand.id,
      brand_name: brand.name,
      org_id: orgId,
    });
  },

  fetchCategories: async (orgId: string) => {
    return await api.get(endPoints.getCategory(orgId));
  },
  createCategory: async (category: { name: string }, orgId: string) => {
    return await api.post(endPoints.addCategory, {
      cat_name: category.name,
      org_id: orgId,
    });
  },
  updateCategory: async (category: { id: string; name: string }, orgId: string) => {
    return await api.put(endPoints.updateCategory, {
      cat_id: category.id,
      cat_name: category.name,
      org_id: orgId,
    });
  },

  fetchSubCategories: async (orgId: string) => {
    return await api.get(endPoints.getSubCategory(orgId));
  },
  createSubCategory: async (
    subCategory: { name: string; categoryId: string },
    orgId: string,
  ) => {
    return await api.post(endPoints.addSubCategory, {
      cat_id: subCategory.categoryId,
      cat_name: subCategory.name,
      org_id: orgId,
    });
  },
  updateSubCategory: async (
    subCategory: { id: string; name: string; categoryId: string },
    orgId: string,
  ) => {
    return await api.put(endPoints.updateSubCategory, {
      sub_id: subCategory.id,
      cat_id: subCategory.categoryId,
      cat_name: subCategory.name,
      org_id: orgId,
    });
  },

  fetchCatwiseSubCategories: async (orgId: string, catId: string) => {
    return await api.get(endPoints.getItemCatwiseSubCat(orgId, catId));
  },

  fetchSaleLedgers: async (orgId: string) => {
    return await api.get(endPoints.getItemSaleLedger(orgId));
  },

  fetchPurchaseLedgers: async (orgId: string) => {
    return await api.get(endPoints.getItemPurchaseLedger(orgId));
  },

  fetchItems: async (orgId: string) => {
    return await api.get(endPoints.getItem(orgId));
  },
  createItem: async (item: Omit<Item, "id" | "status">, orgId: string) => {
    const payload = buildTradingItemPayload(item, orgId);
    return await api.post(endPoints.addItem, payload);
  },
  updateItem: async (item: Item, orgId: string) => {
    const { id, status: _status, ...formFields } = item;
    const payload = buildTradingItemPayload(formFields, orgId, id);
    return await api.put(endPoints.updateItem, payload);
  },

  fetchWarehouses: async (orgId: string) => {
    return await api.get(endPoints.getWarehouse(orgId));
  },
  createWarehouse: async (
    warehouse: { name: string; address?: string },
    orgId: string,
  ) => {
    return await api.post(endPoints.addWarehouse, {
      whare_name: warehouse.name,
      whare_address: warehouse.address || "",
      org_id: orgId,
    });
  },
  updateWarehouse: async (
    warehouse: { id: string; name: string; address?: string },
    orgId: string,
  ) => {
    return await api.put(endPoints.updateWarehouse, {
      whare_id: warehouse.id,
      whare_name: warehouse.name,
      whare_address: warehouse.address || "",
      org_id: orgId,
    });
  },

  fetchHsnList: async (orgId: string) => {
    return await api.get(endPoints.getItemGSTHSN(orgId));
  },
  createHsn: async (
    hsn: {
      description: string;
      code: string;
      cgstRate: number;
      sgstRate: number;
      igstRate: number;
    },
    orgId: string,
  ) => {
    return await api.post(endPoints.addItemGSTHSN, {
      hsn_desc: hsn.description,
      hsn_code: hsn.code,
      cgst_rate: hsn.cgstRate,
      sgst_rate: hsn.sgstRate,
      igst_rate: hsn.igstRate,
      org_id: orgId,
    });
  },
  updateHsn: async (
    hsn: {
      id: string;
      description: string;
      code: string;
      cgstRate: number;
      sgstRate: number;
      igstRate: number;
    },
    orgId: string,
  ) => {
    return await api.put(endPoints.updateItemGSTHSN, {
      hsn_id: hsn.id,
      hsn_desc: hsn.description,
      hsn_code: hsn.code,
      cgst_rate: hsn.cgstRate,
      sgst_rate: hsn.sgstRate,
      igst_rate: hsn.igstRate,
      org_id: orgId,
    });
  },
};
export default masterAPI;
