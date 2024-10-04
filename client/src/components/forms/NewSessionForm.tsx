import React from 'react';
import { Form, Field } from 'react-final-form';
import { Form as BootstrapForm, Button } from 'react-bootstrap';
import { useAuth } from '../../auth/useAuth';
import { getImagesNamesSorted } from '../../utilities/images';
import {
  NEW_SESSION_INITIAL_VALUES,
  PROP_AVAILABLE_CORES,
  PROP_AVAILABLE_RAM,
  VAL_CORES,
  VAL_IMAGE,
  VAL_INSTANCE_NAME,
  VAL_MEMORY,
  VAL_PROJECT,
  VAL_TYPE,
} from '../../auth/constants';

interface FormValues {
  project: string;
  type: string;
}

const NewSessionForm: React.FC = () => {
  const { state } = useAuth();
  const availableProjects = Object.keys(state.images);

  const onSubmit = async (values: FormValues) => {
    console.log(values);
    // Here you would typically handle the form submission
    alert(`Selected project: ${values.project}, Selected type: ${values.type}`);
  };

  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!values.project) {
      errors.project = 'Project is required';
    }
    if (!values.type) {
      errors.type = 'Type is required';
    }
    return errors;
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={NEW_SESSION_INITIAL_VALUES}
      render={({ handleSubmit, submitting, values }) => {
        return (
          <BootstrapForm onSubmit={handleSubmit}>
            <Field name={VAL_PROJECT}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Project</BootstrapForm.Label>
                  <BootstrapForm.Select
                    {...input}
                    isInvalid={meta.touched && meta.error}
                  >
                    <option value="">Select a project</option>
                    {availableProjects.map((prj) => (
                      <option key={prj} value={prj}>
                        {prj}
                      </option>
                    ))}
                  </BootstrapForm.Select>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_TYPE}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Type</BootstrapForm.Label>
                  <BootstrapForm.Select
                    {...input}
                    isInvalid={meta.touched && meta.error}
                    disabled={!values.project}
                  >
                    <option value="">Select a type</option>
                    {values.project &&
                      Object.keys(state.images[values.project]).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                  </BootstrapForm.Select>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_IMAGE}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Image</BootstrapForm.Label>
                  <BootstrapForm.Select
                    {...input}
                    isInvalid={meta.touched && meta.error}
                    disabled={!values.project}
                  >
                    <option value="">Select an image</option>
                    {values.project &&
                      values.type &&
                      getImagesNamesSorted(
                        Object.values(
                          state.images?.[values.project]?.[values.type],
                        ),
                      ).map((imageName: string) => (
                        <option key={imageName} value={imageName}>
                          {imageName}
                        </option>
                      ))}
                  </BootstrapForm.Select>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_INSTANCE_NAME}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Instance Name</BootstrapForm.Label>
                  <BootstrapForm.Control
                    {...input}
                    type="text"
                    placeholder="Instance name"
                    isInvalid={meta.touched && meta.error}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_MEMORY}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Memory</BootstrapForm.Label>
                  <BootstrapForm.Select
                    {...input}
                    isInvalid={meta.touched && meta.error}
                  >
                    <option value="">Select instance RAM</option>
                    {state.context?.[PROP_AVAILABLE_RAM]?.map((mem) => (
                      <option key={mem} value={mem}>
                        {mem}
                      </option>
                    ))}
                  </BootstrapForm.Select>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_CORES}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>Cores</BootstrapForm.Label>
                  <BootstrapForm.Select
                    {...input}
                    isInvalid={meta.touched && meta.error}
                  >
                    <option value="">Select instance number of cores</option>
                    {state.context?.[PROP_AVAILABLE_CORES]?.map((core) => (
                      <option key={core} value={core}>
                        {core}
                      </option>
                    ))}
                  </BootstrapForm.Select>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Button variant="primary" type="submit" disabled={submitting}>
              Submit
            </Button>
          </BootstrapForm>
        );
      }}
    />
  );
};

export default NewSessionForm;
