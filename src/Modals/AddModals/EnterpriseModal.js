import React, { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { Addenterprise, clearEnterprise_Add_error } from "../../Slices/Enterprise/enterpriseSlice";
import 'react-toastify/dist/ReactToastify.css';
import IdleTimer from "../../IdleTimer/IdleTimer";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const EnterpriseModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
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
  const [phonemessage, setphoneMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  const { add_enterprise_response, add_enterprise_error } = useSelector(
    (state) => state.enterpriseSlice
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  //Email Validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Regular expression for basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(newEmail));
  };

  // Phone Validation
  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);

    // Regular expression for basic phone number validation (allowing only 10 digits)
    const phonePattern = /^\d{10}$/;
    setIsValidPhone(phonePattern.test(newPhone));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnterpriseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    dispatch(clearEnterprise_Add_error());
    setErrorLog([]);
  };
  const data = {
    EnterpriseName: enterpriseData.EnterpriseName,
    Email: email,
    Name: enterpriseData.Name,
    OnboardingDate: enterpriseData.OnboardingDate,
    Phone: phone,
  }
  async function handleAddEnterprise(e) {
    e.preventDefault();
    if (isValid && isValidPhone) {
      dispatch(Addenterprise({ data, header }));
    } else if (isValidPhone === false) {
      setphoneMessage("Invalid Phone No.");
      setTimeout(() => {
        setphoneMessage("")
      }, 2000);
    } else {
      setMessage("Invalid Email");
      setTimeout(() => {
        setMessage("")
      }, 2000);
    }
  }
  useEffect(() => {
    if (add_enterprise_error) {
      setErrorLog(add_enterprise_error.response.data);
      setTimeout(() => {
        setErrorLog([]);
      }, 2000);
      dispatch(clearEnterprise_Add_error());
    }
    if (add_enterprise_response) {
      // dispatch(clearAdd_enterprise_response());
      closeModal();
    }
  }, [dispatch, add_enterprise_error, add_enterprise_response, closeModal])
  useEffect(() => {
    const data = 300000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);


  return (
    <>
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
              {/* {message} */}
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
              <span className="text-gray-700 dark:text-gray-400">Enterprise</span>
              <input
                name="EnterpriseName"
                value={enterpriseData.EnterpriseName}
                onChange={handleInputChange}
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Name Of enterprise"
              />
              {errorlog.key === "EnterpriseName" && (
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
                value={email}
                onChange={handleEmailChange}
                type="email" // Specify the input type as 'email'
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Add Email Address"
              />
              {errorlog.key === "email" && (
                <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                  {errorlog.message}
                </p>
              )}
              <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                {message}
              </p>

              {errorlog.key === "Email" && (
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
              {errorlog.key === "Name" && (
                <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                  {errorlog.message}
                </p>
              )}
            </label>
            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Date of Onboarding
              </span>
              <input
                name="OnboardingDate"
                value={enterpriseData.OnboardingDate}
                onChange={handleInputChange}
                type="date"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Address"
              />
              {errorlog.key === "OnboardingDate" && (
                <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                  {errorlog.message}
                </p>
              )}
            </label>
            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Phone Number
              </span>
              <input
                name="Phone"
                value={phone}
                onChange={handlePhoneChange}
                type="text"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                placeholder="Add Phone Number"
              />
              {errorlog.key === "Phone" && (
                <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                  {errorlog.message}
                </p>
              )}
              <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                {phonemessage}
              </p>
            </label>
            <button
              onClick={(e) => { handleAddEnterprise(e) }}
              className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              Add
            </button>
          </form>

        </div>
      </div>

    </>
  );
};
export default EnterpriseModal;
