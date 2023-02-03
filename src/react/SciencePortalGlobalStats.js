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

export const barThickness = 12

function SciencePortalGlobalStats(props) {

            if (props.stats.listType === "data") {
              // 99% sure that user feedback will be the horizontal stacked
              // charts are ok. Hanging on to this in case that changes in the
              // first pass of the Platform Usage panel addition
              // var xAxissessionData = {
              //   labels: props.stats.instances.labels,
              //   datasets: [
              //     {
              //       data: props.stats.instances.data,
              //       backgroundColor: props.stats.instances.backgroundColor,
              //       hoverBackgroundColor: props.stats.instances.hoverBackgroundColor
              //     }
              //   ]
              // };

              var yAxisSessionData = {
                labels: ['instances'],
                datasets: [
                  {
                    label: props.stats.instances.labels[0],
                    data: [props.stats.instances.data[0]],
                    backgroundColor: props.stats.instances.backgroundColor[0],
                    hoverBackgroundColor: props.stats.instances.hoverBackgroundColor[0]
                  },
                  {
                    label: props.stats.instances.labels[1],
                    data: [props.stats.instances.data[1]],
                    backgroundColor: props.stats.instances.backgroundColor[1],
                    hoverBackgroundColor: props.stats.instances.hoverBackgroundColor[1]
                  },
                  {
                    label: props.stats.instances.labels[2],
                    data: [props.stats.instances.data[2]],
                    backgroundColor: props.stats.instances.backgroundColor[2],
                    hoverBackgroundColor: props.stats.instances.hoverBackgroundColor[2]
                  },
                ]
              };

              var yAxisCPUData = {
                labels: ['CPU usage'],
                datasets: [
                  {
                    label: "used",
                    data: [props.stats.cpu.used],
                    backgroundColor: "#008081",
                    hoverBackgroundColor: "#4F97A3"
                  },
                  {
                    label: "free",
                    data: [props.stats.cpu.free],
                    backgroundColor: "#dedede",
                    hoverBackgroundColor: "#efefef"
                  }
                ]
              };
            }

  var runningSessionsTitle = 'Running Sessions: ' + props.stats.instances.total

  // Hanging on to this code in case user feedback in the first pass is to
  // use a doughnut or pie chart rather than the stacked bar
  // var CPUstatsPieOptions = {
  //   plugins: {
  //     title: {
  //       display: false,
  //     },
  //     legend: {
  //       position: "right"
  //     }
  //   }
  // }

  // var CPUstatsPieData = {
  //   labels: ["used", "free"],
  //   datasets: [
  //     {
  //       data: [
  //         props.stats.cpu.used,
  //         props.stats.cpu.free
  //       ],
  //       backgroundColor: [
  //         "#008081",
  //         "#dedede"
  //       ],
  //       hoverBackgroundColor: [
  //         "#4F97A3",
  //         "#efefef"
  //       ]
  //     }
  //   ]
  // };


// vertical, stacked - data has to be arranged to be y axis
  var verticalStackedCPUOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        max: props.stats.cpu.total
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: false,
        },
        max: 50
      },
    },
    borderRadius: 4,
    barThickness: barThickness
  }

  var verticalStackedBarOptions = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        max: props.stats.instances.total
      },
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          display: false,
        },
        max: 50
      },
    },
    borderRadius: 4,
    barThickness: barThickness
  }
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

  // var sessionBarStackeddata = {
  //   labels: ['running session'],
  //   datasets:[
  //     {
  //       label: 'session',
  //       data :[100],
  //       backgroundColor: 'rgb(123, 22, 132)'
  //     },
  //     {
  //       label: 'desktop app',
  //       data :[80],
  //       backgroundColor: 'rgb(254, 99, 132)'
  //     },        {
  //       label: 'headless',
  //       data :[400],
  //       backgroundColor: 'rgb(100, 66, 254)'
  //     },
  //   ],
  // }

  // var cpuBarStackedYdata = {
  //   labels: ['CPU Usage'],
  //   datasets:[
  //     {
  //       label: 'session',
  //       data :[100],
  //       backgroundColor: 'rgb(123, 22, 132)'
  //     },
  //     {
  //       label: 'desktop app',
  //       data :[80],
  //       backgroundColor: 'rgb(254, 99, 132)'
  //     },        {
  //       label: 'headless',
  //       data :[400],
  //       backgroundColor: 'rgb(100, 66, 254)'
  //     },
  //   ],
  // }


  // var cpuBarData = {
  //   labels: ['# cores'],
  //   datasets:[
  //     {
  //       label: 'in use',
  //       data :[416],
  //       backgroundColor: 'rgb(123, 22, 132)'
  //     },
  //   ],
  // }

  // also not stacked
  // var cpuBaroptions = {
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
  //       // beginAtZero: true,
  //       stacked: true,
  //       grid: {
  //         display: false,
  //       },
  //     },
  //     y: {
  //       stacked: true,
  //       grid: {
  //         display: false,
  //       },
  //       max: 1186
  //     },
  //   },
  //   // borderRadius: 4
  // }

// vertical stacked bar chart options
  // not stacked chart - feb 3
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
              <Row className="sp-stats-pie-row">
                {/*<Col sm={6}>*/}
                {/*<Col>*/}
                  {/*<Card>*/}
                    {/*<Row>*/}
                    {/*  <Col sm={12}>*/}
                    {/*    <div className="sp-stats-text-div-title">*/}
                    {/*      Max resource requests:*/}
                    {/*    </div>*/}
                    {/*  </Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                      {/*<Col sm={6}>*/}
                      {/*  <Card>*/}
                      {/*  <div className="sp-stats-text-div-title">*/}
                      {/*    Max resource requests:*/}
                      {/*    <OverlayTrigger*/}
                      {/*        trigger="click"*/}
                      {/*        key="top"*/}
                      {/*        placement="top"*/}
                      {/*        rootClose={true}*/}
                      {/*        overlay={*/}
                      {/*          <Popover id={`popover-positioned-top`}>*/}
                      {/*            <Popover.Header as="h3">Resource Requests</Popover.Header>*/}
                      {/*            <Popover.Body className="sp-form">*/}
                      {/*              Depending on whether your session needs more RAM or cores for better processing,*/}
                      {/*              the values here are the largest available combinations of resources.*/}
                      {/*            </Popover.Body>*/}
                      {/*          </Popover>*/}
                      {/*        }*/}
                      {/*    >*/}
                      {/*      <FontAwesomeIcon className="sp-form-cursor popover-blue" icon={faQuestionCircle} />*/}
                      {/*    </OverlayTrigger>*/}
                      {/*  </div>*/}
                      {/*  <div className="sp-stats-text-div">*/}
                      {/*    <span className="sp-stats-text">{props.stats.profiles.memory.maxReqram}</span> RAM + <span*/}
                      {/*      className="sp-stats-text">{props.stats.profiles.memory.maxReqcpu} </span>CPU*/}
                      {/*  </div>*/}
                      {/*/!*</Col>*!/*/}
                      {/*/!*<Col sm={6}>*!/*/}
                      {/*  <div className="sp-stats-text-div">*/}
                      {/*    <span className="sp-stats-text">{props.stats.profiles.cpu.maxReqcpu}</span> CPU + <span*/}
                      {/*      className="sp-stats-text">{props.stats.profiles.cpu.maxReqram} </span>RAM*/}
                      {/*  </div>*/}
                      {/*  </Card>*/}

                      {/*  </Col>*/}
                        <Col sm={12}>
                          <div className="sp-stats-cpu-title">
                            Available CPUs:  {props.stats.cpu.free} / {props.stats.cpu.total}
                          </div>
                          <div className="sp-stats-bar">
                            <Bar data={yAxisCPUData} options={verticalStackedCPUOptions}/>
                          </div>
                      {/*</Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                    {/*  <Col>*/}
                    {/*    <div className="sp-stats-text-div-title">*/}
                    {/*      System maximums:*/}
                    {/*    </div>*/}
                    {/*  </Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                    {/*  <Col sm={6}>*/}
                    {/*    <div className="sp-stats-text-div">*/}
                    {/*      <span className="sp-stats-text">{props.stats.profiles.memory.availRAM}</span> RAM + <span*/}
                    {/*        className="sp-stats-text">{props.stats.profiles.memory.availCPU} </span>CPU*/}
                    {/*    </div>*/}
                    {/*  </Col>*/}
                    {/*  <Col sm={6}>*/}
                    {/*    <div className="sp-stats-text-div">*/}
                    {/*      <span className="sp-stats-text">{props.stats.profiles.cpu.availCPU}</span> CPU + <span*/}
                    {/*        className="sp-stats-text">{props.stats.profiles.cpu.availRAM} </span>RAM*/}
                    {/*    </div>*/}
                    {/*  </Col>*/}
                    {/*</Row>*/}
                  {/*</Card>*/}
                </Col>
              </Row>
              <Row className="sp-stats-pie-row">
                <Col>
                  {/*<Row>*/}
                    {/*<Col sm={6}>*/}
                    {/*  <div className="sp-stats-pie-cpu-title">*/}
                    {/*    Available CPUs:  {props.stats.cpu.free} / {props.stats.cpu.total}*/}
                    {/*  </div>*/}
                    {/*  <div className="sp-stats-pie-cpu">*/}
                    {/*    <Doughnut data={CPUstats} options={CPUpieOptions}/>*/}
                    {/*  </div>*/}
                    {/*</Col>*/}
                    {/*<Col sm={12}>*/}
                      <div className="sp-stats-session-title">
                        Running Instances: {props.stats.instances.total}
                      </div>
                      <div className="sp-stats-bar">
                        <Bar options={verticalStackedBarOptions} data={yAxisSessionData} />
                      </div>
                    {/*</Col>*/}
                  {/*</Row>*/}
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
                    last update: <span className="sp-stats-text">{props.stats.updated}</span> utc
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
