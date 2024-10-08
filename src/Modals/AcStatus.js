import React, { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more module
import HighchartsXrange from 'highcharts/modules/xrange';
import moment from 'moment-timezone';

// HighchartsMore(Highcharts); 
// Initialize the highcharts-more module
// HighchartsXrange(Highcharts);

function findMaxCount(filteredData) {
  // do an initial count of the day with max events
  const countOccurrences = filteredData.reduce((acc, curr) => {
    acc[curr.date] = (acc[curr.date] || 0) + 1;
    return acc;
  }, {});

  let maxDateLabel = null;
  let maxCount = 0;
  for (const [name, count] of Object.entries(countOccurrences)) {
    if (count > maxCount) {
      maxDateLabel = name;
      maxCount = count;
    }
  }

  return { maxDateLabel, maxCount };
}

function findMaxCountPostProcessing(series) {
  let newMaxDateLabel = null;
  let newMaxCount = 0;
  for (const [name, data] of Object.entries(series)) {
    let count = data.length;
    if (count > newMaxCount) {
      newMaxDateLabel = name;
      newMaxCount = count;
    }
  }
  return { newMaxDateLabel, newMaxCount };
}

// global constants
const timeAdjustmentForIST = 19800; // 5.5 hours
const secondsInaDay = (3600 * 24);

function processSingleRecord(item, series, dateLabel, runningCounter,
  lastETime, maxCount, categories) {
  
  let lastETimeVal = lastETime;

  console.log(JSON.stringify(categories) + ", dateLabel:" + dateLabel + 
  ", runningCounter:" + runningCounter + ", lastETimeVal:" + lastETimeVal + ", maxCount:" + maxCount);

  let adjustedStartTime = item.starttime + timeAdjustmentForIST;
  let adjustedEndTime = item.endtime + timeAdjustmentForIST;
  let startTimeSeconds = adjustedStartTime % secondsInaDay;
  
  if (dateLabel == "") {
    dateLabel = item.date;
    categories.push(dateLabel);
    runningCounter = 0;

    lastETimeVal = 0;
    // check if the time needs to be filled 
    if (startTimeSeconds >= 0) {
      lastETimeVal = adjustedStartTime - (startTimeSeconds);
    }
  }
  else if (dateLabel != item.date) {
    // close out the last date data
    // fill the rest of the counters with empty
    for (++runningCounter; runningCounter < maxCount; runningCounter++) {
      if (series[runningCounter] == null) {
        // insert a new series
        series.push({
          name: dateLabel + "-" + runningCounter,
          data: []
        })
      }
      series[runningCounter].data.push({ y: 0, color: (item.acstatus === "ON" ? "#98fb98" : "#FF5733") });
    }

    // reset the variables for next date processing
    dateLabel = item.date;
    categories.push(dateLabel);
    runningCounter = 0;
    lastETime = 0;
    // TODO for completeness we should even handle the last data block that is not having endtime equal to end of day time        
    // check if the time needs to be filled 
    if (startTimeSeconds > 0) {
      lastETime = adjustedStartTime - (startTimeSeconds);
    } else {
      lastETime = adjustedStartTime;
    }

  } else {
    runningCounter++;
  }
  if (series[runningCounter] == null) {
    // insert a new series
    series.push({
      name: dateLabel + "-" + runningCounter,
      data: []
    })
  }
  console.log("adjustedStartTime: "+ adjustedStartTime + " , lastETime :" + lastETimeVal);
  if (lastETimeVal != 0 && (adjustedStartTime - lastETimeVal > 1)) {
    // TODO handle the scenario where the maxDateLabel which creates the largest number of time block is missing some data.
    // then it needs to be added across all the other ones.
    // may be it is a good idea to process it earlier and get count or may be fix the count logic
    // we do not what this is        
    series[runningCounter].data.push({ y: (adjustedStartTime - lastETimeVal) * 1000, color: "gray" });
    runningCounter++;
    // adding the additional counter for the regular block
    series.push({
      name: dateLabel + "-" + runningCounter,
      data: []
    })
    lastETimeVal = adjustedStartTime;
  }
  series[runningCounter].data.push({ y: (adjustedEndTime - adjustedStartTime) * 1000, color: (item.acstatus === "ON" ? "#98fb98" : "#FF5733") });
  lastETimeVal = adjustedEndTime;
  return {runningCounter: runningCounter, lastETime: lastETimeVal, dateLabel:dateLabel};
}

const AcStatus = ({ data, closeModal, id }) => {
  const [tableData, setTableData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [FilteredData, setFilteredData] = useState([]);
  /*
    code logic
    filter the data to get a single optimizer id
    the problem statement is that the we want to create the chart in a stack structure
    the way the stack works is each category becomes a column
    the expectation of each data element in the series of data is passed is that 
    each element, should have the same count of subelements in it
    example: if i want to create a graph of two days of on off
    then the data could be
    day1: 3-6 (off), 6-9 (on), 9-15 (off), 15-24(on)  -- 0-3 is missing, 4 events
    day2: 0-15 (off), 15-24 (on)
    day3: 0-3 (off), 6-15 (on), 15-24(on)  -- 3-6 is missing, 3 events
    
    but this data in stack will not create the right structure as
    day1: is missing 0-3 ()
    day1 and day2 have different number of events.
    day1 has 4 events on on and off
    day2 has 2 events
    day3 gas 3 events

    the entire code from "stack data logic - start" to "end" is to generate data like this
    each block of events computes the time for that event
    day1: 3(nostatus), 3 (off), 3 (on), 6 (off), 9(on)  -- 5 events
    day2: 15 (off), 9 (on), 0(nostatus), 0(nostatus), 0(nostatus) -- 5 events
    day3: 3 (off), 3(nostatus), 9(on), 9(off), 0(nostatus) -- 5 events
    ---Note-- 
    day1: added additional 3(nostatus) to fill the initial gap
    day2: populated additional 0 events to match the count count of events in day1
    day3: added additional 3(nostatus) to fill the gap in the middle, and 0 event to match counts
  */
  useEffect(() => {
    let filteredData = id ? data.filter(element => element.optimizerId === id) : [];
    setFilteredData(filteredData);

    // find the dateWith the maxCounter
    let { maxDateLabel, maxCount } = findMaxCount(filteredData);
    // process each record and populate the categories and series
    let categories = [];
    let dateLabel = "";
    let runningCounter = 1;
    let series = [];
    let lastETime = 0;
    filteredData.forEach(item => {
      let returnedValues = processSingleRecord(item, series, dateLabel, runningCounter,
        lastETime, maxCount, categories);
      
      dateLabel = returnedValues.dateLabel;
      runningCounter = returnedValues.runningCounter;
      lastETime = returnedValues.lastETime;      
    });
    // check and fix the counters again
    let { newMaxDateLabel, newMaxCount } = findMaxCountPostProcessing(series);
    console.log("maxCount:" + maxCount + ", maxLabel:" + maxDateLabel);
    console.log("maxCount:" + newMaxCount + ", maxLabel:" + newMaxDateLabel); 
    setTableData(filteredData);
    console.log(JSON.stringify(series));

    setChartOptions({
      chart: {
        type: 'column'
      },
      title: {
        text: 'AC On Off Times',
        align: 'left'
      },
      xAxis: {
        categories: categories
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
        max: 24 * 3600 * 1000,
        stackLabels: {
          enabled: false
        },
        reversedStacks: false
      },

      legend: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false
          },
          pointPadding: 0,
        }
      },
      series: series
    })
  }, [data, id]);



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


  return (id === ""? "": (
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
                  <th>Status</th>
                  <th scope="col">AC On Times</th>
                  <th scope="col">AC Off Times</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((item, index) => (
                  <tr key={index}>
                    <td>{moment.unix(item.starttime ? item.starttime : item.endtime).tz('Asia/Kolkata').format('YYYY-MM-DD')}</td>
                    <td>{item.acstatus}</td>
                    <td>{item.starttime ? new Date(item.starttime * 1000).toLocaleTimeString() : '--'}</td>
                    <td>{item.endtime ? new Date(item.endtime * 1000).toLocaleTimeString() : '--'}</td>
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
  ))

};

export default AcStatus;
