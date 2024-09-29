import { configureStore } from "@reduxjs/toolkit";
import EnterpriseSliceReducer from "../Slices/enterpriseDataSlice";
import AuthSlice from "../Slices/AuthSlice";
import UserSlice from "../Slices/UserSlice";
import EnterpriseSlice from "../Slices/Enterprise/enterpriseSlice"
import StateSlices from "../Slices/Enterprise/StateSlices";
import LocationSlice from "../Slices/Enterprise/LocationSlice";
import GatewaySlice from "../Slices/Enterprise/GatewaySlice";
import OptimizerSlice  from "../Slices/Enterprise/OptimizerSlice";
import SettingsSlice from "../Slices/SettingsSlice";
import ByPassSlice from "../Slices/Enterprise/ByPassSlice";
import  ReportSlice  from "../Slices/ReportSlices";
import DashboardSlice from "../Slices/DashboardSlice";
import dropdownSlice from "../Slices/Enterprise/NewEnterpriseDataSlice";

export const store = configureStore({
  reducer: {
    EnterpriseData: EnterpriseSliceReducer,
    authSlice: AuthSlice,
    userSlice: UserSlice,
    enterpriseSlice: EnterpriseSlice,
    stateSlices: StateSlices,
    locationSlice:LocationSlice,
    gatewaySlice:GatewaySlice,
    optimizerSlice:OptimizerSlice,
    settingsSlice:SettingsSlice,
    byPassSlice:ByPassSlice,
    reportSlice:ReportSlice,
    dashboardSlice:DashboardSlice,
    enterpriseDataSlice: dropdownSlice
  },
});
