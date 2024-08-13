import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LOGIN, FORGOTPASS } from "../api/api";

export const userLogin = createAsyncThunk(
  "/login",
  async ({ data, navigate }, { rejectWithValue }) => {
    try {
      const response = await LOGIN(data);
       if (response?.data?.success === true) {
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("loggedIn", true);
        navigate("/dashboard");
      }

      return response.data;
    } catch (error) {
     return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "/forgot",
  async ({ data, navigate }, { rejectWithValue }) => {
    try {
      const response = await FORGOTPASS(data);

       if (response?.data?.success === true) {
        window.localStorage.setItem("token", response.data.token);
        window.localStorage.setItem("loggedIn", true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
      return response.data;
    } catch (error) {
    
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  loginData: null,
  secret_token_data: "",
  otp_data: null,
  forgot_password_data: "",
  status: "",
  response: "",
  error: null,
  forgotpass_error: null,
  loading: false,
};

//   create Slice
export const AuthSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    // Logout reducer
    doLogout: (state) => {
      window.localStorage.clear();
      state.token = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    clearForgotPassError: (state) => {
      state.forgotpass_error = null;
    },
    clearResponse: (state) => {
      state.response = "";
    },
    clearLoginData: (state) => {
      state.loginData = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(userLogin.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.loginData = payload;
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.error = payload;
    });

    // Forgot Password ------------------------------

    builder.addCase(forgotPassword.pending, (state, { payload }) => {
      // Add user to the state array
      state.status = "Loading...";
      state.loading = true;
    });

    builder.addCase(forgotPassword.fulfilled, (state, { payload }) => {
      // Add user to the state array
      state.status = "Success";
      state.loading = false;
      state.token = payload?.data?.token;
      state.response = payload;
      
      });
    builder.addCase(forgotPassword.rejected, (state, { payload }) => {
      // Add user to the state array
      state.status = "Failed";
      state.loading = false;
      state.forgotpass_error = payload;
    });
  },
});

export const { doLogout, clearLoginData, clearError, clearForgotPassError } = AuthSlice.actions;
export default AuthSlice.reducer;
