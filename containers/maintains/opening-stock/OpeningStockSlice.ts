import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface StockEntryItem {
  id: string;
  itemId: string;
  unitId: string;
  itemName: string;
  hsnCode: string;
  brandName: string;
  categoryName: string;
  subCategoryName: string;
  quantity: number;
  unit: string;
  rate: number;
  totalValue: number;
}

export interface OpeningStockState {
  stockDate: string;
  warehouseId: string;
  items: StockEntryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: OpeningStockState = {
  stockDate: "",
  warehouseId: "",
  items: [],
  loading: false,
  error: null,
};

const openingStockSlice = createSlice({
  name: "openingStock",
  initialState,
  reducers: {
    setStockDate(state, action: PayloadAction<string>) {
      state.stockDate = action.payload;
    },
    setWarehouseId(state, action: PayloadAction<string>) {
      state.warehouseId = action.payload;
    },
    addStockItem(state, action: PayloadAction<Omit<StockEntryItem, "id" | "totalValue">>) {
      const newItem: StockEntryItem = {
        id: Math.random().toString(),
        totalValue: action.payload.quantity * action.payload.rate,
        ...action.payload,
      };
      state.items.push(newItem);
    },
    updateStockItem(state, action: PayloadAction<StockEntryItem>) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          totalValue: action.payload.quantity * action.payload.rate,
        };
      }
    },
    deleteStockItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearStockItems(state) {
      state.items = [];
    },
  },
});

export const {
  setStockDate,
  setWarehouseId,
  addStockItem,
  updateStockItem,
  deleteStockItem,
  clearStockItems,
} = openingStockSlice.actions;

export default openingStockSlice.reducer;
