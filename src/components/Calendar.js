import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentQuestion } from "../features/questionSlice";
import { select, format, scaleLinear } from "d3";
import { useD3 } from "../hooks/useD3";
var calendarMatrix = require("calendar-matrix");

function Calendar() {
  const q = useSelector(selectCurrentQuestion);

  const monthDays = calendarMatrix(q.dateEarlier);
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
  const month = q.dateEarlier.getMonth();
  const monthName = monthNames[month];

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;

  const tableSquareSizeIn = Math.min(
    q.heightIn / monthDays.length,
    q.widthIn / 7
  );

  const tableSquareSizePx = Math.round(tableSquareSizeIn * dpi);

  //   const dateMonth = question.dateEarlier.getMonth();
  //   const dateYear = question.dateEarlier.getFullYear();

  return (
    <div>
      <h2>{monthName}</h2>
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3((table) => {
          table.html(
            `<thead>
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

          const calendar = select("#calendar");
          const tbody = calendar.select("#calendarBody");
          const rows = tbody.selectAll("tbody").data(monthDays).join("tr");

          const earlierDay = q.dateEarlier.getDate();
          const laterDay = q.dateLater.getDate();

          const yRange = [0, q.maxAmount];

          rows
            .selectAll("td")
            .data((d) => d)
            .join((enter) => {
              enter
                .append("td")
                .attr("id", (d) =>
                  d === earlierDay
                    ? "day-earlier-amount"
                    : d === laterDay
                    ? "day-later-amount"
                    : "day-" + d
                )
                .attr("class", function (d) {
                  return d > 0 ? "day" : "dayEmpty";
                })
                .attr("width", () => tableSquareSizePx)
                .attr("height", () => tableSquareSizePx)
                .each(function (d) {
                  const divText = select(this)
                    .append("div")
                    .attr("style", "text-align: center")
                    .attr("width", tableSquareSizePx);
                  divText
                    .append("div")
                    .attr("style", "float: right")
                    .text((d) => (d > 0 ? d : ""));
                  if (d === earlierDay || d === laterDay) {
                    var barHeight = null;
                    divText
                      .append("div")
                      .attr("style", "text-align: center; font-weight: bold;")
                      .text(() =>
                        format("$,.0f")(
                          d === earlierDay ? q.amountEarlier : q.amountLater
                        )
                      );
                    barHeight =
                      tableSquareSizePx -
                      select(this).select("div").node().offsetHeight;
                    const y = scaleLinear()
                      .domain(yRange)
                      .range([barHeight, 0]);
                    const svg = select(this)
                      .append("svg")
                      .attr("id", (d) => {
                        d === earlierDay ? "earlier-bar" : "later-bar";
                      })
                      .attr("x", "0 ")
                      .attr("y", "0")
                      .attr("width", () => tableSquareSizePx)
                      .attr("height", () => barHeight)
                      .attr("style", "text-align: left");
                    svg
                      .append("line")
                      .attr("x1", "0")
                      .attr("y1", y(q.maxAmount))
                      .attr("x2", tableSquareSizePx)
                      .attr("y2", y(q.maxAmount))
                      .attr("style", "stroke:black;stroke-width:1");
                    svg
                      .append("rect")
                      .attr("fill", "steelblue")
                      .attr("class", "bar")
                      .attr("x", "0")
                      .attr("y", () =>
                        y(d === earlierDay ? q.amountEarlier : q.amountLater)
                      )
                      .attr("width", () => {
                        tableSquareSizePx;
                      })
                      .attr("height", () => {
                        const y0 = y(0);
                        const yamt = y(
                          d === earlierDay ? q.amountEarlier : q.amountLater
                        );
                        return y0 - yamt;
                      })
                      .attr("width", tableSquareSizePx);
                  }
                });
            });
        }, q)}
      ></table>
    </div>
  );
}

export default Calendar;
