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
import { InteractionType } from "./features/InteractionType";
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
            <Route exact path="/vizsurvey" component={Home} />
            <Route
              exact
              path={"/vizsurvey/instructions"}
              component={Instructions}
            />
            <Route path="/vizsurvey/survey" component={Survey} />
            <Route path="/vizsurvey/thankyou" component={ThankYou} />
            <Route path="/vizsurvey/*" component={Home} />
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
            This page will not be available when deployed in production since
            the participants will be provided a link with the treatment id in
            the URL.
          </p>
          <p>
            <a href="https://github.com/pcordone/vizsurvey">Github README.md</a>
          </p>
          <p>
            <a href="https://github.com/pcordone">public website</a>
          </p>
          <p>
            Click a link below to launch one of the experiments. The
            experimental parameters are not setup yet and are configurable
            through a file. Right now these links give a feel for what each type
            of stimulus is like.
          </p>
          <p>
            <Link
              id="word-no-interaction"
              to="/vizsurvey/instructions?treatment_id=1"
            >
              Worded with no titration and not draggable.
            </Link>
          </p>
          <p>
            <Link
              id="barchart-no-interaction"
              to="/vizsurvey/instructions?treatment_id=2"
            >
              Barchart with no titration and not draggable.
            </Link>
          </p>
          <p>
            <Link
              id="calendar-no-interaction"
              to="/vizsurvey/instructions?treatment_id=3"
            >
              Calendar with no titration and not draggable.
            </Link>
          </p>
          <p>
            <Link
              id="barchart-drag"
              to="/vizsurvey/instructions?treatment_id=4"
            >
              Barchart draggable.
            </Link>
          </p>
          <p>
            <Link
              id="word-titration"
              to="/vizsurvey/instructions?treatment_id=5"
            >
              Word titration.
            </Link>
          </p>
          <p>
            <Link
              id="barchart-titration"
              to="/vizsurvey/instructions?treatment_id=6"
            >
              Barchart titration.
            </Link>
          </p>
        </div>
      ) : (
        <Redirect to={`/vizsurvey/instructions?treatment_id=${treatmentId}`} />
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
    handle.enter();
  }

  return (
    <div id="home-text">
      <span>
        You will be presented with a choice between two amounts of money to
        recieve, one earlier and one later in time.
      </span>{" "}
      {treatment.viewType === ViewType.barchart ? (
        <span>
          {treatment.interaction === InteractionType.titration ? (
            <span>
              Click on the bar that represents the amount that you would like to
              receive.
            </span>
          ) : (
            <span>
              Drag the bar to an amount that makes choosing the earlier option
              equal to the later option. Note that these amounts do not have to
              be literally equal dollar amounts (e.g. you would rather have $10
              today than even $20 a year from now).
            </span>
          )}{" "}
        </span>
      ) : treatment.viewType === ViewType.word ? (
        <span>
          Click on the radio button that contains the amount you would like to
          receive.
        </span>
      ) : treatment.viewType === ViewType.calendar ? (
        <span>
          Click on the day that contains the amount that you would like to
          receive.
        </span>
      ) : (
        <span>
          Cannot display <b>specific</b> instructions since a treatment has not
          been selected. Please select a treatment
        </span>
      )}
      <FullScreen handle={handle}>
        <Link to="/vizsurvey/survey">
          <Button size="lg" onClick={surveyButtonClicked}>
            Start Survey
          </Button>
        </Link>
      </FullScreen>
    </div>
  );
};

const uuid = uuidv4();
const ThankYou = () => {
  const dispatch = useDispatch();
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
