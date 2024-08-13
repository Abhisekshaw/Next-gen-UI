
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EditOptimizer, clearEditOptimizerResponse } from "../../Slices/Enterprise/OptimizerSlice";
import IdleTimer from "../../IdleTimer/IdleTimer";
function OptimizerEditModal({ closeModal, Data }) {
  const dispatch = useDispatch();
  const token = window.localStorage.getItem("token");
  const [optimizerData, setOptimizerData] = useState({
    optimizerId: "",
    optimizerName: "",
    Actonnage: "",
    AcEnergy: "",
    Fan_consumption: "",
  });
  const [sessionTimeout, setSessionTimeout] = useState([]);

  const [errorMessage, setErrorMessage] = useState([]);
  const GatewayId = window.localStorage.getItem("Gateway_id");

  const { status, edit_optimizer_response, edit_optimizer_error, loading } = useSelector(
    (state) => state.optimizerSlice
  );
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  // Function to handle input changes and log values to the console
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOptimizerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {

  // }, [edit_optimizer_response, edit_optimizer_error])


  const OptimizerId = Data.selectedItem.OptimizerID

  const data = {
    GatewayId: GatewayId,
    OptimizerID: OptimizerId,
    OptimizerName: optimizerData.optimizerName,
    ACTonnage: optimizerData.Actonnage.trim(),
    AC_Energy: optimizerData.AcEnergy.trim(),
    Fan_consumption: optimizerData.Fan_consumption.trim(),
  };


  const handleAddClick = async () => {

    dispatch(EditOptimizer({ OptimizerId, data, header }));


  };
  useEffect(() => {


    setOptimizerData({
      optimizerId: Data.selectedItem.OptimizerID,
      optimizerName: Data.selectedItem.OptimizerName,
      Actonnage: Data.selectedItem.ACTonnage,
      AcEnergy: Data.selectedItem.AC_Energy,
      Fan_consumption: Data.selectedItem.Fan_consumption,
    });

    if (edit_optimizer_error) {
      setErrorMessage(edit_optimizer_error);
      setTimeout(() => {
        setErrorMessage([]);
      }, 2000);
    }

    if (edit_optimizer_response.message === "Optimizer Updated successfully.") {
      // dispatch(clearEditOptimizerResponse());
      closeModal();
    }
  }, [edit_optimizer_response, edit_optimizer_error, dispatch])

  useEffect(() => {
    const data = 3000000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);
  return (
    <div
      className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
    // onClick={closeModal}
    //   onKeyDown={closeModal}
    >{sessionTimeout}

      <div
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
        role="dialog"
        onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicking on it
      >
        <header className="flex justify-end">
          <button
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
            aria-label="close"
            onClick={closeModal}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              role="img"
              aria-hidden="true"
            >
              <path
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        </header>

        <div className="mt-4 mb-6">
          <form action="">
            <label className="block mt-4 text-sm w-full">
              <span className="text-gray-700 dark:text-gray-400">
                Gateway Id
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                {Data.GatewayId}
              </span>
            </label>

            <label className="block mt-4 text-sm w-full">
              <span className="text-gray-700 dark:text-gray-400">
                Optimizer Id
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                {Data.selectedItem.OptimizerID}
              </span>
            </label>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Enter Optimizer Name
              </span>
              <input
                // type="text"
                name="optimizerName"
                value={optimizerData.optimizerName}
                onChange={handleInputChange}
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Optimizer Name"
              />

              {errorMessage.key === "OptimizerName" && (
                <p className="mt-2 text-xs text-red-500"
                  style={{ color: "red" }}>
                  {errorMessage.message}
                </p>
              )}

            </label>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">AC Tonnage</span>
                  <input
                    name="Actonnage"
                    value={optimizerData.Actonnage || ''} // Ensure a default value
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="AC Tonnage"
                  />
                  {errorMessage.key === "ACTonnage" && (
                    <p className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}>
                      {errorMessage.message}
                    </p>
                  )}
                </label>
              </div>
              <div style={{ flex: 1, marginRight: '1rem' }}>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">Energy Consumed by AC (KWH)</span>
                  <input
                    type="text" // Ensure the correct input type
                    name="AcEnergy"
                    value={optimizerData.AcEnergy || ''} // Ensure a default value
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Energy Consumed by AC (KWH)"
                  />
                  {errorMessage.key === "AC_Energy" && (
                    <p className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}>
                      {errorMessage.message}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Fan Consumption(%)
              </span>
              <input
                type="text"
                name="Fan_consumption"
                value={optimizerData.Fan_consumption}
                onChange={handleInputChange}
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="% Consumption"
                pattern="[0-9]*[.,]?[0-9]+"
                title="Please enter a valid float number"
              />
              {errorMessage.key === "Fan_consumption" && (
                <p className="mt-2 text-xs text-red-500"
                  style={{ color: "red" }}>
                  {errorMessage.message}
                </p>
              )}
            </label>


          </form>
        </div>

        <button
          onClick={handleAddClick}
          className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default OptimizerEditModal;
