import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../utils/Loader";
import Chart from "chart.js/auto";
import axios from "axios";
import AcStatus from "../../Modals/AcStatus";
import {
  TableGraph,
} from "../../Slices/ReportSlices";
import {
  OptimizerList,
  clearOptimizerResponse,
} from "../../Slices/Enterprise/OptimizerSlice";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Tooltip } from 'bootstrap';


const UsageTrends = (Data) => {
  const dispatch = useDispatch();
  const [selectedOptimizerName, setSelectedOptimizerName] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [optimizerList, setOptimizerList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [openModel, setOpenModel] = useState(false)
  const [selectedOption, setSelectedOption] = useState("");
  const [options, setOptions] = useState([]);

  const { tableGraph_response,  loading1 } = useSelector(
    (state) => state.reportSlice
  );
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginationRange = 1;
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    // Ensure the new page is within valid range
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage); // Set the total number of pages

    // Display all buttons if there are less than or equal to 6 pages
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
        <li key={i}>
          <button
            className={`px-3 py-1 rounded-md ${currentPage === i
              ? "text-white bg-purple-600 border border-r-0 border-purple-600"
              : "focus:outline-none focus:shadow-outline-purple"
              }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      ));
    }

    const pages = [];
    const startPage = Math.max(1, currentPage - paginationRange);
    const endPage = Math.min(totalPages, startPage + 2 * paginationRange);
    if (startPage > 1) {
      pages.push(
        <li key={1}>
          <button
            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        </li>
      );

      if (startPage > 2) {
        pages.push(<span key="startEllipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            className={`px-3 py-1 rounded-md ${currentPage === i
              ? "text-white bg-purple-600 border border-r-0 border-purple-600"
              : "focus:outline-none focus:shadow-outline-purple"
              }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="endEllipsis">...</span>);
      }

      pages.push(
        <li key={totalPages}>
          <button
            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = tableData.slice(startIndex, endIndex);

  //hovering
  const tooltipRef = useRef([]);

  useEffect(() => {
    tooltipRef.current.forEach((el, index) => {
      console.log("11");
      if (el) {
        // const tooltip = new Tooltip(el, {
        //   html: true,
        //   title: el.getAttribute('data-bs-original-title').replace(/\n/g, '<br>'),
        //   placement: 'right', // Set the tooltip placement to 'right'
        // });

        // Apply custom styles to tooltip elements
        el.addEventListener('shown.bs.tooltip', () => {
          const tooltipInner = document.querySelector('.tooltip-inner');
          const tooltipArrow = document.querySelector('.tooltip-arrow');

          if (tooltipInner) {
            tooltipInner.style.maxWidth = '400px'; // Increase the width
            tooltipInner.style.padding = '10px 20px';
            tooltipInner.style.fontSize = '16px';
          }

          if (tooltipArrow) {
            tooltipArrow.style.width = '1.5em';
            tooltipArrow.style.height = '0.75em';
          }
        });

        // Cleanup event listeners when component unmounts
        return () => {
          const tooltipInstance = Tooltip.getInstance(el);
          if (tooltipInstance) {
            tooltipInstance.dispose();
          }
        };
      }
    });
  }, [displayedData]);

  const getTooltipTitle = (optimizerID) => {
    const optimizerData = tableGraph_response.data.find((row) => row._id === optimizerID);

    if (optimizerData) {
      return `Optimizer Name: ${optimizerData.OptimizerName}\nAC Tonnage: ${optimizerData.ACTonnage}`;
    } else {
      return 'Default message: No additional message';
    }
  };

  // Function to format time into hrs:min:sec format
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} hrs: ${minutes} min: ${seconds} sec`;
  };

  const parseDate = (dateString) => {
    return new Date(dateString).getTime();
  };

  const startDate = parseDate(Data.Data.startDate);
  const endDate = parseDate(Data.Data.endDate);


  useEffect(() => {
    const calculateDateDifference = () => {
      const msInHour = 1000 * 60 * 60;
      const msInDay = msInHour * 24;
      const msInWeek = msInDay * 7;
      const msInMonth = msInDay * 30; // Approximate month
      const msInYear = msInDay * 365; // Approximate year

      const diff = endDate - startDate;


      if (diff < msInDay) {
        return ["", "Hourly"];
      } else if (diff <= msInWeek) {
        return ["", "Day", "Week"];
      } else if (diff <= msInMonth) {
        return ["", "Day", "Week", "Month"];
      } else if (diff <= msInYear) {
        return ["", "Week", "Month", "Year"];
      } else {
        return ["", "Week", "Month", "Year"];
      }
    };

    const options = calculateDateDifference();
    setOptions(options);
  }, [startDate, endDate]);

  const chartRef = useRef(null);

  // Extracting data from tableData
  useEffect(() => {
    const labels = displayedData.map((row, index) => {
      return selectedOption === "Week"
        ? formatWeekRange(row.StartTime, row.EndTime)
        : formatDate(row.StartTime, selectedOption);
    });

    const thermostatCutoffData = displayedData.map(
      (row) => row.totalCutoffTimeThrm
    );
    const deviceCutoffData = displayedData.map((row) => row.totalCutoffTimeOpt);
    const totalRuntimeSumData = displayedData.map(
      (row) =>
        row.totalRemainingTime +
        row.totalCutoffTimeOpt +
        row.totalCutoffTimeThrm
    );

    const myChart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Thermostat Cutoff(time)",
            backgroundColor: "purple",
            data: thermostatCutoffData,
            borderWidth: 1,
          },
          {
            label: "Device Cutoff(time)",
            backgroundColor: "brown",
            data: deviceCutoffData,
            borderWidth: 1,
          },
          {
            label: "Total Runtime",
            backgroundColor: "#0694a2",
            data: totalRuntimeSumData,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value, index, values) {
                const hours = Math.floor(value / 3600);
                return `${hours}h`;
              },
            },
            title: {
              display: true,
              text: "Time (hours)",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                label += formatTime(context.raw);
                return label;
              },
            },
          },
        },
      },
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => myChart.destroy();
  }, [displayedData]);

  const GatewayId = Data.Data.gateway_id;

  // Optimizer

  const { optimizer_response } = useSelector((state) => state.optimizerSlice);

  const Optimizer = async () => {
    dispatch(OptimizerList({ GatewayId, header }));
  };

  const handleFormChange4 = (e) => {
    const { name, value } = e.target;
    // for Gateway id
    const selectedOptimizer = optimizerList.find(
      (item) => item.OptimizerID === value
    );
    setSelectedOptimizerName(selectedOptimizer.OptimizerID);
    // Check if selectedEnterprise is not undefined before accessing its properties
  };


  // Table, Graph Data
  useEffect(() => {
    async function tableData() {
      const data = {
        Interval: selectedOption,
        startDate: Data.Data.startDate,
        endDate: Data.Data.endDate,
        enterprise_id: Data.Data.enterprise_id,
        state_id: Data.Data.state_id,
        location_id: Data.Data.location_id,
        gateway_id: Data.Data.gateway_id,
        Optimizerid: selectedOptimizerName,
      };
      dispatch(TableGraph({ data, header }));
    }
    if (selectedOption !== "") {
      tableData();
    }
  }, [selectedOption, selectedOptimizerName]);

  // Function to convert Unix timestamp to formatted date string in IST
  const convertUnixToFormattedDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Kolkata", // Set time zone to IST
    });
  };
  // End Id's
  useEffect(() => {
    if (
      optimizer_response &&
      optimizer_response.AllEntStateLocationGatewayOptimizer
    ) {
      setOptimizerList(optimizer_response.AllEntStateLocationGatewayOptimizer);

      dispatch(clearOptimizerResponse());
    }
    if (tableGraph_response) {
      setTableData(tableGraph_response.data);

    }
  }, [dispatch, optimizer_response, tableGraph_response]);

  // Function to format dates based on selected option
  const formatDate = (dateString, option) => {

    const startString = convertUnixToFormattedDate(dateString);

    if (typeof dateString !== 'string') {
      return dateString; // Return as is if it's not a string
    }

    const dateParts = startString.split(", ");
    if (dateParts.length < 3) {
      return startString; // Handle incorrect date format
    }

    const day = dateParts[1].split(" ")[1].slice(0, 2); // Remove the last character
    const month = dateParts[1].split(" ")[0];
    const year = dateParts[2].split(" ")[0];

    if (option === "Day") {
      return `${day} ${month}`; // Format the date for "Day" option
    } else if (option === "Month") {
      return month;
    } else if (option === "Year") {
      return year;
    }

    return dateString;
  };

  // Function to format dates in week
  const formatWeekRange = (startTimestamp, endTimestamp) => {
    // Convert Unix timestamps to formatted date strings
    const startString = convertUnixToFormattedDate(startTimestamp);
    const endString = convertUnixToFormattedDate(endTimestamp);



    // Handle undefined date strings
    if (!startString || !endString) return "";

    // Split the date strings into parts
    const startDateParts = startString.split(", ");
    const endDateParts = endString.split(", ");

    // Handle incorrect date format
    if (startDateParts.length < 3 || endDateParts.length < 3) return "";

    // Extract day and month from start and end dates
    const startDay = startDateParts[1].split(" ")[1]?.slice(0, 2);
    const startMonth = startDateParts[1].split(" ")[0];
    const endDay = endDateParts[1].split(" ")[1]?.slice(0, 2);
    const endMonth = endDateParts[1].split(" ")[0];



    // Return the formatted date range
    return `${startDay} ${startMonth}-${endDay} ${endMonth}`;
  };
  //Download CSV
  const downloadFile = async (url, requestBody, defaultFilename) => {
    try {
      const response = await axios.post(url, requestBody, {
        responseType: "blob",
      });
      const disposition = response.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1]
        : defaultFilename;

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) { }
  };

  const handleDownloadUsageTrendsData = async () => {
    const requestBody = { ...Data.Data, Interval: selectedOption };

    await downloadFile(
      `${process.env.REACT_APP_API}/api/admin/download/all/usagetrend/report`,
      requestBody,
      `DeviceDataReport_${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })}.csv`
    );
  };
  const handleRowClick = (row, index) => {
    // const tooltipInstance = Tooltip.getInstance(tooltipRef.current[index]);
    // if (tooltipInstance) {
    //   tooltipInstance.hide();
    // }
    setSelectedRow(row._id);
    setOpenModel(true);
    // window.location.href = "/AcStatus";
  };
  const closeModal = () => {
    setOpenModel(false);
    setSelectedRow(null);
  };

  return (
    <>
      {loading1 && <Loader />}
      <div role="tabpanel">
        <div className="flex  items-center">
          <div
            className="w-56 flex justify-between items-center "
            style={{ marginLeft: "2%", width: "20%" }}
          >
            <h4 className="classtitle mr-4">Interval</h4>
            <select
              className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {" "}
              <options></options>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div
            className="w-56 flex justify-between items-center"
            style={{ marginLeft: "2%", width: "30%" }}
          >
            <h4 className="classtitle mr-4">Optimizer</h4>
            <select
              className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
              name="optimizerId"
              // value=""
              onChange={handleFormChange4}
              onFocus={Optimizer}
            >
              {" "}
              <option></option>
              {optimizerList.map((item, index) => (
                <option key={index}>{item.OptimizerID}</option>
              ))}
            </select>
          </div>

          <div
            className="download_btn"
            style={{
              position: "sticky",
              top: "0",
              zIndex: "1000",
              display: "flex",
              flexDirection: "column",
              marginLeft: "45%",
            }}
          >
            <button
              type="button"
              className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg   "
              onClick={handleDownloadUsageTrendsData}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a90e2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="grid gap-6 mb-8 "
          style={{ marginTop: "1%", marginLeft: "2%", marginRight: "2%" }}
        >
          <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
            <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
              Energy Saving Trends
            </h4>

            <canvas ref={chartRef} id="myChart" style={{ maxHeight: "95%" }} />
          </div>
        </div>

        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <table className="w-full whitespace-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">{selectedOption}</th>
                <th className="px-4 py-3">OPTIMIZER ID</th>
                <th className="px-4 py-3">Thermostat Cutoff (hrs)</th>
                <th className="px-4 py-3">Device Cutoff (hrs)</th>
                <th className="px-4 py-3">Remaning Runtime(hrs)</th>
                <th className="px-4 py-3">Total Runtime(hrs)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {displayedData.map((row, index) => (
                <tr key={index} className="text-gray-700 dark:text-gray-400">
                  {selectedOption === "Week" ? (
                    <td className="px-4 py-3">
                      {formatWeekRange(row.StartTime, row.EndTime)}
                    </td>
                  ) : (
                    <td className="px-4 py-3">
                      {formatDate(row.StartTime, selectedOption)}
                    </td>
                  )}
                 
                  {selectedOption === "Day" ? (
                    <td
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => handleRowClick(row, index)}

                    >
                      {row._id}{openModel && (<AcStatus
                        data={tableData}
                        id={selectedRow}
                        closeModal={() => closeModal()}
                      />)}
                    </td>
                  ) : (
                    <td
                      ref={(el) => (tooltipRef.current[index] = el)}
                      data-bs-original-title={getTooltipTitle(row._id)}
                      className="px-4 py-3 cursor-pointer"
                    >
                      {row._id}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    {formatTime(row.totalCutoffTimeThrm)}
                  </td>
                  <td className="px-4 py-3">
                    {formatTime(row.totalCutoffTimeOpt)}
                  </td>
                  <td className="px-4 py-3">
                    {formatTime(row.totalRemainingTime)}
                  </td>
                  <td className="px-4 py-3">
                    {formatTime(
                      row.totalRemainingTime +
                      row.totalCutoffTimeOpt +
                      row.totalCutoffTimeThrm
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


          <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
            <span className="flex items-center col-span-3">
              {`Showing ${startIndex + 1}-${endIndex} of ${tableData.length}`}
            </span>
            <span className="col-span-2"></span>
            {/* Pagination  */}

            <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
              <nav aria-label="Table navigation">
                <ul className="inline-flex items-center">
                  <li>
                    <button
                      className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                      aria-label="Previous"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </li>
                  {renderPaginationButtons()}
                  <li>
                    <button
                      className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                      aria-label="Next"
                      disabled={currentPage === 10}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <svg
                        className="w-4 h-4 fill-current"
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </li>
                </ul>
              </nav>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default UsageTrends;
