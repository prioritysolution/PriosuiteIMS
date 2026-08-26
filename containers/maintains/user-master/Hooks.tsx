"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addUser, deleteUser } from "./UserMasterSlice";
import { UserMasterFormValues } from "./UserMasterType";

const schema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  userName: yup.string().email("Must be a valid email").required("Email Address is required"),
  userPassword: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  selectBranch: yup.string().required("Branch selection is required"),
  systemRole: yup.string().required("System Role is required"),
  initialStatus: yup.boolean().required(),
});

export function useUserMaster() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.userMaster);

  const form = useForm<UserMasterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      userName: "",
      userPassword: "",
      selectBranch: "MAIN WAREHOUSE",
      systemRole: "Inventory Auditor",
      initialStatus: true,
    },
  });

  const handleCreateUser = (data: UserMasterFormValues) => {
    dispatch(
      addUser({
        name: data.fullName,
        email: data.userName,
        branch: data.selectBranch.toUpperCase(),
        role: data.systemRole,
        status: data.initialStatus ? "Active" : "Inactive",
      })
    );
    form.reset();
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return {
    users,
    loading,
    handleCreateUser,
    handleDeleteUser,
    form,
  };
}
