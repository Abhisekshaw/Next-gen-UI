import React, { useState, useEffect } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import { useSelector, useDispatch } from "react-redux";
import { enterpriseList } from "../../Slices/Enterprise/enterpriseSlice";
import { stateList, clearResponse } from "../../Slices/Enterprise/StateSlices";
import { locationList, clearLocationResponse } from "../../Slices/Enterprise/LocationSlice";
import { GatewayList, clearGatewaysResponse } from "../../Slices/Enterprise/GatewaySlice";
import { OptimizerList, clearOptimizerResponse } from "../../Slices/Enterprise/OptimizerSlice";
import "react-toastify/dist/ReactToastify.css";
import OptimizerSettings from "./optimizerSettings";
import GatewaySSID from "./gatewayssid";

function Settings() {
  const dispatch = useDispatch();
  const token = window.localStorage.getItem("token");

  const [formData, setFormData] = useState({
    customer: "",
    state: "",
    location: "",
    gatewayId: "",
    optimizerId: "",
  });

  const [triggerData, setTriggerData] = useState(true);
  const [ssidTrigger, setSsidTrigger] = useState(false);

  const [gatewaySSIDComponent, setGatewaySSIDComponent] = useState(null);
  const [EnterpriseList, setEnterpriseList] = useState([]);
  const [statelist, setStateList] = useState([]);
  const [locationlist, setLocationList] = useState([]);
  const [gatewayList, setGatewayList] = useState([]);
  const [optimizerList, setOptimizerList] = useState([]);
  const [EnterpriseId, setSelectedEnterpriseId] = useState(""); //this is enterprise id
  const [StateId, setSelectedStateId] = useState(""); //this is state id
  const [LocationId, setSelectedLocationId] = useState(""); //this is Location id
  const [GatewayId, setSelectedGatewayId] = useState(""); //this is Gateway id
  const [selectedOptimizerName, setSelectedOptimizerName] = useState(""); //this is Optimizer Name
  const [userType, setUserType] = useState("");
  const handleRadioChange = (value) => {
    // setSsidTrigger(true);
    setUserType(value);
  };

  const [group, setGroup] = useState("");
  const [id, setId] = useState("");

  //Setting Slice
  const { add_getCurentData_response, add_getCurentData_error } = useSelector(
    (state) => state.settingsSlice
  );
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
    setOptimizerList([]);
    setSelectedStateId("");
    setSelectedLocationId("");
    setSelectedGatewayId("");
    dispatch(clearResponse());
    dispatch(clearLocationResponse());
    dispatch(clearGatewaysResponse());
    dispatch(clearOptimizerResponse());

    dispatch(enterpriseList({ header }));
    setSsidTrigger(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // setTriggerData(true);
    // for customer id
    const selectedEnterprise = EnterpriseList.find(
      (enterprise) => enterprise.EnterpriseName === value
    );

    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedEnterprise && selectedEnterprise._id) {
      // Log the selected enterprise ID

      // Set the selected enterprise ID in the state
      setSelectedEnterpriseId(selectedEnterprise._id);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // STATE--------------------

  const { state_response } = useSelector((state) => state.stateSlices);

  const State = async () => {
    setLocationList([]);
    setGatewayList([]);
    setOptimizerList([]);
    setSelectedLocationId("");
    setSelectedGatewayId("");
    dispatch(clearLocationResponse());
    dispatch(clearGatewaysResponse());
    dispatch(clearOptimizerResponse());

    setSsidTrigger(false);
    dispatch(stateList({ EnterpriseId, header }));
  };

  const handleFormChange1 = (e) => {
    const { name, value } = e.target;
    // setTriggerData(true);
    // for customer id
    const selectedState = statelist.find(
      (state) => state.State_ID.name === value
    );

    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedState && selectedState.State_ID._id) {
      // Log the selected enterprise ID

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
    setSsidTrigger(false);
    setGatewayList([]);
    setOptimizerList([]);
    setSelectedGatewayId("");
    dispatch(clearGatewaysResponse());
    dispatch(clearOptimizerResponse());

    dispatch(locationList({ EnterpriseId, StateId, header }));
  };

  const handleFormChange2 = (e) => {
    const { name, value } = e.target;
    // setTriggerData(true);
    // for customer id
    const selectedLocation = locationlist.find(
      (state) => state.LocationName === value
    );

    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedLocation && selectedLocation._id) {
      // Log the selected enterprise ID
      setGroup("location");
      setId(selectedLocation._id);
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
    setOptimizerList([]);
    dispatch(clearOptimizerResponse());
    dispatch(GatewayList({ LocationId, header }));
  };

  const handleFormChange3 = (e) => {
    const { name, value } = e.target;
    // setTriggerData(true);
    setSsidTrigger(true);

    // for Gateway id
    const selectedGateway = gatewayList.find(
      (item) => item.GatewayID === value
    );
    const gatewaySSid = (
      <GatewaySSID Data={selectedGateway} LoctionID={LocationId} />
    );
    setGatewaySSIDComponent(gatewaySSid);
    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedGateway && selectedGateway.GatewayID) {
      // Log the selected enterprise ID
      setGroup("gateway");
      setId(selectedGateway._id);
      // Set the selected enterprise ID in the state
      setSelectedGatewayId(selectedGateway.GatewayID);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
    if (selectedOptimizer && selectedOptimizer._id) {
      // Log the selected enterprise ID
      setGroup("optimizer");
      setId(selectedOptimizer._id);
      // Set the selected enterprise ID in the state
      // setSelectedOptimizerId(selectedOptimizer._id);
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
    if (
      optimizer_response &&
      optimizer_response.AllEntStateLocationGatewayOptimizer
    ) {
      setOptimizerList(optimizer_response.AllEntStateLocationGatewayOptimizer);
      setTriggerData(false);
      dispatch(clearOptimizerResponse());
    }
  }, [
    dispatch,
    customer_response,
    state_response,
    location_response,
    gateway_response,
    optimizer_response,
    add_getCurentData_response,
    add_getCurentData_error,
  ]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenuList />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />

        <main className="h-full pb-16 overflow-y-auto">
          <div className="container grid px-6 mx-auto">
            <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Settings
            </h2>
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs relative">
              <form action="">
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
                      onClick={customer}
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
                      {locationlist.map((item, index) => (
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

                  <label className="block mt-4 text-sm w-56">
                    <span className="text-gray-700 dark:text-gray-400">
                      Optimizer Id
                    </span>
                    <select
                      className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                      name="optimizerId"
                      value={formData.optimizerId}
                      onChange={handleFormChange4}
                      onFocus={Optimizer}
                    >
                      <option></option>

                      {optimizerList.map((item, index) => (
                        <option key={index}>{item.OptimizerID}</option>
                      ))}
                    </select>
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
                        defaultValue="Gateway SSID" // Corrected value
                        onChange={() => handleRadioChange("Gateway SSID")} // Corrected value
                      />
                      <span className="ml-2 text-blue-500">Gateway SSID</span>
                    </label>
                  </div>

                  <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md ml-2">
                    <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                      <input
                        type="radio"
                        className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                        name="userType"
                        defaultValue="Optimizer Settings" // Corrected value
                        onChange={() => handleRadioChange("Optimizer Settings")} // Corrected value
                      />
                      <span className="ml-2 text-blue-500">
                        Optimizer Settings
                      </span>
                    </label>
                  </div>
                </ul>
                {userType === "Gateway SSID" &&
                  ssidTrigger &&
                  gatewaySSIDComponent}

                {userType === "Optimizer Settings" && (
                  <OptimizerSettings
                    Group={group}
                    Id={id}
                    OptimizerId={selectedOptimizerName}
                  />
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
