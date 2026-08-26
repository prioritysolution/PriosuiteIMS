import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Voucher {
  id: string;
  date: string;
  voucherNo: string;
  type: string;
  ledgerName: string;
  amount: number;
  status: "Processed" | "Pending";
  section: "Cash" | "Bank/Cheque" | "S/B";
  narration: string;
}

interface VouchersState {
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
}

const initialState: VouchersState = {
  vouchers: [
    {
      id: "1",
      date: "2023-10-24",
      voucherNo: "VCH-2023-0089",
      type: "Payment",
      ledgerName: "Global Logistics Corp",
      amount: 12450.0,
      status: "Processed",
      section: "Cash",
      narration: "Logistics clearance fee payment",
    },
    {
      id: "2",
      date: "2023-10-24",
      voucherNo: "VCH-2023-0090",
      type: "Receipt",
      ledgerName: "Apex Manufacturing Ltd",
      amount: 45000.0,
      status: "Pending",
      section: "Bank/Cheque",
      narration: "Receiving advance invoice amount",
    },
    {
      id: "3",
      date: "2023-10-23",
      voucherNo: "VCH-2023-0091",
      type: "Journal",
      ledgerName: "Internal Cash Ledger",
      amount: 1200.0,
      status: "Processed",
      section: "S/B",
      narration: "Adjusting petty cash discrepancies",
    },
    {
      id: "4",
      date: "2023-10-23",
      voucherNo: "VCH-2023-0092",
      type: "Payment",
      ledgerName: "Spectrum Energy Partners",
      amount: 8900.0,
      status: "Processed",
      section: "Bank/Cheque",
      narration: "Electric billing payment",
    },
    {
      id: "5",
      date: "2023-10-22",
      voucherNo: "VCH-2023-0093",
      type: "Receipt",
      ledgerName: "Horizon Ventures",
      amount: 150000.0,
      status: "Pending",
      section: "S/B",
      narration: "Receiving funding installment",
    },
  ],
  loading: false,
  error: null,
};

const vouchersSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    addVoucher(state, action: PayloadAction<Omit<Voucher, "id" | "status">>) {
      state.vouchers.unshift({
        id: Math.random().toString(),
        status: "Pending",
        ...action.payload,
      });
    },
    deleteVoucher(state, action: PayloadAction<string>) {
      state.vouchers = state.vouchers.filter((v) => v.id !== action.payload);
    },
  },
});

export const { addVoucher, deleteVoucher } = vouchersSlice.actions;
export default vouchersSlice.reducer;
