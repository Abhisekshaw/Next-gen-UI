import React, { useState, useEffect } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../utils/Loader";
import OptimizerModel from "../../Modals/AddModals/OptimizerModel";
import {
  OptimizerList,
  clearError,
  clearOptimizerResponse,
  clearEditOptimizerResponse,
  clearAddOptimizerResponse,
} from "../../Slices/Enterprise/OptimizerSlice";
import ByPassModal from "../../Modals/AddModals/ByPassModal";
import OptimizerEditModal from "../../Modals/EditModals/OptimizerEditModal";
import { clearDelete_response } from "../../Slices/Enterprise/enterpriseSlice";
import DeleteModal from "../../Modals/DeleteModals/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './customStyles.css'; 

function Optimizer() {
  const dispatch = useDispatch();
  const ENTERPRISENAME = window.localStorage.getItem("ENTERPRISENAME");
  const GATEWAYNAME = window.localStorage.getItem("GATEWAYNAME");
  const STATENAME = window.localStorage.getItem("STATENAME");
  const LOCATIONNAME = window.localStorage.getItem("LOCATIONNAME");
  const GatewayId = window.localStorage.getItem("Gateway_id");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModelOpen, setIsEditModelOpen] = useState(false);
  const [isModalbypass, setIsModalbypass] = useState(false);
  const [optimizerList, setOptimizerList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trigger, setTrigger] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const {
    add_optimizerlist_response,
    edit_optimizer_response,
    optimizer_response,
    optimizer_error,
    loading,
  } = useSelector((state) => state.optimizerSlice);

  const { allDelete_response, allDelete_error } = useSelector(
    (state) => state.enterpriseSlice
  );
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };
  useEffect(() => {
    async function fetchData() {
      if (trigger) {
        dispatch(OptimizerList({ GatewayId, header }));
        setTrigger(false); // Reset trigger to prevent continuous API calls
        showToast(edit_optimizer_response.message, "success");
        dispatch(clearEditOptimizerResponse());
        showToast(add_optimizerlist_response.message, "success");
        dispatch(clearAddOptimizerResponse());
      }
    }

    if (allDelete_response) {
      setTrigger(true);
      showToast(allDelete_response.message, "success");
    }
    dispatch(clearDelete_response());

    fetchData();
  }, [trigger, optimizer_response, allDelete_response]);

  useEffect(() => {
    if (optimizer_error) {
      setErrorMessage(optimizer_error.message);
      dispatch(clearOptimizerResponse());
      setOptimizerList([]);
    }
    if (optimizer_response && optimizer_response.AllEntStateLocationGatewayOptimizer) {
      setErrorMessage("");
      setOptimizerList(optimizer_response.AllEntStateLocationGatewayOptimizer);
    }
  }, [optimizer_response, optimizer_error]);

  const [BypassData, setBypassData] = useState({});

  function bypass(Id, mode) {
    const Data = {
      group: "optimizer",
      id: Id,
      state: mode,
    };
    setBypassData(Data);
    setIsModalbypass(true);
  }

  const handleInputChange = async (item) => {
    setSelectedItem(item);
    window.localStorage.setItem("Optimizer_id", item.OptimizerID);
  };
  const data = {
    GatewayId: GatewayId,
    selectedItem,
  };

  const openModal = () => {
    setIsModalOpen(true);
    window.scrollTo(0, 0);
  };

  const openEditModal = (item) => {
    // handleInputChange(item);
    setSelectedItem(item);
    setIsEditModelOpen(true);
  };

  const openDeleteModal = (item) => {
    const deleteData = {
      group: "optimizer",
      id: item._id,
    };
    setSelectedDeleteItem(deleteData);
    setIsDeleteModelOpen(true);
  };

  const closeModal = () => {
    setIsEditModelOpen(false);
    setIsDeleteModelOpen(false);
    setIsModalOpen(false);
    setIsModalbypass(false);
    setTrigger(true);
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const paginationRange = 1;
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(optimizerList.length / itemsPerPage);

    // Ensure the new page is within valid range
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(optimizerList.length / itemsPerPage); // Set the total number of pages

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
  const clear = () => {
    dispatch(clearOptimizerResponse());
    dispatch(clearError());
    // clearError, clearOptimizerResponse
    setErrorMessage("");
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedData = optimizerList.slice(startIndex, endIndex);

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
                    Add Optimizer
                    <span className="ml-2" aria-hidden="true">
                      +
                    </span>
                  </button>
                  {/* ------------------------------ */}

                  {isModalOpen && (
                    <OptimizerModel
                      Data={data}
                      closeModal={() => closeModal()}
                    />
                  )}

                  {/* ----------------------------------- */}
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <nav
                  className="flex px-5 py-3 text-white bg-purple-600 dark:bg-gray-800 dark:border-gray-700 rounded mb-4"
                  aria-label="Breadcrumb"
                >
                  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                      <Link
                        to="/enterprise"
                        onClick={clear}
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
                        onClick={clear}
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
                    <li className="inline-flex items-center">
                      <Link
                        to="/location"
                        onClick={clear}
                        className="inline-flex items-center text-sm font-medium text-white hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        Location
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
                        to="/gateway"
                        onClick={clear}
                        className="inline-flex items-center text-sm font-medium text-white hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        Gateway
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
                        to="/optimizer"
                        className="inline-flex items-center text-sm font-medium text-white hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        Optimizer
                      </Link>
                    </li>
                  </ol>
                </nav>
              </div>
              <h5
                className=" text-red-500"
                style={{ color: "red", fontWeight: "bold" }}
              >
                {errorMessage}
              </h5>
              <div className="">
                <nav
                  className="flex px-5 py-2 text-gray-700  rounded mb-4"
                  aria-label="Breadcrumb"
                >
                  <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                      <span
                        to="#"
                        className="inline-flex items-center text-sm font-medium text-black hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        {ENTERPRISENAME}
                      </span>
                      <svg
                        className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentcolor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </li>
                    <li className="inline-flex items-center">
                      <span
                        to="#"
                        className="inline-flex items-center text-sm font-medium text-black hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        {STATENAME}
                      </span>
                      <svg
                        className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentcolor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </li>
                    <li className="inline-flex items-center">
                      <span
                        to="#"
                        className="inline-flex items-center text-sm font-medium text-black hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        {LOCATIONNAME}
                      </span>
                      <svg
                        className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentcolor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </li>

                    <li className="inline-flex items-center">
                      <span
                        to="#"
                        className="inline-flex items-center text-sm font-medium text-black hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        {GATEWAYNAME}
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>

              <table className="w-full whitespace-no-wrap">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                    <th className="px-4 py-3">Optimizer ID</th>
                    <th className="px-4 py-3">Optimizer Name</th>
                    <th className="px-4 py-3"> Set ByPass</th>
                    <th className="px-4 py-3">ByPass Status</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                  {displayedData.map((item, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="text-gray-700 dark:text-gray-400"
                    >
                      <td className="px-4 py-3 text-sm">
                        <Link
                          to="/optimizerdetails"
                          onClick={() =>
                            handleInputChange(item, "/optimizerdetails")
                          }
                          className="custom-link"
                        >
                          {item.OptimizerID}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm">
                       
                          {item.OptimizerName}
                       
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.BypassMode === "OFF" || item.BypassMode === "" ? (
                          <div className={`toggle_btn`}>
                            <input
                              type="checkbox"
                              defaultChecked={false}
                              id={`toggle-btn-${rowIndex}`}
                              onClick={() => bypass(item.OptimizerID, true)}
                            />
                            <label htmlFor={`toggle-btn-${rowIndex}`} />
                            {isModalbypass && (
                              <ByPassModal
                                Data={BypassData}
                                closeModal={() => closeModal()}
                              />
                            )}
                          </div>
                        ) : item?.BypassMode === "ON" ? (
                          <div className={`toggle_btn`}>
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              id={`toggle-btn-${rowIndex}`}
                              onClick={() => bypass(item.OptimizerID, false)}
                            />

                            <label htmlFor={`toggle-btn-${rowIndex}`} />
                            {isModalbypass && (
                              <ByPassModal
                                Data={BypassData}
                                closeModal={() => closeModal()}
                              />
                            )}
                          </div>
                        ) : item.BypassMode === "IN_PROGRESS_true" ? (
                          <div className={`toggle_btn`}>
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              id={`toggle-btn-${rowIndex}`}
                              onClick={() => bypass(item.OptimizerID, false)}
                            />

                            <label htmlFor={`toggle-btn-${rowIndex}`} />
                            {isModalbypass && (
                              <ByPassModal
                                Data={BypassData}
                                closeModal={() => closeModal()}
                              />
                            )}
                          </div>
                        ) : (
                          <div className={`toggle_btn`}>
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              id={`toggle-btn-${rowIndex}`}
                              onClick={() => bypass(item.OptimizerID, true)}
                            />

                            <label htmlFor={`toggle-btn-${rowIndex}`} />
                            {isModalbypass && (
                              <ByPassModal
                                Data={BypassData}
                                closeModal={() => closeModal()}
                              />
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {item.BypassMode === "OFF" ||
                        item.BypassMode === "IN_PROGRESS_true" ||
                        item.BypassMode === "IN_PROGRESS_false" ||
                        item.BypassMode === "" ? (
                          <div className={`toggle_btn`}>
                            <input
                              type="checkbox"
                              defaultChecked={false}
                              id={`toggle-btn-2-${rowIndex}`}
                              disabled={true}
                            />
                            <label htmlFor={`toggle-btn-2-${rowIndex}`} />
                          </div>
                        ) : (
                          <div className={`toggle_btn`}>
                            <input
                              type="checkbox"
                              defaultChecked={true}
                              id={`toggle-btn-2-${rowIndex}`}
                              disabled={true}
                            />
                            <label htmlFor={`toggle-btn-2-${rowIndex}`} />
                          </div>
                        )}
                      </td>
                      <td>
                        {item.isOnline === true ? (
                          <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-4 py-2 rounded-full dark:bg-green-900 dark:text-green-300">
                            ONLINE
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-4 py-2 rounded-full dark:bg-red-900 dark:text-red-300">
                            OFFLINE
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => openEditModal(item)}
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
                            <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                          </svg>
                        </button>
                        {isEditModelOpen && (
                          <div
                            className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
                            // onClick={closeModal}
                          >
                            <OptimizerEditModal
                              closeModal={() => closeModal()}
                              Data={data}
                              selectedItem={selectedItem}
                            />
                          </div>
                        )}

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

                        <Link to="/optimizerdetails">
                          <button
                            onClick={() =>
                              handleInputChange(item, "/optimizerdetails")
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

              <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex items-center col-span-3">
                  {`Showing ${startIndex + 1}- ${
                    optimizerList.length
                  } of ${endIndex} `}
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
          autoClose={5000}
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

export default Optimizer;
