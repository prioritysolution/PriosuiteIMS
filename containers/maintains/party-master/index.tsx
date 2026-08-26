"use client";

import React from "react";
import PartyMasterComponent from "@/components/maintains/party-master";
import { usePartyMaster } from "./Hooks";

const PartyMasterContainer = () => {
  const props = usePartyMaster();
  return <PartyMasterComponent {...props} />;
};

export default PartyMasterContainer;
