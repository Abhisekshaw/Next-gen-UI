import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const AcStatus = ({data,closeModal,id}) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  console.log({data},"+++++++++++++++++++++++");
  let ActualData=[];
    data?.forEach(element => {
      if (element._id===id) {
        ActualData.push(element);
      }
    });
    console.log(ActualData,"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  useEffect(() => {
    const data = {
      labels: ['2024-07-01', '2024-07-02', '2024-07-03', '2024-07-04', '2024-07-05'],
      datasets: [
        {
          label: 'OFF',
          backgroundColor: '#e84118',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          stack: 'Stack 0',
          data: [2, 3, 1, 4, 2] // Example time data for Task A
        },
        {
          label: 'ON',
          backgroundColor: '#4cd137',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          stack: 'Stack 0',
          data: [3, 2, 4, 1, 3] // Example time data for Task B
        }
      ]
    };

    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: [{
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'YYYY-MM-DD'
              }
            },
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          y: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }]
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{ maxHeight: "auto", overflowY: "auto" }}
      className="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 xl:rounded-lg xl:m-4 xl:max-w-xl"
      style={{height: '100%'}}
      >
        <div className="flex justify-end mb-2">
          <button
            className="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:hover:text-gray-700"
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
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-6">
                <canvas ref={canvasRef} id="AcChart" width="800" height="400"></canvas>
              </div>
              <div className="col-md-6">
                <table className="table mt-5">
                  <thead className="table-dark">
                    <tr>
                      <th>Date</th>
                      <th scope="col">AC On Times</th>
                      <th scope="col">AC off Times</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-07-03</td>
                      <td>8.50 am</td>
                      <td>9.45 am</td>
                    </tr>
                    <tr>
                      <td>2024-07-03</td>
                      <td>8.50 am</td>
                      <td>9.45 am</td>
                    </tr>
                    <tr>
                      <td>2024-07-03</td>
                      <td>8.50 am</td>
                      <td>9.45 am</td>
                    </tr>
                    <tr>
                      <td>2024-07-03</td>
                      <td>8.50 am</td>
                      <td>9.45 am</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcStatus;
{tableData.map((item, index) =>(
  <tr key={index}>
  <td>{moment.unix(item.ACOnTime ? item.ACOnTime : item.ACOffTime)
    .tz('Asia/Kolkata')
    .format('YYYY-MM-DD')}</td>
  <td>{new Date(item.ACOnTime * 1000).toLocaleTimeString()}</td>
  <td>{new Date(item.ACOffTime * 1000).toLocaleTimeString()}</td>
</tr>
))}



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