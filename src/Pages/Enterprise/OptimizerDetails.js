import React, { useState, useEffect } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import Loader from "../../utils/Loader";
import { useSelector, useDispatch } from "react-redux";
import {
  OptimizerDetails,
  clearAdd_optimizer_response,
  clearAdd_optimizer_error,
} from "../../Slices/Enterprise/OptimizerSlice";

function OptimizerDetail() {
  const dispatch = useDispatch();
  const [formattedDate, setFormattedDated] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [optimizerDetails, setOptimizerDetails] = useState({
    ambientTemperature: "",
    ambientHumidity: "",
    optimizerID: "",
    gatewayID: "",
    optimizerMode: "",
    roomTemperature: "",
    coilTemperature: "",
    humidity: "",
  });

  const [errorMessage, setErrorMessage] = useState([]);

  const optimizerId = window.localStorage.getItem("Optimizer_id");
  const { add_optimizer_response, add_optimizer_error, loading } = useSelector(
    (state) => state.optimizerSlice
  );

  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  useEffect(() => {
    if (add_optimizer_error) {
      setErrorMessage(add_optimizer_error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
      dispatch(clearAdd_optimizer_error());
    }

    if (add_optimizer_response) {
      const data = add_optimizer_response;
      // Update the state with the fetched data
      setOptimizerDetails({
        optimizerID: data?.data.Optimizer.OptimizerID,
        gatewayID: data?.data.Gateway.GatewayID,
        optimizerMode: data?.data.optimizer_mode,
        roomTemperature: data?.data.room_temp,
        coilTemperature: data?.data.coil_temp,
        humidity: data?.data.humidity,
        ACTonnage: data?.data?.Optimizer?.ACTonnage,
        Fan_Consumption: data?.data?.Optimizer?.Fan_consumption,
        ambientTemperature: data?.data?.AmbientTemperature,
        ambientHumidity: data?.data?.AmbientHumidity,
      });

      // Extract date and time from the timestamp
      const timestampInMillis = parseInt(data.data.TimeStamp) * 1000;
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

      dispatch(clearAdd_optimizer_response());
    }
  }, [add_optimizer_error, add_optimizer_response]);

  useEffect(() => {
    // Function to fetch data
    async function fetchData() {
      dispatch(OptimizerDetails({ optimizerId, header }));
    }

    // Initial fetch
    fetchData();
  }, []); // Add dependencies if necessary

  return (
    <>
      {loading && <Loader />}
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <LeftMenuList />
        <div className="flex flex-col flex-1 w-full">
          <TopNavbar />

          <main className="h-full overflow-y-auto">
            <div className="container px-6 mx-auto grid">
              {errorMessage && (
                <h5
                  className="mt-2 text-s text-red-500"
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  {errorMessage}
                </h5>
              )}
              <div className="flex justify-between">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Optimizer Details :{optimizerId}
                </h2>
              </div>
              {/* Table */}

              <div className="w-full overflow-x-auto">
                {/* Card */}
                <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 ">
                  <div className="flex items-center p-4 bg-red-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Ambient Temparature
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.ambientTemperature}°C
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-blue-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Ambient Humidity
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.ambientHumidity}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-red-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Date & Time
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {formattedDate} || {formattedTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-blue-100 rounded-lg shadow-xs dark:bg-gray-800 mb-8">
                    <div>
                      <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        AC Tonnage
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails?.ACTonnage} Ton
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
                  <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div className="flex items-center p-4 ">
                      <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#e17055"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="16"
                            height="16"
                            rx="2"
                            ry="2"
                          ></rect>
                          <rect x="9" y="9" width="6" height="6"></rect>
                          <line x1="9" y1="1" x2="9" y2="4"></line>
                          <line x1="15" y1="1" x2="15" y2="4"></line>
                          <line x1="9" y1="20" x2="9" y2="23"></line>
                          <line x1="15" y1="20" x2="15" y2="23"></line>
                          <line x1="20" y1="9" x2="23" y2="9"></line>
                          <line x1="20" y1="14" x2="23" y2="14"></line>
                          <line x1="1" y1="9" x2="4" y2="9"></line>
                          <line x1="1" y1="14" x2="4" y2="14"></line>
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 ">
                      <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                        OptimizerID
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.optimizerID}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div className="flex items-center p-4 ">
                      <div className="p-3 mr-4 text-orange-500 bg-green-100 rounded-full dark:text-orange-100 dark:bg-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#07b23c"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="4"
                            y="4"
                            width="16"
                            height="16"
                            rx="2"
                            ry="2"
                          ></rect>
                          <rect x="9" y="9" width="6" height="6"></rect>
                          <line x1="9" y1="1" x2="9" y2="4"></line>
                          <line x1="15" y1="1" x2="15" y2="4"></line>
                          <line x1="9" y1="20" x2="9" y2="23"></line>
                          <line x1="15" y1="20" x2="15" y2="23"></line>
                          <line x1="20" y1="9" x2="23" y2="9"></line>
                          <line x1="20" y1="14" x2="23" y2="14"></line>
                          <line x1="1" y1="9" x2="4" y2="9"></line>
                          <line x1="1" y1="14" x2="4" y2="14"></line>
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 ">
                      <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                        GatewayID
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.gatewayID}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div className="flex items-center p-4 ">
                      <div className="p-3 mr-4 text-orange-500 bg-blue-100 rounded-full dark:text-orange-100 dark:bg-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6794f9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 ">
                      <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                        Optimizer Mode
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.optimizerMode}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div className="flex items-center p-4 ">
                      <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-thermometer"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                          <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z" />
                        </svg>
                      </div>
                      {/* <!-- Circular Progress --> */}
                      <div className="relative h-40 w-40">
                        <svg
                          className="h-full w-full"
                          width="36"
                          height="36"
                          viewBox="0 0 36 36"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* <!-- Background Circle --> */}
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-current text-gray-200 dark:text-gray-700"
                            strokeWidth="2"
                          ></circle>
                          {/* <!-- Progress Circle inside a group with rotation --> */}
                          <g className="origin-center -rotate-90 transform">
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              className="stroke-current text-blue-600 dark:text-blue-500"
                              strokeWidth="2"
                              strokeDasharray="100"
                              strokeDashoffset="75"
                            ></circle>
                          </g>
                        </svg>
                      </div>
                      {/* <!-- End Circular Progress -->

<!-- Circular Progress -->

<!-- End Circular Progress --> */}
                    </div>

                    <div className="p-4 ">
                      <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                        Room Temperature
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.roomTemperature}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div className="flex items-center p-4 ">
                      <div className="p-3 mr-4 text-orange-500 bg-red-100 rounded-full dark:text-orange-100 dark:bg-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="#fb3b1f"
                          className="bi bi-thermometer"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                          <path d="M8 0a2.5 2.5 0 0 0-2.5 2.5v7.55a3.5 3.5 0 1 0 5 0V2.5A2.5 2.5 0 0 0 8 0M6.5 2.5a1.5 1.5 0 1 1 3 0v7.987l.167.15a2.5 2.5 0 1 1-3.333 0l.166-.15z" />
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 ">
                      <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                        Coil Temperature
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.coilTemperature}°C
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div className="flex items-center p-4 ">
                      <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 328.611 328.611"
                          xmlSpace="preserve"
                          width="20"
                          height="20"
                          fill="#056afc"
                        >
                          <path d="M209.306 50.798a7.5 7.5 0 0 0-12.088 8.883c54.576 74.266 66.032 123.541 66.032 151.8 0 27.691-8.272 52.794-23.293 70.685-17.519 20.866-42.972 31.446-75.651 31.446-73.031 0-98.944-55.018-98.944-102.131 0-52.227 28.103-103.234 51.679-136.829 25.858-36.847 52.11-61.415 52.37-61.657a7.5 7.5 0 0 0-10.209-10.99c-1.11 1.031-27.497 25.698-54.254 63.765-24.901 35.428-54.586 89.465-54.586 145.71 0 31.062 9.673 59.599 27.236 80.353 20.361 24.061 50.345 36.779 86.708 36.779 36.794 0 66.926-12.726 87.139-36.801 17.286-20.588 26.806-49.117 26.806-80.33-.001-55.265-37.493-117.884-68.945-160.683z" />
                          <path d="m198.43 148.146-95.162 95.162a7.5 7.5 0 0 0 5.304 12.803 7.478 7.478 0 0 0 5.304-2.197l95.162-95.162a7.5 7.5 0 0 0 0-10.606 7.502 7.502 0 0 0-10.608 0zm-6.465 59.753c-13.292 0-24.106 10.814-24.106 24.106s10.814 24.106 24.106 24.106 24.106-10.814 24.106-24.106-10.814-24.106-24.106-24.106zm0 33.212c-5.021 0-9.106-4.085-9.106-9.106s4.085-9.106 9.106-9.106 9.106 4.085 9.106 9.106-4.085 9.106-9.106 9.106zm-66.787-46.949c13.292 0 24.106-10.814 24.106-24.106s-10.814-24.106-24.106-24.106-24.106 10.814-24.106 24.106 10.814 24.106 24.106 24.106zm0-33.213c5.021 0 9.106 4.085 9.106 9.106s-4.085 9.106-9.106 9.106-9.106-4.085-9.106-9.106 4.084-9.106 9.106-9.106z" />
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 ">
                      <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                        Humidity
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.humidity}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <div className="flex items-center p-4 ">
                      <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-green-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#6794f9"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                        </svg>
                      </div>
                    </div>

                    <div className="p-4 ">
                      <p className="mb-2 text-sm font-medium text-gray-400 dark:text-gray-400">
                        Fan Consumption
                      </p>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {optimizerDetails.Fan_Consumption} KWH
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default OptimizerDetail;
