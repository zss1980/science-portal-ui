import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

// Hooks
import { useAuth } from '../../auth/useAuth';
import {
  AUTHENTICATING,
  AVAILABLE_IMAGES,
  CREATE_SESSION,
  DELETE_SESSION,
  RUNNING_SESSION,
  SESSION_STATS,
} from '../../auth/constants';
import { UiLoading } from '../../auth/types';

const PLATFORM_LOADING_STEPS: {
  label: string;
  message: string;
  value: UiLoading;
}[] = [
  {
    label: 'Initializing...',
    value: AUTHENTICATING,
    message: 'Checking user credentials...',
  },
  {
    label: 'Fetching sessions...',
    value: RUNNING_SESSION,
    message: 'Checking user sessions...',
  },
  {
    label: 'Loading images...',
    value: AVAILABLE_IMAGES,
    message: 'Checking available images...',
  },
  {
    label: 'Checking platform...',
    value: SESSION_STATS,
    message: 'Retrieving platform usage data...',
  },
  {
    label: 'Request session',
    value: CREATE_SESSION,
    message: 'Requesting session...',
  },
  {
    label: 'Delete session',
    value: DELETE_SESSION,
    message: 'Deleting session...',
  },
];

const StatusModal = () => {
  const { state } = useAuth();
  const [status, setStatus] = React.useState<null | {
    header: string;
    message: string;
  }>(null);

  React.useEffect(() => {
    let hasFinished = true;
    for (let plStep of PLATFORM_LOADING_STEPS) {
      if (state.loading[plStep.value]) {
        setStatus({
          header: plStep.label,
          message: plStep.message,
        });
        hasFinished = false;
        break;
      }
    }
    if (hasFinished) {
      setStatus(null);
    }
  }, [state, state.loading]);

  if (!status) {
    return null;
  }
  return (
    <Modal show={!!status} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="sp-modal-header">{status.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="st-modal-container">
        <Spinner animation="border" variant="primary" size="sm" />
        {status.message}
      </Modal.Body>
      <Modal.Footer> </Modal.Footer>
    </Modal>
  );
};
export default StatusModal;
