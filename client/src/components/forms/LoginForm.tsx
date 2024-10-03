import React from 'react';
import { Form, Field } from 'react-final-form';
import { Form as BootstrapForm, Button, Alert } from 'react-bootstrap';

import { useAuth } from '../../auth/useAuth';

const FORM_ERROR = 'FROM_ERROR';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login } = useAuth();

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
          {submitError && <Alert variant="danger">{submitError}</Alert>}
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </Button>
        </BootstrapForm>
      )}
    />
  );
};

export default LoginForm;
