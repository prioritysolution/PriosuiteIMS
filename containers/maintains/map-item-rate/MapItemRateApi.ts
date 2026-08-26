import api from "@/utils/apiConfig";
import ENDPOINTS from "@/utils/endPoints";

export const mapItemRateAPI = {
  fetchRates: async () => {
    return await api.get(ENDPOINTS.ITEM_RATES || "/item-rates");
  },
  createRate: async (data: any) => {
    return await api.post(ENDPOINTS.ITEM_RATES || "/item-rates", data);
  },
};
