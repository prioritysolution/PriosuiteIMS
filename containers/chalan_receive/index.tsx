"use client";

import React from "react";
import ChalanReceiveComponent from "@/components/chalan_receive";
import { useChalanReceive } from "./Hooks";

const ChalanReceiveContainer = () => {
  const props = useChalanReceive();
  return <ChalanReceiveComponent {...props} />;
};

export default ChalanReceiveContainer;
