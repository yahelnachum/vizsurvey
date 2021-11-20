import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentQuestion,
  isLastQuestion,
  selectAllQuestions,
  fetchStatus,
  Answer,
  answer,
  writeAnswers,
  Status,
} from "../features/questionSlice";
//import { Col, Container, Row, Media } from "react-bootstrap";
import { useFormikContext, Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import { csvFormat } from "d3";

export function MELForm() {
  const dispatch = useDispatch();
  const question = useSelector(selectCurrentQuestion);
  const lastQuestion = useSelector(isLastQuestion);
  const allQuestions = useSelector(selectAllQuestions);
  const status = useSelector(fetchStatus);

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

  const result = (
    <Formik
      initialValues={{ choice: Answer.Unitialized }}
      validate={(values) => {
        let errors = {};
        if (!values.choice || values.choice === Answer.Unitialized) {
          errors.choice = "Please choose a selection to continue.";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          dispatch(answer(values.choice));
          if (lastQuestion) {
            const csv = csvFormat(allQuestions);
            dispatch(writeAnswers(csv));
          }
          setSubmitting(false);
          //setFieldValue("choice", "");
          resetForm();
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div
            role="group"
            aria-labelledby="my-radio-group"
            className="radio-choice-label"
          >
            <h3>{questionText()}</h3>
            <br></br>
            <label>
              <Field type="radio" name="choice" value={Answer.Earlier} />
              &nbsp;{question1stPartText()}
            </label>
            <br></br>
            <label>
              <Field type="radio" name="choice" value={Answer.Later} />
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

  if (status === Status.Complete) {
    return <Redirect to="/thankyou" />;
  } else {
    return result;
  }
}

export default MELForm;
