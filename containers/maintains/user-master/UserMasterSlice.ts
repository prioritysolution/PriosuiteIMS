import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: string;
  status: "Active" | "Inactive";
}

interface UserMasterState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserMasterState = {
  users: [
    {
      id: "1",
      name: "Jameson D.",
      email: "jameson.d@priosuite.com",
      branch: "MAIN WAREHOUSE",
      role: "Inventory Auditor",
      status: "Active",
    },
    {
      id: "2",
      name: "Amara Rodriguez",
      email: "amara.r@priosuite.com",
      branch: "DOWNTOWN BRANCH",
      role: "Branch Manager",
      status: "Active",
    },
    {
      id: "3",
      name: "Kevin Laurent",
      email: "k.laurent@priosuite.com",
      branch: "UNASSIGNED",
      role: "Intern Accountant",
      status: "Inactive",
    },
    {
      id: "4",
      name: "Sarah M.",
      email: "s.miller@priosuite.com",
      branch: "WEST COAST HUB",
      role: "Logistics Admin",
      status: "Active",
    },
  ],
  loading: false,
  error: null,
};

const userMasterSlice = createSlice({
  name: "userMaster",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<Omit<User, "id">>) {
      state.users.unshift({
        id: Math.random().toString(),
        ...action.payload,
      });
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const { addUser, deleteUser } = userMasterSlice.actions;
export default userMasterSlice.reducer;
