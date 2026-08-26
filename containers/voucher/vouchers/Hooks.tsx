"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatDateForApi } from "@/utils/dateHelpers";
import { addVoucher, deleteVoucher } from "./vouchersSlice";
import { VouchersFormValues } from "./vouchersType";

const schema = yup.object().shape({
  voucherDate: yup.string().required("Voucher date is required"),
  vouvherNo: yup.string().required("Voucher reference number is required"),
  selectVoucherType: yup.string().required("Voucher type selection is required"),
  selectLedger: yup.string().required("Ledger or party selection is required"),
  narration: yup.string().required("Narration is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  voucherSection: yup.string().oneOf(["Cash", "Bank/Cheque", "S/B"]).required("Section is required"),
});

export function useVouchers() {
  const dispatch = useAppDispatch();
  const { vouchers, loading } = useAppSelector((state) => state.vouchers);

  const form = useForm<VouchersFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      voucherDate: formatDateForApi(new Date()),
      vouvherNo: "VCH-2023-" + Math.floor(1000 + Math.random() * 9000),
      selectVoucherType: "Payment",
      selectLedger: "",
      narration: "",
      amount: 0,
      voucherSection: "Cash",
    },
  });

  const handleCreateVoucher = (data: VouchersFormValues) => {
    dispatch(
      addVoucher({
        date: formatDateForApi(data.voucherDate),
        voucherNo: data.vouvherNo,
        type: data.selectVoucherType,
        ledgerName: data.selectLedger,
        amount: data.amount,
        section: data.voucherSection,
        narration: data.narration,
      })
    );
    form.reset({
      voucherDate: formatDateForApi(new Date()),
      vouvherNo: "VCH-2023-" + Math.floor(1000 + Math.random() * 9000),
      selectVoucherType: "Payment",
      selectLedger: "",
      narration: "",
      amount: 0,
      voucherSection: "Cash",
    });
  };

  const handleDeleteVoucher = (id: string) => {
    if (confirm("Are you sure you want to delete this voucher?")) {
      dispatch(deleteVoucher(id));
    }
  };

  return {
    vouchers,
    loading,
    handleCreateVoucher,
    handleDeleteVoucher,
    form,
  };
}
