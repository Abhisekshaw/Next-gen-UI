import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearError, userLogin } from "../../Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorLog, setErrorLog] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { error } = useSelector((state) => state.authSlice);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };
    dispatch(userLogin({ data, navigate }));
  };

  useEffect(() => {
    if (error) {
      setErrorLog(error);
      setTimeout(() => {
        setErrorLog([]);
      }, 2000);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Handle form submission on pressing Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="login_wrapper">
      <div className="bg-video">
        <img
          src="../assets/img/futuristic-smart-city-with-5g-global-network-technology (1).jpg"
          alt=""
        />
        <div className="p-6 log">
          <div className="h-full max-w-xl mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
            <div className="p-6 sm:p-12">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <form onSubmit={handleSubmit}>
                  <label className="block text-sm">
                    <span className="text-gray-700 dark:text-gray-400">
                      Email
                    </span>
                    <input
                      className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
                      placeholder="abc@email.com"
                      name="email"
                      onChange={handleChange}
                    />
                    {(errorLog.key === "user" || errorLog.key === "email") && (
                      <p
                        className="mt-2 text-xs text-red-500"
                        style={{ color: "red" }}
                      >
                        {errorLog.message}
                      </p>
                    )}
                  </label>
                  <label className="block mt-4 text-sm"  >
                    <span className="text-gray-700 dark:text-gray-400">
                      Password
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        className={`block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
                        placeholder="*************"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        onKeyPress={handleKeyPress}
                      />
                      <button
                        style={{ backgroundColor: '#7e3af2', height: '35px' }}
                        className="  right-0 px-4 py-2   leading-5 text-gray-700 dark:text-gray-400 cursor-pointer focus:outline-none"
                        onClick={handleTogglePassword}
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
                    {errorLog.key === "password" && (
                      <p
                        className="mt-2 text-xs text-red-500"
                        style={{ color: "red" }}
                      >
                        {errorLog.message}
                      </p>
                    )}
                  </label>

                  {/* You should use a button here, as the anchor is only used for the example */}
                  <button
                    type="button"
                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    // href="../index.html"
                    onClick={handleSubmit}
                  >
                    Log In
                  </button>
                </form>

                <hr className="my-6" />

                <div className="">
                  <p className="mt-1">
                    <Link
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      to="./forgot"
                    >
                      Forgot your password?
                    </Link>
                  </p>
                  <p className="mt-1">
                    <Link
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      to="#"
                    >
                      Create account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
