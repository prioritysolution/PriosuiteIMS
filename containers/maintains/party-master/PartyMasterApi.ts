import api from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export interface PartyTypeOption {
  Id: number | string;
  Option_Value: string;
}

export interface CreateTradingPartyPayload {
  party_type: string | number;
  party_name: string;
  party_add: string;
  party_mob?: string;
  party_gst?: string;
  opn_bal?: number | string;
  mem_id?: string | number | null;
  org_id: string | number;
}

export interface UpdateTradingPartyPayload extends CreateTradingPartyPayload {
  party_id: string | number;
}

export interface TradingPartyRaw {
  [key: string]: any;
}

export interface MappedTradingParty {
  id: string;
  code: string;
  name: string;
  type: string;
  mobile: string;
  gstin: string;
  openingBalance: number;
  status: "Active" | "Inactive";
  address: string;
  memId: string;
  partyTypeId: string;
  underGl: string;
}

function parseDetailsList<T>(response: unknown): T[] {
  if (!response || typeof response !== "object") return [];
  const payload = response as Record<string, any>;

  if (Array.isArray(payload.details)) {
    return payload.details as T[];
  }
  if (Array.isArray(payload.data)) {
    return payload.data as T[];
  }
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  return [];
}

function pick(raw: TradingPartyRaw, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = raw?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return fallback;
}

export function mapTradingParty(raw: TradingPartyRaw): MappedTradingParty {
  // Exact GetTradingParty fields:
  // Id, Party_Code, Party_Type, Type_Name, Party_Name, Party_Address,
  // Party_Mobile, Party_GSTIN, Under_GL, Opening_Balance, Member_Id
  const openingBalanceRaw = pick(raw, ["Opening_Balance", "opn_bal"], "0");

  return {
    id: pick(raw, ["Id", "id", "party_id"]),
    code: pick(raw, ["Party_Code", "party_code"]),
    name: pick(raw, ["Party_Name", "party_name"]),
    type: pick(raw, ["Type_Name", "type_name"]),
    mobile: pick(raw, ["Party_Mobile", "party_mobile", "party_mob"]),
    gstin: pick(raw, ["Party_GSTIN", "party_gstin", "party_gst"]),
    openingBalance: Number(openingBalanceRaw) || 0,
    status: "Active",
    address: pick(raw, ["Party_Address", "party_address", "party_add"]),
    memId: pick(raw, ["Member_Id", "member_id", "mem_id"]),
    partyTypeId: pick(raw, ["Party_Type", "party_type"]),
    underGl: pick(raw, ["Under_GL", "under_gl"]),
  };
}

export const partyAPI = {
  fetchPartyTypes: async (orgId: string): Promise<PartyTypeOption[]> => {
    const response = await api.get(endPoints.getPartyType(orgId));
    return parseDetailsList<PartyTypeOption>(response).map((item) => ({
      Id: item.Id,
      Option_Value: item.Option_Value,
    }));
  },

  fetchParties: async (orgId: string): Promise<MappedTradingParty[]> => {
    const response = await api.get(endPoints.getTradingParty(orgId));
    return parseDetailsList<TradingPartyRaw>(response).map(mapTradingParty);
  },

  createParty: async (data: CreateTradingPartyPayload) => {
    return await api.post(endPoints.addTradingParty, data);
  },

  updateParty: async (data: UpdateTradingPartyPayload) => {
    return await api.put(endPoints.updateTradingParty, data);
  },
};
