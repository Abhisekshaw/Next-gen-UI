import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "./logo_.png";
import profilepic from "./profilepic10.png"


function TopNavbar() {
  function logout() {
    window.localStorage.clear();
    window.location.href = "./";
  }
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);
  const [isNotificationsMenuOpen, setNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
 

  const toggleSideMenu = () => setSideMenuOpen(!isSideMenuOpen);
  const toggleNotificationsMenu = () =>
    setNotificationsMenuOpen(!isNotificationsMenuOpen);
  const closeNotificationsMenu = () => setNotificationsMenuOpen(false);
  const toggleProfileMenu = () => setProfileMenuOpen(!isProfileMenuOpen);
  const closeProfileMenu = () => setProfileMenuOpen(false);
  // const toggleTheme = () => setDarkMode(!darkMode);



  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };
  // useRef to get a reference to the dropdown menus
  const notificationsMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // useEffect to attach click event listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target)
      ) {
        closeNotificationsMenu();
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        closeProfileMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);



  return (
    <>
      <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
        <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
          {/* Mobile hamburger */}
    
          <button
            className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
            onClick={toggleSideMenu}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {/* Search input */}
          <div className="flex justify-center flex-1 lg:mr-32">
            {/* Your search input component can go here */}
          </div>
          <ul className="flex items-center flex-shrink-0 space-x-6">
            {/* Theme toggler */}
            {/* <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleTheme}
              aria-label="Toggle color mode"
            >
              {darkMode ? (
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
          </li> */}
            {/* Notifications menu */}
            <li className="relative" ref={notificationsMenuRef}>
              <button
                className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={toggleNotificationsMenu}
                onKeyDown={(e) => e.key === "Escape" && closeNotificationsMenu()}
                aria-label="Notifications"
                aria-haspopup="true"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
                {/* Notification badge */}
                {isNotificationsMenuOpen && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                  ></span>
                )}
              </button>
              {isNotificationsMenuOpen && (
                <ul
                  onClick={closeNotificationsMenu}
                  onKeyDown={(e) =>
                    e.key === "Escape" && closeNotificationsMenu()
                  }
                  className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:text-gray-300 dark:border-gray-700 dark:bg-gray-700"
                >
                  {/* Notifications menu items */}
                  <li className="flex">
                    <Link
                      className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      href="#"
                    >
                      <span>Messages</span>
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">
                        13
                      </span>
                    </Link>
                  </li>
                  <li className="flex">
                    <Link
                      className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      href="#"
                    >
                      <span>Sales</span>
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-600">
                        2
                      </span>
                    </Link>
                  </li>
                  <li className="flex">
                    <Link
                      className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      href="#"
                    >
                      <span>Alerts</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* Profile menu */}



            <li className="relative" ref={profileMenuRef}>
              <button

                className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none w-13 h-12"
                onClick={toggleProfileMenu}
                onKeyDown={(e) => e.key === "Escape" && closeProfileMenu()}
                aria-label="Account"
                aria-haspopup="true"
              >
                {/*  */}
                <img
                  className="object-cover w-13 h-12 rounded-full"
                  src={profilepic}
                  alt=""
                  aria-hidden="true"
                />
              </button>

              {isProfileMenuOpen && (
                <ul
                  onClick={closeProfileMenu}
                  onKeyDown={(e) => e.key === "Escape" && closeProfileMenu()}
                  className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                  aria-label="submenu"
                >
                  {/* Profile menu items */}
                  <li className="flex">
                    <Link
                      className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      href="#"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        aria-hidden="true"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li className="flex">
                    <Link
                      className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      href="#"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        aria-hidden="true"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li className="flex">
                    <Link
                      className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      // href='./'

                      onClick={logout}
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        aria-hidden="true"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                      </svg>

                      <span>Log out</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>


          </ul>
        </div>
      </header>
      {/*Mobileview*/}

      {/* Overlay */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
          onClick={closeSideMenu}
        ></div>
      )}

      {/* Sidebar */}


      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden ${isSideMenuOpen ? 'opacity-100' : 'opacity-0 transform -translate-x-20'
          }`}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <Link
            className=" text-lg font-bold text-gray-800 dark:text-gray-200"
            href="#"
          >
            <img src={logo} alt="" className="w-56" />
          </Link>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                href="#"
              >
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
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 "
                href="./report"
              >
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
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                href="./enterprise"
              >
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
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                href="#"
              >
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

            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                href="#"
              >
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



    </>
  );
}

export default TopNavbar;
