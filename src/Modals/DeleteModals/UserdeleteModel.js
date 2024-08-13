import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { Delete,clearDelete_response, clearDelete_error } from "../../Slices/Enterprise/enterpriseSlice";
import { userDelete, clearDeleteResponse } from "../../Slices/UserSlice"
import IdleTimer from "../../IdleTimer/IdleTimer";

function UserDeleteModal({ closeModal, Id }) {
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  const [sessionTimeout, setSessionTimeout] = useState([]);

  const { delete_response, delete_error } = useSelector(
    (state) => state.userSlice
  );
  const dispatch = useDispatch();
  async function allDelete() {

    dispatch(userDelete({ Id, header }));
    // closeModal();
  }
  useEffect(() => {
    if (delete_response) {
      dispatch(clearDeleteResponse());
      closeModal();
    }

    if (delete_error) {
      // closeModal();
    }
  }, [delete_response]);
  useEffect(() => {
    const data = 300000;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);
  return (
    <div
      onClick={closeModal}
      // onKeyDown={closeModal}
      className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
    >{sessionTimeout}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
        role="dialog"
        id="modal"
      >
        <header className="flex justify-end">
          <button
            onClick={closeModal}
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:hover:text-gray-700"
            aria-label="close"
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
          <span className="text-gray-700 dark:text-gray-400">
            Are you sure want to Delete?
          </span>
        </div>
        <button
          onClick={closeModal}

          className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          No
        </button>
        <button
          onClick={allDelete}
          className="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
        >
          Yes
        </button>
      </div>
    </div>
  );
}

export default UserDeleteModal;
