import React, { useState, useEffect } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import StateModals from "../../Modals/AddModals/StateModals";
import {
  stateList,
  clearResponse,
  clearError,
  clearAdd_state_response,
} from "../../Slices/Enterprise/StateSlices";
import Loader from "../../utils/Loader";
import { clearDelete_response } from "../../Slices/Enterprise/enterpriseSlice";
import DeleteModal from "../../Modals/DeleteModals/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './customStyles.css'; 
function State() {
  const ENTERPRISENAME = window.localStorage.getItem("ENTERPRISENAME");
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statelist, setStateList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [trigger, setTrigger] = useState(true);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  const { status, add_state_response, state_response, state_error, loading } =
    useSelector((state) => state.stateSlices);
  const { allDelete_response, allDelete_error } = useSelector(
    (state) => state.enterpriseSlice
  );

  const EnterpriseId = window.localStorage.getItem("Enterprise_Id");

  useEffect(() => {
    if (trigger) {
      dispatch(stateList({ EnterpriseId, header }));
      setTrigger(false); // Reset trigger to prevent continuous API calls
      showToast(add_state_response.message, "success");
      dispatch(clearAdd_state_response());
    }
    if (allDelete_response) {
      setTrigger(true);
      showToast(allDelete_response.message, "success");
    }
    dispatch(clearDelete_response());
  }, [trigger, allDelete_response, state_response, state_error, dispatch]);

  useEffect(() => {
    if (state_error) {
      setErrorMessage(state_error.message);
      dispatch(clearResponse());
      setStateList([]);
    }
    if (state_response && Array.isArray(state_response.AllEntState)) {
      setErrorMessage("");
      setStateList(state_response.AllEntState);
    }
  }, [state_response, state_error]);

  const clear = () => {
    dispatch(clearResponse());
    dispatch(clearError());
    setErrorMessage("");
  };

  const openDeleteModal = (item) => {
    const deleteData = {
      group: "state",
      id: item._id,
    };
    setSelectedDeleteItem(deleteData);
    setIsDeleteModelOpen(true);
  };

  const handleInputChange = async (Id, StateName) => {
    window.localStorage.setItem("STATENAME", StateName);
    window.localStorage.setItem("State_Id", Id);
    window.location.href = "/location";
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrigger(true);
    setIsDeleteModelOpen(false);
    // showToast(allDelete_response.message, "success");
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const paginationRange = 1;
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(statelist.length / itemsPerPage);

    // Ensure the new page is within valid range
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(statelist.length / itemsPerPage); // Set the total number of pages

    // Display all buttons if there are less than or equal to 6 pages
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
        <li key={i}>
          <button
            className={`px-3 py-1 rounded-md ${
              currentPage === i
                ? "text-white bg-purple-600 border border-r-0 border-purple-600"
                : "focus:outline-none focus:shadow-outline-purple"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      ));
    }

    const pages = [];
    const startPage = Math.max(1, currentPage - paginationRange);
    const endPage = Math.min(totalPages, startPage + 2 * paginationRange);
    if (startPage > 1) {
      pages.push(
        <li key={1}>
          <button
            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={() => handlePageChange(1)}
          >
            1
          </button>
        </li>
      );

      if (startPage > 2) {
        pages.push(<span key="startEllipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i}>
          <button
            className={`px-3 py-1 rounded-md ${
              currentPage === i
                ? "text-white bg-purple-600 border border-r-0 border-purple-600"
                : "focus:outline-none focus:shadow-outline-purple"
            }`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="endEllipsis">...</span>);
      }

      pages.push(
        <li key={totalPages}>
          <button
            className="px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = statelist.slice(startIndex, endIndex);

  // pop-up
  const showToast = (message, type) => {
    toast[type](message, {
      position: "bottom-left",
      autoClose: 3000,
    });
  };

  return (
    <>
      {loading && <Loader />}

      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <LeftMenuList />
        <div className="flex flex-col flex-1 w-full">
          <TopNavbar />

          <main className="h-full overflow-y-auto">
            <div className="container px-6 mx-auto grid">
              <div className="flex justify-between">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Enterprise
                </h2>
                <div className="px-6 my-6">
                  <button
                    onClick={openModal}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  >
                    Add State
                    <span className="ml-2" aria-hidden="true">
                      +
                    </span>
                  </button>
                  {isModalOpen && (
                    <StateModals closeModal={() => closeModal()} />
                  )}
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                {/* Breadcrumb */}
                <nav
                  className="flex px-5 py-3 text-white bg-purple-600 dark:bg-gray-800 dark:border-gray-700 rounded mb-4"
                  aria-label="Breadcrumb"
                >
                  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                      <Link
                        onClick={clear}
                        to="/enterprise"
                        className="inline-flex items-center text-sm font-medium text-white hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        Enterprise
                      </Link>
                      <svg
                        className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </li>
                    <li className="inline-flex items-center">
                      <Link
                        to="/state"
                        className="inline-flex items-center text-sm font-medium text-white hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        State
                      </Link>
                      <svg
                        className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </li>
                  </ol>
                </nav>
                <h5
                  className=" text-red-500"
                  style={{ color: "red", fontWeight: "bold" }}
                >
                  {errorMessage}
                </h5>

                <div
                  className="px-5 py-3"
                  style={{ color: "#444444", fontWeight: "bold" }}
                >
                 {ENTERPRISENAME}
                </div>

                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">State Name</th>
                      <th className="px-4 py-3">No of Location</th>
                      <th className="px-4 py-3">No of Gateway/Optimizer</th>
                      {/* <th className="px-4 py-3">Energy Saved this month</th> */}
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {displayedData?.map((item, index) => (
                      <tr
                        className="text-gray-700 dark:text-gray-400"
                        key={index}
                      >
                        <td className="px-4 py-3">
                          <Link
                            onClick={() =>
                              handleInputChange(
                                item?.State_ID._id,
                                item.State_ID.name
                              )
                            }
                            // to="/location"
                            className="custom-link"
                          >
                            {item?.State_ID.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.data.location}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <p>
                            {item?.data.gateway}/{item?.data.optimizer}
                          </p>
                        </td>
                        {/* <td className="px-4 py-3 text-sm">
                        {item.data.power_save_unit}
                      </td> */}
                        <td>
                          <button
                            className="px-2 py-2 border-2 border-red-600 text-purple-600 rounded-md"
                            onClick={() => openDeleteModal(item)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="red"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                          {isDeleteModelOpen && (
                            <div
                              className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
                              // onClick={closeModal}
                            >
                              <DeleteModal
                                closeModal={() => closeModal()}
                                Data={selectedDeleteItem}
                              />
                            </div>
                          )}
                          <Link>
                            <button
                              onClick={() =>
                                handleInputChange(
                                  item?.State_ID._id,
                                  item.State_ID.name
                                )
                              }
                              className="px-2 py-2 border-2 border-purple-600 text-purple-600 rounded-md"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentcolor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex items-center col-span-3">
                  {`Showing ${startIndex + 1}-${
                    statelist.length
                  } of ${endIndex}`}
                </span>
                <span className="col-span-2"></span>

                <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      <li>
                        <button
                          className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Previous"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                      {renderPaginationButtons()}
                      <li>
                        <button
                          className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                          aria-label="Next"
                          disabled={currentPage === 10}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <svg
                            className="w-4 h-4 fill-current"
                            aria-hidden="true"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                              fillRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </span>
              </div>
            </div>
          </main>
        </div>
        <ToastContainer
          position="bottom-left"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          //  transition: Bounce
        />
      </div>
    </>
  );
}

export default State;
