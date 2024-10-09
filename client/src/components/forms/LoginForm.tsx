import React from 'react';
import { Form, Field } from 'react-final-form';
import { Form as BootstrapForm, Button, Alert } from 'react-bootstrap';
import { ModalFooter, ModalBody } from 'react-bootstrap';

import { useAuth } from '../../auth/useAuth';
import {
  ACCOUNT_REQUEST_URL,
  AUTHENTICATING,
  PASSWORD_RESET_URL,
} from '../../auth/constants';

const FORM_ERROR = 'FROM_ERROR';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { state, login } = useAuth();

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.username, values.password);
    } catch (error) {
      console.log(error);
      return { [FORM_ERROR]: 'Login failed. Please try again.' };
    }
  };

  const validate = (values: LoginFormValues) => {
    const errors: Partial<LoginFormValues> = {};
    if (!values.username) {
      errors.username = 'Username is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, submitError }) => (
        <BootstrapForm onSubmit={handleSubmit}>
          <ModalBody className="sp-auth-form-body">
            <Field name="username">
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Username</BootstrapForm.Label>
                  <BootstrapForm.Control
                    {...input}
                    type="text"
                    placeholder="Enter username"
                    isInvalid={meta.touched && meta.error}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name="password">
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Password</BootstrapForm.Label>
                  <BootstrapForm.Control
                    {...input}
                    type="password"
                    placeholder="Password"
                    isInvalid={meta.touched && meta.error}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <a
              href={PASSWORD_RESET_URL}
              className="account_access_info"
              tabIndex="5"
              title="Forgot Password"
            >
              Forgot your Account information?
            </a>
            <br />
            <a
              href={ACCOUNT_REQUEST_URL}
              className="account_access_info"
              tabIndex="6"
              title="Register"
            >
              Request a CADC Account
            </a>
          </ModalBody>
          <ModalFooter>
            {submitError && <Alert variant="danger">{submitError}</Alert>}
            <Button variant="primary" type="submit" disabled={submitting}>
              {state.loading[AUTHENTICATING] ? 'Logging in...' : 'Login'}
            </Button>
          </ModalFooter>
        </BootstrapForm>
      )}
    />
  );
};

export default LoginForm;
