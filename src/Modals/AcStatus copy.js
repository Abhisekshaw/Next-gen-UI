import React, { useEffect, useRef, useState, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Chart, registerables } from 'chart.js';

import Chart from 'react-apexcharts';

import 'chartjs-adapter-date-fns';
import moment from 'moment-timezone';
// Chart.register(...registerables);

const AcStatus = ({ data, closeModal, id }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  const [tableData, setTableData] = useState([]);
  // const endIndex = startIndex + itemsPerPage;
  // const displayedData = data.slice(startIndex, endIndex);
  const ActualData = useMemo(() => {
    return data.filter(element => element._id === id);
  }, [data, id]);


  useEffect(() => {
    // const labels = [];
    // const onData = [];
    // const offData = [];
    const updatedTableData = [];
    const newDataObject = {};

    ActualData.forEach(item => {
      item?.ACCutoffTimes.forEach(time => {
        updatedTableData.push(time);

        // Convert the timestamp to IST and format the date
        const dateLabel = moment.unix(time.ACOnTime ? time.ACOnTime : time.ACOffTime)
          .tz('Asia/Kolkata')
          .format('YYYY-MM-DD');

        if (!newDataObject[dateLabel]) {
          newDataObject[dateLabel] = [];
        }

        newDataObject[dateLabel].push({
          ACOnTime: time.ACOnTime,
          ACOffTime: time.ACOffTime
        });

        // if (!labels.includes(dateLabel)) {
        //   labels.push(dateLabel);
        //   // Initialize the data arrays with zero values
        //   onData.push(0);
        //   offData.push(0);
        // }

        // const labelIndex = labels.indexOf(dateLabel);

        // if (time.ACOnTime) {
        //   const onTime = new Date(time.ACOnTime * 1000).getHours() + new Date(time.ACOnTime * 1000).getMinutes() / 60 + new Date(time.ACOnTime * 1000).getSeconds() / 3600;
        //   onData[labelIndex] += 24 - onTime; // Add on time from ACOnTime to the end of the day
        // }

        // if (time.ACOffTime) {
        //   const offTime = new Date(time.ACOffTime * 1000).getHours() + new Date(time.ACOffTime * 1000).getMinutes() / 60 + new Date(time.ACOffTime * 1000).getSeconds() / 3600;
        //   offData[labelIndex] += offTime; // Add off time from the start of the day to ACOffTime
        // }
      });
    });


    setTableData(updatedTableData);

    // Your data structure
    const acData = {
      "2024-06-01": [
        { "ACOnTime": 1720013229, "ACOffTime": 1720015000 },
        { "ACOnTime": 1720017000, "ACOffTime": 1720020000 },
        { "ACOnTime": 1720025000, "ACOffTime": 1720028000 }
      ],
      "2024-06-02": [
        { "ACOnTime": 1720030000, "ACOffTime": 1720035000 },
        { "ACOnTime": 1720038000, "ACOffTime": 1720040000 },
        { "ACOnTime": 1720045000, "ACOffTime": 1720050000 },
        { "ACOnTime": 1720055000, "ACOffTime": 1720060000 }
      ],
      "2024-06-03": [
        { "ACOnTime": 1720065000, "ACOffTime": 1720070000 },
        { "ACOnTime": 1720075000, "ACOffTime": 1720080000 },
        { "ACOnTime": 1720085000, "ACOffTime": 1720090000 },
        { "ACOnTime": 1720095000, "ACOffTime": 1720100000 }
      ],
      "2024-06-04": [
        { "ACOnTime": 1720105000, "ACOffTime": 1720110000 },
        { "ACOnTime": 1720115000, "ACOffTime": 1720120000 },
        { "ACOnTime": 1720125000, "ACOffTime": 1720130000 }
      ],
      "2024-06-05": [
        { "ACOnTime": 1720135000, "ACOffTime": 1720140000 },
        { "ACOnTime": 1720145000, "ACOffTime": 1720150000 },
        { "ACOnTime": 1720155000, "ACOffTime": 1720160000 }
      ]
    };

    // Process data into chart format
    const labels = Object.keys(acData);
    const onData = labels.map(date => {
      return acData[date].reduce((totalOn, entry) => totalOn + 1, 0); // Count entries with ACOnTime
    });
    const offData = labels.map(date => {
      return acData[date].reduce((totalOff, entry) => totalOff + (entry.ACOffTime ? 1 : 0), 0); // Count entries with ACOffTime
    });

    // Chart.js configuration
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'ON',
          backgroundColor: '#4cd137',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          stack: 'Stack 0',
          data: onData
        },
        {
          label: 'OFF',
          backgroundColor: '#e84118',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          stack: 'Stack 0',
          data: offData
        }
      ]
    };

    // Chart.js initialization
    // const ctx = canvasRef.current.getContext('2d');
    // if (chartRef.current) {
    //   chartRef.current.destroy();
    // }
    // chartRef.current = new Chart(ctx, {
    //   type: 'bar',
    //   data: chartData,
    //   options: {
    //     plugins: {
    //       tooltip: {
    //         callbacks: {
    //           label: function (context) {
    //             let label = context.dataset.label || '';
    //             if (label) {
    //               label += ': ';
    //             }
    //             if (context.parsed.y !== null) {
    //               label += `${context.parsed.y}:00`; // Display time in hours
    //             }
    //             return label;
    //           }
    //         }
    //       }
    //     },
    //     scales: {
    //       x: {
    //         type: 'category',
    //         stacked: true,
    //         title: {
    //           display: true,
    //           text: 'Date'
    //         }
    //       },
    //       y: {
    //         stacked: true,
    //         min: 0,
    //         max: 24, // Set the maximum value to 24 for 24-hour format
    //         title: {
    //           display: true,
    //           text: 'Time (Hours)'
    //         },
    //         ticks: {
    //           stepSize: 1,
    //           callback: function (value) {
    //             return `${value}:00`; // Display time in hours
    //           }
    //         }
    //       }
    //     }
    //   }
    // });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [ActualData]);
  console.log({ tableData });

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const paginationRange = 1;
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage);

    // Ensure the new page is within valid range
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(tableData.length / itemsPerPage); // Set the total number of pages

    // Display all buttons if there are less than or equal to 6 pages
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
        </div>
        <div className="container mt-4">
          <h4 className="text-center mb-3">AC ON/OFF Details</h4>
          <div className="col-md-6 mb-4 mx-auto">
            <div className="row">
              <div className="col-md-4">
                <div className="card" style={{ background: '#dafedf', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">Optimizer Id</h6>
                    <p className="">{ActualData[0]?._id}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card" style={{ background: '#fce7ef', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">Optimizer Name</h6>
                    <p className="">{ActualData[0]?.OptimizerName}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card" style={{ background: '#e7f0f8', padding: '0!important' }}>
                  <div className="card-body" style={{ padding: '0 2px!important' }}>
                    <h6 className="text-dark">Tonnage Value</h6>
                    <p className="">{ActualData[0]?.ACTonnage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-6">
                {/* <canvas ref={canvasRef} id="AcChart" width="800" height="400"></canvas> */}
                {/* _______________------------------------------------------------------------- */}
                {/* <h2>Stacked bar chart in react using apexcharts</h2> */}
                <Chart
                type="bar"
                series={[
                    {
                        name:"Hydro-Electric",
                        data:[345,578,898,532,465],
                        //color: '#f90000'
                    },
                    {
                        name:"Oil",
                        data:[125,178,338,587,276],
                       // color: '#000000'
                    },
                    {
                        name:"Gas",
                        data:[355,458,218,587,229],
                       // color: '#000000'
                    },
                    {
                        name:"Coal",
                        data:[190,321,112,537,333],
                       // color: '#000000'
                    },
                    {
                        name:"Nuclear",
                        data:[560,121,675,907,233],
                       // color: '#000000'
                    }


                ]}

                options={{
                    title:{
                        text:"Enegry Consumption in Years"
                    },
                    chart:{
                        stacked:true,
                    },
                    plotOptions:{
                        bar:{
                            // horizontal:true,
                            columnWidth:'100%'
                          }
                    },
                    stroke: {
                        width: 1,
                    },
                    xaxis:{
                        title:{
                            text:"Energy Consumption in Year's"
                        },
                        categories:['2017','2018','2019','2020','2021']
                    },
                    yaxis:{
                        title:{
                            text:"Data in (K)"
                        },
                    },
                    legend:{
                        position: 'bottom'
                    },
                    dataLabels:{
                        enabled:true,
                    },
                    grid: {
                        show:true,
                        xaxis:{
                            lines:{
                                show:false
                            }
                        },
                        yaxis:{
                            lines:{
                                show:false
                            }
                        }

                    }

                }}

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
                    {/* {ActualData.map((item, index) => (
                      item.ACCutoffTimes.map((time, i) => (
                        <tr key={`${i}`}>
                          <td>{moment.unix(time.ACOnTime ? time.ACOnTime : time.ACOffTime)
                            .tz('Asia/Kolkata')
                            .format('YYYY-MM-DD')}</td>
                          <td>{new Date(time.ACOnTime * 1000).toLocaleTimeString()}</td>
                          <td>{new Date(time.ACOffTime * 1000).toLocaleTimeString()}</td>
                        </tr>
                      ))
                    ))} */}
                    {displayedData.map((item, index) => (
                      <tr key={index}>
                        <td>{moment.unix(item.ACOnTime ? item.ACOnTime : item.ACOffTime)
                          .tz('Asia/Kolkata')
                          .format('YYYY-MM-DD')}</td>
                        <td>{item.ACOnTime ? new Date(item.ACOnTime * 1000).toLocaleTimeString() : '--'}</td>
                        <td>{item.ACOffTime ? new Date(item.ACOffTime * 1000).toLocaleTimeString() : '--'}</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="grid px-0 py-0 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  {/* <span className="flex items-center col-span-3">
                  {`Showing ${startIndex + 1}- ${enterpriseTableData.length
                    } of ${endIndex} `}
                </span> */}
                  {/* <span className="col-span-2"></span> */}

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcStatus;
