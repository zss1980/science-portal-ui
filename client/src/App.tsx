// Libs
import * as React from 'react';
/*
import { useState } from 'react'*/

// Components
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
//import ProgressBar from "react-bootstrap/ProgressBar";
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
//import Alert from "react-bootstrap/Alert";
//import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh';

// Canfar components
import CanfarLoginModal from './components/canfar/CanfarLoginModal';
import CanfarNavbar from './components/canfar/CanfarNavbar';

/* import SRCLoginModal from "./components/SRCLoginModal";
import SRCNavbar from "./components/SRCNavbar"; */
import SessionItem from './components/SessionItem'; /*
import SciencePortalConfirm from "./components/SciencePortalConfirm"
import SciencePortalForm from "./components/SciencePortalForm";
import SciencePortalModal from "./components/SciencePortalModal";
import SciencePortalPlatformLoad from "./components/SciencePortalPlatformLoad";*/

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';

// hooks
import { useAuth } from './auth/useAuth';

const App = () => {
  const { state } = useAuth();

  /*  let isAuthenticated = true
  if (typeof this.state.userInfo.isAuth !== "undefined") {
    isAuthenticated = this.state.userInfo.isAuth
  }

  const name = (typeof this.state.userInfo.name !== "undefined") ? this.state.userInfo.name : "Login"
 
  let navbar
  let authModalImplementation
   if (this.state.themeName === "src") {
    navbar = <SRCNavbar isAuthenticated={isAuthenticated}
                        authenticatedUser={name}
                        bannerText={this.state.bannerText} />

    authModalImplementation = <SRCLoginModal isOpen={true}
                                             submitHandler={this.state.userInfo.loginHandler}
                                             errMsg={this.state.userInfo.errMsg}/>
  } else { 
    navbar = <CanfarNavbar headerURLs={[]}
                           isAuthenticated={state.isAuthenticated}
                           authenticatedUser={state.user.username}
                           bannerText={'banner'} />

    authModalImplementation = <CanfarLoginModal isOpen={true}
                                                modalURLs={null}
                                                submitHandler={null}
                                                errMsg={'error'}/>
  } */

  return (
    <Container fluid className="bg-white">
      <CanfarNavbar />
      <Container fluid className="sp-body">
        <Row>
          <Col>
            <h3 className="sp-page-header">Science Portal</h3>
          </Col>
        </Row>

        <Container
          fluid
          className="bg-white sp-session-list-container rounded-1"
        >
          <Row>
            <Col>
              <div className="sp-title sp-panel-heading">
                Active Sessions
                <span className="sp-header-button">
                  <OverlayTrigger
                    placement="top"
                    className="sp-b-tooltip"
                    overlay={
                      <Tooltip className="sp-b-tooltip">
                        refresh session list
                      </Tooltip>
                    }
                  >
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="sp-session-reload"
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </Button>
                  </OverlayTrigger>
                </span>
              </div>
            </Col>
          </Row>

          {/*  attribute "animated" can be put on for when app is busy */}
          {/* height is controlled by div.progress css */}
          <Row>
            <Col>
              {/*this.state.pageState.spSessionList.progressBar.animated === true && <ProgressBar variant={this.state.pageState.spSessionList.progressBar.type} now={100}
                                                                                     animated className="sp-progress-bar" /> }
                { this.state.pageState.spSessionList.progressBar.animated === false && <ProgressBar variant={this.state.pageState.spSessionList.progressBar.type} now={100}
                                                                                      className="sp-progress-bar" /> */}
              {/*this.state.pageState.spSessionList.alert !== undefined && this.state.pageState.spSessionList.alert.show === true &&
                    <Alert key={this.state.pageState.spSessionList.alert.type} variant={this.state.pageState.spSessionList.alert.type}>
                      {this.state.pageState.spSessionList.alert.message} </Alert> */}
            </Col>
          </Row>

          <Row xs={1} md={3} className="g-4">
            {state.sessions.length !== 0 && (
              <>
                {state.sessions.map((mapObj) => (
                  <Col key={mapObj.id} className="sp-card-container">
                    <SessionItem listType="list" session={mapObj} />
                  </Col>
                ))}
              </>
            )}
            {state.isLoading && (
              <Col className="sp-card-container">
                <SessionItem listType="loading" />
              </Col>
            )}
            {state.sessions.length === 0 && (
              <Col className="sp-card-container">
                <SessionItem listType="empty" />
              </Col>
            )}
          </Row>
        </Container>

        <Container fluid className="bg-white sp-container rounded-1">
          <Row>
            {' '}
            {/*
                <Col sm={7}>
                  <Card>
                     <Card.Body>
                      <Row><Col>
                        <div className="sp-title sp-panel-heading">New Session <span className="sp-header-button small"><a className="small" href="https://www.opencadc.org/science-containers/">Help</a></span></div>
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
                              <Button size="sm" variant="outline-primary" className="sp-e-usage-reload sp-session-usage"
                              onClick={this.state.platformUsage.refreshHandler}>
                                <FontAwesomeIcon icon={faRefresh}/>
                              </Button>
                            </OverlayTrigger>
                          </span>
                        </div>
                        { this.state.pageState.spPlatformUsage.progressBar.animated === true && <ProgressBar variant={this.state.pageState.spPlatformUsage.progressBar.type} now={100}
                                                                                                    animated className="sp-progress-bar" /> }
                        { this.state.pageState.spPlatformUsage.progressBar.animated === false && <ProgressBar variant={this.state.pageState.spPlatformUsage.progressBar.type} now={100} className="sp-progress-bar" /> }
                        {this.state.pageState.spPlatformUsage.alert.show === true &&
                            <Alert key={this.state.pageState.spPlatformUsage.alert.type} variant={this.state.pageState.spPlatformUsage.alert.type}>
                              {this.state.pageState.spPlatformUsage.alert.message} </Alert> }

                      </Col></Row>
                      <SciencePortalPlatformLoad usage={this.state.platformUsage}/>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>


            </Container>
            { Modals, rendered as needed, set in the this.state object }
            {this.state.modalData.msg !== undefined &&
              <SciencePortalModal modalData={this.state.modalData} baseURLCanfar={this.state.urls.baseURLcanfar}/> }

            {this.state.confirmModalData.dynamicProps.isOpen === true &&
              <SciencePortalConfirm modalData={this.state.confirmModalData.dynamicProps} handlers={this.state.confirmModalData.handlers}/>
            */}
          </Row>
          {!state.isAuthenticated && <CanfarLoginModal />}
        </Container>
      </Container>
    </Container>
  );
};

export default App;
