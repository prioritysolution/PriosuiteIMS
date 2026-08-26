import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import getCookieData from "../../utils/getCookieData";
import {
  chalanReceiveAPI,
  extractDetails,
  mapChalanItem,
  mapChalanParty,
  mapChalanUnit,
  mapChalanWarehouse,
  type ChalanItemOption,
  type ChalanPartyOption,
  type ChalanSavePayload,
  type ChalanUnitOption,
  type ChalanWarehouseOption,
} from "./ChalanReceiveApi";

export interface ChalanItemRow {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitId: string;
  unit: string;
}

interface ChalanReceiveState {
  items: ChalanItemRow[];
  parties: ChalanPartyOption[];
  warehouses: ChalanWarehouseOption[];
  availableItems: ChalanItemOption[];
  itemwiseUnits: ChalanUnitOption[];
  loadingParties: boolean;
  loadingWarehouses: boolean;
  loadingItems: boolean;
  loadingUnits: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: ChalanReceiveState = {
  items: [],
  parties: [],
  warehouses: [],
  availableItems: [],
  itemwiseUnits: [],
  loadingParties: false,
  loadingWarehouses: false,
  loadingItems: false,
  loadingUnits: false,
  saving: false,
  error: null,
};

const getOrgId = () => getCookieData<string>("priosuite_Ims_orgId") || "";

export const fetchChalanPartiesThunk = createAsyncThunk(
  "chalanReceive/fetchParties",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getOrgId();
      if (!orgId) return rejectWithValue("Organisation not found");
      const res = await chalanReceiveAPI.fetchParties(orgId);
      return extractDetails(res).map((row) =>
        mapChalanParty(row as Record<string, unknown>),
      );
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch parties");
    }
  },
);

export const fetchChalanWarehousesThunk = createAsyncThunk(
  "chalanReceive/fetchWarehouses",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getOrgId();
      if (!orgId) return rejectWithValue("Organisation not found");
      const res = await chalanReceiveAPI.fetchWarehouses(orgId);
      return extractDetails(res).map((row) =>
        mapChalanWarehouse(row as Record<string, unknown>),
      );
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch warehouses");
    }
  },
);

export const fetchChalanItemsThunk = createAsyncThunk(
  "chalanReceive/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const orgId = getOrgId();
      if (!orgId) return rejectWithValue("Organisation not found");
      const res = await chalanReceiveAPI.fetchItems(orgId);
      return extractDetails(res).map((row) =>
        mapChalanItem(row as Record<string, unknown>),
      );
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch items");
    }
  },
);

export const fetchChalanItemwiseUnitsThunk = createAsyncThunk(
  "chalanReceive/fetchItemwiseUnits",
  async (itemId: string, { rejectWithValue }) => {
    try {
      const orgId = getOrgId();
      if (!orgId) return rejectWithValue("Organisation not found");
      const res = await chalanReceiveAPI.fetchItemwiseUnits(orgId, itemId);
      return extractDetails(res).map((row) =>
        mapChalanUnit(row as Record<string, unknown>),
      );
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch units");
    }
  },
);

export const addChalanThunk = createAsyncThunk(
  "chalanReceive/addChalan",
  async (payload: ChalanSavePayload, { rejectWithValue }) => {
    try {
      return await chalanReceiveAPI.addChalan(payload);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; details?: string } };
        message?: string;
      };
      return rejectWithValue(
        error?.response?.data?.details ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to save chalan",
      );
    }
  },
);

const chalanReceiveSlice = createSlice({
  name: "chalanReceive",
  initialState,
  reducers: {
    addChalanItem(
      state,
      action: PayloadAction<Omit<ChalanItemRow, "id">>,
    ) {
      state.items.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...action.payload,
      });
    },
    deleteChalanItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearChalanItems(state) {
      state.items = [];
    },
    clearChalanUnits(state) {
      state.itemwiseUnits = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChalanPartiesThunk.pending, (state) => {
        state.loadingParties = true;
        state.error = null;
      })
      .addCase(fetchChalanPartiesThunk.fulfilled, (state, action) => {
        state.loadingParties = false;
        state.parties = action.payload;
      })
      .addCase(fetchChalanPartiesThunk.rejected, (state, action) => {
        state.loadingParties = false;
        state.parties = [];
        state.error = (action.payload as string) || "Failed to fetch parties";
      })
      .addCase(fetchChalanWarehousesThunk.pending, (state) => {
        state.loadingWarehouses = true;
        state.error = null;
      })
      .addCase(fetchChalanWarehousesThunk.fulfilled, (state, action) => {
        state.loadingWarehouses = false;
        state.warehouses = action.payload;
      })
      .addCase(fetchChalanWarehousesThunk.rejected, (state, action) => {
        state.loadingWarehouses = false;
        state.warehouses = [];
        state.error = (action.payload as string) || "Failed to fetch warehouses";
      })
      .addCase(fetchChalanItemsThunk.pending, (state) => {
        state.loadingItems = true;
        state.error = null;
      })
      .addCase(fetchChalanItemsThunk.fulfilled, (state, action) => {
        state.loadingItems = false;
        state.availableItems = action.payload;
      })
      .addCase(fetchChalanItemsThunk.rejected, (state, action) => {
        state.loadingItems = false;
        state.availableItems = [];
        state.error = (action.payload as string) || "Failed to fetch items";
      })
      .addCase(fetchChalanItemwiseUnitsThunk.pending, (state) => {
        state.loadingUnits = true;
        state.error = null;
      })
      .addCase(fetchChalanItemwiseUnitsThunk.fulfilled, (state, action) => {
        state.loadingUnits = false;
        state.itemwiseUnits = action.payload;
      })
      .addCase(fetchChalanItemwiseUnitsThunk.rejected, (state, action) => {
        state.loadingUnits = false;
        state.itemwiseUnits = [];
        state.error = (action.payload as string) || "Failed to fetch units";
      })
      .addCase(addChalanThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(addChalanThunk.fulfilled, (state) => {
        state.saving = false;
        state.items = [];
      })
      .addCase(addChalanThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Failed to save chalan";
      });
  },
});

export const {
  addChalanItem,
  deleteChalanItem,
  clearChalanItems,
  clearChalanUnits,
} = chalanReceiveSlice.actions;

export default chalanReceiveSlice.reducer;
