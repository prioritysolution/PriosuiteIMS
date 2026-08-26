"use client";

import React from "react";
import OpeningStockComponent from "@/components/maintains/opening-stock";
import { useOpeningStock } from "./Hooks";

const OpeningStockContainer = () => {
  const props = useOpeningStock();
  return <OpeningStockComponent {...props} />;
};

export default OpeningStockContainer;
