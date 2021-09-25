import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import "./App.css";
import BarChart from "./components/BarChart";
import MELForm from "./components/MELForm";
import Survey from "./components/Survey";
import GitHub from "./GitHub";

// class App extends Component {
//   render() {
//     return (
//       <div className="App-container">
//         <header>Survey Question 1</header>
//         <GitHub />
//         <div className="question">
//           <MELForm />
//           <BarChart data={data} />
//         </div>
//       </div>
//     );
//   }
// }

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Survey />
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
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/github">GitHub</Nav.Link>
                <Nav.Link href="/survey">Survey</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route path="/github/user/:login/:id" component={GitHub} />
            <Route exact path="/" component={Home} />
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
    return <div>Not Found</div>;
  }
}
