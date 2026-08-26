import api from "@/utils/apiConfig";
import ENDPOINTS from "@/utils/endPoints";

export const vouchersAPI = {
  fetchVouchers: async () => {
    return await api.get(ENDPOINTS.VOUCHERS || "/vouchers");
  },
  createVoucher: async (data: any) => {
    return await api.post(ENDPOINTS.VOUCHERS || "/vouchers", data);
  },
};
