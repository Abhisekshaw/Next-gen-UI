import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Forgot from "../Pages/Authentication/Forgot";
import Login from "../Pages/Authentication/Login";
import Reports from "../Pages/Report/Reports";
import User from "../Pages/User";
import Gateway from "../Pages/Enterprise/Gateway";
import State from "../Pages/Enterprise/State";
import Location from "../Pages/Enterprise/Location";
import Optimizer from "../Pages/Enterprise/Optimizer";
import OptimizerDetails from "../Pages/Enterprise/OptimizerDetails";
import Settings from "../Pages/Settings/Settings";
import Dashboard from "../Pages/Dashboard";
import MeterDetails from "../Pages/MeterDetails";
import ProtectedRouteOne from "./protectedroute/ProtectedRouteOne";
import Enterprise from "../Pages/Enterprise/Enterprise";
import AcStatus from "../Modals/AcStatus";

function SuperAdminRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />

        <Route element={<ProtectedRouteOne />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Reports />} />
          <Route path="/user" element={<User />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/state" element={<State />} />
          <Route path="/location" element={<Location />} />
          <Route path="/gateway" element={<Gateway />} />
          <Route path="/user" element={<User />} />
          <Route path="/optimizer" element={<Optimizer />} />
          <Route path="/optimizerdetails" element={<OptimizerDetails />} />
          <Route path="/gatewaydetails" element={<MeterDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/AcStatus" element={<AcStatus />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default SuperAdminRoutes;
