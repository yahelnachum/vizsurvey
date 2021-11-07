import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

import "./App.css";
import Survey from "./components/Survey";

import { useSelector, useDispatch } from "react-redux";

import { fetchQuestions, fetchStatus } from "./features/questionSlice";

const App = () => {
  const dispatch = useDispatch();
  const status = useSelector(fetchStatus);

  useEffect(() => {
    if (status === "Unitialized") {
      dispatch(fetchQuestions());
    }
  }, [status, dispatch]);

  return (
    <div>
      <Header />
    </div>
  );
};

export default App;

const Header = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand as={Link} to="/">
            Viz Survey
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Item href="/survey">
                <Nav.Link as={Link} to="/survey">
                  Survey
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/survey" component={Survey} />
          <Route path="/*" component={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

const Home = () => {
  return (
    <div>
      <p>*** TODO: Inert the survey instructions for the subject here ***</p>.
      <p>
        *** TODO: Remove these notes below. They are here during development
        only. ***
      </p>
      Some open questions about how to design the visualization are captured
      below. I didn't want to loose track of them, so I put them on this page.
      For information on how the app is designed and works, see{" "}
      <a
        href="
        https://github.com/pcordone/vizsurvey"
      >
        Github README.md
      </a>
      .
      <ol>
        <li>
          Should the time scale be fixed for the question set or not? <br></br>
          Right now, I fixed the time scale across the questions to be from 0 to
          the maximum time for the question set. I thought visually it stopped
          the bar chart from jumping around between the questions and the range
          of time values is not so large that it causes any of the charts to
          become too small along the x axis to render well; however from an
          experimental point of view, I am not sure if it will bias the subject
          in some way and I am not sure this is the best choice. It would be
          easy to drive this as a parameter from the input data for each
          experiment to turn it on and off so that the time scale could be set
          to be consistent across the questions or let it format uniquely for
          each question.
        </li>
        <li>
          Should the y scale range be fixed for the question set? I did not fix
          the y range to the same scale between questions since the variation in
          the amount values is larger and the chart bars with smaller amounts
          would be too compressed in the y axis too small to be meaninful. I did
          fix the number of ticks for the y scale to be the same across
          questions in the set since visually it seems easier to comprehend
          between quesitons; however I need to fix the algorithm since it ends
          up with strange interval values if the largest amount in the qustion
          set is not a divided by 5 to a normal looking v alue. Not sure if that
          is a good decision. Again, this would be easy to paramaterize through
          the input data.
        </li>
      </ol>
    </div>
  );
};

const NotFound = () => {
  return <div>The page you are looking for can't be found.</div>;
};
