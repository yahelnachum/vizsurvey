import React, { Component } from "react";
import { Col, Container, Row, Media } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";

class MELForm extends Component {
  constructor(props) {
    super(props);

    const { question } = props;
    this.state = {
      questionText: question.questionText,
      optionSooner: question.optionSooner,
      optionLater: question.optionLater,
    };
  }

  render() {
    return (
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
                <Field
                  type="radio"
                  name="choice"
                  value="{this.state.optionSooner}"
                />
                {this.state.optionSooner}
              </label>
              &nbsp;
              <label>
                <Field
                  type="radio"
                  name="choice"
                  value="{this.state.optionLater}"
                />
                {this.state.questionText}
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
    );
  }
}

export default MELForm;
