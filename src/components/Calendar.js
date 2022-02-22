import React from "react";

import { useSelector } from "react-redux";
import { selectCurrentQuestion } from "../features/questionSlice";

import { useD3 } from "../hooks/useD3";

function Calendar(props) {
  const question = useSelector(selectCurrentQuestion);

  const height = question.vertical_pixels;
  const width = question.horizontal_pixels;
  const margin = {
    top: props.top_margin,
    right: props.right_margin,
    bottom: props.bottom_margin,
    left: props.left_margin,
  };

  const totalHeight = height + parseInt(margin.top) + parseInt(margin.bottom);
  const totalWidth = width + parseInt(margin.left) + parseInt(margin.right);

  const style = {
    height: totalHeight,
    width: totalWidth,
    marginLeft: margin.left + "px",
    marginRight: margin.right + "px",
  };

  return (
    <table
      id="calendar"
      ref={useD3((table) => {
        // October 2017, generated with https://nodei.co/npm/calendar-matrix/
        const month = [
          [1, 2, 3, 4, 5, 6, 7],
          [8, 9, 10, 11, 12, 13, 14],
          [15, 16, 17, 18, 19, 20, 21],
          [22, 23, 24, 25, 26, 27, 28],
          [29, 30, 31, -1, -2, -3, -4],
        ];
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const monthNum = 9;

        const header = table.append("thead");
        const body = table.append("tbody");

        header
          .append("tr")
          .append("td")
          .attr("colspan", 7)
          .style("text-align", "center")
          .append("h2")
          .text(monthNames[monthNum]);

        header
          .append("tr")
          .selectAll("td")
          .data(dayNames)
          .enter()
          .append("td")
          .style("text-align", "center")
          .text(function (d) {
            return d;
          });

        month.forEach(function (week) {
          body
            .append("tr")
            .selectAll("td")
            .data(week)
            .enter()
            .append("td")
            .attr("class", function (d) {
              return d > 0 ? "" : "empty";
            })
            .text(function (d) {
              return d > 0 ? d : "";
            });
        });
      }, null)}
      style={style}
    ></table>
  );
}

export default Calendar;
