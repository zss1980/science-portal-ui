import React from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../auth/useAuth';

const GROUP_MANAGEMENT_URI = 'ivo://cadc.nrc.ca/groups';
const ADVANCED_SEARCH_URI = 'ivo://cadc.nrc.ca/search';
const ACCOUNT_UPDATE_URI = 'ivo://cadc.nrc.ca/acctupdate';
const PASSWORD_CHANGE_URI = 'ivo://cadc.nrc.ca/passchg';

interface Props {
  bannerText?: string;
}

const CanfarNavbar = (props: Props) => {
  const { state } = useAuth();
  console.log(state);
  const renderButton = () => {
    return (
      <Button size="sm" variant="outline-primary">
        {state.user.username}
        <span className="sp-buffer-span-left">
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
      </Button>
    );
  };

  const renderLoginButton = () => {
    return (
      <Button size="sm" variant="outline-primary">
        Login
        <span className="sp-buffer-span-left">
          <FontAwesomeIcon icon={faCaretDown} />
        </span>
      </Button>
    );
  };

  const baseURLCanfar = state.appSettings?.headerURLs?.baseURLCanfar;

  return (
    <div className="canfar-header">
      <Navbar expand="md">
        <Container fluid>
          <Navbar.Brand href={baseURLCanfar}>
            <img src="https://www.canfar.net/css/images/logo.png"></img>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href={baseURLCanfar + '/en/docs/quick_start/'}>
                Documentation
              </Nav.Link>
              <NavDropdown title="Services">
                <NavDropdown.Item
                  href={baseURLCanfar + '/storage/list'}
                  target="_blank"
                >
                  Storage Management
                </NavDropdown.Item>
                <NavDropdown.Item
                  href={state.appSettings?.headerURLs?.[GROUP_MANAGEMENT_URI]}
                  target="_blank"
                >
                  Group Management
                </NavDropdown.Item>
                <NavDropdown.Item
                  href={baseURLCanfar + '/citation'}
                  target="_blank"
                >
                  Data Publication
                </NavDropdown.Item>
                <NavDropdown.Item
                  href={baseURLCanfar + '/science-portal'}
                  target="_blank"
                >
                  Science Portal
                </NavDropdown.Item>
                <NavDropdown.Item
                  href={state.appSettings?.headerURLs?.[ADVANCED_SEARCH_URI]}
                  target="_blank"
                >
                  CADC Search
                </NavDropdown.Item>
                <NavDropdown.Item
                  href="https://arbutus-canfar.cloud.computecanada.ca"
                  target="_blank"
                >
                  OpenStack Cloud
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href={baseURLCanfar + '/en/about/organization/'}>
                About
              </Nav.Link>
              <Nav.Link href="https://github.com/opencadc">
                Open Source
              </Nav.Link>
              <NavDropdown title="Support">
                <NavDropdown.Item
                  href="mailto:support@canfar.net"
                  target="_blank"
                >
                  Help
                </NavDropdown.Item>
                <NavDropdown.Item
                  href={baseURLCanfar + '/slack'}
                  target="_blank"
                >
                  Join us on Slack
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>

            {!state.isAuthenticated && (
              <NavDropdown
                align="end"
                title={renderLoginButton()}
                className="sp-auth-dropdown"
              >
                <NavDropdown.Item></NavDropdown.Item>
              </NavDropdown>
            )}
            {state.isAuthenticated && (
              <NavDropdown
                align="end"
                title={renderButton()}
                id="authenticated_nav_dropdown"
                className="sp-auth-dropdown"
              >
                <NavDropdown.Item
                  href={state.appSettings?.headerURLs?.[ACCOUNT_UPDATE_URI]}
                  target="_blank"
                >
                  Update Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                  href={state.appSettings?.headerURLs?.[PASSWORD_CHANGE_URI]}
                  target="_blank"
                >
                  Reset Password
                </NavDropdown.Item>
                <NavDropdown.Item href="https://www.cadc-ccda.hia-iha.nrc-cnrc.gc.ca/cred/priv?daysValid=30">
                  Obtain Certificate
                </NavDropdown.Item>
                <NavDropdown.Item
                  href={
                    baseURLCanfar +
                    '/access/logout?target=' +
                    baseURLCanfar +
                    '/science-portal/'
                  }
                >
                  <span className="sp-buffer-span-right">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                  </span>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {props.bannerText && (
        <Card className="sp-warning-card">
          <div className="sp-warn-heading"></div>
          <div className="sp-warn-body">
            <p>{props.bannerText}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CanfarNavbar;
