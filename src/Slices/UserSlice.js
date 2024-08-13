import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  USERAPILIST,
  ADDENTERPRISELIST,
  ADDSYSTEMINTEGRATOR,
  ENTERPRISEUSERLIST,
  USERDELETE,
} from "../api/api";

export const userList = createAsyncThunk(
  "user/userList",
  async ({ header }, { rejectWithValue }) => {
    try {
      const response = await USERAPILIST(header);
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
export const userDelete = createAsyncThunk(
  "user/userDelete",
  async ({ Id, header }, { rejectWithValue }) => {
    try {
      const response = await USERDELETE(Id, header);
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
export const addEnterpriseList = createAsyncThunk(
  "user/addEnterpriseList",
  async ({ data, navigate, header }, { rejectWithValue }) => {
    try {
      const response = await ADDENTERPRISELIST(data, header);

      return response;
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

export const addSystemIntegrator = createAsyncThunk(
  "user/addSystemIntegrator",
  async ({ dataa, navigate, header }, { rejectWithValue }) => {
    try {
      const response = await ADDSYSTEMINTEGRATOR(dataa, header);
      return response;
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

export const EnterpriseName = createAsyncThunk(
  "user/EnterpriseName",
  async ({ header }, { rejectWithValue }) => {
    try {
      const response = await ENTERPRISEUSERLIST(header);
      return response;
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

  response: "",
  error: null,

  delete_response: "",
  delete_error: null,

  add_enterprise_user: "",
  add_enterprise_user_error: null,

  add_SyetemIntegrator: "",
  add_SyetemIntegrator_error: null,

  add_enterprise_name: "",
  add_enterprise_name_error: "",

};

export const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    // Logout reducer
    clearError: (state) => {
      state.error = null;
    },
    clearEnterprise_list_error: (state) => {
      state.add_enterprise_user_error = null;
    },
    clearResponse: (state) => {
      state.response = "";
    },
    clearSystemIntegratorResponse: (state) => {
      state.add_SyetemIntegrator = "";
    },
    clearEnterpriseResponse: (state) => {
      state.add_enterprise_user = "";
    },
    clearDeleteResponse: (state) => {
      state.delete_response = "";
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(userList.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });
    builder.addCase(userList.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.response = payload;
      state.error = null;
    });
    builder.addCase(userList.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.error = payload;
    });

    //ADD ENTERPRISE USER  --------------------------------------------------------

    builder.addCase(addEnterpriseList.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(addEnterpriseList.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.add_enterprise_user = payload;
      state.add_enterprise_user_error = null;
    });
    builder.addCase(addEnterpriseList.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.add_enterprise_user = null;
      state.add_enterprise_user_error = payload;
    });

    // ADD SYSTEM INTEGRATOR-----------------------------------------------------------------

    builder.addCase(addSystemIntegrator.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });
    builder.addCase(addSystemIntegrator.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.add_SyetemIntegrator = payload;
      state.add_SyetemIntegrator_error = null;
    });
    builder.addCase(addSystemIntegrator.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.add_SyetemIntegrator = null;
      state.add_SyetemIntegrator_error = payload;
    });

    // ENTERPRISE NAME-------------------------------------------------------------------------

    builder.addCase(EnterpriseName.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });
    builder.addCase(EnterpriseName.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.add_enterprise_name = payload;
      state.add_enterprise_name_error = null;
    });
    builder.addCase(EnterpriseName.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.add_enterprise_name = null;
      state.add_enterprise_name_error = payload;
    });

    // USER DELETE-------------------------------------------------------------------------

    builder.addCase(userDelete.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });
    builder.addCase(userDelete.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.delete_response = payload;
      state.delete_error = null;
    });
    builder.addCase(userDelete.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.delete_response = null;
      state.delete_error = payload;
    });
  },
});
export const {  clearDeleteResponse,clearSystemIntegratorResponse,clearEnterpriseResponse } = UserSlice.actions;
export default UserSlice.reducer;
