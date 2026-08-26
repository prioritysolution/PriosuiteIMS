"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDateForApi } from "@/utils/dateHelpers";
import { addTransaction, deleteTransaction } from "./PartyTransactionSlice";
import { PartyTransactionFormValues } from "./PartyTransactionType";

const schema = yup.object().shape({
  voucherDate: yup.string().required("Transaction date is required"),
  vouvherNo: yup.string().required("Voucher reference number is required"),
  selectVoucherType: yup.string().required("Voucher type selection is required"),
  selectType: yup.string().oneOf(["Debit", "Credit"]).required("Transaction type is required"),
  selectParty: yup.string().required("Party selection is required"),
  narration: yup.string().required("Narration is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  voucherSection: yup.string().oneOf(["Cash", "Bank/Cheque", "S/B", "G/L"]).required("Section is required"),
});

export function usePartyTransaction() {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector((state) => state.partyTransaction);

  const form = useForm<PartyTransactionFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      voucherDate: formatDateForApi(new Date()),
      vouvherNo: "REF/" + new Date().getFullYear() + "/" + Math.floor(1000 + Math.random() * 9000),
      selectVoucherType: "Receipt",
      selectType: "Credit",
      selectParty: "",
      narration: "",
      amount: 0,
      voucherSection: "Cash",
    },
  });

  const handleCreateTransaction = (data: PartyTransactionFormValues) => {
    dispatch(
      addTransaction({
        date: formatDateForApi(data.voucherDate),
        reference: data.vouvherNo,
        partyName: data.selectParty,
        type: data.selectType,
        section: data.voucherSection,
        narration: data.narration,
        amount: data.amount,
      })
    );
    form.reset({
      voucherDate: formatDateForApi(new Date()),
      vouvherNo: "REF/" + new Date().getFullYear() + "/" + Math.floor(1000 + Math.random() * 9000),
      selectVoucherType: "Receipt",
      selectType: "Credit",
      selectParty: "",
      narration: "",
      amount: 0,
      voucherSection: "Cash",
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      dispatch(deleteTransaction(id));
    }
  };

  return {
    transactions,
    loading,
    handleCreateTransaction,
    handleDeleteTransaction,
    form,
  };
}
