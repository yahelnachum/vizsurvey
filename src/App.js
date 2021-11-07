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
  return <div>Survey instructions go here goes here.</div>;
};

const NotFound = () => {
  return <div>The page you are looking for can't be found.</div>;
};
