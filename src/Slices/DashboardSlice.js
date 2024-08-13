import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DASHBOARD } from "../api/api";

export const DashboardApi = createAsyncThunk(
    "Dashboard",

    async ({ header }, { rejectWithValue }) => {

        try {
            const response = await DASHBOARD(header);
            return response.data;
        } catch (error) {
            if (
                error.response.data.message === "Invalid token" ||
                error.response.data.message === "Access denied"
            ) {
                window.localStorage.clear();
                window.dashboard.href = "./";
            }
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    status: "",
    loading: false,

    dashboard_response: "",
    dashboard_error: null,

};

export const DashboardSlice = createSlice({
    name: "DashboardSlice",
    initialState,
    reducers: {
        clearDashboardError: (state) => {
            state.dashboard_error = null;
        },
        clearDashboardResponse: (state) => {
            state.dashboard_response = "";
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(DashboardApi.pending, (dashboard, { payload }) => {
            // Add user to the state array
            dashboard.status = "Loading...";
            dashboard.loading = true;
        });

        builder.addCase(DashboardApi.fulfilled, (dashboard, { payload }) => {
            // Add user to the state array
            dashboard.status = "Success";
            dashboard.loading = false;
            dashboard.dashboard_response = payload;
            dashboard.dashboard_error = null;
        });
        builder.addCase(DashboardApi.rejected, (dashboard, { payload }) => {
            // Add user to the state array
            dashboard.status = "Failed";
            dashboard.loading = false;
            dashboard.dashboard_error = payload;
        });

    },
});

export const { clearDashboardResponse, clearDashboardError } = DashboardSlice.actions;

export default DashboardSlice.reducer;