"use client";

import React from "react";
import { useMaster } from "./Hooks";
import MasterView from "../../../components/maintains/master";

const MasterContainer = () => {
  const masterProps = useMaster();
  return <MasterView {...masterProps} />;
};

export default MasterContainer;