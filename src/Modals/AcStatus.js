import React, { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more module
import moment from 'moment-timezone';

HighchartsMore(Highcharts); // Initialize the highcharts-more module

const AcStatus = ({ data, closeModal, id }) => {
  const [tableData, setTableData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [FilteredData, setFilteredData] = useState([]);
  

  useEffect(() => {
    let filteredData = id? data.filter(element => element._id === id) : data;
    setFilteredData(filteredData);

    const updatedTableData = [];
    const newDataObject = {};

    filteredData.forEach(item => {
      const dateLabel = moment.unix(item.StartTime).tz('Asia/Kolkata').format('YYYY-MM-DD');

      if (!newDataObject[dateLabel]) {
        newDataObject[dateLabel] = [];
      }

      newDataObject[dateLabel].push({
        FirstACOnTime: item?.ACCutoffTimes[0]?.ACOnTime,
        lastACOffTime: item?.ACCutoffTimes[item?.ACCutoffTimes.length - 1]?.ACOffTime || "--"
      });

      item?.ACCutoffTimes.forEach(time => updatedTableData.push(time));
    });

    setTableData(updatedTableData);

    const categories = [];
    const acIntervals = [];
    for (const date in newDataObject) {
      categories.push(date);

      const firstOnTime = new Date(newDataObject[date][0].FirstACOnTime * 1000);
      let lastOffTime;

      if (newDataObject[date][0].lastACOffTime === "--") {
        lastOffTime = new Date(Date.UTC(
          firstOnTime.getUTCFullYear(),
          firstOnTime.getUTCMonth(),
          firstOnTime.getUTCDate(),
          23, 59, 59 // End of day in UTC
        ));
      } else {
        lastOffTime = new Date(newDataObject[date][0].lastACOffTime * 1000);
      }
      const startTime = firstOnTime.getHours() * 3600 * 1000 + firstOnTime.getMinutes() * 60 * 1000 + firstOnTime.getSeconds() * 1000;

      const endTime = lastOffTime.getHours() * 3600 * 1000 + lastOffTime.getMinutes() * 60 * 1000 + lastOffTime.getSeconds() * 1000;
      acIntervals.push([startTime, endTime]);
    }

    setChartOptions({
      chart: {
        type: 'columnrange',
        inverted: false
      },
      title: {
        text: 'AC On/Off Times'
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Date'
        },
        labels: {
          formatter: function () {
            // Assume categories contain date strings in 'YYYY-MM-DD' format
            const date = moment(this.value, 'YYYY-MM-DD');
            return date.format('DD-MM'); // Display as 'DD-MM'
          }
        }
      },
      yAxis: {
        type: 'datetime',
        title: {
          text: 'Time'
        },
        dateTimeLabelFormats: {
          hour: '%H:%M:%S',
          minute: '%H:%M:%S',
          second: '%H:%M:%S'
        },
        tickInterval: 3 * 3600 * 1000, // 1 hour
        labels: {
          format: '{value:%H:%M:%S}'
        },
        min: 0,
        max: 24 * 3600 * 1000 // 24 hours in milliseconds
      },
      series: [{
        name: 'AC On/Off Duration',
        data: acIntervals,
        tooltip: {
          pointFormatter: function () {
            const start = Highcharts.dateFormat('%H:%M:%S', this.low);
            const end = Highcharts.dateFormat('%H:%M:%S', this.high);
            return `<b>${categories[this.x]}</b><br/>Start: ${start}<br/>End: ${end}`;
          }
        }
      }],
      tooltip: {
        formatter: function () {
          return this.series.tooltipOptions.pointFormatter.call(this.point);
        }
      },
      credits: {
        enabled: false // Disable the watermark
      }
    });
  }, [data, id]);

  function handleclick() {
    setTableData([]);
    closeModal();
  }

  // Pagination
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

  if(closeModal ){
  return (
    <div
      style={{ maxHeight: "auto", overflowY: "auto" }}
      className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 xl:rounded-lg xl:m-4 xl:max-w-xl"
        style={{ height: '100%' }}
      >
        <div className="flex justify-end mb-2">
          <button
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
            aria-label="close"
            onClick={handleclick}
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
        </div>
        <div className="container mt-4">
          {/* <h4 className="text-center mb-3">AC ON/OFF Details</h4> */}
          <div className="col-md-6 mb-4 mx-auto">
            <div className="row">
              <div className="col-md-4">
                <div className="card" style={{ background: '#dafedf', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">Optimizer Id</h6>
                    <p className="">{FilteredData[0]?._id}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card" style={{ background: '#fce7ef', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">Optimizer Name</h6>
                    <p className="">{FilteredData[0]?.OptimizerName}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card" style={{ background: '#e7f0f8', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">AC Tonage</h6>
                    <p className="">{FilteredData[0]?.ACTonnage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-6">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                />
              </div>
              <div className="col-md-5">
                <table className="table mt-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Date</th>
                      <th scope="col">AC On Times</th>
                      <th scope="col">AC Off Times</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.map((item, index) => (
                      <tr key={index}>
                        <td>{moment.unix(item.ACOnTime ? item.ACOnTime : item.ACOffTime).tz('Asia/Kolkata').format('YYYY-MM-DD')}</td>
                        <td>{item.ACOnTime ? new Date(item.ACOnTime * 1000).toLocaleTimeString() : '--'}</td>
                        <td>{item.ACOffTime ? new Date(item.ACOffTime * 1000).toLocaleTimeString() : '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="grid px-0 py-0 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
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
                            disabled={currentPage === Math.ceil(tableData.length / itemsPerPage)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}else{
  return(
  <div className="container mt-4">
          {/* <h4 className="text-center mb-3">AC ON/OFF Details</h4> */}
           <div className="container mt-4">
            <div className="row">
              <div className="col-md-6">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                />
              </div>
              <div className="col-md-5">
                <table className="table mt-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Date</th>
                      <th scope="col">AC On Times</th>
                      <th scope="col">AC Off Times</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedData.map((item, index) => (
                      <tr key={index}>
                        <td>{moment.unix(item.ACOnTime ? item.ACOnTime : item.ACOffTime).tz('Asia/Kolkata').format('YYYY-MM-DD')}</td>
                        <td>{item.ACOnTime ? new Date(item.ACOnTime * 1000).toLocaleTimeString() : '--'}</td>
                        <td>{item.ACOffTime ? new Date(item.ACOffTime * 1000).toLocaleTimeString() : '--'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="grid px-0 py-0 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
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
                            disabled={currentPage === Math.ceil(tableData.length / itemsPerPage)}
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
            </div>
          </div>
        </div>
  );
}
};

export default AcStatus;
