"use client";

import React from "react";
import UserMasterComponent from "@/components/maintains/user-master";
import { useUserMaster } from "./Hooks";

const UserMasterContainer = () => {
  const props = useUserMaster();
  return <UserMasterComponent {...props} />;
};

export default UserMasterContainer;
