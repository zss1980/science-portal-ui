import React from 'react';

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import './css/index.css';
import './sp-session-list.css';

import {Bar, Pie, Doughnut} from "react-chartjs-2";
import { Card } from "react-bootstrap";

import {ArcElement} from 'chart.js'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Placeholder from "react-bootstrap/Placeholder";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const data = {
  labels: ["sessions", "desktop app", "headless"],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
      ],
      hoverBackgroundColor: [
        "#db3d44",
        "#4257b2",
        "#36A2EB"
      ]
    }
  ]
};

const CPUdata = {
  labels: ["used", "free"],
  datasets: [
    {
      data: [476, 1185],
      backgroundColor: [
        "#FF6384",
        "#dedede"
      ],
      hoverBackgroundColor: [
        "#db3d44",
        "#efefef"
      ]
    }
  ]
};

// class PieExample extends React.Component {
//   render() {
//     return (
//         <div class="col-12 col-sm-6">
          {/*<Card>*/}
          {/*  <h5>Pie Example</h5>*/}
            // <Pie data={data} />
          {/*</Card>*/}
        {/*</div>*/}
    // );
//   }
// }

// export default PieExample;

export const barThickness = 27



function SciencePortalGlobalStats(props) {

  var sessionData = {
    // labels: ["sessions", "desktop app", "headless"],
    labels: props.stats.instances.labels,
    datasets: [
      {
        // data: [props.stats.instances.sessions,
        //   props.stats.instances.desktopApp,
        //   props.stats.instances.headless],
        data: props.stats.instances.data,
        backgroundColor: [
          "#0E4D92",
          "#4682B4",
          "#57A0D3",
        ],
        hoverBackgroundColor: [
          "#0080FF",
          "#0F52BA",
          "#008ECC"
        ]
      }
    ]
  };

  var CPUstats = {
    labels: ["used", "free"],
    datasets: [
      {
        data: [
          props.stats.cpu.used,
          props.stats.cpu.free
        ],
        backgroundColor: [
          "#008081",
          "#dedede"
        ],
        hoverBackgroundColor: [
          "#4F97A3",
          "#efefef"
        ]
      }
    ]
  };

  var runningSessionsTitle = 'Running Sessions: ' + props.stats.instances.total
  var pieOptions = {
    plugins: {
      title: {
        display: false,
        text: runningSessionsTitle,
        position: "top",
        font: { size: 16 },
        align: "start"
      },
      cutout: 10,
      responsive: true,
      legend: {
        position: "right"
      }
    }
  }

  var CPUpieOptions = {
    plugins: {
      title: {
        display: false,
        text: 'CPUs: ' + props.stats.cpu.total,
        position: "top",
        font: {size: 16 },
        align: "start"
      },
      legend: {
        position: "right"
      }
    }
  }


  // var highMemoryBaroptions = {
  //   indexAxis: 'x',
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: 'CPU Usage',
  //     },
  //   },
  //   responsive: true,
  //   scales: {
  //     x: {
  //       //beginAtZero: true,
  //       stacked: true,
  //     },
  //     y: {
  //       stacked: true,
  //       max: 1189
  //     },
  //   },
  //   borderRadius: 4
  // }


  // var memoryBaroptions = {
  //   indexAxis: 'y',
  //   maintainAspectRatio: false,
  //   plugins: {
  //     title: {
  //       display: true,
  //       text: 'CPU Usage',
  //     },
  //   },
  //   responsive: true,
  //   scales: {
  //     x: {
  //       //beginAtZero: true,
  //       stacked: true,
  //       max: 1189
  //     },
  //     y: {
  //       stacked: true
  //     },
  //   },
  //   borderRadius: 4
  // }
  //
  // var memoryBardata = {
  //   labels: ['# cores'],
  //   datasets: [
  //     {
  //       label: 'In Use',
  //       data: [496],
  //       backgroundColor: 'rgb(255, 99, 132)',
  //       barThickness: barThickness
  //     },
  //   ],
  // }

  // var sessionBardata = {
  //   labels: ['running session'],
  //   datasets:[
  //       {
  //     label: 'session',
  //     data :[100],
  //     backgroundColor: 'rgb(123, 22, 132)'
  //   },
  //     {
  //       label: 'desktop app',
  //       data :[80],
  //       backgroundColor: 'rgb(254, 99, 132)'
  //     },        {
  //       label: 'headless',
  //       data :[400],
  //       backgroundColor: 'rgb(100, 66, 254)'
  //     },
  //     ],
  // }
  //
  var cpuBarData = {
    labels: ['# cores'],
    datasets:[
      {
        label: 'in use',
        data :[416],
        backgroundColor: 'rgb(123, 22, 132)'
      },
    ],
  }

  var cpuBaroptions = {
    indexAxis: 'x',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'CPU Usage',
      },
    },
    responsive: true,
    scales: {
      x: {
        // beginAtZero: true,
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        max: 1186
      },
    },
    // borderRadius: 4
  }

// vertical stacked bar chart options
  // var sessionBaroptions = {
  //   indexAxis: 'x',
  //     maintainAspectRatio: false,
  //     plugins: {
  //       title: {
  //         display: true,
  //         text: 'Running Sessions',
  //       },
  //     },
  //     responsive: true,
  //     scales: {
  //       x: {
  //         // beginAtZero: true,
  //         stacked: true,
  //         grid: {
  //           display: false,
  //         },
  //       },
  //       y: {
  //         stacked: true,
  //         grid: {
  //           display: false,
  //         },
  //         max: 580
  //       },
  //     },
  //     // borderRadius: 4
  //   }







  return (
      <>
      {
        props.stats.listType === "data" &&
            <>
              <Row>
                {/*<Col sm={6}>*/}
                <Col>
                  <Card>
                    <Row>
                      <Col>
                        <div className="sp-stats-text-div-title">
                          Largest Available Profiles
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <div className="sp-stats-text-div">
                          {/*<span className="sp-stats-text">132G</span> RAM + <span className="sp-stats-text">4 CPU</span>*/}
                          <span className="sp-stats-text">{props.stats.profiles.memory.ram}</span> RAM + <span
                            className="sp-stats-text">{props.stats.profiles.memory.cpu} </span>CPU
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="sp-stats-text-div">
                          {/*<span className="sp-stats-text">32 CPU</span> + <span className="sp-stats-text">256G</span> RAM*/}
                          <span className="sp-stats-text">{props.stats.profiles.cpu.cpu}</span> RAM + <span
                            className="sp-stats-text">{props.stats.profiles.cpu.ram} </span>CPU
                        </div>
                      </Col>
                    </Row>

                  </Card>

                  {/*<div className="sp-stats-bar-div">*/}
                  {/*  <Bar options={memoryBaroptions} data={memoryBardata} />*/}
                  {/*</div>*/}


                </Col>
              </Row>
              <Row className="sp-stats-pie-row">
                {/*<Col sm={6}>*/}
                <Col>
                  <Row>
                    <Col sm={6}>
                      <div className="sp-stats-pie-cpu-title">
                        CPUs:  {props.stats.cpu.total}
                      </div>
                      <div className="sp-stats-pie-cpu">
                        <Doughnut data={CPUstats} options={CPUpieOptions}/>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="sp-stats-pie-cpu-title">
                        Running Sessions: {props.stats.instances.total}
                      </div>
                      <div className="sp-stats-pie-session">
                        <Doughnut data={sessionData} options={pieOptions}/>
                      </div>
                    </Col>
                  </Row>
                  {/*<div className="sp-stats-bar-div">*/}
                  {/*  <Bar options={cpuBaroptions} data={cpuBarData} />*/}
                  {/*</div>*/}
                  {/*<div className="sp-stats-bar-div-tall">*/}
                  {/*  <Bar options={sessionBaroptions} data={sessionBardata} />*/}
                  {/*</div>*/}


                </Col>
              </Row>
              <Row className="sp-stats-pie-row">
                <Col>
                  <div className="sp-stats-text-date">
                    updated: <span className="sp-stats-text">{props.stats.updated}</span> utc
                  </div>
                </Col>
              </Row>
            </>

      }
  {props.stats.listType === "loading" &&
  // <>
    <Card>
      <Card.Body>
        <Row className="sp-title-placeholder "><Col>
          <Placeholder className="sp-form-p sp-title-placeholder-stats" animation="glow">
            <Placeholder className="sp-form-placeholder sp-title-placeholder-stats" xs={12} />
          </Placeholder>
        </Col></Row>

        <Row>
          <Col>
            <Placeholder className="sp-form-p sp-card-placeholder-stats"  as={Card.Text} animation="glow">
              <Placeholder className="sp-form-placeholder sp-card-placeholder-stats" xs={12} />

            </Placeholder>
          </Col>
          <Col>
            <Placeholder className="sp-form-p sp-card-placeholder-stats"  as={Card.Text} animation="glow">
              <Placeholder className="sp-form-placeholder sp-card-placeholder-stats " xs={12} />

            </Placeholder>
          </Col>
        </Row>

      </Card.Body>
    </Card>
  // </>
  }
</>



  )
}

export default SciencePortalGlobalStats;
