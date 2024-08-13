import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddstateList, Addstate, clearAdd_state_error } from "../../Slices/Enterprise/StateSlices";
import IdleTimer from "../../IdleTimer/IdleTimer";

function StateModals({ closeModal }) {
  const dispatch = useDispatch();

  const [getStateList, setgetStateList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [stateId, setStateId] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState([]);
  // const [logoutTimer, setLogoutTimer] = useState(60000); // Timer for logout

  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  const { add_state_error, add_state_response, add_statelist_response } = useSelector((state) => state.stateSlices);


  useEffect(() => {
    dispatch(AddstateList({ header }));
  }, [dispatch]);
  useEffect(() => {
    if (add_statelist_response) {
      setgetStateList(add_statelist_response);
    }
    if (add_state_response) {
      closeModal();
      // dispatch(clearAdd_state_response());
    }


    if (add_state_error) {
      setErrorMessage(add_state_error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      dispatch(clearAdd_state_error());
    }

  }, [dispatch, add_statelist_response, add_state_error, add_state_response, add_state_error, closeModal])

  const handleStoreChange = (event) => {
    setStateId(event.target.value);
  };

  const EnterpriseId = window.localStorage.getItem("Enterprise_Id")

  const data = {
    Enterprise_ID: EnterpriseId,
    State_ID: stateId,
  };

  async function AddState(e) {
    e.preventDefault()
    dispatch(Addstate({ data, header }));

  }
  useEffect(() => {
    const data = 300000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);
  

  return (
    <div className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
      {sessionTimeout}
      <div className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl">
        <header className="flex justify-end">
          <button
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
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
            <label className="block mt-4 text-sm">
              <span className="text-gray-700 dark:text-gray-400">State</span>

              <select
                name="stateId"
                value={stateId}
                onChange={handleStoreChange}
                className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
              >
                <option></option>
                {getStateList && Array.isArray(getStateList) ? (
                  getStateList.map((item) => (

                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  // Handle the case when data is not an array
                  <option value="">No states available</option>
                )}
              </select>
              {errorMessage && (
                <p className="mt-2 text-xs text-red-500" style={{ color: "red" }}>
                  {errorMessage}
                </p>
              )}
            </label>
        <button
          onClick={(e) =>AddState(e)}
          className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Add
        </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StateModals;
