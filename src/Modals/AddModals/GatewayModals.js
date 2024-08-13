import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GatewayModel, clearGatewayerror } from "../../Slices/Enterprise/GatewaySlice";
import IdleTimer from "../../IdleTimer/IdleTimer";
function GatewayModals({ closeModal, data1 }) {
  const dispatch = useDispatch();
  const [onboardingDate, setOnboardingDate] = useState("");
  const [gatewayId, setGatewayId] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);
  const [sessionTimeout, setSessionTimeout] = useState([]);

  // Function to handle input changes and log values to the console
  const handleInputChange = (e, setStateFunction) => {
    const value = e.target.value;
    setStateFunction(value);
  };

  const EnterpriseId = window.localStorage.getItem("Enterprise_Id");
  const LocationId = window.localStorage.getItem("Location_id");
  const data = {
    EnterpriseInfo: LocationId,
    OnboardingDate: onboardingDate,
    GatewayID: gatewayId.trim(),
    NetworkSSID: "SC20Linux",
    NetworkPassword: "12345678",
    EnterpriseUserID: EnterpriseId,
  };

  const { add_gatewaylist_response, add_gatewaylist_error } =
    useSelector((state) => state.gatewaySlice);
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  async function AddGateway() {
    dispatch(GatewayModel({ data, header }));
  }
  useEffect(() => {
    if (add_gatewaylist_error) {
      setErrorMessage(add_gatewaylist_error);
      setTimeout(() => {
        setErrorMessage([]);
      }, 2000);

      dispatch(clearGatewayerror());
    }
    if (add_gatewaylist_response.message === "Gateway added successfully.") {
      closeModal();
      // dispatch(clearGatewayResponse());
    }
  }, [add_gatewaylist_error, add_gatewaylist_response, dispatch, closeModal]);
  useEffect(() => {
    const data = 300000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);

  return (
    <div
      style={{ maxHeight: "auto", overflowY: "auto" }}
      className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
    // onClick={closeModal}
    // onKeyDown={closeModal}
    > {sessionTimeout}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
      >
        <div className="mt-4 mb-6">
          <p style={{ fontWeight: "bold" }}>Add Gateway</p>
          <form action="">
            <div className="flex justify-end mb-2">

              <button
                className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:hover:text-gray-700"
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
            </div>
            <label className="block mt-4 text-sm">
              <header className="flex justify-end">
              </header>
              <span className="text-gray-700 dark:text-gray-400">
                Enterprise
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                {data1.Enterprise}
              </span>
            </label>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Enterprise User
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                {data1.EnterpriseUser}
              </span>
            </label>

            <div className="flex w-full space-x-3">
              <label className="block mt-4 text-sm w-full">
                <span className="text-gray-700 dark:text-gray-400">State</span>
                <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                  {data1.State}
                </span>
              </label>

              <label className="block mt-4 text-sm w-full">
                <span className="text-gray-700 dark:text-gray-400">
                  Location
                </span>
                <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                  {data1.Location}
                </span>
              </label>
            </div>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Date of Onboarding
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type="date"
                name="onboardingDate"
                value={onboardingDate}
                onChange={(e) => handleInputChange(e, setOnboardingDate)}
              />
              {errorMessage.key === "OnboardingDate" && (
                <p
                  className="mt-2 text-xs text-red-500"
                  style={{ color: "red" }}
                >
                  {errorMessage.message}
                </p>
              )}
            </label>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Enter Gateway Id
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type="text"
                name="gatewayId"
                value={gatewayId}
                onChange={(e) => handleInputChange(e, setGatewayId)}
              />
              {errorMessage.key === "GatewayID" && (
                <p
                  className="mt-2 text-xs text-red-500"
                  style={{ color: "red" }}
                >
                  {errorMessage.message}
                </p>
              )}
            </label>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                SSID
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                SC20Linux
              </span>
            </label>
            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Password
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                12345678
              </span>
            </label>

          </form>
        </div>
        <button
          className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          onClick={AddGateway}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default GatewayModals;
