import React, { useEffect, useRef, useState } from "react";
import LeftMenuList from "../../Common/LeftMenuList";
import TopNavbar from "../../Common/TopNavbar";
import "daterangepicker";
import { useSelector, useDispatch } from "react-redux";
import "react-circular-progressbar/dist/styles.css";
import { fetchEnterprises } from "../../Slices/Enterprise/NewEnterpriseDataSlice";
import NewReports from "../Report/EnterpriseData";
function ByPass() {

  const dispatch = useDispatch();
  const { enterprises, loading, error } = useSelector(state => state.enterpriseDataSlice);
  const header = {
    headers: {
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
  };

  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [selectedCountryState, setSelectedCountryState] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [selectedOptimizer, setSelectedOptimizer] = useState('');
  const [formDisabled, setFormDisabled] = useState(false);

// page loading events - start
  
  useEffect(() => {
    dispatch(fetchEnterprises({header})); // Dispatch the async thunk when the component mounts
  }, [dispatch]);

 
  // page loading events - end

  // validation
  const lockUnlockSettings = (event) => {
    const newErrors = {
      country: selectedEnterprise === '',
      state: selectedCountryState === '',
      location: selectedLocation === ''      
    };
    // meterData usageTrend deviceData    
    setErrors(newErrors);
    if ((newErrors.country || newErrors.state || newErrors.location )) {
      newErrors.message = "Country, State, Location is required"
    }

    if (!newErrors.message) {
      if (formDisabled) {
        setFormDisabled(false);
        setSettingsComplete(false);
      } else {
        setFormDisabled(true);
        setSettingsComplete(true);
      }
    }
  }
  // validation end

  // pagination starts
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const paginationRange = 1;

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
        <li key={i}>
          <button
            className={`px-3 py-1 rounded-md ${currentPage === i
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
            className={`px-3 py-1 rounded-md ${currentPage === i
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
  const displayedData = tableData.slice(startIndex, endIndex);
 // pagination ends


 return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <LeftMenuList />
      <div className="flex flex-col flex-1 w-full">
        <TopNavbar />

        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            <div className="flex justify-between items-center">
              <div>
              <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                By Pass
              </h2>
              </div>              
            </div>
            <hr/>
            <div>
              Listing of existing by passes sorted by earliest first
            </div>
            <hr/>
            <div>
              <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200"> Add a new bypass </h2>
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs relative">
              <NewReports selectedEnterprise={selectedEnterprise} selectedCountryState={selectedCountryState} selectedLocation={selectedLocation} selectedGateway={selectedGateway} selectedOptimizer={selectedOptimizer}
                  setSelectedEnterprise={setSelectedEnterprise} setSelectedLocation={setSelectedLocation} setSelectedCountryState={setSelectedCountryState} setSelectedGateway={setSelectedGateway} setSelectedOptimizer={setSelectedOptimizer} formDisabled={formDisabled} hideOptimizer={true} />
            </div>
            </div>            

          </div>
        </main>
      </div>
    </div>
  );
}

export default ByPass;
