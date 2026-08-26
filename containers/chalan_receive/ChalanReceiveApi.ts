import api from "../../utils/apiConfig";
import endPoints from "../../utils/endPoints";

export type ChalanPartyOption = {
  id: string;
  name: string;
};

export type ChalanItemOption = {
  id: string;
  name: string;
  hsnCode: string;
};

export type ChalanUnitOption = {
  id: string;
  shortName: string;
};

export type ChalanWarehouseOption = {
  id: string;
  name: string;
};

export type ChalanSavePayload = {
  chalan_date: string;
  ref_chalan_no: string;
  party_id: string | number;
  whare_id: string | number;
  branch_id: string | number;
  item_data: Array<{
    item_id: string | number;
    unit_val: number;
    unit_id: string | number;
  }>;
  org_id: string;
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

export const mapChalanParty = (
  row: Record<string, unknown>,
): ChalanPartyOption => ({
  id: String(row.Id ?? row.id ?? row.party_id ?? ""),
  name: String(row.Party_Name ?? row.party_name ?? row.name ?? ""),
});

export const mapChalanItem = (
  row: Record<string, unknown>,
): ChalanItemOption => ({
  id: String(row.Id ?? row.item_id ?? row.id ?? ""),
  name: String(row.Item_Name ?? row.item_name ?? row.itemName ?? ""),
  hsnCode: String(row.Hsn_Code ?? row.hsn_code ?? row.hsnCode ?? ""),
});

export const mapChalanUnit = (
  row: Record<string, unknown>,
): ChalanUnitOption => ({
  id: String(row.Id ?? row.id ?? row.unit_id ?? ""),
  shortName: String(
    row.Unit_Short_Name ?? row.unit_short_name ?? row.short_name ?? "",
  ),
});

export const mapChalanWarehouse = (
  row: Record<string, unknown>,
): ChalanWarehouseOption => ({
  id: String(row.Id ?? row.id ?? row.whare_id ?? ""),
  name: String(row.wharehouse_Name ?? row.whare_name ?? row.name ?? ""),
});

export const chalanReceiveAPI = {
  fetchParties: async (orgId: string) => {
    return await api.get(endPoints.getTypewiseParty(orgId, 1));
  },
  fetchItems: async (orgId: string) => {
    return await api.get(endPoints.getItem(orgId));
  },
  fetchItemwiseUnits: async (orgId: string, itemId: string) => {
    return await api.get(endPoints.getItemwiseUnit(orgId, itemId));
  },
  fetchWarehouses: async (orgId: string) => {
    return await api.get(endPoints.getWarehouse(orgId));
  },
  addChalan: async (payload: ChalanSavePayload) => {
    return await api.post(endPoints.addChalan, payload);
  },
};
