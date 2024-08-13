import React, { useState, useEffect } from "react";
import {
  GetCurrentData,
  clearCurrentResponse,
} from "../../Slices/SettingsSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearOptimizerResponse } from "../../Slices/Enterprise/OptimizerSlice";

const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          className="absolute bg-black text-white p-2 rounded z-10"
          style={{ width: "175px", textAlign: "center", padding: "5px 0" }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

const OptimizerSettings = ({ Group, Id, OptimizerId }) => {
  const dispatch = useDispatch();
  const [triggerData, setTriggerData] = useState(true);

  // Setting UI

  const [firstPowerOnObservationTime, setFirstPowerOnObservationTime] =
    useState(45);
  const [maxObservatioTime, setMaxObservatioTime] = useState(30);
  const [optimizationOnTime, setOptimizationOnTime] = useState(40);
  const [thermostatMonitoringInterval, setThermostatMonitoringInterval] =
    useState(45);
  const [
    thermostatMonitoringTimeIncrement,
    setThermostatMonitoringTimeIncrement,
  ] = useState(5);
  const [
    steadyStateTimeRoomTempTolerance,
    setSteadyStateTimeRoomTempTolerance,
  ] = useState(1);
  const [steadyStateCoilTempTolerance, setSteadyStateCoilTempTolerance] =
    useState(0.1);

  const { add_getCurentData_response, add_getCurentData_error } = useSelector(
    (state) => state.settingsSlice
  );


  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  const token = window.localStorage.getItem("token");

  const data = {
    group: Group,
    id: Id,
    firstPowerOnObservationTime: firstPowerOnObservationTime * 60,
    maxObservatioTime: maxObservatioTime * 60,
    OptimizationOnTime: optimizationOnTime * 60,
    thermostatMonitoringInterval: thermostatMonitoringInterval,
    thermostatMonitoringTimeIncrement: thermostatMonitoringTimeIncrement,
    steadyStateTimeRoomTempTolerance: steadyStateTimeRoomTempTolerance,
    steadyStateCoilTempTolerance: steadyStateCoilTempTolerance,
  };

  const updateSliderValue = (value, setterFunction) => {
    setterFunction(parseFloat(value));
  };

  const showToast = (message, type) => {
    toast[type](message, {
      position: "bottom-left",
      autoClose: 3000,
    });
  };

  const set = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/hardware/optimizer/setting/value/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success === true) {
        showToast(response.data.message, "success");
        dispatch(clearOptimizerResponse());
      }
    } catch (error) {
      showToast(error.response.data.message, "error");
    }
  };

  const reset = async () => {
    setFirstPowerOnObservationTime(45);
    setMaxObservatioTime(30);
    setOptimizationOnTime(40);
    setThermostatMonitoringInterval(45);
    setThermostatMonitoringTimeIncrement(5);
    setSteadyStateTimeRoomTempTolerance(1);
    setSteadyStateCoilTempTolerance(0.1);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/hardware/reset/optimizer`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success === true) {
        showToast(response.data.message, "success");
        dispatch(clearOptimizerResponse());
      }
    } catch (error) {
      showToast(error.response.data.message, "error");
    }
  };

  const getCurrentData = () => {
    setTriggerData(true);
    dispatch(GetCurrentData({ OptimizerId, header }));
  };

  useEffect(() => {
    if (
      add_getCurentData_response.success === true &&
      add_getCurentData_response.data !== "No previous data"
    ) {
      setTriggerData(true);
      const data = add_getCurentData_response.data;
      showToast(add_getCurentData_response.message, "success");

      setOptimizationOnTime(parseInt(data.OptimizationOnTime) / 60);
      setFirstPowerOnObservationTime(
        parseFloat(data.firstPowerOnObservationTime) / 60
      );
      setMaxObservatioTime(parseInt(data.maxObservatioTime) / 60);
      setThermostatMonitoringInterval(
        parseFloat(data.thermostatMonitoringInterval)
      );
      setThermostatMonitoringTimeIncrement(
        parseFloat(data.thermostatMonitoringTimeIncrement)
      );
      setSteadyStateTimeRoomTempTolerance(
        parseFloat(data.steadyStateTimeRoomTempTolerance)
      );
      setSteadyStateCoilTempTolerance(
        parseFloat(data.steadyStateCoilTempTolerance)
      );
      dispatch(clearCurrentResponse());
    } else {
      if (add_getCurentData_response.data === "No previous data") {
        setTriggerData(true);
        showToast(add_getCurentData_response.data, "error");
      }
      dispatch(clearCurrentResponse());
    }
  }, [add_getCurentData_response, dispatch]);

  return (
    <div className=" bg-white  shadow-xs dark:bg-gray-800 p-4">
      <div className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Add similar sections for other sliders */}
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex"
              htmlFor="firstPowerOnObservationTime"
            >
              First Power On Observation Time in minutes
              <Tooltip text="After First Power On Intenlliserver Active Time in minutes">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0076ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </Tooltip>
            </label>
            <div className="flex justify-between items-center">
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="firstPowerOnObservationTime"
                type="range"
                step="01"
                min="30"
                max="60"
                value={firstPowerOnObservationTime}
                onChange={(e) =>
                  updateSliderValue(
                    e.target.value,
                    setFirstPowerOnObservationTime,
                    "firstPowerOnObservationTime"
                  )
                }
              />
              <b
                style={{ color: "rgb(0, 119, 255)" }}
                htmlFor="firstPowerOnObservationTime"
                id="firstPowerOnObservationTimeOut"
                className="ml-2"
              >
                {firstPowerOnObservationTime}
              </b>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex"
              htmlFor="maxObservatioTime"
            >
              Max Observation Time in minutes
              <Tooltip text="In first Start Up and any other situation Intelliserver Maximum Observation Time in minutes">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0076ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </Tooltip>
            </label>

            <div className="flex justify-between items-center">
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="maxObservatioTime"
                type="range"
                step="01"
                min="10"
                max="30"
                value={maxObservatioTime}
                onChange={(e) =>
                  updateSliderValue(
                    e.target.value,
                    setMaxObservatioTime,
                    "maxObservatioTime"
                  )
                }
              />
              <b
                style={{ color: "rgb(0, 119, 255)" }}
                htmlFor="maxObservatioTime"
                id="maxObservatioTimeOut"
                className="ml-2"
              >
                {maxObservatioTime}
              </b>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex"
              htmlFor="optimizationOnTime"
            >
              Optimization On Time in minutes
              <Tooltip text="When the Thermostat Comming Frequesntly Intelliserver Optimization ON Time in minutes">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0076ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </Tooltip>
            </label>
            <div className="flex justify-between items-center">
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="optimizationOnTime"
                type="range"
                step="01"
                min="40"
                max="90"
                value={optimizationOnTime}
                onChange={(e) =>
                  updateSliderValue(
                    e.target.value,
                    setOptimizationOnTime,
                    "optimizationOnTime"
                  )
                }
              />
              <b
                style={{ color: "rgb(0, 119, 255)" }}
                htmlFor="optimizationOnTime"
                id="optimizationOnTimeOut"
                className="ml-2"
              >
                {optimizationOnTime}
              </b>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex"
              htmlFor="thermostatMonitoringInterval"
            >
              Thermostat Monitoring Interval in seconds
              <Tooltip text="When Thermostat Turn Off the Compressor after 2:45 Min Intelliserver Turn Off Monitoring Interval">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0076ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </Tooltip>
            </label>
            <div className="flex justify-between items-center">
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="thermostatMonitoringInterval"
                type="range"
                step="1"
                min="45"
                max="125"
                value={thermostatMonitoringInterval}
                onChange={(e) =>
                  updateSliderValue(
                    e.target.value,
                    setThermostatMonitoringInterval,
                    "thermostatMonitoringInterval"
                  )
                }
              />
              <b
                style={{ color: "rgb(0, 119, 255)" }}
                htmlFor="thermostatMonitoringInterval"
                id="thermostatMonitoringIntervalOut"
                className="ml-2"
              >
                {thermostatMonitoringInterval}
              </b>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex"
              htmlFor="thermostatMonitoringTimeIncrement"
            >
              Thermostat Monitoring Time Increment in seconds
              <Tooltip text="Thermostate Monitoring Time Increment in seconds ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0076ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </Tooltip>
            </label>
            <div className="flex justify-between items-center">
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="thermostatMonitoringTimeIncrement"
                type="range"
                step="1"
                min="5"
                max="15"
                value={thermostatMonitoringTimeIncrement}
                onChange={(e) =>
                  updateSliderValue(
                    e.target.value,
                    setThermostatMonitoringTimeIncrement,
                    "thermostatMonitoringTimeIncrement"
                  )
                }
              />
              <b
                style={{ color: "rgb(0, 119, 255)" }}
                htmlFor="thermostatMonitoringTimeIncrement"
                id="thermostatMonitoringTimeIncrementOut"
                className="ml-2"
              >
                {thermostatMonitoringTimeIncrement}
              </b>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex"
              htmlFor="steadyStateTimeRoomTempTolerance"
            >
              Steady State Time Room Temperature Tolerance °C
              <Tooltip text="Steady State Time Room Temperature Tolerance °C">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0076ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </Tooltip>
            </label>
            <div className="flex justify-between items-center">
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="steadyStateTimeRoomTempTolerance"
                type="range"
                step="0.1"
                min="0.5"
                max="1.0"
                value={steadyStateTimeRoomTempTolerance}
                onChange={(e) =>
                  updateSliderValue(
                    e.target.value,
                    setSteadyStateTimeRoomTempTolerance,
                    "steadyStateTimeRoomTempTolerance"
                  )
                }
              />
              <b
                style={{ color: "rgb(0, 119, 255)" }}
                htmlFor="steadyStateTimeRoomTempTolerance"
                id="steadyStateTimeRoomTempTolerance"
                className="ml-2"
              >
                {steadyStateTimeRoomTempTolerance}
              </b>
            </div>
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 flex"
              htmlFor="steadyStateCoilTempTolerance"
            >
              STEADY STATE COIL TEMP TOLERANCE °C
              <Tooltip text="Steady State Time Room Temperature Tolerance °C">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0076ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </Tooltip>
            </label>
            <div className="flex justify-between items-center">
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="steadyStateCoilTempTolerance"
                type="range"
                step="0.1"
                min="0.1"
                max="1.0"
                value={steadyStateCoilTempTolerance}
                onChange={(e) =>
                  updateSliderValue(
                    e.target.value,
                    setSteadyStateCoilTempTolerance,
                    "steadyStateCoilTempTolerance"
                  )
                }
              />
              <b
                style={{ color: "rgb(0, 119, 255)" }}
                htmlFor="steadyStateCoilTempTolerance"
                id="steadyStateCoilTempTolerance"
                className="ml-2"
              >
                {steadyStateCoilTempTolerance}
              </b>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="py-2 px-5 mr-3 px-3 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
            onClick={getCurrentData}
          >
            Get Current Data
          </button>
          <button
            type="button"
            className="py-2 px-5 mr-3 px-3 mt-2 focus:outline-none text-gray-500 rounded-lg border-2 border-gray-300 active:bg-purple-600"
            onClick={set}
            disabled={triggerData ? false : true}
            // disabled={true}
          >
            Set
          </button>
          <button
            type="button"
            className="py-2 px-5 mt-2 focus:outline-none text-white rounded-lg bg-purple-600 active:bg-purple-600"
            onClick={reset}
            disabled={triggerData ? false : true}
            // disabled={true}
          >
            Reset
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
export default OptimizerSettings;
