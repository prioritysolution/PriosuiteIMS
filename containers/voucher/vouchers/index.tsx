"use client";

import React from "react";
import VouchersComponent from "@/components/voucher/vouchers";
import { useVouchers } from "./Hooks";

const VouchersContainer = () => {
  const props = useVouchers();
  return <VouchersComponent {...props} />;
};

export default VouchersContainer;
