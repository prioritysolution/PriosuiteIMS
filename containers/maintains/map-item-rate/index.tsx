"use client";

import React from "react";
import MapItemRateComponent from "@/components/maintains/map-item-rate";
import { useMapItemRate } from "./Hooks";

const MapItemRateContainer = () => {
  const props = useMapItemRate();
  return <MapItemRateComponent {...props} />;
};

export default MapItemRateContainer;
