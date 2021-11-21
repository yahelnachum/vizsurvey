import { Container, Row } from "react-bootstrap";
import MELForm from "./MELForm";
import BarChart from "./BarChart";

export function Survey() {
  return (
    <Container fluid="md">
      <Row>
        <MELForm />
      </Row>
      <Row>
        <BarChart
          width="600"
          height="600"
          top_margin="20"
          right_margin="30"
          bottom_margin="30"
          left_margin="80"
        />
      </Row>
    </Container>
  );
}

export default Survey;
