import React from 'react';
import '../index.css';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Placeholder from 'react-bootstrap/Placeholder';
import Popover from 'react-bootstrap/Popover';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../auth/useAuth';
import NewSessionForm from './forms/NewSessionForm';

const renderPopover = (headerText: string, bodyText: string) => {
  return (
    <OverlayTrigger
      trigger="click"
      key="top"
      placement="top"
      rootClose={true}
      overlay={
        <Popover id={`popover-positioned-top`}>
          <Popover.Header as="h3">{headerText}</Popover.Header>
          <Popover.Body className="sp-form">{bodyText}</Popover.Body>
        </Popover>
      }
    >
      <FontAwesomeIcon
        className="sp-form-cursor popover-blue"
        icon={faQuestionCircle}
      />
    </OverlayTrigger>
  );
};
const renderPlaceholder = () => {
  return (
    <Col md={6}>
      <Placeholder className="sp-form-p" as="p" animation="glow">
        <Placeholder
          className="sp-form-placeholder"
          bg="secondary"
          md={12}
          sz="sm"
        />
      </Placeholder>
    </Col>
  );
};
const SciencePortalForm = () => {
  /*constructor(props) {
    super(props);
    selectedRAM = '';
    selectedCores = '';
    if (typeof props.fData.contextData !== 'undefined') {
      selectedRAM = props.fData.contextData.defaultRAM;
      selectedCores = props.fData.contextData.defaultCores;
    }
    state = {
      fData: props.fData,
      selectedRAM: selectedRAM,
      selectedCores: selectedCores,
    };
    handleChange = handleChange.bind(this);
    resetForm = resetForm.bind(this);
  }*/

  const { state } = useAuth();

  /*const handleChange(event) {
    // Entire session form state data object needs to be put back
    // into the form on session name input change or the
    // form can't render
    var tmpData = state.fData;
    tmpData.sessionName = event.target.value;
    setState({ fData: tmpData });
  }*/

  /*handleRAMChange(event) {
    setState({
      selectedRAM: event.target.value,
    });
  }*/

  /*handleCoresChange(event) {
    setState({
      selectedCores: event.target.value,
    });
  }*/

  /*  resetForm(event) {
    event.stopPropagation();

    setState({
      selectedCores: state.fData.contextData.defaultCores,
      selectedRAM: state.fData.contextData.defaultRAM,
    });
    state.fData.resetHandler();
  }*/

  /*  static getDerivedStateFromProps(props, state) {
    console.log(`getDerivedStateFromProps()`);
    if (props.fData !== state.fData) {
      console.log(`getDerivedStateFromProps(): OK`);
      return { fData: props.fData };
    } else {
      console.log(`getDerivedStateFromProps(): IGNORING`);
      return null;
    }
  }*/

  /*  componentDidUpdate(nextProps) {
    console.log('componentDidUpdate()');
    if (props.fData !== nextProps.fData) {
      console.log(`componentDidUpdate(): OK`);
      setState({
        fData: nextProps.fData,
      });
    } else {
      console.log(`componentDidUpdate(): IGNORING`);
    }
  }*/

  // For now, these are the only fields conditionally displayed
  // per session type, so they'll be handled simply
  // They are parsed out of the session json data in science_portal_form.js
  let showRAM = false;
  let showCores = false;
  if (state.fData?.formFields?.showRAM) {
    showRAM = state.fData.formFields.showRAM;
  }

  showCores = false;
  if (state.fData?.formFields?.showCores) {
    showCores = state.fData.formFields.showCores;
  }

  return (
    <>
      <NewSessionForm />
      {state.fData?.imageList && (
        <Form onSubmit={state.fData.submitHandler} className="sp-form">
          <Row className="sp-form-row">
            <Col sm={4}>
              <Form.Label className="sp-form-label">
                type
                {renderPopover(
                  'Session Type',
                  'Select from the list of supported session types',
                )}
              </Form.Label>
            </Col>
            <Col sm={7}>
              <Form.Select
                value={state.fData.selectedType}
                onChange={state.fData.changeTypeHandler}
                name="type"
                size="sm"
                className="sp-form-cursor"
              >
                {state.fData.types.map((mapObj) => (
                  <option
                    className="sp-form"
                    key={mapObj}
                    name={mapObj}
                    value={mapObj}
                  >
                    {mapObj}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="sp-form-row">
            <Col sm={4}>
              <Form.Label className="sp-form-label">
                container image
                {renderPopover(
                  'Container Image',
                  'The Docker image for the session.',
                )}
              </Form.Label>
            </Col>
            <Col sm={7}>
              <Form.Select name="image" className="sp-form-cursor">
                {state.fData.imageList.map((mapObj) => (
                  <option className="sp-form" key={mapObj.id} value={mapObj.id}>
                    {mapObj.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Row className="sp-form-row">
            <Col sm={4}>
              <Form.Label className="sp-form-label">
                name
                {renderPopover(
                  'Session Name',
                  "Name for the session. Alphanumeric and '-' characters only.",
                )}
              </Form.Label>
            </Col>
            <Col sm={7}>
              <Form.Control
                type="text"
                maxLength={15}
                placeholder="Enter session name"
                value={state.fData.sessionName}
                onChange={() => null}
                name="name"
                className="sp-form-input"
              />
            </Col>
          </Row>
          {showRAM && (
            <Row className="sp-form-row">
              <Col sm={4}>
                <Form.Label className="sp-form-label">
                  memory
                  {renderPopover('Memory', 'System memory (RAM) in gigabytes.')}
                </Form.Label>
              </Col>
              <Col sm={7}>
                <Form.Select
                  value={
                    state.selectedRAM || state.fData.contextData.defaultRAM
                  }
                  name="ram"
                  className="sp-form-cursor"
                  onChange={() => null}
                >
                  {state.fData.contextData.availableRAM.map((mapObj) => (
                    <option key={mapObj} value={mapObj}>
                      {mapObj}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}
          {showCores && (
            <Row className="sp-form-row">
              <Col sm={4}>
                <Form.Label className="sp-form-label">
                  # cores
                  {renderPopover(
                    '# of Cores',
                    'Number of cores used by the session. Default: 2',
                  )}
                </Form.Label>
              </Col>
              <Col sm={7}>
                <Form.Select
                  name="cores"
                  className="sp-form-cursor"
                  value={
                    state.selectedCores || state.fData.contextData.defaultCores
                  }
                  onChange={() => null}
                >
                  {state.fData.contextData.availableCores.map((mapObj) => (
                    <option key={mapObj} value={mapObj}>
                      {mapObj}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          )}
          <Row className="sp-form-row">
            <Col sm={4}>
              {/* placeholder column so buttons line up with form entry elements */}
            </Col>
            <Col sm={7}>
              <Button
                variant="primary"
                type="submit"
                size="sm"
                className="sp-form-button"
              >
                Launch
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => null}
                className="sp-reset-button"
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      )}

      {!state.fData?.imageList && (
        <Form className="sp-form">
          <Row className="sp-form-row">
            <Col className="sp-placeholder" sm={3}>
              <Form.Label className="sp-form-label">
                type
                {renderPopover(
                  'Session Type',
                  'Select from the list of supported session types',
                )}
              </Form.Label>
            </Col>
            {renderPlaceholder()}
          </Row>
          <Row className="sp-form-row">
            <Col className="sp-placeholder" sm={3}>
              <Form.Label className="sp-form-label">
                container image
                {renderPopover(
                  'Container Image',
                  'Reference to an image to use to start the session container',
                )}
              </Form.Label>
            </Col>
            {renderPlaceholder()}
          </Row>
          <Row className="sp-form-row">
            <Col className="sp-placeholder" sm={3}>
              <Form.Label className="sp-form-label">
                name
                {renderPopover(
                  'Session Name',
                  'Name for the session. Default name reflects the current number of sessions of the selected type.\n' +
                    'Alphanumeric characters only. 15 character maximum.',
                )}
              </Form.Label>
            </Col>
            {renderPlaceholder()}
          </Row>
          <Row className="sp-form-row">
            <Col className="sp-placeholder" sm={3}>
              <Form.Label className="sp-form-label">
                memory
                {renderPopover(
                  'Memory',
                  'System memory (RAM) to be used for the session. Default: 16G',
                )}
              </Form.Label>
            </Col>
            {renderPlaceholder()}
          </Row>
          <Row className="sp-form-row">
            <Col className="sp-placeholder" sm={3}>
              <Form.Label className="sp-form-label">
                # cores
                {renderPopover(
                  '# of Cores',
                  'Number of cores used by the session. Default: 2',
                )}
              </Form.Label>
            </Col>
            {renderPlaceholder()}
          </Row>

          <Row className="sp-form-row">
            <Col sm={3}>
              {/* placeholder column so buttons line up with form entry elements */}
            </Col>
            <Col className="sp-button-placeholder-row" md={6}>
              <Placeholder.Button
                className="sp-button-placeholder"
                bg="secondary"
                aria-hidden="true"
                animation="glow"
              />
              <Placeholder.Button
                className="sp-button-placeholder"
                bg="secondary"
                aria-hidden="true"
                animation="glow"
              />
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default SciencePortalForm;
