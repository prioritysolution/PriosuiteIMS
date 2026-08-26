import api from "@/utils/apiConfig";
import ENDPOINTS from "@/utils/endPoints";

export const partyTransactionAPI = {
  fetchTransactions: async () => {
    return await api.get(ENDPOINTS.TRANSACTIONS || "/party-transactions");
  },
  createTransaction: async (data: any) => {
    return await api.post(ENDPOINTS.TRANSACTIONS || "/party-transactions", data);
  },
};
