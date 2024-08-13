import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EditGateway,clearEdit_gateway_response,clearEdit_gateway_error } from "../../Slices/Enterprise/GatewaySlice";
import IdleTimer from "../../IdleTimer/IdleTimer";
function GatewayEditModel({ closeModal, selectedItem, Data }) {
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [GatewayData, setGatewayData] = useState({
    SSID: selectedItem.NetworkSSID,
    PASS: selectedItem.NetworkPassword,
  });
  const [sessionTimeout, setSessionTimeout] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGatewayData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { status, edit_gateway_response, edit_gateway_error, loading } = useSelector(
    (state) => state.gatewaySlice
  );
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  const toggleEditMode = () => {
    // Show alert before enabling edit mode
    const userConfirmed = window.confirm("Are you sure you want to edit?");
    if (userConfirmed) {
      setEditMode(!editMode);
    }
  };
 
  const LocationID = window.localStorage.getItem("Location_id");
  const data = {
    EnterpriseInfo: LocationID,
    OnboardingDate: selectedItem.OnboardingDate,
    GatewayID: selectedItem.GatewayID,
    NetworkSSID: GatewayData.SSID,
    NetworkPassword: GatewayData.PASS,
    EnterpriseUserID: selectedItem.EnterpriseUserID,
  };

  const GatewayId = selectedItem._id;
  function setSSIDPASS(){
    dispatch(EditGateway({ GatewayId,data, header }));
  };
  useEffect(()=>{
    if (edit_gateway_response.message === "Gateway updated successfully.") {
      // dispatch(clearEdit_gateway_response());
       closeModal();
    }
    if (edit_gateway_error) {
      //  closeModal();
      setErrorMessage(edit_gateway_error);
      setTimeout(() => {
        setErrorMessage([]);
      }, 2000);
      dispatch(clearEdit_gateway_error());
    }

  },[edit_gateway_response,edit_gateway_error])

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
      >{sessionTimeout}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
      >
        <div className="mt-4 mb-6">
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
                {Data.Enterprise}
              </span>
            </label>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Enterprise User
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                {Data.EnterpriseUser}
              </span>
            </label>

            <div className="flex w-full space-x-3">
              <label className="block mt-4 text-sm w-full">
                <span className="text-gray-700 dark:text-gray-400">State</span>
                <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                  {Data.State}
                </span>
              </label>

              <label className="block mt-4 text-sm w-full">
                <span className="text-gray-700 dark:text-gray-400">
                  Location
                </span>
                <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                  {Data.Location}
                </span>
              </label>
            </div>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Date of Onboarding
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                {selectedItem.OnboardingDate}
              </span>
            </label>

            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Gateway Id
              </span>
              <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                {selectedItem.GatewayID}
              </span>
            </label>

            {editMode ? (
              <>
                {/* Editable SSID field */}
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">SSID</span>
                  <input
                    type="text"
                    name="SSID"
                    value={GatewayData.SSID}
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                    placeholder="Edit SSID"
                  />
                  {errorMessage.key === "NetworkSSID" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorMessage.message}
                    </p>
                  )}
                </label>

                {/* Editable Password field */}
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Password
                  </span>
                  <input
                    type="text"
                    name="PASS"
                    value={GatewayData.PASS}
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Edit Password"
                  />
                  {errorMessage.key === "NetworkPassword" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorMessage.message}
                    </p>
                  )}
                </label>
              </>
            ) : (
              <>
                {/* Non-editable SSID field */}
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">SSID</span>
                  <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                    {GatewayData.SSID}
                  </span>
                </label>

                {/* Non-editable Password field */}
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Password
                  </span>
                  <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
                    {GatewayData.PASS}
                  </span>
                </label>
              </>
            )}



          </form>
        </div>
        <button
          className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          onClick={setSSIDPASS}
        >
          Update
        </button>
        <button
          className="mt-4 w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
          onClick={toggleEditMode}
        >
          {editMode ? "Cancel Edit" : "Edit"}
        </button>
      </div>
    </div>
  );
}

export default GatewayEditModel;