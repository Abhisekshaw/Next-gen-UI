import React, { useState, useEffect } from "react";
import LeftMenuList from "../Common/LeftMenuList";
import TopNavbar from "../Common/TopNavbar";
import UserModal from "../Modals/AddModals/UserModal";
import {
  userList,
  clearSystemIntegratorResponse,
  clearEnterpriseResponse,
  clearDeleteResponse,
} from "../Slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../utils/Loader";
import UserDeleteModal from "../Modals/DeleteModals/UserdeleteModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function User() {
  const dispatch = useDispatch();
  const [isModalOpenAddUser, setIsModalOpenAddUser] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [trigger, setTrigger] = useState(true);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

  // // Redux selectors
  const { response, loading } = useSelector((state) => state.userSlice);
  const { delete_response } = useSelector((state) => state.userSlice);
  const { add_SyetemIntegrator, add_enterprise_user } = useSelector(
    (state) => state.userSlice
  );

  // Header for API calls
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  const openDeleteModal = (item) => {
    setSelectedDeleteItem(item._id);
    setIsDeleteModelOpen(true);
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const paginationRange = 1;
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(reportData.length / itemsPerPage);

    // Ensure the new page is within valid range
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(reportData.length / itemsPerPage); // Set the total number of pages

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
  const displayedData = reportData.slice(startIndex, endIndex);
  const openModalAddUser = () => {
    setIsModalOpenAddUser(true);
  };

  // Function to close modals and reset states
  const closeModalAddUser = () => {
    setTrigger(true);
    setIsModalOpenAddUser(false);
    setIsDeleteModelOpen(false);
  };

  //Api Calling
  useEffect(() => {
    if (trigger) {
      dispatch(userList({ header }));
      // Reset trigger to prevent continuous API calls
      setTrigger(false);
    }
  }, [trigger, closeModalAddUser, delete_response, dispatch, header]);

  // Handling API responses
  useEffect(() => {
    if (add_SyetemIntegrator) {
      showToast(add_SyetemIntegrator.data.message, "success");
      dispatch(clearSystemIntegratorResponse());
    }
    if (add_enterprise_user) {
      showToast(add_enterprise_user.data.message, "success");
      dispatch(clearEnterpriseResponse());
    }
    if (delete_response) {
      showToast(delete_response.message, "success");
      dispatch(clearDeleteResponse());
    }
    if (response && Array.isArray(response)) {
      setReportData(response);
    }
  }, [trigger,
    response,
    delete_response,
    dispatch,
    add_SyetemIntegrator,
    add_enterprise_user,
  ]);

  // Function to show toast messages
  const showToast = (message, type) => {
    toast[type](message, {
      position: "bottom-left",
      autoClose: 2000,
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
                  User
                </h2>
                <div className="px-6 my-6">
                  <button
                    //   @click="openModaladduser"

                    onClick={openModalAddUser}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  >
                    Add User
                    <span className="ml-2" aria-hidden="true">
                      +
                    </span>
                  </button>

                  {isModalOpenAddUser && (
                    <div className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
                      {/* <!-- Modal --> */}

                      <UserModal closeModal={() => closeModalAddUser()} />
                    </div>
                  )}
                </div>
              </div>

              {/* <!-- table --> */}

              <div className="w-full overflow-x-auto">
                <table className="w-full whitespace-no-wrap">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                      <th className="px-4 py-3">User Name</th>
                      <th className="px-4 py-3">User Type</th>
                      <th className="px-4 py-3">User Email Id</th>
                      <th className="px-4 py-3">User phone Number</th>
                      <th className="px-4 py-3">enterprise Name</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                    {displayedData.map((item, index) => (
                      <tr
                        className="text-gray-700 dark:text-gray-400"
                        key={index}
                      >
                        <td className="px-4 py-3">{item.username}</td>

                        <td className="px-4 py-3">{item.type}</td>
                        <td className="px-4 py-3 text-sm">{item.email}</td>

                        {item.type === "System-integrator" && (
                          <td className="px-4 py-3 text-sm">
                            <b>+91</b> {item.systemIntegratorId?.phone}
                          </td>
                        )}
                        {item.type === "EnterpriseUser" && (
                          <td className="px-4 py-3 text-sm">
                            <b>+91</b> {item.enterpriseUserId?.phone}
                          </td>
                        )}

                        {item.type === "System-integrator" && (
                          <td className="px-4 py-3">
                            <div className="flex items-center text-sm">
                              <div>
                                <p className="font-semibold">----</p>
                              </div>
                            </div>
                          </td>
                          // -------------------------------------------------------------------------------------------------------
                        )}
                        {item.type === "EnterpriseUser" && (
                          <td className="px-4 py-3">
                            <div className="flex items-center text-sm">
                              <div>
                                <p className="font-semibold">
                                  {item.enterpriseUserId?.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          
                        )}
                        <td className="px-4 py-3 text-sm" >
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
                              <UserDeleteModal
                                closeModal={() => closeModalAddUser()}
                                Id={selectedDeleteItem}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex items-center col-span-3">
                  {`Showing ${startIndex + 1}-${
                    reportData.length
                  } of ${endIndex}`}
                </span>
                <span className="col-span-2"></span>
                {/* Pagination  */}

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

export default User;