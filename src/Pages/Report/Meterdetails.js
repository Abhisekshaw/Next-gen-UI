import React, { useState, useRef } from "react";
import { MeterData, DeviceData, clearmeterDataResponse } from "../../Slices/ReportSlices";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import Loader from "../../utils/Loader";

const Meterdetails = ({selectedEnterprise,selectedCountryState,selectedLocation,selectedGateway, pstartDate, pendDate, settingsComplete}) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState("");
  const [reportData, setReportData] = useState([]);
  const { meterData_response, meterData_error, loading1 } = useSelector(
    (state) => state.reportSlice
  );
  const [timeStamp, setTimeStamp] = useState({
    first: "",
    last: "",
  })

  //Pagination
  const [currentPage, setCurrentPage] = useState({ page: 1, flag: '', PrevTimeStamp: '' });

  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  // State to manage the selected option
  const [selectedOption, setSelectedOption] = useState("Actual");

  // Mapping object for options and their corresponding intervals in seconds
  const optionIntervals = {
    "": 0,
    "Actual": "Actual",
    "15s": "15s",
    "30s": "30s",
    "1 Minute": "1m",
    "5 Minutes": "5m",
    "10 Minutes": "10m",
    "15 Minutes": "15m",
    "30 Minutes": "30m",
    "1 Hour": "1h",
    "2 Hour": "2h",
    "4 Hour": "4h",
    "8 Hour": "8h",
    "12 Hour": "12h",
  };

  // Effect to log the interval when the selected option changes
  let intervalInSeconds = 0;
  useEffect(() => {
    intervalInSeconds = optionIntervals[selectedOption];

  }, [selectedOption, optionIntervals]);


  // Change: Reset currentPage to 1 when Data prop changes
  useEffect(() => {
    setCurrentPage({ page: 1, flag: '', PrevTimeStamp: '' });
  }, [selectedEnterprise,selectedCountryState,selectedLocation,selectedGateway, pstartDate, pendDate, selectedOption, intervalInSeconds]);

  // Array of options
  const options = Object.keys(optionIntervals);


  function handleNextClick(event) {
    event.preventDefault();
    // setCurrentPage((prevPage) => ({ ...prevPage, page: Math.max(prevPage.page + 1, 1), flag: 'Next', PrevTimeStamp: '' }));
    setCurrentPage((prevPage) => {
      const newPage = {
        ...prevPage,
        page: meterData_response.pageReset ? 2 : Math.max(prevPage.page + 1, 1),
        flag: 'Next',
        PrevTimeStamp: ''
      };      
      return newPage;
    });
    // for first and last timestamp

    var elements = document.querySelectorAll('.HiddenTimeStamp');

    // Create an array to store the values
    var values = [];

    // Iterate through the elements and get their values
    elements.forEach(function (element) {
      values.push(element.value);
    });
    setTimeStamp({
      first: values[0],
      last: values[values.length - 1],
    })
  }

  function handlePrevClick(event) {
    event.preventDefault();
    const storedData = window.localStorage.getItem("Prev");

    // Check if storedData is not null or undefined before parsing
    const data = storedData ? JSON.parse(storedData) : [];
    const PrevTimeStamp = filterByInterval(data, intervalInSeconds);
    const num = currentPage.page - 1;
    const TimeStamp = getTimestampByKey(PrevTimeStamp, num);
    // setCurrentPage((prevPage) => ({ ...prevPage, page: Math.max(prevPage.page - 1, 1), flag: 'Prev', PrevTimeStamp: TimeStamp }));
    setCurrentPage((prevPage) => {
      const newPage = {
        ...prevPage,
        page: meterData_response.pageReset ? 2 : Math.max(prevPage.page - 1, 1),
        flag: 'Prev',
        PrevTimeStamp: TimeStamp // Assuming TimeStamp is a variable holding the timestamp value
      };      
      return newPage;
    });
    // for first and last timestamp

    var elements = document.querySelectorAll('.HiddenTimeStamp');

    // Create an array to store the values
    var values = [];

    // Iterate through the elements and get their values
    elements.forEach(function (element) {
      values.push(element.value);
    });
    setTimeStamp({
      first: values[0],
      last: values[values.length - 1],
    })

  }

  function filterByInterval(array, interval) {
    return array.filter(item => item.interval === interval);
  }

  function getTimestampByKey(array, num) {
    let timestamp = null;
    array.forEach(item => {
      if (item.page.hasOwnProperty(num)) {
        timestamp = item.page[num];
      }
    });
    return timestamp;
  }

  useEffect(() => {    
    if(settingsComplete){
      console.log("Meter reloading" + new Date());
      const Page = currentPage;
      const data = {
        Customer: selectedEnterprise,
        Stateid: selectedCountryState,
        Locationid: selectedLocation,
        Gatewayid: selectedGateway,
        startDate: pstartDate,
        endDate: pendDate,
        Interval: intervalInSeconds,
        FirstRef: timeStamp?.first,
        LastRef: timeStamp?.last,
        current_interval: meterData_response?.current_interval,
      };
      dispatch(MeterData({ Page, data, header }));
    }
  }, [currentPage, selectedEnterprise,selectedCountryState,selectedLocation,selectedGateway, pstartDate, pendDate, settingsComplete]);

  useEffect(() => {
    if (meterData_response) {


      if (meterData_response?.flag === "Next") {
        let existingData = JSON.parse(window.localStorage.getItem("Prev")) || [];

        // Add new object to the existing data
        let newData = meterData_response?.pageWiseTimestamp;

        if (newData?.page) {
          let foundIndex = existingData.findIndex(obj => obj.interval === newData.interval);

          if (foundIndex !== -1) {
            // Merge page data if interval matches
            existingData[foundIndex].page = { ...existingData[foundIndex].page, ...newData.page };
          } else {
            // Create a new object and store it in the array
            existingData.push(newData);
          }
        }

        // Store the updated data back into localStorage
        window.localStorage.setItem("Prev", JSON.stringify(existingData));

      }

      setReportData(meterData_response?.response);
      setPage(meterData_response.pagination.page);

      // dispatch(clearmeterDataResponse());
    }
  }, [meterData_response, currentPage]);


  const generateRows = () => {
    return reportData?.map((enterprise) => {
      return enterprise?.State?.map((state) => {
        return state?.location?.map((location) => {
          return location?.gateway?.map((gateways) => {
            return gateways?.GatewayLogs?.map((log) => {
              // Extract date and time from the timestamp
              const timestampInMillis = parseInt(log?.TimeStamp) * 1000;

              // Create a new Date object using the timestamp
              const timestampDate = new Date(timestampInMillis);

              // Format date as "DD-MM-YYYY"
              const formattedDate = `${timestampDate
                .getDate()
                .toString()
                .padStart(2, "0")}-${(timestampDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}-${timestampDate.getFullYear()}`;

              // Format time as "hh:mm:ss A" in GMT
              const formattedTime = timestampDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              });

              return (
                <tr key={log._id}>
                  <td className="px-4 py-3 text-sm">
                    <span className="">{enterprise.EnterpriseName}</span>
                  </td>
                  {/* {state.stateName} */}
                  <td className="px-4 py-3 text-sm">{state.stateName}</td>
                  <td className="px-4 py-3 text-sm">{location.locationName}</td>
                  <td className="px-4 py-3 text-sm">{gateways.GatewayName}</td>
                  <td className="px-4 py-3 text-sm">{formattedDate} </td>
                  <td className="px-4 py-3 text-sm">{formattedTime} </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/electricity-icon-png-4556 (1).png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">{log.KWH}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">{log.KVAH}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">{log.PF}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {log.Phases.Ph1.Voltage}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {log.Phases.Ph1.Current}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {log.Phases.Ph2.Voltage}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {log.Phases.Ph2.Current}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {log.Phases.Ph3.Voltage}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm">
                      <div className="relative hidden  w-4 h-4 mr-2 rounded-full md:block">
                        <img
                          className="object-cover w-full h-full rounded-full"
                          src="assets/img/flash.png"
                          alt=""
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-0 rounded-full shadow-inner"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {log.Phases.Ph3.Current}
                        </p>
                      </div>
                    </div>
                  </td>
                  <input type="hidden" className="HiddenTimeStamp" value={log.TimeStamp}></input>
                </tr>
              );
            });
          });
        });
      });
    });
  };

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

  const handleDownloadMeterData = () => {
    const requestBody = { 
      Customer: selectedEnterprise,
      Stateid: selectedCountryState,
      Locationid: selectedLocation,
      Gatewayid: selectedGateway,
      startDate: pstartDate,
      endDate: pendDate, 
      Interval: intervalInSeconds };
    downloadFile(
      `${process.env.REACT_APP_API}/api/admin/download/all/meterdata/report`,
      requestBody,
      `MeterDataReport_${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })}.csv`
    );
  };

  // Return the function along with other necessary data
  return (
    <>
      {loading1 && <Loader />}
      <div data-tab-content="" className=" px-2 py-4">
        <div className="block opacity-100" id="matadeta" role="tabpanel">
          <div className="flex justify-between items-center">
            <div className="w-56 flex justify-between items-center ">
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
              className="download_btn"
              style={{ position: "sticky", top: "0", zIndex: "1000" }}
            >
              <button
                type="button"
                className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg   "
                onClick={handleDownloadMeterData}
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

          {/* <!-- table data --> */}
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                <th className="px-4 py-3">Enterprise</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Gateway ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">KWH</th>
                <th className="px-4 py-3">KVAH</th>
                <th className="px-4 py-3">PF</th>
                <th className="px-4 py-3">Ph1Voltage</th>
                <th className="px-4 py-3">Ph1Current</th>
                <th className="px-4 py-3">Ph2Voltage</th>
                <th className="px-4 py-3">Ph2Current</th>
                <th className="px-4 py-3">Ph3Voltage</th>
                <th className="px-4 py-3">Ph3Current</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
              {generateRows()}
            </tbody>
          </table>
        </div>

        {/* <!-- device data --> */}

        <div className="block opacity-100" id="matadeta" role="tabpanel">
          <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
            <span className="flex items-center col-span-3">
              {`Page No.  ${page} `}
            </span>
            <span className="col-span-2"></span>
            {/* Pagination  */}

            <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
              <nav aria-label="Table navigation">
                <ul className="inline-flex items-center">
                  <li>
                    <button
                      className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
                      style={{ marginRight: "10px" }}
                      aria-label="Previous"
                      onClick={(event) => {
                        handlePrevClick(event);
                      }}
                    >
                      Prev
                    </button>
                  </li>
                  {/* {renderPaginationButtons()} */}
                  <li>
                    <button
                      className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
                      aria-label="Next"
                      onClick={(event) => {
                        handleNextClick(event);
                      }}
                    >
                      Next
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

export default Meterdetails;