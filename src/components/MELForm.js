import React from "react";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DateTime } from "luxon";
//import { Col, Container, Row, Media } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";

export function MELForm() {
  const dispatch = useDispatch();
  const QandA = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  // Absolute money value, delay framing (e.g., $5 today vs. $5 plus an additional $5 in 4 weeks)
  // Relative money value, delay framing (e.g., $5 today vs. $5 plus an additional 100% in 4 weeks)
  // Standard MEL format (e.g., $5 today vs. $10 in 4 weeks)
  // Relative money value, speedup framing (e.g., $10 in 4 weeks vs. $10 minus 50% today)
  // Absolute money value, speedup framing (e.g., $10 in 4 weeks vs. $10 minus $5 today)

  const todayText = (sooner_time) =>
    sooner_time === 0 ? "today" : `in ${sooner_time} weeks`;

  // function questionText() {
  //   return `${question1stPartText()} vs. ${question2ndPartText()}`;
  // }

  function question1stPartText() {
    return `$${QandA.question.amountEarlier} ${todayText(
      QandA.question.timeEarlier
    )}`;
  }

  function question2ndPartText() {
    return `$${QandA.question.amountLater} in ${QandA.question.timeLater} weeks`;
  }

  const result = (
    <Formik
      initialValues={{ choice: ChoiceType.unitialized }}
      validate={(values) => {
        let errors = {};
        if (!values.choice || values.choice === ChoiceType.unitialized) {
          errors.choice = "Please choose a selection to continue.";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          dispatch(
            answer({
              choice: values.choice,
              choiceTimestamp: DateTime.now(),
            })
          );
          setSubmitting(false);
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
            <label>
              <Field type="radio" name="choice" value={ChoiceType.earlier} />
              &nbsp;{question1stPartText()}
            </label>
            <br></br>
            <label>
              <Field type="radio" name="choice" value={ChoiceType.later} />
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

  if (status === StatusType.Complete) {
    return <Redirect to="/thankyou" />;
  } else {
    dispatch(setQuestionShownTimestamp(Date.now));
    return result;
  }
}

export default MELForm;
