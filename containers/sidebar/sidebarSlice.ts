import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  activeItem: string;
  expandedItem: string;
}

const initialState: SidebarState = {
  activeItem: "Dashboard Overview",
  expandedItem: "Maintains",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setActiveItem(state, action: PayloadAction<string>) {
      state.activeItem = action.payload;
    },
    toggleExpandedItem(state, action: PayloadAction<string>) {
      if (state.expandedItem === action.payload) {
        state.expandedItem = "";
      } else {
        state.expandedItem = action.payload;
      }
    },
  },
});

export const { setActiveItem, toggleExpandedItem } = sidebarSlice.actions;
export default sidebarSlice.reducer;
