import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { select, format, scaleLinear } from "d3";
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

var calendarMatrix = require("calendar-matrix");

function Calendar() {
  const dispatch = useDispatch();
  const q = useSelector(selectCurrentQuestion);
  const status = useSelector(fetchStatus);

  const monthDays = calendarMatrix(q.dateEarlier.toJSDate());
  const month = q.dateEarlier.month;
  const monthName = monthNames[month - 1];
  const earlierDay = q.dateEarlier.day;
  const laterDay = q.dateLater.day;
  const year = q.dateLater.year;
  const lastDayOfMonth = Math.max(...[].concat(...monthDays));
  const firstDaysOfWeek = monthDays.reduce((acc, cv) => {
    return acc.concat(cv[0]);
  }, []);

  const dpi = window.devicePixelRatio >= 2 ? 132 : 96;

  const tableSquareSizeIn = Math.min(
    q.heightIn / monthDays.length,
    q.widthIn / 7
  );

  const tableSquareSizePx = Math.round(tableSquareSizeIn * dpi);

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

            const yRange = [0, q.maxAmount];
            const y = scaleLinear()
              .domain(yRange)
              .range([tableSquareSizePx, 0]);

            const drawBar = (parent, idPrefix, day, amount) => {
              const svg = parent
                .append("svg")
                .data([day], (d) => d)
                .attr("id", () => `${idPrefix}-svg`)
                .attr("x", "0")
                .attr("y", "0")
                .attr("width", () => tableSquareSizePx)
                .attr("height", () => tableSquareSizePx)
                .attr("style", "text-align: center");
              svg
                .append("rect")
                .data([day], (d) => d)
                .attr("id", () => `${idPrefix}-rect`)
                .attr("fill", "black")
                .attr("x", "0")
                .attr("y", () => y(amount))
                .attr("width", tableSquareSizePx)
                .attr("height", () => {
                  const y0 = y(0);
                  const yamt = y(amount);
                  return y0 - yamt;
                });
              svg
                .append("text")
                .data([day], (d) => d)
                .attr("id", () => `${idPrefix}-text`)
                .attr("x", () => tableSquareSizePx / 2)
                .attr("y", () => y(amount))
                .attr("style", "font-size:large;")
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "hanging")
                .text(() => format("$,.0f")(amount));
            };

            const updateBar = (parent, idPrefix, amount) => {
              parent
                .select(`#${idPrefix}-text`)
                .attr("y", () => y(amount))
                .text(() => format("$,.0f")(amount));
              parent
                .select(`#${idPrefix}-rect`)
                .attr("y", () => y(amount))
                .attr("height", () => {
                  const y0 = y(0);
                  const yamt = y(amount);
                  return y0 - yamt;
                });
            };

            const drawWord = (parent, idPrefix, day, amount) => {
              parent
                .append("div")
                .data([day], (d) => d)
                .attr("id", `${idPrefix}-div`)
                .attr("class", "amount-div")
                .attr(
                  "style",
                  "text-align: center; font-weight: bold; font-size: large;"
                )
                .text(format("$,.0f")(amount));
            };

            const updateWord = (parent, idPrefix, amount) => {
              parent.select(`${idPrefix}-div`).text(format("$,.0f")(amount));
            };

            tbody
              .selectAll(".day-rows")
              .data(monthDays, (d) => d)
              .join("tr")
              .attr("class", "day-rows")
              .selectAll(".day-cells")
              .data(
                (d) => d,
                (d) => d
              )
              .join(
                (enter) => {
                  enter
                    .append("td")
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
                    .each(function (d) {
                      const td = select(this);
                      if (d >= 0) {
                        td.append("div")
                          .attr("style", "float: right")
                          .attr("class", "day-div")
                          .text((d) => {
                            if (d <= 0) return "";
                            if (
                              d === 1 ||
                              d === lastDayOfMonth ||
                              firstDaysOfWeek.includes(d)
                            )
                              return d;
                          });
                      }
                      if (d === earlierDay || d === laterDay) {
                        if (q.viewType === ViewType.calendarWord) {
                          drawWord(
                            td,
                            d === earlierDay ? "earlier" : "later",
                            d,
                            d === earlierDay ? q.amountEarlier : q.amountLater
                          );
                        } else if (q.viewType === ViewType.calendarBar) {
                          drawBar(
                            td,
                            d === earlierDay ? "earlier" : "later",
                            d,
                            d === earlierDay ? q.amountEarlier : q.amountLater
                          );
                        }
                      }
                    });
                },
                (update) => {
                  if (q.viewType === ViewType.calendarBar) {
                    updateBar(update, "earlier", q.amountEarlier);
                    updateBar(update, "later", q.amountLater);
                  } else if (q.viewType === ViewType.calendarWord) {
                    updateWord(update, "earlier", q.amountEarlier);
                    updateWord(update, "later", q.amountLater);
                  }
                },
                (exit) => exit.remove()
              );
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
