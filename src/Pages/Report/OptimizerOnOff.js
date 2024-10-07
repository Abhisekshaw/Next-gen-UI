import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more module
import moment from 'moment-timezone';
import Loader from "../../utils/Loader";
import axios from "axios";
import { fetchOnOff, clearGatewaysResponse} from "../../Slices/Enterprise/OptimizerOnOffSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip } from 'bootstrap';
import AcStatus from "../../Modals/AcStatus";
import { fetchEnterprises } from "../../Slices/Enterprise/NewEnterpriseDataSlice";

HighchartsMore(Highcharts); // Initialize the highcharts-more module


const OptimizerOnOff = ({ selectedEnterprise, selectedCountryState, selectedLocation, selectedGateway, selectedOptimizer, pstartDate, pendDate, userType, settingsComplete }) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Day");
  const [filteredOptimizer, setFilteredOptimizer] = useState('');
  const [uniqueOptimizers, setUniqueOptimizers] = useState([]);

  const { enterprises, loading, error } = useSelector(state => state.enterpriseDataSlice);

  const { aconoff,  loading1 } = useSelector((state) => state.aconoffslice);
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  useEffect(() => {
    dispatch(fetchEnterprises({header})); // Dispatch the async thunk when the component mounts
  }, dispatch);

  // -------------handle Pagination Start-----------
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

  // -------------handle Pagination End-----------

  // -------------handle Tooltip Start-----------
  //hovering
  const tooltipRef = useRef([]);

  const getTooltipTitle = (optimizerID) => {
    const optimizerData = aconoff.find((row) => row._id === optimizerID);

    if (optimizerData) {
      return `Optimizer Name: ${optimizerData.OptimizerName}\nAC Tonnage: ${optimizerData.ACTonnage}`;
    } else {
      return 'Default message: No additional message';
    }
  };
 // -------------handle Tooltip End-----------



  // handle table data Date Formatting - start

  // Function to format time into hrs:min:sec format
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} hrs ${minutes} min`;
  };

  // Function to convert Unix timestamp to formatted date string in IST
  const convertUnixToFormattedDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    return moment(date).format('HH:mm:SS')
  };
  // End Id's


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

  // handle table data Date Formatting - End

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

  const handleDownloadOnOffData = async () => {
    // const requestBody = { ...Data, Interval: selectedOption };
    // await downloadFile(
    //   `${process.env.REACT_APP_API}/api/admin/download/all/usagetrend/report`,
    //   requestBody,
    //   `DeviceDataReport_${new Date().toLocaleString("en-US", {
    //     timeZone: "Asia/Kolkata",
    //   })}.csv`
    // );
  };

    // data management - UI - Start
    useEffect(() => {      
      if(userType == "optimizerOnOffData" && settingsComplete){
    
        const data = {
          startDate: pstartDate,
          endDate: pendDate,
          gateway_id: selectedGateway,
          Optimizerid: selectedOptimizer
        };
        dispatch(fetchOnOff({ data, header }));
 
      }
    }, [selectedGateway, selectedOptimizer, pstartDate, pendDate, userType, settingsComplete ]);



    // whe
    useEffect(() => {
      if (!settingsComplete & aconoff.length > 0) {        
        clearGatewaysResponse();
        setUniqueOptimizers([]);
        setFilteredOptimizer('');
        setTableData([]);
      }else if(settingsComplete) {
        // do nothing       
      }
    }, [settingsComplete]);
  
    useEffect(() => {
      if(aconoff.length > 0){
        console.log("aconoff.length: " + aconoff.length);        
        setTableData(aconoff);
        console.log(JSON.stringify(aconoff));
          const uniqueOptimizers = Array.from(
            aconoff.reduce((map, item) => {
              if (!map.has(item._id)) {
                const optimizerDetails = findOptimizerDetails(item.optimizerId)
                map.set(item.optimizerId, {id: optimizerDetails.id, optimizerName: optimizerDetails.name, tonnage: ""});
              }
              return map;
            }, new Map()).values()
          );
          setUniqueOptimizers(uniqueOptimizers);
          // to draw the graph when the result comes for the first time        
          if(!filteredOptimizer){
            setFilteredOptimizer(uniqueOptimizers[0]);
          }
          console.log(JSON.stringify(uniqueOptimizers));
      }
    },[aconoff]);

    // data management - UI - End

    // optimizer data functions
    // show other details of optimizer
    const findOptimizerDetails = (optimizerId) => {
      const selectedEnterpriseData = enterprises.find(enterprise => enterprise.entepriseId  === selectedEnterprise);
      const countrystates = selectedEnterpriseData ? selectedEnterpriseData.states : [];
      const selectedCountryStateData = countrystates.find(countrystate => countrystate.stateId === selectedCountryState);
      const locations = selectedCountryStateData ? selectedCountryStateData.locations : [];
      const selectedLocationData = locations.find(location => location.locId === selectedLocation);
      const gateways = selectedLocationData ? selectedLocationData.gateways : [];
      const selectedGatewayData = gateways.find(gateway => gateway._id === selectedGateway);
      const optimizers = selectedGatewayData ? selectedGatewayData.optimizers:[];
      const opt = optimizers.find(optimizer => optimizer.id === optimizerId);
      return opt;
    } 


  return (
    <>
      {loading1 && <Loader />}
      <div role="tabpanel">
        <div className="w-full flex items-center">
          <div
            className="w-full flex justify-between items-center "
            style={{ marginLeft: "2%" }}
          >
            <h4 className="classtitle mr-4">Optimizers</h4>
            <select
              className="block w-full text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
              value={filteredOptimizer? filteredOptimizer.id : ""}
              onChange={(e) => setFilteredOptimizer(uniqueOptimizers.find(uniqueOptimizers => uniqueOptimizers.id  === e.target.value))}
            >
              <option value="">Choose Interval</option>
              {uniqueOptimizers.map((option, index) => (
                <option key={option.id} value={option.id}>
                  {option.optimizerName }
                </option>
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
              onClick={handleDownloadOnOffData}
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
        <div>
        <div className="w-full py-2 px-3 mb-4 mx-auto">
            <div className="row">
              <div className="col-md-4">
                <div className="card" style={{ background: '#dafedf', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">Optimizer Id</h6>
                    <p className="">{filteredOptimizer?.id}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card" style={{ background: '#fce7ef', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">Optimizer Name</h6>
                    <p className="">{filteredOptimizer?.optimizerName}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card" style={{ background: '#e7f0f8', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">AC Tonage</h6>
                    <p className="">{filteredOptimizer?.tonnage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <AcStatus data={tableData} id={filteredOptimizer? filteredOptimizer.id:""}/> 
        </div>    
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <table className="w-full whitespace-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">{selectedOption}</th>
                <th className="px-4 py-3">Optimizer Id</th>
                <th className="px-4 py-3">Start (hrs)</th>
                <th className="px-4 py-3">End (hrs)</th>
                <th className="px-4 py-3">Total Runtime(hrs)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {displayedData.map((row, index) => (

                <tr key={index} className="text-gray-700 dark:text-gray-400">                  
                  <td>{row.date}</td>
                 
                 <td
                      ref={(el) => (tooltipRef.current[index] = el)}
                      data-bs-original-title={getTooltipTitle(row._id)}
                      className="px-4 py-3 cursor-pointer"
                    >{row.optimizerId}</td>

                  <td className="px-4 py-3">
                    {convertUnixToFormattedDate(row.starttime)}
                  </td>
                  <td className="px-4 py-3">
                    {convertUnixToFormattedDate(row.endtime)}
                  </td>
                  <td className="px-4 py-3">
                    {formatTime(row.duration)}
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

export default OptimizerOnOff;