import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ENTERPRISETABLE,
  ADDENTERPRISE,
  EDITENTERPRISE,
  DELETE,
} from "../../api/api";

export const enterpriseList = createAsyncThunk(
  "EnterpriseList",
  async ({ header }, { rejectWithValue }) => {
    try {
      const response = await ENTERPRISETABLE(header);
      return response.data.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error);
    }
  }
);

export const Addenterprise = createAsyncThunk(
  "AddEnterprise",
  async ({ data, header }, { rejectWithValue }) => {
    try {
      const response = await ADDENTERPRISE(data, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error);
    }
  }
);

export const EditEnterprise = createAsyncThunk(
  "EditEnterprise",
  async ({ EnterpriseId, data, header }, { rejectWithValue }) => {
    try {
      const response = await EDITENTERPRISE(EnterpriseId, data, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error);
    }
  }
);

export const Delete = createAsyncThunk(
  "Delete",
  async ({ deleteData, header }, { rejectWithValue }) => {
    try {
      const response = await DELETE(deleteData, header);
      return response.data;
    } catch (error) {
      if (
        error.response.data.message === "Invalid token" ||
        error.response.data.message === "Access denied"
      ) {
        window.localStorage.clear();
        window.location.href = "./";
      }
      return rejectWithValue(error);
    }
  }
);

const initialState = {

  status: "",
  loading: false,

  customer_response: "",
  error: null,

  add_enterprise_response: "",
  add_enterprise_error: null,

  edit_enterprise_response: "",
  edit_enterprise_error: null,

  allDelete_response: "",
  allDelete_error: "",
};

export const EnterpriseSlice = createSlice({
  name: "EnterpriseSlice",
  initialState,
  reducers: {
    clearEnterpriseResonse: (state) => {
      state.customer_response = "";
    },
    clearEnterprise_Add_error: (state) => {

      state.add_enterprise_error = "";
    },
    clearAdd_enterprise_response: (state) => {
      state.add_enterprise_response = "";
    },

    clearDelete_response:(state)=>{
      state.allDelete_response="";
    },

    clearDelete_error:(state)=>{
      state.allDelete_error="";
    },

    clearEdit_enterprise_response: (state) => {
      state.edit_enterprise_response = "";
    },
    clearEdit_enterprise_error: (state) => {
      state.edit_enterprise_error = "";
    },
    
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(enterpriseList.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(enterpriseList.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.customer_response = payload;
      state.error = null;
    });
    builder.addCase(enterpriseList.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.error = payload;
    });

    // ADD ENTERPRISE ------------------------------------------------------------------
    builder.addCase(Addenterprise.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(Addenterprise.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.add_enterprise_response = payload;
      state.add_enterprise_error = null;
    });
    builder.addCase(Addenterprise.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.add_enterprise_error = payload;
    });

    // Edit Enterprise----------------------------------------------------------
    builder.addCase(EditEnterprise.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(EditEnterprise.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.edit_enterprise_response = payload;
      state.edit_enterprise_error = null;
    });
    builder.addCase(EditEnterprise.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.edit_enterprise_error = payload;
    });

    // DELETE----------------------------------------------------------
    builder.addCase(Delete.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(Delete.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.allDelete_response = payload;
      state.allDelete_error = null;
    });
    builder.addCase(Delete.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.allDelete_error = payload;
    });
  },
});
export const {
  clearEnterprise_Add_error,
  clearAdd_enterprise_response,
  clearEnterpriseResonse,
  clearDelete_response,
  clearDelete_error,
  clearEdit_enterprise_response,
  clearEdit_enterprise_error
} = EnterpriseSlice.actions;
export default EnterpriseSlice.reducer;

