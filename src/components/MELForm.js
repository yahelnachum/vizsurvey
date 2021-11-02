import React, { Component } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Condition, Answer, answer } from "../features/questionSlice";
import { Col, Container, Row, Media } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";

export function MELForm(props) {
  // constructor(props) {
  //   super(props);

  //   const { question } = props;
  //   this.state = {
  //     questionText: question.questionText,
  //     optionSooner: question.optionSooner,
  //     optionLater: question.optionLater,
  //   };
  // }

  const question_set = useSelector((state) => state.answer.question_set);
  const position = useSelector((state) => state.answer.position);
  const condition = useSelector((state) => state.answer.condition);
  const first_amount = useSelector((state) => state.answer.first_amount);
  const first_time = useSelector((state) => state.answer.first_time);
  const second_amount = useSelector((state) => state.answer.second_amount);
  const second_time = useSelector((state) => state.answer.second_time);
  const choice = useSelector((state) => state.answer.choice);
  const dispatch = useDispatch();

  // Absolute money value, delay framing (e.g., $5 today vs. $5 plus an additional $5 in 4 weeks)
  // Relative money value, delay framing (e.g., $5 today vs. $5 plus an additional 100% in 4 weeks)
  // Standard MEL format (e.g., $5 today vs. $10 in 4 weeks)
  // Relative money value, speedup framing (e.g., $10 in 4 weeks vs. $10 minus 50% today)
  // Absolute money value, speedup framing (e.g., $10 in 4 weeks vs. $10 minus $5 today)

  const todayText = (sooner_time) =>
    sooner_time === 0 ? "today" : `in ${first_time} weeks`;

  function questionText() {
    return `${question1stPartText()} vs. ${question2ndPartText()}`;
  }

  function question1stPartText() {
    return `$${first_amount} ${todayText(first_time)}`;
  }

  function question2ndPartText() {
    return `$${second_amount} in ${second_time} weeks`;
  }

  return (
    <Formik
      initialValues={{ choice: choice }}
      validate={(values) => {
        let errors = {};
        if (!values.choice || values.choice === Answer.Unitialized) {
          errors.choice = "Please choose a selection to continue.";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          dispatch(answer(values.choice));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div role="group" aria-labelledby="my-radio-group">
            <label>
              <Field type="radio" name="choice" value="{Answer.Earlier}" />
              {question1stPartText()}
            </label>
            &nbsp;
            <label>
              <Field type="radio" name="choice" value="{Answer.Later}" />
              {question2ndPartText()}
            </label>
            {questionText()}
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
