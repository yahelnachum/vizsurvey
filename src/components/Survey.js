import React, { useEffect } from "react";
import { Col, Container, Row, Media } from "react-bootstrap";
import MELForm from "./MELForm";
import BarChart from "./BarChart";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchQuestions,
  selectCurrentQuestion,
  questionsFetchStatus,
} from "../features/questionSlice";

export function Survey() {
  const dispatch = useDispatch();
  const currentQuestion = useSelector(selectCurrentQuestion);

  return (
    <Container fluid="md">
      <Row>
        <Col>
          <Container>
            <Row>
              <h3>Question</h3>
            </Row>
            <Row>&nbsp;</Row>
            <Row>
              <MELForm />
            </Row>
          </Container>
        </Col>
        <Col>
          <BarChart />
        </Col>
      </Row>
    </Container>
  );
}

export default Survey;
