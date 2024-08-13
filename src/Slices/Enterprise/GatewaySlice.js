import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GATEWAYMODEL, GATEWAYTABLE, EDITGATEWAY, GATEWAYDETAILS } from "../../api/api";

export const GatewayList = createAsyncThunk(
  "GatewayList",

  async ({ LocationId, header }, { rejectWithValue }) => {
    try {
      const response = await GATEWAYTABLE(LocationId, header);
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

export const GatewayModel = createAsyncThunk(
  "GatewayModel",

  async ({ data, header }, { rejectWithValue }) => {
    try {
      const response = await GATEWAYMODEL(data, header);
     
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

export const EditGateway = createAsyncThunk(
  "EditGateway",

  async ({ GatewayId, data, header }, { rejectWithValue }) => {
    try {
      const response = await EDITGATEWAY(GatewayId, data, header);
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

export const GatewayDetails = createAsyncThunk(
  "GatewayDetails",

  async ({ Gateway_ID, header }, { rejectWithValue }) => {
    try {
      const response = await GATEWAYDETAILS(Gateway_ID, header);
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

  gateway_response: "",
  gateway_error: null,

  gateway_details_response: "",
  gateway_details_error: null,


  add_gatewaylist_response: "",
  add_gatewaylist_error: null,

  edit_gateway_response: "",
  edit_gateway_error: null,
};

export const GatewaySlice = createSlice({
  name: "EnterpriseSlice",
  initialState,
  reducers: {
    // Logout reducer
    clearError: (state) => {
      state.gateway_error = null;
    },
    clearGatewaysResponse: (state) => {
      state.gateway_response = " ";
    },
    clearGatewayResponse: (state) => {
      state.add_gatewaylist_response = " ";
    },
    clearGatewayerror: (state) => {
      state.add_gatewaylist_error = null;
    },
    clearEdit_gateway_response: (state) => {
      state.edit_gateway_response = " ";
    },
    clearEdit_gateway_error: (state) => {
      state.edit_gateway_error = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(GatewayList.pending, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Loading...";
      gateway.loading = true;
    });

    builder.addCase(GatewayList.fulfilled, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Success";
      gateway.loading = false;
      gateway.gateway_response = payload;
      gateway.gateway_error = null;
    });
    builder.addCase(GatewayList.rejected, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Failed";
      gateway.loading = false;
      gateway.gateway_error = payload;
    });
    // -----------------------------------------------------------------------------------------------
    builder.addCase(GatewayModel.pending, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Loading...";
      gateway.loading = true;
    });

    builder.addCase(GatewayModel.fulfilled, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Success";
      gateway.loading = false;
      gateway.add_gatewaylist_response = payload;
      gateway.add_gatewaylist_error = null;
    });
    builder.addCase(GatewayModel.rejected, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Failed";
      gateway.loading = false;
      gateway.add_gatewaylist_error = payload;
    });

    //------------------------------------------------------------------------------------------------

    builder.addCase(EditGateway.pending, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Loading...";
      gateway.loading = true;
    });

    builder.addCase(EditGateway.fulfilled, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Success";
      gateway.loading = false;
      gateway.edit_gateway_response = payload;
      gateway.edit_gateway_error = null;
    });
    builder.addCase(EditGateway.rejected, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Failed";
      gateway.loading = false;
      gateway.edit_gateway_error = payload;
    });

    // --------------------------------------------------------------------------------------------------
   
    builder.addCase(GatewayDetails.pending, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Loading...";
      gateway.loading = true;
    });
    builder.addCase(GatewayDetails.fulfilled, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Success";
      gateway.loading = false;
      gateway.gateway_details_response = payload;
      gateway.gateway_details_error = null;
    });
    builder.addCase(GatewayDetails.rejected, (gateway, { payload }) => {
      // Add user to the state array
      gateway.status = "Failed";
      gateway.loading = false;
      gateway.gateway_details_error = payload;
    });
  },
});



export const { clearEdit_gateway_response,clearEdit_gateway_error,clearError, clearResponse, clearGatewayResponse, clearGatewayerror, clearGatewaysResponse } = GatewaySlice.actions;



export default GatewaySlice.reducer;