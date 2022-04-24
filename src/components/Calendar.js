import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import * as d3 from "d3";
import { select, format, scaleLinear, drag } from "d3";
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

  const earlierDay = q.dateEarlier.day;
  const laterDay = q.dateLater.day;
  const monthDaysAmounts = monthDays.map((week) =>
    week.map((day) => {
      return {
        day: day,
        amount:
          day === earlierDay
            ? q.amountEarlier
            : day === laterDay
            ? q.amountLater
            : null,
        type:
          day === earlierDay
            ? VariableType.earlierAmount
            : day === laterDay
            ? VariableType.laterAmount
            : VariableType.none,
      };
    })
  );

  const year = q.dateLater.year;
  const lastDayOfMonth = Math.max(...[].concat(...monthDays));
  const firstDaysOfWeek = monthDaysAmounts.reduce((acc, cv) => {
    return acc.concat(cv[0].day);
  }, []);

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;

  const tableSquareSizeIn = Math.min(
    q.heightIn / monthDaysAmounts.length,
    q.widthIn / 7
  );

  const tableSquareSizePx = Math.round(tableSquareSizeIn * dpi);

  var dragAmount = null;

  const result = (
    <div>
      <table
        id="calendar"
        style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
        ref={useD3(
          (table) => {
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
              .text((d) => `${monthNames[q.dateEarlier.month - 1]} ${d}`);
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

            const yRange = [0, q.maxAmount];
            const y = scaleLinear()
              .domain(yRange)
              .range([tableSquareSizePx, 0]);

            const drawBar = (parent, idPrefix, dayAndAmount) => {
              const svg = parent
                .append("svg")
                .data([dayAndAmount], (d) => d.day)
                .attr("id", `${idPrefix}-svg`)
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", tableSquareSizePx)
                .attr("height", tableSquareSizePx)
                .attr("style", "text-align: center");
              svg
                .append("rect")
                .data([dayAndAmount], (d) => d.day)
                .attr("id", `${idPrefix}-rect`)
                .attr("class", "bar")
                .attr("fill", "black")
                .attr("x", "0")
                .attr("y", (d) => y(d.amount))
                .attr("width", tableSquareSizePx)
                .attr("height", (d) => {
                  const y0 = y(0);
                  const yamt = y(d.amount);
                  return y0 - yamt;
                });
              svg
                .append("text")
                .data([dayAndAmount], (d) => d.day)
                .attr("id", `${idPrefix}-text`)
                .attr("x", tableSquareSizePx / 2)
                .attr("y", (d) => y(d.amount))
                .attr("style", "font-size:large;")
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .text((d) => format("$,.0f")(d.amount));
            };

            const updateBar = (parent, idPrefix) => {
              console.log("in updateBar");
              parent
                .select(`#${idPrefix}-text`)
                .attr("y", (d) => y(d.amount))
                .text((d) => format("$,.0f")(d.amount));
              parent
                .select(`#${idPrefix}-rect`)
                .attr("y", (d) => y(d.amount))
                .attr("height", (d) => {
                  console.log(`d.amount=${d.amount}`);
                  const y0 = y(0);
                  const yamt = y(d.amount);
                  return y0 - yamt;
                });
            };

            const drawWord = (parent, idPrefix, dayAndAmount) => {
              parent
                .append("div")
                .data([dayAndAmount], (d) => d.day)
                .attr("id", `${idPrefix}-div`)
                .attr("class", "amount-div")
                .attr(
                  "style",
                  "position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); font-weight: bold; font-size: large;"
                )
                .text(format("$,.0f")(dayAndAmount.amount));
            };

            const updateWord = (parent, idPrefix, dayAndAmount) => {
              const selection = parent.select(`#${idPrefix}-div`);
              selection.text(format("$,.0f")(dayAndAmount.amount));
            };

            tbody
              .selectAll(".day-rows")
              .data(monthDaysAmounts, (d) => d.day)
              .join("tr")
              .attr("class", "day-rows")
              .selectAll(".day-cells")
              .data(
                (d) => d,
                (d) => d.day
              )
              .join(
                (enter) => {
                  enter
                    .append("td")
                    .attr("class", "day-cells")
                    .attr("id", (d) =>
                      d.day === earlierDay
                        ? "earlier-day"
                        : d.day === laterDay
                        ? "later-day"
                        : null
                    )
                    .attr("width", tableSquareSizePx)
                    .attr("height", tableSquareSizePx)
                    .attr("style", (d) =>
                      d.day > 0
                        ? //? "border: 1px solid black; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                          "font-size:x-small; background-color: lightgrey; border: 2px solid white; border-radius: 5px; text-align: right; vertical-align: top; position: relative; overflow: hidden; white-space: nowrap;"
                        : "border: none;"
                    )
                    .on("click", (d) => {
                      if (
                        q.interaction === InteractionType.titration ||
                        q.interaction === InteractionType.none
                      ) {
                        if (d.target.__data__.day === earlierDay) {
                          dispatch(
                            answer({
                              choice: ChoiceType.earlier,
                              choiceTimestamp: DateTime.now(),
                            })
                          );
                        } else if (d.target.__data__.day === laterDay) {
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
                      const td = select(this);
                      if (d.day >= 0) {
                        td.append("div")
                          .attr("style", "float: right")
                          .attr("class", "day-div")
                          .text((d) => {
                            if (d.day <= 0) return "";
                            if (
                              d.day === 1 ||
                              d.day === lastDayOfMonth ||
                              firstDaysOfWeek.includes(d.day)
                            )
                              return d.day;
                          });
                      }
                      if (d.day === earlierDay || d.day === laterDay) {
                        if (q.viewType === ViewType.calendarWord) {
                          drawWord(
                            td,
                            d.day === earlierDay ? "earlier" : "later",
                            d
                          );
                        } else if (q.viewType === ViewType.calendarBar) {
                          drawBar(
                            td,
                            d.day === earlierDay ? "earlier" : "later",
                            d
                          );
                        }
                      }
                    });
                },
                (update) => {
                  console.log("In update");
                  if (q.viewType === ViewType.calendarBar) {
                    updateBar(update, "earlier");
                    updateBar(update, "later");
                  } else if (q.viewType === ViewType.calendarWord) {
                    updateWord(update, "earlier");
                    updateWord(update, "later");
                  }
                },
                (exit) => exit.remove()
              );
            if (q.interaction === InteractionType.drag) {
              var dragHandler = drag().on("drag", function (d) {
                if (d.subject.type === q.variableAmount) {
                  const newAmount = y.invert(d.y);
                  if (newAmount > q.maxAmount) return;
                  d.subject.amount = newAmount;
                  select(this)
                    .attr("y", d.y)
                    .attr("height", y(0) - d.y);
                  dragAmount = d.subject;
                  d3.select(
                    `#${
                      d.type === VariableType.earlierAmount
                        ? "earlier"
                        : "later"
                    }-text`
                  )
                    .attr("y", (d) => y(d.amount))
                    .text(() => format("$,.0f")(dragAmount.amount));
                }
              });
              dragHandler(table.selectAll(".bar"));
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
                  choice: q.variableAmount,
                  choiceTimestamp: DateTime.now(),
                  dragAmount: dragAmount.amount,
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
