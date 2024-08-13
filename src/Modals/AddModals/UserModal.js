import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addEnterpriseList,
  addSystemIntegrator,
  EnterpriseName,
} from "../../Slices/UserSlice";
import { enterpriseList } from "../../Slices/Enterprise/enterpriseSlice";
import IdleTimer from "../../IdleTimer/IdleTimer";


const UserModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  const { customer_response } = useSelector((state) => state.enterpriseSlice);
  const [errorlog, setErrorLog] = useState([]);
  const [userType, setUserType] = useState(""); // State to store the selected user type
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });
  const [enterpriseData, setEnterpriseData] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [enterpriseLists, setEnterpriseList] = useState([]);
  const [sessionTimeout, setSessionTimeout] = useState([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(""); // New state for the selected enterprise ID

  const { add_SyetemIntegrator_error, add_SyetemIntegrator, add_enterprise_user_error, add_enterprise_user } = useSelector((state) => state.userSlice);
  const handleInputEnterpriseChange = (e) => {
    const { name, value } = e.target;
    // Assuming that your enterprise data includes an "EnterpriseId" field
    const selectedEnterprise = enterpriseLists.find(
      (enterprise) => enterprise.EnterpriseName === value
    );

    // Check if selectedEnterprise is not undefined before accessing its properties
    if (selectedEnterprise && selectedEnterprise._id) {
      // Log the selected enterprise ID

      // Set the selected enterprise ID in the state
      setSelectedEnterpriseId(selectedEnterprise._id);
    } else {
      // Handle the case where selectedEnterprise or its _id property is undefined
    }

    setEnterpriseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const data = {
    EnterpriseID: selectedEnterpriseId,
    username: enterpriseData.username,
    email: enterpriseData.email,
    phone: enterpriseData.phone,
  };
  const dataa = {
    username: userData.username,
    email: userData.email,
    phone: userData.phoneNumber,
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const token = window.localStorage.getItem("token");

  const handleAddEnterpriseButtonClick = async (e) => {
    e.preventDefault();
    // Dispatch the async action and wait for it to complete
    dispatch(addEnterpriseList({ data, navigate, header }));
  };

  const handleAddButtonClick = async (e) => {
    e.preventDefault();
    dispatch(addSystemIntegrator({ dataa, navigate, header }));

  };
  useEffect(() => {
    if (add_enterprise_user_error) {
      setErrorLog(add_enterprise_user_error);
      setTimeout(() => {
        setErrorLog([]);
      }, 2000);
    }
    if (add_SyetemIntegrator_error) {
      setErrorLog(add_SyetemIntegrator_error);
      setTimeout(() => {
        setErrorLog([]);
      }, 2000);
    }
    if (add_enterprise_user || add_SyetemIntegrator) {
      closeModal();
    }

  }, [dispatch, add_SyetemIntegrator_error, add_enterprise_user_error, add_SyetemIntegrator, add_enterprise_user])

  const handleRadioChange = (value) => {
    setUserType(value);
  };
  async function Enterprise_List() {
    dispatch(enterpriseList({ header }));
  }
  useEffect(() => {

    if (customer_response && Array.isArray(customer_response)) {
      setEnterpriseList(customer_response);
    }
    // Enterprise_List();
  }, [customer_response, handleAddEnterpriseButtonClick, handleAddButtonClick, dispatch]);
  useEffect(() => {
    const data = 300000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);
  return (
    /* Your modal JSX code here */
    <>
      {sessionTimeout}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
        role="dialog"
        id="modal"
      >
        <header className="flex justify-end">
          <button
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
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

        {/* <!-- Modal body --> */}

        <div className="mt-4 mb-6">
          {/* <!-- Modal title --> */}
          <p className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300"></p>
          {/* <!-- Modal description --> */}

          <form action="">
            {/* <!-- radio button --> */}
            <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md">
              <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  name="userType"
                  value="enterpriseUser" // Corrected value
                  onChange={() => handleRadioChange("enterpriseUser")} // Corrected value
                />
                <span className="ml-2 text-blue-500">Enterprise User</span>
              </label>
            </div>

            <div className="inline-block bg-blue-100 dark:bg-purple-600 p-2 rounded-md shadow-md ml-2">
              <label className="inline-flex items-center text-gray-600 dark:text-gray-400">
                <input
                  type="radio"
                  className="text-purple-600 form-radio focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  name="userType"
                  value="systemIntegrator" // Corrected value
                  onChange={() => handleRadioChange("systemIntegrator")} // Corrected value
                />
                <span className="ml-2 text-blue-500">System Integrator</span>
              </label>
            </div>

            {userType === "systemIntegrator" && (
              <div className="form_area system ">
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    User Name
                  </span>
                  <input
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Add User Name"
                  />
                  {errorlog.key === "username" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorlog.message}
                    </p>
                  )}
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Email Id
                  </span>
                  <input
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    type="email" // Specify the input type as 'email'
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Add Email Address"
                  />
                  {errorlog.key === "email" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorlog.message}
                    </p>
                  )}
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Phone Number
                  </span>
                  <input
                    name="phoneNumber"
                    value={userData.phone}
                    onChange={handleInputChange}
                    type="text"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Add Phone Number"
                  />
                  {errorlog.key === "phone" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorlog.message}
                    </p>
                  )}
                </label>
                <button
                  onClick={handleAddButtonClick}
                  className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Add
                </button>
              </div>
            )}

            {userType === "enterpriseUser" && (
              <div className="form_area user_field ">
                <label className="block mt-4 text-sm ">
                  <span className="text-gray-700 dark:text-gray-400">
                    Enterprise
                  </span>
                  <select
                    name="username"
                    value={enterpriseData.username}
                    onChange={handleInputEnterpriseChange}
                    id="enterpriseSelect"
                    onFocus={Enterprise_List}
                    className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                  >
                    <option></option>
                    {enterpriseLists.map((enterprise, index) => (
                      <option key={index}>{enterprise.EnterpriseName}</option>
                    ))}
                  </select>
                  {errorlog.key === "username" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorlog.message}
                    </p>
                  )}
                </label>
                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Email Id
                  </span>
                  <input
                    name="email"
                    value={enterpriseData.email}
                    onChange={handleInputEnterpriseChange}
                    type="email" // Specify the input type as 'email'
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Add Email Address"
                  />
                  {errorlog.key === "email" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorlog.message}
                    </p>
                  )}
                </label>

                <label className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400">
                    Phone Number
                  </span>
                  <input
                    name="phone"
                    value={enterpriseData.phone}
                    onChange={handleInputEnterpriseChange}
                    type="text"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Add Phone Number"
                  />
                  {errorlog.key === "phone" && (
                    <p
                      className="mt-2 text-xs text-red-500"
                      style={{ color: "red" }}
                    >
                      {errorlog.message}
                    </p>
                  )}
                </label>
                <button
                  onClick={handleAddEnterpriseButtonClick}
                  className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                >
                  Add
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default UserModal;
