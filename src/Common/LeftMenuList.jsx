import React, { useState, useEffect } from "react";
import logo from "./logo_.png";
import { Link } from "react-router-dom";
import IdleTimer from "../IdleTimer/IdleTimer";
import '../Pages/Enterprise/customStyles.css'; 

function LeftMenuList({ isSideMenuOpen }) {
  const [selectedItem, setSelectedItem] = useState({
    Dashboard: false,
    Report: false,
    Enterprise: false,
    User: false,
    Settings: false,
  }); // State to track the selected item
  const [sessionTimeout, setSessionTimeout] = useState([]);

  const handleItemClick = (itemName) => {
    setSelectedItem((prevSelectedItem) => {
      // Create a new object with all items set to false
      const newSelectedItem = Object.fromEntries(
        Object.keys(prevSelectedItem).map((key) => [key, false])
      );

      // Set the clicked item to true
      newSelectedItem[itemName] = true;

      return newSelectedItem;
    });
  };

  const renderSpanForItem = (itemName) => {
    if (selectedItem[itemName]) {
      return (
        <span
          className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
          aria-hidden="true"
        ></span>
      );
    }
    return null;
  };
  useEffect(() => {
    const data = process.env.REACT_APP_TIME;
    const session = <IdleTimer data={data} />;
    setSessionTimeout(session);
  }, []);

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSideMenuOpen ? "overflow-hidden" : ""
        }`}
    >
      {sessionTimeout}
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <Link
            className=" text-lg font-bold text-gray-800 dark:text-gray-200"
            to="/dashboard"
          >
            <img src={logo} alt="" className="w-56" />
          </Link>
          <ul className="mt-6">
            <li
              className="relative px-6 py-3"
              onClick={() => handleItemClick("Dashboard")}
            >
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 custom-link"
                to="/dashboard"
              >
                {renderSpanForItem("Dashboard")}
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </Link>
            </li>
          </ul>
          <ul>
            <li
              className="relative px-6 py-3"
              onClick={() => handleItemClick("Report")}
            >
              <Link
                to="/report"
                onClick={() => handleItemClick("Report")}
                className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 custom-link ${selectedItem === "Report"
                    ? "text-gray-800 dark:text-gray-200"
                    : ""
                  }`}
              >

                {renderSpanForItem("Report")}
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <span className="ml-4">Report</span>
              </Link>
            </li>

            <li
              className="relative px-6 py-3"
              onClick={() => handleItemClick("Enterprise")}
            >
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 custom-link"
                to="/enterprise"
                onClick={() => handleItemClick("Enterprise")}
              >
                {renderSpanForItem("Enterprise")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="ml-4">Enterprise</span>
              </Link>
            </li>
            <li
              className="relative px-6 py-3"
              onClick={() => handleItemClick("User")}
            >
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 custom-link"
                to="/user"
              >
                {renderSpanForItem("User")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentcolor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>

                <span className="ml-4">User</span>
              </Link>
            </li>

            <li
              className="relative px-6 py-3"
              onClick={() => handleItemClick("Settings")}
            >
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 custom-link"
                to="/settings"
              >
                {renderSpanForItem("Settings")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentcolor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span className="ml-4">Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default LeftMenuList;
