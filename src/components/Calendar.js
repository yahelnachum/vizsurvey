import React from "react";

import { useSelector } from "react-redux";
import { selectCurrentQuestion } from "../features/questionSlice";

import { select, format, scaleLinear } from "d3";
import { useD3 } from "../hooks/useD3";
//import { select } from "d3";
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
  //const pixelRatioScale = window.devicePixelRatio >= 2 ? 132 / 96 : 1;

  const tableSquareSizeIn = Math.min(
    q.heightIn / monthDays.length,
    q.widthIn / 7
  );

  const tableSquareSizePx = tableSquareSizeIn * dpi;

  //const tableSizeSquareScaledIn = tableSquareSizeIn * 7 * pixelRatioScale;

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

          // function drawEarlierLaterSVGBar(d) {
          //   if (d === earlierDay || d === laterDay) {
          //     select(this)
          //       .data([d])
          //       .join((enter) =>
          //         enter
          //           .append("svg")
          //           .attr("id", (d) =>
          //             d === earlierDay ? "earlierBar" : "laterBar"
          //           )
          //           .attr("width", "100%")
          //           .attr("height", "100%")
          //           .attr("x", 0)
          //           .attr("y", 0)
          //       );
          //   }
          // }
          rows
            .selectAll("td")
            .data((d) => d)
            .join(
              (enter) => {
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
                    var barHeight = null;
                    if (d === earlierDay) {
                      const divText = select(this)
                        .append("div")
                        .attr("style", "text-align: center");
                      divText
                        .append("div")
                        .attr("style", "float: right")
                        .text((d) => (d > 0 ? d : ""));
                      divText
                        .append("div")
                        .attr("style", "text-align: center")
                        .text(() => format("$,.0f")(q.amountEarlier));
                      barHeight =
                        tableSquareSizePx -
                        select(this).select("div").node().offsetHeight;
                      const y = scaleLinear()
                        .domain(yRange)
                        .range([barHeight, 0]);
                      select(this)
                        .append("svg")
                        .attr("id", "earlier-bar")
                        .attr("x", "0 ")
                        .attr("y", "0")
                        .attr("width", () => tableSquareSizePx)
                        .attr("height", () => barHeight)
                        .attr("style", "text-align: center")
                        .append("rect")
                        .attr("fill", "steelblue")
                        .attr("class", "bar")
                        .attr("x", "0")
                        .attr("y", () => y(q.amountEarlier))
                        .attr("width", () => {
                          tableSquareSizePx;
                        })
                        .attr("height", () => {
                          const y0 = y(0);
                          const yamt = y(q.amountEarlier);
                          return y0 - yamt;
                        })
                        .attr("width", tableSquareSizePx);

                      // <rect
                      //     fill="steelblue"
                      //     class="bar"
                      //     x="0"
                      //     y="55"
                      //     width="110"
                      //     height="93"
                      //   ></rect>
                    } else if (d === laterDay) {
                      select(this).append("svg").attr("id", "earlier-bar");
                    }
                  });
              }

              // .select("td")
              // .join((enter) => {
              //   console.log(enter);
              //   enter
              //     .append("div")
              //     .attr("style", "text-align: right")
              //     .text((d) => (d > 0 ? d : ""));
            );

          // .select("div")
          // .data((d) => d)
          // .join("div")
          // .attr("style", "text-align: right")
          // .text((d) => (d > 0 ? d : ""));

          //.selectAll("[id^=earlier],[id^=later]")
          // tbody
          //   .select("#day-earlier-amount")
          //   .data([q.amountEarlier])
          //   .join((enter) => {
          //     console.log(enter);
          //     enter.append("svg").attr("id", "earlier-bar");
          //   });
        }, q)}
      ></table>
    </div>
  );
}

export default Calendar;
