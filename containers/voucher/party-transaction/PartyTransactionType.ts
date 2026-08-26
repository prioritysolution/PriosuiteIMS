import { UseFormReturn } from "react-hook-form";
import { PartyTransaction } from "./PartyTransactionSlice";

export interface PartyTransactionFormValues {
  voucherDate: string;
  vouvherNo: string;
  selectVoucherType: string;
  selectType: "Debit" | "Credit";
  selectParty: string;
  narration: string;
  amount: number;
  voucherSection: "Cash" | "Bank/Cheque" | "S/B" | "G/L";
}

export interface PartyTransactionViewProps {
  transactions: PartyTransaction[];
  loading: boolean;
  handleCreateTransaction: (data: PartyTransactionFormValues) => void;
  handleDeleteTransaction: (id: string) => void;
  form: UseFormReturn<PartyTransactionFormValues>;
}
