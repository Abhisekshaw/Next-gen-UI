//import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GETALLENTERPRISE
} from "../../api/api";

export const fetchEnterprises = createAsyncThunk(
  "GetAllEnterprise",
  async ({ header }, { getState }) => {
    const enterprises = getState().enterpriseDataSlice.enterprises;
    if(enterprises.length > 0){
      return enterprises;
    }
    const response = await GETALLENTERPRISE(header);   
    
    // process and aggregates counts
    
    return response.data.data;
  }

//   'countries/fetchCountries',
//   async (_, { getState }) => {
//     const { countries } = getState().country; // Access state to check if data already exists
//     if (countries.length > 0) {
//       // If data exists, return early to avoid making the API call
//       return countries;
//     }

//     const response = await axios.get('https://example.com/api/countries');
//     return response.data;
//   }
);

const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState: {
    enterprises: [],
    loading: false,
    error: null,
  },
  reducers: {    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnterprises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnterprises.fulfilled, (state, action) => {
        state.loading = false;
        state.enterprises = action.payload;
      })
      .addCase(fetchEnterprises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {} = dropdownSlice.actions;

export default dropdownSlice.reducer;