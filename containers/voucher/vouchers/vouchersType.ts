import { UseFormReturn } from "react-hook-form";
import { Voucher } from "./vouchersSlice";

export interface VouchersFormValues {
  voucherDate: string;
  vouvherNo: string;
  selectVoucherType: string;
  selectLedger: string;
  narration: string;
  amount: number;
  voucherSection: "Cash" | "Bank/Cheque" | "S/B";
}

export interface VouchersViewProps {
  vouchers: Voucher[];
  loading: boolean;
  handleCreateVoucher: (data: VouchersFormValues) => void;
  handleDeleteVoucher: (id: string) => void;
  form: UseFormReturn<VouchersFormValues>;
}
