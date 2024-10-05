import React, { useState, useEffect, useRef } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import UsageTrend from "./UsageTrend";
import MeterDetails from "./Meterdetails";
import Devicedetails from "./DeviceDetails";
import { useSelector, useDispatch } from "react-redux";
import { fetchEnterprises } from "../../Slices/Enterprise/NewEnterpriseDataSlice";
import { stateList, clearResponse } from "../../Slices/Enterprise/StateSlices";
import { locationList, clearLocationResponse } from "../../Slices/Enterprise/LocationSlice";
import { GatewayList, clearGatewaysResponse, } from "../../Slices/Enterprise/GatewaySlice";
import $ from "jquery";
import moment from "moment";
import 'daterangepicker/daterangepicker.css';
import "daterangepicker";



function NewReports({selectedEnterprise, selectedCountryState, selectedLocation, selectedGateway, selectedOptimizer,  setSelectedEnterprise, setSelectedLocation, setSelectedCountryState, setSelectedGateway, setSelectedOptimizer, formDisabled }) {
    const header = {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        };
    const dispatch = useDispatch();
    const { enterprises, loading, error } = useSelector(state => state.enterpriseDataSlice);

// page loading events - start

useEffect(() => {        
    dispatch(fetchEnterprises({header})); // Dispatch the async thunk when the component mounts
  }, dispatch);


  

// page loading events - end
  const handleEnterpriseChange = (event) => {
    setSelectedEnterprise(event.target.value);
    setSelectedCountryState('');
    setSelectedLocation('');  // Reset state and location and gateway when country changes
    setSelectedGateway('');
    setSelectedOptimizer('');
  };

  const handleCountryStateChange = (event) => {
    setSelectedCountryState(event.target.value);
    setSelectedLocation('');
    setSelectedGateway('');  // Reset gateway and location when state changes
    setSelectedOptimizer('');
  };


  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    setSelectedGateway('');  // Reset gateway when state changes
    setSelectedOptimizer('');
  };

  const handleGatewayChange = (event) => {
    setSelectedGateway(event.target.value);
    setSelectedOptimizer('');
  };

  const handleOptimizerChange = (event) => {
    setSelectedOptimizer(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Get states and cities based on the selected country and state
  const selectedEnterpriseData = enterprises.find(enterprise => enterprise.entepriseId  === selectedEnterprise);
  const countrystates = selectedEnterpriseData ? selectedEnterpriseData.states : [];
  const selectedCountryStateData = countrystates.find(countrystate => countrystate.stateId === selectedCountryState);
  const locations = selectedCountryStateData ? selectedCountryStateData.locations : [];
  const selectedLocationData = locations.find(location => location.locId === selectedLocation);
  const gateways = selectedLocationData ? selectedLocationData.gateways : [];
  const selectedGatewayData = gateways.find(gateway => gateway._id === selectedGateway);
  const optimizers = selectedGatewayData ? selectedGatewayData.optimizers:[];
  const selectedOptimizerData = optimizers.find(optimizer => optimizers._id === selectedOptimizer);

  return (
   
    <div className="mb-6 flex space-x-3 p-3">
        <label className="block mt-4 text-sm w-56">
        <span className="text-gray-700 dark:text-gray-400">
            Customer <span style={{color: 'red'}}> *</span>
        </span>
        <select className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray" 
            name="customer" 
            onChange={handleEnterpriseChange} 
            value={selectedEnterprise}
            disabled={formDisabled} 
            >
            <option value="">Select Enterprise</option>
            {enterprises.map((enterprise) => (
            <option key={enterprise.enterpriseName} value={enterprise.entepriseId}>
                {enterprise.enterpriseName}
            </option>
            ))}
        </select>
        </label>

        <label className="block mt-4 text-sm w-56">
        <span className="text-gray-700 dark:text-gray-400">
            State <span style={{color: 'red'}}> *</span>
        </span>
        <select 
            className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
            name="state" 
            onChange={handleCountryStateChange} 
            value={selectedCountryState} 
            disabled={(formDisabled || !(selectedEnterprise ))}
        >
            <option value="">Select State</option>
            {countrystates.map((countrystate) => (
            <option key={countrystate.stateName} value={countrystate.stateId}>
                {countrystate.stateName}
            </option>
            ))}
        </select>
        </label>

        

        <label className="block mt-4 text-sm w-56">
        <span className="text-gray-700 dark:text-gray-400">
            Location <span style={{color: 'red'}}> *</span>
        </span>
        <select 
            className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
            name="location"  
            onChange={handleLocationChange} 
            value={selectedLocation} 
            disabled={(formDisabled || !(selectedCountryState))}
        >
            <option value="">Select Location</option>
            {locations.map((location) => (
            <option key={location.locId} value={location.locId}>
                {location.locationName}
            </option>
            ))}
        </select>
        
        </label>

        <label className="block mt-4 text-sm w-56">
        <span className="text-gray-700 dark:text-gray-400">
            Gateway Id <span style={{color: 'red'}}> *</span>
        </span>                    
        <select 
            className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
            name="gatewayId" 
            onChange={handleGatewayChange} 
            value={selectedGateway} 
            disabled={(formDisabled || !(selectedLocation))}
            >
            <option value="">Select Gateway</option>
            {gateways.map((gateway) => (
            <option key={gateway.gatewayId} value={gateway._id}>
                {gateway.gatewayId}
            </option>
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
            onChange={handleOptimizerChange} 
            value={selectedOptimizer} 
            disabled={(formDisabled || !(selectedGateway))}
            >
            <option value="">Select Optimizer</option>
            {optimizers.map((optimizer) => (
            <option key={optimizer.id} value={optimizer.id}>
                {optimizer.name}
            </option>
            ))}
        </select>
        </label>
    </div>
      
  );
}

export default NewReports;