import React, { useEffect, useRef, useState } from "react";
import LeftMenuList from "../Common/LeftMenuList";
import TopNavbar from "../Common/TopNavbar";
import "daterangepicker";
import $ from "jquery";
import moment from "moment";
import Chart from "chart.js/auto";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DashboardApi } from "../Slices/DashboardSlice";
function Dashboard() {
  const dispatch = useDispatch();
  const chartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [deviceNum, setDeviceNum] = useState({
    totalGateway: "",
    totalOptimizer: "",
    totalCustomer: "",
    state: "",
  });
  const percentage = 50;

  const { dashboard_response, dashboard_error } = useSelector(
    (state) => state.dashboardSlice
  );
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    // Your jQuery code to initialize the date range picker
    $('input[name="datetimes"]').daterangepicker({
      timePicker: true,
      startDate: moment().startOf("hour"),
      endDate: moment().startOf("hour").add(32, "hour"),
      locale: {
        format: "M/DD/YYYY hh:mm A",
      },
    });

    $('input[name="datetimes"]').on(
      "apply.daterangepicker",
      function (ev, picker) {
        const startDate = picker.startDate.format("M/DD/YYYY hh:mm A");
        const endDate = picker.endDate.format("M/DD/YYYY hh:mm A");
      }
    );
    // Clean up the date range picker when the component unmounts
    return () => {
      $('input[name="datetimes"]')?.data("daterangepicker")?.remove();
    };
  }, []);

  useEffect(() => {
    const myChart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Power Saving",
            backgroundColor: "#0694a2",
            data: [-3, 14, 52, 74, 33, 90, 70],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,

        scales: {
          y: {
            beginAtZero: true, // Ensures the y-axis starts at zero
          },
        },

        legend: {
          display: false,
        },
      },
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => myChart.destroy();
  }, []);

  useEffect(() => {
    const LineChart = new Chart(lineChartRef.current, {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Carbon Reduction",
            backgroundColor: "#0694a2",
            borderColor: "#0694a2",
            data: [43, 48, 40, 54, 67, 73, 70],
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,

        legend: {
          display: false,
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          x: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
          },
          y: {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Value",
            },
          },
        },
      },
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => LineChart.destroy();
  }, []);

  useEffect(() => {
    dispatch(DashboardApi({ header }));
  }, [dispatch]);
  useEffect(() => {
    if (dashboard_response) {
      const {
        TotalGateway,
        TotalOptimizer,
        TotalEnterprise,
        TotalEnterpriseState,
      } = dashboard_response;
      setDeviceNum((prev) => ({
        ...prev,
        totalGateway: TotalGateway,
        totalOptimizer: TotalOptimizer,
        totalCustomer: TotalEnterprise,
        state: TotalEnterpriseState,
      }));
    }
  }, [dispatch, dashboard_response, dashboard_error]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenuList />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />

        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <div className="flex justify-between items-center">
              <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Dashboard
              </h2>
              <div className="refresh">
                <button
                  className="w-12 h-12 rounded-full shadow-md text-center flex justify-center items-center
              bg-blue-100 hover:bg-red-500 text-white"
                >
                  <svg
                    className="w-5 h-5 mx-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#0f3ec2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card */}

            <div>
              <div className="w-full mb-6">
                <form action="">
                  <div className="flex space-x-3 w-full ">
                    <label className="w-full block mt-4 text-sm flex justify-between space-x-3 items-center">
                      <span className="text-gray-700 dark:text-gray-400">
                        Date
                      </span>
                      <input
                        name="datetimes"
                        defaultValue="01/01/2018 - 01/15/2018"
                        className="w-full block mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        placeholder="date end"
                      />
                    </label>
                    <label className="w-full block mt-4 text-sm flex justify-between space-x-3 items-center">
                      <span className="text-gray-700 dark:text-gray-400">
                        Enterprise
                      </span>
                      <select className="w-full block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                        <option>Enterprise</option>
                        <option>Enterprise</option>
                        <option>Enterprise</option>
                        <option>Enterprise</option>
                      </select>
                    </label>
                    <label className="w-full block mt-4 text-sm flex justify-between space-x-3 items-center">
                      <span className="text-gray-700 dark:text-gray-400">
                        State
                      </span>
                      <select className="w-full block mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                        <option>State</option>
                        <option>State</option>
                        <option>State</option>
                        <option>State</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      // onClick={(event) => {
                      //   event.preventDefault();
                      //   reportApi(event);
                      //   deviceApi(event);
                      //   usageApi(event);
                      // }}
                      className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-2">
              <div className="grid gap-6  md:grid-cols-2 xl:grid-cols-2">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
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
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Gateway
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {deviceNum.totalGateway}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#009809"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Optimizers
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {deviceNum.totalOptimizer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ff721d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Customer
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {deviceNum.totalCustomer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <div className="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#d0021b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11.5" cy="8.5" r="5.5" />
                      <path d="M11.5 14v7" />
                    </svg>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      States
                    </p>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      {deviceNum.state}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 text-center relative">
                  {/* <div className="wrapper-center">
                    <div className="progress-bar">
                      <svg
                        className="progress"
                        data-progress={20}
                        x="0px"
                        y="0px"
                        viewBox="0 0 80 80"
                      >
                        <path
                          className="track"
                          d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0"
                        />
                        <path
                          className="fill"
                          d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0"
                        />
                        <text className="value" x="50%" y="55%">
                          0%
                        </text>
                        <text className="text" x="50%" y="115%">
                          HTML
                        </text>
                      </svg>
                    </div>
                  </div> */}

                  <div className="wrapper-center">
                    <div
                      style={{
                        marginBottom: "20px",
                        width: "40%",
                        height: "40%",
                      }}
                    >
                      <CircularProgressbar
                        value={percentage}
                        text={`${percentage}%`}
                        strokeWidth={4}
                        styles={{
                          path: {
                            stroke: `#056afc`,
                          },
                          trail: {
                            stroke: "#454545",
                          },
                          text: {
                            fill: "#056afc",
                          },
                        }}
                      />
                    </div>
                  </div>

                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Power Saved This Month
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-2">
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
                  Carbon Reduction
                </h4>
                {/* <canvas id="line"></canvas> */}
                <canvas ref={lineChartRef} id="LineChart" />
              </div>
              <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
                  Month On Month Power Savings
                </h4>
                {/* <canvas id="powersaving"></canvas> */}
                <canvas ref={chartRef} id="myChart" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
