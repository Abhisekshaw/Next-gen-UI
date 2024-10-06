//import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ACONOFF
} from "../../api/api";

export const fetchOnOff = createAsyncThunk(
  "OptimizerOnOff",
  async ({ data, header }, { getState }) => {
  
    const response = await ACONOFF(data, header);
    return response.data.data;
  }
);

const ACOnOffSlice = createSlice({
  name: 'OptimizerOnOff',
  initialState: {
    aconoff: [],
    loading: false,
    error: null,
  },
  reducers: {    
    clearGatewaysResponse: (state) => {
      state.aconoff = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnOff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnOff.fulfilled, (state, action) => {
        state.loading = false;
        state.aconoff = action.payload;
      })
      .addCase(fetchOnOff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {clearGatewaysResponse} = ACOnOffSlice.actions;

export default ACOnOffSlice.reducer;