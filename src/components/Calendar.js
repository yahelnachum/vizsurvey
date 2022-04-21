/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { select, format, scaleLinear, drag } from "d3";
import * as d3 from "d3";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import { monthNames, dayNames } from "./CalendarHelper";
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
import { ViewType } from "../features/ViewType";
import { VariableType } from "../features/VariableType";

var calendarMatrix = require("calendar-matrix");

function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  const monthDays = calendarMatrix(q.dateEarlier.toJSDate());
  const month = q.dateEarlier.month;
  const monthName = monthNames[month - 1];
  const lastDayOfMonth = Math.max(...[].concat(...monthDays));
  const firstDaysOfWeek = monthDays.reduce((acc, cv) => {
    return acc.concat(cv[0]);
  }, []);

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;

  const tableSquareSizeIn = Math.min(
    q.heightIn / monthDays.length,
    q.widthIn / 7
  );

  //const barWidth = 0.15 * dpi; // bars are 0.1 inch wide

  const tableSquareSizePx = Math.round(tableSquareSizeIn * dpi);

  const result = (
    <div>
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
            const earlierDay = q.dateEarlier.day;
            const laterDay = q.dateLater.day;
            const year = q.dateLater.year;
            // const earlierLaterData = [
            //   { day: earlierDay, amount: q.amountEarlier },
            //   { day: laterDay, amount: q.amountLater },
            // ];

            const thead = table
              .selectAll("#month-head")
              .data([null])
              .join("thead")
              .attr("id", "month-head");

            thead
              .selectAll("#month-head-year-row")
              .data([null])
              .join("tr")
              .attr("id", "month-head-year-row")
              .style("text-align", "center")
              .selectAll("#month-year-cell")
              .data([year])
              .join("td")
              .attr("id", "month-year-cell")
              .attr("style", "font-size: large")
              .attr("colspan", 7)
              .text((d) => `${monthName} ${d}`);
            thead
              .selectAll(".weekday-name-row")
              .data([null])
              .join("tr")
              .attr("class", "weekday-name-row")
              .selectAll(".weekday-name-cell")
              .data(dayNames)
              .join("td")
              .attr("class", "weekday-name-cell")
              .attr("style", "text-align: center;")
              .text((d) => d);

            const tbody = table
              .selectAll("#calendar-body")
              .data([null])
              .join("tbody")
              .attr("id", "calendar-body");

            const td = tbody
              .selectAll(".day-rows")
              .data(monthDays)
              .join("tr")
              .attr("class", "day-rows")
              .selectAll(".day-cells")
              .data(
                (d) => d,
                (d) => d
              )
              .join("td")
              .attr("class", "day-cells")
              .attr("id", (d) =>
                d === earlierDay
                  ? "earlier-day"
                  : d === laterDay
                  ? "later-day"
                  : null
              )
              .attr("width", () => tableSquareSizePx)
              .attr("height", () => tableSquareSizePx)
              .attr("style", (d) =>
                d > 0
                  ? //? "border: 1px solid black; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                    "font-size:x-small; background-color: lightgrey; border: 2px solid white; border-radius: 5px; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                  : "border: none;"
              )
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
              })
              .each(function (monthDay, i, nodes) {
                if (monthDay < 0) return;
                const td = d3.select(this);
                td.selectAll(".day-div")
                  .data([monthDay])
                  .join("div")
                  .attr("style", "float: right")
                  .attr("class", "day-div")
                  .text((d) => {
                    if (d <= 0) return "";
                    // if (
                    //   d === 1 ||
                    //   d === lastDayOfMonth ||
                    //   firstDaysOfWeek.includes(d)
                    // )
                    return d;
                  });
                const amountText = format("$,.0f")(
                  monthDay === earlierDay ? q.amountEarlier : q.amountLater
                );
                if (monthDay === earlierDay || monthDay === laterDay) {
                  if (q.viewType === ViewType.calendarWord) {
                    td.selectAll(".amount-div")
                      .data([monthDay])
                      .join("div")
                      .attr("class", "amount-div")
                      .attr("style", "text-align: center; font-weight: bold;")
                      .text(amountText);
                    return;
                  }
                  //const barHeight =
                  //  tableSquareSizePx -
                  //  select(this).select(".amount-div").node().offsetHeight;
                  const yRange = [0, q.maxAmount];
                  var y = null;
                  y = scaleLinear()
                    .domain(yRange)
                    .range([tableSquareSizePx, 0]);
                  const svg = td
                    .selectAll("svg")
                    .data([monthDay], () => monthDay)
                    .join("svg")
                    .attr("x", "0")
                    .attr("y", "0")
                    .attr("width", () => tableSquareSizePx)
                    .attr("height", () => tableSquareSizePx)
                    .attr("style", "text-align: center");
                  // svg
                  //   .selectAll("line")
                  //   .data([monthDay], () => monthDay)
                  //   .join("line")
                  //   .attr("x1", "0")
                  //   .attr("y1", () => y(q.maxAmount))
                  //   .attr("x2", tableSquareSizePx)
                  //   .attr("y2", () => y(q.maxAmount))
                  //   .attr("style", "stroke:black;stroke-width:1");
                  svg
                    .selectAll("text")
                    .data([monthDay], () => monthDay)
                    .join("text")
                    .attr("x", () => tableSquareSizePx / 2)
                    .attr("y", (d) =>
                      y(
                        monthDay === earlierDay
                          ? q.amountEarlier
                          : q.amountLater
                      )
                    )
                    .attr("style", "font-size:large;")
                    .attr("text-anchor", "middle")
                    .text(amountText);
                  svg
                    .selectAll("rect")
                    .data([monthDay], () => monthDay)
                    .join("rect")
                    .attr("fill", "steelblue")
                    .attr("x", "0")
                    .attr("y", (d) =>
                      y(
                        monthDay === earlierDay
                          ? q.amountEarlier
                          : q.amountLater
                      )
                    )
                    .attr("width", tableSquareSizePx)
                    .attr("height", (d) => {
                      const y0 = y(0);
                      const yamt = y(
                        d === earlierDay ? q.amountEarlier : q.amountLater
                      );
                      return y0 - yamt;
                    });
                  if (q.interaction === InteractionType.drag) {
                    var dragHandler = drag().on("drag", function (d) {
                      if (
                        (d.subject === earlierDay &&
                          q.variableAmount === VariableType.earlierAmount) ||
                        (d.subject === laterDay &&
                          q.variableAmount === VariableType.laterAmount)
                      ) {
                        select(this)
                          .attr("y", d.y)
                          .attr("height", y(0) - d.y);
                      }
                    });
                    dragHandler(table.selectAll(".bar"));
                  }
                }
              });
          },
          [q]
        )}
      ></table>
      {q.interaction === InteractionType.drag ? (
        <Formik
          initialValues={{ choice: ChoiceType.Unitialized }}
          validate={() => {
            let errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              dispatch(
                answer({
                  choice: ChoiceType.earlier,
                  choiceTimestamp: DateTime.now(),
                })
              );
              setSubmitting(false);
              resetForm();
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        ""
      )}
    </div>
  );

  if (status === StatusType.Complete) {
    return <Redirect to="/vizsurvey/post-survey" />;
  } else {
    dispatch(setQuestionShownTimestamp(Date.now()));
    return result;
  }
}

export default Calendar;
