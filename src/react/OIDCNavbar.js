import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Navbar from "react-bootstrap/Navbar";


class OIDCNavbar extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        isAuthenticated: props.isAuthenticated,
        authenticatedUser: props.authenticatedUser,
        logoURL: props.logoURL
      }
    }

    // This function allows data to move through and re-render
    // children using this data
    componentWillReceiveProps(nextProps) {
      this.setState(nextProps);
    }

    render() {
      var showBanner = false
      if (typeof this.props.bannerText !== "undefined"
        && this.props.bannerText !== "") {
        showBanner = true
      }

      return (
        <div className="canfar-header">
        <Navbar expand="md">
          <Container fluid>
            <Navbar.Brand><img src={this.state.logoURL} style={{maxWidth: 256 + 'px'}}></img></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
              {this.state.isAuthenticated === true &&
                <span align="end">{this.state.authenticatedUser}</span>
              }
          </Container>
        </Navbar>
          {showBanner &&
          <Card className="sp-warning-card">
            <div className="sp-warn-heading"></div>
            <div className="sp-warn-body">
              <p>{this.props.bannerText}</p>
            </div>
          </Card>
          }
          </div>
      )
    }
}

export default OIDCNavbar;



