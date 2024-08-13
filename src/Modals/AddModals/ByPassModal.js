import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bypass, clearError, clearResponse } from "../../Slices/Enterprise/ByPassSlice";
import { useSelector, useDispatch } from "react-redux";
import IdleTimer from "../../IdleTimer/IdleTimer";

const YourComponent = ({ Data, closeModal }) => {
  const dispatch = useDispatch();
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [activeTab, setActiveTab] = useState("instant");
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState([]);


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const { bypass_response, bypass_error } = useSelector(
    (state) => state.byPassSlice
  );
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };


  function scheduleConfirmation(event) {
    if (selectedDateTime === "") {
      alert("Please Select Date&Time");
    } else {
      // Display a confirmation dialog
      var isConfirmed = window.confirm("Do you want to apply?");
    }

    // Check the user's choice
    if (isConfirmed && selectedDateTime !== "") {
      // If the user clicks "OK", perform the apply action
      // alert("Applying...");
      schedule(event);
      // closeModal();
    }
  }
  function schedule(event) {
    event.preventDefault();
    window.localStorage.setItem("Schedule", "Schedule");
    const data = {
      is_schedule: true,
      schedule_time: selectedDateTime,
      state: Data.state,
      group: Data.group,
      id: Data.id,
    };
    dispatch(Bypass({ data, header }));


  }

  function instantConfirmation(event) {
    // Display a confirmation dialog
    var isConfirmed = window.confirm("Do you want to apply?");

    // Check the user's choice
    if (isConfirmed) {
      // If the user clicks "OK", perform the apply action
      // alert("Applying...");
      instant(event);
      // closeModal();
    }
  }

  function instant(event) {
    event.preventDefault();
    window.localStorage.setItem("Instant", "Instant");
    const data = {
      is_schedule: false,
      schedule_time: "",
      state: Data.state,
      group: Data.group,
      id: Data.id,
    };
    dispatch(Bypass({ data, header }));
  }
  useEffect(() => {
    if (bypass_error) {
      setErrorMessage(bypass_error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      dispatch(clearError());
    }
    if (bypass_response) {
      dispatch(clearResponse());
      closeModal();
    }
  }, [bypass_error, bypass_response, closeModal, dispatch])
  //Date & Time

  const handleDateTimeChange = (event) => {
    const newDate = event.target.value;

    // Parse the input date string
    const parsedDate = new Date(newDate);

    // Format the date and time
    const formattedDateTime = `${parsedDate.getMonth() + 1
      }/${parsedDate.getDate()}/${parsedDate.getFullYear()}, ${parsedDate.toLocaleTimeString(
        "en-US"
      )}`;

    setSelectedDateTime(formattedDateTime);
  };
  useEffect(() => {
    const data = 300000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);
  return (
    <div>

      {/* <button onClick={openModalTwo}>Open Modal</button> */}
      <div className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
        {sessionTimeout}
        <div
          className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
          role="dialog"
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
            <h1
              className=" text-red-500"
              style={{ color: "red", fontWeight: "bold" }}
            >
              {errorMessage}
            </h1>
            <ul
              className="relative flex flex-wrap p-1 list-none rounded-xl"
            >
              <li
                className={`z-30 flex-auto text-center ${activeTab === "schedule" ? "active" : ""
                  }`}
              >
                <Link
                  className="z-30 flex items-center justify-center w-full h-full px-3 py-1 mb-0  transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-700 bg-inherit p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTabClick("schedule")}
                >
                  <span className="ml-1 ">Schedule</span>
                </Link>
              </li>

              <li
                className={`z-30 flex-auto text-center ${activeTab === "instant" ? "active" : ""
                  }`}
              >
                <Link
                  className="z-30 flex items-center justify-center w-full px-3 py-1 mb-0 transition-all ease-in-out border-0 rounded-lg cursor-pointer text-slate-700 bg-inherit p-3"
                  onClick={() => handleTabClick("instant")}
                  style={{ cursor: "pointer" }}
                >
                  <span className="ml-1 ">Instant</span>
                </Link>
              </li>
            </ul>
            <div className="px-2 py-4">
              <div
                className={`block opacity-100 ${activeTab === "schedule" ? "" : "hidden"
                  }`}
                role="tabpanel"
              >
                <form>
                  <span className="text-purple-600 dark:text-gray-400">
                    Set Date
                  </span>
                  <input
                    type="datetime-local"
                    name="datetimes"
                    defaultValue="2022-01-01"
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    style={{ display: "block" }}
                    placeholder="date end"
                    onChange={handleDateTimeChange}
                  />

                  <button
                    className="w-full px-5 py-3 mt-4 font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                    onClick={(event) => {
                      event.preventDefault();
                      scheduleConfirmation(event);
                    }}
                  >
                    Apply
                  </button>
                </form>
              </div>
              <div
                className={`block opacity-100 ${activeTab === "instant" ? "" : "hidden"
                  }`}
                role="tabpanel"
              >
                <div className="text-center">
                  <form>
                    <button
                      className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      onClick={(event) => {
                        event.preventDefault();
                        instantConfirmation(event);
                      }}
                    >
                      Apply
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
