import { Container, Row, Col } from "react-bootstrap";
import MELForm from "./MELForm";
import BarChart from "./BarChart";

export function Survey() {
  return (
    <Container fluid>
      <Row>
        <Col>
          <MELForm />
        </Col>
      </Row>
      <Row>
        <Col>
          <BarChart
            top_margin="20"
            right_margin="30"
            bottom_margin="30"
            left_margin="80"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Survey;
