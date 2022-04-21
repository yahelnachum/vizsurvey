import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { select, format, scaleLinear, drag } from "d3";
import { Formik, Form } from "formik";
import { Button } from "react-bootstrap";
import { DateTime } from "luxon";
import { monthNames } from "./CalendarHelper";
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

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;

  const tableSquareSizeIn = Math.min(
    q.heightIn / monthDays.length,
    q.widthIn / 7
  );

  const tableSquareSizePx = Math.round(tableSquareSizeIn * dpi);

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
                    <td style='text-align: center;'>S</td>
                    <td style='text-align: center;'>M</td>
                    <td style='text-align: center;'>T</td>
                    <td style='text-align: center;'>W</td>
                    <td style='text-align: center;'>T</td>
                    <td style='text-align: center;'>F</td>
                    <td style='text-align: center;'>S</td>
                </tr>
            </thead>
            <tbody id='calendarBody'></tbody>`
            );

            const calendar = select("#calendar");
            const tbody = calendar.select("#calendarBody");
            const rows = tbody.selectAll("tbody").data(monthDays).join("tr");

            const earlierDay = q.dateEarlier.day;
            const laterDay = q.dateLater.day;

            const yRange = [0, q.maxAmount];
            var y = null;
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
                  divText
                    .append("div")
                    .attr("style", "text-align: center; font-weight: bold;")
                    .text(() =>
                      format("$,.0f")(
                        d === earlierDay ? q.amountEarlier : q.amountLater
                      )
                    );
                  if (q.viewType === ViewType.calendarWord) return;
                  const barHeight =
                    tableSquareSizePx -
                    select(this).select("div").node().offsetHeight;
                  y = scaleLinear().domain(yRange).range([barHeight, 0]);
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
            if (q.interaction === InteractionType.drag) {
              var dragHandler = drag().on("drag", function (d) {
                // TODO I need to finish coding the if below to know when they are dragging the correct bar.
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
              dragHandler(calendar.selectAll(".bar"));
            }
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
