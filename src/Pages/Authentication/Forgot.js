import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, clearForgotPassError } from "../../Slices/AuthSlice";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Forgot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState("");
  const [errorLog, setErrorLog] = useState([]);

  const data = {
    email: email,
  };
  const {
    error,
    response,
    forgotpass_error,
    forgot_password_data,
    otp_data,
    secret_token_data,
    loading,
  } = useSelector((state) => state.authSlice);
 
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleonchange = (e) => {
    setEmail(e.target.value);

    dispatch(clearForgotPassError());
    setErrorLog([]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(forgotPassword({ data, navigate }));
  };
  useEffect(() => {
    if (response.success == true) {
      setMessage(response.message);
      setOpen(true);
    }
    if (forgotpass_error != null) {
      setErrorLog(forgotpass_error.message);
      setTimeout(() => {
        setErrorLog([]);
      }, 2000);
    }
  }, [forgotpass_error, response]);

  return (
    <>
      {/* <TopNavbar/> */}
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        {/* <LeftMenuList/> */}

        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          {message.length > 0 && (
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="success"
                sx={{ width: "100%" }}
              >
                {message}
              </Alert>
            </Snackbar>
          )}
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src="../assets/img/0b35711f903742a0623698cc9ce7ec65.jpg"
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src="../assets/img/0b35711f903742a0623698cc9ce7ec65.jpg"
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Forgot password
                </h1>
                <form   onSubmit={handleSubmit}>
                <label className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Email
                  </span>
                  <input
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Jane Doe"
                    onChange={handleonchange}
                  />
                  {/* ----------------------------------------------------- */}
                  {errorLog && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorLog}
                    </p>
                  )}
                </label>

                <div
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  onClick={handleSubmit}
                >
                  Recover password
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
