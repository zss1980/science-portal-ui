import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import CanfarLoginModal from "./react/CanfarLoginModal";
import CanfarNavbar from "./react/CanfarNavbar";
import SessionItem from "./react/SessionItem";
import SciencePortalConfirm from "./react/SciencePortalConfirm"
import SciencePortalForm from "./react/SciencePortalForm";
import SciencePortalModal from "./react/SciencePortalModal";
import SciencePortalPlatformLoad from "./react/SciencePortalPlatformLoad";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";

import Tooltip from "react-bootstrap/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRefresh } from "@fortawesome/free-solid-svg-icons/faRefresh"

import "./react/css/index.css"

// This is in the node_modules directory
import "bootstrap/dist/css/bootstrap.min.css";

// This is after bootstrap so values can be overridden
import "./react/sp-session-list.css";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";


const MODAL_DATA = {
  "title": "Initializing Portal",
  "msg": "Initalizing...",
  "isOpen": true,
  "showSpinner" : true,
  "showReload" : false,
  "showHome" : false
}

const URLS = {
  baseURLcanfar: "https://www.canfar.net",
  baseURLcadc: "https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca"
}

const HEADER_URL_DEFAULTS = {
  "acctrequest": "",
  "acctupdate": "",
  "passreset": "",
  "passchg": "",
  "gmui": "",
  "search": "",
  "baseURLCanfar": "https://www.canfar.net"
}

//function handleSubmit(e) {
//  e.preventDefault();
//  alert("no submission handler defined for launch form")
//}
//
//function handleChangeType(e) {
//  e.preventDefault();
//  alert("no session type change handler defined for launch form")
//}
//
//function handleDeleteSession(e) {
//  e.preventDefault();
//  var deleteData = e.currentTarget.dataset
//  console.log("delete data found: " + deleteData.name + ": " + deleteData.id)
//  alert("no session delete handler defined for launch form")
//}
//
//function handleConnectRequest(e) {
//  e.preventDefault();
//  var sessionData = e.currentTarget.dataset
//  console.log("session data found: "  + sessionData.id)
//  alert("no session connect handler defined for launch form")
//}
//
//function handleConfirm(e) {
//  e.preventDefault();
//  var deleteData = e.currentTarget.dataset
//  console.log("delete data found: " + deleteData.name + ": " + deleteData.id)
//  alert("no session delete handler defined for launch form")
//}
//
//function handleLogin(e) {
//  e.preventDefault();
//  var username = e.currentTarget[0].value
//  var pwd = e.currentTarget[1].value
//  console.log("login data found: " + username + ": " + pwd)
//  alert("no session login handler defined for launch form")
//}

const BASE_PAGE_STATE = {
  "spForm" : {
    "alert" : {
      "show": false,
      "type": "secondary",
      "message": "test message"
    },
    "progressBar" : {
      "type": "success",
      "animated": true
    }
  },
  "spSessionList" : {
    "alert" : {
      "show": false,
      "type": "secondary",
      "message": "test message"
    },
    "progressBar" : {
      "type": "success",
      "animated": true
    }
  },
  "spGlobalStats" : {
    "alert" : {
      "show": false,
      "type": "secondary",
      "message": "test message"
    },
    "progressBar" : {
      "type": "success",
      "animated": true
    }
  }
}

function refreshStats(e) {
   e.preventDefault();
 alert("no global stats login handler sent from parent")
}

const GLOBAL_STATS_TEST = {
  "updated": "<time stamp goes here> utc",
  "profiles" : {
    "cpu" : {
      "maxReqram": 192,
      "maxReqcpu": 16,
      "availRAM": 256,
      "availCPU": 32,
    },
    "memory" : {
      "maxReqram": 192,
      "maxReqcpu": 16,
      "availRAM": 256,
      "availCPU": 32,
    }
  },
  "instances" : {},
  "cpu" : {},
  // "refreshHandler": refreshStats,
  "listType": "loading"
}

class SciencePortalApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionData: {"listType": "loading", "sessData": []},
      modalData: MODAL_DATA,
      fData: {},
      globalStats: GLOBAL_STATS_TEST,
      urls: URLS,
      confirmModalData: {dynamicProps:{isOpen: false}},
      pageState: BASE_PAGE_STATE,
      headerURLs: HEADER_URL_DEFAULTS,
      userInfo: {}
    };
  }

  // Use these functions via the window ref in order to
  // inject or grab session data from the react app
  //
  getPageState() {
    return this.state.pageState
  }
  updateSessionList(sessionDataObj) {
    this.setState({sessionData: sessionDataObj})
  }

  updateModal(sModalData) {
    this.setState({modalData: sModalData})
  }

  openConfirmModal(sModalData) {
    sModalData.dynamicProps.isOpen = true
    this.setState({confirmModalData: sModalData})
  }

  closeConfirmModal(sModalData) {
    sModalData.dynamicProps.isOpen = false
    this.setState({confirmModalData: sModalData})
  }

  setConfirmModal(sModalData) {
    this.setState({confirmModalData: sModalData})
  }

  setAuthenticated(userState) {
    userState.isAuth = true
    this.setState({userInfo: userState})
  }

  setNotAuthenticated(userState) {
    userState.isAuth = false
    this.setState({userInfo: userState})
  }

  setAuthenticatedError(userState) {
    userState.isAuth = false
    this.setState({userInfo: userState})
  }

  closeConfirmModal(sModalData) {
    this.setState({confirmModalData: sModalData})
  }

  updateLaunchForm(sFormData) {
    this.setState({fData: sFormData})
  }

  updateGlobalStats(sGlobalStatsData) {
    this.setState({globalStats: sGlobalStatsData})
  }

  updateURLs(sURLs) {
    this.setState({urls: sURLs})
  }

  setHeaderURLs(hURLs) {
    var curState = this.state
    curState.headerURLs = hURLs
    this.setState(curState)
  }

  setPageStatus(pageState) {
    this.setState( {pageState: pageState})
  }

  setBanner(bannerText) {
    this.setState({bannerText: bannerText})
  }



  render() {
    var isAuthenticated = true
    if (typeof this.state.userInfo.isAuth !== "undefined") {
      isAuthenticated = this.state.userInfo.isAuth
    }

    var username = "Login"
    if (typeof this.state.userInfo.username !== "undefined") {
      username = this.state.userInfo.username
    }

    var authModal = ""
    if (typeof this.state.userInfo.isAuth !== "undefined") {
      if (this.state.userInfo.isAuth === false) {
        authModal = <CanfarLoginModal isOpen={true}
                                      modalURLs={this.state.headerURLs}
                                      submitHandler={this.state.userInfo.loginHandler}
                                      errMsg={this.state.userInfo.errMsg}/>
      }
    }


    return (
      <Container fluid className="bg-white">
          <CanfarNavbar
            headerURLs={this.state.headerURLs}
            isAuthenticated={isAuthenticated}
            authenticatedUser={username}
            bannerText={this.state.bannerText}
          ></CanfarNavbar>

          <Container fluid className="sp-body">
            <Row><Col>
              <h3 className="sp-page-header">Science Portal</h3>
            </Col></Row>

            <Container fluid className="bg-white sp-session-list-container rounded-1">
              {/*<Row><Col>*/}
              {/*  <SciencePortalStats/>*/}
              {/*</Col></Row>*/}
              <Row><Col>
                <div className="sp-title sp-panel-heading">Active Sessions
                  <span className="sp-header-button">
                    <OverlayTrigger
                      key="top"
                      placement="top"
                      className="sp-b-tooltip"
                      overlay={
                        <Tooltip className="sp-b-tooltip">
                          refresh session list
                        </Tooltip>
                      }
                      >
                      <Button size="sm" variant="outline-primary" className="sp-session-reload">
                        <FontAwesomeIcon icon={faRefresh}/>
                      </Button>
                    </OverlayTrigger>
                  </span>
                </div>
              </Col></Row>

              {/*  attribute "animated" can be put on for when app is busy */}
              {/* height is controlled by div.progress css */}
              <Row><Col>
                { this.state.pageState.spSessionList.progressBar.animated === true && <ProgressBar variant={this.state.pageState.spSessionList.progressBar.type} now={100}
                                                                                     animated className="sp-progress-bar" /> }
                { this.state.pageState.spSessionList.progressBar.animated === false && <ProgressBar variant={this.state.pageState.spSessionList.progressBar.type} now={100}
                                                                                      className="sp-progress-bar" /> }
                {this.state.pageState.spSessionList.alert !== undefined && this.state.pageState.spSessionList.alert.show === true &&
                    <Alert key={this.state.pageState.spSessionList.alert.type} variant={this.state.pageState.spSessionList.alert.type}>
                      {this.state.pageState.spSessionList.alert.message} </Alert> }
               </Col></Row>


              <Row xs={1} md={3} className="g-4">

                { Object.keys(this.state.sessionData.sessData).length !== 0 &&
                  <>
                  {this.state.sessionData.sessData.map(mapObj => (
                      <Col key={mapObj.id} className="sp-card-container">
                        <SessionItem
                          listType="list"
                          sessData={mapObj}
                        />
                      </Col>
                    ))}
                  </>
                }
                { this.state.sessionData.listType === "loading" &&
                  <Col className="sp-card-container">
                    <SessionItem listType="loading"/>
                  </Col>
                }
                { this.state.sessionData.listType === "empty" &&
                  <Col className="sp-card-container">
                    <SessionItem listType="empty"/>
                  </Col>
                }
              </Row>

            </Container>

            <Container fluid className="bg-white sp-container rounded-1">
              {/*<Row><Col>*/}
              {/*  <div className="sp-title sp-panel-heading">New Session</div>*/}
              {/*</Col></Row>*/}

              <Row>
                <Col sm={7}>
                  <Card>

                    {/*<Card.Title>*/}
                    {/*  New Session*/}
                    {/*</Card.Title>*/}
                    <Card.Body>
                      <Row><Col>
                        <div className="sp-title sp-panel-heading">
                        New Session
                        </div>

                        { this.state.pageState.spForm.progressBar.animated === true && <ProgressBar variant={this.state.pageState.spForm.progressBar.type} now={100}
                                                                                             animated className="sp-progress-bar" /> }
                        { this.state.pageState.spForm.progressBar.animated === false && <ProgressBar variant={this.state.pageState.spForm.progressBar.type} now={100} className="sp-progress-bar" /> }
                        {this.state.pageState.spForm.alert.show === true &&
                            <Alert key={this.state.pageState.spForm.alert.type} variant={this.state.pageState.spForm.alert.type}>
                              {this.state.pageState.spForm.alert.message} </Alert> }
                      </Col></Row>

                  <SciencePortalForm fData={this.state.fData}/>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={5}>
                  <Card>
                    <Card.Body>
                    {/*<Card.Title>*/}

                    {/*</Card.Title>*/}
                    {/*<Card.Body>*/}
                      <Row><Col>
                        <div className="sp-title sp-panel-heading">
                          Platform Load
                          <span className="sp-header-button">
                    <OverlayTrigger
                        key="top"
                        placement="top"
                        className="sp-b-tooltip"
                        overlay={
                          <Tooltip className="sp-b-tooltip">
                            refresh statistics
                          </Tooltip>
                        }
                    >
                      <Button size="sm" variant="outline-primary" className="sp-e-stats-reload sp-session-stats"
                      onClick={this.state.globalStats.refreshHandler}>
                        <FontAwesomeIcon icon={faRefresh}/>
                      </Button>
                    </OverlayTrigger>
                  </span>
                        </div>
                        { this.state.pageState.spGlobalStats.progressBar.animated === true && <ProgressBar variant={this.state.pageState.spGlobalStats.progressBar.type} now={100}
                                                                                                    animated className="sp-progress-bar" /> }
                        { this.state.pageState.spGlobalStats.progressBar.animated === false && <ProgressBar variant={this.state.pageState.spGlobalStats.progressBar.type} now={100} className="sp-progress-bar" /> }
                        {this.state.pageState.spGlobalStats.alert.show === true &&
                            <Alert key={this.state.pageState.spGlobalStats.alert.type} variant={this.state.pageState.spGlobalStats.alert.type}>
                              {this.state.pageState.spGlobalStats.alert.message} </Alert> }

                      </Col></Row>
                  <SciencePortalPlatformLoad stats={this.state.globalStats}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>


            </Container>
            {/* Modals, rendered as needed, set in the this.state object */}
            {this.state.modalData.msg !== undefined &&
              <SciencePortalModal modalData={this.state.modalData} baseURLCanfar={this.state.urls.baseURLcanfar}/> }

            {this.state.confirmModalData.dynamicProps.isOpen === true &&
              <SciencePortalConfirm modalData={this.state.confirmModalData.dynamicProps} handlers={this.state.confirmModalData.handlers}/>
            }

            {authModal}
          </Container>
      </Container>

    );
  }

  componentDidMount () {
    // This runs after App.js has rendered. Important that it executes
    // because if the javascript objects that drive this app try to
    // start up before this react app has finished rendering, the portal
    // won't work.
    // At page load, after the first time the app is rendered,
    // an object needs to be set as a window reference
    // so the javascript controlling this view can find it.
    // window.runStartupTasks() is defined in the index file
    // (either index.html for local deployment, or index.jsp for
    // war file deployment
    if (window.SciencePortalApp === undefined ) {
      window.SciencePortalApp = this;
      window.runStartupTasks();
    }
  }

}

export default SciencePortalApp;

// ========================================

// science-portal hook is "react-mountpoint", found in index.html for the public folder (local work)
// and in index.jsp for the war file distribution
const root = ReactDOM.createRoot(document.getElementById("react-mountpoint"));

// ref= value here is setting the window.SciencePortalApp hook so the program
// this is embedded in can inject data and listen to DOM events
root.render(<SciencePortalApp ref={SciencePortalApp => { window.SciencePortalApp = SciencePortalApp }} />);
