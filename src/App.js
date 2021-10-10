import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import "./App.css";
import Survey from "./components/Survey";
import Instructions from "./components/Instructions";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

export default App;

class Header extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Instructions</Nav.Link>
                <Nav.Link href="/survey">Survey</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route exact path="/" component={Instructions} />
            <Route exact path="/survey" component={Survey} />
            <Route exact path="/*" component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

class Home extends Component {
  render() {
    return <div>Home</div>;
  }
}

class NotFound extends Component {
  render() {
    return <div>The page you are looking for can't be found.</div>;
  }
}
