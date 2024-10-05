import React, { useState, useRef, useEffect } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import UsageTrend from "./UsageTrend";
import MeterDetails from "./Meterdetails";
import Devicedetails from "./DeviceDetails";
import OptimizerOnOff from "./OptimizerOnOff";
import NewReports from "./EnterpriseData";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "daterangepicker";
import $ from "jquery";


function Reports() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    customer: "",
    state: "",
    location: "",
    gatewayId: "",
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userType, setUserType] = useState("meterData");
  const [settingsComplete, setSettingsComplete] = useState(false);

  const [SelectedgatewayName, setSelectedgatewayName] = useState("");
  const [meterDetailsComponent, setMeterDetailsComponent] = useState(null);
  const [deviceDetailsComponent, setDeviceDetailsComponent] = useState(null);
  const [usageTrendComponent, setUsageTrendComponent] = useState(null);
  const dateRangePickerRef = useRef(null); // Create a ref for the input element

  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [selectedCountryState, setSelectedCountryState] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [selectedOptimizer, setSelectedOptimizer] = useState('');
  const [errors, setErrors] = useState({ country: false, state: false, city: false, optimizers: false, dates: false });
  const [formDisabled, setFormDisabled] = useState(false);

  const handleRadioChange = e => {
    setUserType(e.target.value);
  }

  const lockUnlockSettings = (event) => {

    const newErrors = {
      country: selectedEnterprise === '',
      state: selectedCountryState === '',
      location: selectedLocation === '',
      gateway: selectedGateway === '',
      startDate: startDate === '',
      endDate: endDate === ''
    };
    // meterData usageTrend deviceData    
    setErrors(newErrors);
    if ((newErrors.country || newErrors.state || newErrors.location || newErrors.gateway || newErrors.endDate || newErrors.startDate)) {
      newErrors.message = "Country, State, Location, Gateway, Date is required. Did you forget to apply the dates"
    }

    if (!newErrors.message) {
      if (formDisabled) {
        setFormDisabled(false);
        setSettingsComplete(false);
      } else {
        setFormDisabled(true);
        setSettingsComplete(true);
      }
    }
  }

  // Date and Time  
  useEffect(() => {
    setTimeout(() => {
      if (dateRangePickerRef.current) {
        $(dateRangePickerRef.current).daterangepicker({
          timePicker: true,
          startDate: moment().startOf('hour'),
          endDate: moment().startOf('hour').add(32, 'hour'),
          locale: {
            format: 'M/DD/YYYY hh:mm A',
          },
        });

        $(dateRangePickerRef.current).on('apply.daterangepicker', (ev, picker) => {
          const start = picker.startDate.format('M/DD/YYYY hh:mm:ss A');
          const end = picker.endDate.format('M/DD/YYYY hh:mm:ss A');
          setStartDate(start);
          setEndDate(end);
        });
      }
    }, 100); // Small delay to ensure DOM is fully ready

    return () => {
      if ($(dateRangePickerRef.current).data('daterangepicker')) {
        $(dateRangePickerRef.current).data('daterangepicker').remove();
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenuList />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />
        <main className="h-full overflow-y-auto">
          <div className="container grid px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Reports
            </h2>

            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs relative">
              {errors.message && <span style={{ color: 'red' }}>{errors.message}</span>}
              <form action="" id="report_form">

                <NewReports selectedEnterprise={selectedEnterprise} selectedCountryState={selectedCountryState} selectedLocation={selectedLocation} selectedGateway={selectedGateway} selectedOptimizer={selectedOptimizer}
                  setSelectedEnterprise={setSelectedEnterprise} setSelectedLocation={setSelectedLocation} setSelectedCountryState={setSelectedCountryState} setSelectedGateway={setSelectedGateway} setSelectedOptimizer={setSelectedOptimizer} formDisabled={formDisabled} />

                <div className="mb-6 flex space-x-3 px-6">
                  <div>
                    <label className="block mt-6 text-sm">
                      <span className="text-gray-700 dark:text-gray-400">
                        Date <span style={{color: 'red'}}> *</span>
                      </span>
                      <input ref={dateRangePickerRef}
                        name="datetimes"
                        className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                        placeholder="date end"
                        disabled={formDisabled}
                      />
                    </label>
                  </div>
                  <div className="block mt-4 text-sm">
                    <label htmlFor="" className="block mt-6 text-sm">
                      <button
                        type="button"
                        onClick={(event) => {
                          lockUnlockSettings();
                        }}
                        className="py-2 px-3 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
                      >
                        {`${formDisabled ? "Edit" : "Finish"}`}
                      </button>
                    </label>
                  </div>
                </div>
                <hr />
                <div className="w-full py-2 px-3 mb-4 mx-auto">
                  <span className="text-gray-700 dark:text-gray-400">
                      Report Type <span style={{color: 'red'}}> *</span>
                  </span>
                  <ul
                    className="relative flex flex-wrap p-1 list-none rounded-xl bg-blue-gray-50/60"
                    data-tabs="tabs"
                    role="list"
                  >
                    <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md w-20">
                      <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                        <input
                          type="radio"
                          className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                          name="userType"
                          defaultValue="meterData" // Corrected value                            
                          onChange={handleRadioChange}
                          checked={userType === "meterData" ? true : false}
                        />
                        <span className="ml-2 text-blue-500">Meter Data</span>
                      </label>
                    </div>

                    <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md ml-2 w-20">
                      <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                        <input
                          type="radio"
                          className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                          name="userType"
                          defaultValue="deviceData" // Corrected value
                          onChange={handleRadioChange}
                        />
                        <span className="ml-2 text-blue-500">
                          Device Data
                        </span>
                      </label>
                    </div>

                    <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md ml-2 w-20">
                      <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                        <input
                          type="radio"
                          className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                          name="userType"
                          defaultValue="usageTrend" // Corrected value                            
                          onChange={handleRadioChange}
                        />
                        <span className="ml-2 text-blue-500">
                          Usage Trend
                        </span>
                      </label>
                    </div>

                    <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md ml-2 w-20">
                      <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                        <input
                          type="radio"
                          className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                          name="userType"
                          defaultValue="optimizerOnOffData" // Corrected value                            
                          onChange={handleRadioChange}
                        />
                        <span className="ml-2 text-blue-500">
                          On Off
                        </span>
                      </label>
                    </div>
                  </ul>
                </div>

              </form>

              <div className="w-full overflow-x-auto">
                <hr />
                {/* <!-- tab --> */}
                <div className="w-2/3">
                  <div className="relative right-0">
                    {/* -------------- */}
                    {userType === "usageTrend" && (
                      <div id="usagediv">
                        <UsageTrend selectedEnterprise={selectedEnterprise} selectedCountryState={selectedCountryState} selectedLocation={selectedLocation} selectedGateway={selectedGateway} selectedOptimizer={selectedOptimizer}
                          pstartDate={startDate} pendDate={endDate} userType={userType} settingsComplete={settingsComplete} />
                      </div>
                    )
                    }

                    {
                      userType === "deviceData" && (
                        <Devicedetails selectedEnterprise={selectedEnterprise} selectedCountryState={selectedCountryState} selectedLocation={selectedLocation} selectedGateway={selectedGateway}
                          pstartDate={startDate} pendDate={endDate} settingsComplete={settingsComplete} />)
                    }


                    {userType === "meterData" && (
                      <MeterDetails selectedCountryState={selectedCountryState} selectedLocation={selectedLocation} selectedGateway={selectedGateway}
                        pstartDate={startDate} pendDate={endDate} selectedEnterprise={selectedEnterprise} settingsComplete={settingsComplete} />
                    )
                    }

                    {userType === "optimizerOnOffData" && (
                      <OptimizerOnOff selectedEnterprise={selectedEnterprise} selectedCountryState={selectedCountryState} selectedLocation={selectedLocation} selectedGateway={selectedGateway} selectedOptimizer={selectedOptimizer}
                        pstartDate={startDate} pendDate={endDate} userType={userType} settingsComplete={settingsComplete} />
                    )
                    }
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

export default Reports;
