import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import "./App.css";
import Survey from "./components/Survey";
import { QueryParam } from "./components/QueryParam";
import { selectAllQuestions, writeAnswers } from "./features/questionSlice";
import { Footer } from "./footer";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const App = () => {
  const handle = useFullScreenHandle();

  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand as={Link} to="/">
              Viz Survey
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Item href="/survey">
                  <Nav.Link as={Link} to="/survey" onClick={handle.enter}>
                    Survey
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <QueryParam />
          <FullScreen handle={handle}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/survey" component={Survey} />
              <Route path="/thankyou" component={ThankYou} />
              <Route path="/*" component={Home} />
            </Switch>
          </FullScreen>
          <Footer className="footer bg-dark" />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

const Home = () => {
  return (
    <div id="home-text">
      <p>
        General Instructions: You will be presented with two choices about
        receiving money, one earlier and one later in time. Pick the amount that
        you would like to receive.
      </p>
      <p>
        Bar Chart Specific Instructions: Click on the bar that represents the
        amount that you would like to receive.
      </p>
      <p>
        Calendar Specific Instructions: Click on the day that contains the
        amount that you would like to receive.
      </p>
      <p>
        <a
          href="
        https://github.com/pcordone/vizsurvey"
        >
          Github README.md
        </a>
      </p>
      <p>
        <a id="getQuestionSet" href="vizsurvey?treatment_id=2">
          relative treatment_id=2
        </a>
      </p>
      <p>
        <a href="https://pcordone.github.io">public website</a>
      </p>
    </div>
  );
};

function convertToCSV(answers) {
  const header = [
    "treatment_id,position,amount_earlier,time_earlier,amount_later,time_later,choice,answer_time,participant_id",
  ];
  const rows = answers.map(
    (a) =>
      `${a.treatmentId}, ${a.position}, ${a.amountEarlier}, ${a.timeEarlier}, ${a.amountLater}, ${a.timeLater}, ${a.choice}, ${a.answerTime}, ${a.participantId}`
  );
  return header.concat(rows).join("\n");
}

const ThankYou = () => {
  const dispatch = useDispatch();
  const allQuestions = useSelector(selectAllQuestions);
  const csv = convertToCSV(allQuestions);
  console.log(csv);
  dispatch(writeAnswers(csv));

  const uuid = Date.now();
  // TODO: YAHEL: base64 encode this so its easier to type
  return (
    <div>
      <p>Your answers have been submitted. Thank you for taking this survey!</p>
      <p>
        Your unique ID is: {uuid}. Please go back to Amazon Turk and present
        this unique ID in the form.
      </p>
    </div>
  );
};
