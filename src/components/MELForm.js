import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentQuestion,
  Answer,
  answer,
} from "../features/questionSlice";
//import { Col, Container, Row, Media } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";

export function MELForm() {
  const dispatch = useDispatch();
  const question = useSelector(selectCurrentQuestion);

  // Absolute money value, delay framing (e.g., $5 today vs. $5 plus an additional $5 in 4 weeks)
  // Relative money value, delay framing (e.g., $5 today vs. $5 plus an additional 100% in 4 weeks)
  // Standard MEL format (e.g., $5 today vs. $10 in 4 weeks)
  // Relative money value, speedup framing (e.g., $10 in 4 weeks vs. $10 minus 50% today)
  // Absolute money value, speedup framing (e.g., $10 in 4 weeks vs. $10 minus $5 today)

  const todayText = (sooner_time) =>
    sooner_time === 0 ? "today" : `in ${sooner_time} weeks`;

  function questionText() {
    return `${question1stPartText()} vs. ${question2ndPartText()}`;
  }

  function question1stPartText() {
    return `$${question.amount_earlier} ${todayText(question.time_earlier)}`;
  }

  function question2ndPartText() {
    return `$${question.amount_later} in ${question.time_later} weeks`;
  }

  return (
    <Formik
      initialValues={{ choice: question.choice }}
      validate={(values) => {
        let errors = {};
        if (!values.choice || values.choice === Answer.Unitialized) {
          errors.choice = "Please choose a selection to continue.";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          dispatch(answer(values.choice));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div role="group" aria-labelledby="my-radio-group">
            <p>{questionText()}</p>
            <label>
              <Field type="radio" name="choice" value="{Answer.Earlier}" />
              &nbsp;{question1stPartText()}
            </label>
            &nbsp;
            <label>
              <Field type="radio" name="choice" value="{Answer.Later}" />
              &nbsp;{question2ndPartText()}
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

export default MELForm;
