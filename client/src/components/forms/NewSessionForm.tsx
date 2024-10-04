import React from 'react';
import { Form, Field } from 'react-final-form';
import {
  Form as BootstrapForm,
  Button,
  Row,
  Col,
  Placeholder,
} from 'react-bootstrap';
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
import {
  getDefaultSessionName,
  isCoresDisabled,
  isMemoryDisabled,
} from '../../utilities/form';
import { session_types as SESSION_TYPES } from '../../session/sessiontype_map_en.json';
import FormPopover from '../common/Popover';
import FieldPlaceholder from '../common/FieldPlaceholder';

interface FormValues {
  project: string;
  type: string;
  // Add other form values here
}

const NewSessionForm: React.FC = () => {
  const { state } = useAuth();
  const hasImages = state.images && Object.keys(state.images).length > 0;
  const availableProjects = Object.keys(state.images);
  const createSessionName = getDefaultSessionName(state.sessions.length + 1);

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
      render={({ handleSubmit, form, submitting, pristine, values }) => {
        return (
          <BootstrapForm onSubmit={handleSubmit}>
            <Field name={VAL_PROJECT}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Project
                    <FormPopover
                      headerText={'Project'}
                      bodyText={'The project within which an image created'}
                    />
                  </BootstrapForm.Label>
                  {hasImages ? (
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
                  ) : (
                    <FieldPlaceholder />
                  )}
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_TYPE}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Type
                    <FormPopover
                      headerText={'Session Type'}
                      bodyText={
                        'Select from the list of supported session types'
                      }
                    />
                  </BootstrapForm.Label>
                  {hasImages ? (
                    <BootstrapForm.Select
                      {...input}
                      isInvalid={meta.touched && meta.error}
                    >
                      <option value="">Select a type</option>
                      {Object.keys(state.images?.[values.project] ?? {}).map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ),
                      )}
                    </BootstrapForm.Select>
                  ) : (
                    <FieldPlaceholder />
                  )}
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_IMAGE}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Image
                    <FormPopover
                      headerText={'Container Image'}
                      bodyText={'The Docker image for the session.'}
                    />
                  </BootstrapForm.Label>
                  {hasImages ? (
                    <BootstrapForm.Select
                      {...input}
                      isInvalid={meta.touched && meta.error}
                    >
                      <option value="">Select an image</option>
                      {getImagesNamesSorted(
                        Object.values(
                          state.images?.[values.project]?.[values.type] ?? {},
                        ),
                      ).map((imageName: string) => (
                        <option key={imageName} value={imageName}>
                          {imageName}
                        </option>
                      ))}
                    </BootstrapForm.Select>
                  ) : (
                    <FieldPlaceholder />
                  )}
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field
              name={VAL_INSTANCE_NAME}
              initialValue={
                values?.[VAL_TYPE] ? createSessionName(values?.[VAL_TYPE]) : ''
              }
            >
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Name
                    <FormPopover
                      headerText={'Session Name'}
                      bodyText={
                        "Name for the session. Alphanumeric and '-' characters only."
                      }
                    />
                  </BootstrapForm.Label>
                  {hasImages ? (
                    <BootstrapForm.Control
                      {...input}
                      type="text"
                      placeholder="Instance name"
                      isInvalid={meta.touched && meta.error}
                    />
                  ) : (
                    <FieldPlaceholder />
                  )}
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_MEMORY}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    Memory
                    <FormPopover
                      headerText={'Memory'}
                      bodyText={'System memory (RAM) in gigabytes.'}
                    />
                  </BootstrapForm.Label>
                  {hasImages ? (
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
                  ) : (
                    <FieldPlaceholder />
                  )}
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Field name={VAL_CORES}>
              {({ input, meta }) => (
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>
                    # CPU Cores
                    <FormPopover
                      headerText={'# of Cores'}
                      bodyText={
                        'Number of cores used by the session. Default: 2'
                      }
                    />
                  </BootstrapForm.Label>
                  {hasImages ? (
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
                  ) : (
                    <FieldPlaceholder />
                  )}
                  <BootstrapForm.Control.Feedback type="invalid">
                    {meta.error}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              )}
            </Field>
            <Row className="mt-3">
              <Col xs={12} sm={6} className="mb-2 mb-sm-0">
                {hasImages ? (
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting || !hasImages}
                    className="w-100"
                  >
                    Launch
                  </Button>
                ) : (
                  <Placeholder.Button
                    className="sp-button-placeholder"
                    bg="primary"
                    aria-hidden="true"
                    animation="glow"
                  />
                )}
              </Col>
              <Col xs={12} sm={6}>
                {hasImages ? (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => form.reset()}
                    disabled={submitting || pristine || !hasImages}
                    className="w-100"
                  >
                    Reset
                  </Button>
                ) : (
                  <Placeholder.Button
                    className="sp-button-placeholder"
                    bg="secondary"
                    aria-hidden="true"
                    animation="glow"
                  />
                )}
              </Col>
            </Row>
          </BootstrapForm>
        );
      }}
    />
  );
};

export default NewSessionForm;
