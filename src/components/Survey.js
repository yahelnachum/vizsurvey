import { Container, Row, Col } from "react-bootstrap";
import MELForm from "./MELForm";
import BarChart from "./BarChart";
import Calendar from "./Calendar";
import { useSelector } from "react-redux";
import { selectCurrentQuestion, ViewType } from "../features/questionSlice";

export function Survey() {
  const question = useSelector(selectCurrentQuestion);

  return (
    <Container fluid>
      <Row>
        <Col>
          <MELForm />
        </Col>
      </Row>
      <Row>
        <Col>
          {question.view_type === ViewType.barchart ? (
            <BarChart
              top_margin="20"
              right_margin="30"
              bottom_margin="30"
              left_margin="80"
            />
          ) : (
            <Calendar
              top_margin="20"
              right_margin="20"
              bottom_margin="30"
              left_margin="30"
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Survey;
