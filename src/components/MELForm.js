import React, { Component } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";

class MELForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Formik
          initialValues={{ choice: "" }}
          validate={(values) => {
            let errors = {};
            if (!values.choice) {
              errors.choice = "Please choose a selection to continue.";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div role="group" aria-labelledby="my-radio-group">
                <label>
                  <Field type="radio" name="choice" value="$5 now" />
                  $5 now
                </label>
                &nbsp;
                <label>
                  <Field
                    type="radio"
                    name="choice"
                    value="$10 two weeks from now"
                  />
                  $10 two weeks from now
                </label>
                <span style={{ color: "red", fontWeight: "bold" }}>
                  <ErrorMessage name="choice" component="div" />
                </span>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default MELForm;
