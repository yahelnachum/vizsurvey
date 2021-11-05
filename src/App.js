import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

import "./App.css";
import Survey from "./components/Survey";
import Instructions from "./components/Instructions";

import { useSelector, useDispatch } from "react-redux";

import { fetchQuestions, fetchStatus } from "./features/questionSlice";

//import useFetch from "./hooks/useFetch";

//   // declares our component state variable as requested and sets it's initial value to postsUrl
//   // setRequested is the setter method to update the value of the state variable requested
//   // we declare each state var separately and not in an oject like in class based components.
//   const [requested, setRequested] = useState(postsUrl);
//   const data = useFetch(requested);

// // the process is to:
// // 1. Define mapStateToProps which reurns the data (props) for our component from the global store state.
// // 2. Define mapDispatchToProps which creates the dispatch functions which populate the payload data and that will be passed to our component through props so the component can use them.
// // 3. Call connect to wire the above to the component.
// // 4. Connect returns a redux store wired component that we use.
// // 5. Implement the reducer function and pass it in as a parmeter when creating the global store
// // 6. Create the global store in index.js passing in the reducer funtions.  We never access the global store directly.  We do it through mapStateToProps and mapDispatchToProps

// // returns data from the current global state to the component for use.
// function mapStateToProps(state) {
//   return {
//     currentQuestion: state.currentQuestion,
//     answers: state.answers,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     onSubmitAnswer: (, productPrice) =>
//       dispatch({
//         type: "submitAnswer",
//         answer: {

//         },
//       }),
//     onDeleteProduct: (productData) =>
//       dispatch({
//         type: "deleteProduct",
//         productData: productData,
//       }),
//   };
// }
// var connectedComponent = connect(mapStateToProps, mapDispatchToProps)(Cart);

// export default connectedComponent;

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
              <Nav.Item href="/">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item href="/instructions">
                <Nav.Link as={Link} to="/instructions">
                  Instructions
                </Nav.Link>
              </Nav.Item>
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
          <Route path="/instructions" component={Instructions} />
          <Route path="/survey" component={Survey} />
          <Route path="/*" component={NotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

const Home = () => {
  return <div>Home</div>;
};

const NotFound = () => {
  return <div>The page you are looking for can't be found.</div>;
};
