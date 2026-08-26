"use client";

import React from "react";
import PartyTransactionComponent from "@/components/voucher/party-transaction";
import { usePartyTransaction } from "./Hooks";

const PartyTransactionContainer = () => {
  const props = usePartyTransaction();
  return <PartyTransactionComponent {...props} />;
};

export default PartyTransactionContainer;
