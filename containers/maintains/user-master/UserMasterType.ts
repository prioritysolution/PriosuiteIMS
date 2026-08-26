import { UseFormReturn } from "react-hook-form";
import { User } from "./UserMasterSlice";

export interface UserMasterFormValues {
  fullName: string;
  userName: string;
  userPassword: string;
  selectBranch: string;
  systemRole: string;
  initialStatus: boolean;
}

export interface UserMasterViewProps {
  users: User[];
  loading: boolean;
  handleCreateUser: (data: UserMasterFormValues) => void;
  handleDeleteUser: (id: string) => void;
  form: UseFormReturn<UserMasterFormValues>;
}
