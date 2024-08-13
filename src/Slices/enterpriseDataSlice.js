import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  EnterpriseId: "",
  StateId: "",
  LocationId: "",
  GatewayId: "",
  OptimizerId: "",
};



export const EnterpriseDataSlice = createSlice({
  name: "gatewayOpti",
  initialState,
  reducers: {
    updateEnterpriseId: (state, action) => {
      state.EnterpriseId = action.payload;
    },
    updateStateId: (state, action) => {
      state.StateId = action.payload;
    },
    updateLocationId: (state, action) => {
      state.LocationId = action.payload;
    },
    updateGatewayId: (state, action) => {
      state.GatewayId = action.payload;
    },
    updateOptimizerIde: (state, action) => {
      state.OptimizerId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateEnterpriseId,
  updateStateId,
  updateLocationId,
  updateGatewayId,
  updateOptimizerIde,
} = EnterpriseDataSlice.actions;

export default EnterpriseDataSlice.reducer;
