import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { v4 as uuidv4 } from "uuid";
import { Button } from "react-bootstrap";
import "./App.css";
import Survey from "./components/Survey";
import { QueryParam } from "./components/QueryParam";
import {
  fetchQuestions,
  selectAllQuestions,
  startSurvey,
  writeAnswers,
  setParticipant,
} from "./features/questionSlice";
import { ViewType } from "./features/ViewType";
import { FileIOAdapter } from "./features/FileIOAdapter";
import {
  fetchTreatmentId,
  fetchCurrentTreatment,
} from "./features/questionSlice";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div className="App">
          <QueryParam />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path={"/instructions"} component={Instructions} />
            <Route path="/survey" component={Survey} />
            <Route path="/thankyou" component={ThankYou} />
            <Route path="/*" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;

const Home = () => {
  const treatmentId = useSelector(fetchTreatmentId);
  return (
    <div id="home-text">
      {treatmentId === null ? (
        <div>
          <p>
            We shouldn not see this page since the participants will be provided
            a link with the treatment id in the URL.
          </p>
          <p>Click a link below to launc one of the experiments.</p>
          <p>
            <a href="https://github.com/pcordone/vizsurvey">Github README.md</a>
          </p>
          <p>
            <a href="https://pcordone.github.io">public website</a>
          </p>
          <p>
            <a
              id="word-no-titration"
              href="vizsurvey/instructions?treatment_id=1"
            >
              Worded with no titration and not draggable.
            </a>
          </p>
          <p>
            <a
              id="barchart-no-titration"
              href="vizsurvey/instructions?treatment_id=2"
            >
              Barchart with no titration and not draggable.
            </a>
          </p>
          <p>
            <a id="barchart-drag" href="vizsurvey/instructions?treatment_id=3">
              Barchart draggable.
            </a>
          </p>
          <p>
            <a id="word-titration" href="vizsurvey/instructions?treatment_id=4">
              Word titration.
            </a>
          </p>
          <p>
            <a
              id="barchart-titration"
              href="vizsurvey/instructions?treatment_id=5"
            >
              Barchart titration.
            </a>
          </p>
        </div>
      ) : (
        <Redirect to={`/instructions?treatment_id=${treatmentId}`} />
      )}
    </div>
  );
};

const Instructions = () => {
  var handle = useFullScreenHandle();
  const dispatch = useDispatch();
  dispatch(fetchQuestions());
  const treatment = useSelector(fetchCurrentTreatment);

  function surveyButtonClicked() {
    dispatch(startSurvey());
    handle.enter;
  }

  return (
    <div id="home-text">
      {treatment.viewType === ViewType.barchart ? (
        <div>
          Click on the bar that represents the amount that you would like to
          receive.
        </div>
      ) : treatment.viewType === ViewType.word ? (
        <div>
          Click on the radio button that contains the amount you would like to
          receive.
        </div>
      ) : treatment.viewType === ViewType.calendar ? (
        <div>
          Click on the day that contains the amount that you would like to
          receive.
        </div>
      ) : (
        <div>
          Cannot display <b>specific</b> instructions since a treatment has not
          been selected. Please select a treatment
        </div>
      )}
      <FullScreen handle={handle}>
        <Link to="/survey">
          <Button size="lg" onClick={surveyButtonClicked}>
            Start Survey
          </Button>
        </Link>
      </FullScreen>
    </div>
  );
};

const ThankYou = () => {
  const dispatch = useDispatch();
  const uuid = uuidv4();
  dispatch(setParticipant(uuid));
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  dispatch(writeAnswers(csv));
  const handle = useFullScreenHandle();

  return (
    <FullScreen handle={handle}>
      <div>
        <p>
          Your answers have been submitted. Thank you for taking this survey!
        </p>
        <p>
          Your unique ID is: {uuid}. Please go back to Amazon Turk and present
          this unique ID in the form.
        </p>
        <Button
          size="lg"
          onClick={() => {
            handle.enter();
            setTimeout(() => {
              handle.exit();
            }, 400);
          }}
        >
          Exit Fullscreen
        </Button>
      </div>
    </FullScreen>
  );
};
