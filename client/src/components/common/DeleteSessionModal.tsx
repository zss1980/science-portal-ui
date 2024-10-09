import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

// Hooks
import { useAuth } from '../../auth/useAuth';
import { CLEAR_DELETE_SESSION_INFO } from '../../auth/constants';
import { fetchDeleteSession } from '../../auth/fetchData';

const DeleteSessionModal = () => {
  const {
    state: {
      deleteSessionInfo: { showModal, sessionName, sessionId },
      cookie,
    },
    dispatch,
  } = useAuth();

  const onClose = () => {
    dispatch({ type: CLEAR_DELETE_SESSION_INFO });
  };

  const onConfirm = () => {
    fetchDeleteSession(cookie.cookie, dispatch, sessionId);
  };

  return (
    <Modal show={showModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="sp-modal-header">Are you sure?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="st-modal-container">
        <p>
          Do you really want to delete this session? This process cannot be
          undone.
        </p>
        <p>
          Session name {sessionName}, id {sessionId}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default DeleteSessionModal;
