import React, { useState, useEffect } from "react";
import LeftMenuList from "../Common/LeftMenuList";
import TopNavbar from "../Common/TopNavbar";
import axios from "axios";
import { Link } from "react-router-dom";
import { GatewayDetails } from "../Slices/Enterprise/GatewaySlice";
import { useSelector, useDispatch } from "react-redux";

function MeterDetails() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState([]);
  const [formattedDate, setFormattedDated] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  const [gatewayDetails, setGatewayDetails] = useState({
    PF: "",
    KWH: "",
    KVAH: "",
    Ph1Voltage: "",
    Ph1Current: "",
    Ph2Voltage: "",
    Ph2Current: "",
    Ph3Voltage: "",
    Ph3Current: "",
  });

  const { status, gateway_details_response, gateway_details_error, loading } =
    useSelector((state) => state.gatewaySlice);

  const Gateway_ID = window.localStorage.getItem("Gateway_id");
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  useEffect(() => {
    dispatch(GatewayDetails({ Gateway_ID, header }));
  }, []);
  useEffect(() => {
    // dispatch(GatewayDetails({ Gateway_ID, header }));
    if (gateway_details_response.success == true) {
      setGatewayDetails({
        PF: gateway_details_response.data.PF,
        KWH: gateway_details_response.data.KWH,
        KVAH: gateway_details_response.data.KVAH,
        Ph1Voltage: gateway_details_response.data.Phases.Ph1.Voltage,
        Ph1Current: gateway_details_response.data.Phases.Ph1.Current,
        Ph2Voltage: gateway_details_response.data.Phases.Ph2.Voltage,
        Ph2Current: gateway_details_response.data.Phases.Ph2.Current,
        Ph3Voltage: gateway_details_response.data.Phases.Ph3.Voltage,
        Ph3Current: gateway_details_response.data.Phases.Ph3.Current,
      });
      // Extract date and time from the timestamp
      const timestampInMillis =
        parseInt(gateway_details_response.data.TimeStamp) * 1000;
      // Create a new Date object using the timestamp
      const timestampDate = new Date(timestampInMillis);

      // Format date as "DD-MM-YYYY"
      setFormattedDated(
        `${timestampDate.getDate().toString().padStart(2, "0")}-${(
          timestampDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${timestampDate.getFullYear()}`
      );

      // Format time as "hh:mm A"
      setFormattedTime(
        timestampDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }
    if (gateway_details_error) {
      setErrorMessage(gateway_details_error);
    }
  }, [gateway_details_response, gateway_details_error]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenuList />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />

        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            {errorMessage && (
              <h2
                className="mt-2 text-s text-red-500"
                style={{ color: "red", fontWeight: "bold" }}
              >
                {errorMessage.error}
              </h2>
            )}
            <div className="flex justify-between">
              <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Gateway Details : {Gateway_ID}
              </h2>
            </div>
            {/* Table */}
            <div className="w-full overflow-x-auto">
              {/* Card */}
              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 ">
                <div className="flex items-center p-4 bg-red-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Power Factor (PF)
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.PF}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-blue-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Kilowatt-Hour (KWH)
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.KWH}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-red-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Kilovolt-Ampere Hour (KVAH)
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.KVAH}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Date & Time
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {formattedDate} || {formattedTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="flex items-center p-4 ">
                    <div className="p-3 mr-4 text-yellow-500 bg-red-100 rounded-full dark:text-yellow-100 dark:bg-green-500">
                      <svg
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 120.36 122.88"
                        width="20"
                        height="20"
                        fill="#fcca05"
                      >
                        <path d="M60.18 2.39h1.57l-8.1 13.53A47.08 47.08 0 0 0 34.52 102l-3.6 13.12A60.18 60.18 0 0 1 60.18 2.39Zm10 47.71h13.48a3.54 3.54 0 0 1 3.54 3.54 3.49 3.49 0 0 1-.61 2l-40 67.26-6.49-2.53 12.63-46.11-16 .27a3.52 3.52 0 0 1-3.09-5.31L75.12 0l6.54 2.29L70.17 50.1Zm20-39.69a60.19 60.19 0 0 1-30 112.34h-1.59l8-13.53A47.08 47.08 0 0 0 87 23.87l3.24-13.46Z" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-4 ">
                    <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                      Ph1Voltage(V)
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.Ph1Voltage}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="flex items-center p-4 ">
                    <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 68 68"
                        width="25"
                        height="25"
                        fill="#056afc"
                      >
                        <path d="M52.32 6.52c-.3.39-7.04 8.84-10.32 15.86-3.63-5.34-6.92-9.47-7.22-9.85-.38-.47-1.18-.47-1.56 0-.3.38-3.59 4.5-7.23 9.84-3.28-7.02-10.01-15.46-10.32-15.85a.986.986 0 0 0-.78-.38 1 1 0 0 0-.78.38C13.62 7.14 2 21.71 2 28.56c0 7.11 5.78 12.89 12.89 12.89.45 0 .9-.03 1.36-.08-.19.87-.29 1.7-.29 2.45 0 9.94 8.09 18.04 18.04 18.04 9.94 0 18.03-8.1 18.03-18.04 0-.75-.1-1.58-.29-2.45.45.05.91.08 1.36.08 7.11 0 12.9-5.78 12.9-12.89 0-6.85-11.62-21.42-12.12-22.04-.38-.48-1.18-.48-1.56 0zM34 59.86c-8.85 0-16.04-7.2-16.04-16.04 0-.95.19-2.03.52-3.21l.01-.01c.03-.12.06-.24.1-.36 1.35-4.44 4.68-10.13 7.96-15.1.04-.06.08-.11.12-.17 3.01-4.52 5.96-8.43 7.33-10.19 1.36 1.77 4.33 5.7 7.36 10.24 3.32 5.01 6.69 10.78 8.05 15.26v.01c.03.09.06.17.08.25.35 1.21.54 2.31.54 3.28 0 8.84-7.19 16.04-16.03 16.04zm22.5-25.31a6.909 6.909 0 0 0 3.5-5.99c0-.56.45-1 1-1s1 .44 1 1c0 3.18-1.73 6.15-4.51 7.73-.15.09-.32.13-.49.13-.35 0-.69-.18-.87-.5a1.01 1.01 0 0 1 .37-1.37z" />
                        <path d="M28.5 38h-3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1s1-.45 1-1v-3h2c2.2 0 4-1.79 4-4s-1.8-4-4-4zm0 6h-2v-4h2c1.1 0 2 .9 2 2s-.9 2-2 2zm13.997-6a1 1 0 0 0-1 1v4h-5v-4a1 1 0 0 0-2 0v10a1 1 0 1 0 2 0v-4h5v4a1 1 0 1 0 2 0V39a1 1 0 0 0-1-1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 ">
                    <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                      Ph1 Current(A)
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.Ph1Current}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="flex items-center p-4 ">
                    <div className="p-3 mr-4 text-yellow-500 bg-red-100 rounded-full dark:text-yellow-100 dark:bg-green-500">
                      <svg
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 120.36 122.88"
                        width="20"
                        height="20"
                        fill="#fcca05"
                      >
                        <path d="M60.18 2.39h1.57l-8.1 13.53A47.08 47.08 0 0 0 34.52 102l-3.6 13.12A60.18 60.18 0 0 1 60.18 2.39Zm10 47.71h13.48a3.54 3.54 0 0 1 3.54 3.54 3.49 3.49 0 0 1-.61 2l-40 67.26-6.49-2.53 12.63-46.11-16 .27a3.52 3.52 0 0 1-3.09-5.31L75.12 0l6.54 2.29L70.17 50.1Zm20-39.69a60.19 60.19 0 0 1-30 112.34h-1.59l8-13.53A47.08 47.08 0 0 0 87 23.87l3.24-13.46Z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 ">
                    <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                      Ph2 Voltage
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.Ph2Voltage}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="flex items-center p-4 ">
                    <div className="p-3 mr-4 text-yellow-500 bg-blue-100 rounded-full dark:text-yellow-100 dark:bg-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 68 68"
                        width="25"
                        height="25"
                        fill="#056afc"
                      >
                        <path d="M52.32 6.52c-.3.39-7.04 8.84-10.32 15.86-3.63-5.34-6.92-9.47-7.22-9.85-.38-.47-1.18-.47-1.56 0-.3.38-3.59 4.5-7.23 9.84-3.28-7.02-10.01-15.46-10.32-15.85a.986.986 0 0 0-.78-.38 1 1 0 0 0-.78.38C13.62 7.14 2 21.71 2 28.56c0 7.11 5.78 12.89 12.89 12.89.45 0 .9-.03 1.36-.08-.19.87-.29 1.7-.29 2.45 0 9.94 8.09 18.04 18.04 18.04 9.94 0 18.03-8.1 18.03-18.04 0-.75-.1-1.58-.29-2.45.45.05.91.08 1.36.08 7.11 0 12.9-5.78 12.9-12.89 0-6.85-11.62-21.42-12.12-22.04-.38-.48-1.18-.48-1.56 0zM34 59.86c-8.85 0-16.04-7.2-16.04-16.04 0-.95.19-2.03.52-3.21l.01-.01c.03-.12.06-.24.1-.36 1.35-4.44 4.68-10.13 7.96-15.1.04-.06.08-.11.12-.17 3.01-4.52 5.96-8.43 7.33-10.19 1.36 1.77 4.33 5.7 7.36 10.24 3.32 5.01 6.69 10.78 8.05 15.26v.01c.03.09.06.17.08.25.35 1.21.54 2.31.54 3.28 0 8.84-7.19 16.04-16.03 16.04zm22.5-25.31a6.909 6.909 0 0 0 3.5-5.99c0-.56.45-1 1-1s1 .44 1 1c0 3.18-1.73 6.15-4.51 7.73-.15.09-.32.13-.49.13-.35 0-.69-.18-.87-.5a1.01 1.01 0 0 1 .37-1.37z" />
                        <path d="M28.5 38h-3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1s1-.45 1-1v-3h2c2.2 0 4-1.79 4-4s-1.8-4-4-4zm0 6h-2v-4h2c1.1 0 2 .9 2 2s-.9 2-2 2zm13.997-6a1 1 0 0 0-1 1v4h-5v-4a1 1 0 0 0-2 0v10a1 1 0 1 0 2 0v-4h5v4a1 1 0 1 0 2 0V39a1 1 0 0 0-1-1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 ">
                    <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                      Ph2 Current
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.Ph2Current}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="flex items-center p-4 ">
                    <div className="p-3 mr-4 text-yellow-500 bg-red-100 rounded-full dark:text-yellow-100 dark:bg-green-500">
                      <svg
                        data-name="Layer 1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 120.36 122.88"
                        width="20"
                        height="20"
                        fill="#fcca05"
                      >
                        <path d="M60.18 2.39h1.57l-8.1 13.53A47.08 47.08 0 0 0 34.52 102l-3.6 13.12A60.18 60.18 0 0 1 60.18 2.39Zm10 47.71h13.48a3.54 3.54 0 0 1 3.54 3.54 3.49 3.49 0 0 1-.61 2l-40 67.26-6.49-2.53 12.63-46.11-16 .27a3.52 3.52 0 0 1-3.09-5.31L75.12 0l6.54 2.29L70.17 50.1Zm20-39.69a60.19 60.19 0 0 1-30 112.34h-1.59l8-13.53A47.08 47.08 0 0 0 87 23.87l3.24-13.46Z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 ">
                    <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                      Ph3 Voltage
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.Ph3Voltage}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="flex items-center p-4 ">
                    <div className="p-3 mr-4 text-yellow-500 bg-red-100 rounded-full dark:text-yellow-100 dark:bg-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 68 68"
                        width="25"
                        height="25"
                        fill="#056afc"
                      >
                        <path d="M52.32 6.52c-.3.39-7.04 8.84-10.32 15.86-3.63-5.34-6.92-9.47-7.22-9.85-.38-.47-1.18-.47-1.56 0-.3.38-3.59 4.5-7.23 9.84-3.28-7.02-10.01-15.46-10.32-15.85a.986.986 0 0 0-.78-.38 1 1 0 0 0-.78.38C13.62 7.14 2 21.71 2 28.56c0 7.11 5.78 12.89 12.89 12.89.45 0 .9-.03 1.36-.08-.19.87-.29 1.7-.29 2.45 0 9.94 8.09 18.04 18.04 18.04 9.94 0 18.03-8.1 18.03-18.04 0-.75-.1-1.58-.29-2.45.45.05.91.08 1.36.08 7.11 0 12.9-5.78 12.9-12.89 0-6.85-11.62-21.42-12.12-22.04-.38-.48-1.18-.48-1.56 0zM34 59.86c-8.85 0-16.04-7.2-16.04-16.04 0-.95.19-2.03.52-3.21l.01-.01c.03-.12.06-.24.1-.36 1.35-4.44 4.68-10.13 7.96-15.1.04-.06.08-.11.12-.17 3.01-4.52 5.96-8.43 7.33-10.19 1.36 1.77 4.33 5.7 7.36 10.24 3.32 5.01 6.69 10.78 8.05 15.26v.01c.03.09.06.17.08.25.35 1.21.54 2.31.54 3.28 0 8.84-7.19 16.04-16.03 16.04zm22.5-25.31a6.909 6.909 0 0 0 3.5-5.99c0-.56.45-1 1-1s1 .44 1 1c0 3.18-1.73 6.15-4.51 7.73-.15.09-.32.13-.49.13-.35 0-.69-.18-.87-.5a1.01 1.01 0 0 1 .37-1.37z" />
                        <path d="M28.5 38h-3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1s1-.45 1-1v-3h2c2.2 0 4-1.79 4-4s-1.8-4-4-4zm0 6h-2v-4h2c1.1 0 2 .9 2 2s-.9 2-2 2zm13.997-6a1 1 0 0 0-1 1v4h-5v-4a1 1 0 0 0-2 0v10a1 1 0 1 0 2 0v-4h5v4a1 1 0 1 0 2 0V39a1 1 0 0 0-1-1z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4 ">
                    <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                      Ph3 Current
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {gatewayDetails.Ph3Current}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MeterDetails;
