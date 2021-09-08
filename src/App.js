import React, { Component } from "react";
import "./App.css";
import BarChart from "./components/BarChart";
import MELForm from "./components/MELForm";

const data = [
  { year: 1980, efficiency: 24.3, sales: 5 },
  { year: 1985, efficiency: 27.6, sales: 0 },
  { year: 1990, efficiency: 28, sales: 0 },
  { year: 1991, efficiency: 28.4, sales: 0 },
  { year: 1992, efficiency: 27.9, sales: 0 },
  { year: 1993, efficiency: 28.4, sales: 0 },
  { year: 1994, efficiency: 28.3, sales: 10 },
];

class App extends Component {
  render() {
    return (
      <div className="App-container">
        <header>Survey Question 1</header>
        <div className="question">
          <MELForm />
          <BarChart data={data} />
        </div>
      </div>
    );
  }
}

export default App;
