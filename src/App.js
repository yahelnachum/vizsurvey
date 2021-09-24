import React, { Component } from "react";
import "./App.css";
import BarChart from "./components/BarChart";
import MELForm from "./components/MELForm";
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
        <GitHub />
      </div>
    );
  }
}

export default App;
