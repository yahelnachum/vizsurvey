import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { select, format, scaleLinear } from "d3";
import { DateTime } from "luxon";
import {
  selectCurrentQuestion,
  fetchStatus,
  setQuestionShownTimestamp,
  answer,
} from "../features/questionSlice";
import { useD3 } from "../hooks/useD3";
import { ChoiceType } from "../features/ChoiceType";
import { StatusType } from "../features/StatusType";
import { InteractionType } from "../features/InteractionType";

var calendarMatrix = require("calendar-matrix");

function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

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

  const result = (
    <div>
      <h2>{monthName}</h2>
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
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
              .join("td")
              .attr("id", (d) =>
                d === earlierDay
                  ? "day-earlier-amount"
                  : d === laterDay
                  ? "day-later-amount"
                  : "day-" + d
              )
              .attr("class", function (d) {
                return d > 0 ? "day" : "day-empty";
              })
              .attr("width", () => tableSquareSizePx)
              .attr("height", () => tableSquareSizePx)
              .attr("style", (d) =>
                d > 0
                  ? "border: 1px solid black; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                  : "border: none;"
              )
              .each(function (d) {
                if (d < 0) return;
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
                  const y = scaleLinear().domain(yRange).range([barHeight, 0]);
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
                    .attr("width", tableSquareSizePx)
                    .on("click", (d) => {
                      if (
                        q.interaction === InteractionType.titration ||
                        q.interaction === InteractionType.none
                      ) {
                        if (d.target.__data__ === earlierDay) {
                          dispatch(
                            answer({
                              choice: ChoiceType.earlier,
                              choiceTimestamp: DateTime.now(),
                            })
                          );
                        } else if (d.target.__data__ === laterDay) {
                          dispatch(
                            answer({
                              choice: ChoiceType.later,
                              choiceTimestamp: DateTime.now(),
                            })
                          );
                        }
                      }
                    });
                }
              });
          },
          [q]
        )}
      ></table>
    </div>
  );

  if (status === StatusType.Complete) {
    return <Redirect to="/vizsurvey/thankyou" />;
  } else {
    dispatch(setQuestionShownTimestamp(Date.now()));
    return result;
  }
}

export default Calendar;
