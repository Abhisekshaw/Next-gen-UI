import React, { useState } from 'react';

const Sidebar = () => {
  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  const openSideMenu = () => setSideMenuOpen(true);
  const closeSideMenu = () => setSideMenuOpen(false);

  return (
    <>
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
          onClick={closeSideMenu}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden ${
          isSideMenuOpen ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-20'
        }`}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
            <img src="assets/img/logo.png" alt="" className="w-56" />
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span
                className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                aria-hidden="true"
              ></span>
              <a
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                href="index.html"
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
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                <span className="ml-4">Dashboard</span>
              </a>
            </li>
          </ul>
          {/* Add other menu items as needed */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
