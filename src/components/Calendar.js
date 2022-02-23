import React from "react";

import { useSelector } from "react-redux";
import { selectCurrentQuestion } from "../features/questionSlice";

import * as d3 from "d3";
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

        const monthName = monthNames[9];

        table.html(
          `<thead>
                <tr>
                    <td span='7'>
                        <h2 id='currentMonth'></h2>
                    </td>
                </tr>
                <tr>
                    <td style='text-align: center;'>Sunday</td>
                    <td style='text-align: center;'>Monday</td>
                    <td style='text-align: center;'>Tuesday</td>
                    <td style='text-align: center;'>Wednesday</td>
                    <td style='text-align: center;'>Thursday</td>
                    <td style='text-align: center;'>Friday</td>
                    <td style='text-align: center;'>Saturday</td>
                </tr>
            </thead>
            <tbody id='calendarBody'></tbody>`
        );

        const calendar = d3.select("#calendar");

        calendar
          .select("#currentMonth")
          .data([monthName])
          .join("h2")
          .text((d) => d);

        const tbody = calendar.select("#calendarBody");

        const rows = tbody.selectAll("tbody").data(month).join("tr");

        rows
          .selectAll("td")
          .data((d) => d)
          .join("td")
          .attr("class", function (d) {
            return d > 0 ? "" : "empty";
          })
          .text(function (d) {
            return d > 0 ? d : "";
          });
      })}
      style={style}
    ></table>
  );
}

export default Calendar;
