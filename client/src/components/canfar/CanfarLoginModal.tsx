//import React from "react";
//import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../../auth/useAuth';
import LoginForm from '../forms/LoginForm';

//const PASS_RESET_URI = "ivo://cadc.nrc.ca/passreset"
//const ACCOUNT_REQUEST_URI = "ivo://cadc.nrc.ca/acctrequest"

const CanfarLoginModal = () => {
  const { state } = useAuth();

  /*   constructor(props) {
    super(props)
    this.state = {
      isOpen: props.isOpen,
      modalURLs: props.modalURLs
    }
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  static getDerivedStateFromProps(nextProps, _prevState) {
    return nextProps;
  }

  componentDidUpdate(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        nextProps
      });
    }
  }

  closeModal = () => this.setState({ isOpen: false });

  render() {
    let show = false
    if (this.state.isOpen === true) {
      show = true
    }

    let errMsg = ""
    if (this.state.errMsg !== undefined) {
      errMsg = <div class="sp-error-msg"> {this.state.errMsg} </div>
    }

    let hideFormClass = "" */

  return (
    <>
      <Modal show={!state.isAuthenticated} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title className="sp-modal-header">
            Authentication required
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="sp-auth-form-body">
          <LoginForm />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CanfarLoginModal;
