import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EditGateway } from "../../Slices/Enterprise/GatewaySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  clearEdit_gateway_response,
  clearEdit_gateway_error,
} from "../../Slices/Enterprise/GatewaySlice";

function GatewaySSID({ Data, LoctionID }) {
  const dispatch = useDispatch();
  const [ssidValue, setSSIDValue] = useState(Data?.NetworkSSID); // State for SSID
  const [passwordValue, setPasswordValue] = useState(Data?.NetworkPassword); // State for Password
  const [showPassword, setShowPassword] = useState(false);

  const { edit_gateway_response, edit_gateway_error } = useSelector(
    (state) => state.gatewaySlice
  );
  const showToast = (message, type) => {
    toast[type](message, {
      position: "bottom-left",
      autoClose: 3000,
    });
  };
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  useEffect(() => {
    setSSIDValue(Data?.NetworkSSID);
    setPasswordValue(Data?.NetworkPassword);
  }, [Data]);

  useEffect(() => {
    if (edit_gateway_response) {
      showToast(edit_gateway_response.message, "success");
      dispatch(clearEdit_gateway_response());
    }
    if (edit_gateway_error) {
      showToast(edit_gateway_error.message, "error");
      dispatch(clearEdit_gateway_error());
    }
  }, [edit_gateway_response, edit_gateway_error]);

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const data = {
    EnterpriseInfo: LoctionID,
    OnboardingDate: Data.OnboardingDate,
    GatewayID: Data.GatewayID,
    NetworkSSID: ssidValue,
    NetworkPassword: passwordValue,
    EnterpriseUserID: Data.EnterpriseUserID,
  };
  const GatewayId = Data._id;
  function Update() {
    dispatch(EditGateway({ GatewayId, data, header }));
  }

  return (
    <div className="h-full max-w-xl mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <div className="p-6 sm:p-12">
        <div className="w-full">
          <label className="block text-sm">
            <span className="text-gray-700 dark:text-gray-400">SSID</span>
            <input
              className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
              placeholder="SSID"
              value={ssidValue}
              onChange={(e) => setSSIDValue(e.target.value)} // Attach onChange event handler
            />
          </label>
          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">Password</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
                placeholder="*************"
                value={passwordValue}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPasswordValue(e.target.value)} // Attach onChange event handler
              />
              <button
                style={{ backgroundColor: "#7e3af2", height: "35px" }}
                className="  right-0 px-4 py-2   leading-5 text-gray-700 dark:text-gray-400 cursor-pointer focus:outline-none"
                onClick={(e) => handleTogglePassword(e)}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="17"
                    fill="#ffffff"
                    className="bi bi-eye-slash-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="17"
                    fill="#ffffff"
                    className="bi bi-eye-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          {/* You should use a button here, as the anchor is only used for the example */}
          <button
            type="button"
            className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            onClick={Update}
          >
            UPDATE
          </button>

          <hr className="my-6" />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default GatewaySSID;
