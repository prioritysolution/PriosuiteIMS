import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  partyAPI,
  type CreateTradingPartyPayload,
  type PartyTypeOption,
  type UpdateTradingPartyPayload,
} from "./PartyMasterApi";

export interface Party {
  id: string;
  code?: string;
  name: string;
  type: string;
  mobile: string;
  gstin: string;
  openingBalance: number;
  status: "Active" | "Inactive";
  address: string;
  memId?: string;
  partyTypeId?: string;
  underGl?: string;
}

interface PartyState {
  data: Party[];
  partyTypes: PartyTypeOption[];
  partyTypesLoading: boolean;
  loading: boolean;
  saving: boolean;
  success: boolean;
  error: string | null;
}

const initialState: PartyState = {
  data: [],
  partyTypes: [],
  partyTypesLoading: false,
  loading: false,
  saving: false,
  success: false,
  error: null,
};

export const fetchPartyTypesThunk = createAsyncThunk(
  "partyMaster/fetchPartyTypes",
  async (orgId: string, { rejectWithValue }) => {
    try {
      return await partyAPI.fetchPartyTypes(orgId);
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue(error.message || "Failed to fetch party types");
    }
  },
);

export const fetchPartiesThunk = createAsyncThunk(
  "partyMaster/fetchParties",
  async (orgId: string, { rejectWithValue }) => {
    try {
      if (!orgId) {
        return rejectWithValue("Organisation not found");
      }
      return await partyAPI.fetchParties(orgId);
    } catch (err: unknown) {
      const error = err as any;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch parties",
      );
    }
  },
);

export const createPartyThunk = createAsyncThunk(
  "partyMaster/createParty",
  async (partyData: CreateTradingPartyPayload, { rejectWithValue }) => {
    try {
      return await partyAPI.createParty(partyData);
    } catch (err: unknown) {
      const error = err as any;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create party",
      );
    }
  },
);

export const updatePartyThunk = createAsyncThunk(
  "partyMaster/updateParty",
  async (partyData: UpdateTradingPartyPayload, { rejectWithValue }) => {
    try {
      return await partyAPI.updateParty(partyData);
    } catch (err: unknown) {
      const error = err as any;
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update party",
      );
    }
  },
);

const partyMasterSlice = createSlice({
  name: "partyMaster",
  initialState,
  reducers: {
    clearPartyError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartyTypesThunk.pending, (state) => {
        state.partyTypesLoading = true;
      })
      .addCase(
        fetchPartyTypesThunk.fulfilled,
        (state, action: PayloadAction<PartyTypeOption[]>) => {
          state.partyTypesLoading = false;
          state.partyTypes = action.payload;
        },
      )
      .addCase(fetchPartyTypesThunk.rejected, (state, action) => {
        state.partyTypesLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPartiesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchPartiesThunk.fulfilled,
        (state, action: PayloadAction<Party[]>) => {
          state.loading = false;
          state.data = action.payload;
          state.success = true;
        },
      )
      .addCase(fetchPartiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPartyThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createPartyThunk.fulfilled, (state) => {
        state.saving = false;
        state.success = true;
      })
      .addCase(createPartyThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      })
      .addCase(updatePartyThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePartyThunk.fulfilled, (state) => {
        state.saving = false;
        state.success = true;
      })
      .addCase(updatePartyThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPartyError } = partyMasterSlice.actions;
export default partyMasterSlice.reducer;
