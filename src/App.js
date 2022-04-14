import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { v4 as uuidv4 } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import "./App.css";
import Survey from "./components/Survey";
import { QueryParam } from "./components/QueryParam";
import {
  fetchQuestions,
  loadAllTreatments,
  fetchAllTreatmentsStatus,
  fetchAllTreatments,
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
import { StatusType } from "./features/StatusType";

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
            <Route path="/vizsurvey/post-survey" component={PostSurvey} />
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
  const dispatch = useDispatch();
  dispatch(loadAllTreatments());
  const status = useSelector(fetchAllTreatmentsStatus);
  const allTreatments = useSelector(fetchAllTreatments);

  function testLinks() {
    return (
      <div>
        <p>
          This page will not be available when deployed in production since the
          participants will be provided a link with the treatment id in the URL.
        </p>
        {status === StatusType.Unitialized ? (
          <p>Please wait while all treatments are loaded...</p>
        ) : (
          <p>
            <a href="https://github.com/pcordone/vizsurvey">Github README.md</a>
            <br></br>
            <a href="https://github.com/pcordone">public website</a>
            <br></br>
            <p>
              Click a link below to launch one of the experiments. The
              experimental parameters are not setup yet and are configurable
              through a file. Right now these links give a feel for what each
              type of stimulus is like.
            </p>
            <p>
              <Link id="1" to="/vizsurvey/instructions?treatment_id=1">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 1 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="2" to="/vizsurvey/instructions?treatment_id=2">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 2 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="3" to="/vizsurvey/instructions?treatment_id=3">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 3 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="4" to="/vizsurvey/instructions?treatment_id=4">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 4 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="5" to="/vizsurvey/instructions?treatment_id=5">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 5 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="6" to="/vizsurvey/instructions?treatment_id=6">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 6 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="7" to="/vizsurvey/instructions?treatment_id=7">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 7 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="8" to="/vizsurvey/instructions?treatment_id=8">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 8 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="9" to="/vizsurvey/instructions?treatment_id=9">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 9 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
            <p>
              <Link id="10" to="/vizsurvey/instructions?treatment_id=10">
                {
                  allTreatments.filter(
                    (d) => d.treatmentId === 10 && d.position === 1
                  )[0].comment
                }
              </Link>
            </p>
          </p>
        )}
      </div>
    );
  }

  return (
    <div id="home-text">
      {treatmentId === null ? (
        testLinks()
      ) : (
        <Redirect to={`/vizsurvey/instructions?treatment_id=${treatmentId}`} />
      )}
    </div>
  );
};

const divCenterContentStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "500px",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
};

const divCenterContentStyle1 = {
  position: "absolute",
  left: "50%",
  width: "500px",
  marginRight: "-50%",
  transform: "translate(-50%, 0%)",
};

const buttonCenterContentStyle = {
  position: "absolute",
  left: "50%",
  marginRight: "-50%",
  transform: "translate(-50%, 0%)",
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
    <div id="home-text" style={divCenterContentStyle}>
      <p>
        You will be presented with a choice between two amounts of money to
        recieve, one earlier and one later in time.
      </p>
      <span>
        {(() => {
          switch (treatment.viewType) {
            case ViewType.word:
              return `Click on the radio button that contains the amount you would like to
                    receive.`;
            case ViewType.barchart:
              switch (treatment.interaction) {
                case InteractionType.titration:
                  return `Click on the bar that represents the amount that you would like to
                        receive.  For each click, the amounts will be updated. Continue to
                        click to choose an earlier and later amount.`;
                case InteractionType.drag:
                  return `Drag the bar to an amount that makes choosing the earlier option
                        equal to the later option. Note that these amounts do not have to
                        be literally equal dollar amounts (e.g. you would rather have $10
                        today than even $20 a year from now).`;
                case InteractionType.none:
                  return `Click on the bar graph that represents the amount that you would
                        like to choose.`;
                default:
                  return `Can not display <b>specific</b> instructions since the interaction 
                        type was not specified in the experiment setup/`;
              }
            case ViewType.calendarGraph:
              return `Click on the day that contains the amount that you would like to
                    receive.`;
            case ViewType.calendarWord:
              return `Provide calendar word instructions`;
            case ViewType.calendarIcon:
              return `Provide calendar icon grap instructions`;
            default:
              return `Cannot display <b>specific</b> instructions since a treatment has not
                    been selected. Please select a treatment`;
          }
        })()}
      </span>
      <FullScreen handle={handle}>
        <Link to="/vizsurvey/survey">
          <Button
            size="lg"
            onClick={surveyButtonClicked}
            style={buttonCenterContentStyle}
          >
            Start Survey
          </Button>
        </Link>
      </FullScreen>
    </div>
  );
};

import { ChoiceType } from "./features/ChoiceType";
const PostSurvey = () => {
  //const dispatch = useDispatch();
  const questions = [
    {
      question:
        "1. Suppose a 15 year mortgage and a 30 year mortgage have the same Annual Percentage Rate and the same amount borrowed. The total amount repaid will be:",
      options: [
        "Higher for the 15 year mortgage",
        "Higher for the 30 year mortgage",
        "The total amount repaid will be the same",
      ],
    },
    {
      question:
        "2. Suppose you owe £50,000 on a mortgage at an Annual Percentage Rate of 6%. If you didn’t make any payments on this mortgage how much would you owe in total after one year?",
      options: [
        "Less than £50,000",
        "£50,000 – £54,999",
        "£55,000 – £59,999",
        "£60,000 – £64,999",
        "More than £65,000",
      ],
    },
  ];
  return (
    <div id="home-text" style={divCenterContentStyle1}>
      <Formik
        initialValues={{
          choice0: ChoiceType.unitialized,
          choice1: ChoiceType.unitialized,
        }}
        validate={(values) => {
          let errors = {};
          if (!values.choice0 || values.choice0 === ChoiceType.unitialized) {
            errors.choice0 = "Please choose a selection to continue.";
          }
          if (!values.choice1 || values.choice1 === ChoiceType.unitialized) {
            errors.choice1 = "Please choose a selection to continue.";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setTimeout(() => {
            /*dispatch(
              answer({
                choice: values.choice,
                choiceTimestamp: DateTime.now(),
              })
            );*/
            setSubmitting(false);
            resetForm();
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {questions.map(({ question, options }, index) => (
              <div key={index}>
                <div
                  role={["group", index].join("")}
                  aria-labelledby={["my-radio-group", index].join("")}
                  className="radio-choice-label"
                >
                  <p>{question}</p>
                  {options.map((option, index1) => (
                    <div key={index1}>
                      <label>
                        <Field
                          type="radio"
                          name={["choice", index].join("")}
                          value={["value", index1].join("")}
                        />
                        &nbsp;{option}
                      </label>
                      <br />
                    </div>
                  ))}
                  <label>
                    <Field
                      type="radio"
                      name={["choice", index].join("")}
                      value="unsure"
                    />
                    &nbsp;Do not know
                  </label>
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    <ErrorMessage
                      name={["choice", index].join("")}
                      component="div"
                    />
                  </span>
                </div>
                <br />
                <div className="post-survey-separator"></div>
                <br />
              </div>
            ))}
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
            <br />
            <br />
          </Form>
        )}
      </Formik>
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
      <div id="home-text" style={divCenterContentStyle}>
        <p>
          Your answers have been submitted. Thank you for taking this survey!
        </p>
        <p>
          Your unique ID is:&nbsp;
          <input type="text" value={uuid} style={{ width: "340px" }} readOnly />
          &nbsp;
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(uuid);
            }}
          >
            Copy
          </Button>
          . Please go back to Amazon Turk and present this unique ID in the
          form.
        </p>
        <Button
          size="lg"
          onClick={() => {
            handle.enter();
            setTimeout(() => {
              handle.exit();
            }, 400);
          }}
          style={buttonCenterContentStyle}
        >
          Exit Fullscreen
        </Button>
      </div>
    </FullScreen>
  );
};
