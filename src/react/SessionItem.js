import React from 'react';
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt'

import './css/index.css';
import './sp-session-list.css';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";

function SessionItem(props) {

  // Set up badging colours
  var bgClass = ""
  var showSpinner = false

  var uberCSS = ""
  var cardCSS = "sp-e-session-card"
  var connectCSS = "sp-e-session-connect"
  var deleteCSS = "sp-card-text sp-e-session-delete"

  if (props.listType === "list") {
    if (props.sessData.status === "Running") {
      bgClass = "success"
    } else if (props.sessData.status === "Pending") {
      // Set CSS and control for pending state, to block
      // cursor events and show progress cursor when
      // item is hovered over
      bgClass = "secondary"
      var pendingCSS = " sp-pending"
      showSpinner = true
      cardCSS = cardCSS + pendingCSS
      connectCSS = connectCSS + pendingCSS
      deleteCSS = deleteCSS + pendingCSS
      uberCSS = "sp-pending-cursor"
    } else {
      bgClass = "secondary"
    }
  }

  return (
    <>
      {props.listType === "list" &&
      <Card className={uberCSS}>
        <Card.Body className={cardCSS}>
          <div className={connectCSS}
            onClick={props.sessData.connectHandler}
            data-connecturl={props.sessData.connectURL}>
            <Row><Col>
              <Card.Header className="sp-float-left-full">
                <img className="sp-icon-img" src={props.sessData.logo} alt={props.sessData.altText}></img>
                <span className="sp-session-name">{props.sessData.name}</span>
              </Card.Header>
            </Col></Row>
            <Row><Col>
              <div className="sp-card-pill sp-card-text">
                {/* For next pass */}
                {/*<Badge pill bg="warning">Expiring Soon</Badge>*/}
                <span className="sp-session-spinner">{showSpinner === true && <Spinner animation="border" variant="primary" size="sm"/> }</span>

                <Badge pill bg={bgClass}>{props.sessData.status}</Badge>
              </div>
            </Col></Row>
            <Row><Col>
              <div className="sp-card-text">{props.sessData.image}</div>
              <br/>
              {/* For next pass */}
              {/*<div className="sp-card-text">cores: {props.sessData.cores} &nbsp; RAM: {props.sessData.RAM}</div><br/>*/}
            </Col></Row>
            <Row><Col>
              <div className="sp-card-text">up since: {props.sessData.startTime}</div>
              <br/>
            </Col></Row>
          </div>
          <Row><Col>
            <div className="sp-card-button">
              <OverlayTrigger
                key="top"
                placement="top"
                className="sp-b-tooltip"
                overlay={
                  <Tooltip className="sp-b-tooltip">
                    delete session
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  onClick={props.sessData.deleteHandler}
                  data-id={props.sessData.id}
                  data-name={props.sessData.name}
                  className={deleteCSS}
                  icon={faTrashAlt}/>
              </OverlayTrigger>
            </div>

            <br/>
          </Col></Row>
        </Card.Body>
      </Card>
      }
      {props.listType === "loading" &&
        <>
          <Card>
            <Card.Body>
              <Row className="sp-title-placeholder"><Col>
                <Placeholder className="sp-form-p" as={Card.Header} animation="glow">
                  <Placeholder className="sp-form-placeholder" xs={12} />
                </Placeholder>
              </Col></Row>

              <Placeholder className="sp-form-p"  as={Card.Text} animation="glow">
                <Placeholder className="sp-form-placeholder" xs={12} /> <Placeholder xs={12} />
                <Placeholder className="sp-form-placeholder" xs={12} /> <Placeholder xs={12} />{" "}
              </Placeholder>

            </Card.Body>
          </Card>
        </>
      }
      {props.listType === "empty" &&
      <>
        <Card className="sp-emptylist-card">
          <Card.Body>
            <Row ><Col>
              <Card.Title>
                <em>No interactive sessions found</em>
              </Card.Title>
            </Col></Row>
          </Card.Body>
        </Card>
      </>
      }
      </>
);
}

export default SessionItem;
