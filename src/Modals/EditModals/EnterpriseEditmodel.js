import React, { useState, useEffect } from "react";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import IdleTimer from "../../IdleTimer/IdleTimer";
import { EditEnterprise, clearEdit_enterprise_response, clearEdit_enterprise_error } from "../../Slices/Enterprise/enterpriseSlice";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EnterpriseEditModal = ({ closeModal, Data }) => {
  
  const dispatch = useDispatch();
  // const [enterpriseList, setEnterpriseList] = useState([]);
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  const { status, edit_enterprise_response, edit_enterprise_error, loading } = useSelector(
    (state) => state.enterpriseSlice
  );
  const EnterpriseId = window.localStorage.getItem("Enterprise_Id");
  const [sessionTimeout, setSessionTimeout] = useState([]);
  const [enterpriseData, setEnterpriseData] = useState({
    EnterpriseName: "",
    Email: "",
    Name: "",
    OnboardingDate: "",
    Phone: "",
  });
  const [errorlog, setErrorLog] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setEnterpriseData({
      EnterpriseName: Data.EnterpriseName,
      Email: Data.ContactInfo.Email,
      Name: Data.ContactInfo.Name,
      OnboardingDate: Data.OnboardingDate,
      Phone: Data.ContactInfo.Phone,
    });
    if (edit_enterprise_response.message == "Enterprise updated successfully.") {
      closeModal();
      // dispatch(clearEdit_enterprise_response());
    }

    if (edit_enterprise_error) {
      closeModal();
      dispatch(clearEdit_enterprise_error());
    }

  }, [edit_enterprise_response, edit_enterprise_error]);


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnterpriseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleAddEnterprise = (e) => {
    e.preventDefault();
    const data = enterpriseData;
    dispatch(EditEnterprise({ EnterpriseId, data, header }));
  }
  useEffect(() => {
    const data = 3000000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);


  return (
    <div
      className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
      role="dialog"
    > {sessionTimeout}
      <header className="flex justify-end">
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <button
          className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
          aria-label="close"
          onClick={() => closeModal()}
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
        {/* Modal title */}
        <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300"></p>
        {/* Modal description */}
        <form action="">

          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
            Enterprise
            </span>
            <input
              name="EnterpriseName"
              value={enterpriseData.EnterpriseName}
              onChange={handleInputChange}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
              placeholder="Primary Contact name"
            />
            {errorlog.key == "Name" && (
              <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                {errorlog.message}
              </p>
            )}
          </label>
          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
            Primary Email Id
            </span>
            <input
              name="Email"
              value={enterpriseData.Email}
              onChange={handleInputChange}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
              placeholder="Primary Email "
            />
            {errorlog.key == "Name" && (
              <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                {errorlog.message}
              </p>
            )}
          </label>
          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
              Primary Contact name
            </span>
            <input
              name="Name"
              value={enterpriseData.Name}
              onChange={handleInputChange}
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
              placeholder="Primary Contact name"
            />
            {errorlog.key == "Name" && (
              <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                {errorlog.message}
              </p>
            )}
          </label>
          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
              Date of Onboarding
            </span>

            <span className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">

              {enterpriseData.OnboardingDate}
            </span>
          </label>
          <label className="block mt-4 text-sm">
            <span className="text-gray-700 dark:text-gray-400">
              Phone Number
            </span>
            <input
              name="Phone"
              value={enterpriseData.Phone}
              onChange={handleInputChange}
              type="text"
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
              placeholder="Add Phone Number"
            />
            {errorlog.key == "Phone" && (
              <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                {errorlog.message}
              </p>
            )}
          </label>
          <button
            onClick={(e) => handleAddEnterprise(e)}
            className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            Update
          </button>
        </form>

      </div>
    </div>
  );
};
export default EnterpriseEditModal;