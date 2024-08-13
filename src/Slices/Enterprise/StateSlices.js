import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { STATETABLE, ADDSTATELIST, ADDSTATE } from "../../api/api";


// this is for table ___________
export const stateList = createAsyncThunk(
  "StateList",
  async ({ EnterpriseId, header }, { rejectWithValue }) => {
    try {
      const response = await STATETABLE(EnterpriseId, header);
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
//  model states List_______________________________________
export const AddstateList = createAsyncThunk(
  "AddStateList",
  async ({ header }, { rejectWithValue }) => {
    try {
      const response = await ADDSTATELIST(header);
      return response.data.data;

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
// model add button________________________________________

export const Addstate = createAsyncThunk(
  "AddState",
  async ({ data, header }, { rejectWithValue }) => {
    try {
      const response = await ADDSTATE(data, header);

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

  state_response: "",
  state_error: "",

  add_state_response: "",
  add_state_error: null,

  add_statelist_response: "",
  add_statelist_error: null,
};

export const StateSlice = createSlice({
  name: "EnterpriseSlice",
  initialState,
  reducers: {
    // Logout reducer
    clearError: (state) => {
      state.state_error = "";
    },
    //   clearState_list_error: (state) => {
    //     state.error = null;
    //   },
    clearResponse: (state) => {
      state.state_response = "";
    },
    clearAdd_state_response:(state)=>{
      state.add_state_response="";
    },
    clearAdd_state_error:(state)=>{
      state.add_state_error="";
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(stateList.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(stateList.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.state_response = payload;
      state.state_error = null;
    });
    builder.addCase(stateList.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.state_error = payload;
    });

    // MODEL STATE LIST ------------------------------------------------------------------
    builder.addCase(AddstateList.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(AddstateList.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.add_statelist_response = payload;
      state.add_statelist_error = null;
    });
    builder.addCase(AddstateList.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.add_statelist_error = payload;
    });
    // ADD STATE ------------------------------------------------------------------
    builder.addCase(Addstate.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(Addstate.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.add_state_response = payload;
      state.add_state_error = null;
    });
    builder.addCase(Addstate.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.add_state_error = payload;
    });
  },
});
export const { clearAdd_state_response,clearAdd_state_error,clearResponse, clearError } = StateSlice.actions;
export default StateSlice.reducer;
