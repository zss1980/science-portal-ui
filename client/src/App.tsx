// Libs
import * as React from 'react';
/*
import { useState } from 'react'*/

// Components
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh';

// Canfar components
import CanfarLoginModal from './components/canfar/CanfarLoginModal';
import CanfarNavbar from './components/canfar/CanfarNavbar';

/* import SRCLoginModal from "./components/SRCLoginModal";
import SRCNavbar from "./components/SRCNavbar"; */
import SessionItem from './components/SessionItem'; /*
import SciencePortalConfirm from "./components/SciencePortalConfirm"*/
import SciencePortalForm from './components/SciencePortalForm'; /*
import SciencePortalModal from "./components/SciencePortalModal";*/
import SciencePortalPlatformLoad from './components/SciencePortalPlatformLoad';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';

// hooks
import { useAuth } from './auth/useAuth';
import { fetchRunningSessions, fetchStatsData } from './auth/fetchData';
import {
  AVAILABLE_IMAGES,
  OUTAGE,
  RUNNING_SESSION,
  SESSION_STATS,
} from './auth/constants';
import {
  ACTIVE_SESSION_SERVICES,
  getAlerts,
  getProgressBarVariant,
  NEW_SESSION_SERVICES,
  STATS_SERVICES,
} from './utilities/appUI';
import StatusModal from './components/common/StatusModal';
import DeleteSessionModal from './components/common/DeleteSessionModal';
import { Service } from './auth/types';

const App = () => {
  const { state, dispatch } = useAuth();

  const refreshStats = () => {
    fetchStatsData(state.cookie.cookie, dispatch);
  };
  const refreshSessions = () => {
    fetchRunningSessions(state.cookie.cookie, dispatch);
  };

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

  const newSessionAlerts = getAlerts(state, NEW_SESSION_SERVICES);
  const activeSessionAlerts = getAlerts(state, ACTIVE_SESSION_SERVICES);
  const activeStatsAlerts = getAlerts(state, STATS_SERVICES);

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
                      onClick={refreshSessions}
                    >
                      <FontAwesomeIcon icon={faRefresh} />
                    </Button>
                  </OverlayTrigger>
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <ProgressBar
                variant={getProgressBarVariant(
                  state.services_statuses[RUNNING_SESSION].status,
                )}
                now={100}
                animated={state.loading[RUNNING_SESSION]}
                className="sp-progress-bar"
              />
              {activeSessionAlerts.map((alert, index) => (
                <Alert
                  key={`${alert.status} + index`}
                  variant={getProgressBarVariant(alert.status)}
                >
                  {alert.message}{' '}
                </Alert>
              ))}
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
            {state.loading[RUNNING_SESSION] && (
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
            <Col sm={7}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
                      <div className="sp-title sp-panel-heading">
                        New Session{' '}
                        <span className="sp-header-button small">
                          <a
                            className="small"
                            href="https://www.opencadc.org/science-containers/"
                          >
                            Help
                          </a>
                        </span>
                      </div>
                      <ProgressBar
                        variant={getProgressBarVariant(
                          state.services_statuses[AVAILABLE_IMAGES].status,
                        )}
                        now={100}
                        animated={state.loading[AVAILABLE_IMAGES]}
                        className="sp-progress-bar"
                      />
                      {newSessionAlerts.map((alert, index) => (
                        <Alert
                          key={`${alert.status} + index`}
                          variant={getProgressBarVariant(alert.status)}
                        >
                          {alert.message}{' '}
                        </Alert>
                      ))}
                    </Col>
                  </Row>

                  <SciencePortalForm />
                </Card.Body>
              </Card>
            </Col>
            <Col sm={5}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col>
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
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="sp-e-usage-reload sp-session-usage"
                              onClick={refreshStats}
                            >
                              <FontAwesomeIcon icon={faRefresh} />
                            </Button>
                          </OverlayTrigger>
                        </span>
                      </div>
                      <ProgressBar
                        variant={getProgressBarVariant(
                          state.services_statuses[SESSION_STATS].status,
                        )}
                        now={100}
                        animated={state.loading[SESSION_STATS]}
                        className="sp-progress-bar"
                      />

                      {activeStatsAlerts.map((alert, index) => (
                        <Alert
                          key={`${alert.status} + index`}
                          variant={getProgressBarVariant(alert.status)}
                        >
                          {alert.message}{' '}
                        </Alert>
                      ))}
                    </Col>
                  </Row>
                  <SciencePortalPlatformLoad usage={state.platformUsage} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        {/*
            { Modals, rendered as needed, set in the this.state object }
            {this.state.modalData.msg !== undefined &&
              <SciencePortalModal modalData={this.state.modalData} baseURLCanfar={this.state.urls.baseURLcanfar}/> }

            {this.state.confirmModalData.dynamicProps.isOpen === true &&
              <SciencePortalConfirm modalData={this.state.confirmModalData.dynamicProps} handlers={this.state.confirmModalData.handlers}/>
            */}
        {!state.isAuthenticated && <CanfarLoginModal />}
        {<StatusModal />}
        {<DeleteSessionModal />}
      </Container>
    </Container>
  );
};

export default App;
