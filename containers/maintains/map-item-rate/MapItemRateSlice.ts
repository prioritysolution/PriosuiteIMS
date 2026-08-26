import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MappedRate {
  id: string;
  itemName: string;
  sku: string;
  specification: string;
  unit: string;
  rate: number;
  lastUpdated: string;
  status: "Active" | "Archived";
}

interface MapItemRateState {
  data: MappedRate[];
  loading: boolean;
  error: string | null;
}

const initialState: MapItemRateState = {
  data: [
    {
      id: "1",
      itemName: "Aluminium Alloy Beam",
      sku: "IND-7721",
      specification: "Heavy Grade",
      unit: "Meters",
      rate: 245.5,
      lastUpdated: "Oct 24, 2023",
      status: "Active",
    },
    {
      id: "2",
      itemName: "Premium Grade Lubricant",
      sku: "OIL-V4",
      specification: "Synthetic Base",
      unit: "Liters",
      rate: 12.0,
      lastUpdated: "Oct 22, 2023",
      status: "Active",
    },
    {
      id: "3",
      itemName: "Micro-Processor Unit",
      sku: "CPU-X9",
      specification: "8-Core Arch",
      unit: "Pieces",
      rate: 890.0,
      lastUpdated: "Oct 19, 2023",
      status: "Active",
    },
  ],
  loading: false,
  error: null,
};

const mapItemRateSlice = createSlice({
  name: "mapItemRate",
  initialState,
  reducers: {
    addMapping(state, action: PayloadAction<Omit<MappedRate, "id" | "lastUpdated" | "status" | "sku" | "specification">>) {
      const now = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedDate = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

      state.data.unshift({
        id: Math.random().toString(),
        itemName: action.payload.itemName,
        sku: "SKU-" + Math.floor(1000 + Math.random() * 9000),
        specification: "Standard Mapping",
        unit: action.payload.unit,
        rate: action.payload.rate,
        lastUpdated: formattedDate,
        status: "Active",
      });
    },
    deleteMapping(state, action: PayloadAction<string>) {
      state.data = state.data.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addMapping, deleteMapping } = mapItemRateSlice.actions;
export default mapItemRateSlice.reducer;
