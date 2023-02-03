import React from 'react';

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import './css/index.css';
import './sp-session-list.css';

import {Bar} from "react-chartjs-2";
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

  return (
      <>
      {
        props.stats.listType === "data" &&
          <>

              <Row className="sp-stats-bar-row">
                <Col sm={12}>
                  <div className="sp-stats-cpu-title">
                    Available CPUs:  {props.stats.cpu.free} / {props.stats.cpu.total}
                  </div>
                  <div className="sp-stats-bar">
                    <Bar data={yAxisCPUData} options={verticalStackedCPUOptions}/>
                  </div>
                </Col>
              </Row>
              <Row className="sp-stats-bar-row">
                <Col>
                  <div className="sp-stats-session-title">
                    Running Instances: {props.stats.instances.total}
                  </div>
                  <div className="sp-stats-bar">
                    <Bar options={verticalStackedBarOptions} data={yAxisSessionData} />
                  </div>
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

    <>
      <Row className="sp-stats-title-placeholder">
      <Col>
        <Placeholder className="sp-form-p sp-stats-title-placeholder"  animation="glow">
          <Placeholder className="sp-form-placeholder sp-stats-title-placeholder" xs={12} />
        </Placeholder>
      </Col>
      </Row>
      <Row className="sp-stats-placeholder">

        <Col>
          <Placeholder className="sp-form-p sp-stats-placeholder"  animation="glow">
            <Placeholder className="sp-form-placeholder sp-stats-placeholder" xs={12} />
          </Placeholder>
        </Col>
      </Row>

      <Row className="sp-stats-title-placeholder">
        <Col>
          <Placeholder className="sp-form-p sp-stats-title-placeholder"  animation="glow">
            <Placeholder className="sp-form-placeholder sp-stats-title-placeholder" xs={12} />
          </Placeholder>
        </Col>
      </Row>


      <Row className="sp-stats-placeholder">
        <Col>
          <Placeholder className="sp-form-p sp-stats-placeholder"  animation="glow">
            <Placeholder className="sp-form-placeholder sp-stats-placeholder" xs={12} />
          </Placeholder>
        </Col>
      </Row>
    </>
  }
</>



  )
}

export default SciencePortalGlobalStats;
