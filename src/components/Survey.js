import React, { Component } from "react";
import { Col, Container, Row, Media } from "react-bootstrap";
import MELForm from "./MELForm";
import BarChart from "./BarChart";

const questions = [
  {
    questionText: "$5 today vs. $5 plus an additional $5 in 4 weeks)",
    optionSooner: "$5 today",
    soonerAmount: 5,
    soonerTime: 0,
    optionLater: "$5 plus an additional $5 in 4 weeks",
    laterAmount: 10,
    laterTime: 4,
  },
  {
    questionText: "$5 today vs. $5 plus an additional 100% in 4 weeks",
    optionSooner: "$5 today",
    soonerAmount: 5,
    soonerTime: 0,
    optionLater: "$5 plus an additional 100% in 4 weeks",
    laterAmount: 10,
    laterTime: 4,
  },
  {
    questionText: "$5 today vs. $10 in 4 weeks)",
    optionSooner: "$5 today",
    soonerAmount: 5,
    soonerTime: 0,
    optionLater: "$10 in 4 weeks",
    laterAmount: 10,
    laterTime: 4,
  },
  {
    questionText: "$5 today vs. $5 plus an additional $5 in 4 weeks",
    optionSooner: "$5 today",
    soonerAmount: 5,
    soonerTime: 0,
    optionLater: "$5 plus an additional $5 in 4 weeks",
    laterAmount: 10,
    laterTime: 4,
  },
  {
    questionText: "$5 today vs. $5 plus an additional 100% in 4 weeks",
    optionSooner: "$5 today",
    soonerAmount: 5,
    soonerTime: 0,
    optionLater: "$5 plus an additional 100% in 4 weeks",
    laterAmount: 10,
    laterTime: 4,
  },
];

class Survey extends Component {
  question;

  constructor(props) {
    super(props);
    this.question = questions[0];
  }

  render() {
    return (
      <Container>
        <Row>{this.question.questionText}</Row>
        <Row>
          <Col>
            Please choose one option below:
            <MELForm question={this.question} />
          </Col>
          <Col>
            <BarChart question={this.question} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Survey;
