import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOCATIONTABLE, ADDLOCATION } from "../../api/api";

export const locationList = createAsyncThunk(
  "LocationList",
  async ({ data, EnterpriseId, StateId, header }, { rejectWithValue }) => {
    try {
      const response = await LOCATIONTABLE(EnterpriseId, StateId, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const locationModel = createAsyncThunk(
  "LocationModel",


  async ({ data, header }, { rejectWithValue }) => {

    try {
      const response = await ADDLOCATION(data, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  status: "",
  loading: false,

  location_response: "",
  location_error: null,

  // add_location_response:"",
  // add_location_error: null,  

  add_locationlist_response: "",
  add_locationlist_error: null,
};

export const LocationSlice = createSlice({
  name: "EnterpriseSlice",
  initialState,
  reducers: {
    // Logout reducer
    clearError: (state) => {
      state.location_error = null;
    },
    clearLocationResponse: (state) => {
      state.location_response = " ";
    },
    clearAddLoctation_response: (state) => {
      state.add_locationlist_response = " ";
    },
    clearAddLoctation_error: (state) => {
      state.add_locationlist_error = null;
    },
    
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(locationList.pending, (location, { payload }) => {
      // Add user to the state array
      location.status = "Loading...";
      location.loading = true;
    });

    builder.addCase(locationList.fulfilled, (location, { payload }) => {
      // Add user to the state array
      location.status = "Success";
      location.loading = false;
      location.location_response = payload;
      location.location_error = null;
    });
    builder.addCase(locationList.rejected, (location, { payload }) => {
      // Add user to the state array
      location.status = "Failed";
      location.loading = false;
      location.location_error = payload;
    });

    // ADD LOCATION LIST ------------------------------------------------------------------
    builder.addCase(locationModel.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(locationModel.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.add_locationlist_response = payload;
      state.add_locationlist_error = null;
    });
    builder.addCase(locationModel.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.add_locationlist_error = payload;
    });
  },
});

export const {  clearAddLoctation_response, clearAddLoctation_error,clearError,clearLocationResponse } = LocationSlice.actions;

export default LocationSlice.reducer;
