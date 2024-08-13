import React, { useState, useEffect } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import UsageTrend from "./UsageTrend";
import MeterDetails from "./Meterdetails";
import Devicedetails from "./DeviceDetails";
import { useSelector, useDispatch } from "react-redux";
import { enterpriseList } from "../../Slices/Enterprise/enterpriseSlice";
import { stateList, clearResponse } from "../../Slices/Enterprise/StateSlices";
import { locationList, clearLocationResponse } from "../../Slices/Enterprise/LocationSlice";
import { GatewayList, clearGatewaysResponse, } from "../../Slices/Enterprise/GatewaySlice";
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
  const [apply, setApply] = useState(false);
  const [EnterpriseList, setEnterpriseList] = useState([]);
  const [statelist, setStateList] = useState([]);
  const [LocationList, setLocationList] = useState([]);
  const [gatewayList, setGatewayList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userType, setUserType] = useState("");
  const [EnterpriseId, setSelectedEnterpriseId] = useState(""); //this is enterprise id
  const [StateId, setSelectedStateId] = useState(""); //this is state id
  const [LocationId, setSelectedLocationId] = useState(""); //this is Location id
  const [selectedGatewayId, setSelectedGatewayId] = useState(""); //this is Gateway id
  const [SelectedgatewayName, setSelectedgatewayName] = useState("");
  const [meterDetailsComponent, setMeterDetailsComponent] = useState(null);
  const [deviceDetailsComponent, setDeviceDetailsComponent] = useState(null);
  const [usageTrendComponent, setUsageTrendComponent] = useState(null);
  
  const handleRadioChange = (value) => {
    setUserType(value);
  };
  //Id's
  // CUSTOMER ------------------
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  const { customer_response } = useSelector((state) => state.enterpriseSlice);
  const customer = async () => {
    setStateList([]);
    setLocationList([]);
    setGatewayList([]);

    setSelectedStateId("");
    setSelectedLocationId("");
    setSelectedGatewayId("");

    dispatch(clearResponse());
    dispatch(clearLocationResponse());
    dispatch(clearGatewaysResponse());

    dispatch(enterpriseList({ header }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // for customer id
    const selectedEnterprise = EnterpriseList.find(
      (enterprise) => enterprise.EnterpriseName === value
    );

    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedEnterprise && selectedEnterprise._id) {
      // Log the selected enterprise ID
      console.log(selectedEnterprise._id, "enterprise id");
      // Set the selected enterprise ID in the state
      setSelectedEnterpriseId(selectedEnterprise._id);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // STATE--------------------

  const { state_response, loading } = useSelector((state) => state.stateSlices);

  const State = async () => {
    setLocationList([]);
    setGatewayList([]);

    setSelectedLocationId("");
    setSelectedGatewayId("");
    dispatch(clearLocationResponse());
    dispatch(clearGatewaysResponse());

    dispatch(stateList({ EnterpriseId, header }));
  };

  const handleFormChange1 = (e) => {
    const { name, value } = e.target;

    // for customer id
    const selectedState = statelist.find(
      (state) => state.State_ID.name === value
    );

    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedState && selectedState.State_ID._id) {
      // Log the selected enterprise ID
      console.log(selectedState.State_ID._id, "state id");
      // Set the selected enterprise ID in the state
      setSelectedStateId(selectedState.State_ID._id);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // endstate

  //Location
  const { location_response } = useSelector((state) => state.locationSlice);

  const Location = async () => {
    setGatewayList([]);

    setSelectedGatewayId("");
    dispatch(clearGatewaysResponse());

    dispatch(locationList({ EnterpriseId, StateId, header }));
  };

  const handleFormChange2 = (e) => {
    const { name, value } = e.target;

    console.log({LocationList},"*******************");
    // for customer id
    const selectedLocation = LocationList.find(
      (state) => state.LocationName === value
    );
    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedLocation && selectedLocation._id) {
      // Log the selected enterprise ID
      console.log(selectedLocation._id, "location Id");
      // Set the selected enterprise ID in the state
      setSelectedLocationId(selectedLocation._id);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //Gateway

  const { gateway_response } = useSelector((state) => state.gatewaySlice);
  const Gateway = async () => {
    console.log({LocationId},"@@@@@@@@@@@@@@");
    dispatch(GatewayList({ LocationId, header }));
  };

  const handleFormChange3 = (e) => {
    const { name, value } = e.target;

    // for Gateway id
    const selectedGateway = gatewayList.find(
      (item) => item.GatewayID === value
    );

    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedGateway && selectedGateway.GatewayID) {
      // Log the selected enterprise ID

      // Set the selected enterprise ID in the state
      console.log(selectedGateway._id, "Gateway_id");
      setSelectedGatewayId(selectedGateway.GatewayID);
      setSelectedgatewayName(selectedGateway._id);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // End Id's

  useEffect(() => {
    if (customer_response && Array.isArray(customer_response)) {
      setEnterpriseList(customer_response);
    }
    if (state_response && Array.isArray(state_response.AllEntState)) {
      setStateList(state_response.AllEntState);
    }

    if (location_response && location_response.AllEntStateLocation) {
      setLocationList(location_response.AllEntStateLocation);
    }

    if (gateway_response && gateway_response.AllEntStateLocationGateway) {
      setGatewayList(gateway_response.AllEntStateLocationGateway);
    }
  }, [customer_response, state_response, location_response, gateway_response]);

  // Date and Time
  useEffect(() => {
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
        const startDate = picker.startDate.format("M/DD/YYYY hh:mm:ss A");
        const endDate = picker.endDate.format("M/DD/YYYY hh:mm:ss A");
        setStartDate(startDate);
        setEndDate(endDate);
        // console.log({ startDate });
        // console.log({ endDate });
      }
    );
    // Clean up the date range picker when the component unmounts
    return () => {
      $('input[name="datetimes"]')?.data("daterangepicker")?.remove();
    };
  }, []);

  //Api Calling
  const deviceApi = async (event) => {
    event.preventDefault();
    setApply(true);
    const data = {
      enterprise_id: EnterpriseId,
      state_id: StateId,
      location_id: LocationId,
      gateway_id: selectedGatewayId,
      startDate: startDate,
      endDate: endDate,
    };
    const deviceDetailsJSX = <Devicedetails Data={data} />;
    // dispatch(DeviceData({ Page, data, header }));
    setDeviceDetailsComponent(deviceDetailsJSX);
  };

// usage trend
const usageApi = async (event) => {
  event.preventDefault();
  setApply(true);
  const data = {
    enterprise_id: EnterpriseId,
    state_id: StateId,
    location_id: LocationId,
    gateway_id: selectedGatewayId,
    startDate: startDate,
    endDate: endDate,
  };
  const usageDetailsJSX = <UsageTrend Data={data} />;
  // dispatch(DeviceData({ Page, data, header }));
  setUsageTrendComponent(usageDetailsJSX);
};

  //Report Api
  async function reportApi(event) {
    event.preventDefault();
    setApply(true);
    const data = {
      Customer: EnterpriseId,
      Stateid: StateId,
      Locationid: LocationId,
      Gatewayid: SelectedgatewayName,
      startDate: startDate,
      endDate: endDate,
    };

    const meterDetailsJSX = <MeterDetails Data={data} />;

    setMeterDetailsComponent(meterDetailsJSX);
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenuList />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />

        <main className="h-full pb-16 overflow-y-auto">
          <div className="container grid px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Reports
            </h2>
           
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs relative">
              <form action="" id="report_form">
                <div className="mb-6 flex space-x-3 p-3">
                  <label className="block mt-4 text-sm w-56">
                    <span className="text-gray-700 dark:text-gray-400">
                      Customer
                    </span>
                    <select
                      className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                      name="customer"
                      value={formData.customer}
                      onChange={handleFormChange}
                      onFocus={customer}
                    >
                      <option></option>
                      {EnterpriseList.map((enterprise, index) => (
                        <option key={index}>{enterprise.EnterpriseName}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block mt-4 text-sm w-56">
                    <span className="text-gray-700 dark:text-gray-400">
                      State
                    </span>
                    <select
                      className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange1}
                      onFocus={State}
                    >
                      <option></option>
                      {statelist.map((item, index) => (
                        <option key={index}>{item.State_ID.name}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block mt-4 text-sm w-56">
                    <span className="text-gray-700 dark:text-gray-400">
                      Location
                    </span>
                    <select
                      className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange2}
                      onFocus={Location}
                    >
                      <option></option>
                      {LocationList.map((item, index) => (
                        <option key={index}>{item.LocationName}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block mt-4 text-sm w-56">
                    <span className="text-gray-700 dark:text-gray-400">
                      Gateway Id
                    </span>
                    <select
                      className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                      name="gatewayId"
                      value={formData.gatewayId}
                      onChange={handleFormChange3}
                      onFocus={Gateway}
                    >
                      <option></option>
                      {gatewayList.map((item, index) => (
                        <option key={index}>{item.GatewayID}</option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700 dark:text-gray-400">
                        Date
                      </span>

                      <input
                        name="datetimes"
                        defaultValue="01/01/2018 - 01/15/2018"
                        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                        placeholder=" date end"
                      />
                    </label>
                  </div>

                  <label
                    htmlFor=""
                    className="block mt-8 text-sm "
                    style={{ paddingTop: "1%" }}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        reportApi(event);
                        deviceApi(event);
                        usageApi(event);
                      }}
                      className="py-2 px-3 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
                    >
                      Apply
                    </button>
                  </label>
                </div>
                <ul
                      className="relative flex flex-wrap p-1 list-none rounded-xl bg-blue-gray-50/60"
                      data-tabs="tabs"
                      role="list"
                    >
                      <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md">
                        <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                          <input
                            type="radio"
                            className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                            name="userType"
                            defaultValue="meterData" // Corrected value
                            onChange={() => handleRadioChange("meterData")} // Corrected value
                          />
                          <span className="ml-2 text-blue-500">Meter Data</span>
                        </label>
                      </div>

                      <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md ml-2">
                        <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                          <input
                            type="radio"
                            className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                            name="userType"
                            defaultValue="deviceData" // Corrected value
                            onChange={() => handleRadioChange("deviceData")} // Corrected value
                          />
                          <span className="ml-2 text-blue-500">
                            Device Data
                          </span>
                        </label>
                      </div>

                      <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md ml-2">
                        <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                          <input
                            type="radio"
                            className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                            name="userType"
                            defaultValue="deviceData" // Corrected value
                            onChange={() => handleRadioChange("usageTrend")} // Corrected value
                          />
                          <span className="ml-2 text-blue-500">
                            Usage Trend
                          </span>
                        </label>
                      </div>
                    </ul>
              </form>

              <div className="w-full overflow-x-auto">
                {/* <!-- tab --> */}
                <div className="w-2/3">
                  <div className="relative right-0">
                    {/* -------------- */}
                    

                    {/* -----meter data ------ */}
                    {apply && userType === "meterData" && meterDetailsComponent}

                    {userType === "deviceData" && apply && deviceDetailsComponent}

                    {apply && userType === "usageTrend" && usageTrendComponent}
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
